import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Category } from '../../types/store.types';
import { CategoryItem } from './CategoryItem';
import { spacing } from '../../constants';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isSelected={category.id === selectedCategoryId}
          onPress={() => onSelectCategory(category.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
  },
});
