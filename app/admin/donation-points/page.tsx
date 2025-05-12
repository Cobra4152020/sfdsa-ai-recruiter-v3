"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { type DonationPointRule, getDonationPointRules, updateDonationPointRule } from "@/lib/donation-points-service"

export default function DonationPointsAdmin() {
  const [rules, setRules] = useState<DonationPointRule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    setLoading(true)
    const result = await getDonationPointRules()
    if (result.success && result.rules) {
      setRules(result.rules)
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to load donation point rules",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleRuleChange = (index: number, field: keyof DonationPointRule, value: any) => {
    const updatedRules = [...rules]
    updatedRules[index] = { ...updatedRules[index], [field]: value }
    setRules(updatedRules)
  }

  const saveRule = async (rule: DonationPointRule) => {
    setSaving(true)
    const result = await updateDonationPointRule(rule.id, rule)
    if (result.success) {
      toast({
        title: "Success",
        description: "Donation point rule updated successfully",
      })
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update donation point rule",
        variant: "destructive",
      })
    }
    setSaving(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">Donation Points Configuration</h1>
          <p className="text-gray-600">Manage how points are awarded for donations</p>
        </div>
        <Button onClick={loadRules} variant="outline" className="mt-4 md:mt-0" disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Tabs defaultValue="rules">
        <TabsList className="mb-6">
          <TabsTrigger value="rules">Point Rules</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <div className="grid grid-cols-1 gap-6">
            {rules.map((rule, index) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={(checked) => handleRuleChange(index, "isActive", checked)}
                    />
                  </div>
                  <CardDescription>
                    {rule.maxAmount
                      ? `$${rule.minAmount.toFixed(2)} - $${rule.maxAmount.toFixed(2)}`
                      : `$${rule.minAmount.toFixed(2)}+`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${rule.id}`}>Rule Name</Label>
                      <Input
                        id={`name-${rule.id}`}
                        value={rule.name}
                        onChange={(e) => handleRuleChange(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${rule.id}`}>Description</Label>
                      <Textarea
                        id={`description-${rule.id}`}
                        value={rule.description || ""}
                        onChange={(e) => handleRuleChange(index, "description", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`minAmount-${rule.id}`}>Minimum Amount ($)</Label>
                      <Input
                        id={`minAmount-${rule.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={rule.minAmount}
                        onChange={(e) => handleRuleChange(index, "minAmount", Number.parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`maxAmount-${rule.id}`}>Maximum Amount ($, leave empty for no limit)</Label>
                      <Input
                        id={`maxAmount-${rule.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={rule.maxAmount || ""}
                        onChange={(e) =>
                          handleRuleChange(
                            index,
                            "maxAmount",
                            e.target.value ? Number.parseFloat(e.target.value) : null,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`pointsPerDollar-${rule.id}`}>Points Per Dollar</Label>
                      <Input
                        id={`pointsPerDollar-${rule.id}`}
                        type="number"
                        min="1"
                        value={rule.pointsPerDollar}
                        onChange={(e) =>
                          handleRuleChange(index, "pointsPerDollar", Number.parseInt(e.target.value, 10))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`recurringMultiplier-${rule.id}`}>Recurring Donation Multiplier</Label>
                      <Input
                        id={`recurringMultiplier-${rule.id}`}
                        type="number"
                        min="1"
                        step="0.1"
                        value={rule.recurringMultiplier}
                        onChange={(e) =>
                          handleRuleChange(index, "recurringMultiplier", Number.parseFloat(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => saveRule(rule)} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Donation Campaigns</CardTitle>
              <CardDescription>Create and manage donation campaigns with point multipliers</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Campaign management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Donation Statistics</CardTitle>
              <CardDescription>View statistics about donations and points awarded</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Donation statistics dashboard will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
