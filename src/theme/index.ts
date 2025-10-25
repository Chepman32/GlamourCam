// Theme system for CycleTrack

import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store';

export const lightTheme = {
  colors: {
    primary: '#E91E63',
    primaryLight: '#F8BBD0',
    primaryDark: '#C2185B',
    secondary: '#673AB7',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    card: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',

    // Cycle-specific colors
    periodRed: '#E91E63',
    fertileGreen: '#66BB6A',
    ovulationPurple: '#AB47BC',
    predictedGray: '#BDBDBD',

    // Flow levels
    flowSpotting: '#FFCDD2',
    flowLight: '#F48FB1',
    flowMedium: '#EC407A',
    flowHeavy: '#C2185B',

    // Mood colors
    moodVeryHappy: '#FFD54F',
    moodHappy: '#FFF176',
    moodNeutral: '#E0E0E0',
    moodSad: '#90CAF9',
    moodVerySad: '#64B5F6',

    // Chart colors
    chartLine: '#E91E63',
    chartGrid: '#F5F5F5',
    chartAxis: '#9E9E9E',

    // Symptom categories
    symptomPhysical: '#FF7043',
    symptomEmotional: '#7E57C2',
    symptomDischarge: '#26C6DA',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#F48FB1',
    primaryLight: '#F8BBD0',
    primaryDark: '#E91E63',
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2C2C2C',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#3C3C3C',

    // Cycle-specific colors (darker variants)
    periodRed: '#F48FB1',
    fertileGreen: '#81C784',
    ovulationPurple: '#BA68C8',
    predictedGray: '#757575',

    // Chart colors
    chartGrid: '#2C2C2C',
    chartAxis: '#616161',
  },
};

export type Theme = typeof lightTheme;

export const useTheme = (): Theme => {
  const systemScheme = useColorScheme();
  const { settings } = useSettingsStore();

  const effectiveScheme = settings.theme === 'auto'
    ? systemScheme
    : settings.theme;

  return effectiveScheme === 'dark' ? darkTheme : lightTheme;
};

export const getAnimationConfig = () => ({
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
  timing: {
    short: 220,
    medium: 260,
    long: 360,
  },
});
