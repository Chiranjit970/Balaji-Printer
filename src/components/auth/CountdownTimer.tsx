import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants';

interface CountdownTimerProps {
  /** Unix timestamp when the timer expires */
  expiresAt: number;
  /** Callback fired when countdown reaches zero */
  onExpire: () => void;
  /** Label text before the time (default: "OTP expires in") */
  label?: string;
}

/**
 * Countdown timer display for OTP expiry.
 *
 * Shows a "label MM:SS" format with color change
 * when less than 30 seconds remain (warning state).
 */
export default function CountdownTimer({
  expiresAt,
  onExpire,
  label = 'OTP expires in',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
  );

  useEffect(() => {
    // Recalculate when expiresAt changes
    setTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000)
      );
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isWarning = timeLeft < 30 && timeLeft > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[styles.time, isWarning && styles.timeWarning]}
        accessibilityLabel={`${label} ${minutes} minutes ${seconds} seconds`}
      >
        {formattedTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  time: {
    ...typography.bodyBold,
    color: colors.blue,
  },
  timeWarning: {
    color: colors.warning,
  },
});
