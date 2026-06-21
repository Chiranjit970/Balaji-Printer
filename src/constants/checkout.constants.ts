export const CHECKOUT_CONFIG = {
  deliveryFee: 40,
  freeDeliveryThreshold: 500, // Free delivery above ₹500
  currency: 'INR',
  currencySymbol: '₹',
} as const;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

export const ADDRESS_LABELS = ['Home', 'Work', 'Parents Home', 'Other'];

export const MOCK_PAYMENT_METHODS = [
  {
    id: 'upi',
    title: 'UPI',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: 'qr-code-outline',
    apps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'],
  },
  {
    id: 'card',
    title: 'Cards',
    subtitle: 'Visa, MasterCard, Rupay',
    icon: 'card-outline',
  },
  {
    id: 'netbanking',
    title: 'Netbanking',
    subtitle: 'All Indian Banks',
    icon: 'business-outline',
  },
  {
    id: 'wallet',
    title: 'Wallets',
    subtitle: 'Paytm, Mobikwik & more',
    icon: 'wallet-outline',
  },
] as const;

export const TRUST_BADGES = [
  { icon: 'shield-checkmark-outline', label: 'Secure Payment' },
  { icon: 'car-outline', label: 'Safe Delivery' },
  { icon: 'mail-outline', label: 'Order Confirmation' },
  { icon: 'headset-outline', label: 'Customer Support' },
] as const;

export const PROCESSING_STEPS: Array<{ id: string; label: string }> = [
  { id: 'received', label: 'Payment Received' },
  { id: 'verifying', label: 'Verifying Payment' },
  { id: 'updating', label: 'Updating Order' },
];
