export interface OrderPreview {
  id: string;
  title: string;
  status: 'placed' | 'processing' | 'dispatched' | 'delivered';
  date: string; // ISO 8601
  total: number;
  itemCount: number;
}

export const OrdersService = {
  /**
   * Get recent orders for home screen preview
   */
  async getRecentOrders(): Promise<OrderPreview[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock data (empty for new users)
    return [];
  },
};
