import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined';
  padding?: keyof ReturnType<typeof useTheme>['spacing'];
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'elevated',
  padding = 'md',
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { stiffness: 240, damping: 18 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withTiming(1, { duration: 260 });
    }
  };

  const Container = onPress ? AnimatedTouchable : Animated.View;

  return (
    <Container
      {...(onPress && {
        onPress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        activeOpacity: 0.9,
      })}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[padding],
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: theme.colors.border,
        },
        variant === 'elevated' && theme.shadows.md,
        animatedStyle,
      ]}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
