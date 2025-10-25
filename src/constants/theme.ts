// Theme constants for GlamourCam

export const COLORS = {
  light: {
    primary: '#FF6B9D',
    secondary: '#C44569',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    proGold: '#FFD700',
  },
  dark: {
    primary: '#FF6B9D',
    secondary: '#C44569',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    overlay: 'rgba(0, 0, 0, 0.7)',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    proGold: '#FFD700',
  },
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Border radius
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 16,
  radiusRound: 999,

  // Icon sizes
  iconSmall: 20,
  iconMedium: 24,
  iconLarge: 32,
  iconXLarge: 48,

  // Touch targets
  touchTarget: 44,

  // Editor
  toolRailWidth: 80,
  contextPanelHeight: 200,
  topBarHeight: 60,
};

export const TYPOGRAPHY = {
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const ANIMATION = {
  // Durations
  fast: 200,
  normal: 300,
  slow: 500,

  // Spring configs
  spring: {
    default: {
      stiffness: 240,
      damping: 18,
    },
    gentle: {
      stiffness: 180,
      damping: 22,
    },
    bouncy: {
      stiffness: 320,
      damping: 14,
    },
  },
};

export const CANVAS = {
  // Preview resolution for editing
  previewMaxSize: 2048,

  // Export resolution limits
  freeMaxResolution: 4096, // 12MP equivalent
  proMaxResolution: 16384, // No practical limit

  // Brush settings
  minBrushSize: 5,
  maxBrushSize: 200,
  defaultBrushSize: 30,

  // Gesture sensitivity
  pinchSensitivity: 0.01,
  panSensitivity: 1,
  swipeValueSensitivity: 0.5,
};
