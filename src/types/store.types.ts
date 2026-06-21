export interface Category {
  id: string;
  name: string;
  icon: string;          // Ionicons name
  color: string;         // background tint color
  productCount: number;
}

export interface ProductFeature {
  icon: string;
  label: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;     // for discount display
  currency: string;           // 'INR'
  categoryId: string;
  categoryName: string;
  images: string[];           // array of image URLs
  rating: number;             // 0-5
  reviewCount: number;
  features: ProductFeature[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockLabel: string;         // "In Stock" / "Only 3 left" / "Out of Stock"
  isFeatured: boolean;
  isBestSeller: boolean;
  tags: string[];
  createdAt: string;
}

export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'popularity'
  | 'newest';

export interface SearchFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export interface SearchState {
  query: string;
  sortBy: SortOption;
  filters: SearchFilters;
  results: Product[];
  totalCount: number;
  isLoading: boolean;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundColor: string;
  image?: any;
}
