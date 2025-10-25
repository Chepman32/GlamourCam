import { EditStep, EditSession, ExportOptions } from '../types';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

// Import operators
import { SmoothOperator } from './operators/SmoothOperator';
import { BlemishOperator } from './operators/BlemishOperator';
import { ReshapeOperator } from './operators/ReshapeOperator';
import { WhitenOperator } from './operators/WhitenOperator';
import { DetailOperator } from './operators/DetailOperator';
import { FilterOperator } from './operators/FilterOperator';
import { CropOperator } from './operators/CropOperator';
import { RotateOperator } from './operators/RotateOperator';

/**
 * Core editing engine that manages the non-destructive editing pipeline
 */
export class EditingEngine {
  private sourceUri: string;
  private previewUri: string | null = null;
  private operators: Map<string, any>;

  constructor(sourceUri: string) {
    this.sourceUri = sourceUri;
    this.operators = new Map();
    this.initializeOperators();
  }

  private initializeOperators() {
    this.operators.set('smooth', new SmoothOperator());
    this.operators.set('blemish', new BlemishOperator());
    this.operators.set('reshape', new ReshapeOperator());
    this.operators.set('whiten', new WhitenOperator());
    this.operators.set('detail', new DetailOperator());
    this.operators.set('filters', new FilterOperator());
    this.operators.set('crop', new CropOperator());
    this.operators.set('rotate', new RotateOperator());
  }

  /**
   * Generate preview at medium resolution for editing
   */
  async generatePreview(maxSize: number = 2048): Promise<string> {
    try {
      // Get image info
      const info = await ImageManipulator.manipulateAsync(
        this.sourceUri,
        [],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      // Calculate scaled dimensions
      const scale = Math.min(1, maxSize / Math.max(info.width, info.height));
      const width = Math.floor(info.width * scale);
      const height = Math.floor(info.height * scale);

      // Create preview
      const result = await ImageManipulator.manipulateAsync(
        this.sourceUri,
        [{ resize: { width, height } }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      this.previewUri = result.uri;
      return result.uri;
    } catch (error) {
      console.error('Error generating preview:', error);
      throw error;
    }
  }

  /**
   * Apply a single editing step to an image
   */
  async applyStep(
    inputUri: string,
    step: EditStep
  ): Promise<string> {
    const operator = this.operators.get(step.type);
    if (!operator) {
      console.warn(`Unknown operator: ${step.type}`);
      return inputUri;
    }

    try {
      return await operator.apply(inputUri, step.params);
    } catch (error) {
      console.error(`Error applying ${step.type}:`, error);
      return inputUri;
    }
  }

  /**
   * Apply all steps in sequence to create final preview
   */
  async applySteps(steps: EditStep[]): Promise<string> {
    let currentUri = this.previewUri || this.sourceUri;

    for (const step of steps) {
      currentUri = await this.applyStep(currentUri, step);
    }

    return currentUri;
  }

  /**
   * Export final image at full resolution
   */
  async export(
    steps: EditStep[],
    options: ExportOptions
  ): Promise<string> {
    let currentUri = this.sourceUri;

    try {
      // Apply all steps at full resolution
      for (const step of steps) {
        currentUri = await this.applyStep(currentUri, step);
      }

      // Determine format
      let format: ImageManipulator.SaveFormat;
      switch (options.format) {
        case 'png':
          format = ImageManipulator.SaveFormat.PNG;
          break;
        case 'heif':
          // HEIF not directly supported, fallback to JPEG
          format = ImageManipulator.SaveFormat.JPEG;
          break;
        default:
          format = ImageManipulator.SaveFormat.JPEG;
      }

      // Final export with quality settings
      const result = await ImageManipulator.manipulateAsync(
        currentUri,
        [],
        {
          compress: options.quality / 100,
          format,
        }
      );

      // Remove metadata if requested
      if (options.removeMetadata) {
        // Metadata removal is handled by default in expo-image-manipulator
      }

      return result.uri;
    } catch (error) {
      console.error('Error exporting image:', error);
      throw error;
    }
  }

  /**
   * Get image dimensions
   */
  async getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
    const result = await ImageManipulator.manipulateAsync(uri, [], {
      format: ImageManipulator.SaveFormat.PNG,
    });
    return { width: result.width, height: result.height };
  }

  /**
   * Cleanup temporary files
   */
  async cleanup() {
    if (this.previewUri) {
      try {
        await FileSystem.deleteAsync(this.previewUri, { idempotent: true });
      } catch (error) {
        console.error('Error cleaning up preview:', error);
      }
    }
  }
}
