'use client';

import React from 'react';
import { ChefHat, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';

interface ChefSpecialProps {
  product?: Product;
  onOrderNow: (product: Product) => void;
}

export const ChefSpecial: React.FC<ChefSpecialProps> = ({
  product,
  onOrderNow
}) => {
  // Fallback chef product if none passed
  const chefDish: Product = product || {
    id: 'chef_special_paella',
    name: 'Seafood & Royal Paella (Фирменное блюдо шефа)',
    category: 'hot',
    price: 65000,
    oldPrice: 80000,
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&q=80',
    description: 'Изысканное фирменное блюдо от шеф-повара: отборные морепродукты, ароматный шафранный рис, спелые томаты и авторский пряный соус.',
    inStock: true
  };

  return (
    <section id="chef" style={{ padding: '20px 0 45px' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '9999px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#F59E0B',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}
          >
            <ChefHat size={14} />
            <span>CHEF&apos;S SPECIAL</span>
          </div>

          <h2
            style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.3px',
              margin: 0
            }}
          >
            Блюдо от шеф-повара
          </h2>
        </div>

        {/* Wide Card Matching Bottom of Reference Image */}
        <div
          style={{
            background: '#141822',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Big Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#0B0D14'
            }}
          >
            <img
              src={chefDish.image}
              alt={chefDish.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '9999px',
                color: '#F59E0B',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={12} />
              <span>Шеф Рекомендует</span>
            </div>
          </div>

          {/* Details & Action */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} color="#F59E0B" fill="#F59E0B" />
              ))}
              <span style={{ fontSize: '12px', color: '#94A3B8', marginLeft: '6px', fontWeight: 700 }}>
                5.0 (Высшая оценка гостей)
              </span>
            </div>

            <h3
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: '0 0 10px 0',
                lineHeight: 1.25
              }}
            >
              {chefDish.name}
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: '#94A3B8',
                lineHeight: 1.6,
                margin: '0 0 18px 0'
              }}
            >
              {chefDish.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Цена порции:</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#E11D48' }}>
                  {chefDish.price.toLocaleString('ru-RU')} сум
                </div>
              </div>

              <button
                onClick={() => onOrderNow(chefDish)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #E11D48 0%, #FF5500 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(225, 29, 72, 0.45)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <ShoppingBag size={17} />
                <span>Заказать сейчас</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
