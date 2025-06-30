"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { enhancedAuthService } from "@/lib/enhanced-auth-service-client";
import { useToast } from "@/components/ui/use-toast";
import type { Provider } from "@supabase/supabase-js";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { AuthResult } from "@/lib/enhanced-auth-service";

interface EnhancedSocialLoginProps {
  onLoginStart?: () => void;
  className?: string;
  showApple?: boolean;
  showLinkedin?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  layout?: "horizontal" | "vertical";
  onSuccess?: (result: AuthResult) => void;
  onError?: (error: unknown) => void;
}

export function EnhancedSocialLogin({
  onLoginStart,
  className = "",
  showApple = false,
  showLinkedin = false,
  size = "md",
  variant = "outline",
  layout = "vertical",
  onSuccess,
  onError,
}: EnhancedSocialLoginProps) {
  const [isLoading, setIsLoading] = useState<Provider | null>(null);
  const { toast } = useToast();

  const handleSocialLogin = async (provider: Provider) => {
    setIsLoading(provider);
    onLoginStart?.();

    try {
      const result =
        await enhancedAuthService.signInWithSocialProvider(provider);

      if (result.success && result.redirectUrl) {
        // Call success callback if provided
        onSuccess?.(result);

        // Redirect to the provider's OAuth page
        window.location.href = result.redirectUrl;
      } else {
        onError?.(result);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: result.message,
        });
        setIsLoading(null);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      onError?.(error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description:
          error instanceof Error ? error.message : "Failed to authenticate",
      });
      setIsLoading(null);
    }
  };

  const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";
  const containerClass =
    layout === "horizontal" ? "flex gap-3 flex-wrap" : "space-y-3";

  return (
    <div className={`${containerClass} ${className}`}>
      <Button
        type="button"
        variant={variant}
        size={buttonSize}
        className="w-full flex items-center justify-center bg-white hover:bg-accent/10 text-black"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading !== null}
      >
        {isLoading === "google" ? (
          <Spinner size="sm" className="mr-2" />
        ) : (
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        {isLoading === "google" ? "Connecting..." : "Continue with Google"}
      </Button>

      <Button
        type="button"
        variant={variant}
        size={buttonSize}
        className="w-full flex items-center justify-center bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
        onClick={() => handleSocialLogin("facebook")}
        disabled={isLoading !== null}
      >
        {isLoading === "facebook" ? (
          <Spinner size="sm" variant="white" className="mr-2" />
        ) : (
          <Facebook className="mr-2 h-4 w-4" />
        )}
        {isLoading === "facebook" ? "Connecting..." : "Continue with Facebook"}
      </Button>

      <Button
        type="button"
        variant={variant}
        size={buttonSize}
        className="w-full flex items-center justify-center bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
        onClick={() => handleSocialLogin("twitter")}
        disabled={isLoading !== null}
      >
        {isLoading === "twitter" ? (
          <Spinner size="sm" variant="white" className="mr-2" />
        ) : (
          <Twitter className="mr-2 h-4 w-4" />
        )}
        {isLoading === "twitter" ? "Connecting..." : "Continue with Twitter"}
      </Button>

      {showLinkedin && (
        <Button
          type="button"
          variant={variant}
          size={buttonSize}
          className="w-full flex items-center justify-center bg-[#0077B5] hover:bg-[#0077B5]/90 text-white"
          onClick={() => handleSocialLogin("linkedin")}
          disabled={isLoading !== null}
        >
          {isLoading === "linkedin" ? (
            <Spinner size="sm" variant="white" className="mr-2" />
          ) : (
            <Linkedin className="mr-2 h-4 w-4" />
          )}
          {isLoading === "linkedin"
            ? "Connecting..."
            : "Continue with LinkedIn"}
        </Button>
      )}

      {showApple && (
        <Button
          type="button"
          variant={variant}
          size={buttonSize}
          className="w-full flex items-center justify-center bg-black hover:bg-black/90 text-white"
          onClick={() => handleSocialLogin("apple")}
          disabled={isLoading !== null}
        >
          {isLoading === "apple" ? (
            <Spinner size="sm" variant="white" className="mr-2" />
          ) : (
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.0001 7.24805C17.6401 6.48805 18.0001 5.48805 18.0001 4.48805C18.0001 4.24805 18.0001 4.00805 17.9601 3.76805C17.0001 3.84805 15.8801 4.40805 15.1201 5.24805C14.5601 5.76805 14.0801 6.76805 14.0801 7.76805C14.0801 8.04805 14.1201 8.32805 14.1201 8.40805C14.2001 8.44805 14.3201 8.44805 14.4401 8.44805C15.2001 8.44805 16.3201 7.92805 17.0001 7.24805Z" />
              <path d="M20.0001 15.2C20.0001 15.24 20.0001 15.28 20.0001 15.32C19.6001 16.36 19.0001 17.28 18.3201 18.16C17.7601 18.84 17.1601 19.52 16.2401 19.52C15.4001 19.52 14.8401 19.04 14.0001 19.04C13.1201 19.04 12.6001 19.52 11.7201 19.52C10.8001 19.52 10.1601 18.8 9.56008 18.12C8.56008 16.96 7.72008 15.2 7.72008 13.52C7.72008 10.88 9.40008 9.4 11.0401 9.4C11.9201 9.4 12.6401 9.92 13.2001 9.92C13.7201 9.92 14.5201 9.36 15.5601 9.36C16.0801 9.36 17.2801 9.4 18.0801 10.56C18.0401 10.6 16.6401 11.44 16.6401 13.28C16.6401 15.44 18.4001 16.16 18.4401 16.16C18.4401 16.16 18.4001 16.24 18.3201 16.36C18.9201 16.76 19.4801 17.4 20.0001 18.28C20.0001 18.28 20.0001 15.24 20.0001 15.2Z" />
            </svg>
          )}
          {isLoading === "apple" ? "Connecting..." : "Continue with Apple"}
        </Button>
      )}
    </div>
  );
}
