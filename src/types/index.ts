// Core data types for CycleTrack

export type FlowLevel = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

export interface DayLog {
  date: string; // ISO date string
  period: boolean;
  flow?: FlowLevel;
  symptoms: string[];
  mood?: number; // 1-5 scale
  weight?: number;
  bbt?: number; // Basal body temperature
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CyclePrediction {
  fertile: string[]; // Array of ISO date strings
  ovulationDate: string;
  nextPeriodStart: string;
  nextPeriodEnd: string;
}

export interface Cycle {
  id: string;
  startDate: string;
  endDate?: string;
  length?: number;
  predicted: CyclePrediction;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  category: string;
  premium: boolean;
  tags: string[];
  createdAt: string;
}

export type ReminderType = 'period' | 'fertile_window' | 'ovulation' | 'custom';

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  schedule: {
    daysBefore?: number;
    time?: string; // HH:mm format
    enabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingData {
  averageCycleLength: number;
  lastPeriodStart: string;
  periodLength: number;
  notificationsEnabled: boolean;
  completed: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  isPremium: boolean;
  appLockEnabled: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  weightUnit: 'kg' | 'lbs';
}

export const SYMPTOM_CATEGORIES = {
  physical: [
    'Cramps',
    'Headache',
    'Tender Breasts',
    'Bloating',
    'Acne',
    'Backache',
    'Fatigue',
    'Nausea',
  ],
  emotional: [
    'Happy',
    'Sad',
    'Anxious',
    'Irritable',
    'Energetic',
    'Calm',
    'Stressed',
    'Mood Swings',
  ],
  discharge: [
    'Dry',
    'Sticky',
    'Creamy',
    'Watery',
    'Egg White',
  ],
} as const;

export type SymptomCategory = keyof typeof SYMPTOM_CATEGORIES;
