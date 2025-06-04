import type { Database } from "@/types/supabase-types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type Briefing = Database["public"]["Tables"]["daily_briefings"]["Row"];

interface DailyBriefingsListProps {
  briefings: Briefing[];
}

export function DailyBriefingsList({ briefings }: DailyBriefingsListProps) {
  if (briefings.length === 0) {
    return <div className="text-center py-4">No daily briefings found</div>;
  }

  return (
    <div className="space-y-4">
      {briefings.map((briefing) => (
        <div key={briefing.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{briefing.title}</h3>
            <Badge variant="outline">{briefing.theme}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(briefing.date), "MMMM d, yyyy")}
          </p>
          <div className="mt-2 text-sm line-clamp-2">
            {/* Strip HTML tags for preview */}
            {briefing.content.replace(/<[^>]*>?/gm, "").substring(0, 100)}...
          </div>
        </div>
      ))}
    </div>
  );
}
