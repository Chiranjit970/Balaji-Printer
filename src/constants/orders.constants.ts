import { OrderStatus, OrderStatusFilter } from '../types/order.types';
import { colors } from './colors';

// ─── Status Configuration ────────────────────────────────────────────
export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  stepIndex: number;
}> = {
  placed: {
    label: 'Placed',
    color: colors.blue,
    bgColor: colors.blueLight,
    icon: 'checkmark-circle-outline',
    stepIndex: 0,
  },
  processing: {
    label: 'Processing',
    color: '#D97706',
    bgColor: '#FFF7ED',
    icon: 'settings-outline',
    stepIndex: 1,
  },
  dispatched: {
    label: 'Dispatched',
    color: colors.blue,
    bgColor: colors.blueLight,
    icon: 'car-outline',
    stepIndex: 2,
  },
  delivered: {
    label: 'Delivered',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    icon: 'checkmark-circle',
    stepIndex: 3,
  },
  cancelled: {
    label: 'Cancelled',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    icon: 'close-circle-outline',
    stepIndex: -1,
  },
};

// ─── Status Filter Tabs ───────────────────────────────────────────────
export const STATUS_FILTER_TABS: Array<{
  id: OrderStatusFilter;
  label: string;
}> = [
  { id: 'all', label: 'All Orders' },
  { id: 'processing', label: 'Processing' },
  { id: 'dispatched', label: 'Dispatched' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

// ─── Timeline Steps (in order) ────────────────────────────────────────
export const ORDER_TIMELINE_STEPS: Array<{
  status: OrderStatus;
  label: string;
}> = [
  { status: 'placed', label: 'Order Placed' },
  { status: 'processing', label: 'Processing' },
  { status: 'dispatched', label: 'Dispatched' },
  { status: 'delivered', label: 'Delivered' },
];

// ─── Order Icon Config (for list cards) ──────────────────────────────
export const ORDER_ICON_CONFIG: Record<number, {
  icon: string;
  bgColor: string;
}> = {
  0: { icon: 'document-text-outline', bgColor: '#EFF6FF' },
  1: { icon: 'cube-outline', bgColor: '#FFF7ED' },
  2: { icon: 'settings-outline', bgColor: '#F0FDF4' },
  3: { icon: 'print-outline', bgColor: '#EFF6FF' },
  4: { icon: 'bag-outline', bgColor: '#FDF4FF' },
};

// Gets a deterministic icon per order ID
export const getOrderIcon = (orderId: string) => {
  const hash = orderId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ORDER_ICON_CONFIG[hash % 5];
};

// ─── Payment Status Config ────────────────────────────────────────────
export const PAYMENT_STATUS_CONFIG = {
  paid: { label: 'Paid', color: '#16A34A', bgColor: '#F0FDF4' },
  pending: { label: 'Pending', color: '#D97706', bgColor: '#FFF7ED' },
  failed: { label: 'Failed', color: '#DC2626', bgColor: '#FEF2F2' },
  refunded: { label: 'Refunded', color: '#2563EB', bgColor: '#EFF6FF' },
} as const;
