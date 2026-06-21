import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDecrement}
        disabled={value <= min}
        style={[styles.button, value <= min && styles.buttonDisabled]}
        activeOpacity={0.6}
      >
        <Ionicons name="remove" size={20} color={value <= min ? colors.border : colors.black} />
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{value}</Text>
      </View>

      <TouchableOpacity
        onPress={onIncrement}
        disabled={value >= max}
        style={[styles.button, value >= max && styles.buttonDisabled]}
        activeOpacity={0.6}
      >
        <Ionicons name="add" size={20} color={value >= max ? colors.border : colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 4,
    alignSelf: 'flex-start',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#F5F5F5',
    elevation: 0,
    shadowOpacity: 0,
  },
  valueContainer: {
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
  },
});
