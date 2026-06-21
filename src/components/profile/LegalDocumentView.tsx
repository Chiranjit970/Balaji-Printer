import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../constants';
import type { LegalDocument } from '../../types/profile.types';

interface LegalDocumentViewProps {
  document: LegalDocument;
}

export const LegalDocumentView: React.FC<LegalDocumentViewProps> = ({ document }) => {
  // Parse content into paragraphs, rendering numbered items and headers differently
  const paragraphs = document.content.split('\n\n').filter((p) => p.trim());

  const renderParagraph = (text: string, index: number) => {
    const trimmed = text.trim();

    // Check if it's a numbered section header like "1. Service Description"
    const numberedHeader = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numberedHeader) {
      return (
        <View key={index} style={styles.sectionHeaderContainer}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{numberedHeader[1]}</Text>
          </View>
          <Text style={styles.sectionHeader}>{numberedHeader[2]}</Text>
        </View>
      );
    }

    // Check if it's a document title (first paragraph or contains the app name)
    if (index === 0 || (index === 1 && trimmed.length < 60)) {
      return (
        <Text key={index} style={styles.documentTitle}>
          {trimmed}
        </Text>
      );
    }

    // Check if it starts with "Contact:" 
    if (trimmed.startsWith('Contact:')) {
      return (
        <View key={index} style={styles.contactContainer}>
          <Text style={styles.contactText}>{trimmed}</Text>
        </View>
      );
    }

    // Regular paragraph
    return (
      <Text key={index} style={styles.paragraph}>
        {trimmed}
      </Text>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.lastUpdated}>
        <Text style={styles.lastUpdatedText}>
          Last updated: {new Date(document.lastUpdated).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>

      {paragraphs.map((paragraph, index) => renderParagraph(paragraph, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  lastUpdated: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    marginBottom: spacing.lg,
  },
  lastUpdatedText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  documentTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  numberText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  sectionHeader: {
    ...typography.h2,
    color: colors.textPrimary,
    flex: 1,
  },
  paragraph: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  contactContainer: {
    backgroundColor: '#EFF6FF',
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  contactText: {
    ...typography.body,
    color: colors.blue,
    fontWeight: '500',
  },
});
