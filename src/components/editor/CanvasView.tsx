import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { CanvasTransform } from '../../types';
import { ANIMATION } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface CanvasViewProps {
  imageUri: string;
  transform: CanvasTransform;
  onTransformChange: (transform: Partial<CanvasTransform>) => void;
  showOriginal: boolean;
  originalUri?: string;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  imageUri,
  transform,
  onTransformChange,
  showOriginal,
  originalUri,
}) => {
  const scale = useSharedValue(transform.scale);
  const translateX = useSharedValue(transform.translateX);
  const translateY = useSharedValue(transform.translateY);
  const savedScale = useSharedValue(transform.scale);
  const savedTranslateX = useSharedValue(transform.translateX);
  const savedTranslateY = useSharedValue(transform.translateY);

  const updateTransform = (newTransform: Partial<CanvasTransform>) => {
    onTransformChange(newTransform);
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      runOnJS(updateTransform)({ scale: scale.value });
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(updateTransform)({
        translateX: translateX.value,
        translateY: translateY.value,
      });
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const displayUri = showOriginal && originalUri ? originalUri : imageUri;

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={{ uri: displayUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width,
    height,
  },
});
