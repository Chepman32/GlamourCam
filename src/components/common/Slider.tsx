import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, SIZES, TYPOGRAPHY, ANIMATION } from '../../constants/theme';

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  unit = '',
}) => {
  const sliderWidth = useSharedValue(300);
  const translateX = useSharedValue(
    ((value - min) / (max - min)) * sliderWidth.value
  );

  const updateValue = useCallback(
    (x: number) => {
      const percentage = Math.max(0, Math.min(1, x / sliderWidth.value));
      const rawValue = min + percentage * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      onChange(steppedValue);
    },
    [min, max, step, onChange, sliderWidth.value]
  );

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newX = Math.max(0, Math.min(sliderWidth.value, event.x));
      translateX.value = newX;
      runOnJS(updateValue)(newX);
    })
    .onEnd(() => {
      translateX.value = withSpring(
        ((value - min) / (max - min)) * sliderWidth.value,
        ANIMATION.spring.gentle
      );
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - 12 }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}
          {unit}
        </Text>
      </View>
      <GestureDetector gesture={panGesture}>
        <View
          style={styles.track}
          onLayout={(event) => {
            sliderWidth.value = event.nativeEvent.layout.width;
            translateX.value =
              ((value - min) / (max - min)) * sliderWidth.value;
          }}
        >
          <Animated.View style={[styles.fill, fillStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: COLORS.light.text,
  },
  value: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.light.primary,
  },
  track: {
    height: 4,
    backgroundColor: COLORS.light.border,
    borderRadius: 2,
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: COLORS.light.primary,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.light.primary,
    top: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
