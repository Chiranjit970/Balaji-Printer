import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAddressStore } from '../../src/store/addressStore';
import { useCartStore } from '../../src/store/cartStore';
import { useCreateOrder } from '../../src/hooks/useCreateOrder';
import { OrderService } from '../../src/services/order.service';
import { AddressUtils } from '../../src/utils/address.utils';
import { colors, spacing, typography } from '../../src/constants';
import { TRUST_BADGES } from '../../src/constants/checkout.constants';

// Checkout Components
import { CheckoutHeader } from '../../src/components/checkout/CheckoutHeader';
import { CheckoutPricingCard } from '../../src/components/checkout/CheckoutPricingCard';
import { TrustBadgeRow } from '../../src/components/checkout/TrustBadgeRow';
import { CheckoutStickyBar } from '../../src/components/checkout/CheckoutStickyBar';
import { CartPrintItem, CartProductItem as CartProductItemType } from '../../src/types/cart.types';

export default function CheckoutReviewScreen() {
  const router = useRouter();

  // Zustand State
  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const items = useCartStore((s) => s.items);

  // Mutations
  const createOrderMutation = useCreateOrder();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handlePay = () => {
    if (!selectedAddress) {
      setToastMessage('Please select a delivery address first.');
      setToastVisible(true);
      return;
    }

    // Call mutation to package order and generate mock razorpay order ID
    createOrderMutation.mutate(
      {
        items,
        deliveryAddressId: selectedAddress.id,
        paymentMethod: 'mock', // default mock method selection
      },
      {
        onSuccess: (response) => {
          if (response.success && response.order) {
            router.push('/(checkout)/payment');
          }
        },
      }
    );
  };

  const pricing = OrderService.calculatePricing(items);
  const printItems = items.filter((item) => item.type === 'print') as CartPrintItem[];
  const productItems = items.filter((item) => item.type === 'product') as CartProductItemType[];

  return (
    <SafeAreaView style={styles.container}>
      <CheckoutHeader title="Checkout Review" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Deliver To Address Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Deliver To</Text>
            <TouchableOpacity onPress={() => router.push('/(checkout)/address-select')} activeOpacity={0.6}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            <View style={styles.addressBox}>
              <Ionicons name="location-outline" size={20} color={colors.blue} style={styles.addressIcon} />
              <View style={styles.addressInfo}>
                <Text style={styles.addressName}>{selectedAddress.name}</Text>
                <Text style={styles.addressText}>{AddressUtils.formatFull(selectedAddress)}</Text>
                <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addressBoxEmpty}
              onPress={() => router.push('/(checkout)/address-select')}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.blue} />
              <Text style={styles.addressBoxEmptyText}>Select delivery address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Order Items Review */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <TouchableOpacity onPress={() => router.push('/(checkout)/cart')} activeOpacity={0.6}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* List of Prints */}
          {printItems.map((item) => (
            <View key={item.cartItemId} style={styles.itemRow}>
              <View style={styles.pdfIconContainer}>
                <Ionicons name="document-text" size={20} color={colors.white} />
              </View>
              <View style={styles.itemDetails}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.fileName}
                </Text>
                <Text style={styles.itemMeta}>
                  {item.options.paperSize} • {item.options.color} • {item.options.sides}
                </Text>
                <Text style={styles.itemMetaSub}>
                  {item.pageCount} Page{item.pageCount > 1 ? 's' : ''} • {item.copies} Cop{item.copies > 1 ? 'ies' : 'y'}
                </Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
            </View>
          ))}

          {/* List of Goods */}
          {productItems.map((item) => (
            <View key={item.cartItemId} style={styles.itemRow}>
              <View style={styles.productImageContainer}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
              </View>
              <View style={styles.itemDetails}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.name}
                </Text>
                <Text style={styles.itemMeta}>
                  Quantity: {item.quantity}
                </Text>
              </View>
              <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Pricing Summary Breakdown */}
        <CheckoutPricingCard pricing={pricing} />

        {/* Security badges row */}
        <TrustBadgeRow badges={TRUST_BADGES} />
      </ScrollView>

      {/* Action Pay Button Sticky Footer */}
      <CheckoutStickyBar
        primaryLabel="Pay with Razorpay"
        primarySubtext={`₹${pricing.total.toFixed(2)}`}
        onPrimaryPress={handlePay}
        primaryLoading={createOrderMutation.isPending}
        primaryDisabled={!selectedAddress}
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
    paddingBottom: 110,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: colors.black,
  },
  editLink: {
    ...typography.caption,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.blue,
  },
  addressBox: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  addressBoxEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    height: 64,
  },
  addressBoxEmptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.blue,
  },
  addressIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: 4,
  },
  addressText: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 16,
  },
  addressPhone: {
    ...typography.caption,
    fontFamily: 'Inter-Medium',
    color: colors.textPrimary,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  pdfIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EAEAEA',
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  itemName: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 13,
  },
  itemMeta: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
    marginTop: 1,
  },
  itemMetaSub: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: colors.textMuted,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
});
