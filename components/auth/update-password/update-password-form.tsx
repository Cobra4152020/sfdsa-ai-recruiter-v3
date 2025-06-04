"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { getClientSideSupabase } from "@/lib/supabase";

const UpdatePasswordFormSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

type UpdatePasswordFormData = z.infer<typeof UpdatePasswordFormSchema>;

export function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams?.get("redirect_to");

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    const supabase = getClientSideSupabase();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // This event is handled by the dedicated password recovery page
        // No automatic redirect from here to avoid loops if token is invalid
      } else if (event === "USER_UPDATED") {
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated.",
        });
        router.push(redirectTo || "/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, redirectTo]);

  async function onSubmit(data: UpdatePasswordFormData): Promise<void> {
    setIsLoading(true);
    const supabase = getClientSideSupabase();
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    }
    // Success is handled by onAuthStateChange
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Choose a strong password of at least 8 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <Link href={redirectTo || "/login"} className="underline">
          Back to login
        </Link>
      </div>
    </Form>
  );
}
