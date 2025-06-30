"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RippleBackground } from "@/components/ui/grid-background";

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
    // Select a random image on each page load/refresh
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    setCurrentImage(heroImages[randomIndex]);
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
    <RippleBackground 
      variant="hero" 
      className="bg-transparent dark:bg-transparent text-foreground pt-20 pb-12 sm:pt-24 sm:pb-16 mt-12 md:mt-16"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Start Your <span className="text-primary">$118K+</span>{" "}
            <br className="hidden sm:inline" />
            Law Enforcement Career
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
            Join the San Francisco Sheriff's Department. Protect our community with honor, 
            integrity, and excellent benefits from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-7xl mx-auto">
          {/* Benefits Box */}
          <div className="transform-gpu bg-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:translate-y-[-4px] dark:shadow-[4px_4px_20px_0px_rgba(0,0,0,0.6)] h-[460px] flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <DollarSign className="text-primary mr-2 h-6 w-6" />
                <span>Starting Salary: $118,768</span>
              </h2>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-primary mb-1"> Now Hiring!</p>
                <p className="text-xs text-muted-foreground">Apply now - next academy class starts soon</p>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start"><CheckCircle className="text-primary mr-3 mt-0.5 flex-shrink-0 h-5 w-5" /><span className="text-sm sm:text-base"><strong>100% Paid Training:</strong> 23-week academy + full salary</span></li>
                <li className="flex items-start"><CheckCircle className="text-primary mr-3 mt-0.5 flex-shrink-0 h-5 w-5" /><span className="text-sm sm:text-base"><strong>Premium Benefits:</strong> Medical, dental, vision included</span></li>
                <li className="flex items-start"><CheckCircle className="text-primary mr-3 mt-0.5 flex-shrink-0 h-5 w-5" /><span className="text-sm sm:text-base"><strong>Secure Future:</strong> Pension + retirement plan (3% @ 58)</span></li>
                <li className="flex items-start"><CheckCircle className="text-primary mr-3 mt-0.5 flex-shrink-0 h-5 w-5" /><span className="text-sm sm:text-base"><strong>Career Growth:</strong> Clear advancement opportunities</span></li>
                <li className="flex items-start"><CheckCircle className="text-primary mr-3 mt-0.5 flex-shrink-0 h-5 w-5" /><span className="text-sm sm:text-base"><strong>Education Support:</strong> Tuition reimbursement program</span></li>
              </ul>
            </div>
            <div className="mt-6 sm:mt-8 space-y-3">
              <Button onClick={handleApplyNow} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg py-4 sm:py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                Apply Now - Start Your Career
              </Button>
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
          <div className="bg-muted/30 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-3 text-sm sm:text-base font-medium">
               Join 600+ Deputies Who Chose Excellence
            </p>
            <div className="flex items-center justify-center gap-6 text-xs sm:text-sm text-muted-foreground mb-4">
              <span>✓ Equal Opportunity Employer</span>
              <span> Veterans Welcomed</span>
              <span> Diverse Team</span>
            </div>
            <Button onClick={handleMoreInfo} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3">
              Learn More About The Process <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </RippleBackground>
  );
}
