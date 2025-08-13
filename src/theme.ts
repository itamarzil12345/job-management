export const theme = {
  colors: {
    light: {
      // Backgrounds
      primary: "#ffffff",
      secondary: "#f8f9fa",
      card: "#ffffff",
      surface: "#f8f9fa",

      // Text colors
      text: {
        primary: "#2d3748",
        secondary: "#4a5568",
        muted: "#718096",
        accent: "#3182ce",
      },

      // Status colors
      status: {
        success: "#228b22",
        warning: "#ff8c00",
        error: "#dc143c",
        info: "#4169e1",
      },

      // Additional colors
      additional: {
        brightGreen: "#00ff41",
        brightPurple: "#8a2be2",
        deepSkyBlue: "#00bfff",
        brightMagenta: "#ff0080",
        brightOrange: "#ffaa00",
        brightRed: "#ff0040",
        lightRed: "#ff6b6b",
        brightGreenLight: "#00ff80",
        veryDarkGray: "#0a0a0a",
        mediumBluePurple: "#2a2a3e",
        darkMagenta: "#8b008b",
        gray: "#666",
        dimGray: "#696969",
        blueGradientStart: "#667eea",
        purpleGradientEnd: "#764ba2",
        black: "#000000",
      },

      // Borders
      border: {
        primary: "#e2e8f0",
        secondary: "#cbd5e0",
        accent: "#3182ce",
      },

      // Gradients
      gradient: {
        primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    },

    dark: {
      // Backgrounds
      primary: "#0f0f23",
      secondary: "#1a1a2e",
      card: "#1a1a2e",
      surface: "#2a2a3e",

      // Text colors
      text: {
        primary: "#8a2be2",
        secondary: "#00bfff",
        muted: "#696969",
        accent: "#00ff41",
      },

      // Status colors
      status: {
        success: "#00bfff",
        warning: "#ffaa00",
        error: "#ff0040",
        info: "#00bfff",
      },

      // Additional colors
      additional: {
        brightGreen: "#00ff41",
        brightPurple: "#8a2be2",
        deepSkyBlue: "#00bfff",
        brightMagenta: "#ff0080",
        brightOrange: "#ffaa00",
        brightRed: "#ff0040",
        lightRed: "#ff6b6b",
        brightGreenLight: "#00ff80",
        veryDarkGray: "#0a0a0a",
        mediumBluePurple: "#2a2a3e",
        darkMagenta: "#8b008b",
        gray: "#666",
        dimGray: "#696969",
        blueGradientStart: "#667eea",
        purpleGradientEnd: "#764ba2",
        black: "#000000",
      },

      // Borders
      border: {
        primary: "#8a2be2",
        secondary: "#00bfff",
        accent: "#8a2be2",
      },

      // Gradients
      gradient: {
        primary:
          "linear-gradient(135deg, #0f0f23 0%, #8a2be2 25%, #ff0080 50%, #00bfff 75%, #0f0f23 100%)",
      },
    },
  },
};

// Helper function to get theme-aware colors
export const getThemeColors = (isDark: boolean) => {
  return isDark ? theme.colors.dark : theme.colors.light;
};

// Export individual color getters for convenience
export const getBackgroundColor = (isDark: boolean) =>
  isDark ? theme.colors.dark.primary : theme.colors.light.primary;

export const getCardBackgroundColor = (isDark: boolean) =>
  isDark ? theme.colors.dark.card : theme.colors.light.card;

export const getTextColor = (isDark: boolean) =>
  isDark ? theme.colors.dark.text.primary : theme.colors.light.text.primary;

export const getBorderColor = (isDark: boolean) =>
  isDark ? theme.colors.dark.border.primary : theme.colors.light.border.primary;

export const getStatusColor = (
  type: "success" | "warning" | "error" | "info",
  isDark: boolean
) =>
  isDark ? theme.colors.dark.status[type] : theme.colors.light.status[type];

export const getAdditionalColor = (
  color: keyof typeof theme.colors.light.additional,
  isDark: boolean
) =>
  isDark
    ? theme.colors.dark.additional[color]
    : theme.colors.light.additional[color];
