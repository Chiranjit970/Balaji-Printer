import { Order, OrderStatus, OrderSearchParams, OrdersListResponse, OrderTimelineEvent } from '../types/order.types';
import { ORDER_TIMELINE_STEPS, ORDER_STATUS_CONFIG } from '../constants/orders.constants';

export interface OrderPreview {
  id: string;
  title: string;
  status: 'placed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  date: string; // ISO 8601
  total: number;
  itemCount: number;
}

// ─── Mock Order Database ───────────────────────────────────────────────
// Seeded with sample orders for demonstration
// In production: persisted in MySQL via Laravel API

const generateTimeline = (currentStatus: OrderStatus): OrderTimelineEvent[] => {
  const currentStepIndex = ORDER_STATUS_CONFIG[currentStatus].stepIndex;
  const isCancelled = currentStatus === 'cancelled';

  return ORDER_TIMELINE_STEPS.map((step, index) => {
    const isBefore = index <= currentStepIndex && !isCancelled;
    const isCurrent = step.status === currentStatus && !isCancelled;

    const timestamps: Record<string, string> = {
      placed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      processing: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
      dispatched: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      delivered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return {
      status: step.status,
      label: step.label,
      timestamp: isBefore || isCurrent ? timestamps[step.status] : null,
      isCompleted: isBefore && step.status !== currentStatus,
      isCurrent: isCurrent,
    };
  });
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'order-001',
    displayOrderId: 'BP12345678',
    items: [
      {
        cartItemId: 'cart-print-001',
        type: 'print',
        fileName: 'Project Report.pdf',
        pageCount: 25,
        copies: 1,
        options: {
          color: 'Color',
          paperSize: 'A4',
          sides: 'Double Side',
          binding: 'No Binding',
        },
        price: 56.64,
        addedAt: new Date().toISOString(),
      },
      {
        cartItemId: 'cart-prod-001',
        type: 'product',
        productId: 'prod-001',
        name: 'Premium Visiting Card',
        price: 249,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=200',
        addedAt: new Date().toISOString(),
      },
      {
        cartItemId: 'cart-prod-002',
        type: 'product',
        productId: 'prod-004',
        name: 'Spiral Notebook A5',
        price: 129,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200',
        addedAt: new Date().toISOString(),
      },
    ],
    deliveryAddress: {
      id: 'addr-001',
      label: 'Home',
      name: 'Rohit Sharma',
      phone: '+91 98765 43210',
      line1: '123, Park Street, Anna Nagar',
      line2: '',
      landmark: 'Near Anna Nagar Tower',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      isDefault: true,
      createdAt: new Date().toISOString(),
    },
    pricing: {
      printJobsTotal: 56.64,
      productsTotal: 627.00,
      subtotal: 683.64,
      deliveryFee: 40.00,
      total: 723.64,
      currency: 'INR',
    },
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    razorpayPaymentId: 'pay_N6dk8u9s8d9k',
    timeline: generateTimeline('delivered'),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-002',
    displayOrderId: 'BP12345677',
    items: [
      {
        cartItemId: 'cart-prod-003',
        type: 'product',
        productId: 'prod-001',
        name: 'Premium Visiting Card',
        price: 249,
        quantity: 2,
        addedAt: new Date().toISOString(),
      },
    ],
    deliveryAddress: {
      id: 'addr-001',
      label: 'Home',
      name: 'Rohit Sharma',
      phone: '+91 98765 43210',
      line1: '456, GST Road, Guindy',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600032',
      isDefault: false,
      createdAt: new Date().toISOString(),
    },
    pricing: {
      printJobsTotal: 0,
      productsTotal: 498.00,
      subtotal: 498.00,
      deliveryFee: 0,
      total: 498.00,
      currency: 'INR',
    },
    status: 'dispatched',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    razorpayPaymentId: 'pay_ABC123456789',
    timeline: generateTimeline('dispatched'),
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-003',
    displayOrderId: 'BP12345676',
    items: [
      {
        cartItemId: 'cart-prod-004',
        type: 'product',
        productId: 'prod-002',
        name: 'A4 Flyer',
        price: 199,
        quantity: 1,
        addedAt: new Date().toISOString(),
      },
    ],
    deliveryAddress: {
      id: 'addr-001',
      label: 'Home',
      name: 'Rohit Sharma',
      phone: '+91 98765 43210',
      line1: '123, Park Street, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      isDefault: true,
      createdAt: new Date().toISOString(),
    },
    pricing: {
      printJobsTotal: 0,
      productsTotal: 199.00,
      subtotal: 199.00,
      deliveryFee: 40.00,
      total: 249.00,
      currency: 'INR',
    },
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    razorpayPaymentId: 'pay_XYZ987654321',
    timeline: generateTimeline('processing'),
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-004',
    displayOrderId: 'BP12345675',
    items: [
      {
        cartItemId: 'cart-prod-005',
        type: 'product',
        productId: 'prod-003',
        name: 'Roll-up Banner',
        price: 699,
        quantity: 1,
        addedAt: new Date().toISOString(),
      },
      {
        cartItemId: 'cart-prod-006',
        type: 'product',
        productId: 'prod-004',
        name: 'Spiral Notebook A5',
        price: 129,
        quantity: 3,
        addedAt: new Date().toISOString(),
      },
    ],
    deliveryAddress: {
      id: 'addr-001',
      label: 'Home',
      name: 'Rohit Sharma',
      phone: '+91 98765 43210',
      line1: '123, Park Street, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      isDefault: true,
      createdAt: new Date().toISOString(),
    },
    pricing: {
      printJobsTotal: 0,
      productsTotal: 1086.00,
      subtotal: 1086.00,
      deliveryFee: 0,
      total: 1086.00,
      currency: 'INR',
    },
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'netbanking',
    razorpayPaymentId: 'pay_CAN123456789',
    timeline: generateTimeline('cancelled'),
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Allow orders from Phase 5 checkout to be appended
const runtimeOrders: Order[] = [];

export const OrdersService = {
  /**
   * Append confirmed order from Phase 5 checkout
   */
  appendOrder(order: Order): void {
    // Add timeline and estimatedDelivery if not present
    if (!order.timeline || order.timeline.length === 0) {
      order.timeline = generateTimeline(order.status);
    }
    if (!order.estimatedDelivery) {
      order.estimatedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    }
    // Add to front so it appears first if not already present
    const exists = runtimeOrders.some(o => o.id === order.id);
    if (!exists) {
      runtimeOrders.unshift(order);
    }
  },

  /**
   * Get paginated + filtered orders list
   */
  async getOrders(params?: OrderSearchParams): Promise<OrdersListResponse> {
    await new Promise(r => setTimeout(r, 700));

    const allOrders = [...runtimeOrders, ...MOCK_ORDERS];
    let filtered = [...allOrders];

    // Filter by status
    if (params?.statusFilter && params.statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === params.statusFilter);
    }

    // Search by order ID
    if (params?.query?.trim()) {
      const q = params.query.toLowerCase().trim();
      filtered = filtered.filter(o =>
        o.displayOrderId.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q),
      );
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      orders: paginated,
      total: filtered.length,
      hasMore: start + limit < filtered.length,
    };
  },

  /**
   * Get single order by ID
   */
  async getOrder(orderId: string): Promise<Order | null> {
    await new Promise(r => setTimeout(r, 500));

    const allOrders = [...runtimeOrders, ...MOCK_ORDERS];
    return allOrders.find(o => o.id === orderId || o.displayOrderId === orderId) || null;
  },

  /**
   * Get recent orders for home screen preview (legacy support)
   */
  async getRecentOrders(): Promise<OrderPreview[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const allOrders = [...runtimeOrders, ...MOCK_ORDERS];
    
    return allOrders.slice(0, 3).map(order => {
      const firstItem = order.items[0];
      const title = firstItem 
        ? (firstItem.type === 'product' ? firstItem.name : firstItem.fileName) 
        : 'Print Order';
      
      const itemCount = order.items.reduce((acc, item) => 
        acc + (item.type === 'product' ? item.quantity : 1), 0);

      return {
        id: order.id,
        title,
        status: order.status,
        date: order.createdAt,
        total: order.pricing.total,
        itemCount,
      };
    });
  },
};
