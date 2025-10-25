import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, SIZES, ANIMATION } from '../../constants/theme';

interface PanelProps {
  children: React.ReactNode;
  visible?: boolean;
  position?: 'bottom' | 'top' | 'left' | 'right';
  style?: ViewStyle;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  visible = true,
  position = 'bottom',
  style,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateValue = visible ? 0 : getHiddenTranslate(position);

    switch (position) {
      case 'bottom':
        return {
          transform: [
            {
              translateY: withSpring(translateValue, ANIMATION.spring.default),
            },
          ],
        };
      case 'top':
        return {
          transform: [
            {
              translateY: withSpring(translateValue, ANIMATION.spring.default),
            },
          ],
        };
      case 'left':
        return {
          transform: [
            {
              translateX: withSpring(translateValue, ANIMATION.spring.default),
            },
          ],
        };
      case 'right':
        return {
          transform: [
            {
              translateX: withSpring(translateValue, ANIMATION.spring.default),
            },
          ],
        };
      default:
        return {};
    }
  });

  return (
    <Animated.View
      style={[
        styles.panel,
        styles[position],
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

function getHiddenTranslate(position: string): number {
  switch (position) {
    case 'bottom':
      return 300;
    case 'top':
      return -300;
    case 'left':
      return -300;
    case 'right':
      return 300;
    default:
      return 0;
  }
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: COLORS.light.surface,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  left: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
});
