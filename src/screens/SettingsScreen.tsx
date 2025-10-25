import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../components/common/Button';
import { useStore } from '../store';
import { COLORS, SIZES, TYPOGRAPHY } from '../constants/theme';
import { ExportFormat, ThemeMode } from '../types';

export const SettingsScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, updateSettings, proUnlocked, unlockPro } = useStore();

  const toggleFormat = () => {
    const formats: ExportFormat[] = ['jpeg', 'png', 'heif'];
    const currentIndex = formats.indexOf(settings.exportFormat);
    const nextFormat = formats[(currentIndex + 1) % formats.length];
    updateSettings({ exportFormat: nextFormat });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Pro Section */}
        {!proUnlocked && (
          <View style={styles.proSection}>
            <Text style={styles.proTitle}>✨ Upgrade to Pro</Text>
            <Text style={styles.proDescription}>
              Unlock all premium features including:
            </Text>
            <View style={styles.featureList}>
              <Text style={styles.feature}>• HD Export (up to 16K)</Text>
              <Text style={styles.feature}>• Advanced Makeup Tools</Text>
              <Text style={styles.feature}>• Premium Filter Packs</Text>
              <Text style={styles.feature}>• Unlimited Edits</Text>
            </View>
            <Button
              title="Upgrade Now - $4.99"
              onPress={unlockPro}
              variant="primary"
              fullWidth
            />
          </View>
        )}

        {proUnlocked && (
          <View style={styles.proActiveSection}>
            <Text style={styles.proActiveText}>✨ Pro Member</Text>
          </View>
        )}

        {/* Export Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Settings</Text>

          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Format</Text>
            <TouchableOpacity onPress={toggleFormat}>
              <Text style={styles.settingValue}>
                {settings.exportFormat.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Quality</Text>
            <Text style={styles.settingValue}>{settings.exportQuality}%</Text>
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Remove Metadata</Text>
            <Switch
              value={settings.removeMetadata}
              onValueChange={(value) =>
                updateSettings({ removeMetadata: value })
              }
              trackColor={{ true: COLORS.light.primary }}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.infoText}>GlamourCam v1.0.0</Text>
          <Text style={styles.infoText}>
            Professional Portrait Retouching
          </Text>
          <Text style={styles.infoText}>© 2025 GlamourCam</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.light.text,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.light.textSecondary,
  },
  content: {
    flex: 1,
  },
  proSection: {
    margin: SIZES.md,
    padding: SIZES.lg,
    backgroundColor: COLORS.light.primary + '20',
    borderRadius: SIZES.radiusLarge,
    borderWidth: 2,
    borderColor: COLORS.light.primary,
  },
  proTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.light.primary,
    marginBottom: SIZES.sm,
  },
  proDescription: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.light.text,
    marginBottom: SIZES.md,
  },
  featureList: {
    marginBottom: SIZES.lg,
  },
  feature: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.light.text,
    marginBottom: SIZES.xs,
  },
  proActiveSection: {
    margin: SIZES.md,
    padding: SIZES.lg,
    backgroundColor: COLORS.light.proGold + '20',
    borderRadius: SIZES.radiusLarge,
    alignItems: 'center',
  },
  proActiveText: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.light.proGold,
  },
  section: {
    margin: SIZES.md,
    padding: SIZES.md,
    backgroundColor: COLORS.light.surface,
    borderRadius: SIZES.radiusLarge,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.light.text,
    marginBottom: SIZES.md,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.light.text,
  },
  settingValue: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.light.primary,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.light.textSecondary,
    marginBottom: SIZES.xs,
  },
});
