import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Slider } from '../components/common/Slider';
import { Button } from '../components/common/Button';
import { COLORS, SIZES, TYPOGRAPHY } from '../constants/theme';

interface Filter {
  id: string;
  name: string;
  thumbnailUri: string;
  isPro: boolean;
}

const SAMPLE_FILTERS: Filter[] = [
  { id: 'natural', name: 'Natural', thumbnailUri: '', isPro: false },
  { id: 'vivid', name: 'Vivid', thumbnailUri: '', isPro: false },
  { id: 'warm', name: 'Warm', thumbnailUri: '', isPro: false },
  { id: 'cool', name: 'Cool', thumbnailUri: '', isPro: false },
  { id: 'vintage', name: 'Vintage', thumbnailUri: '', isPro: true },
  { id: 'dramatic', name: 'Dramatic', thumbnailUri: '', isPro: true },
];

interface FiltersScreenProps {
  onApply: (filterId: string, intensity: number) => void;
  onClose: () => void;
  proUnlocked: boolean;
}

export const FiltersScreen: React.FC<FiltersScreenProps> = ({
  onApply,
  onClose,
  proUnlocked,
}) => {
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(null);
  const [intensity, setIntensity] = React.useState(100);

  const handleApply = () => {
    if (selectedFilter) {
      onApply(selectedFilter, intensity);
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={SAMPLE_FILTERS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterItem,
              selectedFilter === item.id && styles.filterItemSelected,
            ]}
            onPress={() => setSelectedFilter(item.id)}
          >
            <View style={styles.filterThumbnail}>
              {item.isPro && !proUnlocked && (
                <View style={styles.proBadge}>
                  <Text style={styles.proText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.filterName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedFilter && (
        <View style={styles.controls}>
          <Slider
            label="Intensity"
            value={intensity}
            min={0}
            max={100}
            onChange={setIntensity}
            unit="%"
          />
        </View>
      )}

      <View style={styles.footer}>
        <Button title="Apply Filter" onPress={handleApply} fullWidth />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.light.text,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.light.textSecondary,
  },
  filterList: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
  },
  filterItem: {
    marginRight: SIZES.md,
    alignItems: 'center',
  },
  filterItemSelected: {
    opacity: 1,
  },
  filterThumbnail: {
    width: 80,
    height: 120,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.light.surface,
    marginBottom: SIZES.xs,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proBadge: {
    position: 'absolute',
    top: SIZES.xs,
    right: SIZES.xs,
    backgroundColor: COLORS.light.proGold,
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSmall,
  },
  proText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: '#FFF',
  },
  filterName: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.light.text,
  },
  controls: {
    padding: SIZES.md,
  },
  footer: {
    padding: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
});
