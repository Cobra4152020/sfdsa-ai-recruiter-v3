"use client";

import { useEffect, useState } from "react";
import { 
  X, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Trophy, 
  MessageSquare, 
  FileText, 
  Gamepad2,
  Gift
} from "lucide-react";
import { useAuthModal } from "@/context/auth-modal-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { getClientSideSupabase } from "@/lib/supabase";

export function UnifiedAuthModal() {
  const { isOpen, modalType, referralCode, closeModal } = useAuthModal();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (modalType === "optin") {
        // Redirect opt-in attempts to apply page
        router.push("/apply");
        closeModal();
        return;
      }
      // Only set to signin if explicitly requested, otherwise default to signup
      setActiveTab(modalType === "signin" ? "signin" : "signup");
      
      // Prevent body scroll on mobile when modal is open
      document.body.classList.add("modal-open");
    } else {
      // Re-enable body scroll when modal closes
      document.body.classList.remove("modal-open");
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, modalType, router, closeModal]);

  if (!mounted) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const awardRegistrationPoints = async (userId: string) => {
    try {
      const response = await fetch("/api/points/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          points: 50,
          action: "registration",
          description: "Welcome bonus for creating account"
        })
      });

      if (response.ok) {
        toast({
          title: "🎉 Welcome Bonus!",
          description: "You earned 50 points for joining our community!",
        });
      }
    } catch (error) {
      console.error("Error awarding registration points:", error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = getClientSideSupabase();
      
      if (!formData.email || !formData.password) {
        throw new Error("Please enter both email and password");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error("Please check your email and click the confirmation link before signing in.");
        }
        throw error;
      }

      if (!data.user) {
        throw new Error("Sign in failed. Please try again.");
      }

      toast({
        title: "🎯 Welcome back!",
        description: "You have successfully signed in. Ready to earn more points?",
      });

      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
      
      closeModal();
      
    } catch (error) {
      console.error("Sign in error:", error);
      
      let errorMessage = "Failed to sign in. Please try again.";
      let errorTitle = "Sign In Failed";
      
      if (error instanceof Error) {
        // Handle specific sign-in errors with helpful messages
        if (error.message.includes('Invalid login credentials')) {
          errorTitle = "Incorrect Credentials";
          errorMessage = "Email or password is incorrect. Please check your details and try again.";
        } else if (error.message.includes('Email not confirmed')) {
          errorTitle = "Email Not Verified";
          errorMessage = "Please check your email and click the verification link before signing in.";
        } else if (error.message.includes('Email address') && error.message.includes('invalid')) {
          errorTitle = "Invalid Email Address";
          errorMessage = "Please enter a valid email address.";
        } else if (error.message.includes('rate limit') || error.message.includes('too many')) {
          errorTitle = "Too Many Attempts";
          errorMessage = "Please wait a moment before trying to sign in again.";
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
          errorTitle = "Connection Error";
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else {
          // Show the actual error message for other errors
          errorMessage = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Starting registration process...");
    
    // Mobile debugging - show alert to confirm function is called
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      console.log("📱 Mobile device detected - registration starting");
    }
    
    setIsLoading(true);

    try {
      // Initialize Supabase client
      console.log("📡 Initializing Supabase client...");
      const supabase = getClientSideSupabase();
      
      if (!supabase) {
        throw new Error("Authentication service is not available. Please try again later.");
      }

      console.log("✅ Supabase client initialized");
      
      // Enhanced validation with detailed logging
      console.log("🔍 Validating form data...", {
        email: !!formData.email,
        password: !!formData.password,
        firstName: !!formData.firstName,
        lastName: !!formData.lastName,
        passwordsMatch: formData.password === formData.confirmPassword
      });

      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      console.log("✅ Form validation passed");
      console.log("📤 Sending registration request to Supabase...");

      const signUpData = {
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
            user_type: 'recruit',
            referral_code: referralCode || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?userType=recruit&redirect=dashboard&welcome=true`,
        },
      };

      console.log("📋 Registration data prepared:", {
        email: signUpData.email,
        hasPassword: !!signUpData.password,
        userData: signUpData.options.data
      });

      const { data, error } = await supabase.auth.signUp(signUpData);

      console.log("📨 Supabase response received:", {
        hasData: !!data,
        hasUser: !!data?.user,
        hasError: !!error,
        userId: data?.user?.id,
        emailConfirmed: !!data?.user?.email_confirmed_at
      });

      if (error) {
        console.error("❌ Supabase auth error:", error);
        throw error;
      }

      if (!data || !data.user) {
        console.error("❌ No user data returned from Supabase");
        throw new Error("Registration failed - no user data received. Please try again.");
      }

      console.log("✅ User created successfully:", data.user.id);

      // Award registration points if user is confirmed
      if (data.user.email_confirmed_at) {
        console.log("🎁 Awarding registration points...");
        await awardRegistrationPoints(data.user.id);
      } else {
        console.log("📧 Email confirmation required, points will be awarded after verification");
      }

      const successMessage = data.user.email_confirmed_at ? 
        "Welcome to the team! You've earned 50 points to get started." :
        "Account created successfully! Please check your email and click the verification link to claim your 50 welcome points.";

      console.log("🎉 Registration completed successfully");
      
      toast({
        title: "🎉 Account Created Successfully!",
        description: successMessage,
        duration: 6000, // Show longer for better UX
      });

      // Clear form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });

      if (data.user.email_confirmed_at) {
        console.log("🔄 Closing modal - user is verified");
        closeModal();
      } else {
        console.log("📧 Switching to sign-in tab - email verification needed");
        setActiveTab("signin");
        
        // Show additional guidance toast after switching tabs
        setTimeout(() => {
          toast({
            title: "📧 Check Your Email",
            description: "We sent you a verification link. After clicking it, sign in here to access your dashboard and claim your points!",
            duration: 8000,
          });
        }, 1000);
      }

    } catch (error) {
      console.error("💥 Registration error:", error);
      
      let errorMessage = "Failed to create account. Please try again.";
      let errorTitle = "Registration Failed";
      
      if (error instanceof Error) {
        console.log("🔍 Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack?.substring(0, 200)
        });
        
        // Handle specific Supabase errors with helpful messages
        if (error.message.includes('User already registered')) {
          errorTitle = "Account Already Exists";
          errorMessage = "An account with this email already exists. Please sign in instead.";
        } else if (error.message.includes('Email address') && error.message.includes('invalid')) {
          errorTitle = "Invalid Email Address";
          errorMessage = "Please use a valid email address with a real domain (like @gmail.com, @outlook.com, etc.). Fake email domains are not allowed.";
        } else if (error.message.includes('Invalid email')) {
          errorTitle = "Invalid Email Format";
          errorMessage = "Please enter a valid email address format (example@domain.com).";
        } else if (error.message.includes('Password should be at least')) {
          errorTitle = "Password Too Short";
          errorMessage = "Password must be at least 6 characters long.";
        } else if (error.message.includes('Database error saving new user')) {
          errorTitle = "Registration System Error";
          errorMessage = "There was a system error creating your account. Please try again in a moment.";
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
          errorTitle = "Connection Error";
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes('rate limit') || error.message.includes('too many')) {
          errorTitle = "Too Many Attempts";
          errorMessage = "Please wait a moment before trying to register again.";
        } else {
          // Show the actual error message for any other errors
          errorMessage = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log("🔄 Registration process completed");
    }
  };

  const features = [
    {
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      title: "Earn Points",
      description: "Get 50 points just for signing up!"
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      title: "Ask Sgt. Ken",
      description: "Chat with our AI recruitment assistant"
    },
    {
      icon: <Gamepad2 className="h-5 w-5 text-purple-500" />,
      title: "Play Games",
      description: "Access all training games and challenges"
    },
    {
      icon: <FileText className="h-5 w-5 text-green-500" />,
      title: "Practice Tests",
      description: "Take preparation tests and earn more points"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:max-w-[500px] p-0 max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-6 flex-shrink-0">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold">
                {activeTab === "signin" ? "Welcome Back!" : "Join Our Team"}
              </DialogTitle>
              <p className="text-primary-foreground/80 mt-1 text-sm">
                {activeTab === "signin" 
                  ? "Sign in to continue your recruitment journey" 
                  : "Start your deputy sheriff career journey"
                }
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-foreground/20"
              onClick={closeModal}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signin-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setActiveTab("signup")}
                  >
                    Don't have an account? <span className="font-medium">Sign up free</span>
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              {/* Welcome bonus card */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Welcome Bonus</p>
                      <p className="text-xs text-green-600">Get 50 points just for signing up!</p>
                    </div>
                    <Badge className="bg-green-600 text-white ml-auto">+50 Points</Badge>
                  </div>
                </CardContent>
              </Card>

              <form onSubmit={(e) => {
                console.log("📝 Form submission triggered!");
                toast({
                  title: "Form Submitted",
                  description: "Registration form submitted successfully",
                });
                handleSignUp(e);
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-sm font-medium">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="first-name"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10"
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="last-name"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="pl-10"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      placeholder="Create a password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      placeholder="Confirm your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account & Earn 50 Points"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-[#0A3C1F] hover:underline"
                    onClick={() => setActiveTab("signin")}
                  >
                    Already have an account? <span className="font-medium">Sign in</span>
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          {/* Features showcase */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-900 mb-3">What you'll get access to:</h3>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  {feature.icon}
                  <div>
                    <p className="text-xs font-medium">{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apply call-to-action */}
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Ready to Apply?</p>
                  <p className="text-xs text-blue-600">Earn 500+ points for submitting your application!</p>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    closeModal();
                    router.push("/apply");
                  }}
                >
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
