import { CafeSettings, Category, Order, OrderStatus, Product, Review, UserProfile } from '@/lib/types';

export const apiClient = {
  // --- AUTH ---
  async login(username: string, password: string, rememberMe: boolean = false) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, rememberMe })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка входа');
    return data;
  },

  async register(registerData: {
    username?: string;
    firstName: string;
    lastName: string;
    phone: string;
    birthDate?: string;
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
  }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
    return data;
  },

  async sendVerificationCode(email: string) {
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Не удалось отправить код');
    return data;
  },

  async resetPassword(payload: { email: string; code: string; newPassword: string }) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка сброса пароля');
    return data;
  },

  async logout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    return res.json();
  },

  async getMe(): Promise<UserProfile | null> {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Не удалось обновить профиль');
    return data.user;
  },

  // --- PRODUCTS ---
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search) params.set('search', search);

    const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Не удалось загрузить товары');
    return res.json();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        categoryId: product.category || 'burgers'
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Не удалось сохранить товар');
    return data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        categoryId: product.category
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Не удалось обновить товар');
    return data;
  },

  async toggleProductStock(id: string, inStock: boolean): Promise<any> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock })
    });
    return res.json();
  },

  async deleteProduct(id: string): Promise<any> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Не удалось удалить товар');
    return res.json();
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Не удалось загрузить категории');
    return res.json();
  },

  // --- ORDERS ---
  async getOrders(status?: string): Promise<Order[]> {
    const url = status ? `/api/orders?status=${status}` : '/api/orders';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Не удалось загрузить заказы');
    return res.json();
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders/my');
    if (!res.ok) return [];
    return res.json();
  },

  async createOrder(orderPayload: {
    customerName: string;
    phone: string;
    address: string;
    deliveryType: 'delivery' | 'pickup';
    paymentMethod: string;
    comment?: string;
    promoCode?: string | null;
    items: Array<{
      productId: string;
      quantity: number;
      selectedOptions?: any[];
    }>;
  }): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка оформления заказа');
    return data;
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    paymentStatus?: string,
    rejectionReason?: string
  ): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        paymentStatus,
        rejectionReason
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка обновления статуса');
    return data;
  },

  async cancelOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'cancelled');
  },

  // --- REVIEWS ---
  async getReviews(): Promise<Review[]> {
    const res = await fetch('/api/reviews');
    if (!res.ok) throw new Error('Не удалось загрузить отзывы');
    return res.json();
  },

  async createReview(review: { author: string; rating: number; text: string; avatar?: string }): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка добавления отзыва');
    return data;
  },

  async updateReviewStatus(id: string, status: 'approved' | 'rejected'): Promise<any> {
    const res = await fetch(`/api/reviews?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async deleteReview(id: string): Promise<any> {
    const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
    return res.json();
  },

  // --- SETTINGS ---
  async getSettings(): Promise<CafeSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Не удалось загрузить настройки');
    return res.json();
  },

  async saveSettings(settings: Partial<CafeSettings>): Promise<any> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cafeName: settings.name || settings.brand || 'AMERICAN',
        phone: settings.phone || '+998 90 822 01 01',
        address: settings.address || 'ул. Амира Темура, 45',
        deliveryFee: settings.deliveryFee ?? 15000,
        freeDeliveryThreshold: settings.freeDeliveryThreshold ?? 150000,
        minOrderAmount: 30000,
        isOpen: settings.isOpen ?? true,
        workHours: settings.workHours || '09:00 – 22:00',
        bannerText: settings.bannerText || 'Бесплатная доставка от 150 000 сум! 🔥'
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка сохранения настроек');
    return data;
  }
};
