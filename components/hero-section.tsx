"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const heroImages = [
  "/1-2-1260x720.jpg",
  "/1-3-1-1260x720.jpg",
  "/1-4-1-1260x720.jpg",
  "/2-4-1260x720.jpg",
  "/2-1260x720.jpg",
  "/3-3-1-1260x720.jpg",
  "/3-4-1-1260x720.jpg",
  "/3-4-1260x720.jpg",
  "/4-3-1-1260x720.jpg",
  "/4-4-1-1260x720.jpg",
  "/4-4-1260x720.jpg",
  "/5-3-1-1260x720.jpg",
  "/5-4-1-1260x720.jpg",
  "/5-4-1260x720.jpg",
];

export function HeroSection() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(heroImages[0]);

  useEffect(() => {
    setCurrentImage(heroImages[Math.floor(Math.random() * heroImages.length)]);
  }, []);

  const handleApplyNow = () => {
    router.push("/apply");
  };

  const handleMoreInfo = () => {
    router.push("/mission-briefing");
  };

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    <section className="bg-background dark:bg-background text-foreground pt-20 pb-12 sm:pt-24 sm:pb-16 relative mt-12 md:mt-16">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"hsl(148, 63%, 13%)\" fillOpacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-0 opacity-0 dark:opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"hsl(48, 100%, 65%)\" fillOpacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Join the <span className="text-primary">San Francisco</span>{" "}
            <br className="hidden sm:inline" />
            Sheriff&apos;s Office
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
            Embark on a rewarding career in law enforcement. Protect our
            community with honor and integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-7xl mx-auto">
          {/* Benefits Box */}
          <div className="transform-gpu bg-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:translate-y-[-4px] dark:shadow-[4px_4px_20px_0px_rgba(0,0,0,0.6)] h-[460px] flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <span className="text-primary mr-2" aria-hidden="true"></span>
                <span>Starting Salary: $118,768</span>
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start"><span className="text-primary mr-2 mt-1 flex-shrink-0"></span><span className="text-sm sm:text-base">Full medical, dental, and vision benefits</span></li>
                <li className="flex items-start"><span className="text-primary mr-2 mt-1 flex-shrink-0"></span><span className="text-sm sm:text-base">Paid academy training (23 weeks)</span></li>
                <li className="flex items-start"><span className="text-primary mr-2 mt-1 flex-shrink-0"></span><span className="text-sm sm:text-base">Career advancement opportunities</span></li>
                <li className="flex items-start"><span className="text-primary mr-2 mt-1 flex-shrink-0"></span><span className="text-sm sm:text-base">Retirement plan with pension</span></li>
                <li className="flex items-start"><span className="text-primary mr-2 mt-1 flex-shrink-0"></span><span className="text-sm sm:text-base">Tuition reimbursement program</span></li>
              </ul>
            </div>
            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <Button onClick={handleApplyNow} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg py-4 sm:py-6">Apply Now</Button>
              <Button onClick={handleMoreInfo} variant="outline" className="w-full bg-card hover:bg-card/90 text-primary border-primary font-medium text-base sm:text-lg py-4 sm:py-6">Get More Information</Button>
            </div>
          </div>

          {/* Image Box */}
          <div className="relative rounded-xl overflow-hidden shadow-lg h-[460px]">
            <Image
              src={currentImage}
              alt="San Francisco Deputy Sheriffs"
              fill
              className="object-contain"
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
              <div className="p-4 sm:p-6">
                <p className="text-white text-base sm:text-lg font-medium drop-shadow-lg">
                  Join our diverse team of law enforcement professionals
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <p className="text-muted-foreground mb-2 text-sm sm:text-base">
            Ready to serve your community? Let&apos;s get started!
          </p>
          <button onClick={handleSignUp} className="text-primary hover:text-primary/80 flex items-center justify-center mx-auto text-sm sm:text-base">
            Sign up for updates <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
