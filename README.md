# CycleTrack - Offline Period & Ovulation Tracker

A comprehensive, privacy-focused menstrual health tracking app built with React Native. CycleTrack provides offline-first period and ovulation tracking with beautiful animations, detailed analytics, and zero data collection.

## Features

### Core Features
- **📅 Calendar View** - Visual month grid showing period days, fertile window, and ovulation
- **📝 Daily Logging** - Track period flow, symptoms, mood, vitals (weight, BBT), and notes
- **🔮 Predictions** - On-device cycle predictions using historical data
- **📊 Analytics** - Comprehensive charts and insights about your cycle
- **📚 Insights** - Educational articles about menstrual health
- **⚙️ Settings** - Customizable theme, units, notifications, and data export

### Technical Highlights
- **100% Offline** - All data stored locally with SQLite
- **Private** - No telemetry, no cloud sync, complete privacy
- **Beautiful UI** - Smooth animations with Reanimated 3
- **Custom Graphics** - Skia-powered calendar rendering
- **Gesture-Driven** - Intuitive swipes and interactions
- **Premium Features** - Optional IAP for advanced content

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **React Native Reanimated** - High-performance animations
- **React Native Skia** - Custom 2D graphics rendering
- **Zustand** - Lightweight state management
- **SQLite** - Local database with FTS support
- **React Navigation** - Native navigation
- **date-fns** - Date manipulation utilities

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── DayCell.tsx
│   ├── SymptomChip.tsx
│   └── DailyLogModal.tsx
├── screens/            # Main app screens
│   ├── OnboardingScreen.tsx
│   ├── CalendarScreen.tsx
│   ├── InsightsScreen.tsx
│   ├── AnalyticsScreen.tsx
│   └── SettingsScreen.tsx
├── database/           # SQLite schema and operations
│   ├── schema.ts
│   └── index.ts
├── store/             # Zustand state stores
│   └── index.ts
├── theme/             # Theme system
│   └── index.ts
├── types/             # TypeScript definitions
│   └── index.ts
├── utils/             # Utility functions
│   ├── predictionEngine.ts
│   └── iap.ts
└── navigation/        # Navigation setup
    └── index.tsx
```

## Installation

```bash
# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Data Models

### DayLog
Tracks daily health information:
- Period status and flow level
- Symptoms (physical, emotional, discharge)
- Mood rating (1-5)
- Vitals (weight, basal body temperature)
- Personal notes

### Cycle
Cycle tracking and predictions:
- Start/end dates and length
- Fertile window dates
- Predicted ovulation day
- Next period prediction

### Article
Educational content:
- Title, body, category
- Premium flag for IAP content
- Tags for search/filtering

## Prediction Engine

The offline prediction engine uses:
- **Rolling averages** from historical cycle data
- **Luteal phase length** (typically 14 days)
- **Cycle variance** for accuracy estimation
- **Fertile window** calculation (6 days including ovulation)

All predictions are deterministic and run entirely on-device.

## State Management

Zustand stores are organized by domain:
- `calendarStore` - Current month, day logs, date selection
- `cycleStore` - Cycles, predictions, statistics
- `insightsStore` - Articles and search
- `settingsStore` - User preferences
- `onboardingStore` - Initial setup data
- `uiStore` - Modal visibility and UI state

## Animation System

Powered by Reanimated 3 with spring physics:
- **Spring config**: stiffness 180-320, damping 14-22
- **Timing**: 220-360ms for transitions
- **Gestures**: Pan, pinch, long-press with haptic feedback
- **Skia integration**: Custom calendar day rendering

## Database Schema

SQLite with full-text search:
- `day_logs` - Daily health entries
- `cycles` - Cycle history and predictions
- `articles` - Educational content
- `reminders` - Notification settings
- `user_settings` - App configuration
- FTS tables for notes and article search

## Privacy & Security

- ✅ All data stored locally
- ✅ No network requests (except optional IAP)
- ✅ No analytics or telemetry
- ✅ Optional app lock
- ✅ JSON export for data portability

## Premium Features

Unlock with one-time purchase ($4.99):
- Access to premium educational articles
- Advanced analytics and charts
- Unlimited data export
- Priority support

## Development

```bash
# Start Metro bundler
npm start

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build:ios
npm run build:android
```

## License

MIT License - See LICENSE file for details

## Acknowledgments

Built with React Native, following best practices for offline-first mobile applications with a focus on user privacy and beautiful user experience.

---

**Note**: This is a fully functional menstrual health tracking app designed for privacy-conscious users. All health data stays on your device.
