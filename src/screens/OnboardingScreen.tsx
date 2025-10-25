import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  SafeAreaView,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { format, subDays } from 'date-fns';
import { useTheme } from '../theme';
import { useOnboardingStore } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const OnboardingScreen = () => {
  const theme = useTheme();
  const { saveOnboarding, completeOnboarding } = useOnboardingStore();

  const [step, setStep] = useState(0);
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [lastPeriodDate, setLastPeriodDate] = useState(
    format(subDays(new Date(), 7), 'yyyy-MM-dd')
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    await saveOnboarding({
      averageCycleLength: parseInt(cycleLength) || 28,
      lastPeriodStart: lastPeriodDate,
      periodLength: parseInt(periodLength) || 5,
      notificationsEnabled,
      completed: false,
    });
    await completeOnboarding();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={styles.stepContainer}
          >
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Welcome to CycleTrack
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Your private period and ovulation tracker
            </Text>
            <Card padding="lg" variant="outlined">
              <Text style={[styles.description, { color: theme.colors.text }]}>
                • Track your cycle, symptoms, and moods{'\n'}
                • Get predictions for your fertile window{'\n'}
                • 100% offline and private{'\n'}
                • View insights and analytics{'\n'}
              </Text>
            </Card>
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={styles.stepContainer}
          >
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Your Cycle Length
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              How many days is your average cycle?
            </Text>
            <Card padding="lg">
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Cycle Length (days)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
                keyboardType="number-pad"
                value={cycleLength}
                onChangeText={setCycleLength}
                placeholder="28"
                placeholderTextColor={theme.colors.textSecondary}
                maxLength={2}
              />
              <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
                Normal cycle length is between 21-35 days. Default is 28.
              </Text>
            </Card>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={styles.stepContainer}
          >
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Period Details
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Tell us about your last period
            </Text>
            <Card padding="lg">
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Last Period Start Date
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
                value={lastPeriodDate}
                onChangeText={setLastPeriodDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textSecondary}
              />

              <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>
                Period Length (days)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
                keyboardType="number-pad"
                value={periodLength}
                onChangeText={setPeriodLength}
                placeholder="5"
                placeholderTextColor={theme.colors.textSecondary}
                maxLength={1}
              />
            </Card>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={styles.stepContainer}
          >
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Notifications
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Get reminded about upcoming periods
            </Text>
            <Card padding="lg">
              <View style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                    Enable Notifications
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                    Receive reminders for upcoming period and fertile window
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                  thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.surface}
                />
              </View>
            </Card>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index <= step ? theme.colors.primary : theme.colors.border,
                  width: index === step ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {renderStep()}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.buttonRow}>
          {step > 0 && (
            <View style={styles.buttonContainer}>
              <Button title="Back" onPress={handleBack} variant="outline" fullWidth />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Button
              title={step === 3 ? 'Get Started' : 'Next'}
              onPress={handleNext}
              variant="primary"
              fullWidth
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  stepContainer: {
    flex: 1,
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: -16,
  },
  description: {
    fontSize: 16,
    lineHeight: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  hint: {
    fontSize: 14,
    marginTop: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonContainer: {
    flex: 1,
  },
});

export default OnboardingScreen;
