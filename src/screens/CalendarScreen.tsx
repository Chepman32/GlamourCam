import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  parseISO,
} from 'date-fns';
import { useTheme } from '../theme';
import { useCalendarStore, useCycleStore, useUIStore } from '../store';
import { PredictionEngine } from '../utils/predictionEngine';
import { Card } from '../components/Card';
import { DayCell } from '../components/DayCell';
import DailyLogModal from '../components/DailyLogModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CalendarScreen = () => {
  const theme = useTheme();
  const {
    currentMonth,
    selectedDate,
    dayLogs,
    setCurrentMonth,
    setSelectedDate,
    loadMonthData,
  } = useCalendarStore();

  const { currentCycle, loadCycles, getCurrentCycleDay, getDaysUntilPeriod, getDailyTip } =
    useCycleStore();

  const { isDailyLogOpen, openDailyLog, closeDailyLog } = useUIStore();

  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    loadCycles();
    loadMonthData(currentMonth);
  }, []);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth]);

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    setCalendarDays(days);
  };

  const handlePreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const handleDayPress = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDate(dateStr);
    openDailyLog(dateStr);
  };

  const handleDayLongPress = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    openDailyLog(dateStr);
  };

  const renderDayCell = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLog = dayLogs.get(dateStr);
    const isCurrentMonthDay = isSameMonth(date, currentMonth);

    let isPeriod = dayLog?.period || false;
    let isFertile = false;
    let isOvulation = false;
    let isPredicted = false;

    if (currentCycle) {
      isFertile = PredictionEngine.isInFertileWindow(dateStr, currentCycle);
      isOvulation = PredictionEngine.isOvulationDay(dateStr, currentCycle);
      isPredicted = PredictionEngine.isPredictedPeriod(dateStr, currentCycle);
    }

    return (
      <DayCell
        date={date}
        isPeriod={isPeriod}
        isFertile={isFertile}
        isOvulation={isOvulation}
        isPredicted={isPredicted}
        isSelected={dateStr === selectedDate}
        isCurrentMonth={isCurrentMonthDay}
        onPress={handleDayPress}
        onLongPress={handleDayLongPress}
      />
    );
  };

  const renderHeader = () => (
    <Animated.View entering={FadeIn} style={styles.header}>
      <Card padding="lg">
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.monthButton}>
            <Text style={[styles.monthButtonText, { color: theme.colors.primary }]}>←</Text>
          </TouchableOpacity>

          <Text style={[styles.monthTitle, { color: theme.colors.text }]}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>

          <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
            <Text style={[styles.monthButtonText, { color: theme.colors.primary }]}>→</Text>
          </TouchableOpacity>
        </View>

        {currentCycle && (
          <View style={styles.cycleInfo}>
            <View style={styles.cycleInfoItem}>
              <Text style={[styles.cycleInfoLabel, { color: theme.colors.textSecondary }]}>
                Cycle Day
              </Text>
              <Text style={[styles.cycleInfoValue, { color: theme.colors.primary }]}>
                {getCurrentCycleDay()}
              </Text>
            </View>

            <View style={styles.cycleInfoItem}>
              <Text style={[styles.cycleInfoLabel, { color: theme.colors.textSecondary }]}>
                Days Until Period
              </Text>
              <Text style={[styles.cycleInfoValue, { color: theme.colors.primary }]}>
                {getDaysUntilPeriod()}
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.tipContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            💡 {getDailyTip()}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );

  const renderWeekDays = () => (
    <View style={styles.weekDaysRow}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <View key={day} style={styles.weekDayCell}>
          <Text style={[styles.weekDayText, { color: theme.colors.textSecondary }]}>
            {day}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderCalendarGrid = () => {
    const weeks: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
      <View style={styles.calendarGrid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => (
              <View key={dayIndex} style={styles.dayCellContainer}>
                {renderDayCell(day)}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={[1]}
        renderItem={() => (
          <>
            {renderHeader()}
            {renderWeekDays()}
            {renderCalendarGrid()}
          </>
        )}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />

      <DailyLogModal visible={isDailyLogOpen} onClose={closeDailyLog} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  monthButtonText: {
    fontSize: 24,
    fontWeight: '700',
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  cycleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingVertical: 16,
  },
  cycleInfoItem: {
    alignItems: 'center',
  },
  cycleInfoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  cycleInfoValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  tipContainer: {
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarGrid: {
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayCellContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default CalendarScreen;
