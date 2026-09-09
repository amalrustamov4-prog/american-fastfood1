'use client';

import React, { useState } from 'react';
import { Tag, Check, ArrowRight, Sparkles } from 'lucide-react';

export const SpecialOffersBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const promoCode = 'CHEEZ20';

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="offers" style={{ padding: '20px 0 35px' }}>
      <div className="container">
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(110deg, #D92323 0%, #EA580C 50%, #F59E0B 100%)',
            borderRadius: '24px',
            padding: '36px 40px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 16px 40px rgba(217, 35, 35, 0.35)'
          }}
        >
          {/* Background Decorative Pattern */}
          <div
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          {/* Left Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px' }}>
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(0, 0, 0, 0.25)',
                color: '#FFF',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}
            >
              <Tag size={12} />
              <span>SPECIAL OFFERS</span>
            </div>

            {/* Headline */}
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.15,
                margin: '0 0 10px 0',
                letterSpacing: '-0.5px'
              }}
            >
              ENJOY 20% OFF <br />YOUR FIRST ORDER!
            </h2>

            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', margin: '0 0 18px 0', lineHeight: 1.5 }}>
              Используйте промокод при первом заказе и наслаждайтесь блюдами со скидкой 20%.
            </p>

            {/* Promo Code Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <div
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#FFFFFF',
                  color: '#D92323',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '14px',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}
              >
                <span>{promoCode}</span>
                {copied ? <Check size={16} color="#10B981" /> : <Tag size={15} />}
              </div>
              <span style={{ color: '#FFF', fontSize: '12px', fontWeight: 600 }}>
                {copied ? 'Скопировано!' : 'Нажмите чтобы скопировать'}
              </span>
            </div>
          </div>

          {/* Right Floating Image Graphic */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '260px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="/images/burger.webp"
              alt="Special Burger Offer"
              onError={(e) => {
                (e.target as any).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80';
              }}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))',
                transform: 'rotate(-5deg)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
