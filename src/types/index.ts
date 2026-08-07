export interface Product {
  id?: string;
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
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  supportPhone: string;
  currency: string;
  flatShippingRate: number;
  featuredProductId?: string;
}
