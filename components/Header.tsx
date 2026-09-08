'use client';

import React from 'react';
import { ShoppingBag, Sparkles, Phone, Clock, Bike } from 'lucide-react';
import { Logo } from './Logo';
import { CafeSettings } from '@/lib/types';

interface HeaderProps {
  cafeSettings: CafeSettings;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenPresentation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cafeSettings,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenPresentation
}) => {
  return (
    <header className="site-header">
      <div className="container header-wrapper">
        {/* Brand Logo */}
        <a href="#hero" className="logo-brand">
          <Logo size="md" />
        </a>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <a href="#menu" className="nav-link">
              🍔 Меню
            </a>
          </li>
          <li>
            <a href="#photo-menu" className="nav-link">
              📸 Фото-меню
            </a>
          </li>
          <li>
            <a href="/courier" className="nav-link" style={{ color: '#C084FC', fontWeight: 800 }}>
              🛵 Курьер (GPS)
            </a>
          </li>
          <li>
            <a href="#delivery" className="nav-link">
              📍 Термез
            </a>
          </li>
          <li>
            <a href="#reviews" className="nav-link">
              ⭐ Отзывы
            </a>
          </li>
        </ul>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Courier Direct Link */}
          <a
            href="/courier"
            style={{
              background: 'linear-gradient(135deg, rgba(112, 0, 255, 0.25) 0%, rgba(112, 0, 255, 0.1) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#D8B4FE',
              padding: '8px 14px',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <Bike size={15} color="#C084FC" />
            <span>Курьер</span>
          </a>
          {/* Quick Presentation Button */}
          <button
            onClick={onOpenPresentation}
            style={{
              background: 'rgba(255, 184, 0, 0.12)',
              border: '1px solid rgba(255, 184, 0, 0.3)',
              color: 'var(--secondary)',
              padding: '8px 14px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={15} />
            <span>Презентация</span>
          </button>

          {/* Working Phone pill on desktop */}
          <div
            className="header-info-pill"
            style={{
              display: 'none',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border)',
              borderRadius: '9999px',
              padding: '8px 16px',
              fontSize: '13px',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Clock size={14} color="var(--primary)" />
            <span>10:00–02:00</span>
            <span>•</span>
            <Phone size={14} color="var(--secondary)" />
            <a
              href={`tel:${cafeSettings.phoneClean}`}
              style={{ color: 'var(--secondary)', fontWeight: 700 }}
            >
              {cafeSettings.phone}
            </a>
          </div>

          {/* Cart Button */}
          <button onClick={onOpenCart} className="header-cart-btn">
            <ShoppingBag size={18} />
            <span>Корзина</span>
            <span className="cart-badge-count">{cartCount}</span>
            <span style={{ fontSize: '13px', opacity: 0.9 }}>
              {cartTotal.toLocaleString('ru-RU')} сум
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
