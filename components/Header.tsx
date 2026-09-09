'use client';

import React from 'react';
import { ShoppingBag, Search, User, Sparkles, Clock, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { CafeSettings, UserProfile } from '@/lib/types';

interface HeaderProps {
  cafeSettings: CafeSettings;
  cartCount: number;
  cartTotal: number;
  currentUser: UserProfile | null;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cafeSettings,
  cartCount,
  cartTotal,
  currentUser,
  onOpenCart,
  onOpenSearch,
  onOpenAuth,
  onOpenProfile
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(14, 17, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Left: Brand Logo */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Logo size="md" />
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a
            href="#hero"
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#E11D48',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Главная
          </a>
          <a
            href="#menu"
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#CBD5E1',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Меню
          </a>
          <a
            href="#offers"
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#CBD5E1',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Акции
          </a>
          <a
            href="#chef"
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#CBD5E1',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Шеф-выбор
          </a>
          <a
            href="#reviews"
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#CBD5E1',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Отзывы
          </a>
          <a
            href="#footer"
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#CBD5E1',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
          >
            Контакты
          </a>
        </nav>

        {/* Right: Actions (Search, Cart, Auth/Profile, Order button) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Поиск по блюдам"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Search size={18} />
          </button>

          {/* Cart Icon with Red Badge */}
          <button
            onClick={onOpenCart}
            aria-label="Корзина"
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#E11D48',
                  color: '#FFF',
                  fontSize: '11px',
                  fontWeight: 900,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(225, 29, 72, 0.6)'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth or Profile Button */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                color: '#FFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E11D48, #FF5500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 900
                }}
              >
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
              </div>
              <span className="profile-name-text">
                {currentUser.firstName || currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                color: '#FFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <User size={15} />
              <span>Войти</span>
            </button>
          )}

          {/* Order Now CTA (Red Pill) */}
          <a
            href="#menu"
            className="order-now-btn"
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #E11D48 0%, #FF5500 100%)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 18px rgba(225, 29, 72, 0.38)',
              transition: 'all 0.2s'
            }}
          >
            <span>Заказать онлайн</span>
          </a>
        </div>
      </div>
    </header>
  );
};
