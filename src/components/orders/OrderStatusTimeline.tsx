import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { OrderTimelineEvent, OrderStatus } from '../../types/order.types';
import { TimelineStep } from './TimelineStep';
import { colors, spacing, typography } from '../../constants';

interface OrderStatusTimelineProps {
  timeline: OrderTimelineEvent[];
  currentStatus: OrderStatus;
  isCancelled?: boolean;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  timeline,
  currentStatus,
  isCancelled = false,
}) => {
  const actualCancelled = isCancelled || currentStatus === 'cancelled';

  // Build the list of steps to display
  let stepsToRender = timeline.map((event) => {
    // If order is cancelled, Placed remains completed, while intermediate steps are pending
    if (actualCancelled) {
      if (event.status === 'placed') {
        return {
          ...event,
          isCompleted: true,
          isCurrent: false,
        };
      } else {
        return {
          ...event,
          timestamp: null,
          isCompleted: false,
          isCurrent: false,
        };
      }
    }
    return event;
  });

  return (
    <View style={styles.container}>
      {stepsToRender.map((step, index) => {
        const isLast = index === stepsToRender.length - 1 && !actualCancelled;
        return (
          <Animated.View
            key={step.status}
            entering={FadeInDown.delay(index * 100).duration(300)}
          >
            <TimelineStep
              label={step.label}
              timestamp={step.timestamp}
              isCompleted={step.isCompleted}
              isCurrent={step.isCurrent}
              isLast={isLast}
            />
          </Animated.View>
        );
      })}

      {/* Cancelled Step indicator at bottom (red) */}
      {actualCancelled && (
        <Animated.View entering={FadeInDown.delay(stepsToRender.length * 100).duration(300)}>
          <TimelineStep
            label="Cancelled"
            timestamp={new Date().toISOString()} // show current time or custom cancellation date
            isCompleted={false}
            isCurrent={false}
            isLast={true}
            // Custom render for Cancelled
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
});
