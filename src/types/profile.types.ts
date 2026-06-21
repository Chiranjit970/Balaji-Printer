// Notification types
export type NotificationType = 'order_update' | 'promo' | 'system';
export type NotificationFilter = 'all' | 'order_update' | 'promo' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
  orderId?: string; // For order_update type — enables deep-link navigation
}

// FAQ types
export type FAQCategory = 'orders' | 'printing' | 'payments' | 'delivery' | 'account';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

// Legal documents
export interface LegalDocument {
  id: string;
  title: string;
  content: string; // Plain text content with section headers
  lastUpdated: string;
}

// Profile menu
export interface ProfileMenuItem {
  id: string;
  icon: string;
  label: string;
  description?: string;
  route: string;
  badge?: number;
  section: 'account' | 'notifications' | 'support' | 'session';
}
