// Zustand state management stores

import { create } from 'zustand';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import database from '../database';
import { PredictionEngine } from '../utils/predictionEngine';
import type {
  DayLog,
  Cycle,
  Article,
  UserSettings,
  OnboardingData,
} from '../types';

// Calendar Store
interface CalendarState {
  currentMonth: Date;
  selectedDate: string;
  dayLogs: Map<string, DayLog>;
  isLoading: boolean;
  setCurrentMonth: (month: Date) => void;
  setSelectedDate: (date: string) => void;
  loadMonthData: (month: Date) => Promise<void>;
  saveDayLog: (log: DayLog) => Promise<void>;
  getDayLog: (date: string) => DayLog | undefined;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentMonth: new Date(),
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  dayLogs: new Map(),
  isLoading: false,

  setCurrentMonth: (month) => {
    set({ currentMonth: month });
    get().loadMonthData(month);
  },

  setSelectedDate: (date) => set({ selectedDate: date }),

  loadMonthData: async (month) => {
    set({ isLoading: true });
    try {
      const start = format(startOfMonth(month), 'yyyy-MM-dd');
      const end = format(endOfMonth(month), 'yyyy-MM-dd');
      const logs = await database.getDayLogRange(start, end);

      const dayLogsMap = new Map<string, DayLog>();
      logs.forEach(log => dayLogsMap.set(log.date, log));

      set({ dayLogs: dayLogsMap, isLoading: false });
    } catch (error) {
      console.error('Error loading month data:', error);
      set({ isLoading: false });
    }
  },

  saveDayLog: async (log) => {
    try {
      await database.saveDayLog(log);
      const dayLogs = new Map(get().dayLogs);
      dayLogs.set(log.date, log);
      set({ dayLogs });

      // Trigger cycle update
      useCycleStore.getState().updateCycles();
    } catch (error) {
      console.error('Error saving day log:', error);
    }
  },

  getDayLog: (date) => get().dayLogs.get(date),
}));

// Cycle/Prediction Store
interface CycleState {
  currentCycle: Cycle | null;
  allCycles: Cycle[];
  isLoading: boolean;
  cycleStats: ReturnType<typeof PredictionEngine.calculateCycleStats> | null;
  loadCycles: () => Promise<void>;
  updateCycles: () => Promise<void>;
  getCurrentCycleDay: () => number;
  getDaysUntilPeriod: () => number;
  getDailyTip: () => string;
}

