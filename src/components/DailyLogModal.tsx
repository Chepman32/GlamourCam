import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { useTheme } from '../theme';
import { useCalendarStore } from '../store';
import { SYMPTOM_CATEGORIES, FlowLevel, DayLog } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { SymptomChip } from './SymptomChip';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DailyLogModalProps {
  visible: boolean;
  onClose: () => void;
}

const DailyLogModal: React.FC<DailyLogModalProps> = ({ visible, onClose }) => {
  const theme = useTheme();
  const { selectedDate, getDayLog, saveDayLog } = useCalendarStore();

  const [isPeriod, setIsPeriod] = useState(false);
  const [flow, setFlow] = useState<FlowLevel>('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<number>(3);
  const [weight, setWeight] = useState('');
  const [bbt, setBbt] = useState('');
  const [notes, setNotes] = useState('');

  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { stiffness: 240, damping: 18 });
      loadDayLog();
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 260 });
    }
  }, [visible]);

  useEffect(() => {
    if (selectedDate) {
      loadDayLog();
    }
  }, [selectedDate]);

  const loadDayLog = () => {
    const log = getDayLog(selectedDate);
    if (log) {
      setIsPeriod(log.period);
      setFlow(log.flow || 'none');
      setSelectedSymptoms(log.symptoms);
      setMood(log.mood || 3);
      setWeight(log.weight?.toString() || '');
      setBbt(log.bbt?.toString() || '');
      setNotes(log.notes || '');
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setIsPeriod(false);
    setFlow('none');
    setSelectedSymptoms([]);
    setMood(3);
    setWeight('');
    setBbt('');
    setNotes('');
  };

  const handleSave = async () => {
    const now = new Date().toISOString();
    const existingLog = getDayLog(selectedDate);

    const log: DayLog = {
      date: selectedDate,
      period: isPeriod,
      flow: isPeriod ? flow : undefined,
      symptoms: selectedSymptoms,
      mood,
      weight: weight ? parseFloat(weight) : undefined,
      bbt: bbt ? parseFloat(bbt) : undefined,
      notes: notes.trim() || undefined,
      createdAt: existingLog?.createdAt || now,
      updatedAt: now,
    };

    await saveDayLog(log);
    onClose();
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 260 });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, { stiffness: 240, damping: 18 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.background },
              animatedStyle,
            ]}
          >
            {/* Pull handle */}
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Header */}
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {format(new Date(selectedDate), 'MMMM d, yyyy')}
              </Text>

              {/* Period Section */}
              <Card padding="md">
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Period
                  </Text>
                  <Switch
                    value={isPeriod}
                    onValueChange={setIsPeriod}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                    thumbColor={isPeriod ? theme.colors.primary : theme.colors.surface}
                  />
                </View>

                {isPeriod && (
                  <View style={styles.flowContainer}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                      Flow Level
                    </Text>
                    <View style={styles.flowButtons}>
                      {(['spotting', 'light', 'medium', 'heavy'] as FlowLevel[]).map((level) => (
                        <TouchableOpacity
                          key={level}
                          onPress={() => setFlow(level)}
                          style={[
                            styles.flowButton,
                            {
                              backgroundColor:
                                flow === level ? theme.colors.primary : theme.colors.surface,
                              borderColor: theme.colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.flowButtonText,
                              {
                                color: flow === level ? '#FFFFFF' : theme.colors.text,
                              },
                            ]}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </Card>

              {/* Symptoms Section */}
              <Card padding="md">
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Symptoms
                </Text>

                {Object.entries(SYMPTOM_CATEGORIES).map(([category, symptoms]) => (
                  <View key={category} style={styles.symptomCategory}>
                    <Text style={[styles.categoryLabel, { color: theme.colors.textSecondary }]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <View style={styles.symptomChips}>
                      {symptoms.map((symptom) => (
                        <SymptomChip
                          key={symptom}
                          label={symptom}
                          selected={selectedSymptoms.includes(symptom)}
                          onToggle={() => toggleSymptom(symptom)}
                          category={category as any}
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </Card>

              {/* Mood Section */}
              <Card padding="md">
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Mood
                </Text>
                <View style={styles.moodContainer}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <TouchableOpacity
                      key={value}
                      onPress={() => setMood(value)}
                      style={[
                        styles.moodButton,
                        {
                          backgroundColor:
                            mood === value ? theme.colors.primary : theme.colors.surface,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <Text style={styles.moodEmoji}>
                        {['😢', '😕', '😐', '🙂', '😄'][value - 1]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>

              {/* Vitals Section */}
              <Card padding="md">
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Vitals
                </Text>

                <View style={styles.vitalRow}>
                  <View style={styles.vitalInput}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                      Weight (kg)
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          color: theme.colors.text,
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.surface,
                        },
                      ]}
                      keyboardType="decimal-pad"
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="65.5"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                  </View>

                  <View style={styles.vitalInput}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                      BBT (°C)
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          color: theme.colors.text,
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.surface,
                        },
                      ]}
                      keyboardType="decimal-pad"
                      value={bbt}
                      onChangeText={setBbt}
                      placeholder="36.5"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                  </View>
                </View>
              </Card>

              {/* Notes Section */}
              <Card padding="md">
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Notes
                </Text>
                <TextInput
                  style={[
                    styles.notesInput,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surface,
                    },
                  ]}
                  multiline
                  numberOfLines={4}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any notes..."
                  placeholderTextColor={theme.colors.textSecondary}
                  textAlignVertical="top"
                />
              </Card>

              <View style={styles.footer}>
                <Button title="Save" onPress={handleSave} variant="primary" fullWidth />
              </View>
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  flowContainer: {
    marginTop: 16,
  },
  flowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  flowButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  flowButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  symptomCategory: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  symptomChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 32,
  },
  vitalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  vitalInput: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  footer: {
    marginTop: 8,
  },
});

export default DailyLogModal;
