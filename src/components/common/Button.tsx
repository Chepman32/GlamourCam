import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, SIZES, TYPOGRAPHY, ANIMATION } from '../../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, ANIMATION.spring.default);
    opacity.value = withTiming(0.7, { duration: ANIMATION.fast });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION.spring.default);
    opacity.value = withTiming(1, { duration: ANIMATION.fast });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        animatedStyle,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFF' : COLORS.light.primary} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              styles[`${variant}Text`],
              styles[`${size}Text`],
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.md,
  },
  primary: {
    backgroundColor: COLORS.light.primary,
  },
  secondary: {
    backgroundColor: COLORS.light.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.light.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    height: 32,
    paddingHorizontal: SIZES.sm,
  },
  medium: {
    height: SIZES.touchTarget,
    paddingHorizontal: SIZES.md,
  },
  large: {
    height: 52,
    paddingHorizontal: SIZES.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    marginLeft: SIZES.xs,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: COLORS.light.primary,
  },
  ghostText: {
    color: COLORS.light.text,
  },
  smallText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
  },
  largeText: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
  },
});
