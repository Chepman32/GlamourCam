// Offline prediction engine for cycle tracking

import { addDays, differenceInDays, parseISO, format } from 'date-fns';
import type { Cycle, DayLog, CyclePrediction } from '../types';

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_LUTEAL_LENGTH = 14;
const DEFAULT_PERIOD_LENGTH = 5;
const FERTILE_WINDOW_DAYS = 6;

interface CycleStats {
  averageLength: number;
  averageLutealLength: number;
  variance: number;
  periodLength: number;
}

export class PredictionEngine {
  /**
   * Calculate average cycle statistics from historical data
   */
  static calculateCycleStats(cycles: Cycle[], dayLogs: DayLog[]): CycleStats {
    if (cycles.length === 0) {
      return {
        averageLength: DEFAULT_CYCLE_LENGTH,
        averageLutealLength: DEFAULT_LUTEAL_LENGTH,
        variance: 2,
        periodLength: DEFAULT_PERIOD_LENGTH,
      };
    }

    // Calculate average cycle length
    const completedCycles = cycles.filter(c => c.length);
    const totalLength = completedCycles.reduce((sum, c) => sum + (c.length || 0), 0);
    const averageLength = completedCycles.length > 0
      ? Math.round(totalLength / completedCycles.length)
      : DEFAULT_CYCLE_LENGTH;

    // Calculate variance
    const variance = completedCycles.length > 1
      ? Math.sqrt(
          completedCycles.reduce((sum, c) => {
            const diff = (c.length || averageLength) - averageLength;
            return sum + diff * diff;
          }, 0) / completedCycles.length
        )
      : 2;

    // Calculate average period length from day logs
    let periodLengths: number[] = [];
    let currentPeriodStart: string | null = null;
    let currentPeriodLength = 0;

    const sortedLogs = [...dayLogs].sort((a, b) => a.date.localeCompare(b.date));

    for (const log of sortedLogs) {
      if (log.period) {
        if (currentPeriodStart === null) {
          currentPeriodStart = log.date;
          currentPeriodLength = 1;
        } else {
          const dayDiff = differenceInDays(parseISO(log.date), parseISO(currentPeriodStart));
          if (dayDiff === currentPeriodLength) {
            currentPeriodLength++;
          } else {
            periodLengths.push(currentPeriodLength);
            currentPeriodStart = log.date;
            currentPeriodLength = 1;
          }
        }
      } else if (currentPeriodStart !== null) {
        periodLengths.push(currentPeriodLength);
        currentPeriodStart = null;
        currentPeriodLength = 0;
      }
    }

    if (currentPeriodLength > 0) {
      periodLengths.push(currentPeriodLength);
    }

    const periodLength = periodLengths.length > 0
      ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
      : DEFAULT_PERIOD_LENGTH;

    return {
      averageLength,
      averageLutealLength: DEFAULT_LUTEAL_LENGTH, // Could be calculated from BBT data
      variance: Math.min(variance, 7), // Cap variance at 7 days
      periodLength,
    };
  }

  /**
   * Predict next cycle based on historical data
   */
  static predictNextCycle(
    lastPeriodStart: string,
    stats: CycleStats
  ): CyclePrediction {
    const lastPeriodDate = parseISO(lastPeriodStart);

    // Predict ovulation (typically 14 days before next period)
    const ovulationDay = stats.averageLength - stats.averageLutealLength;
    const ovulationDate = format(addDays(lastPeriodDate, ovulationDay), 'yyyy-MM-dd');

    // Fertile window: 5 days before ovulation + ovulation day
    const fertileStart = addDays(lastPeriodDate, ovulationDay - 5);
    const fertile: string[] = [];
    for (let i = 0; i < FERTILE_WINDOW_DAYS; i++) {
      fertile.push(format(addDays(fertileStart, i), 'yyyy-MM-dd'));
    }

    // Predict next period start
    const nextPeriodStart = format(
      addDays(lastPeriodDate, stats.averageLength),
      'yyyy-MM-dd'
    );

    // Predict next period end
    const nextPeriodEnd = format(
      addDays(lastPeriodDate, stats.averageLength + stats.periodLength - 1),
      'yyyy-MM-dd'
    );

    return {
      fertile,
      ovulationDate,
      nextPeriodStart,
      nextPeriodEnd,
    };
  }

