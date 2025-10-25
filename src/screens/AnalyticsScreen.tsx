import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Canvas, Path, Circle, Line, vec } from '@shopify/react-native-skia';
import { subMonths, format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { useTheme } from '../theme';
import { useCycleStore, useCalendarStore } from '../store';
import { Card } from '../components/Card';
import database from '../database';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;
const CHART_HEIGHT = 200;

const AnalyticsScreen = () => {
  const theme = useTheme();
  const { allCycles, cycleStats, loadCycles } = useCycleStore();
  const [symptomFrequency, setSymptomFrequency] = useState<Record<string, number>>({});

  useEffect(() => {
    loadCycles();
    loadSymptomData();
  }, []);

  const loadSymptomData = async () => {
    try {
      const threeMonthsAgo = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');
      const logs = await database.getDayLogRange(threeMonthsAgo, today);

      const frequency: Record<string, number> = {};
      logs.forEach((log) => {
        log.symptoms.forEach((symptom) => {
          frequency[symptom] = (frequency[symptom] || 0) + 1;
        });
      });

      setSymptomFrequency(frequency);
    } catch (error) {
      console.error('Error loading symptom data:', error);
    }
  };

  const renderCycleLengthChart = () => {
    const recentCycles = allCycles.filter((c) => c.length).slice(0, 6).reverse();

    if (recentCycles.length === 0) {
      return (
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No cycle data available yet
        </Text>
      );
    }

    const maxLength = Math.max(...recentCycles.map((c) => c.length || 0));
    const minLength = Math.min(...recentCycles.map((c) => c.length || 0));
    const range = maxLength - minLength + 10;

    const points = recentCycles.map((cycle, index) => {
      const x = (index / (recentCycles.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((cycle.length! - minLength + 5) / range) * CHART_HEIGHT;
      return { x, y, length: cycle.length! };
    });

    const pathCommands = points
      .map((point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        return `L ${point.x} ${point.y}`;
      })
      .join(' ');

    return (
      <View>
        <Canvas style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = (i / 4) * CHART_HEIGHT;
            return (
              <Line
                key={i}
                p1={vec(0, y)}
                p2={vec(CHART_WIDTH, y)}
                color={theme.colors.chartGrid}
                style="stroke"
                strokeWidth={1}
              />
            );
          })}

          {/* Line chart */}
          <Path
            path={pathCommands}
            color={theme.colors.chartLine}
            style="stroke"
            strokeWidth={3}
          />

          {/* Data points */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={6}
              color={theme.colors.primary}
            />
          ))}
        </Canvas>

        <View style={styles.chartLabels}>
          {points.map((point, index) => (
            <View key={index} style={styles.chartLabel}>
              <Text style={[styles.chartLabelText, { color: theme.colors.textSecondary }]}>
                {point.length}d
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSymptomFrequency = () => {
    const topSymptoms = Object.entries(symptomFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    if (topSymptoms.length === 0) {
      return (
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No symptom data available yet
        </Text>
      );
    }

    const maxCount = topSymptoms[0][1];

    return (
      <View style={styles.symptomList}>
        {topSymptoms.map(([symptom, count]) => (
          <View key={symptom} style={styles.symptomItem}>
            <Text style={[styles.symptomName, { color: theme.colors.text }]}>
              {symptom}
            </Text>
            <View style={styles.symptomBarContainer}>
              <View
                style={[
                  styles.symptomBar,
                  {
                    width: `${(count / maxCount) * 100}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.symptomCount, { color: theme.colors.textSecondary }]}>
              {count}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Analytics</Text>

        {/* Cycle Stats Overview */}
        {cycleStats && (
          <Animated.View entering={FadeIn}>
            <Card padding="lg">
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Cycle Statistics
              </Text>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                    {cycleStats.averageLength}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Avg Cycle Length
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                    {cycleStats.periodLength}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Avg Period Length
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                    ±{Math.round(cycleStats.variance)}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Variance (days)
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                    {allCycles.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Total Cycles
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Cycle Length Trend */}
        <Animated.View entering={FadeIn}>
          <Card padding="lg">
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Cycle Length Trend
            </Text>
            {renderCycleLengthChart()}
          </Card>
        </Animated.View>

        {/* Symptom Frequency */}
        <Animated.View entering={FadeIn}>
          <Card padding="lg">
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Most Common Symptoms (Last 3 Months)
            </Text>
            {renderSymptomFrequency()}
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    alignItems: 'center',
  },
  chartLabelText: {
    fontSize: 12,
  },
  symptomList: {
    gap: 12,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  symptomName: {
    fontSize: 14,
    fontWeight: '500',
    width: 120,
  },
  symptomBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  symptomBar: {
    height: '100%',
    borderRadius: 4,
  },
  symptomCount: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
});

export default AnalyticsScreen;
