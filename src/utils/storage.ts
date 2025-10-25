import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditSession, Settings } from '../types';

const STORAGE_KEYS = {
  SESSIONS: '@glamourcam/sessions',
  SETTINGS: '@glamourcam/settings',
  CURRENT_SESSION: '@glamourcam/current_session',
};

/**
 * Storage utility for persisting app data
 */
export const Storage = {
  // Sessions
  async saveSessions(sessions: EditSession[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SESSIONS,
        JSON.stringify(sessions)
      );
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  },

  async loadSessions(): Promise<EditSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  },

  async saveSession(session: EditSession): Promise<void> {
    try {
      const sessions = await this.loadSessions();
      const index = sessions.findIndex((s) => s.id === session.id);

      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.push(session);
      }

      await this.saveSessions(sessions);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  },

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.loadSessions();
      const filtered = sessions.filter((s) => s.id !== sessionId);
      await this.saveSessions(filtered);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  },

  // Settings
  async saveSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  async loadSettings(): Promise<Settings | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  },

  // Current session
  async saveCurrentSessionId(sessionId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, sessionId);
    } catch (error) {
      console.error('Error saving current session ID:', error);
    }
  },

  async loadCurrentSessionId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    } catch (error) {
      console.error('Error loading current session ID:', error);
      return null;
    }
  },

  async clearCurrentSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    } catch (error) {
      console.error('Error clearing current session:', error);
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SESSIONS,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.CURRENT_SESSION,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
