export interface ProductOption {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  weight?: string;
  calories?: string;
  image: string;
  description: string;
  inStock: boolean;
  options?: ProductOption[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedOptions: ProductOption[];
  totalItemPrice: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: ProductOption[];
}

export type OrderStatus = 'new' | 'cooking' | 'delivering' | 'completed' | 'cancelled';
export type PaymentMethod = 'payme' | 'click' | 'card' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'cash_on_delivery';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  itemsTotal: number;
  discountAmount: number;
  promoCode?: string | null;
  deliveryFee: number;
  total: number;
  comment?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  status: 'pending' | 'approved';
}

export interface MenuCardPage {
  id: string;
  title: string;
  image: string;
  category: string;
}

export interface CafeSettings {
  name: string;
  brand: string;
  slogan: string;
  phone: string;
  phoneClean: string;
  workHours: string;
  deliveryTime: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  address: string;
  currency: string;
}
