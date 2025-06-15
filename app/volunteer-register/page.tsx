import { VolunteerApplicationForm } from "@/components/volunteer-application-form";

export default function VolunteerRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              Join Our Community of Hero Builders
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-green-100 leading-relaxed">
              Become a volunteer recruiter for the San Francisco Sheriff's Department. 
              Share opportunities, earn rewards, and help build safer communities through gamified recruitment.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
              <span className="bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-full">🎯 Share Job Links</span>
              <span className="bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-full">🏆 Earn Points & Badges</span>
              <span className="bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-full">🌟 Build Communities</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with Beautiful Cards */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How Our Gamified System Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our gamified recruitment program and earn rewards while building safer communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Share & Post Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-8 text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Share & Post</h3>
                <p className="text-gray-600 mb-6">
                  Share recruitment links on Facebook, Instagram, LinkedIn, NextDoor, and community forums. 
                  Each share earns you points based on engagement and reach.
                </p>
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Earn 10-50 Points Per Share
                </div>
              </div>
            </div>

            {/* Play & Engage Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-8 text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-2xl">🎮</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Play & Engage</h3>
                <p className="text-gray-600 mb-6">
                  Participate in trivia about law enforcement, play recruitment games, and complete 
                  challenges to boost your knowledge and earning potential.
                </p>
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Bonus Points & Multipliers
                </div>
              </div>
            </div>

            {/* Earn Rewards Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-100">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative p-8 text-center">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Earn Rewards</h3>
                <p className="text-gray-600 mb-6">
                  Unlock achievement badges, climb leaderboards, and collect exclusive NFTs. 
                  Get recognition for your valuable community service contributions.
                </p>
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Badges, NFTs & Recognition
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Do Section */}
      <section className="py-16 bg-gradient-to-r from-green-100 to-blue-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            What You'll Do as a Volunteer Recruiter
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Share Links</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Post job openings on social media, in community groups, and with your personal network
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reach Candidates</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Help qualified individuals discover career opportunities with the Sheriff's Department
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Build Community</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Strengthen community-police relationships by connecting people with meaningful careers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Earn Recognition</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Get rewarded for your community service with points, badges, and upcoming NFTs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-16 bg-gradient-to-r from-green-100 via-blue-100 to-green-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Your Valiant Community Service Matters
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Every recruitment link you share helps build a stronger, safer community. By connecting 
            talented individuals with meaningful careers in law enforcement, you're directly contributing 
            to public safety and community well-being. Your volunteer service creates a bridge between 
            the community and those who serve and protect it.
          </p>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Submit your volunteer recruiter application below. All applications require admin approval 
              to ensure program quality and prevent unauthorized access.
            </p>
          </div>
          
          <VolunteerApplicationForm />
        </div>
      </section>
    </div>
  );
} 