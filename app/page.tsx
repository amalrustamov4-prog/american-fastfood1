'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryBar } from '@/components/CategoryBar';
import { PopularDishes } from '@/components/PopularDishes';
import { SpecialOffersBanner } from '@/components/SpecialOffersBanner';
import { ChefSpecial } from '@/components/ChefSpecial';
import { MenuSection } from '@/components/MenuSection';
import { PhotoMenuSection } from '@/components/PhotoMenuSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { PaymentSimulator } from '@/components/PaymentSimulator';
import { ThermalReceipt } from '@/components/ThermalReceipt';
import { AuthModal } from '@/components/AuthModal';
import { UserProfileModal } from '@/components/UserProfileModal';
import { SearchModal } from '@/components/SearchModal';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { apiClient } from '@/lib/api/client';
import {
  CafeSettings,
  CartItem,
  Category,
  MenuCardPage,
  Order,
  PaymentMethod,
  Product,
  ProductOption,
  Review,
  UserProfile
} from '@/lib/types';
import {
  CAFE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_PAGES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS
} from '@/lib/initialData';
import { X } from 'lucide-react';

export default function CustomerPage() {
  // Data State with initial fallbacks
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuPages, setMenuPages] = useState<MenuCardPage[]>(INITIAL_MENU_PAGES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [cafeSettings, setCafeSettings] = useState<CafeSettings>(CAFE_SETTINGS);

  // Active Category filter
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromo, setCheckoutPromo] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Payment Sim & Receipt
  const [paymentSimData, setPaymentSimData] = useState<{
    isOpen: boolean;
    method: PaymentMethod;
    total: number;
    orderData?: any;
  }>({
    isOpen: false,
    method: 'payme',
    total: 0
  });
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Image Lightbox
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    image: string;
    title: string;
  }>({
    isOpen: false,
    image: '',
    title: ''
  });

  useEffect(() => {
    loadInitialData();
    checkCurrentUser();
  }, []);

  const loadInitialData = async () => {
    try {
      const [prods, cats, revs, settings] = await Promise.all([
        apiClient.getProducts().catch(() => INITIAL_PRODUCTS),
        apiClient.getCategories().catch(() => INITIAL_CATEGORIES),
        apiClient.getReviews().catch(() => INITIAL_REVIEWS),
        apiClient.getSettings().catch(() => CAFE_SETTINGS)
      ]);
      setProducts(prods);
      setCategories(cats);
      setReviews(revs);
      setCafeSettings(settings);
    } catch (e) {
      console.warn('Using initial fallback data:', e);
    }
  };

  const checkCurrentUser = async () => {
    try {
      const me = await apiClient.getMe();
      if (me) {
        setCurrentUser(me);
      }
    } catch (e) {
      // not logged in
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalItemPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- CART HANDLERS ---
  const handleAddToCart = (product: Product, quantity: number, options: ProductOption[]) => {
    const optionsTotal = options.reduce((sum, o) => sum + o.price, 0);
    const totalItemPrice = product.price + optionsTotal;

    const optionKey = options.map((o) => o.name).sort().join('_');
    const cartItemId = `${product.id}_${optionKey}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            selectedOptions: options,
            totalItemPrice
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, 1, []);
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- CHECKOUT & ORDER SUBMIT ---
  const handleStartCheckout = (discount: number, promo: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromo(promo);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSubmitOrder = async (orderData: Partial<Order>) => {
    try {
      const payload = {
        customerName: orderData.customerName || 'Гость',
        phone: orderData.phone || '+998 90 000 00 00',
        address: orderData.address || 'Термез',
        deliveryType: orderData.deliveryType || 'delivery',
        paymentMethod: orderData.paymentMethod || 'cash',
        comment: orderData.comment || '',
        promoCode: orderData.promoCode,
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedOptions: i.selectedOptions
        }))
      };

      const createdOrder = await apiClient.createOrder(payload);

      setIsCheckoutOpen(false);
      handleClearCart();

      // If online payment (click, payme, card), open payment simulator
      if (orderData.paymentMethod === 'click' || orderData.paymentMethod === 'payme' || orderData.paymentMethod === 'card') {
        setPaymentSimData({
          isOpen: true,
          method: orderData.paymentMethod,
          total: createdOrder.total,
          orderData: createdOrder
        });
      } else {
        // Cash order complete -> show receipt & open profile if logged in
        setReceiptOrder(createdOrder);
      }
    } catch (e: any) {
      alert(e.message || 'Ошибка оформления заказа');
    }
  };

  const handlePaymentSuccess = async () => {
    if (!paymentSimData.orderData) return;
    try {
      const updated = await apiClient.updateOrderStatus(
        paymentSimData.orderData.id,
        'new',
        'paid'
      );
      setPaymentSimData({ isOpen: false, method: 'payme', total: 0 });
      setReceiptOrder(updated);
    } catch (e) {
      setPaymentSimData({ isOpen: false, method: 'payme', total: 0 });
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      setCurrentUser(null);
      setIsProfileOpen(false);
    } catch (e) {
      setCurrentUser(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D14', color: '#FFF' }}>
      {/* 1. Header (with FLAVORA KITCHEN reference links, search, cart, auth) */}
      <Header
        cafeSettings={cafeSettings}
        cartCount={cartCount}
        cartTotal={cartTotal}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 2. Main Hero Banner matching Reference Image ("Experience Taste Like Never Before") */}
      <HeroBanner
        cafeSettings={cafeSettings}
        onExploreMenu={() => {
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Browse Categories (Circular Icons matching Reference Image) */}
      <CategoryBar
        categories={categories}
        activeCategory={selectedCategoryId}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. Popular Dishes Grid (Cards matching Reference Image with Stars, Badge, Round Cart button) */}
      <PopularDishes
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onQuickAdd={handleQuickAdd}
      />

      {/* 5. Special Offers Banner (Orange/Red 20% OFF Card matching Reference) */}
      <SpecialOffersBanner />

      {/* 6. Chef's Special (Seafood Paella / Chef Choice Card matching Reference) */}
      <ChefSpecial
        product={products.find((p) => p.isChefSpecial)}
        onOrderNow={(p) => {
          handleQuickAdd(p);
        }}
      />

      {/* 7. Full Interactive Menu Catalog with Filters, Search, Modifiers */}
      <MenuSection
        products={products}
        categories={categories}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onQuickAdd={handleQuickAdd}
        onOpenImageZoom={(image, title) => setLightboxData({ isOpen: true, image, title })}
      />

      {/* 8. Photo Menu Presentation Pages */}
      <PhotoMenuSection
        menuPages={menuPages}
        onOpenLightbox={(image, title) => setLightboxData({ isOpen: true, image, title })}
      />

      {/* 9. Customer Reviews */}
      <ReviewsSection
        reviews={reviews}
        onSubmitReview={async (rev) => {
          try {
            await apiClient.createReview(rev);
            loadInitialData();
          } catch (e) {
            // ignore
          }
        }}
      />

      {/* 10. Footer */}
      <Footer cafeSettings={cafeSettings} />

      {/* 11. Mobile App Bottom Navigation Bar */}
      <MobileBottomNav
        cartCount={cartCount}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* --- MODALS --- */}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenImageZoom={(image, title) => setLightboxData({ isOpen: true, image, title })}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        freeDeliveryThreshold={cafeSettings.freeDeliveryThreshold}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleStartCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        discountAmount={checkoutDiscount}
        promoCode={checkoutPromo}
        cafeSettings={cafeSettings}
        currentUser={currentUser}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Payment Simulator */}
      <PaymentSimulator
        isOpen={paymentSimData.isOpen}
        onClose={() => setPaymentSimData({ isOpen: false, method: 'payme', total: 0 })}
        method={paymentSimData.method}
        total={paymentSimData.total}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Thermal Receipt Modal */}
      {receiptOrder && (
        <ThermalReceipt
          order={receiptOrder}
          cafeSettings={cafeSettings}
          onClose={() => setReceiptOrder(null)}
        />
      )}

      {/* Auth Modal (Login / Register with 6-digit code / Reset Password) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* User Profile Modal (Live Order Status / Order History / Edit Profile) */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onProfileUpdated={(updated) => setCurrentUser(updated)}
          cafeSettings={cafeSettings}
        />
      )}

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onQuickAdd={handleQuickAdd}
      />

      {/* Image Lightbox */}
      {lightboxData.isOpen && (
        <div
          className="modal-overlay"
          onClick={() => setLightboxData({ isOpen: false, image: '', title: '' })}
          style={{ zIndex: 1200 }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: '16px',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxData({ isOpen: false, image: '', title: '' })}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>
            <img
              src={lightboxData.image}
              alt={lightboxData.title}
              style={{
                width: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
