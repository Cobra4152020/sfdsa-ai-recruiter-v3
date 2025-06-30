"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Users, Award } from "lucide-react";
import { useRouter } from "next/navigation";

export function CTAMidPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/apply");
  };

  const handleLearnMore = () => {
    router.push("/mission-briefing");
  };

  return (
    <section className="w-full py-16 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-card/90 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Take the Next Step?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join hundreds of successful candidates who started their law enforcement career 
                  with the San Francisco Sheriff's Department.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Quick Process</h3>
                  <p className="text-sm text-muted-foreground">Start your application in under 10 minutes</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Expert Support</h3>
                  <p className="text-sm text-muted-foreground">Get guidance throughout the process</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Proven Success</h3>
                  <p className="text-sm text-muted-foreground">95% of graduates find stable careers</p>
                </div>
              </div>

              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleGetStarted}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={handleLearnMore}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3"
                  >
                    Learn About Requirements
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  No commitment required • Free consultation available
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
