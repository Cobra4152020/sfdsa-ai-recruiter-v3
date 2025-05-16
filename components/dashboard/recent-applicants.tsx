import type { Database } from "@/types/supabase-types"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

type Applicant = Database["public"]["Tables"]["applicants"]["Row"]

interface RecentApplicantsProps {
  applicants: Applicant[]
}

export function RecentApplicants({ applicants }: RecentApplicantsProps) {
  if (applicants.length === 0) {
    return <div className="text-center py-4">No recent applicants found</div>
  }

  return (
    <div className="space-y-4">
      {applicants.map((applicant) => (
        <div key={applicant.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">
              {applicant.first_name} {applicant.last_name}
            </h3>
            <Badge variant={getStatusVariant(applicant.application_status)}>
              {applicant.application_status || "New"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">{applicant.email}</p>
          {applicant.phone && <p className="text-sm text-gray-500">{applicant.phone}</p>}
          <div className="flex justify-between items-center mt-3">
            <div className="text-xs text-gray-500">{applicant.zip_code || "No ZIP"}</div>
            <div className="text-xs text-gray-500">
              Applied {formatDistanceToNow(new Date(applicant.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getStatusVariant(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return "secondary"

  switch (status.toLowerCase()) {
    case "pending":
      return "secondary"
    case "approved":
    case "accepted":
      return "default"
    case "rejected":
      return "destructive"
    default:
      return "outline"
  }
}
