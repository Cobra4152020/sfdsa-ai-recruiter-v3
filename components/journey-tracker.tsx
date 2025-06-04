"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import {
  startJourney,
  recordJourneyStep,
  completeJourney,
  abandonJourney,
  getActiveJourneyByName,
  JOURNEY_TYPES,
} from "@/lib/journey-tracking";

type JourneyTrackerProps = {
  journeyName: string;
  stepName?: string;
  isStart?: boolean;
  isComplete?: boolean;
  isAbandon?: boolean;
  metadata?: Record<string, unknown>;
  metrics?: Record<string, number>;
  children?: React.ReactNode;
};

export function JourneyTracker({
  journeyName,
  stepName,
  isStart = false,
  isComplete = false,
  isAbandon = false,
  metadata = {},
  metrics = {},
  children,
}: JourneyTrackerProps) {
  const journeyIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only run in production or when explicitly enabled
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING !== "true"
    ) {
      return;
    }

    // Get existing journey ID if available
    if (!journeyIdRef.current) {
      journeyIdRef.current = getActiveJourneyByName(journeyName);
    }

    // Start journey if needed
    if (isStart || (!journeyIdRef.current && !isComplete && !isAbandon)) {
      journeyIdRef.current = startJourney(journeyName, {
        ...metadata,
        path: window.location.pathname,
        startStep: stepName,
      });
    }

    // Record step if we have a journey and a step name
    if (
      journeyIdRef.current &&
      stepName &&
      !isStart &&
      !isComplete &&
      !isAbandon
    ) {
      recordJourneyStep(journeyIdRef.current, stepName, metrics, {
        ...metadata,
        path: window.location.pathname,
      });
    }

    // Complete journey if needed
    if (isComplete && journeyIdRef.current) {
      completeJourney(journeyIdRef.current, true, {
        ...metadata,
        path: window.location.pathname,
        finalStep: stepName,
      });
      journeyIdRef.current = null;
    }

    // Abandon journey if needed
    if (isAbandon && journeyIdRef.current) {
      abandonJourney(
        journeyIdRef.current,
        (metadata.reason as string) || "user-abandoned",
        {
          ...metadata,
          path: window.location.pathname,
          abandonStep: stepName,
        },
      );
      journeyIdRef.current = null;
    }

    // Clean up on unmount if journey is still active
    return () => {
      // Only auto-abandon if this is the start component
      if (isStart && journeyIdRef.current) {
        abandonJourney(journeyIdRef.current, "component-unmounted", {
          path: window.location.pathname,
          lastStep: stepName,
        });
        journeyIdRef.current = null;
      }
    };
  }, [
    journeyName,
    stepName,
    isStart,
    isComplete,
    isAbandon,
    metadata,
    metrics,
  ]);

  // This component doesn't render anything by itself
  return children || null;
}

// Convenience components for common journey types
export function LoginJourney(props: Omit<JourneyTrackerProps, "journeyName">) {
  return <JourneyTracker journeyName={JOURNEY_TYPES.LOGIN} {...props} />;
}

export function RegistrationJourney(
  props: Omit<JourneyTrackerProps, "journeyName">,
) {
  return <JourneyTracker journeyName={JOURNEY_TYPES.REGISTRATION} {...props} />;
}

export function ApplicationJourney(
  props: Omit<JourneyTrackerProps, "journeyName">,
) {
  return <JourneyTracker journeyName={JOURNEY_TYPES.APPLICATION} {...props} />;
}

export function BadgeEarningJourney(
  props: Omit<JourneyTrackerProps, "journeyName">,
) {
  return (
    <JourneyTracker journeyName={JOURNEY_TYPES.BADGE_EARNING} {...props} />
  );
}

export function GamePlayingJourney(
  props: Omit<JourneyTrackerProps, "journeyName">,
) {
  return <JourneyTracker journeyName={JOURNEY_TYPES.GAME_PLAYING} {...props} />;
}

export function ProfileViewJourney(
  props: Omit<JourneyTrackerProps, "journeyName">,
) {
  return <JourneyTracker journeyName={JOURNEY_TYPES.PROFILE_VIEW} {...props} />;
}

export function TriviaJourney(props: Omit<JourneyTrackerProps, "journeyName">) {
  return <JourneyTracker journeyName={JOURNEY_TYPES.TRIVIA} {...props} />;
}

export function LeaderboardJourney(
  props: Omit<JourneyTrackerProps, "journeyName">,
) {
  return <JourneyTracker journeyName={JOURNEY_TYPES.LEADERBOARD} {...props} />;
}
