import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../theme';
import { useSettingsStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import database from '../database';
import { initIAP, purchasePremium } from '../utils/iap';

const SettingsScreen = () => {
  const theme = useTheme();
  const { settings, loadSettings, updateSetting, setPremium } = useSettingsStore();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadSettings();
    initIAP();
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    updateSetting('theme', newTheme);
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const jsonData = await database.exportData();

      // Share the JSON data
      await Share.share({
        message: jsonData,
        title: 'Export CycleTrack Data',
      });

      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePurchasePremium = async () => {
    try {
      const success = await purchasePremium();
      if (success) {
        await setPremium(true);
        Alert.alert('Success', 'Premium features unlocked!');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Purchase failed. Please try again.');
    }
  };

  const renderSettingRow = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
        thumbColor={value ? theme.colors.primary : theme.colors.surface}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>

        {/* Premium Section */}
        {!settings.isPremium && (
          <Animated.View entering={FadeIn}>
            <Card padding="lg" variant="elevated">
              <View
                style={[
                  styles.premiumHeader,
                  { backgroundColor: theme.colors.primaryLight },
                ]}
              >
                <Text style={[styles.premiumTitle, { color: theme.colors.primaryDark }]}>
                  ⭐ Upgrade to Premium
                </Text>
              </View>

              <View style={styles.premiumFeatures}>
                <Text style={[styles.featureItem, { color: theme.colors.text }]}>
                  ✓ Access to premium articles
                </Text>
                <Text style={[styles.featureItem, { color: theme.colors.text }]}>
                  ✓ Advanced analytics and charts
                </Text>
                <Text style={[styles.featureItem, { color: theme.colors.text }]}>
                  ✓ Export unlimited data
                </Text>
                <Text style={[styles.featureItem, { color: theme.colors.text }]}>
                  ✓ Priority support
                </Text>
              </View>

              <Button
                title="Upgrade Now - $4.99"
                onPress={handlePurchasePremium}
                variant="primary"
                fullWidth
              />
            </Card>
          </Animated.View>
        )}

        {/* Appearance */}
        <Animated.View entering={FadeIn}>
          <Card padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Appearance
            </Text>

            <View style={styles.themeButtons}>
              {(['light', 'dark', 'auto'] as const).map((themeOption) => (
                <TouchableOpacity
                  key={themeOption}
                  onPress={() => handleThemeChange(themeOption)}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor:
                        settings.theme === themeOption
                          ? theme.colors.primary
                          : theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      {
                        color:
                          settings.theme === themeOption
                            ? '#FFFFFF'
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Notifications */}
        <Animated.View entering={FadeIn}>
          <Card padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Notifications
            </Text>

            {renderSettingRow(
              'Enable Notifications',
              'Receive reminders for upcoming period and fertile window',
              settings.notificationsEnabled,
              (value) => updateSetting('notificationsEnabled', value)
            )}
          </Card>
        </Animated.View>

        {/* Privacy & Security */}
        <Animated.View entering={FadeIn}>
          <Card padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Privacy & Security
            </Text>

            {renderSettingRow(
              'App Lock',
              'Require authentication to open the app',
              settings.appLockEnabled,
              (value) => updateSetting('appLockEnabled', value)
            )}
          </Card>
        </Animated.View>

        {/* Units */}
        <Animated.View entering={FadeIn}>
          <Card padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Units
            </Text>

            <View style={styles.settingRow}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Temperature Unit
              </Text>
              <View style={styles.unitButtons}>
                {(['celsius', 'fahrenheit'] as const).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => updateSetting('temperatureUnit', unit)}
                    style={[
                      styles.unitButton,
                      {
                        backgroundColor:
                          settings.temperatureUnit === unit
                            ? theme.colors.primary
                            : theme.colors.surface,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        {
                          color:
                            settings.temperatureUnit === unit
                              ? '#FFFFFF'
                              : theme.colors.text,
                        },
                      ]}
                    >
                      {unit === 'celsius' ? '°C' : '°F'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.settingRow, { marginTop: 16 }]}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Weight Unit
              </Text>
              <View style={styles.unitButtons}>
                {(['kg', 'lbs'] as const).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => updateSetting('weightUnit', unit)}
                    style={[
                      styles.unitButton,
                      {
                        backgroundColor:
                          settings.weightUnit === unit
                            ? theme.colors.primary
                            : theme.colors.surface,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        {
                          color:
                            settings.weightUnit === unit
                              ? '#FFFFFF'
                              : theme.colors.text,
                        },
                      ]}
                    >
                      {unit.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Data Management */}
        <Animated.View entering={FadeIn}>
          <Card padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Data Management
            </Text>

            <Button
              title="Export Data"
              onPress={handleExportData}
              variant="outline"
              fullWidth
              loading={isExporting}
            />

            <Text style={[styles.dataNote, { color: theme.colors.textSecondary }]}>
              Export all your data as JSON for backup or transfer
            </Text>
          </Card>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeIn}>
          <Card padding="lg">
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              About
            </Text>

            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
                Version
              </Text>
              <Text style={[styles.aboutValue, { color: theme.colors.text }]}>
                1.0.0
              </Text>
            </View>

            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
                Privacy
              </Text>
              <Text style={[styles.aboutValue, { color: theme.colors.text }]}>
                100% Offline
              </Text>
            </View>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  premiumHeader: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  premiumFeatures: {
    marginBottom: 16,
    gap: 8,
  },
  featureItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dataNote: {
    fontSize: 14,
    marginTop: 8,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: 16,
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
