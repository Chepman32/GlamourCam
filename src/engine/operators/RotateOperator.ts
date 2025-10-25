import * as ImageManipulator from 'expo-image-manipulator';
import { RotateParams } from '../../types';

/**
 * Rotate operator for image rotation and flipping
 */
export class RotateOperator {
  async apply(inputUri: string, params: RotateParams): Promise<string> {
    const { angle, flipHorizontal, flipVertical } = params;

    if (angle === 0 && !flipHorizontal && !flipVertical) {
      return inputUri;
    }

    try {
      const actions: ImageManipulator.Action[] = [];

      // Rotate
      if (angle !== 0) {
        actions.push({ rotate: angle });
      }

      // Flip
      if (flipHorizontal) {
        actions.push({ flip: ImageManipulator.FlipType.Horizontal });
      }
      if (flipVertical) {
        actions.push({ flip: ImageManipulator.FlipType.Vertical });
      }

      const result = await ImageManipulator.manipulateAsync(
        inputUri,
        actions,
        {
          compress: 1,
          format: ImageManipulator.SaveFormat.PNG,
        }
      );

      return result.uri;
    } catch (error) {
      console.error('Rotate operator error:', error);
      return inputUri;
    }
  }
}
