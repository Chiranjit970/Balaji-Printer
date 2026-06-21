import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Address } from '../../types/address.types';
import { colors, spacing, typography } from '../../constants';

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit();
  };

  const handleDelete = () => {
    setMenuVisible(false);
    onDelete();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected ? styles.containerSelected : styles.containerUnselected,
      ]}
      onPress={onSelect}
      activeOpacity={0.9}
    >
      {/* Radio Selector Icon on Left */}
      <View style={styles.leftCol}>
        <Ionicons
          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
          size={20}
          color={isSelected ? colors.blue : colors.textMuted}
        />
      </View>

      {/* Info Block in Center */}
      <View style={styles.centerCol}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>{address.label}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>{address.name}</Text>
        <Text style={styles.addressLine}>{address.line1}</Text>
        {!!address.line2 && <Text style={styles.addressLine}>{address.line2}</Text>}
        {!!address.landmark && (
          <Text style={styles.addressLine}>Landmark: {address.landmark}</Text>
        )}
        <Text style={styles.addressLine}>
          {address.city}, {address.state} - {address.pincode}
        </Text>
        <Text style={styles.phone}>{address.phone}</Text>
      </View>

      {/* Three-Dot Menu on Right */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={(e) => {
          e.stopPropagation(); // prevent card selection trigger
          setMenuVisible(true);
        }}
        activeOpacity={0.6}
      >
        <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Context Menu Modal Overlay */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuPopup}>
              <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                <Ionicons name="pencil-outline" size={16} color={colors.black} style={styles.menuIcon} />
                <Text style={styles.menuItemText}>Edit Address</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItem, styles.deleteItem]} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={16} color={colors.danger} style={styles.menuIcon} />
                <Text style={styles.deleteText}>Delete Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    position: 'relative',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  containerUnselected: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerSelected: {
    borderWidth: 2,
    borderColor: colors.blue,
    backgroundColor: colors.blueLight,
  },
  leftCol: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  centerCol: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    ...typography.bodyBold,
    color: colors.black,
  },
  defaultBadge: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    marginLeft: spacing.xs,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
  },
  name: {
    ...typography.body,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.black,
    marginBottom: 4,
  },
  addressLine: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 16,
  },
  phone: {
    ...typography.caption,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: 4,
  },
  menuButton: {
    padding: spacing.xs,
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuPopup: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    width: 160,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  menuIcon: {
    marginRight: spacing.xs,
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },
  deleteItem: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  deleteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.danger,
  },
});
