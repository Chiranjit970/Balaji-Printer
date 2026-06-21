import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

interface SelectableCardProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isSelected: boolean;
  onSelect: () => void;
}

export function SelectableCard({ title, subtitle, icon, isSelected, onSelect }: SelectableCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={24} 
            color={isSelected ? colors.blue : colors.textMuted} 
            style={styles.icon}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, isSelected && styles.titleSelected]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, isSelected && styles.subtitleSelected]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  containerSelected: {
    backgroundColor: colors.blueLight, // Light blue tint
    borderColor: colors.blue,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontFamily: 'Inter-Medium',
    color: colors.textPrimary,
  },
  titleSelected: {
    color: colors.blue,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  subtitleSelected: {
    color: colors.blue,
    opacity: 0.8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.blue,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
});
