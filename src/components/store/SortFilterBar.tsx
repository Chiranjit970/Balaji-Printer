import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SortOption, SearchFilters } from '../../types/store.types';
import { colors, spacing, typography } from '../../constants';
import { SORT_OPTIONS } from '../../constants/store.constants';

interface SortFilterBarProps {
  totalCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export const SortFilterBar: React.FC<SortFilterBarProps> = ({
  totalCount,
  sortBy,
  onSortChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || 'Relevance';

  const handleSelectSort = (optionId: string) => {
    onSortChange(optionId as SortOption);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultsCount}>
        Search Results ({totalCount})
      </Text>

      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.sortLabel}>Sort By: </Text>
        <Text style={styles.sortValue}>{currentSortLabel}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.blue} style={styles.chevron} />
      </TouchableOpacity>

      {/* Sort Options Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Sort By</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={colors.black} />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={SORT_OPTIONS}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const isSelected = item.id === sortBy;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          isSelected && styles.optionItemSelected,
                        ]}
                        onPress={() => handleSelectSort(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark" size={20} color={colors.blue} />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  contentContainerStyle={styles.listContent}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsCount: {
    ...typography.bodyBold,
    color: colors.black,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  sortLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  sortValue: {
    ...typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.blue,
  },
  chevron: {
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
    paddingBottom: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    color: colors.black,
  },
  listContent: {
    paddingVertical: spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  optionItemSelected: {
    backgroundColor: colors.blueLight,
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.blue,
  },
});
