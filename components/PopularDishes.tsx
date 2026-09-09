'use client';

import React, { useState } from 'react';
import { ShoppingBag, Heart, Flame, Star, Plus } from 'lucide-react';
import { Product } from '@/lib/types';

interface PopularDishesProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const PopularDishes: React.FC<PopularDishesProps> = ({
  products,
  onSelectProduct,
  onQuickAdd
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Pick top 8 popular dishes (or first 8)
  const popularList = products.slice(0, 8);

  return (
    <section style={{ padding: '20px 0 40px' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.3px',
                margin: 0
              }}
            >
              Popular Dishes
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '13px', margin: '4px 0 0 0' }}>
              Самые заказываемые хиты нашего меню
            </p>
          </div>

          <a
            href="#menu"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#E11D48',
              textDecoration: 'none'
            }}
          >
            Все блюда →
          </a>
        </div>

        {/* Grid of Dishes Matching Reference */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px'
          }}
        >
          {popularList.map((product) => {
            const isFav = favorites.has(product.id);

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="dish-card"
                style={{
                  background: '#141822',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
              >
                {/* Image Container with Top-Right Heart Icon */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '12px',
                    background: '#0B0D14'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as any).src =
                        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, product.id)}
                    aria-label="В избранное"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isFav ? '#E11D48' : 'rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(6px)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Heart size={15} color={isFav ? '#FFF' : '#FFF'} fill={isFav ? '#FFF' : 'none'} />
                  </button>
                </div>

                {/* Dish Name */}
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '0 0 6px 0',
                    lineHeight: 1.3
                  }}
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#E11D48',
                    marginBottom: '8px'
                  }}
                >
                  {product.price.toLocaleString('ru-RU')} сум
                </div>

                {/* Golden Stars Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '14px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} color="#F59E0B" fill="#F59E0B" />
                  ))}
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '4px', fontWeight: 700 }}>
                    5.0
                  </span>
                </div>

                {/* Bottom Row: Heat Badge, Fav, and Red Round Cart Button */}
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Heat Badge */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#F97316',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      <Flame size={14} color="#F97316" />
                      <span>Хит</span>
                    </div>

                    {/* Fav Text */}
                    <button
                      onClick={(e) => toggleFavorite(e, product.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: isFav ? '#E11D48' : '#94A3B8',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Heart size={13} fill={isFav ? '#E11D48' : 'none'} />
                      <span>Любимое</span>
                    </button>
                  </div>

                  {/* Red Circle Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(product);
                    }}
                    aria-label={`Добавить ${product.name} в корзину`}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E11D48 0%, #FF5500 100%)',
                      border: 'none',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
