export const emailTheme = {
  colors: {
    primary: "#0A3C1F",
    accent: "#FFD700",
    background: "#f9f9f9",
    backgroundAlt: "#f0f0f0",
    text: {
      primary: "#333",
      secondary: "#666",
    },
    border: {
      light: "#eee",
      medium: "#ddd",
    },
  },
  spacing: {
    padding: "20px",
    margin: "20px",
  },
  borderRadius: "4px",
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
