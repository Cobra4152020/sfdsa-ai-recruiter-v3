"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeWithProgress } from '@/types/badge'
import { X, Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check, Award } from 'lucide-react'
import { useEnhancedBadges } from '@/hooks/use-enhanced-badges'

interface BadgeShareDialogProps {
  badge: BadgeWithProgress
  isOpen: boolean
  onClose: () => void
}

const SHARE_REWARD_POINTS = 50
const RECRUITMENT_PHRASES = [
  "🌟 Ready to make a real difference? Join me as a Deputy Sheriff! #LawEnforcementCareers",
  "💪 Looking for a meaningful career? Our Sheriff's Department is hiring! #ServeAndProtect",
  "🚔 Want to be part of something bigger? We're hiring Deputy Sheriffs! #JoinTheForce",
  "🎯 Turn your passion for justice into a career. Now hiring Deputy Sheriffs! #LawEnforcement",
  "⭐ Make your mark in law enforcement. Join our elite team! #DeputySheriff",
  "🛡️ Protect your community, build your future. Now hiring! #LawEnforcementJobs"
]

const PERSUASIVE_MESSAGES = [
  "Competitive salary, excellent benefits, and a chance to serve your community.",
  "Join a department that values integrity, diversity, and professional growth.",
  "Be part of an elite team making a real difference in your community.",
  "Great benefits, career advancement, and meaningful work await you.",
  "Transform lives and protect your community while building a rewarding career.",
  "Join a progressive department that invests in your growth and success."
]

export function BadgeShareDialog({
  badge,
  isOpen,
  onClose
}: BadgeShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [shareRewardShown, setShareRewardShown] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const { addXP } = useEnhancedBadges()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/badges/${badge.id}`)
    }
  }, [badge.id])

  const randomPhraseIndex = Math.floor(Math.random() * RECRUITMENT_PHRASES.length)
  const randomMessageIndex = Math.floor(Math.random() * PERSUASIVE_MESSAGES.length)

  const shareText = `${RECRUITMENT_PHRASES[randomPhraseIndex]}\n\nI just earned the ${badge.name} badge! 🎉\n${PERSUASIVE_MESSAGES[randomMessageIndex]}\n\nJoin me at:`

  const socialShareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin') => {
    if (typeof window === 'undefined') return

    // Open share dialog
    window.open(socialShareUrls[platform], '_blank', 'width=600,height=400')
    
    // Award points if not already awarded
    if (!shareRewardShown) {
      try {
        await addXP(SHARE_REWARD_POINTS)
        setShareRewardShown(true)
      } catch (err) {
        console.error('Failed to award share points:', err)
      }
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      
      // Award points for copying if not already awarded
      if (!shareRewardShown) {
        await addXP(SHARE_REWARD_POINTS)
        setShareRewardShown(true)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Share Reward Banner */}
            {shareRewardShown && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                <span>+{SHARE_REWARD_POINTS} points earned!</span>
              </motion.div>
            )}

            {/* Badge Preview */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                {badge.imageUrl ? (
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="w-12 h-12"
                  />
                ) : (
                  <Share2 className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{badge.name}</h3>
                <p className="text-sm text-gray-500">{badge.description}</p>
              </div>
            </div>

            {/* Share Message Preview */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Share preview</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">{shareText}</p>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Share and earn {SHARE_REWARD_POINTS} points!</h4>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#1DA1F2] text-white rounded-lg hover:bg-opacity-90"
                >
                  <Twitter className="h-5 w-5" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#1877F2] text-white rounded-lg hover:bg-opacity-90"
                >
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#0A66C2] text-white rounded-lg hover:bg-opacity-90"
                >
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn</span>
                </button>
              </div>

              {/* Copy Link */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Or copy link</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  {badge.name} has been shared {Math.floor(Math.random() * 100)} times
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 