import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Repeat, Calendar, Building, User } from "lucide-react"

type Donor = {
  id: string
  name: string
  amount: number
  message?: string
  donation_date: string
  tier: "benefactor" | "champion" | "supporter" | "friend"
  is_recurring: boolean
  organization?: string
}

interface DonorCardProps {
  donor: Donor
  tierColor: string
}

export function DonorCard({ donor, tierColor }: DonorCardProps) {
  // Format the donation date
  const formattedDate = new Date(donor.donation_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })

  // Determine if the donor is an organization based on the name or organization field
  const isOrganization =
    donor.organization !== undefined ||
    donor.name.includes("Foundation") ||
    donor.name.includes("Association") ||
    donor.name.includes("Club") ||
    donor.name.includes("Inc") ||
    donor.name.includes("Corp")

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="h-2" style={{ backgroundColor: tierColor }}></div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate" title={donor.name}>
              {donor.name}
            </h3>

            <div className="flex items-center text-sm text-gray-500 mt-1">
              {isOrganization ? (
                <Building className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              ) : (
                <User className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              )}
              <span className="truncate">{isOrganization ? "Organization" : "Individual"}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-lg">${donor.amount.toLocaleString()}</div>
            <div className="flex items-center justify-end text-sm text-gray-500 mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {donor.is_recurring && (
          <div className="mt-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center w-fit">
              <Repeat className="h-3 w-3 mr-1" />
              Recurring Donor
            </Badge>
          </div>
        )}

        {donor.message && <div className="mt-3 pt-3 border-t text-sm text-gray-600 italic">"{donor.message}"</div>}
      </CardContent>
    </Card>
  )
}
