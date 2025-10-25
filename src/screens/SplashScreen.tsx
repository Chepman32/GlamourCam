import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, ANIMATION } from '../constants/theme';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const glitterPosition = useSharedValue(-width);

  useEffect(() => {
    // Fade in and scale up
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withSpring(1, {
      stiffness: 100,
      damping: 15,
    });

    // Glitter sweep animation
    glitterPosition.value = withDelay(
      400,
      withTiming(width * 2, {
        duration: 1200,
        easing: Easing.inOut(Easing.cubic),
      })
    );

    // Navigate to next screen after animation
    const timer = setTimeout(onFinish, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const glitterStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: glitterPosition.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.light.primary, COLORS.light.secondary]}
        style={styles.gradient}
      >
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Text style={styles.logo}>✨ GlamourCam</Text>
          <Text style={styles.tagline}>Professional Portrait Retouching</Text>
        </Animated.View>

        <Animated.View style={[styles.glitter, glitterStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.glitterGradient}
          />
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  glitter: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width,
  },
  glitterGradient: {
    flex: 1,
    width: '100%',
  },
});
