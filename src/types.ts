export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  badge?: string;
  stock: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_special_offer: boolean;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  payment_status: 'pending' | 'confirmed' | 'failed';
  order_status: 'new' | 'processing' | 'fulfilled' | 'cancelled';
  created_at: string;
}

export const CATEGORIES = [
  'Kitchen & Cookware',
  'Kitchen Tools & Accessories',
  'Food Storage',
  'Dining & Tableware',
  'Home & Household',
  'Cleaning & Laundry',
  'Home Organization',
  'Water Bottles & Flasks',
  'Back-to-School Essentials',
  'Gifts & Souvenirs',
] as const;

export type Category = typeof CATEGORIES[number];

export function formatPrice(price: number): string {
  return '₦' + price.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
