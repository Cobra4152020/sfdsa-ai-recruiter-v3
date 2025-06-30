import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Building, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Donor = {
  id: string;
  name: string;
  amount: number;
  message?: string;
  donation_date: string;
  tier: "benefactor" | "champion" | "supporter" | "friend";
  is_recurring: boolean;
  organization?: string;
};

interface DonorCardProps {
  donor: Donor;
  tierColor: string;
}

export function DonorCard({ donor, tierColor }: DonorCardProps) {
  const isOrganization =
    donor.name.includes("Foundation") ||
    donor.name.includes("Association") ||
    donor.name.includes("Club") ||
    donor.organization !== undefined;

  const formattedDate = formatDistanceToNow(new Date(donor.donation_date), {
    addSuffix: true,
  });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="h-2" style={{ backgroundColor: tierColor }}></div>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{donor.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              {isOrganization ? (
                <Building className="h-3 w-3" />
              ) : (
                <Heart className="h-3 w-3" />
              )}
              <span>
                {isOrganization ? "Organization" : "Individual"}
                {donor.is_recurring && " • Recurring donor"}
              </span>
            </p>
          </div>
          {donor.is_recurring && (
            <div
              className="p-1 rounded-full"
              style={{ backgroundColor: `${tierColor}20` }}
            >
              <Clock className="h-4 w-4" style={{ color: tierColor }} />
            </div>
          )}
        </div>

        {donor.message && (
          <div className="mt-4">
            <p className="text-sm italic text-gray-600">
              &quot;{donor.message}&quot;
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted py-2 px-6">
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
