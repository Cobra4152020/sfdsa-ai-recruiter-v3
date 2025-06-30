export const videoTheme = {
  primary: {
    light: "#2dd4bf", // Modern teal for light mode
    dark: "#2dd4bf",  // Same teal for dark mode
  },
  accent: {
    light: "#0891b2", // Darker teal accent
    dark: "#22d3ee",  // Brighter teal accent for dark mode
  },
  background: {
    light: "#f8fafc",
    dark: "#0f172a",
  },
  text: {
    light: "#1e293b",
    dark: "#f1f5f9",
  },
  gradients: {
    primary: [
      { position: 0, color: "#2dd4bf" },
      { position: 1, color: "#0891b2" },
    ],
    accent: [
      { position: 0, color: "#22d3ee" },
      { position: 1, color: "#0891b2" },
    ],
  },
  overlay: {
    light: "#2dd4bf",
    dark: "#2dd4bf",
  },
  button: {
    primary: {
      background: "#2dd4bf",
      hover: "#22d3ee",
      text: "#ffffff",
    },
    secondary: {
      background: "transparent",
      border: "#2dd4bf",
      text: "#2dd4bf",
      hover: {
        background: "#2dd4bf",
        text: "#ffffff",
      },
    },
  },
  badge: {
    background: "#f0fdfa",
    border: "#2dd4bf",
    text: "#0f766e",
  },
  controls: {
    primary: "#2dd4bf",
    background: "rgba(45, 212, 191, 0.1)",
    hover: "#22d3ee",
  },
  particles: {
    primary: {
      light: "#FFD700",
      dark: "#FFD700",
    },
    secondary: {
      light: "#FFFFFF",
      dark: "#0A3C1F",
    },
  },
};

export type VideoTheme = typeof videoTheme;

// Helper function to get theme values with type safety
export const getVideoThemeValue = (
  path: string,
  theme: VideoTheme = videoTheme,
): string => {
  return path
    .split(".")
    .reduce(
      (obj: Record<string, unknown>, key: string) =>
        obj[key] as Record<string, unknown>,
      theme,
    ) as string;
};

type ThemeValue = string | Record<string, ThemeValue>;

function getThemeValue(
  path: string,
  theme: Record<string, ThemeValue>,
): string {
  return path
    .split(".")
    .reduce((obj: Record<string, ThemeValue>, key: string) => {
      const value = obj[key];
      if (typeof value === "string") return value;
      if (typeof value === "object" && value !== null)
        return value as Record<string, ThemeValue>;
      throw new Error(`Invalid theme value at path: ${path}`);
    }, theme) as string;
}
