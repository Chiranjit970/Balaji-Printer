import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProductDetail, useRelatedProducts } from '../../../src/hooks/useProductDetail';
import { useCartStore } from '../../../src/store/cartStore';
import { useNotificationCount } from '../../../src/hooks/useNotificationCount';
import { colors, spacing, typography } from '../../../src/constants';

// Store Components
import { StoreHeader } from '../../../src/components/store/StoreHeader';
import { ProductImageCarousel } from '../../../src/components/store/ProductImageCarousel';
import { ProductFeatureChip } from '../../../src/components/store/ProductFeatureChip';
import { QuantityStepper } from '../../../src/components/store/QuantityStepper';
import { StockBadge } from '../../../src/components/store/StockBadge';
import { RelatedProducts } from '../../../src/components/store/RelatedProducts';
import { StickyPurchaseBar } from '../../../src/components/store/StickyPurchaseBar';
import { RatingStars } from '../../../src/components/store/RatingStars';
import { CartToast } from '../../../src/components/common/CartToast';
import { EmptyState } from '../../../src/components/common/EmptyState';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [descExpanded, setDescExpanded] = useState(false);
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Zustand State
  const cartCount = useCartStore((state) => state.itemCount);
  const addProduct = useCartStore((state) => state.addProduct);

  // Notifications count
  const { data: notificationData } = useNotificationCount();
  const notificationCount = notificationData?.unread || 0;

  // Fetch product detail
  const { data: product, isLoading, isError } = useProductDetail(id || '');

  // Fetch related products
  const { data: relatedProducts = [] } = useRelatedProducts(
    id || '',
    product?.categoryId || ''
  );

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    setTimeout(() => {
      addProduct({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0],
      });
      setIsAdding(false);
      setToastMessage(`${quantity}x ${product.name} added to cart!`);
      setToastVisible(true);
    }, 800);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addProduct({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0],
    });
    setToastMessage('Redirecting to checkout... (Checkout coming in Phase 5)');
    setToastVisible(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <StoreHeader
          showBack={true}
          title="Product Details"
          cartCount={cartCount}
          notificationCount={notificationCount}
        />
        <EmptyState
          icon="alert-circle-outline"
          title="Product Not Found"
          message="The requested product does not exist or has been removed."
          actionText="Go Back"
          onActionPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <StoreHeader
        showBack={true}
        title="Product Details"
        cartCount={cartCount}
        notificationCount={notificationCount}
        onCartPress={() => {
          setToastMessage('Opening cart... (Checkout details in Phase 5)');
          setToastVisible(true);
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Image Carousel */}
        <ProductImageCarousel images={product.images} productName={product.name} />

        {/* Product Information */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceRatingRow}>
            <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
            <RatingStars rating={product.rating} count={product.reviewCount} size="medium" />
          </View>

          {/* Description with Read More */}
          <View style={styles.descriptionContainer}>
            <Text
              style={styles.descriptionText}
              numberOfLines={descExpanded ? undefined : 3}
            >
              {product.description}
            </Text>
            <TouchableOpacity
              onPress={() => setDescExpanded(!descExpanded)}
              style={styles.readMoreButton}
              activeOpacity={0.7}
            >
              <Text style={styles.readMoreText}>
                {descExpanded ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Chips */}
        {product.features && product.features.length > 0 && (
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.chipsContainer}>
              {product.features.map((feat, index) => (
                <ProductFeatureChip
                  key={index}
                  icon={feat.icon}
                  label={feat.label}
                  description={feat.description}
                />
              ))}
            </View>
          </View>
        )}

        {/* Quantity Selection Row */}
        <View style={styles.quantitySection}>
          <View style={styles.quantityRow}>
            <Text style={styles.quantityTitle}>Quantity</Text>
            <QuantityStepper
              value={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          </View>
          <View style={styles.stockStatusContainer}>
            <StockBadge stockStatus={product.stockStatus} stockLabel={product.stockLabel} />
          </View>
        </View>

        {/* Specifications Accordion */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <View style={styles.specsSection}>
            <TouchableOpacity
              style={styles.specsHeader}
              onPress={() => setSpecsExpanded(!specsExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.specsTitle}>Product Specifications</Text>
              <Ionicons
                name={specsExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.black}
              />
            </TouchableOpacity>

            {specsExpanded && (
              <View style={styles.specsContent}>
                {Object.entries(product.specifications).map(([key, val], index) => (
                  <View key={index} style={styles.specRow}>
                    <Text style={styles.specKey}>{key}</Text>
                    <Text style={styles.specVal}>{val}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts
            products={relatedProducts}
            onProductPress={(prodId) => {
              setQuantity(1); // reset quantity for new details view
              router.push(`/(store)/product/${prodId}`);
            }}
            onAddToCart={(prod) => {
              addProduct({
                productId: prod.id,
                name: prod.name,
                price: prod.price,
                quantity: 1,
                image: prod.images?.[0],
              });
              setToastMessage(`${prod.name} added to cart!`);
              setToastVisible(true);
            }}
          />
        )}

        {/* Extra Bottom Margin for sticky footer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Bottom Purchase Panel */}
      <StickyPurchaseBar
        price={product.price}
        quantity={quantity}
        currency={product.currency}
        inStock={product.inStock}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isLoading={isAdding}
      />

      {/* Toast Feedback */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  infoSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  productName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  priceRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.blue,
  },
  descriptionContainer: {
    marginTop: spacing.xs,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 20,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  readMoreText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.blue,
  },
  featuresSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantitySection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quantityTitle: {
    ...typography.bodyBold,
    fontFamily: 'Inter-Bold',
    color: colors.black,
  },
  stockStatusContainer: {
    alignItems: 'flex-end',
  },
  specsSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  specsTitle: {
    ...typography.h2,
    fontFamily: 'Inter-Bold',
    color: colors.black,
  },
  specsContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  specKey: {
    ...typography.body,
    color: colors.textMuted,
  },
  specVal: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  bottomSpacer: {
    height: 120, // Extra space to clear the bottom sticky panel
  },
});
