"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award } from "lucide-react";

interface TopRecruit {
  id: number;
  name: string;
  title: string;
  points: number;
  badges: number;
}

// Sample data to use as fallback - reduced scores so real users can easily replace them
const sampleRecruits = [
  {
    id: 1,
    name: "Michael Chen",
    title: "Top Applicant",
    points: 85,
    badges: 2,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Rising Star",
    points: 65,
    badges: 2,
  },
  {
    id: 3,
    name: "David Rodriguez",
    title: "Dedicated Recruit",
    points: 45,
    badges: 1,
  },
  {
    id: 4,
    name: "Jessica Williams",
    title: "Community Leader",
    points: 35,
    badges: 1,
  },
  {
    id: 5,
    name: "Robert Kim",
    title: "Engaged Applicant",
    points: 25,
    badges: 1,
  },
  {
    id: 6,
    name: "Emily Davis",
    title: "Active Participant",
    points: 890,
    badges: 4,
  },
  {
    id: 7,
    name: "James Wilson",
    title: "Promising Recruit",
    points: 850,
    badges: 4,
  },
  {
    id: 8,
    name: "Maria Garcia",
    title: "Dedicated Member",
    points: 820,
    badges: 3,
  },
];

export default function TopRecruitsScroll() {
  const [recruits] = useState<TopRecruit[]>(sampleRecruits);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollDirection, setScrollDirection] = useState<"left" | "right">(
    "left",
  );
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();

  // Get profile image based on user ID
  const getProfileImage = (userId: number) => {
    // Map user IDs to specific profile images
    const imageMap: Record<number, string> = {
      1: "/asian-male-officer-headshot.png",
      2: "/female-law-enforcement-headshot.png",
      3: "/male-law-enforcement-headshot.png",
      4: "/san-francisco-deputy-sheriff.png",
    };

    // Use the mapped image or fall back to a default based on user ID modulo
    return (
      imageMap[userId] ||
      `/placeholder.svg?height=64&width=64&query=profile ${userId}`
    );
  };

  // Auto-scroll animation
  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    let currentDirection = scrollDirection;

    const scroll = () => {
      if (!scrollContainer || isPaused) {
        animationRef.current = requestAnimationFrame(scroll);
        return;
      }

      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      const currentScroll = scrollContainer.scrollLeft;
      const maxScroll = scrollWidth - clientWidth;

      // Change direction when reaching the end
      if (currentScroll >= maxScroll - 1) {
        currentDirection = "right";
        setScrollDirection("right");
      } else if (currentScroll <= 1) {
        currentDirection = "left";
        setScrollDirection("left");
      }

      // Scroll by 1px in the current direction
      scrollContainer.scrollLeft += currentDirection === "left" ? 1 : -1;

      // Continue animation
      animationRef.current = requestAnimationFrame(scroll);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(scroll);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  // Pause scrolling on hover/touch
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <section className="w-full py-8 bg-card text-card-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-card-foreground">Top Recruits</h2>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-4 hide-scrollbar"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseEnter}
          onTouchEnd={handleMouseLeave}
        >
          <div className="flex space-x-4 px-2 md:space-x-6">
            {recruits.map((user, index) => (
              <Card
                key={user.id}
                className="min-w-[280px] md:min-w-[320px] bg-card border border-border"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-muted relative">
                        <Image
                          src={getProfileImage(user.id) || "/placeholder.svg"}
                          alt={user.name || `Recruit #${user.id}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, 128px"
                          loading="lazy"
                          quality={80}
                        />
                      </div>
                      {index < 3 && (
                        <div className="absolute -top-2 -right-2 bg-secondary rounded-full p-1">
                          {index === 0 ? (
                            <Trophy className="h-4 w-4 text-secondary-foreground" />
                          ) : index === 1 ? (
                            <Star className="h-4 w-4 text-secondary-foreground" />
                          ) : (
                            <Award className="h-4 w-4 text-secondary-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">
                        {user.name || `Recruit #${user.id}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.title || "Recruit Applicant"}
                      </p>
                      <div className="flex items-center mt-2">
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                          {user.points || 0} points
                        </Badge>
                        {user.badges && user.badges > 0 && (
                          <Badge className="ml-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                            {user.badges} badges
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Named export for compatibility
export { TopRecruitsScroll };
