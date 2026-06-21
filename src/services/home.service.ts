import { homeContent } from '../constants/home.constants';

export interface HomeData {
  user: {
    name: string;
    greeting: string;
  };
  promotional: {
    title: string;
    subtitle: string;
    ctaText: string;
    image: any;
  };
  quickActions: Array<{
    id: string;
    icon: string;
    label: string;
    route: string;
    color: string;
  }>;
  features: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    illustration: any;
  }>;
  recentOrders: Array<{
    id: string;
    title: string;
    status: string;
    date: string;
    total: number;
  }>;
}

export const HomeService = {
  /**
   * Get home screen data
   */
  async getHomeData(userName: string): Promise<HomeData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get time-based greeting
    const hour = new Date().getHours();
    let greeting: string = homeContent.greeting.morning;
    if (hour >= 12 && hour < 17) greeting = homeContent.greeting.afternoon;
    if (hour >= 17) greeting = homeContent.greeting.evening;
    
    return {
      user: {
        name: userName || 'Guest',
        greeting,
      },
      promotional: homeContent.promotionalCard,
      quickActions: [...homeContent.quickActions],
      features: [...homeContent.features],
      recentOrders: [], // Empty for new users (Phase 6 will populate)
    };
  },
};
