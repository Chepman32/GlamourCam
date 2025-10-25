# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- iOS Simulator (Mac only) or Android Studio
- Expo CLI
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd GlamourCam

# Install dependencies
npm install

# Start the development server
npm start
```

## Development Workflow

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator (Mac only)
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Code Structure

#### Components
- `src/components/common/`: Reusable UI components (Button, Slider, etc.)
- `src/components/editor/`: Editor-specific components (TopBar, ToolRail, etc.)

#### Screens
- `src/screens/`: All app screens (Splash, Home, Editor, etc.)

#### State Management
- `src/store/index.ts`: Zustand store with all slices

#### Editing Engine
- `src/engine/EditingEngine.ts`: Core non-destructive editing pipeline
- `src/engine/operators/`: Individual image processing operators

### TypeScript

All files use TypeScript for type safety:

```bash
# Check types
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Code Quality

```bash
# Format code (if prettier is configured)
npm run format

# Lint code (if eslint is configured)
npm run lint
```

## Architecture

### State Management

The app uses Zustand for state management with four main slices:

1. **Session Slice**: Manages edit sessions and undo/redo
2. **Tools Slice**: Manages active tool and parameters
3. **UI Slice**: Manages UI state (panels, canvas transform)
4. **IAP Slice**: Manages in-app purchases

```typescript
// Accessing state
const { activeTool, setActiveTool } = useStore();

// Updating state
setActiveTool('smooth');
```

### Non-Destructive Editing

The editing engine maintains a stack of operations:

```
Source Image (full-res)
    ↓
Preview Generation (2048px max)
    ↓
Operation 1 (smooth)
    ↓
Operation 2 (whiten)
    ↓
...
    ↓
Preview Display
    ↓
Export (replay on full-res)
```

### Adding a New Tool

1. **Add Type Definition** (`src/types/index.ts`):
```typescript
export type ToolType = '...' | 'mynewtool';

export interface MyNewToolParams {
  intensity: number;
  // ...
}
```

2. **Create Operator** (`src/engine/operators/MyNewToolOperator.ts`):
```typescript
export class MyNewToolOperator {
  async apply(inputUri: string, params: MyNewToolParams): Promise<string> {
    // Implementation
    return outputUri;
  }
}
```

3. **Register in Engine** (`src/engine/EditingEngine.ts`):
```typescript
this.operators.set('mynewtool', new MyNewToolOperator());
```

4. **Add Tool Config** (`src/constants/tools.ts`):
```typescript
{
  id: 'mynewtool',
  name: 'My New Tool',
  icon: 'icon-name',
  isPro: false,
  defaultParams: { intensity: 50 }
}
```

5. **Add Controls** (`src/components/editor/ContextPanel.tsx`):
```typescript
case 'mynewtool':
  return <Slider label="Intensity" ... />;
```

## Performance Optimization

### Image Processing
- Use medium-res previews during editing
- Apply full-res processing only on export
- Batch operations where possible

### Animations
- Use Reanimated worklets for 60fps animations
- Keep animations on the UI thread
- Avoid expensive operations in animated components

### Memory Management
- Clean up temporary files after export
- Limit preview resolution
- Use image tiling for large files

## Testing

### Manual Testing Checklist
- [ ] Image selection from gallery
- [ ] Camera capture
- [ ] All tools work correctly
- [ ] Undo/redo functionality
- [ ] Export in all formats
- [ ] Settings persistence
- [ ] Pro feature gating
- [ ] Gesture controls (pinch, pan)
- [ ] Animations smooth at 60fps

### Device Testing
- Test on multiple device sizes
- Test on iOS and Android
- Test with various image sizes
- Test with portrait and landscape images

## Debugging

### React Native Debugger
```bash
# Enable remote debugging
# Shake device → Debug Remote JS
```

### Console Logs
```typescript
// Use console.log for debugging
console.log('Current tool:', activeTool);

// Use console.error for errors
console.error('Export failed:', error);
```

### Performance Profiling
- Use React DevTools Profiler
- Monitor FPS with Reanimated devtools
- Check memory usage in Xcode/Android Studio

## Deployment

### iOS
```bash
# Build for TestFlight
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android
```bash
# Build APK
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

## Troubleshooting

### Common Issues

**"Cannot find module"**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

**Gesture handler not working**
```bash
# Ensure GestureHandlerRootView wraps the app
# Check babel.config.js includes reanimated plugin
```

**Image not loading**
```bash
# Check file permissions
# Verify image URI is correct
# Check expo-image-picker configuration
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
