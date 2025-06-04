import { DonorCard } from "@/components/donor-card";
import type { ReactNode } from "react";

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

interface DonorTierProps {
  title: string;
  description: string;
  donors: Donor[];
  tierColor: string;
  icon: ReactNode;
  showTitle?: boolean;
}

export function DonorTier({
  title,
  description,
  donors,
  tierColor,
  icon,
  showTitle = true,
}: DonorTierProps) {
  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="p-2 rounded-full"
            style={{ backgroundColor: `${tierColor}20` }}
          >
            <div
              className="text-white p-1 rounded-full"
              style={{ backgroundColor: tierColor }}
            >
              {icon}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {donors.map((donor) => (
          <DonorCard key={donor.id} donor={donor} tierColor={tierColor} />
        ))}
      </div>
    </div>
  );
}
