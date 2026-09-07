import { CafeSettings, Category, MenuCardPage, Order, Product, Review } from './types';
import { CAFE_SETTINGS, INITIAL_CATEGORIES, INITIAL_MENU_PAGES, INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_REVIEWS } from './initialData';

const STORAGE_KEYS = {
  CART: 'ff_next_cart_v2',
  PRESENTATION_SEEN: 'ff_next_presentation_seen_v2'
};

export const getProducts = (): Product[] => {
  return INITIAL_PRODUCTS;
};

export const saveProducts = (products: Product[]) => {
  // Products are now managed via backend API (/api/products)
};

export const getCategories = (): Category[] => {
  return INITIAL_CATEGORIES;
};

export const getMenuPages = (): MenuCardPage[] => {
  return INITIAL_MENU_PAGES;
};

export const getReviews = (): Review[] => {
  return INITIAL_REVIEWS;
};

export const saveReviews = (reviews: Review[]) => {
  // Reviews are now managed via backend API (/api/reviews)
};

export const getOrders = (): Order[] => {
  return INITIAL_ORDERS;
};

export const saveOrders = (orders: Order[]) => {
  // Orders are now managed via backend API (/api/orders)
};

export const getCafeSettings = (): CafeSettings => {
  return CAFE_SETTINGS;
};

export const saveCafeSettings = (settings: CafeSettings) => {
  // Settings are now managed via backend API (/api/settings)
};

export const isPresentationDismissed = (): boolean => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEYS.PRESENTATION_SEEN) === 'true';
};

export const markPresentationDismissed = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PRESENTATION_SEEN, 'true');
};
