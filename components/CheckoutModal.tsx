'use client';

import React, { useState } from 'react';
import { X, MapPin, Truck, Store, CreditCard, Banknote, ShieldCheck, ArrowRight, Navigation } from 'lucide-react';
import { CafeSettings, CartItem, Order, PaymentMethod, UserProfile } from '@/lib/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discountAmount: number;
  promoCode?: string;
  cafeSettings: CafeSettings;
  currentUser?: UserProfile | null;
  onSubmitOrder: (orderData: Partial<Order>) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discountAmount,
  promoCode,
  cafeSettings,
  currentUser,
  onSubmitOrder
}) => {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+998 ');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payme');
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.address) setAddress(currentUser.address);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const itemsTotal = cart.reduce((sum, item) => sum + item.totalItemPrice * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' && itemsTotal < cafeSettings.freeDeliveryThreshold
    ? cafeSettings.deliveryFee
    : 0;
  const finalTotal = Math.max(0, itemsTotal - discountAmount + deliveryFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Пожалуйста, укажите ваше имя');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setFormError('Пожалуйста, укажите контактный телефон');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setFormError('Пожалуйста, укажите адрес доставки');
      return;
    }

    setFormError('');
    onSubmitOrder({
      customerName: name.trim(),
      phone: phone.trim(),
      address: deliveryType === 'delivery' ? address.trim() : `Самовывоз: ${cafeSettings.address}`,
      deliveryType,
      paymentMethod,
      comment: comment.trim(),
      items: cart.map((i) => ({
        id: i.productId,
        name: i.name,
        price: i.totalItemPrice,
        quantity: i.quantity,
        selectedOptions: i.selectedOptions
      })),
      itemsTotal,
      discountAmount,
      promoCode: promoCode || null,
      deliveryFee,
      total: finalTotal
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
            Оформление заказа
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Delivery / Pickup Toggle */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '14px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => setDeliveryType('delivery')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: deliveryType === 'delivery' ? 'var(--primary-gradient)' : 'none',
              color: deliveryType === 'delivery' ? '#fff' : 'var(--text-muted)',
              boxShadow: deliveryType === 'delivery' ? '0 4px 15px rgba(255, 85, 0, 0.35)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Truck size={16} />
            <span>🚗 Доставка</span>
          </button>

          <button
            type="button"
            onClick={() => setDeliveryType('pickup')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: deliveryType === 'pickup' ? 'var(--primary-gradient)' : 'none',
              color: deliveryType === 'pickup' ? '#fff' : 'var(--text-muted)',
              boxShadow: deliveryType === 'pickup' ? '0 4px 15px rgba(255, 85, 0, 0.35)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Store size={16} />
            <span>🏃 Самовывоз</span>
          </button>
        </div>

        {formError && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px'
            }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Contact Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Ваше имя *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Алишер"
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Телефон *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 (90) 123-45-67"
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Address for delivery */}
          {deliveryType === 'delivery' ? (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Адрес доставки (Термез: улица, дом, ориентир) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const lat = pos.coords.latitude.toFixed(5);
                          const lng = pos.coords.longitude.toFixed(5);
                          setAddress(`г. Термез (GPS: ${lat}, ${lng})`);
                        },
                        () => {
                          setAddress('г. Термез, район Юбилейный');
                        }
                      );
                    } else {
                      setAddress('г. Термез, район Юбилейный');
                    }
                  }}
                  style={{
                    background: 'rgba(255, 85, 0, 0.15)',
                    border: '1px solid rgba(255, 85, 0, 0.4)',
                    color: '#FF7722',
                    borderRadius: '8px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Navigation size={12} />
                  <span>Мой GPS (Термез)</span>
                </button>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MapPin size={16} color="var(--primary)" style={{ position: 'absolute', left: '12px' }} />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="г. Термез, ул. Ат-Термизий, д. 24"
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '14px',
                fontSize: '13px'
              }}
            >
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                📍 Адрес кафе для самовывоза:
              </div>
              <div style={{ color: 'var(--text-muted)' }}>{cafeSettings.address}</div>
              <div style={{ color: 'var(--secondary)', fontSize: '12px', marginTop: '4px' }}>
                Готовность через 15–20 минут после подтверждения
              </div>
            </div>
          )}

          {/* Comment */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Комментарий к заказу
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Домофон, приборы, пожелания по остроте..."
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
              Способ оплаты
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { id: 'payme', name: 'Payme', icon: '🅿️', color: '#00CCCC' },
                { id: 'click', name: 'Click', icon: '🔵', color: '#0073FF' },
                { id: 'card', name: 'Карта', icon: '💳', color: '#8B5CF6' },
                { id: 'cash', name: 'Наличные', icon: '💵', color: '#10B981' }
              ].map((p) => {
                const isSelected = paymentMethod === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(255, 85, 0, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                      color: isSelected ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 700,
                      fontSize: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary & Submit Button */}
          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Итого к оплате:</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--secondary)' }}>
                {finalTotal.toLocaleString('ru-RU')} сум
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '14px 24px' }}>
              <span>Подтвердить заказ</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
