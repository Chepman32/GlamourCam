import * as ImageManipulator from 'expo-image-manipulator';
import { CropParams } from '../../types';

/**
 * Crop operator for image cropping
 */
export class CropOperator {
  async apply(inputUri: string, params: CropParams): Promise<string> {
    const { x, y, width, height } = params;

    try {
      const result = await ImageManipulator.manipulateAsync(
        inputUri,
        [
          {
            crop: {
              originX: x,
              originY: y,
              width,
              height,
            },
          },
        ],
        {
          compress: 1,
          format: ImageManipulator.SaveFormat.PNG,
        }
      );

      return result.uri;
    } catch (error) {
      console.error('Crop operator error:', error);
      return inputUri;
    }
  }
}
