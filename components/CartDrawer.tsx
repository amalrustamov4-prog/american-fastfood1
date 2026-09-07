'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (discount: number, promoCode: string) => void;
  freeDeliveryThreshold: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  freeDeliveryThreshold
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const itemsTotal = cart.reduce((sum, item) => sum + item.totalItemPrice * item.quantity, 0);
  const discountAmount = appliedPromo ? Math.round((itemsTotal * appliedPromo.percent) / 100) : 0;
  const isFreeDelivery = itemsTotal >= freeDeliveryThreshold;
  const deliveryProgress = Math.min(100, Math.round((itemsTotal / freeDeliveryThreshold) * 100));
  const amountToFree = Math.max(0, freeDeliveryThreshold - itemsTotal);

  const applyPromo = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'AMERICAN' || code === 'BURGER' || code === 'FASTFOOD') {
      setAppliedPromo({ code, percent: 15 });
    } else if (code === 'PROMO10') {
      setAppliedPromo({ code, percent: 10 });
    } else {
      setPromoError('Неверный промокод (попробуйте: AMERICAN)');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100vh',
          background: '#151824',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Cart Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
              Ваш заказ ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                Очистить
              </button>
            )}
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
        </div>

        {/* Free Delivery Meter */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid var(--border)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
              <Truck size={14} color={isFreeDelivery ? 'var(--success)' : 'var(--secondary)'} />
              <span>
                {isFreeDelivery
                  ? '🎉 Поздравляем! Доставка БЕСПЛАТНО'
                  : `До бесплатной доставки: ${amountToFree.toLocaleString('ru-RU')} сум`}
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>{deliveryProgress}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${deliveryProgress}%`,
                height: '100%',
                background: isFreeDelivery ? 'var(--success)' : 'var(--primary-gradient)',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Корзина пуста
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Добавьте сочные бургеры, лаваши или чизкейки Сан-Себастьян из меню
              </p>
              <button onClick={onClose} className="btn-primary" style={{ padding: '12px 24px' }}>
                Перейти в меню
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    objectFit: 'cover'
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                    {item.name}
                  </div>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--secondary)' }}>
                      + {item.selectedOptions.map((o) => o.name).join(', ')}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--secondary)',
                      marginTop: '4px'
                    }}
                  >
                    {(item.totalItemPrice * item.quantity).toLocaleString('ru-RU')} сум
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: 800, fontSize: '14px', minWidth: '18px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{
                      background: 'none',
                      color: 'var(--text-dim)',
                      padding: '4px',
                      marginLeft: '4px'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border)',
              background: '#0E1017'
            }}
          >
            {/* Promo Code Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="Промокод (напр: AMERICAN)"
                style={{
                  flex: 1,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}
              />
              <button
                onClick={applyPromo}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                Применить
              </button>
            </div>

            {promoError && (
              <div style={{ color: '#EF4444', fontSize: '12px', marginBottom: '10px' }}>
                {promoError}
              </div>
            )}

            {appliedPromo && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34D399',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Tag size={14} />
                <span>Промокод {appliedPromo.code} активен (-{appliedPromo.percent}%)</span>
              </div>
            )}

            {/* Calculations Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>Сумма блюд:</span>
                <span>{itemsTotal.toLocaleString('ru-RU')} сум</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#10B981' }}>
                  <span>Скидка по промокоду:</span>
                  <span>-{discountAmount.toLocaleString('ru-RU')} сум</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, color: '#fff', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                <span>Итого к оплате:</span>
                <span style={{ color: 'var(--secondary)' }}>
                  {(itemsTotal - discountAmount).toLocaleString('ru-RU')} сум
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onProceedToCheckout(discountAmount, appliedPromo?.code || '');
                onClose();
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '15px' }}
            >
              <span>Оформить заказ</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
