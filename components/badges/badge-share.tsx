import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Twitter, Facebook, Linkedin } from "lucide-react"

interface BadgeShareProps {
  badgeId: string
  badgeName: string
  isUnlocked: boolean
  onShare: () => void
}

export function BadgeShare({ badgeId, badgeName, isUnlocked, onShare }: BadgeShareProps) {
  if (!isUnlocked) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Achievement</CardTitle>
        <CardDescription>Share your achievement with your network</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={onShare} className="w-full gap-2">
            <Share2 className="h-4 w-4" />
            Share Achievement
          </Button>
          
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => window.open(`https://twitter.com/intent/tweet?text=I just earned the ${badgeName} badge!`, '_blank')}>
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}>
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 