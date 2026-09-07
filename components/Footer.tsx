'use client';

import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { CafeSettings } from '@/lib/types';

interface FooterProps {
  cafeSettings: CafeSettings;
}

export const Footer: React.FC<FooterProps> = ({ cafeSettings }) => {
  return (
    <footer
      style={{
        background: '#080A0F',
        borderTop: '1px solid var(--border)',
        padding: '60px 0 30px',
        marginTop: '60px'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}
        >
          {/* Brand Col */}
          <div>
            <Logo size="md" />
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginTop: '16px',
                marginBottom: '20px'
              }}
            >
              Сочные бургеры, лаваши, пицца, хот-доги, суши и легендарные баскские чизкейки Сан-Себастьян. Премиальное качество и доставка за 30 минут!
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span
                style={{
                  background: 'rgba(0, 115, 255, 0.15)',
                  color: '#60A5FA',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '12px'
                }}
              >
                Click
              </span>
              <span
                style={{
                  background: 'rgba(0, 204, 204, 0.15)',
                  color: '#2DD4BF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '12px'
                }}
              >
                Payme
              </span>
              <span
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#A78BFA',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '12px'
                }}
              >
                Uzcard / Humo
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Навигация
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a href="#menu" style={{ fontSize: '13px', color: 'var(--text-muted)', transition: 'color 0.2s' }}>
                  🍔 Онлайн Меню
                </a>
              </li>
              <li>
                <a href="#photo-menu" style={{ fontSize: '13px', color: 'var(--text-muted)', transition: 'color 0.2s' }}>
                  📸 Фото-Меню (Оригинал)
                </a>
              </li>
              <li>
                <a href="#delivery" style={{ fontSize: '13px', color: 'var(--text-muted)', transition: 'color 0.2s' }}>
                  📍 Условия доставки
                </a>
              </li>
              <li>
                <a href="#reviews" style={{ fontSize: '13px', color: 'var(--text-muted)', transition: 'color 0.2s' }}>
                  ⭐ Отзывы гостей
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div id="delivery">
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Контакты и график
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <Phone size={16} color="var(--primary)" />
                <a href={`tel:${cafeSettings.phoneClean}`} style={{ color: '#fff', fontWeight: 700 }}>
                  {cafeSettings.phone}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <MapPin size={16} color="var(--secondary)" />
                <span>{cafeSettings.address}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <Clock size={16} color="#10B981" />
                <span>{cafeSettings.workHours}</span>
              </li>
            </ul>
          </div>

          {/* Staff access */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Для персонала
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', lineHeight: 1.5 }}>
              Служебный вход для администраторов и кассиров заведения.
            </p>
            <a
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              <Lock size={13} />
              <span>Панель управления (Admin)</span>
            </a>
          </div>
        </div>

        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--text-dim)'
          }}
        >
          <div>© 2026 AMERICAN | Premium Fast Food. Все права защищены.</div>
          <div>Сайт и мобильный интерфейс Next.js App Router</div>
        </div>
      </div>
    </footer>
  );
};
