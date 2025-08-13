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
        white: "#ffffff",
        // Chakra UI color scale equivalents
        gray100: "#edf2f7",
        gray200: "#e2e8f0",
        gray300: "#cbd5e0",
        gray400: "#a0aec0",
        gray500: "#718096",
        gray600: "#4a5568",
        gray700: "#2d3748",
        gray800: "#1a202c",
        gray900: "#171923",
        blue50: "#ebf8ff",
        blue100: "#bee3f8",
        blue200: "#90cdf4",
        blue300: "#63b3ed",
        blue400: "#4299e1",
        blue500: "#3182ce",
        blue600: "#2b6cb0",
        blue700: "#2c5282",
        blue800: "#2a4365",
        blue900: "#1a365d",
        red50: "#fed7d7",
        red100: "#feb2b2",
        red200: "#fecaca",
        red300: "#fc8181",
        red400: "#f56565",
        red500: "#e53e3e",
        red600: "#c53030",
        red700: "#9b2c2c",
        red800: "#822727",
        red900: "#63171b",
        green50: "#f0fff4",
        green100: "#c6f6d5",
        green200: "#9ae6b4",
        green300: "#68d391",
        green400: "#48bb78",
        green500: "#38a169",
        green600: "#2f855a",
        green700: "#276749",
        green800: "#22543d",
        green900: "#1c4532",
        purple50: "#faf5ff",
        purple100: "#e9d8fd",
        purple200: "#d6bcfa",
        purple300: "#b794f4",
        purple400: "#9f7aea",
        purple500: "#805ad5",
        purple600: "#6b46c1",
        purple700: "#553c9a",
        purple800: "#44337a",
        purple900: "#322659",
        orange50: "#fffaf0",
        orange100: "#feebc8",
        orange200: "#fbd38d",
        orange300: "#f6ad55",
        orange400: "#ed8936",
        orange500: "#dd6b20",
        orange600: "#c05621",
        orange700: "#9c4221",
        orange800: "#7c3aed",
        orange900: "#652b19",
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
      // Backgrounds - Deep slate with subtle warm undertones (GitHub Dark inspired)
      primary: "#0d1117", // Very dark slate background
      secondary: "#161b22", // Slightly lighter slate for containers
      card: "#1c2128", // Card background with subtle contrast
      surface: "#21262d", // Surface elements like inputs, selects

      // Text colors - High contrast with elegant accents
      text: {
        primary: "#f0f6fc", // Pure white-blue for primary text
        secondary: "#8b949e", // Muted gray for secondary text
        muted: "#6e7681", // Subtle gray for muted text
        accent: "#58a6ff", // Elegant blue accent
      },

      // Status colors - Professional with good contrast
      status: {
        success: "#3fb950", // Modern green
        warning: "#d29922", // Warm amber
        error: "#f85149", // Clear red
        info: "#58a6ff", // Consistent blue
      },

      // Additional colors - Professional palette with cohesive feel
      additional: {
        brightGreen: "#3fb950", // Modern green (matches status)
        brightPurple: "#a777ff", // Elegant purple with slight warmth
        deepSkyBlue: "#58a6ff", // Professional blue (matches accent)
        brightMagenta: "#f778ba", // Soft magenta
        brightOrange: "#ffa657", // Warm orange
        brightRed: "#f85149", // Clear red (matches error)
        lightRed: "#ff7b72", // Lighter red variant
        brightGreenLight: "#56d364", // Light green variant
        veryDarkGray: "#010409", // Almost black for deep backgrounds
        mediumBluePurple: "#21262d", // Surface color for consistency
        darkMagenta: "#bc8cff", // Light purple for highlights
        gray: "#8b949e", // Consistent gray (matches secondary text)
        dimGray: "#6e7681", // Muted gray (matches muted text)
        blueGradientStart: "#0969da", // Deep blue for gradients
        purpleGradientEnd: "#8250df", // Rich purple for gradients
        black: "#000000",
        white: "#ffffff",
        // Chakra UI color scale equivalents - Updated for dark theme coherence
        gray50: "#30363d", // Light gray for dark theme
        gray100: "#21262d", //
        gray200: "#373e47", //
        gray300: "#444c56", //
        gray400: "#545d68", //
        gray500: "#656d76", //
        gray600: "#768390", //
        gray700: "#8b949e", // (matches our gray)
        gray800: "#adbac7", //
        gray900: "#cdd9e5", // Lightest for dark theme
        blue50: "#0d419d", // Dark theme blues
        blue100: "#0969da", //
        blue200: "#1f6feb", //
        blue300: "#388bfd", //
        blue400: "#58a6ff", // (matches our accent)
        blue500: "#79c0ff", //
        blue600: "#a5d6ff", //
        blue700: "#b6e3ff", //
        blue800: "#c9f0ff", //
        blue900: "#e7f3ff", //
        red50: "#67060c", // Dark theme reds
        red100: "#8e1519", //
        red200: "#b62025", //
        red300: "#d1242f", //
        red400: "#f85149", // (matches our error)
        red500: "#ff7b72", // (matches our lightRed)
        red600: "#ffa198", //
        red700: "#ffb3ba", //
        red800: "#ffc1cc", //
        red900: "#ffdce0", //
        green50: "#0f5132", // Dark theme greens
        green100: "#1b6f47", //
        green200: "#238636", //
        green300: "#2ea043", //
        green400: "#3fb950", // (matches our success)
        green500: "#56d364", // (matches our brightGreenLight)
        green600: "#7ee787", //
        green700: "#a2f2a5", //
        green800: "#b8ffb8", //
        green900: "#dafbe1", //
        purple50: "#3d1a78", // Dark theme purples
        purple100: "#472183", //
        purple200: "#553098", //
        purple300: "#6f42c1", //
        purple400: "#8250df", // (matches our purpleGradientEnd)
        purple500: "#a777ff", // (matches our brightPurple)
        purple600: "#bc8cff", // (matches our darkMagenta)
        purple700: "#d2a8ff", //
        purple800: "#e5c7ff", //
        purple900: "#f6e7ff", //
        orange50: "#762d00", // Dark theme oranges
        orange100: "#9a3412", //
        orange200: "#bc4c00", //
        orange300: "#e36209", //
        orange400: "#fb8500", //
        orange500: "#ffa657", // (matches our brightOrange)
        orange600: "#ffb77c", //
        orange700: "#ffc9a6", //
        orange800: "#ffddb3", //
        orange900: "#fff1e6", //
      },

      // Borders - Elegant and consistent
      border: {
        primary: "#30363d", // Subtle border that's visible but not harsh
        secondary: "#21262d", // Even more subtle for nested elements
        accent: "#58a6ff", // Blue accent for focus states
      },

      // Gradients - Professional and modern
      gradient: {
        primary:
          "linear-gradient(135deg, #0d1117 0%, #21262d 25%, #0969da 75%, #8250df 100%)",
      },
    },
  },
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

