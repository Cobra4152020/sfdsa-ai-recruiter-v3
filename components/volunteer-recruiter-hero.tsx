import { Card, CardContent } from "@/components/ui/card";
import {
  UsersRound,
  Trophy,
  LineChartIcon as ChartLine,
  Mail,
} from "lucide-react";

export function VolunteerRecruiterHero() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Become a Volunteer Recruiter
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mt-4 max-w-3xl mx-auto">
            Help us build the next generation of Deputy Sheriffs. Earn rewards, recognition, 
            and make a direct impact on public safety recruitment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-card rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersRound className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Refer Quality Candidates
            </h3>
            <p className="text-muted-foreground">
              Connect us with motivated individuals who would excel as Deputy Sheriffs
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Share Opportunities
            </h3>
            <p className="text-muted-foreground">
              Spread the word about Deputy Sheriff positions through your networks
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartLine className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Track Your Impact
            </h3>
            <p className="text-muted-foreground">
              Monitor your referrals and see your contribution to public safety
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Earn Recognition
            </h3>
            <p className="text-muted-foreground">
              Receive awards and recognition for your recruitment contributions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
