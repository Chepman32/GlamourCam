import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Panel } from '../common/Panel';
import { Slider } from '../common/Slider';
import { ToolType } from '../../types';
import { SIZES, COLORS, TYPOGRAPHY } from '../../constants/theme';

interface ContextPanelProps {
  visible: boolean;
  activeTool: ToolType | null;
  toolParams: Record<string, any>;
  onParamChange: (params: Record<string, any>) => void;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  visible,
  activeTool,
  toolParams,
  onParamChange,
}) => {
  if (!activeTool) {
    return null;
  }

  const renderToolControls = () => {
    switch (activeTool) {
      case 'smooth':
        return (
          <>
            <Slider
              label="Intensity"
              value={toolParams.intensity || 50}
              min={0}
              max={100}
              onChange={(value) => onParamChange({ intensity: value })}
              unit="%"
            />
            <Slider
              label="Radius"
              value={toolParams.radius || 10}
              min={1}
              max={50}
              onChange={(value) => onParamChange({ radius: value })}
              unit="px"
            />
          </>
        );

      case 'detail':
        return (
          <>
            <Slider
              label="Sharpness"
              value={toolParams.sharpness || 0}
              min={-100}
              max={100}
              onChange={(value) => onParamChange({ sharpness: value })}
            />
            <Slider
              label="Clarity"
              value={toolParams.clarity || 0}
              min={0}
              max={100}
              onChange={(value) => onParamChange({ clarity: value })}
              unit="%"
            />
            <Slider
              label="Local Contrast"
              value={toolParams.localContrast || 0}
              min={0}
              max={100}
              onChange={(value) => onParamChange({ localContrast: value })}
              unit="%"
            />
          </>
        );

      case 'whiten':
        return (
          <Slider
            label="Intensity"
            value={toolParams.intensity || 50}
            min={0}
            max={100}
            onChange={(value) => onParamChange({ intensity: value })}
            unit="%"
          />
        );

      case 'reshape':
        return (
          <>
            <Slider
              label="Strength"
              value={toolParams.strength || 0}
              min={-100}
              max={100}
              onChange={(value) => onParamChange({ strength: value })}
            />
            <Slider
              label="Radius"
              value={toolParams.radius || 50}
              min={10}
              max={200}
              onChange={(value) => onParamChange({ radius: value })}
              unit="px"
            />
          </>
        );

      case 'filters':
        return (
          <Slider
            label="Intensity"
            value={toolParams.intensity || 100}
            min={0}
            max={100}
            onChange={(value) => onParamChange({ intensity: value })}
            unit="%"
          />
        );

      case 'rotate':
        return (
          <Slider
            label="Angle"
            value={toolParams.angle || 0}
            min={-180}
            max={180}
            onChange={(value) => onParamChange({ angle: value })}
            unit="°"
          />
        );

      default:
        return <Text style={styles.placeholder}>No controls available</Text>;
    }
  };

  return (
    <Panel visible={visible} position="bottom">
      <View style={styles.header}>
        <Text style={styles.title}>
          {activeTool ? activeTool.charAt(0).toUpperCase() + activeTool.slice(1) : 'Controls'}
        </Text>
      </View>
      <ScrollView style={styles.controls} showsVerticalScrollIndicator={false}>
        {renderToolControls()}
      </ScrollView>
    </Panel>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.light.text,
  },
  controls: {
    maxHeight: 200,
  },
  placeholder: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    paddingVertical: SIZES.lg,
  },
});
