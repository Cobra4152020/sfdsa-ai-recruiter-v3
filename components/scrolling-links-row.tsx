"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const links = [
  { text: "G.I. Bill Benefits", href: "/gi-bill" },
  { text: "Discounted Housing", href: "/housing" },
  { text: "Sgt. Ken's Daily Briefing", href: "/daily-briefing" },
  { text: "TikTok Challenge", href: "/tiktok-challenge" },
  // Duplicate links for seamless scrolling
  { text: "G.I. Bill Benefits", href: "/gi-bill" },
  { text: "Discounted Housing", href: "/housing" },
  { text: "Sgt. Ken's Daily Briefing", href: "/daily-briefing" },
  { text: "TikTok Challenge", href: "/tiktok-challenge" },
];

export function ScrollingLinksRow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 20000; // Time to scroll through all items once

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      if (isPaused) {
        startTime = timestamp - (timestamp % duration);
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const progress = ((timestamp - startTime) % duration) / duration;
      const scrollWidth = scrollContainer.scrollWidth / 2;
      const newPosition = progress * scrollWidth;

      scrollContainer.scrollLeft = newPosition;

      // Reset scroll position when reaching halfway to create seamless loop
      if (progress >= 0.5) {
        startTime = timestamp - duration / 2;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused]);

  return (
    <div className="w-full bg-[#F8F5EE] py-2 overflow-hidden">
      <div
        ref={scrollRef}
        className="flex whitespace-nowrap overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex gap-8 px-4">
          {links.map((link, index) => (
            <Link
              key={`${link.href}-${index}`}
              href={link.href}
              className="inline-flex items-center text-[#0A3C1F] hover:text-[#0A3C1F]/80 font-medium transition-colors"
            >
              <span>{link.text}</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
