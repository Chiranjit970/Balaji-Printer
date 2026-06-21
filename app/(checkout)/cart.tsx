import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../src/store/cartStore';
import { usePrintStore } from '../../src/store/printStore';
import { OrderService } from '../../src/services/order.service';
import { colors, spacing, typography } from '../../src/constants';

// Checkout Components
import { CheckoutHeader } from '../../src/components/checkout/CheckoutHeader';
import { CartPrintJobItem } from '../../src/components/checkout/CartPrintJobItem';
import { CartProductItem } from '../../src/components/checkout/CartProductItem';
import { OrderSummaryCard } from '../../src/components/checkout/OrderSummaryCard';
import { CheckoutStickyBar } from '../../src/components/checkout/CheckoutStickyBar';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CartPrintItem, CartProductItem as CartProductItemType } from '../../src/types/cart.types';

export default function CartScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Zustand state
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateProductQuantity = useCartStore((s) => s.updateProductQuantity);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleEditPrint = (item: CartPrintItem) => {
    // 1. Populate printStore with print item details
    usePrintStore.getState().setFile({
      uri: '',
      name: item.fileName,
      size: 0,
      type: 'application/pdf',
      pageCount: item.pageCount,
    });
    usePrintStore.getState().setOptions({
      color: item.options.color as any,
      paperSize: item.options.paperSize as any,
      sides: item.options.sides as any,
      binding: item.options.binding as any,
      copies: item.copies,
    });
    // 2. Remove old item from cart to prevent duplicate entries on saving edits
    removeItem(item.cartItemId);
    // 3. Route user to printing configure step
    router.push('/(printing)/configure');
  };

  const handleRemoveItem = (cartItemId: string, name: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${name}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItem(cartItemId),
        },
      ]
    );
  };

  const handleCheckout = () => {
    router.push('/(checkout)/address-select');
  };

  const pricing = OrderService.calculatePricing(items);
  const printItems = items.filter((item) => item.type === 'print') as CartPrintItem[];
  const productItems = items.filter((item) => item.type === 'product') as CartProductItemType[];

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <CheckoutHeader title="Your Cart" />
        <EmptyState
          icon="cart-outline"
          title="Your Cart is Empty"
          message="Add custom print documents or stationery supplies to get started."
          actionText="Browse Store"
          onActionPress={() => router.push('/(tabs)/store')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CheckoutHeader title="Your Cart" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.blue]} />
        }
      >
        {/* Print Jobs Section */}
        {printItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Print Jobs ({printItems.length})</Text>
            {printItems.map((item) => (
              <CartPrintJobItem
                key={item.cartItemId}
                item={item}
                onEdit={() => handleEditPrint(item)}
                onRemove={() => handleRemoveItem(item.cartItemId, item.fileName)}
              />
            ))}
          </View>
        )}

        {/* Shop Products Section */}
        {productItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Store Products ({productItems.length})</Text>
            {productItems.map((item) => (
              <CartProductItem
                key={item.cartItemId}
                item={item}
                onQuantityChange={(newQty) => updateProductQuantity(item.cartItemId, newQty)}
                onRemove={() => handleRemoveItem(item.cartItemId, item.name)}
              />
            ))}
          </View>
        )}

        <View style={styles.dividerLine} />

        {/* Summary Card */}
        <OrderSummaryCard pricing={pricing} />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <CheckoutStickyBar
        primaryLabel="Checkout"
        primarySubtext={`₹${pricing.total.toFixed(2)}`}
        onPrimaryPress={handleCheckout}
        secondaryLabel="Continue Shopping"
        onSecondaryPress={() => router.push('/(tabs)/store')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100, // clearance for sticky panel
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  dividerLine: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
});
