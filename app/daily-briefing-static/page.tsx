export default function StaticDailyBriefingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Briefing</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">San Francisco Deputy Sheriff's Daily Briefing</h2>
          <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()} • Department HQ</p>
        </div>

        <div className="prose max-w-none">
          <h3>Today's Focus: Community Safety</h3>
          <p>
            Welcome to today's briefing. We continue our commitment to serving the San Francisco community with
            dedication and integrity.
          </p>

          <h4>Safety Reminders:</h4>
          <ul>
            <li>Always be aware of your surroundings</li>
            <li>Check your equipment before starting your shift</li>
            <li>Report any safety concerns immediately</li>
          </ul>

          <h4>Community Engagement:</h4>
          <p>
            Our presence in the community is vital for building trust and ensuring safety. Remember to engage positively
            with community members and be a visible presence in your assigned areas.
          </p>

          <h4>Department Updates:</h4>
          <p>
            Regular training sessions continue next week. Please ensure all required documentation is completed properly
            and promptly.
          </p>
        </div>
      </div>
    </div>
  )
}
