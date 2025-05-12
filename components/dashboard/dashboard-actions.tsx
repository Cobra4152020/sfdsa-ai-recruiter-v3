"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Award, Share2, Users, BookOpen } from "lucide-react"
import Link from "next/link"

export function DashboardActions() {
  const actions = [
    {
      title: "Daily Briefing",
      description: "Check in with Sgt. Ken's daily briefing",
      icon: <CalendarDays className="h-5 w-5" />,
      href: "/daily-briefing",
      color: "text-blue-600",
    },
    {
      title: "Challenges",
      description: "Complete challenges to earn points and badges",
      icon: <Award className="h-5 w-5" />,
      href: "/challenges",
      color: "text-green-600",
    },
    {
      title: "Refer a Friend",
      description: "Invite someone to join the SFDSA",
      icon: <Users className="h-5 w-5" />,
      href: "/refer",
      color: "text-purple-600",
    },
    {
      title: "Share on Social",
      description: "Share your achievements on social media",
      icon: <Share2 className="h-5 w-5" />,
      href: "/share",
      color: "text-amber-600",
    },
    {
      title: "Training Resources",
      description: "Access training materials and resources",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/resources",
      color: "text-indigo-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Things you can do to earn points and badges</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <Link href={action.href} key={index} className="block">
            <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className={`mr-3 ${action.color}`}>{action.icon}</div>
              <div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/profile">View All Activities</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
