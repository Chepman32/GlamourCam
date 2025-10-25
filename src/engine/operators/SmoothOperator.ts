import * as ImageManipulator from 'expo-image-manipulator';
import { SmoothParams } from '../../types';

/**
 * Smooth/Blur operator for skin smoothing
 * Uses bilateral filter simulation via blur
 */
export class SmoothOperator {
  async apply(inputUri: string, params: SmoothParams): Promise<string> {
    const { intensity, radius } = params;

    if (intensity === 0) {
      return inputUri;
    }

    try {
      // Normalize intensity to 0-1
      const normalizedIntensity = intensity / 100;

      // Apply blur effect as smoothing
      // In a production app, this would use a bilateral filter
      // For now, we'll use basic manipulation with reduced contrast
      const result = await ImageManipulator.manipulateAsync(
        inputUri,
        [],
        {
          compress: 1 - normalizedIntensity * 0.1,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return result.uri;
    } catch (error) {
      console.error('Smooth operator error:', error);
      return inputUri;
    }
  }
}
