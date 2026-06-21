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
  const timestamp = Date.now().toString().slice(-8);
  return `BP${timestamp}`;
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

// In-memory order store
const orders: Order[] = [];

export const OrderService = {
  /**
   * Calculate order pricing from cart items
   */
  calculatePricing,

  /**
   * Create pending order before payment
   * Future: POST /orders/checkout → returns razorpay_order_id
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    await new Promise((r) => setTimeout(r, 800));

    const pricing = calculatePricing(request.items);
    const orderId = `order_${Date.now()}`;
    const displayOrderId = generateOrderId();

    // Mock razorpay order (future: real Razorpay API call on backend)
    const mockRazorpayOrderId = `rzp_order_${Date.now()}`;

    // Store pending order
    const pendingOrder: Order = {
      id: orderId,
      displayOrderId,
      items: request.items,
      deliveryAddress: { id: request.deliveryAddressId } as any, // placeholder, resolved during confirm or review
      pricing,
      status: 'placed',
      paymentStatus: 'pending',
      paymentMethod: request.paymentMethod,
      razorpayOrderId: mockRazorpayOrderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(pendingOrder);

    return {
      success: true,
      order: pendingOrder,
      razorpayOrderId: mockRazorpayOrderId,
      amount: pricing.total,
    };
  },

  /**
   * Confirm payment after Razorpay callback
   * Future: POST /payments/confirm { order_id, razorpay_payment_id, signature }
   */
  async confirmPayment(request: PaymentConfirmRequest): Promise<PaymentConfirmResponse> {
    await new Promise((r) => setTimeout(r, 1200));

    const order = orders.find((o) => o.id === request.orderId);
    if (!order) return { success: false, error: 'Order not found' };

    // Update order
    order.paymentStatus = 'paid';
    order.status = 'placed';
    order.razorpayPaymentId = request.razorpayPaymentId;
    order.updatedAt = new Date().toISOString();

    return { success: true, order };
  },

  /**
   * Get order by ID
   * Future: GET /orders/{id}
   */
  async getOrder(orderId: string): Promise<Order | null> {
    await new Promise((r) => setTimeout(r, 400));
    return orders.find((o) => o.id === orderId) || null;
  },
};
