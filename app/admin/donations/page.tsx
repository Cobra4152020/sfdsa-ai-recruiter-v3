import type { Metadata } from "next"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerClient } from "@/lib/supabase-server"

export const metadata: Metadata = {
  title: "Donation Management | Admin Dashboard",
  description: "Manage and track donations to the SF Deputy Sheriff's Association.",
}

export default async function DonationsAdminPage() {
  const supabase = createServerClient()

  // Get recent donations
  const { data: recentDonations } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  // Get donation stats
  const { data: stats } = await supabase.rpc("get_donation_stats")

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Donation Management</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_amount || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.total_count || 0} donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.month_amount || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.month_count || 0} donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Recurring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.recurring_amount || 0}/mo</div>
            <p className="text-xs text-muted-foreground">{stats?.recurring_count || 0} subscriptions</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Donation Analytics</CardTitle>
                <CardDescription>Track donation trends over time</CardDescription>
              </div>
              <DateRangePicker />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="amount">
              <TabsList>
                <TabsTrigger value="amount">Amount</TabsTrigger>
                <TabsTrigger value="count">Count</TabsTrigger>
              </TabsList>
              <TabsContent value="amount" className="h-[300px]">
                {/* Chart would go here */}
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Donation amount chart
                </div>
              </TabsContent>
              <TabsContent value="count" className="h-[300px]">
                {/* Chart would go here */}
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Donation count chart
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>View and manage recent donations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Donor</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Type</th>
                </tr>
              </thead>
              <tbody>
                {recentDonations?.map((donation) => (
                  <tr key={donation.id} className="border-b">
                    <td className="py-3 px-4">{new Date(donation.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{donation.donor_name || donation.donor_email || "Anonymous"}</td>
                    <td className="py-3 px-4">${donation.amount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          donation.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : donation.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{donation.subscription_id ? "Recurring" : "One-time"}</td>
                  </tr>
                ))}
                {(!recentDonations || recentDonations.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      No donations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
