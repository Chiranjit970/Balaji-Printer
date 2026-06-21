import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../constants';

interface StoreSearchBarProps {
  placeholder?: string;
  onPress?: () => void;
  onFilterPress?: () => void;
  isInteractive?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
}

export const StoreSearchBar: React.FC<StoreSearchBarProps> = ({
  placeholder = 'Search products, categories...',
  onPress,
  onFilterPress,
  isInteractive = false,
  value = '',
  onChangeText,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  if (!isInteractive) {
    return (
      <View style={styles.outerContainer}>
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.searchBarFake}>
            <Ionicons name="search-outline" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.inputFake}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
              editable={false}
              pointerEvents="none"
            />
          </View>
        </TouchableWithoutFeedback>
        
        {onFilterPress && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={20} color={colors.black} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.searchBarActive,
          isFocused && styles.searchBarFocused,
        ]}
      >
        <Ionicons name="search-outline" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.inputActive}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText?.('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={20} color={colors.black} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  searchBarFake: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
  },
  searchBarActive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
  },
  searchBarFocused: {
    borderColor: colors.blue,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  inputFake: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  inputActive: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
});
