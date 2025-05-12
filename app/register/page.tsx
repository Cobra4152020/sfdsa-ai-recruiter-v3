import { RecruitRegistrationForm } from "@/components/recruit-registration-form"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"

export default function RegisterPage() {
  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8">
        <RecruitRegistrationForm />
      </main>
      <ImprovedFooter />
    </>
  )
}
