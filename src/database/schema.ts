// SQLite database schema and initialization

export const DB_NAME = 'cycletrack.db';
export const DB_VERSION = '1.0';

export const CREATE_TABLES = `
-- Day logs table
CREATE TABLE IF NOT EXISTS day_logs (
  date TEXT PRIMARY KEY NOT NULL,
  period INTEGER NOT NULL DEFAULT 0,
  flow TEXT,
  symptoms TEXT,
  mood INTEGER,
  weight REAL,
  bbt REAL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Cycles table
CREATE TABLE IF NOT EXISTS cycles (
  id TEXT PRIMARY KEY NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  length INTEGER,
  predicted_fertile TEXT,
  predicted_ovulation TEXT,
  predicted_next_period_start TEXT,
  predicted_next_period_end TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  premium INTEGER NOT NULL DEFAULT 0,
  tags TEXT,
  created_at TEXT NOT NULL
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  days_before INTEGER,
  time TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Onboarding data table
CREATE TABLE IF NOT EXISTS onboarding (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  average_cycle_length INTEGER,
  last_period_start TEXT,
  period_length INTEGER,
  notifications_enabled INTEGER,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_day_logs_date ON day_logs(date);
CREATE INDEX IF NOT EXISTS idx_day_logs_period ON day_logs(period);
CREATE INDEX IF NOT EXISTS idx_cycles_start_date ON cycles(start_date);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_premium ON articles(premium);

-- Full-text search for notes and articles
CREATE VIRTUAL TABLE IF NOT EXISTS day_logs_fts USING fts5(
  date,
  notes,
  content=day_logs,
  content_rowid=rowid
);

CREATE VIRTUAL TABLE IF NOT EXISTS articles_fts USING fts5(
  title,
  body,
  content=articles,
  content_rowid=rowid
);
`;

export const SEED_ARTICLES = `
INSERT OR IGNORE INTO articles (id, title, body, category, premium, tags, created_at) VALUES
('art-1', 'Understanding Your Menstrual Cycle', 'Your menstrual cycle is counted from the first day of your period up to the first day of your next period. The average cycle is 28 days, but cycles between 21-35 days are normal. The cycle has four phases: menstruation, the follicular phase, ovulation, and the luteal phase.', 'education', 0, '["basics","cycle","education"]', datetime('now')),
('art-2', 'Tracking Ovulation', 'Ovulation typically occurs around day 14 of a 28-day cycle. Signs include changes in cervical mucus (becoming clear and stretchy like egg whites), a slight increase in basal body temperature, and sometimes mild pelvic pain. Tracking these signs can help predict your fertile window.', 'education', 0, '["ovulation","fertility","tracking"]', datetime('now')),
('art-3', 'Common Period Symptoms', 'Period symptoms can include cramps, bloating, tender breasts, fatigue, mood changes, and headaches. These are caused by hormonal changes in your body. Tracking symptoms helps identify patterns and can be useful information for healthcare providers.', 'health', 0, '["symptoms","health","pms"]', datetime('now')),
('art-4', 'Advanced Fertility Insights', 'Understanding cervical fluid patterns, basal body temperature charting, and hormone fluctuations can significantly improve fertility awareness. This premium content includes detailed charts and personalized interpretation guides.', 'fertility', 1, '["premium","fertility","advanced"]', datetime('now')),
('art-5', 'Cycle Irregularities Explained', 'Irregular cycles can be caused by stress, diet changes, exercise, illness, or underlying health conditions like PCOS or thyroid disorders. This guide helps you understand what is normal variation versus when to consult a healthcare provider.', 'health', 1, '["premium","health","irregular"]', datetime('now')),
('art-6', 'Nutrition for Hormonal Balance', 'Certain nutrients support hormonal health throughout your cycle. Learn which foods to emphasize during different phases for optimal energy, mood, and symptom management.', 'lifestyle', 0, '["nutrition","lifestyle","health"]', datetime('now')),
('art-7', 'Exercise Throughout Your Cycle', 'Your energy and strength levels naturally fluctuate throughout your cycle. This guide helps you align your workouts with your cycle phases for better results and recovery.', 'lifestyle', 1, '["premium","exercise","lifestyle"]', datetime('now')),
('art-8', 'Managing Period Pain', 'Natural and medical approaches to managing menstrual cramps, including heat therapy, gentle exercise, supplements, and when to consider medical treatment options.', 'health', 0, '["pain","health","symptoms"]', datetime('now'));
`;
