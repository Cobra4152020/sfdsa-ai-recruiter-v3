"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeWithProgress } from '@/types/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Facebook, Twitter, Linkedin, Link2, CheckCircle2 } from 'lucide-react'

interface BadgeShareDialogProps {
  badge: BadgeWithProgress | null
  isOpen: boolean
  onClose: () => void
}

export function BadgeShareDialog({
  badge,
  isOpen,
  onClose
}: BadgeShareDialogProps) {
  const [activeTab, setActiveTab] = useState('social')
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [shareLinks, setShareLinks] = useState<Record<string, string>>({})

  useEffect(() => {
    if (typeof window !== 'undefined' && badge) {
      const url = `${window.location.origin}/badges/${badge.id}`
      const text = `I just earned the ${badge.name} badge! 🎉`
      
      setShareUrl(url)
      setShareLinks({
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      })
    }
  }, [badge])

  if (!badge) return null

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Achievement</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="embed">Embed</TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <motion.a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center p-4 rounded-lg bg-[#1DA1F2] text-white hover:opacity-90"
                >
                  <Twitter className="h-6 w-6 mb-2" />
                  <span className="text-sm">Twitter</span>
                </motion.a>

                <motion.a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center p-4 rounded-lg bg-[#1877F2] text-white hover:opacity-90"
                >
                  <Facebook className="h-6 w-6 mb-2" />
                  <span className="text-sm">Facebook</span>
                </motion.a>

                <motion.a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center p-4 rounded-lg bg-[#0A66C2] text-white hover:opacity-90"
                >
                  <Linkedin className="h-6 w-6 mb-2" />
                  <span className="text-sm">LinkedIn</span>
                </motion.a>
              </div>

              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  <AnimatePresence>
                    {copied ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </motion.div>
                    ) : (
                      <Link2 className="h-4 w-4" />
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="embed" className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {`<a href="${shareUrl}" target="_blank">
  <img src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/badge-image/${badge.id}" 
       alt="${badge.name}" 
       width="200" 
       height="200" />
</a>`}
                </pre>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  const embedCode = `<a href="${shareUrl}" target="_blank">
  <img src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/badge-image/${badge.id}" 
       alt="${badge.name}" 
       width="200" 
       height="200" />
</a>`
                  navigator.clipboard.writeText(embedCode)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="w-full"
              >
                {copied ? 'Copied!' : 'Copy Embed Code'}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
} 