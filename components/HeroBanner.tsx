'use client';

import React from 'react';
import { ShoppingBag, Camera, Zap, Award, CreditCard, Flame } from 'lucide-react';

interface HeroBannerProps {
  onOpenPresentation: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenPresentation }) => {
  return (
    <section className="section-block" id="hero" style={{ paddingTop: '24px' }}>
      <div className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.12) 0%, rgba(21, 24, 36, 0.9) 60%)',
            border: '1px solid rgba(255, 85, 0, 0.25)',
            borderRadius: '28px',
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Left Text */}
          <div>
            <div style={{ marginBottom: '18px' }}>
              <img
                src="/images/logo.png"
                alt="American | Premium Fast Food"
                style={{
                  height: '60px',
                  width: 'auto',
                  maxWidth: '260px',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              />
            </div>

            <h1
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#fff',
                letterSpacing: '-0.5px',
                marginBottom: '16px'
              }}
            >
              Сочные бургеры, лаваши, пицца и{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FFB800 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Сан-Себастьян
              </span>
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginBottom: '26px'
              }}
            >
              100% свежее мясо на гриле, фирменные тандырные лаваши, хрустящая пицца и легендарные чизкейки Сан-Себастьян Lotus & Nutella. Быстрая доставка в термосумках!
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <a href="#menu" className="btn-primary">
                <ShoppingBag size={18} />
                <span>Смотреть меню</span>
              </a>
              <button onClick={onOpenPresentation} className="btn-secondary">
                <Zap size={18} color="var(--secondary)" />
                <span>Презентация хитов</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)'
                }}
              >
                <Zap size={20} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800 }}>25–35 мин</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Быстрая доставка</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)'
                }}
              >
                <Award size={20} color="var(--secondary)" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800 }}>San Sebastian</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Lotus & Nutella</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)'
                }}
              >
                <CreditCard size={20} color="#60A5FA" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800 }}>Click & Payme</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Удобная оплата</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                position: 'relative'
              }}
            >
              <img
                src="/images/dish_san_seb_lotus.jpg"
                alt="San Sebastian Lotus"
                style={{
                  width: '100%',
                  height: '340px',
                  objectFit: 'cover'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  background: 'rgba(15, 18, 27, 0.85)',
                  backdropFilter: 'blur(12px)',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 184, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>
                    San Sebastian Lotus
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Хит продаж заведения
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: '16px', color: 'var(--secondary)' }}>
                  65 000 сум
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
