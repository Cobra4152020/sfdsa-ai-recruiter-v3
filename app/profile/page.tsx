import { ProfileForm } from "@/components/profile/profile-form"

export const metadata = {
  title: "Profile - SFDSA Recruiter",
  description: "Manage your SFDSA Recruiter profile",
}

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="max-w-2xl mx-auto">
        <ProfileForm />
      </div>
    </div>
  )
}
