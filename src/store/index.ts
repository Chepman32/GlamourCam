import { create } from 'zustand';
import {
  EditSession,
  EditStep,
  Settings,
  ToolType,
  CanvasTransform,
  ExportFormat,
  ThemeMode,
} from '../types';

// Session slice - manages edit sessions
interface SessionState {
  currentSession: EditSession | null;
  sessions: EditSession[];
  undoStack: EditStep[];
  redoStack: EditStep[];

  // Actions
  createSession: (srcUri: string) => void;
  loadSession: (sessionId: string) => void;
  saveSession: () => void;
  addStep: (step: EditStep) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

// Tools slice - manages active tool and parameters
interface ToolsState {
  activeTool: ToolType | null;
  toolParams: Record<string, any>;
  brushSize: number;
  brushStrength: number;

  // Actions
  setActiveTool: (tool: ToolType | null) => void;
  updateToolParams: (params: Record<string, any>) => void;
  setBrushSize: (size: number) => void;
  setBrushStrength: (strength: number) => void;
  resetToolParams: () => void;
}

// UI slice - manages UI state
interface UIState {
  contextPanelVisible: boolean;
  toolRailVisible: boolean;
  showOriginal: boolean;
  canvasTransform: CanvasTransform;
  isExporting: boolean;
  exportProgress: number;
  toastMessage: string | null;

  // Actions
  setContextPanelVisible: (visible: boolean) => void;
  setToolRailVisible: (visible: boolean) => void;
  setShowOriginal: (show: boolean) => void;
  setCanvasTransform: (transform: Partial<CanvasTransform>) => void;
  resetCanvasTransform: () => void;
  setExporting: (exporting: boolean, progress?: number) => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

// IAP slice - manages in-app purchases
interface IAPState {
  proUnlocked: boolean;
  showUpsell: boolean;
  upsellContext: string | null;

  // Actions
  unlockPro: () => void;
  lockPro: () => void;
  setShowUpsell: (show: boolean, context?: string) => void;
  checkProFeature: (feature: string) => boolean;
}

// Settings slice
interface SettingsState {
  settings: Settings;

  // Actions
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// Combine all slices
interface AppState
  extends SessionState,
    ToolsState,
    UIState,
    IAPState,
    SettingsState {}

// Default settings
const DEFAULT_SETTINGS: Settings = {
  theme: 'auto',
  exportQuality: 95,
  exportFormat: 'jpeg',
  defaultTool: 'smooth',
  removeMetadata: true,
  proUnlocked: false,
};

// Create the store
export const useStore = create<AppState>((set, get) => ({
  // Session state
  currentSession: null,
  sessions: [],
  undoStack: [],
  redoStack: [],

  createSession: (srcUri: string) => {
    const session: EditSession = {
      id: `session_${Date.now()}`,
      srcUri,
      steps: [],
      masks: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ currentSession: session, undoStack: [], redoStack: [] });
  },

  loadSession: (sessionId: string) => {
    const session = get().sessions.find((s) => s.id === sessionId);
    if (session) {
      set({ currentSession: session, undoStack: [], redoStack: [] });
    }
  },

  saveSession: () => {
    const { currentSession, sessions } = get();
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = sessions.findIndex((s) => s.id === currentSession.id);
    const updatedSessions = [...sessions];

    if (existingIndex >= 0) {
      updatedSessions[existingIndex] = updatedSession;
    } else {
      updatedSessions.push(updatedSession);
    }

    set({ currentSession: updatedSession, sessions: updatedSessions });
  },

  addStep: (step: EditStep) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      steps: [...currentSession.steps, step],
    };

    set({
      currentSession: updatedSession,
      undoStack: [...get().undoStack, step],
      redoStack: [],
    });
  },

  undo: () => {
    const { undoStack, redoStack, currentSession } = get();
    if (undoStack.length === 0 || !currentSession) return;

    const lastStep = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    const updatedSession = {
      ...currentSession,
      steps: currentSession.steps.slice(0, -1),
    };

    set({
      undoStack: newUndoStack,
      redoStack: [...redoStack, lastStep],
      currentSession: updatedSession,
    });
  },

  redo: () => {
    const { redoStack, undoStack, currentSession } = get();
    if (redoStack.length === 0 || !currentSession) return;

    const stepToRedo = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    const updatedSession = {
      ...currentSession,
      steps: [...currentSession.steps, stepToRedo],
    };

    set({
      redoStack: newRedoStack,
      undoStack: [...undoStack, stepToRedo],
      currentSession: updatedSession,
    });
  },

  clearHistory: () => {
    set({ undoStack: [], redoStack: [] });
  },

  // Tools state
  activeTool: null,
  toolParams: {},
  brushSize: 30,
  brushStrength: 0.5,

  setActiveTool: (tool: ToolType | null) => {
    set({ activeTool: tool });
  },

  updateToolParams: (params: Record<string, any>) => {
    set({ toolParams: { ...get().toolParams, ...params } });
  },

  setBrushSize: (size: number) => {
    set({ brushSize: Math.max(5, Math.min(200, size)) });
  },

  setBrushStrength: (strength: number) => {
    set({ brushStrength: Math.max(0, Math.min(1, strength)) });
  },

  resetToolParams: () => {
    set({ toolParams: {} });
  },

  // UI state
  contextPanelVisible: true,
  toolRailVisible: true,
  showOriginal: false,
  canvasTransform: {
    scale: 1,
    translateX: 0,
    translateY: 0,
    rotation: 0,
  },
  isExporting: false,
  exportProgress: 0,
  toastMessage: null,

  setContextPanelVisible: (visible: boolean) => {
    set({ contextPanelVisible: visible });
  },

  setToolRailVisible: (visible: boolean) => {
    set({ toolRailVisible: visible });
  },

  setShowOriginal: (show: boolean) => {
    set({ showOriginal: show });
  },

  setCanvasTransform: (transform: Partial<CanvasTransform>) => {
    set({
      canvasTransform: { ...get().canvasTransform, ...transform },
    });
  },

  resetCanvasTransform: () => {
    set({
      canvasTransform: {
        scale: 1,
        translateX: 0,
        translateY: 0,
        rotation: 0,
      },
    });
  },

  setExporting: (exporting: boolean, progress: number = 0) => {
    set({ isExporting: exporting, exportProgress: progress });
  },

  showToast: (message: string) => {
    set({ toastMessage: message });
    setTimeout(() => {
      if (get().toastMessage === message) {
        set({ toastMessage: null });
      }
    }, 3000);
  },

  hideToast: () => {
    set({ toastMessage: null });
  },

  // IAP state
  proUnlocked: false,
  showUpsell: false,
  upsellContext: null,

  unlockPro: () => {
    set({ proUnlocked: true });
    get().updateSettings({ proUnlocked: true });
  },

  lockPro: () => {
    set({ proUnlocked: false });
    get().updateSettings({ proUnlocked: false });
  },

  setShowUpsell: (show: boolean, context?: string) => {
    set({ showUpsell: show, upsellContext: context || null });
  },

  checkProFeature: (feature: string) => {
    const { proUnlocked } = get();
    return proUnlocked;
  },

  // Settings state
  settings: DEFAULT_SETTINGS,

  updateSettings: (newSettings: Partial<Settings>) => {
    set({
      settings: { ...get().settings, ...newSettings },
    });
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
  },
}));
