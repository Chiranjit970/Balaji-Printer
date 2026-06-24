import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import { AddressService } from './address.service';
import {
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  PaymentConfirmRequest,
  PaymentConfirmResponse,
  OrderPricing,
} from '../types/order.types';
import { CartItem } from '../types/cart.types';
import { CHECKOUT_CONFIG } from '../constants/checkout.constants';

const generateOrderId = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `BP${dateStr}-${randNum}`;
};

const calculatePricing = (items: CartItem[]): OrderPricing => {
  let printJobsTotal = 0;
  let productsTotal = 0;

  items.forEach((item) => {
    if (item.type === 'print') {
      printJobsTotal += item.price;
    } else {
      productsTotal += item.price * item.quantity;
    }
  });

  const subtotal = printJobsTotal + productsTotal;
  const deliveryFee = subtotal >= CHECKOUT_CONFIG.freeDeliveryThreshold
    ? 0
    : CHECKOUT_CONFIG.deliveryFee;
  const total = subtotal + deliveryFee;

  return {
    printJobsTotal: parseFloat(printJobsTotal.toFixed(2)),
    productsTotal: parseFloat(productsTotal.toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
    deliveryFee,
    total: parseFloat(total.toFixed(2)),
    currency: 'INR',
  };
};

export const OrderService = {
  /**
   * Calculate order pricing from cart items
   */
  calculatePricing,

  /**
   * Helper to load orders from storage
   */
  async loadOrders(): Promise<Order[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.orders);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[OrderService] Failed to load orders:', e);
      return [];
    }
  },

  /**
   * Helper to save orders to storage
   */
  async saveOrders(ordersList: Order[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(ordersList));
    } catch (e) {
      console.error('[OrderService] Failed to save orders:', e);
      throw e;
    }
  },

  /**
   * Create pending order before payment
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    await new Promise((r) => setTimeout(r, 800));

    const pricing = calculatePricing(request.items);
    const orderId = `order_${Date.now()}`;
    const displayOrderId = generateOrderId();

    // Resolve address snapshot at order creation time
    const addresses = await AddressService.getAddresses();
    const deliveryAddress = addresses.find((a) => a.id === request.deliveryAddressId) || addresses[0] || {} as any;

    const mockRazorpayOrderId = `rzp_order_${Date.now()}`;

    const pendingOrder: Order = {
      id: orderId,
      displayOrderId,
      items: request.items,
      deliveryAddress: { ...deliveryAddress }, // snapshot clone
      pricing,
      status: 'placed',
      paymentStatus: 'pending',
      paymentMethod: request.paymentMethod,
      razorpayOrderId: mockRazorpayOrderId,
      timeline: [
        {
          status: 'placed',
          label: 'Order Placed',
          timestamp: new Date().toISOString(),
          isCompleted: true,
          isCurrent: true,
        },
        {
          status: 'processing',
          label: 'Processing',
          timestamp: null,
          isCompleted: false,
          isCurrent: false,
        },
        {
          status: 'dispatched',
          label: 'Dispatched',
          timestamp: null,
          isCompleted: false,
          isCurrent: false,
        },
        {
          status: 'delivered',
          label: 'Delivered',
          timestamp: null,
          isCompleted: false,
          isCurrent: false,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ordersList = await this.loadOrders();
    ordersList.push(pendingOrder);
    await this.saveOrders(ordersList);

    return {
      success: true,
      order: pendingOrder,
      razorpayOrderId: mockRazorpayOrderId,
      amount: pricing.total,
    };
  },

  /**
   * Confirm payment after Razorpay callback
   */
  async confirmPayment(request: PaymentConfirmRequest): Promise<PaymentConfirmResponse> {
    await new Promise((r) => setTimeout(r, 1200));

    const ordersList = await this.loadOrders();
    const index = ordersList.findIndex((o) => o.id === request.orderId);
    if (index === -1) return { success: false, error: 'Order not found' };

    // Update order status and payment confirmations
    ordersList[index].paymentStatus = 'paid';
    ordersList[index].status = 'placed';
    ordersList[index].razorpayPaymentId = request.razorpayPaymentId;
    ordersList[index].updatedAt = new Date().toISOString();

    await this.saveOrders(ordersList);

    return { success: true, order: ordersList[index] };
  },

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order | null> {
    await new Promise((r) => setTimeout(r, 400));
    const ordersList = await this.loadOrders();
    return ordersList.find((o) => o.id === orderId) || null;
  },
};
