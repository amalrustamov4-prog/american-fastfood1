'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Sparkles, Maximize2, Flame, Utensils, UtensilsCrossed, Sandwich, Pizza, Cake, Drumstick, Fish, Salad, CupSoda } from 'lucide-react';
import { Category, Product, ProductOption } from '@/lib/types';

interface MenuSectionProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onOpenImageZoom: (image: string, title: string) => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  all: <Flame size={16} />,
  burgers: <Utensils size={16} />,
  lavash: <UtensilsCrossed size={16} />,
  hotdogs: <Sandwich size={16} />,
  pizza: <Pizza size={16} />,
  desserts: <Cake size={16} />,
  chicken: <Drumstick size={16} />,
  sushi: <Fish size={16} />,
  salads: <Salad size={16} />,
  drinks: <CupSoda size={16} />
};

export const MenuSection: React.FC<MenuSectionProps> = ({
  products,
  categories,
  onSelectProduct,
  onQuickAdd,
  onOpenImageZoom
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'name'>('popular');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.inStock) return false;
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // popular
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section className="section-block" id="menu">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">
            <span>🍔 Онлайн Меню Блюд</span>
          </h2>
          <p className="section-subtitle">
            Выберите блюда с точными ценами, добавьте в корзину и оформите быструю доставку
          </p>
        </div>

        {/* Search, Sort & Categories Controls */}
        <div style={{ marginBottom: '30px' }}>
          <div
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '18px'
            }}
          >
            {/* Search Input */}
            <div
              style={{
                flex: 1,
                minWidth: '260px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '16px' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по меню (бургер, лаваш, сан-себастьян, пицца, суши)..."
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  padding: '12px 16px 12px 46px',
                  borderRadius: '9999px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '9999px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="popular">По популярности 🔥</option>
              <option value="price-asc">Сначала недорогие 📈</option>
              <option value="price-desc">Сначала премиум 📉</option>
              <option value="name">По алфавиту (А–Я)</option>
            </select>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'none'
            }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    background: isActive
                      ? 'var(--primary-gradient)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    border: isActive
                      ? '1px solid transparent'
                      : '1px solid var(--border)',
                    boxShadow: isActive ? '0 4px 15px rgba(255, 85, 0, 0.35)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {CATEGORY_ICON_MAP[cat.id] || <Sparkles size={16} />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Ничего не найдено
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Попробуйте изменить поисковый запрос или категорию
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => onSelectProduct(product)}
                style={{ cursor: 'pointer' }}
              >
                {/* Image Wrap */}
                <div className="product-img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    loading="lazy"
                  />
                  {product.oldPrice && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'var(--primary-gradient)',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 900
                      }}
                    >
                      АКЦИЯ
                    </span>
                  )}
                  <button
                    className="product-zoom-hint"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenImageZoom(product.image, product.name);
                    }}
                  >
                    <Maximize2 size={12} />
                    <span>Увеличить</span>
                  </button>
                </div>

                {/* Body */}
                <div className="product-body">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>

                  <div className="product-footer">
                    <div className="product-price-box">
                      <span className="product-price">
                        {product.price.toLocaleString('ru-RU')} сум
                      </span>
                      {product.oldPrice && (
                        <span className="product-old-price">
                          {product.oldPrice.toLocaleString('ru-RU')} сум
                        </span>
                      )}
                    </div>

                    <button
                      className="product-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(product);
                      }}
                      title="Добавить в корзину"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
