"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { getClientSideSupabase } from "@/lib/supabase";
// import { Icons } from "@/components/icons"; // Commented out

interface UserAuthFormProps {
  className?: string;
}

const UserAuthFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type UserAuthFormData = z.infer<typeof UserAuthFormSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<UserAuthFormData>({
    resolver: zodResolver(UserAuthFormSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const supabase = getClientSideSupabase();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Check your email",
          description:
            "We sent you a login link. Be sure to check your spam too.",
        });
        // Successfully signed in, redirect to the page that initiated login or to dashboard
        const redirectTo = searchParams?.get("redirect_to"); // Optional chaining added
        router.push(redirectTo || "/user-dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, searchParams]);

  async function onSubmit(data: UserAuthFormData): Promise<void> {
    setIsLoading(true);
    const supabase = getClientSideSupabase();

    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description:
          "We sent you a login link. Be sure to check your spam too.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full">
            {isLoading && <span className="mr-2 h-4 w-4 animate-spin">⏳</span>}
            Sign In with Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
