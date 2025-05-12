import { getPendingVolunteerRecruiters } from "@/app/actions/admin-actions"
import { VolunteerApprovalList } from "@/components/admin/volunteer-approval-list"

export default async function AdminVolunteersPage() {
  const { data: pendingVolunteers, success, error } = await getPendingVolunteerRecruiters()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Volunteer Recruiter Management</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Approval</h2>

        {!success ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">Error loading volunteers: {error}</div>
        ) : pendingVolunteers.length === 0 ? (
          <div className="text-gray-500 italic">No pending volunteer recruiters</div>
        ) : (
          <VolunteerApprovalList volunteers={pendingVolunteers} />
        )}
      </div>
    </div>
  )
}
