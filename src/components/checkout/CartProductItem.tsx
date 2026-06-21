import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartProductItem as CartProductItemType } from '../../types/cart.types';
import { colors, spacing, typography } from '../../constants';

interface CartProductItemProps {
  item: CartProductItemType;
  onQuantityChange: (newQty: number) => void;
  onRemove: () => void;
}

export const CartProductItem: React.FC<CartProductItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  const { name, price, quantity, image } = item;
  const totalPrice = price * quantity;

  return (
    <View style={styles.container}>
      {/* Product Information Row */}
      <View style={styles.cardHeader}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text style={styles.details}>
            Qty: {quantity}
          </Text>
          <Text style={styles.price}>
            ₹{totalPrice.toFixed(2)}
          </Text>
        </View>

        {/* Options Button Placeholder */}
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.6}>
          <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Quantity Stepper Row */}
      <View style={styles.stepperRow}>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={[styles.stepperButton, quantity <= 1 && styles.stepperButtonDisabled]}
            onPress={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            activeOpacity={0.6}
          >
            <Ionicons name="remove" size={16} color={quantity <= 1 ? colors.border : colors.black} />
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{quantity}</Text>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => onQuantityChange(quantity + 1)}
            activeOpacity={0.6}
          >
            <Ionicons name="add" size={16} color={colors.black} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={onRemove} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EAEAEA',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  name: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: 2,
  },
  details: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 4,
  },
  price: {
    ...typography.bodyBold,
    color: colors.black,
    fontSize: 15,
  },
  menuButton: {
    padding: spacing.xs,
    position: 'absolute',
    top: -4,
    right: -8,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 3,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  stepperButtonDisabled: {
    backgroundColor: '#F5F5F5',
    elevation: 0,
    shadowOpacity: 0,
  },
  stepperValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.black,
    marginHorizontal: 12,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});
