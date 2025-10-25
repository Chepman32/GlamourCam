import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/common/Button';
import { COLORS, SIZES, TYPOGRAPHY } from '../constants/theme';

interface HomeScreenProps {
  onImageSelected: (uri: string) => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onImageSelected,
  onOpenSettings,
}) => {
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>✨ GlamourCam</Text>
        <Text style={styles.tagline}>Professional Portrait Retouching</Text>
      </View>

      <View style={styles.content}>
        <Button
          title="Choose from Gallery"
          onPress={pickImage}
          variant="primary"
          size="large"
          fullWidth
        />
        <Button
          title="Take Photo"
          onPress={takePhoto}
          variant="outline"
          size="large"
          fullWidth
          style={styles.button}
        />
        <Button
          title="Settings"
          onPress={onOpenSettings}
          variant="ghost"
          size="medium"
          fullWidth
          style={styles.button}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All processing happens on your device
        </Text>
        <Text style={styles.footerText}>
          Your photos never leave your phone
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    padding: SIZES.xxl,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.light.primary,
    marginBottom: SIZES.sm,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  button: {
    marginTop: SIZES.md,
  },
  footer: {
    padding: SIZES.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
  },
});
