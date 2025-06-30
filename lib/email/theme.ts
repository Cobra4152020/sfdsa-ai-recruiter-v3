export const emailTheme = {
  primary: "#2dd4bf",
  primaryDark: "#0891b2",
  text: "#1f2937",
  textLight: "#6b7280",
  background: "#ffffff",
  backgroundLight: "#f9fafb",
  border: "#e5e7eb",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
};

export type EmailTheme = typeof emailTheme;

// Helper function to get theme values with type safety
export const getEmailThemeValue = (
  path: string,
  theme: EmailTheme = emailTheme,
): string => {
  return path
    .split(".")
    .reduce(
      (obj: unknown, key: string) =>
        obj && typeof obj === "object" && key in obj
          ? (obj as Record<string, unknown>)[key]
          : undefined,
      theme,
    ) as string;
};