export const useCycleStore = create<CycleState>((set, get) => ({
  currentCycle: null,
  allCycles: [],
  isLoading: false,
  cycleStats: null,

  loadCycles: async () => {
    set({ isLoading: true });
    try {
      const cycles = await database.getAllCycles();
      const currentCycle = await database.getLatestCycle();

      // Calculate stats
      const dayLogs = await database.getDayLogRange('1900-01-01', '2100-12-31');
      const stats = PredictionEngine.calculateCycleStats(cycles, dayLogs);

      set({
        allCycles: cycles,
        currentCycle,
        cycleStats: stats,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading cycles:', error);
      set({ isLoading: false });
    }
  },

  updateCycles: async () => {
    try {
      const dayLogs = await database.getDayLogRange('1900-01-01', '2100-12-31');
      const existingCycles = await database.getAllCycles();
      const stats = get().cycleStats || PredictionEngine.calculateCycleStats(existingCycles, dayLogs);

      const updatedCycle = PredictionEngine.updateCurrentCycle(dayLogs, existingCycles, stats);

      if (updatedCycle) {
        await database.saveCycle(updatedCycle);
        set({ currentCycle: updatedCycle, cycleStats: stats });
      }
    } catch (error) {
      console.error('Error updating cycles:', error);
    }
  },

  getCurrentCycleDay: () => {
    const { currentCycle } = get();
    if (!currentCycle) return 0;
    return PredictionEngine.getCycleDay(format(new Date(), 'yyyy-MM-dd'), currentCycle);
  },

  getDaysUntilPeriod: () => {
    const { currentCycle } = get();
    if (!currentCycle) return 0;
    return PredictionEngine.getDaysUntilPeriod(currentCycle);
  },

  getDailyTip: () => {
    const { currentCycle } = get();
    if (!currentCycle) return 'Start tracking your cycle to see personalized insights.';
    return PredictionEngine.getDailyTip(format(new Date(), 'yyyy-MM-dd'), currentCycle);
  },
}));

// Insights/Articles Store
interface InsightsState {
  articles: Article[];
  searchQuery: string;
  isLoading: boolean;
  loadArticles: (isPremium: boolean) => Promise<void>;
  searchArticles: (query: string, isPremium: boolean) => Promise<void>;
  setSearchQuery: (query: string) => void;
}

export const useInsightsStore = create<InsightsState>((set, get) => ({
  articles: [],
  searchQuery: '',
  isLoading: false,

  loadArticles: async (isPremium) => {
    set({ isLoading: true });
    try {
      const articles = await database.getArticles(isPremium);
      set({ articles, isLoading: false });
    } catch (error) {
      console.error('Error loading articles:', error);
      set({ isLoading: false });
    }
  },

  searchArticles: async (query, isPremium) => {
    if (!query.trim()) {
      get().loadArticles(isPremium);
      return;
    }

    set({ isLoading: true });
    try {
      const articles = await database.searchArticles(query, isPremium);
      set({ articles, isLoading: false });
    } catch (error) {
      console.error('Error searching articles:', error);
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
}));

// Settings Store
interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => Promise<void>;
  setPremium: (isPremium: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    theme: 'auto',
    notificationsEnabled: true,
    isPremium: false,
    appLockEnabled: false,
    temperatureUnit: 'celsius',
    weightUnit: 'kg',
  },
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await database.getAllSettings();
      set({ settings, isLoading: false });
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ isLoading: false });
    }
  },

  updateSetting: async (key, value) => {
    try {
      await database.saveSetting(key, value);
      set({ settings: { ...get().settings, [key]: value } });
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  },

  setPremium: async (isPremium) => {
    try {
      await database.saveSetting('isPremium', isPremium);
      set({ settings: { ...get().settings, isPremium } });

      // Reload articles to show premium content
      useInsightsStore.getState().loadArticles(isPremium);
    } catch (error) {
      console.error('Error setting premium:', error);
    }
  },
}));

// Onboarding Store
interface OnboardingState {
  data: OnboardingData | null;
  isLoading: boolean;
  loadOnboarding: () => Promise<void>;
  saveOnboarding: (data: OnboardingData) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  data: null,
  isLoading: false,

  loadOnboarding: async () => {
    set({ isLoading: true });
    try {
      const data = await database.getOnboarding();
      set({ data, isLoading: false });
    } catch (error) {
      console.error('Error loading onboarding:', error);
      set({ isLoading: false });
    }
  },

  saveOnboarding: async (data) => {
    try {
      await database.saveOnboarding(data);
      set({ data });
    } catch (error) {
      console.error('Error saving onboarding:', error);
    }
  },

  completeOnboarding: async () => {
    try {
      const currentData = useOnboardingStore.getState().data;
      if (currentData) {
        const completedData = { ...currentData, completed: true };
        await database.saveOnboarding(completedData);
        set({ data: completedData });

        // Create initial cycle from onboarding data
        const now = new Date().toISOString();
        const prediction = PredictionEngine.predictNextCycle(
          currentData.lastPeriodStart,
          {
            averageLength: currentData.averageCycleLength,
            averageLutealLength: 14,
            variance: 2,
            periodLength: currentData.periodLength,
          }
        );

        const initialCycle: Cycle = {
          id: `cycle-${currentData.lastPeriodStart}`,
          startDate: currentData.lastPeriodStart,
          predicted: prediction,
          createdAt: now,
          updatedAt: now,
        };

        await database.saveCycle(initialCycle);
        useCycleStore.getState().loadCycles();
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  },
}));

// UI State Store
interface UIState {
  isDailyLogOpen: boolean;
  dailyLogDate: string | null;
  isBottomSheetVisible: boolean;
  openDailyLog: (date: string) => void;
  closeDailyLog: () => void;
  setBottomSheetVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDailyLogOpen: false,
  dailyLogDate: null,
  isBottomSheetVisible: false,

  openDailyLog: (date) => set({ isDailyLogOpen: true, dailyLogDate: date }),
  closeDailyLog: () => set({ isDailyLogOpen: false, dailyLogDate: null }),
  setBottomSheetVisible: (visible) => set({ isBottomSheetVisible: visible }),
}));
