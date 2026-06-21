import { colors } from './colors';

export const homeColors = {
  ...colors,
  
  // Home-specific semantic colors
  headerBackground: colors.white,
  headerBorder: colors.border,
  
  promoCardBg: colors.blueLight,
  promoCardBorder: colors.blue,
  
  quickActionBg: colors.surface,
  quickActionBgActive: colors.blueLight,
  quickActionIcon: colors.blue,
  
  featureCardBg: colors.white,
  featureCardBorder: colors.border,
  featureIconBg: colors.blueLight,
  
  skeletonBase: colors.surface,
  skeletonHighlight: colors.white,
  
  badgeBackground: colors.danger,
  badgeText: colors.white,
} as const;

export const homeContent = {
  greeting: {
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
  },
  
  promotionalCard: {
    title: 'Print from Anywhere',
    subtitle: 'Upload documents and get them delivered to your doorstep',
    ctaText: 'Start Printing',
    image: require('../../assets/illustrations/home-hero.png'),
  },
  
  quickActions: [
    {
      id: 'upload-print',
      icon: 'document-text-outline',
      label: 'Upload & Print',
      route: '/(print)/upload',
      color: colors.blue,
    },
    {
      id: 'store',
      icon: 'cart-outline',
      label: 'Browse Store',
      route: '/(tabs)/store',
      color: colors.blue,
    },
    {
      id: 'orders',
      icon: 'list-outline',
      label: 'My Orders',
      route: '/(tabs)/orders',
      color: colors.blue,
    },
    {
      id: 'support',
      icon: 'help-circle-outline',
      label: 'Help & Support',
      route: '/support',
      color: colors.blue,
    },
  ],
  
  features: [
    {
      id: 'fast-processing',
      icon: 'flash-outline',
      title: 'Fast Processing',
      description: 'Quick turnaround time for all print jobs',
      illustration: require('../../assets/illustrations/fast-delivery.png'),
    },
    {
      id: 'quality-printing',
      icon: 'checkmark-circle-outline',
      title: 'High Quality',
      description: 'Premium paper and professional printing',
      illustration: require('../../assets/illustrations/quality-print.png'),
    },
    {
      id: 'affordable-pricing',
      icon: 'pricetag-outline',
      title: 'Best Prices',
      description: 'Competitive rates with no hidden charges',
      illustration: require('../../assets/illustrations/quality-print.png'),
    },
    {
      id: 'secure-transactions',
      icon: 'shield-checkmark-outline',
      title: 'Secure Payments',
      description: 'Safe and encrypted transactions',
      illustration: require('../../assets/illustrations/security-shield.png'),
    },
  ],
} as const;
