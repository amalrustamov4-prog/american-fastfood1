'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { WelcomePresentation } from '@/components/WelcomePresentation';
import { MenuSection } from '@/components/MenuSection';
import { PhotoMenuSection } from '@/components/PhotoMenuSection';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { PaymentSimulator } from '@/components/PaymentSimulator';
import { ThermalReceipt } from '@/components/ThermalReceipt';
import { CourierTracker } from '@/components/CourierTracker';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/lib/api/client';
import { isPresentationDismissed, markPresentationDismissed } from '@/lib/storage';
import {
  CafeSettings,
  CartItem,
  Category,
  MenuCardPage,
  Order,
  PaymentMethod,
  Product,
  ProductOption,
  Review
} from '@/lib/types';
import { CAFE_SETTINGS, INITIAL_CATEGORIES, INITIAL_MENU_PAGES, INITIAL_PRODUCTS, INITIAL_REVIEWS } from '@/lib/initialData';
import { Home, Utensils, Camera, ShoppingBag, MapPin, X } from 'lucide-react';

export default function CustomerPage() {
  // Data State with initial fallbacks
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuPages, setMenuPages] = useState<MenuCardPage[]>(INITIAL_MENU_PAGES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [cafeSettings, setCafeSettings] = useState<CafeSettings>(CAFE_SETTINGS);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromo, setCheckoutPromo] = useState('');

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
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

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
    // Load fresh data from PostgreSQL API
    loadInitialData();

    // Show presentation on first visit
    if (!isPresentationDismissed()) {
      setIsPresentationOpen(true);
    }
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
      }
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
    });

    setIsCartOpen(true);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, 1, []);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- CHECKOUT & PAYMENT FLOW ---
  const handleProceedToCheckout = (discount: number, promo: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromo(promo);
    setIsCheckoutOpen(true);
  };

  const handleSubmitOrder = async (orderPayload: any) => {
    setIsCheckoutOpen(false);

    if (
      orderPayload.paymentMethod === 'payme' ||
      orderPayload.paymentMethod === 'click' ||
      orderPayload.paymentMethod === 'card'
    ) {
      setPaymentSimData({
        isOpen: true,
        method: orderPayload.paymentMethod,
        total: orderPayload.total || 0,
        orderData: orderPayload
      });
    } else {
      await processServerOrder(orderPayload);
    }
  };

  const processServerOrder = async (orderPayload: any) => {
    try {
      // Send order to backend API with server-side calculation
      const serverOrder = await apiClient.createOrder({
        customerName: orderPayload.customerName,
        phone: orderPayload.phone,
        address: orderPayload.address,
        deliveryType: orderPayload.deliveryType,
        paymentMethod: orderPayload.paymentMethod,
        comment: orderPayload.comment,
        promoCode: orderPayload.promoCode,
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedOptions: i.selectedOptions
        }))
      });

      setCart([]);
      setReceiptOrder(serverOrder);
      if (serverOrder.deliveryType === 'delivery') {
        setTrackingOrder(serverOrder);
      }
    } catch (err: any) {
      alert(err.message || 'Ошибка оформления заказа. Попробуйте еще раз.');
    }
  };

  const handlePaymentSimulatorSuccess = async () => {
    setPaymentSimData((prev) => ({ ...prev, isOpen: false }));
    if (paymentSimData.orderData) {
      await processServerOrder(paymentSimData.orderData);
    }
  };

  // --- REVIEWS ---
  const handleSubmitReview = async (newRev: { author: string; rating: number; text: string }) => {
    try {
      const created = await apiClient.createReview(newRev);
      setReviews((prev) => [created, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Не удалось отправить отзыв');
    }
  };

  // --- LIGHTBOX ---
  const handleOpenLightbox = (image: string, title: string) => {
    setLightboxData({ isOpen: true, image, title });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Site Header */}
      <Header
        cafeSettings={cafeSettings}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <HeroBanner onOpenPresentation={() => setIsPresentationOpen(true)} />

        <PhotoMenuSection
          menuPages={menuPages}
          onOpenLightbox={handleOpenLightbox}
        />

        <MenuSection
          products={products}
          categories={categories}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          onQuickAdd={handleQuickAdd}
          onOpenImageZoom={handleOpenLightbox}
        />

        <ReviewsSection
          reviews={reviews}
          onSubmitReview={handleSubmitReview}
        />
      </main>

      {/* Footer */}
      <Footer cafeSettings={cafeSettings} />

      {/* Mobile Bottom Bar Navigation */}
      <nav className="mobile-bottom-nav">
        <a href="#hero" className="mobile-nav-item active">
          <Home size={18} />
          <span>Главная</span>
        </a>
        <a href="#menu" className="mobile-nav-item">
          <Utensils size={18} />
          <span>Меню</span>
        </a>
        <a href="#photo-menu" className="mobile-nav-item">
          <Camera size={18} />
          <span>Фото</span>
        </a>
        <button
          onClick={() => setIsCartOpen(true)}
          className="mobile-nav-item"
        >
          <ShoppingBag size={18} />
          <span>Корзина</span>
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '12px',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 900,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
        <a href="#delivery" className="mobile-nav-item">
          <MapPin size={18} />
          <span>Локация</span>
        </a>
      </nav>

      {/* Modals & Overlays */}
      <WelcomePresentation
        isOpen={isPresentationOpen}
        onClose={() => {
          setIsPresentationOpen(false);
          markPresentationDismissed();
        }}
        onSelectMenu={() => {
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenImageZoom={handleOpenLightbox}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        freeDeliveryThreshold={cafeSettings.freeDeliveryThreshold}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        discountAmount={checkoutDiscount}
        promoCode={checkoutPromo}
        cafeSettings={cafeSettings}
        onSubmitOrder={handleSubmitOrder}
      />

      <PaymentSimulator
        isOpen={paymentSimData.isOpen}
        onClose={() => setPaymentSimData((prev) => ({ ...prev, isOpen: false }))}
        method={paymentSimData.method}
        total={paymentSimData.total}
        onPaymentSuccess={handlePaymentSimulatorSuccess}
      />

      <ThermalReceipt
        order={receiptOrder}
        cafeSettings={cafeSettings}
        onClose={() => setReceiptOrder(null)}
      />

      {trackingOrder && (
        <CourierTracker
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}

      {/* Lightbox Modal */}
      {lightboxData.isOpen && (
        <div
          className="modal-overlay"
          onClick={() => setLightboxData({ isOpen: false, image: '', title: '' })}
          style={{ zIndex: 1300, background: 'rgba(0, 0, 0, 0.88)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setLightboxData({ isOpen: false, image: '', title: '' })}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)'
              }}
            >
              <X size={20} />
            </button>

            <img
              src={lightboxData.image}
              alt={lightboxData.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '16px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
              }}
            />
            <div
              style={{
                marginTop: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '6px 16px',
                borderRadius: '9999px'
              }}
            >
              {lightboxData.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