  /**
   * Update or create a new cycle based on current data
   */
  static updateCurrentCycle(
    dayLogs: DayLog[],
    existingCycles: Cycle[],
    stats: CycleStats
  ): Cycle | null {
    if (dayLogs.length === 0) return null;

    // Find the most recent period start
    const sortedLogs = [...dayLogs]
      .sort((a, b) => b.date.localeCompare(a.date));

    const lastPeriodLog = sortedLogs.find(log => log.period);
    if (!lastPeriodLog) return null;

    // Check if we already have a cycle for this period
    const existingCycle = existingCycles.find(
      c => c.startDate === lastPeriodLog.date
    );

    const prediction = this.predictNextCycle(lastPeriodLog.date, stats);

    // Check if the cycle has ended (new period started)
    const nextPeriodStarted = dayLogs.some(log =>
      log.period && log.date > lastPeriodLog.date
    );

    let cycleLength: number | undefined;
    let endDate: string | undefined;

    if (nextPeriodStarted) {
      const nextPeriod = dayLogs.find(log =>
        log.period && log.date > lastPeriodLog.date
      );
      if (nextPeriod) {
        endDate = nextPeriod.date;
        cycleLength = differenceInDays(
          parseISO(nextPeriod.date),
          parseISO(lastPeriodLog.date)
        );
      }
    }

    const now = new Date().toISOString();

    return {
      id: existingCycle?.id || `cycle-${lastPeriodLog.date}`,
      startDate: lastPeriodLog.date,
      endDate,
      length: cycleLength,
      predicted: prediction,
      createdAt: existingCycle?.createdAt || now,
      updatedAt: now,
    };
  }

  /**
   * Get cycle day number for a given date
   */
  static getCycleDay(date: string, currentCycle: Cycle): number {
    const daysDiff = differenceInDays(
      parseISO(date),
      parseISO(currentCycle.startDate)
    );
    return daysDiff + 1;
  }

  /**
   * Get days until next period
   */
  static getDaysUntilPeriod(currentCycle: Cycle): number {
    const today = format(new Date(), 'yyyy-MM-dd');
    const nextPeriod = parseISO(currentCycle.predicted.nextPeriodStart);
    const daysUntil = differenceInDays(nextPeriod, parseISO(today));
    return Math.max(0, daysUntil);
  }

  /**
   * Check if a date is in the fertile window
   */
  static isInFertileWindow(date: string, currentCycle: Cycle): boolean {
    return currentCycle.predicted.fertile.includes(date);
  }

  /**
   * Check if a date is ovulation day
   */
  static isOvulationDay(date: string, currentCycle: Cycle): boolean {
    return currentCycle.predicted.ovulationDate === date;
  }

  /**
   * Check if a date is a predicted period day
   */
  static isPredictedPeriod(date: string, currentCycle: Cycle): boolean {
    const predStart = parseISO(currentCycle.predicted.nextPeriodStart);
    const predEnd = parseISO(currentCycle.predicted.nextPeriodEnd);
    const checkDate = parseISO(date);

    return checkDate >= predStart && checkDate <= predEnd;
  }

  /**
   * Get a daily tip based on cycle phase
   */
  static getDailyTip(date: string, currentCycle: Cycle): string {
    const cycleDay = this.getCycleDay(date, currentCycle);
    const isInFertile = this.isInFertileWindow(date, currentCycle);
    const isOvulation = this.isOvulationDay(date, currentCycle);

    if (cycleDay <= 5) {
      return 'Menstruation phase: Stay hydrated and rest when needed.';
    } else if (cycleDay <= 14 && !isOvulation) {
      return 'Follicular phase: Great time for new projects and workouts.';
    } else if (isOvulation) {
      return 'Ovulation: Peak fertility and energy levels.';
    } else if (isInFertile) {
      return 'Fertile window: Higher chance of conception.';
    } else if (cycleDay > 14) {
      return 'Luteal phase: Focus on self-care and relaxation.';
    }

    return 'Track your symptoms daily for better insights.';
  }
}
