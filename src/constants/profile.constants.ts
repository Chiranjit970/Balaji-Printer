import type { FAQItem, LegalDocument, ProfileMenuItem, NotificationFilter } from '../types/profile.types';

// ── Notification Filter Tabs ──────────────────────────────────────────
export const NOTIFICATION_FILTERS: { key: NotificationFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'order_update', label: 'Orders' },
  { key: 'promo', label: 'Offers' },
  { key: 'system', label: 'System' },
];

export const NOTIFICATION_TYPE_CONFIG = {
  order_update: {
    icon: 'receipt-outline',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    label: 'Order Update',
  },
  promo: {
    icon: 'pricetag-outline',
    color: '#D97706',
    bgColor: '#FFFBEB',
    label: 'Offer',
  },
  system: {
    icon: 'information-circle-outline',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    label: 'System',
  },
} as const;

// ── Profile Menu Items ──────────────────────────────────────────
export const PROFILE_MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      {
        id: 'edit-profile',
        icon: 'person-outline',
        label: 'Edit Profile',
        description: 'Update your name and details',
        route: '/(profile)/edit-profile',
        section: 'account' as const,
      },
      {
        id: 'addresses',
        icon: 'location-outline',
        label: 'My Addresses',
        description: 'Manage delivery addresses',
        route: '/(profile)/addresses',
        section: 'account' as const,
      },
    ],
  },
  {
    title: 'Notifications',
    items: [
      {
        id: 'notifications',
        icon: 'notifications-outline',
        label: 'Notification Center',
        description: 'View all your notifications',
        route: '/(profile)/notifications',
        section: 'notifications' as const,
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        id: 'help',
        icon: 'help-circle-outline',
        label: 'Help & Support',
        description: 'FAQs and contact us',
        route: '/(profile)/help',
        section: 'support' as const,
      },
      {
        id: 'legal',
        icon: 'document-text-outline',
        label: 'Legal & Policies',
        description: 'Terms, privacy, refunds',
        route: '/(profile)/legal',
        section: 'support' as const,
      },
    ],
  },
  {
    title: '',
    items: [
      {
        id: 'logout',
        icon: 'log-out-outline',
        label: 'Logout',
        description: 'Sign out of your account',
        route: 'logout',
        section: 'session' as const,
      },
    ],
  },
];

// ── FAQ Data ──────────────────────────────────────────
export const FAQ_CATEGORIES: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'orders', label: 'Orders' },
  { key: 'printing', label: 'Printing' },
  { key: 'payments', label: 'Payments' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'account', label: 'Account' },
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I place a print order?',
    answer: 'Go to the Print tab, upload your document (PDF, Word, or image), configure your print settings like paper size, color mode, sides, and binding, then review your order and add it to cart. Complete checkout with your preferred payment method.',
    category: 'orders',
  },
  {
    id: 'faq-2',
    question: 'What file formats are supported for printing?',
    answer: 'We support PDF, DOC, DOCX, JPG, JPEG, and PNG file formats. For best print quality, we recommend uploading PDF files.',
    category: 'printing',
  },
  {
    id: 'faq-3',
    question: 'Can I track my order status?',
    answer: 'Yes! Go to the Orders tab to view all your orders. Tap any order to see detailed status tracking with a visual timeline showing each stage from placement to delivery.',
    category: 'orders',
  },
  {
    id: 'faq-4',
    question: 'What paper sizes are available?',
    answer: 'We offer A4, A3, A5, Letter, and Legal paper sizes. A4 is the most common size for standard documents.',
    category: 'printing',
  },
  {
    id: 'faq-5',
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI, credit/debit cards, net banking, and popular wallets through our secure Razorpay payment gateway. Cash on delivery is also available for select areas.',
    category: 'payments',
  },
  {
    id: 'faq-6',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 2-4 business days within Chennai. Express delivery (1-2 days) is available for an additional charge. You can track your delivery status in real-time from the Orders tab.',
    category: 'delivery',
  },
  {
    id: 'faq-7',
    question: 'Can I cancel my order?',
    answer: 'You can cancel your order before it enters the "Processing" stage. Once processing has begun, cancellation is not possible. Please contact our support team for assistance with special cases.',
    category: 'orders',
  },
  {
    id: 'faq-8',
    question: 'Is my payment information secure?',
    answer: 'Absolutely. All payments are processed through Razorpay, which is PCI DSS Level 1 certified — the highest level of payment security. We never store your card details on our servers.',
    category: 'payments',
  },
  {
    id: 'faq-9',
    question: 'What is your refund policy?',
    answer: 'If there is a quality issue with your print order, we offer a full refund or free reprint. Refunds are processed within 5-7 business days. Please visit the Legal & Policies section for the complete refund policy.',
    category: 'payments',
  },
  {
    id: 'faq-10',
    question: 'Do you deliver outside Chennai?',
    answer: 'Currently, we deliver within Chennai and surrounding areas. We are working on expanding our delivery network to more cities across Tamil Nadu.',
    category: 'delivery',
  },
  {
    id: 'faq-11',
    question: 'How do I change my phone number?',
    answer: 'Currently, the phone number used during registration cannot be changed. Please contact our support team if you need to update your phone number.',
    category: 'account',
  },
  {
    id: 'faq-12',
    question: 'Can I save multiple delivery addresses?',
    answer: 'Yes! You can save multiple addresses in your profile. Go to Profile → My Addresses to add, edit, or delete addresses. You can also set a default address for quick checkout.',
    category: 'account',
  },
];

