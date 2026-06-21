import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '../../constants';
import { DateUtils } from '../../utils/date.utils';

interface TimelineStepProps {
  label: string;
  timestamp: string | null;
  isCompleted: boolean;
  isCurrent: boolean;
  isLast: boolean;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  label,
  timestamp,
  isCompleted,
  isCurrent,
  isLast,
}) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isCurrent) {
      pulse.value = withRepeat(
        withTiming(1.4, { duration: 1000 }),
        -1, // infinite
        true // reverse
      );
    } else {
      pulse.value = 1;
    }
  }, [isCurrent]);

  const pulseStyle = useAnimatedStyle(() => {
    if (!isCurrent) return { transform: [{ scale: 1 }], opacity: 0 };
    return {
      transform: [{ scale: pulse.value }],
      opacity: interpolate(pulse.value, [1, 1.4], [0.6, 0]),
    };
  });

  return (
    <View style={styles.container}>
      {/* Connector Column */}
      <View style={styles.connectorColumn}>
        {/* Circle Circle Container */}
        <View style={styles.circleOuter}>
          {isCurrent && (
            <Animated.View style={[styles.pulsingRing, pulseStyle]} />
          )}

          {isCompleted ? (
            <View style={[styles.circle, styles.circleCompleted]}>
              <Ionicons name="checkmark" size={12} color={colors.white} />
            </View>
          ) : isCurrent ? (
            <View style={[styles.circle, styles.circleCurrent]} />
          ) : label.toLowerCase() === 'cancelled' ? (
            <View style={[styles.circle, styles.circleCancelled]}>
              <Ionicons name="close" size={12} color={colors.white} />
            </View>
          ) : (
            <View style={[styles.circle, styles.circlePending]} />
          )}
        </View>

        {/* Vertical Line */}
        {!isLast && (
          <View
            style={[
              styles.line,
              isCompleted ? styles.lineCompleted : styles.linePending,
            ]}
          />
        )}
      </View>

      {/* Content Column */}
      <View style={styles.contentColumn}>
        <Text
          style={[
            styles.label,
            isCompleted || isCurrent || label.toLowerCase() === 'cancelled' ? styles.labelActive : styles.labelMuted,
          ]}
        >
          {label}
        </Text>
        {timestamp ? (
          <Text style={styles.timestamp}>
            {DateUtils.formatTimestamp(timestamp)}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  connectorColumn: {
    alignItems: 'center',
    width: 24,
  },
  circleOuter: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  circleCurrent: {
    backgroundColor: colors.white,
    borderColor: colors.blue,
    borderWidth: 6,
  },
  circleCancelled: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  circlePending: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 2,
  },
  pulsingRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 40,
    alignSelf: 'center',
  },
  lineCompleted: {
    backgroundColor: '#16A34A',
  },
  linePending: {
    backgroundColor: colors.border,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: spacing.lg,
    justifyContent: 'flex-start',
  },
  label: {
    ...typography.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  labelActive: {
    color: colors.black,
  },
  labelMuted: {
    color: colors.textMuted,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
});
