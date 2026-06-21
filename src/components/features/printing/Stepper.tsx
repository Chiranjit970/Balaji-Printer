import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

interface StepperProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({ value, onValueChange, min = 1, max = 1000 }: StepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onValueChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onValueChange(value + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, value <= min && styles.buttonDisabled]} 
        onPress={handleDecrement}
        disabled={value <= min}
      >
        <Ionicons name="remove" size={24} color={value <= min ? colors.border : colors.blue} />
      </TouchableOpacity>
      
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{value}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, value >= max && styles.buttonDisabled]} 
        onPress={handleIncrement}
        disabled={value >= max}
      >
        <Ionicons name="add" size={24} color={value >= max ? colors.border : colors.blue} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  button: {
    padding: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.surface,
  },
  valueContainer: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  valueText: {
    ...typography.h2,
    color: colors.textPrimary,
  },
});
