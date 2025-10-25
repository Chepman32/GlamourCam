import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { IconButton } from '../common/IconButton';
import { COLORS, SIZES, TYPOGRAPHY } from '../../constants/theme';

interface TopBarProps {
  onBack: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onBack,
  onUndo,
  onRedo,
  onExport,
  canUndo,
  canRedo,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <IconButton
          icon={<Text style={styles.iconText}>←</Text>}
          onPress={onBack}
        />

        <View style={styles.center}>
          <Text style={styles.title}>Edit Photo</Text>
        </View>

        <View style={styles.actions}>
          <IconButton
            icon={<Text style={styles.iconText}>↶</Text>}
            onPress={onUndo}
            disabled={!canUndo}
          />
          <IconButton
            icon={<Text style={styles.iconText}>↷</Text>}
            onPress={onRedo}
            disabled={!canRedo}
          />
          <IconButton
            icon={<Text style={styles.iconText}>↗</Text>}
            onPress={onExport}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.light.surface,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.light.text,
  },
  actions: {
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  iconText: {
    fontSize: 20,
    color: COLORS.light.text,
  },
});
