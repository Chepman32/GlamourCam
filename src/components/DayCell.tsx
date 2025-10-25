import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import { useTheme } from '../theme';
import { format, isSameDay, parseISO } from 'date-fns';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface DayCellProps {
  date: Date;
  isPeriod?: boolean;
  isFertile?: boolean;
  isOvulation?: boolean;
  isPredicted?: boolean;
  isSelected?: boolean;
  isCurrentMonth?: boolean;
  onPress?: (date: Date) => void;
  onLongPress?: (date: Date) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  isPeriod = false,
  isFertile = false,
  isOvulation = false,
  isPredicted = false,
  isSelected = false,
  isCurrentMonth = true,
  onPress,
  onLongPress,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { stiffness: 240, damping: 18 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 260 });
  };

  const handlePress = () => {
    onPress?.(date);
  };

  const handleLongPress = () => {
    onLongPress?.(date);
  };

  const getBackgroundColor = () => {
    if (isSelected) return theme.colors.primary;
    if (isPeriod) return theme.colors.periodRed;
    if (isOvulation) return theme.colors.ovulationPurple;
    if (isFertile) return theme.colors.fertileGreen;
    if (isPredicted) return theme.colors.predictedGray;
    return 'transparent';
  };

  const getTextColor = () => {
    if (isSelected || isPeriod || isOvulation || isFertile) return '#FFFFFF';
    if (!isCurrentMonth) return theme.colors.textSecondary;
    return theme.colors.text;
  };

  const cellSize = 44;
  const dotRadius = 3;

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[
        styles.container,
        {
          opacity: isCurrentMonth ? 1 : 0.4,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.canvasContainer}>
        <Canvas style={{ width: cellSize, height: cellSize }}>
          <Group>
            {/* Background circle */}
            <Circle
              cx={cellSize / 2}
              cy={cellSize / 2}
              r={cellSize / 2 - 2}
              color={getBackgroundColor()}
            />
            {/* Selection ring */}
            {isSelected && (
              <Circle
                cx={cellSize / 2}
                cy={cellSize / 2}
                r={cellSize / 2}
                color={theme.colors.primary}
                style="stroke"
                strokeWidth={2}
              />
            )}
            {/* Indicator dots */}
            {isPeriod && !isSelected && (
              <Circle
                cx={cellSize / 2}
                cy={cellSize - 6}
                r={dotRadius}
                color={theme.colors.periodRed}
              />
            )}
          </Group>
        </Canvas>
        <View style={styles.textContainer}>
          <Text style={[styles.dayText, { color: getTextColor() }]}>
            {format(date, 'd')}
          </Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  canvasContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
