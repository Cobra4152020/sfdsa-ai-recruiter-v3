export const videoTheme = {
  colors: {
    primary: '#0A3C1F',
    accent: '#FFD700',
    white: '#FFFFFF',
    background: {
      primary: '#0A3C1F',
      gradient: [
        { position: 0, color: '#0A3C1F' },
        { position: 1, color: '#072815' }
      ]
    },
    text: {
      primary: '#FFFFFF',
      accent: '#FFD700',
      dark: '#0A3C1F'
    },
    particles: {
      primary: '#FFD700',
      secondary: '#FFFFFF'
    }
  },
  effects: {
    shine: {
      opacity: 0.3
    },
    particles: {
      defaultColor: '#FFD700'
    }
  }
};

export type VideoTheme = typeof videoTheme;

// Helper function to get theme values with type safety
export const getVideoThemeValue = (path: string, theme: VideoTheme = videoTheme): string => {
  return path.split('.').reduce((obj: any, key: string) => obj[key], theme) as string;
}; 