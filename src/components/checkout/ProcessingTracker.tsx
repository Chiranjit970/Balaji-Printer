import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProcessingStep, ProcessingStepStatus } from '../../types/order.types';
import { colors, spacing, typography } from '../../constants';

interface ProcessingTrackerProps {
  steps: Array<ProcessingStep & { status: ProcessingStepStatus }>;
}

export const ProcessingTracker: React.FC<ProcessingTrackerProps> = ({
  steps,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const activeStep = steps.find((s) => s.status === 'active');
    if (activeStep) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [steps, pulseAnim]);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed';
        const isActive = step.status === 'active';
        const isPending = step.status === 'pending';
        const isLast = index === steps.length - 1;

        // Determine line color
        const nextStep = !isLast ? steps[index + 1] : null;
        const lineCompleted = isCompleted && (nextStep?.status === 'completed' || nextStep?.status === 'active');

        return (
          <View key={step.id} style={styles.stepRow}>
            {/* Timeline Column */}
            <View style={styles.timelineCol}>
              {/* Circle indicator */}
              {isCompleted ? (
                <View style={styles.circleCompleted}>
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                </View>
              ) : isActive ? (
                <Animated.View
                  style={[
                    styles.circleActiveOuter,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <View style={styles.circleActiveInner} />
                </Animated.View>
              ) : (
                <View style={styles.circlePending} />
              )}

              {/* Connecting line to next item */}
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    lineCompleted ? styles.lineCompleted : styles.linePending,
                  ]}
                />
              )}
            </View>

            {/* Label Column */}
            <View style={styles.labelCol}>
              <Text
                style={[
                  styles.label,
                  isCompleted && styles.labelCompleted,
                  isActive && styles.labelActive,
                  isPending && styles.labelPending,
                ]}
              >
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    alignSelf: 'stretch',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 64,
  },
  timelineCol: {
    alignItems: 'center',
    width: 32,
  },
  circleCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  circleActiveOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.blue,
    zIndex: 2,
  },
  circleActiveInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.blue,
  },
  circlePending: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    zIndex: 2,
  },
  line: {
    width: 2,
    position: 'absolute',
    top: 24,
    bottom: -16,
    zIndex: 1,
  },
  lineCompleted: {
    backgroundColor: colors.success,
  },
  linePending: {
    backgroundColor: colors.border,
  },
  labelCol: {
    flex: 1,
    marginLeft: spacing.sm,
    paddingTop: 2,
  },
  label: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
  labelCompleted: {
    color: colors.success,
  },
  labelActive: {
    color: colors.blue,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  labelPending: {
    color: colors.textMuted,
  },
});
