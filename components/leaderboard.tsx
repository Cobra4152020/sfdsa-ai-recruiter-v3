"use client";
import { Trophy, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Leaderboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Engagement Champions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#0A3C1F] dark:bg-[#0A3C1F] p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-[#FFD700] mr-2" />
            <h2 className="text-xl font-bold text-white">
              Engagement Champions
            </h2>
          </div>
          <button
            className="text-white hover:text-[#FFD700]"
            aria-label="Information about engagement champions"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 text-left">#</th>
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Interactions</th>
                <th className="py-2 text-left">Badges</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4">1</td>
                <td className="py-4">ken l.</td>
                <td className="py-4"></td>
                <td className="py-4 text-gray-400 italic">No badges yet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Applicants */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#0A3C1F] dark:bg-[#0A3C1F] p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-[#FFD700] mr-2" />
            <h2 className="text-xl font-bold text-white">Top Applicants</h2>
          </div>
          <button
            className="text-white hover:text-[#FFD700]"
            aria-label="Information about top applicants"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-lg mb-6">
            Ready to take the next step? Apply now to join our top applicants!
          </p>
          <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white font-medium">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
