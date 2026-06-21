import { CartItem } from './cart.types';
import { Address } from './address.types';

export type OrderStatus =
  | 'placed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type OrderStatusFilter =
  | 'all'
  | 'placed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type PaymentMethod =
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'mock';

export interface OrderPricing {
  subtotal: number;
  printJobsTotal: number;
  productsTotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string | null;    // null = not yet reached
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface OrderSearchParams {
  query?: string;               // search by order ID
  statusFilter?: OrderStatusFilter;
  page?: number;
  limit?: number;
}

export interface OrdersListResponse {
  orders: Order[];
  total: number;
  hasMore: boolean;
}

export interface Order {
  id: string;
  displayOrderId: string;    // "BP12345678" format
  items: CartItem[];
  deliveryAddress: Address;
  pricing: OrderPricing;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  razorpayOrderId?: string;   // future
  razorpayPaymentId?: string; // future
  timeline: OrderTimelineEvent[];
  estimatedDelivery?: string;   // ISO date string
  createdAt: string;
  updatedAt: string;
}


export interface CreateOrderRequest {
  items: CartItem[];
  deliveryAddressId: string;
  paymentMethod: PaymentMethod;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: Order;
  razorpayOrderId?: string;  // future: from Razorpay
  razorpayKeyId?: string;    // future
  amount?: number;
  error?: string;
}

export interface PaymentConfirmRequest {
  orderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export interface PaymentConfirmResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

export type ProcessingStepStatus = 'pending' | 'active' | 'completed' | 'failed';

export interface ProcessingStep {
  id: string;
  label: string;
  status: ProcessingStepStatus;
}
