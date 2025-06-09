"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface PointAnimationProps {
  points: number;
  message?: string;
  onComplete?: () => void;
}

export function PointAnimation({
  points,
  message,
  onComplete,
}: PointAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Trigger confetti for significant point gains
    if (points >= 50) {
      confetti({
        particleCount: Math.min(points, 100),
        spread: 70,
        origin: { x: 0.5, y: 0.6 },
        colors: ["hsl(var(--secondary))", "hsl(var(--primary))", "hsl(var(--background))"],
      });
    }

    // Auto-hide after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 300); // Wait for exit animation to complete
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [points, onComplete]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: ["hsl(var(--secondary))", "hsl(var(--primary))", "hsl(var(--background))"],
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <motion.div
            className="bg-card/90 text-foreground rounded-lg px-6 py-4 shadow-xl"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="text-4xl font-bold text-[#FFD700]"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                +{points}
              </motion.div>
              <p className="mt-2 text-lg">{message || "Points Earned!"}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