// ── Support Contact Info ──────────────────────────────────────────
export const SUPPORT_INFO = {
  phone: '+91 98765 43210',
  email: 'support@balajiprinters.com',
  whatsapp: '+919876543210',
  workingHours: 'Mon – Sat: 9:00 AM – 8:00 PM',
  address: '123, Mount Road, Chennai – 600002, Tamil Nadu',
} as const;

// ── Legal Documents ──────────────────────────────────────────
export const LEGAL_TABS = [
  { key: 'terms', label: 'Terms of Service' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'refund', label: 'Refund Policy' },
];

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  terms: {
    id: 'terms',
    title: 'Terms of Service',
    lastUpdated: '2026-01-15',
    content: `Welcome to Balaji Printers

These Terms of Service govern your use of the Balaji Printers mobile application and website. By using our services, you agree to these terms.

1. Service Description
Balaji Printers provides online document printing and stationery delivery services. Users can upload documents, configure print settings, and place orders for delivery.

2. User Accounts
You must provide a valid phone number to create an account. You are responsible for maintaining the confidentiality of your account. You must be at least 18 years old to use our services.

3. Orders & Pricing
All prices are listed in Indian Rupees (INR) and include applicable taxes. Prices are subject to change without prior notice. Once an order is confirmed and payment is processed, the order is binding.

4. Intellectual Property
You must have the rights to print any document you upload. Balaji Printers is not responsible for copyright infringement by users. We reserve the right to refuse orders that violate copyright laws.

5. Limitation of Liability
Balaji Printers is not liable for damages arising from service interruptions, delivery delays beyond our control, or issues with third-party payment processors.

6. Contact
For questions about these terms, contact us at support@balajiprinters.com.`,
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: '2026-01-15',
    content: `Privacy Policy — Balaji Printers

Your privacy is important to us. This policy explains how we collect, use, and protect your information.

1. Information We Collect
We collect your phone number for authentication, your name for personalization, delivery addresses for order fulfillment, and order history for service improvement.

2. How We Use Your Information
We use your information to process and deliver orders, send order status updates, improve our services, and communicate important announcements.

3. Data Security
We use industry-standard encryption (SSL/TLS) for all data transmission. Payment information is processed by Razorpay and never stored on our servers. Documents uploaded for printing are automatically deleted after order completion.

4. Data Sharing
We do not sell your personal data. We share information only with delivery partners (for order fulfillment) and payment processors (Razorpay) as necessary.

5. Your Rights
You can request deletion of your account and associated data by contacting our support team. You can update your profile information at any time through the app.

6. Cookies & Analytics
We use minimal analytics to improve app performance. No third-party advertising trackers are used.

7. Changes to This Policy
We may update this policy from time to time. Significant changes will be communicated through the app.

Contact: privacy@balajiprinters.com`,
  },
  refund: {
    id: 'refund',
    title: 'Refund Policy',
    lastUpdated: '2026-01-15',
    content: `Refund Policy — Balaji Printers

We want you to be completely satisfied with your order. Here is our refund policy.

1. Eligibility for Refund
Quality defects: Blurred prints, incorrect colors, missing pages, or damaged items.
Wrong order: If you receive items different from what you ordered.
Non-delivery: If your order is not delivered within the estimated timeframe.

2. Non-Refundable Cases
Change of mind after order processing has begun.
Minor color variations due to screen-to-print differences.
Orders with incorrect files uploaded by the user.

3. How to Request a Refund
Contact our support team within 48 hours of receiving your order. Provide your order ID, photos of the issue, and a brief description. Our team will review your request within 24 hours.

4. Refund Processing
Approved refunds are processed within 5-7 business days. Refunds are credited to the original payment method. For COD orders, refunds are processed via bank transfer.

5. Reprints
In some cases, we may offer a free reprint instead of a refund. Reprints are delivered with priority shipping at no additional cost.

6. Cancellation
Orders can be cancelled before they enter "Processing" status. Full refund is provided for cancelled orders. Once processing begins, cancellation is not possible.

Contact: support@balajiprinters.com | +91 98765 43210`,
  },
};
