import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useOrderDetail } from '../../src/hooks/useOrderDetail';
import { InvoiceService } from '../../src/services/invoice.service';
import { AddressUtils } from '../../src/utils/address.utils';
import { colors, spacing, typography } from '../../src/constants';

// Orders UI Components
import { OrderSummaryHeader } from '../../src/components/orders/OrderSummaryHeader';
import { OrderStatusTimeline } from '../../src/components/orders/OrderStatusTimeline';
import { OrderItemsSection } from '../../src/components/orders/OrderItemsSection';
import { OrderDeliveryCard } from '../../src/components/orders/OrderDeliveryCard';
import { OrderPaymentCard } from '../../src/components/orders/OrderPaymentCard';
import { OrderPriceBreakdown } from '../../src/components/orders/OrderPriceBreakdown';
import { OrderActionButtons } from '../../src/components/orders/OrderActionButtons';
import { OrderDetailSkeleton } from '../../src/components/orders/OrderDetailSkeleton';

// Common
import ErrorView from '../../src/components/common/ErrorView';
import { CartToast } from '../../src/components/common/CartToast';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Local Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { data: order, isLoading, isError, refetch } = useOrderDetail(id || '');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCopyAddress = async () => {
    if (!order) return;
    const formatted = AddressUtils.formatFull(order.deliveryAddress);
    await Clipboard.setStringAsync(formatted);
    setToastMessage('Address copied to clipboard!');
    setToastVisible(true);
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    setIsDownloading(true);
    const result = await InvoiceService.downloadInvoice(order);
    setIsDownloading(false);
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to download invoice');
    } else {
      setToastMessage('Invoice generated successfully!');
      setToastVisible(true);
    }
  };

  const handleNeedHelp = () => {
    Alert.alert(
      'Need Help?',
      'Please contact us at support@balajiprinters.com or call +91 98765 43210',
      [{ text: 'OK' }]
    );
  };

  const handleHelpIconPress = () => {
    Alert.alert(
      'Need Help?',
      'This screen displays the current status and details of your order. If you have questions about delivery times or specifications, please tap "Need Help?" below to reach support.',
      [{ text: 'OK' }]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.helpButtonSpacer} />
        </View>
        <OrderDetailSkeleton />
      </SafeAreaView>
    );
  }

  if (isError || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView
          title="Order Not Found"
          message="This order may not exist, has been removed, or you don't have permission to view it."
          onRetry={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity
          onPress={handleHelpIconPress}
          style={styles.helpIcon}
          accessibilityLabel="Help info"
        >
          <Ionicons name="help-circle-outline" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.blue]}
            tintColor={colors.blue}
          />
        }
      >
        {/* Summary Header */}
        <OrderSummaryHeader order={order} />

        {/* Section: Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.card}>
            <OrderStatusTimeline
              timeline={order.timeline}
              currentStatus={order.status}
              isCancelled={order.status === 'cancelled'}
            />
          </View>
        </View>

        {/* Section: Items */}
        <View style={styles.section}>
          <OrderItemsSection items={order.items} />
        </View>

        {/* Section: Delivery Address */}
        <View style={styles.section}>
          <OrderDeliveryCard address={order.deliveryAddress} onCopy={handleCopyAddress} />
        </View>

        {/* Section: Payment Details */}
        <View style={styles.section}>
          <OrderPaymentCard order={order} />
        </View>

        {/* Section: Price Breakdown */}
        <View style={styles.section}>
          <OrderPriceBreakdown pricing={order.pricing} />
        </View>

        {/* Action Buttons */}
        <OrderActionButtons
          order={order}
          onDownloadInvoice={handleDownloadInvoice}
          onNeedHelp={handleNeedHelp}
          isDownloading={isDownloading}
        />

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Toast */}
      <CartToast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
    height: 56,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.black,
    fontSize: 18,
    fontWeight: '700',
  },
  helpIcon: {
    padding: spacing.xs,
  },
  helpButtonSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  bottomSpacer: {
    height: 40,
  },
});
