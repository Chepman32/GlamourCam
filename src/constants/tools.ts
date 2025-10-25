import { ToolConfig, ToolType } from '../types';

export const TOOLS: ToolConfig[] = [
  {
    id: 'smooth',
    name: 'Smooth',
    icon: 'blur',
    isPro: false,
    defaultParams: {
      intensity: 50,
      radius: 10,
      skinMaskEnabled: true,
    },
  },
  {
    id: 'blemish',
    name: 'Blemish',
    icon: 'healing',
    isPro: false,
    defaultParams: {
      brushSize: 30,
      feather: 0.5,
    },
  },
  {
    id: 'reshape',
    name: 'Reshape',
    icon: 'transform',
    isPro: false,
    defaultParams: {
      strength: 0,
      radius: 50,
      useLandmarks: true,
    },
  },
  {
    id: 'whiten',
    name: 'Whiten',
    icon: 'brightness',
    isPro: false,
    defaultParams: {
      intensity: 50,
      targetArea: 'teeth',
    },
  },
  {
    id: 'detail',
    name: 'Detail',
    icon: 'tune',
    isPro: false,
    defaultParams: {
      sharpness: 0,
      clarity: 0,
      localContrast: 0,
    },
  },
  {
    id: 'filters',
    name: 'Filters',
    icon: 'filter',
    isPro: false,
    defaultParams: {
      filterId: '',
      intensity: 100,
    },
  },
  {
    id: 'makeup',
    name: 'Makeup',
    icon: 'palette',
    isPro: true,
    defaultParams: {
      lipstickColor: '#FF5252',
      lipstickOpacity: 0,
      blushColor: '#FFB6C1',
      blushOpacity: 0,
      eyeshadowColor: '#8B7355',
      eyeshadowOpacity: 0,
    },
  },
  {
    id: 'crop',
    name: 'Crop',
    icon: 'crop',
    isPro: false,
    defaultParams: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      aspectRatio: undefined,
    },
  },
  {
    id: 'rotate',
    name: 'Rotate',
    icon: 'rotate',
    isPro: false,
    defaultParams: {
      angle: 0,
      flipHorizontal: false,
      flipVertical: false,
    },
  },
];

export const getToolById = (id: ToolType): ToolConfig | undefined => {
  return TOOLS.find((tool) => tool.id === id);
};
