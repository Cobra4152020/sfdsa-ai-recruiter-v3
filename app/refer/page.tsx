import { ReferralForm } from "@/components/referrals/referral-form"
import { ReferralStats } from "@/components/referrals/referral-stats"

export const metadata = {
  title: "Refer a Friend - SFDSA Recruiter",
  description: "Refer friends to join the San Francisco Deputy Sheriff's Association",
}

export default function ReferPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Refer a Friend</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <ReferralStats />
        <ReferralForm />
      </div>
    </div>
  )
}
