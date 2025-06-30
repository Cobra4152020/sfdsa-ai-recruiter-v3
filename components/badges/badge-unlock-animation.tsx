import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Badge {
  id: string;
  name: string;
  description: string;
  points: number;
}

interface BadgeUnlockAnimationProps {
  badge: Badge;
  onComplete: () => void;
}

export function BadgeUnlockAnimation({
  badge,
  onComplete,
}: BadgeUnlockAnimationProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onComplete}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Badge Unlocked!
            </h2>
            <p className="text-gray-600 mb-4">{badge.name}</p>
            <div className="flex items-center justify-center gap-2 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Star className="h-6 w-6 fill-current" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-gray-600 mb-4">{badge.description}</p>
            <div className="text-lg font-semibold text-primary">
              +{badge.points} Points
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button onClick={onComplete} className="mt-6" variant="default">
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
