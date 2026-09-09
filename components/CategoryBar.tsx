'use client';

import React from 'react';
import { Category } from '@/lib/types';

interface CategoryBarProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

// Fallback images for circular categories matching reference
const CATEGORY_IMAGES: Record<string, string> = {
  all: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80',
  burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
  lavash: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80',
  hot: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&q=80',
  starters: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&q=80',
  drinks: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&q=80',
  desserts: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80'
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  return (
    <section style={{ padding: '20px 0 30px' }}>
      <div className="container">
        {/* Title matching reference */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '24px',
            letterSpacing: '-0.3px'
          }}
        >
          Browse Categories
        </h2>

        {/* Circular Category Items Row */}
        <div
          className="category-scroll-container"
          style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            alignItems: 'center',
            overflowX: 'auto',
            paddingBottom: '12px'
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const imgSrc = CATEGORY_IMAGES[cat.id] || CATEGORY_IMAGES.all;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  minWidth: '85px',
                  outline: 'none',
                  transition: 'transform 0.2s ease'
                }}
              >
                {/* Circular image with dark border */}
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: '#151923',
                    border: isActive ? '3px solid #E11D48' : '3px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: isActive ? '0 0 20px rgba(225, 29, 72, 0.45)' : '0 6px 15px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Category label */}
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
