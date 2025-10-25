import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TopBar } from '../components/editor/TopBar';
import { ToolRail } from '../components/editor/ToolRail';
import { CanvasView } from '../components/editor/CanvasView';
import { ContextPanel } from '../components/editor/ContextPanel';
import { useStore } from '../store';
import { ToolType, EditStep } from '../types';
import { EditingEngine } from '../engine/EditingEngine';
import { SIZES } from '../constants/theme';

interface EditorScreenProps {
  imageUri: string;
  onBack: () => void;
  onExportComplete: (uri: string) => void;
}

export const EditorScreen: React.FC<EditorScreenProps> = ({
  imageUri,
  onBack,
  onExportComplete,
}) => {
  const [engine] = useState(() => new EditingEngine(imageUri));
  const [previewUri, setPreviewUri] = useState<string>(imageUri);

  const {
    activeTool,
    setActiveTool,
    toolParams,
    updateToolParams,
    undoStack,
    redoStack,
    undo,
    redo,
    addStep,
    canvasTransform,
    setCanvasTransform,
    contextPanelVisible,
    showOriginal,
    proUnlocked,
    setExporting,
    settings,
  } = useStore();

  useEffect(() => {
    // Generate preview when component mounts
    engine.generatePreview().then(setPreviewUri);

    return () => {
      engine.cleanup();
    };
  }, []);

  const handleSelectTool = (tool: ToolType) => {
    setActiveTool(tool === activeTool ? null : tool);
  };

  const handleParamChange = (params: Record<string, any>) => {
    updateToolParams(params);

    // Create and add editing step
    if (activeTool) {
      const step: EditStep = {
        id: `step_${Date.now()}`,
        type: activeTool,
        params: { ...toolParams, ...params },
        timestamp: Date.now(),
      };

      addStep(step);

      // Apply step to preview
      engine.applyStep(previewUri, step).then(setPreviewUri);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true, 0);

      const exportUri = await engine.export(undoStack, {
        format: settings.exportFormat,
        quality: settings.exportQuality,
        removeMetadata: settings.removeMetadata,
      });

      setExporting(false);
      onExportComplete(exportUri);

      Alert.alert('Success', 'Image exported successfully!');
    } catch (error) {
      setExporting(false);
      Alert.alert('Error', 'Failed to export image');
      console.error('Export error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        onBack={onBack}
        onUndo={undo}
        onRedo={redo}
        onExport={handleExport}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />

      <View style={styles.content}>
        <ToolRail
          activeTool={activeTool}
          onSelectTool={handleSelectTool}
          proUnlocked={proUnlocked}
        />

        <CanvasView
          imageUri={previewUri}
          originalUri={imageUri}
          transform={canvasTransform}
          onTransformChange={setCanvasTransform}
          showOriginal={showOriginal}
        />
      </View>

      <ContextPanel
        visible={contextPanelVisible && activeTool !== null}
        activeTool={activeTool}
        toolParams={toolParams}
        onParamChange={handleParamChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});
