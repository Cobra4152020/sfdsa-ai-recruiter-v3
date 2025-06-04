import { Card, CardContent } from "@/components/ui/card";

export function ChatWelcomeMessage() {
  return (
    <Card className="bg-[#0A3C1F]/5 border-none">
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-[#0A3C1F]">
            👋 Welcome! I&apos;m Sgt. Ken
          </h3>
          <p className="text-sm text-gray-600">
            I&apos;m here to help you learn about becoming a San Francisco
            Deputy Sheriff. Feel free to ask me any questions about:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Requirements and qualifications</li>
            <li>The application process</li>
            <li>Training and academy life</li>
            <li>Salary and benefits</li>
            <li>Career advancement opportunities</li>
            <li>Day-to-day responsibilities</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
