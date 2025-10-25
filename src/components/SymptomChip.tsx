import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface SymptomChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  category?: 'physical' | 'emotional' | 'discharge';
}

export const SymptomChip: React.FC<SymptomChipProps> = ({
  label,
  selected,
  onToggle,
  category = 'physical',
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { stiffness: 240, damping: 18 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 240, damping: 18 });
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'physical':
        return theme.colors.symptomPhysical;
      case 'emotional':
        return theme.colors.symptomEmotional;
      case 'discharge':
        return theme.colors.symptomDischarge;
    }
  };

  return (
    <AnimatedTouchable
      onPress={onToggle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? getCategoryColor() : theme.colors.surface,
          borderColor: getCategoryColor(),
          borderRadius: theme.borderRadius.xl,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: selected ? '#FFFFFF' : theme.colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    margin: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
