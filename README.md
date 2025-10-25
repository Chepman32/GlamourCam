# GlamourCam - Professional Portrait Retouching App

A fully offline, production-ready portrait retouching application built with React Native and Expo.

## Features

### Core Editing Tools
- **Smooth**: Skin smoothing with bilateral filter simulation
- **Blemish**: Spot removal and healing
- **Reshape**: Facial feature adjustments with mesh warping
- **Whiten**: Teeth and eye whitening
- **Detail**: Sharpness, clarity, and local contrast enhancement
- **Filters**: LUT-based color grading filters
- **Makeup** (Pro): Professional makeup application tools
- **Crop & Rotate**: Basic image transformations

### Advanced Features
- ✨ **Non-destructive editing pipeline**: All edits are reversible
- 📱 **Fully offline**: All processing happens on-device
- 🎨 **Real-time preview**: Instant feedback with 60fps rendering
- 🔄 **Undo/Redo**: Complete edit history management
- 📤 **Multiple export formats**: JPEG, PNG, HEIF support
- 🎯 **Gesture-based controls**: Intuitive pinch, pan, and swipe interactions
- 🔒 **Privacy-first**: Photos never leave your device
- 💫 **Smooth animations**: Powered by Reanimated 3
- 🎭 **Pro features**: IAP integration with premium tools

## Tech Stack

- **Framework**: React Native + Expo
- **State Management**: Zustand
- **Animations**: Reanimated 3
- **Gestures**: React Native Gesture Handler
- **Image Processing**: Expo Image Manipulator
- **Storage**: AsyncStorage for session persistence
- **TypeScript**: Full type safety

## Project Structure

```
GlamourCam/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── editor/          # Editor-specific components
│   │   ├── filters/         # Filter components
│   │   └── settings/        # Settings components
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── EditorScreen.tsx
│   │   ├── FiltersScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/
│   │   └── index.ts         # Zustand store with slices
│   ├── engine/
│   │   ├── EditingEngine.ts # Core editing pipeline
│   │   └── operators/       # Image processing operators
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   ├── constants/
│   │   ├── theme.ts         # Design tokens
│   │   └── tools.ts         # Tool configurations
│   └── utils/
│       └── storage.ts       # AsyncStorage utilities
├── App.tsx                   # Main app entry point
├── app.json                  # Expo configuration
└── package.json
```

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Usage

1. **Select an Image**: Choose from gallery or take a photo
2. **Edit**: Select tools from the rail and adjust parameters
3. **Export**: Save your edited photo to device

### Gestures
- **Pinch**: Zoom in/out on canvas
- **Pan**: Move image around canvas
- **Two-finger drag**: Pan while using a tool
- **Press and hold**: Toggle before/after view
- **Vertical swipe**: Adjust tool intensity (context-dependent)

## Architecture

### Non-Destructive Editing Pipeline

The editing engine implements a non-destructive workflow:

1. **Source Image**: Original full-resolution image
2. **Preview Generation**: Medium-res preview for editing
3. **Operation Stack**: Each edit creates a step
4. **Real-time Preview**: Steps applied to preview
5. **Export**: Steps replayed on full-res source

### State Management

Zustand store with four slices:

- **Session**: Edit sessions, undo/redo stack
- **Tools**: Active tool and parameters
- **UI**: Panel visibility, canvas transform
- **IAP**: Pro features and upsell state

### Image Operators

Each tool has a dedicated operator class:

- `SmoothOperator`: Skin smoothing
- `BlemishOperator`: Spot removal
- `ReshapeOperator`: Facial adjustments
- `WhitenOperator`: Teeth/eye whitening
- `DetailOperator`: Sharpness enhancement
- `FilterOperator`: LUT application
- `CropOperator`: Image cropping
- `RotateOperator`: Rotation and flipping

## Performance Optimizations

- **Tile-based rendering**: Large images processed in chunks
- **Worklet-based gestures**: 60fps gesture handling
- **Coalesced touch events**: Reduced processing overhead
- **GPU acceleration**: Where supported by platform
- **Efficient preview**: Medium-res for editing, full-res for export

## Pro Features (IAP)

- HD Export (up to 16K resolution)
- Advanced Makeup Tools
- Premium Filter Packs
- Unlimited Edit History

## Roadmap

- [ ] Advanced face detection with ML Kit
- [ ] Real-time beauty filters
- [ ] Batch processing
- [ ] Cloud backup (optional)
- [ ] Social sharing
- [ ] Custom LUT creation
- [ ] Portrait lighting effects
- [ ] Background blur/replacement

## License

© 2025 GlamourCam. All rights reserved.

## Support

For issues and feature requests, please contact support@glamourcam.com

---

**Built with ❤️ using React Native and Expo**
