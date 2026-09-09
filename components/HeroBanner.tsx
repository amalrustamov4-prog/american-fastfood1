'use client';

import React from 'react';
import { ArrowRight, Sparkles, Flame, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { CafeSettings } from '@/lib/types';

interface HeroBannerProps {
  cafeSettings: CafeSettings;
  onExploreMenu: () => void;
  onOpenPresentation?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  cafeSettings,
  onExploreMenu
}) => {
  return (
    <section id="hero" style={{ padding: '24px 0 36px', position: 'relative' }}>
      <div className="container">
        {/* Main Dark Hero Card matching Reference Image */}
        <div
          style={{
            position: 'relative',
            background: 'radial-gradient(ellipse at center, #1E2330 0%, #0D1017 100%)',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '50px 30px',
            overflow: 'hidden',
            minHeight: '440px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Subtle Background Glows */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(225, 29, 72, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          {/* Floating Food Dishes Around Banner (Matching Reference) */}
          {/* Top Left: Crispy Chicken */}
          <div
            className="floating-hero-dish hero-dish-top-left"
            style={{
              position: 'absolute',
              top: '15px',
              left: '20px',
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              border: '3px solid rgba(255, 255, 255, 0.12)',
              transition: 'transform 0.4s ease'
            }}
          >
            <img
              src="/images/chicken.webp"
              alt="Chicken"
              onError={(e) => {
                (e.target as any).src = 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Top Center: Starters / Samosa */}
          <div
            className="floating-hero-dish hero-dish-top-center"
            style={{
              position: 'absolute',
              top: '15px',
              left: '46%',
              transform: 'translateX(-50%)',
              width: '95px',
              height: '95px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              border: '3px solid rgba(255, 255, 255, 0.12)',
              transition: 'transform 0.4s ease'
            }}
          >
            <img
              src="/images/doner.webp"
              alt="Starters"
              onError={(e) => {
                (e.target as any).src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Top Right: Juicy Burger */}
          <div
            className="floating-hero-dish hero-dish-top-right"
            style={{
              position: 'absolute',
              top: '15px',
              right: '25px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              border: '3px solid rgba(255, 255, 255, 0.12)',
              transition: 'transform 0.4s ease'
            }}
          >
            <img
              src="/images/burger.webp"
              alt="Burger"
              onError={(e) => {
                (e.target as any).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Bottom Left: Cheeseburger */}
          <div
            className="floating-hero-dish hero-dish-bottom-left"
            style={{
              position: 'absolute',
              bottom: '15px',
              left: '25px',
              width: '115px',
              height: '115px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              border: '3px solid rgba(255, 255, 255, 0.12)',
              transition: 'transform 0.4s ease'
            }}
          >
            <img
              src="/images/burger.webp"
              alt="Double Burger"
              onError={(e) => {
                (e.target as any).src = 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Bottom Center: Italian Pasta */}
          <div
            className="floating-hero-dish hero-dish-bottom-center"
            style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '125px',
              height: '125px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              border: '3px solid rgba(255, 255, 255, 0.12)',
              transition: 'transform 0.4s ease'
            }}
          >
            <img
              src="/images/pizza.webp"
              alt="Pasta"
              onError={(e) => {
                (e.target as any).src = 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=300&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Bottom Right: Hot Curry Stew */}
          <div
            className="floating-hero-dish hero-dish-bottom-right"
            style={{
              position: 'absolute',
              bottom: '15px',
              right: '25px',
              width: '115px',
              height: '115px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              border: '3px solid rgba(255, 255, 255, 0.12)',
              transition: 'transform 0.4s ease'
            }}
          >
            <img
              src="/images/fries.webp"
              alt="Stew"
              onError={(e) => {
                (e.target as any).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Center Content: Headline & Buttons */}
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '640px', margin: '20px 0' }}>
            {/* Top Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(225, 29, 72, 0.15)',
                border: '1px solid rgba(225, 29, 72, 0.35)',
                color: '#FDA4AF',
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}
            >
              <Flame size={14} color="#E11D48" />
              <span>AMERICAN FAST FOOD • ТЕРМЕЗ</span>
            </div>

            {/* Main Headline (Exact phrasing from Reference) */}
            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#FFFFFF',
                marginBottom: '16px',
                letterSpacing: '-0.5px'
              }}
            >
              Experience Taste <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 30%, #FDA4AF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Like Never Before
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(13px, 2vw, 15px)',
                color: '#94A3B8',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '520px',
                margin: '0 auto 28px'
              }}
            >
              Горячие сочные бургеры, хрустящий лаваш, ароматная пицца и фирменные соусы. Быстрая доставка по Термезу от 25 минут!
            </p>

            {/* CTAs (White Pill + Red Pill) */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <a
                href="#menu"
                style={{
                  padding: '12px 28px',
                  borderRadius: '9999px',
                  background: '#FFFFFF',
                  color: '#0E1118',
                  fontSize: '14px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 8px 25px rgba(255, 255, 255, 0.25)',
                  transition: 'transform 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Посмотреть меню</span>
              </a>

              <a
                href="#menu"
                style={{
                  padding: '12px 30px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #E11D48 0%, #FF5500 100%)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 8px 25px rgba(225, 29, 72, 0.45)',
                  transition: 'transform 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Заказать онлайн</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
