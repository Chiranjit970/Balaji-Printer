import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants';
import type { FAQItem } from '../../types/profile.types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQAccordionProps {
  item: FAQItem;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.spring(rotateAnim, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();

    setExpanded(!expanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, expanded && styles.containerExpanded]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.questionRow}>
          <View style={styles.questionIcon}>
            <Ionicons name="help-circle" size={20} color={colors.blue} />
          </View>
          <Text style={styles.question}>{item.question}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.answerContainer}>
          <View style={styles.answerDivider} />
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 14,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  containerExpanded: {
    borderColor: '#D4E0FC',
    backgroundColor: '#FAFBFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  questionIcon: {
    marginRight: spacing.sm,
  },
  question: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  answerContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  answerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md - 4,
  },
  answer: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
    paddingLeft: 28,
  },
});