// Helper functions for Chakra UI color scales
export const getGrayColor = (shade: string, isDark: boolean) => {
  const colorKey = `gray${shade}` as keyof typeof theme.colors.light.additional;
  return getAdditionalColor(colorKey, isDark);
};

export const getBlueColor = (shade: string, isDark: boolean) => {
  const colorKey = `blue${shade}` as keyof typeof theme.colors.light.additional;
  return getAdditionalColor(colorKey, isDark);
};

export const getRedColor = (shade: string, isDark: boolean) => {
  const colorKey = `red${shade}` as keyof typeof theme.colors.light.additional;
  return getAdditionalColor(colorKey, isDark);
};

export const getGreenColor = (shade: string, isDark: boolean) => {
  const colorKey =
    `green${shade}` as keyof typeof theme.colors.light.additional;
  return getAdditionalColor(colorKey, isDark);
};

export const getPurpleColor = (shade: string, isDark: boolean) => {
  const colorKey =
    `purple${shade}` as keyof typeof theme.colors.light.additional;
  return getAdditionalColor(colorKey, isDark);
};

export const getOrangeColor = (shade: string, isDark: boolean) => {
  const colorKey =
    `orange${shade}` as keyof typeof theme.colors.light.additional;
  return getAdditionalColor(colorKey, isDark);
};
