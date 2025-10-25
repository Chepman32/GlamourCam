// Core type definitions for GlamourCam

export type ToolType =
  | 'smooth'
  | 'blemish'
  | 'reshape'
  | 'whiten'
  | 'detail'
  | 'filters'
  | 'makeup'
  | 'crop'
  | 'rotate';

export type ExportFormat = 'jpeg' | 'heif' | 'png';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface EditStep {
  id: string;
  type: ToolType;
  params: Record<string, any>;
  maskRef?: string;
  timestamp: number;
}

export interface EditSession {
  id: string;
  srcUri: string;
  previewUri?: string;
  steps: EditStep[];
  masks: Record<string, MaskData>;
  createdAt: string;
  updatedAt: string;
  thumbnailUri?: string;
}

export interface MaskData {
  id: string;
  data: number[]; // Mask pixel data
  width: number;
  height: number;
}

export interface Settings {
  theme: ThemeMode;
  exportQuality: number; // 0-100
  exportFormat: ExportFormat;
  defaultTool: ToolType;
  removeMetadata: boolean;
  proUnlocked: boolean;
}

export interface ToolConfig {
  id: ToolType;
  name: string;
  icon: string;
  isPro: boolean;
  defaultParams: Record<string, any>;
}

export interface FilterLUT {
  id: string;
  name: string;
  thumbnailUri: string;
  lutData: number[][][]; // 3D LUT data
  isPro: boolean;
}

export interface BrushStroke {
  points: Point[];
  pressure: number[];
  timestamp: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface CanvasTransform {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
}

export interface ExportOptions {
  format: ExportFormat;
  quality: number;
  removeMetadata: boolean;
  maxResolution?: number;
}

export interface IAPProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
}

// Operator-specific parameter types
export interface SmoothParams {
  intensity: number; // 0-100
  radius: number;
  skinMaskEnabled: boolean;
}

export interface BlemishParams {
  brushSize: number;
  feather: number;
}

export interface ReshapeParams {
  strength: number; // -100 to 100
  radius: number;
  useLandmarks: boolean;
}

export interface WhitenParams {
  intensity: number; // 0-100
  targetArea: 'teeth' | 'eyes' | 'custom';
}

export interface DetailParams {
  sharpness: number; // -100 to 100
  clarity: number; // 0-100
  localContrast: number; // 0-100
}

export interface FilterParams {
  filterId: string;
  intensity: number; // 0-100
}

export interface MakeupParams {
  lipstickColor?: string;
  lipstickOpacity?: number;
  blushColor?: string;
  blushOpacity?: number;
  eyeshadowColor?: string;
  eyeshadowOpacity?: number;
}

export interface CropParams {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: number;
}

export interface RotateParams {
  angle: number; // degrees
  flipHorizontal: boolean;
  flipVertical: boolean;
}
