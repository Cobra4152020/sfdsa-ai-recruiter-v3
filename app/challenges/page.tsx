import { ChallengesList } from "@/components/challenges/challenges-list"

export const metadata = {
  title: "Challenges - SFDSA Recruiter",
  description: "Complete challenges to earn points and badges",
}

export default function ChallengesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>
      <ChallengesList />
    </div>
  )
}
