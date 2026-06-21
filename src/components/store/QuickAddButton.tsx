import React, { useRef } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants';

interface QuickAddButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  onPress,
  loading = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 150,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 6,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      disabled={loading}
    >
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] },
          loading && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Ionicons name="add" size={20} color={colors.white} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    backgroundColor: colors.textMuted,
  },
});
