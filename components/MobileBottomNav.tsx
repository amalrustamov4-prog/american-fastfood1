'use client';

import React from 'react';
import { Home, Utensils, ShoppingBag, Clock, User } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface MobileBottomNavProps {
  cartCount: number;
  currentUser: UserProfile | null;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  currentUser,
  onOpenCart,
  onOpenAuth,
  onOpenProfile
}) => {
  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'rgba(14, 17, 24, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '64px',
        padding: '0 8px'
      }}
    >
      {/* 1. Home */}
      <a
        href="#hero"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: '#E11D48',
          textDecoration: 'none',
          fontSize: '11px',
          fontWeight: 700
        }}
      >
        <Home size={20} />
        <span>Главная</span>
      </a>

      {/* 2. Menu */}
      <a
        href="#menu"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: '#94A3B8',
          textDecoration: 'none',
          fontSize: '11px',
          fontWeight: 600
        }}
      >
        <Utensils size={20} />
        <span>Меню</span>
      </a>

      {/* 3. Cart (Center floating icon) */}
      <button
        onClick={onOpenCart}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: '#FFF',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 700
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E11D48, #FF5500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(225, 29, 72, 0.5)',
            marginTop: '-18px'
          }}
        >
          <ShoppingBag size={20} color="#FFF" />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#FFF',
                color: '#E11D48',
                fontSize: '10px',
                fontWeight: 900,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
        <span style={{ color: '#E11D48' }}>Корзина</span>
      </button>

      {/* 4. My Orders / Tracking */}
      <button
        onClick={currentUser ? onOpenProfile : onOpenAuth}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: '#94A3B8',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 600
        }}
      >
        <Clock size={20} />
        <span>Заказы</span>
      </button>

      {/* 5. Profile / Login */}
      <button
        onClick={currentUser ? onOpenProfile : onOpenAuth}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: '#94A3B8',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 600
        }}
      >
        <User size={20} />
        <span>{currentUser ? (currentUser.firstName || 'Профиль') : 'Войти'}</span>
      </button>
    </div>
  );
};
