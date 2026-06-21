import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  PROMO_BANNERS,
} from '../constants/store.constants';
import { Product, Category, SortOption, SearchFilters } from '../types/store.types';

export const StoreService = {
  /**
   * Get all categories
   * Future: GET /categories
   */
  async getCategories(): Promise<Category[]> {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_CATEGORIES;
  },

  /**
   * Get products with optional filtering
   * Future: GET /products?category_id=&q=&sort=&page=
   */
  async getProducts(params?: {
    categoryId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    await new Promise(r => setTimeout(r, 700));

    let filtered = [...MOCK_PRODUCTS];

    if (params?.categoryId && params.categoryId !== 'all') {
      filtered = filtered.filter(p => p.categoryId === params.categoryId);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      products: paginated,
      total: filtered.length,
      hasMore: start + limit < filtered.length,
    };
  },

  /**
   * Get featured products
   * Future: GET /products?featured=true
   */
  async getFeaturedProducts(): Promise<Product[]> {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_PRODUCTS.filter(p => p.isFeatured);
  },

  /**
   * Get best sellers
   * Future: GET /products?best_seller=true
   */
  async getBestSellers(): Promise<Product[]> {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_PRODUCTS.filter(p => p.isBestSeller);
  },

  /**
   * Get single product by ID
   * Future: GET /products/{id}
   */
  async getProduct(id: string): Promise<Product | null> {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  },

  /**
   * Search products by keyword
   * Future: GET /products?q=keyword
   */
  async searchProducts(params: {
    query: string;
    sortBy?: SortOption;
    filters?: SearchFilters;
    page?: number;
  }): Promise<{ products: Product[]; total: number }> {
    await new Promise(r => setTimeout(r, 600));

    const query = params.query.toLowerCase().trim();
    let results = MOCK_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.includes(query)) ||
      p.categoryName.toLowerCase().includes(query),
    );

    // Apply filters
    if (params.filters?.categoryId && params.filters.categoryId !== 'all') {
      results = results.filter(p => p.categoryId === params.filters!.categoryId);
    }
    if (params.filters?.inStockOnly) {
      results = results.filter(p => p.inStock);
    }
    if (params.filters?.minPrice) {
      results = results.filter(p => p.price >= params.filters!.minPrice!);
    }
    if (params.filters?.maxPrice) {
      results = results.filter(p => p.price <= params.filters!.maxPrice!);
    }

    // Apply sort
    switch (params.sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        results.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        results.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // Relevance - no sort
        break;
    }

    return { products: results, total: results.length };
  },

  /**
   * Get related products
   * Future: GET /products/{id}/related
   */
  async getRelatedProducts(productId: string, categoryId: string): Promise<Product[]> {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_PRODUCTS
      .filter(p => p.categoryId === categoryId && p.id !== productId)
      .slice(0, 6);
  },

  /**
   * Get promotional banners
   * Future: GET /banners
   */
  async getPromoBanners() {
    await new Promise(r => setTimeout(r, 300));
    return PROMO_BANNERS;
  },
};
