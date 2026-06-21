import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FAQAccordion } from '../../src/components/profile/FAQAccordion';
import { FAQCategoryTabs } from '../../src/components/profile/FAQCategoryTabs';
import { SupportContactCard } from '../../src/components/profile/SupportContactCard';
import { FAQ_DATA } from '../../src/constants/profile.constants';
import { colors, spacing, typography } from '../../src/constants';

export default function HelpScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = useMemo(() => {
    let items = FAQ_DATA;

    // Filter by category
    if (activeCategory !== 'all') {
      items = items.filter((item) => item.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search FAQs..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textMuted}
                onPress={() => setSearchQuery('')}
              />
            )}
          </View>
        </View>

        {/* Category Tabs */}
        <FAQCategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>
            Frequently Asked Questions
          </Text>
          <Text style={styles.faqCount}>
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'}
          </Text>
        </View>

        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((item) => (
            <FAQAccordion key={item.id} item={item} />
          ))
        ) : (
          <View style={styles.emptyFAQ}>
            <Ionicons
              name="help-circle-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptyMessage}>
              Try a different search term or category.
            </Text>
          </View>
        )}

        {/* Contact Section */}
        <SupportContactCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  faqSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  faqTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  faqCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyFAQ: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptyMessage: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
