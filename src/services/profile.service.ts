import type { Notification, LegalDocument } from '../types/profile.types';
import type { User } from '../types/auth.types';
import { LEGAL_DOCUMENTS } from '../constants/profile.constants';

// ── Mock Notification Database ──────────────────────────────────────
const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'order_update',
    title: 'Order Dispatched! 🚚',
    body: 'Your order #ORD-2026-001 has been dispatched and is on its way to you.',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    orderId: 'order-001',
  },
  {
    id: 'notif-002',
    type: 'promo',
    title: '🎉 20% Off All Color Prints!',
    body: 'Use code COLOR20 at checkout. Valid until June 30th. Don\'t miss out!',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: 'notif-003',
    type: 'order_update',
    title: 'Order Delivered ✅',
    body: 'Your order #ORD-2026-002 has been successfully delivered. Rate your experience!',
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    orderId: 'order-002',
  },
  {
    id: 'notif-004',
    type: 'system',
    title: 'Welcome to Balaji Printers!',
    body: 'Thank you for joining us. Start by uploading your first document for printing.',
    read: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 'notif-005',
    type: 'promo',
    title: '📦 Free Delivery This Weekend!',
    body: 'Get free delivery on all orders above ₹200 this Saturday and Sunday.',
    read: false,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: 'notif-006',
    type: 'order_update',
    title: 'Order Confirmed 🎯',
    body: 'Your order #ORD-2026-003 has been confirmed and is being prepared.',
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    orderId: 'order-003',
  },
  {
    id: 'notif-007',
    type: 'system',
    title: 'New Feature: Order Tracking 📍',
    body: 'You can now track your orders in real-time from the Orders tab. Check it out!',
    read: true,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

export const ProfileService = {
  /**
   * Update user profile
   * Future: PUT /profile
   */
  async updateProfile(data: { name: string }): Promise<User> {
    await new Promise((r) => setTimeout(r, 800));
    // Simulated update — return updated user object
    return {
      id: 'user-001',
      name: data.name,
      phone: '+91 98765 43210',
      createdAt: '2025-12-01T10:00:00Z',
    };
  },

  /**
   * Get all notifications
   * Future: GET /notifications
   */
  async getNotifications(): Promise<Notification[]> {
    await new Promise((r) => setTimeout(r, 600));
    return [...mockNotifications].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  /**
   * Mark a notification as read
   * Future: PATCH /notifications/{id}/read
   */
  async markNotificationRead(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) notif.read = true;
  },

  /**
   * Mark all notifications as read
   * Future: POST /notifications/mark-all-read
   */
  async markAllRead(): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    mockNotifications.forEach((n) => {
      n.read = true;
    });
  },

  /**
   * Get unread notification count
   * Future: GET /notifications/unread-count
   */
  async getUnreadCount(): Promise<number> {
    await new Promise((r) => setTimeout(r, 200));
    return mockNotifications.filter((n) => !n.read).length;
  },

  /**
   * Get a legal document by ID
   * Future: GET /legal/{id}
   */
  async getLegalDocument(id: string): Promise<LegalDocument | null> {
    await new Promise((r) => setTimeout(r, 300));
    return LEGAL_DOCUMENTS[id] || null;
  },
};
