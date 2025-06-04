"use client";

import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialMediaLinksProps {
  className?: string;
  showLabels?: boolean;
}

export function SocialMediaLinks({
  className,
  showLabels = false,
}: SocialMediaLinksProps) {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com/sfdsa",
      icon: Facebook,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/sfdsa",
      icon: Twitter,
    },
    {
      name: "Instagram",
      url: "https://instagram.com/sfdsa",
      icon: Instagram,
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/sfdsa",
      icon: Linkedin,
    },
    {
      name: "YouTube",
      url: "https://youtube.com/sfdsa",
      icon: Youtube,
    },
  ];

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#FFD700] transition-colors"
          aria-label={`Follow us on ${link.name}`}
        >
          <div className="flex items-center">
            <link.icon className="h-5 w-5" />
            {showLabels && <span className="ml-2 text-sm">{link.name}</span>}
          </div>
        </a>
      ))}
    </div>
  );
}
