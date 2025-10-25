import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Screen = 'splash' | 'home' | 'editor' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const handleSplashFinish = () => {
    setCurrentScreen('home');
  };

  const handleImageSelected = (uri: string) => {
    setSelectedImageUri(uri);
    setCurrentScreen('editor');
  };

  const handleBackToHome = () => {
    setSelectedImageUri(null);
    setCurrentScreen('home');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleCloseSettings = () => {
    setCurrentScreen('home');
  };

  const handleExportComplete = (uri: string) => {
    // In a real app, this would save to gallery or share
    console.log('Export complete:', uri);
    // Could show a share sheet here
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;

      case 'home':
        return (
          <HomeScreen
            onImageSelected={handleImageSelected}
            onOpenSettings={handleOpenSettings}
          />
        );

      case 'editor':
        return selectedImageUri ? (
          <EditorScreen
            imageUri={selectedImageUri}
            onBack={handleBackToHome}
            onExportComplete={handleExportComplete}
          />
        ) : null;

      case 'settings':
        return <SettingsScreen onClose={handleCloseSettings} />;

      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="auto" />
      {renderScreen()}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
