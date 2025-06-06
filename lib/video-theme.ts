export const videoTheme = {
  colors: {
    primary: {
      light: "#0A3C1F",
      dark: "#FFD700",
    },
    accent: {
      light: "#FFD700",
      dark: "#0A3C1F",
    },
    white: "#FFFFFF",
    background: {
      primary: {
        light: "#0A3C1F",
        dark: "#121212",
      },
      gradient: {
        light: [
          { position: 0, color: "#0A3C1F" },
          { position: 1, color: "#072815" },
        ],
        dark: [
          { position: 0, color: "#121212" },
          { position: 1, color: "#000000" },
        ],
      },
    },
    text: {
      primary: {
        light: "#FFFFFF",
        dark: "#FFD700",
      },
      accent: {
        light: "#FFD700",
        dark: "#FFFFFF",
      },
      dark: {
        light: "#0A3C1F",
        dark: "#FFD700",
      },
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
  },
  effects: {
    shine: {
      opacity: 0.3,
    },
    particles: {
      defaultColor: {
        light: "#FFD700",
        dark: "#FFD700",
      },
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
