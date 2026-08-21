export interface Product {
  id?: string;
  sku?: string;
  title: string;
  description: string;
  price: number;
  sizes: string[];
  sizePrices?: Record<string, number>;
  colors?: string[];
  stock: number;
  imageUrl?: string;
  category?: string;
  createdAt?: string | Date | any; // Any allows for Firestore Timestamp
  updatedAt?: string | Date | any;
}

export interface Order {
  id?: string;
  friendlyId?: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    size?: string;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt?: string | Date | any;
  adminRead?: boolean;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  supportPhone: string;
  currency: string;
  flatShippingRate: number;
  featuredProductId?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  shopTheLookTitle?: string;
  shopTheLookDescription?: string;
  shopTheLookImage?: string;
  promoBannerSubtitle?: string;
  promoBannerTitle?: string;
  promoBannerDescription?: string;
  promoBannerImage?: string;
  promoBannerImage2?: string;
  newArrivalsSubtitle?: string;
  newArrivalsTitle?: string;
  promoDiscountPercentage?: number;
  promoDiscountProductIds?: string[];
}

export interface AdminUser {
  id?: string;
  username: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'staff';
  createdAt?: string | Date | any;
}
