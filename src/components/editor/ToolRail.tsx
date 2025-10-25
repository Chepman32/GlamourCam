import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { TOOLS } from '../../constants/tools';
import { ToolType } from '../../types';
import { COLORS, SIZES, TYPOGRAPHY, ANIMATION } from '../../constants/theme';

interface ToolRailProps {
  activeTool: ToolType | null;
  onSelectTool: (tool: ToolType) => void;
  proUnlocked: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ToolButton: React.FC<{
  tool: any;
  active: boolean;
  onPress: () => void;
  locked: boolean;
}> = ({ tool, active, onPress, locked }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, ANIMATION.spring.bouncy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION.spring.bouncy);
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.toolButton,
        active && styles.toolButtonActive,
        animatedStyle,
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.toolIcon}>
        <Text style={styles.toolIconText}>{getToolIcon(tool.icon)}</Text>
        {locked && <View style={styles.lockBadge}><Text style={styles.lockIcon}>🔒</Text></View>}
      </View>
      <Text
        style={[styles.toolName, active && styles.toolNameActive]}
        numberOfLines={1}
      >
        {tool.name}
      </Text>
    </AnimatedTouchable>
  );
};

export const ToolRail: React.FC<ToolRailProps> = ({
  activeTool,
  onSelectTool,
  proUnlocked,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={TOOLS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ToolButton
            tool={item}
            active={activeTool === item.id}
            onPress={() => onSelectTool(item.id)}
            locked={item.isPro && !proUnlocked}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

function getToolIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    blur: '◐',
    healing: '⊕',
    transform: '⊛',
    brightness: '☀',
    tune: '⊞',
    filter: '◈',
    palette: '⬢',
    crop: '⊡',
    rotate: '↻',
  };
  return iconMap[icon] || '●';
}

const styles = StyleSheet.create({
  container: {
    width: SIZES.toolRailWidth,
    backgroundColor: COLORS.light.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.light.border,
    paddingVertical: SIZES.sm,
  },
  toolButton: {
    alignItems: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xs,
  },
  toolButtonActive: {
    backgroundColor: COLORS.light.primary + '20',
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xs,
    position: 'relative',
  },
  toolIconText: {
    fontSize: 24,
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.light.proGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 10,
  },
  toolName: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
  },
  toolNameActive: {
    color: COLORS.light.primary,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
  },
});
