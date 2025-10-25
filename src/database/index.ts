// Database manager using SQLite

import SQLite from 'react-native-sqlite-storage';
import { CREATE_TABLES, SEED_ARTICLES, DB_NAME } from './schema';
import type { DayLog, Cycle, Article, Reminder, OnboardingData, UserSettings } from '../types';

SQLite.enablePromise(true);

class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      await this.db.executeSql(CREATE_TABLES);
      await this.seedArticlesIfNeeded();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async seedArticlesIfNeeded(): Promise<void> {
    if (!this.db) return;

    const [results] = await this.db.executeSql('SELECT COUNT(*) as count FROM articles');
    if (results.rows.item(0).count === 0) {
      await this.db.executeSql(SEED_ARTICLES);
    }
  }

  // Day Log operations
  async saveDayLog(log: DayLog): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const sql = `
      INSERT OR REPLACE INTO day_logs (
        date, period, flow, symptoms, mood, weight, bbt, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.executeSql(sql, [
      log.date,
      log.period ? 1 : 0,
      log.flow || null,
      JSON.stringify(log.symptoms),
      log.mood || null,
      log.weight || null,
      log.bbt || null,
      log.notes || null,
      log.createdAt,
      log.updatedAt,
    ]);
  }

  async getDayLog(date: string): Promise<DayLog | null> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM day_logs WHERE date = ?',
      [date]
    );

    if (results.rows.length === 0) return null;

    const row = results.rows.item(0);
    return {
      date: row.date,
      period: row.period === 1,
      flow: row.flow,
      symptoms: JSON.parse(row.symptoms || '[]'),
      mood: row.mood,
      weight: row.weight,
      bbt: row.bbt,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getDayLogRange(startDate: string, endDate: string): Promise<DayLog[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM day_logs WHERE date >= ? AND date <= ? ORDER BY date ASC',
      [startDate, endDate]
    );

    const logs: DayLog[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      logs.push({
        date: row.date,
        period: row.period === 1,
        flow: row.flow,
        symptoms: JSON.parse(row.symptoms || '[]'),
        mood: row.mood,
        weight: row.weight,
        bbt: row.bbt,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }

    return logs;
  }

  // Cycle operations
  async saveCycle(cycle: Cycle): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const sql = `
      INSERT OR REPLACE INTO cycles (
        id, start_date, end_date, length,
        predicted_fertile, predicted_ovulation,
        predicted_next_period_start, predicted_next_period_end,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.executeSql(sql, [
      cycle.id,
      cycle.startDate,
      cycle.endDate || null,
      cycle.length || null,
      JSON.stringify(cycle.predicted.fertile),
      cycle.predicted.ovulationDate,
      cycle.predicted.nextPeriodStart,
      cycle.predicted.nextPeriodEnd,
      cycle.createdAt,
      cycle.updatedAt,
    ]);
  }

  async getLatestCycle(): Promise<Cycle | null> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM cycles ORDER BY start_date DESC LIMIT 1'
    );

    if (results.rows.length === 0) return null;

    const row = results.rows.item(0);
    return {
      id: row.id,
      startDate: row.start_date,
      endDate: row.end_date,
      length: row.length,
      predicted: {
        fertile: JSON.parse(row.predicted_fertile || '[]'),
        ovulationDate: row.predicted_ovulation,
        nextPeriodStart: row.predicted_next_period_start,
        nextPeriodEnd: row.predicted_next_period_end,
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getAllCycles(): Promise<Cycle[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM cycles ORDER BY start_date DESC'
    );

    const cycles: Cycle[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      cycles.push({
        id: row.id,
        startDate: row.start_date,
        endDate: row.end_date,
        length: row.length,
        predicted: {
          fertile: JSON.parse(row.predicted_fertile || '[]'),
          ovulationDate: row.predicted_ovulation,
          nextPeriodStart: row.predicted_next_period_start,
          nextPeriodEnd: row.predicted_next_period_end,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }

    return cycles;
  }

  // Article operations
  async getArticles(includesPremium: boolean = false): Promise<Article[]> {
    if (!this.db) throw new Error('Database not initialized');

    const sql = includesPremium
      ? 'SELECT * FROM articles ORDER BY created_at DESC'
      : 'SELECT * FROM articles WHERE premium = 0 ORDER BY created_at DESC';

    const [results] = await this.db.executeSql(sql);

    const articles: Article[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      articles.push({
        id: row.id,
        title: row.title,
        body: row.body,
        category: row.category,
        premium: row.premium === 1,
        tags: JSON.parse(row.tags || '[]'),
        createdAt: row.created_at,
      });
    }

    return articles;
  }

  async searchArticles(query: string, includesPremium: boolean = false): Promise<Article[]> {
    if (!this.db) throw new Error('Database not initialized');

    const sql = includesPremium
      ? `SELECT a.* FROM articles a
         JOIN articles_fts fts ON a.rowid = fts.rowid
         WHERE articles_fts MATCH ?
         ORDER BY a.created_at DESC`
      : `SELECT a.* FROM articles a
         JOIN articles_fts fts ON a.rowid = fts.rowid
         WHERE articles_fts MATCH ? AND a.premium = 0
         ORDER BY a.created_at DESC`;

    const [results] = await this.db.executeSql(sql, [query]);

    const articles: Article[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      articles.push({
        id: row.id,
        title: row.title,
        body: row.body,
        category: row.category,
        premium: row.premium === 1,
        tags: JSON.parse(row.tags || '[]'),
        createdAt: row.created_at,
      });
    }

    return articles;
  }

  // Settings operations
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      'INSERT OR REPLACE INTO user_settings (key, value, updated_at) VALUES (?, ?, ?)',
      [key, JSON.stringify(value), new Date().toISOString()]
    );
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT value FROM user_settings WHERE key = ?',
      [key]
    );

    if (results.rows.length === 0) return null;
    return JSON.parse(results.rows.item(0).value);
  }

  async getAllSettings(): Promise<UserSettings> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM user_settings');

    const settings: any = {
      theme: 'auto',
      notificationsEnabled: true,
      isPremium: false,
      appLockEnabled: false,
      temperatureUnit: 'celsius',
      weightUnit: 'kg',
    };

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      settings[row.key] = JSON.parse(row.value);
    }

    return settings;
  }

  // Onboarding operations
  async saveOnboarding(data: OnboardingData): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const sql = `
      INSERT OR REPLACE INTO onboarding (
        id, average_cycle_length, last_period_start, period_length,
        notifications_enabled, completed, created_at, updated_at
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString();
    await this.db.executeSql(sql, [
      data.averageCycleLength,
      data.lastPeriodStart,
      data.periodLength,
      data.notificationsEnabled ? 1 : 0,
      data.completed ? 1 : 0,
      now,
      now,
    ]);
  }

  async getOnboarding(): Promise<OnboardingData | null> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM onboarding WHERE id = 1');

    if (results.rows.length === 0) return null;

    const row = results.rows.item(0);
    return {
      averageCycleLength: row.average_cycle_length,
      lastPeriodStart: row.last_period_start,
      periodLength: row.period_length,
      notificationsEnabled: row.notifications_enabled === 1,
      completed: row.completed === 1,
    };
  }

  // Export data as JSON
  async exportData(): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const dayLogs = await this.getDayLogRange('1900-01-01', '2100-12-31');
    const cycles = await this.getAllCycles();
    const settings = await this.getAllSettings();
    const onboarding = await this.getOnboarding();

    return JSON.stringify({
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        dayLogs,
        cycles,
        settings,
        onboarding,
      },
    }, null, 2);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export const database = new DatabaseManager();
export default database;
