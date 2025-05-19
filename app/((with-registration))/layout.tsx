"use client";
import type { ReactNode } from "react";
import { RegistrationProvider } from "@/context/registration-context";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function WithRegistrationLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <RegistrationProvider>
          {children}
        </RegistrationProvider>
      </body>
    </html>
  );
} 