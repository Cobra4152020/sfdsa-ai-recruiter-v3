// Debug utilities for troubleshooting deployment issues

export function logEnvironmentInfo() {
  console.log("Environment Information:");
  console.log("- NODE_ENV:", process.env.NODE_ENV);
  console.log("- NEXT_PUBLIC_VERCEL_ENV:", process.env.NEXT_PUBLIC_VERCEL_ENV);
  console.log("- NEXT_PUBLIC_VERCEL_URL:", process.env.NEXT_PUBLIC_VERCEL_URL);

  // Log database connection status (without exposing credentials)
  const dbConnected =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log("- Database credentials configured:", dbConnected);
}

export function checkFeatureFlags() {
  // Check if feature flags are enabled
  const featureFlags = {
    enableLeaderboard: process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD === "true",
    enableBadges: process.env.NEXT_PUBLIC_ENABLE_BADGES === "true",
    enablePoints: process.env.NEXT_PUBLIC_ENABLE_POINTS === "true",
    enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",
  };

  console.log("Feature Flags:", featureFlags);
  return featureFlags;
}

export function injectDebugInfo(element: HTMLElement) {
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true"
  ) {
    const debugInfo = document.createElement("div");
    debugInfo.style.position = "fixed";
    debugInfo.style.bottom = "10px";
    debugInfo.style.left = "10px";
    debugInfo.style.backgroundColor = "rgba(0,0,0,0.8)";
    debugInfo.style.color = "white";
    debugInfo.style.padding = "10px";
    debugInfo.style.borderRadius = "5px";
    debugInfo.style.zIndex = "9999";
    debugInfo.style.fontSize = "12px";
    debugInfo.style.fontFamily = "monospace";

    const buildInfo = `Build: ${process.env.NEXT_PUBLIC_BUILD_ID || "unknown"}`;
    const envInfo = `Env: ${process.env.NODE_ENV || "unknown"}`;

    debugInfo.textContent = `${buildInfo} | ${envInfo}`;

    element.appendChild(debugInfo);
  }
}
