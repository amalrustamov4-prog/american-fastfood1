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
  isPopular?: boolean;
  isChefSpecial?: boolean;
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

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'cooking'
  | 'ready'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type PaymentMethod = 'payme' | 'click' | 'card' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cash_on_delivery';

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  comment?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber?: string | null;
  userId?: string | null;
  customerName: string;
  phone: string;
  address: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  itemsTotal: number;
  discountAmount: number;
  promoCode?: string | null;
  deliveryFee: number;
  total: number;
  comment?: string;
  rejectionReason?: string | null;
}

export interface UserProfile {
  id: string;
  username?: string | null;
  phone?: string | null;
  email?: string | null;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  birthDate?: string | null;
  role: 'ADMIN' | 'CUSTOMER';
  avatar?: string | null;
  address?: string | null;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string | null;
  rating: number;
  date?: string | null;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
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
  bannerText?: string;
  isOpen?: boolean;
  minOrderAmount?: number;
  cafeName?: string;
}
