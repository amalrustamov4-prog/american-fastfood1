'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Sparkles, Maximize2 } from 'lucide-react';
import { Product, ProductOption } from '@/lib/types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, options: ProductOption[]) => void;
  onOpenImageZoom: (image: string, title: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenImageZoom
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<ProductOption[]>([]);

  useEffect(() => {
    setQuantity(1);
    setSelectedOptions([]);
  }, [product]);

  if (!product) return null;

  const toggleOption = (opt: ProductOption) => {
    if (selectedOptions.some((o) => o.name === opt.name)) {
      setSelectedOptions(selectedOptions.filter((o) => o.name !== opt.name));
    } else {
      setSelectedOptions([...selectedOptions, opt]);
    }
  };

  const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const finalPricePerUnit = product.price + optionsTotal;
  const totalPrice = finalPricePerUnit * quantity;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '540px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          overflow: 'hidden'
        }}
      >
        {/* Modal Image Header */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '260px',
            background: '#0B0D14'
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)'
            }}
          >
            <X size={18} />
          </button>

          {/* Zoom button */}
          <button
            onClick={() => onOpenImageZoom(product.image, product.name)}
            style={{
              position: 'absolute',
              bottom: '14px',
              right: '14px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Maximize2 size={14} />
            <span>Увеличить фото</span>
          </button>

          {product.oldPrice && (
            <span
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                background: 'var(--primary-gradient)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 900
              }}
            >
              СКИДКА 🔥
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '10px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                {product.name}
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '4px',
                  fontSize: '12px',
                  color: 'var(--text-dim)'
                }}
              >
                {product.weight && <span>⚖️ {product.weight}</span>}
                {product.calories && <span>• ⚡ {product.calories}</span>}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--secondary)' }}>
                {product.price.toLocaleString('ru-RU')} сум
              </div>
              {product.oldPrice && (
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-dim)',
                    textDecoration: 'line-through'
                  }}
                >
                  {product.oldPrice.toLocaleString('ru-RU')} сум
                </div>
              )}
            </div>
          </div>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              marginBottom: '20px'
            }}
          >
            {product.description}
          </p>

          {/* Options / Add-ons if available */}
          {product.options && product.options.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '10px'
                }}
              >
                Дополнительные ингредиенты / опции:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.options.map((opt, idx) => {
                  const isSelected = selectedOptions.some((o) => o.name === opt.name);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleOption(opt)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: isSelected
                          ? 'rgba(255, 85, 0, 0.15)'
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected
                          ? '1px solid rgba(255, 85, 0, 0.5)'
                          : '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                          }}
                        >
                          {isSelected && <Check size={14} />}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                          {opt.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--secondary)'
                        }}
                      >
                        +{opt.price.toLocaleString('ru-RU')} сум
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer with Quantity & Add to Cart */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)'
            }}
          >
            {/* Quantity Stepper */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '9999px',
                padding: '6px 12px'
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  background: 'none',
                  color: '#fff',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                }}
              >
                <Minus size={16} />
              </button>
              <span style={{ fontWeight: 800, fontSize: '16px', minWidth: '20px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  background: 'none',
                  color: '#fff',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                onAddToCart(product, quantity, selectedOptions);
                onClose();
              }}
              className="btn-primary"
              style={{ flex: 1, padding: '14px 20px' }}
            >
              <span>В корзину • {totalPrice.toLocaleString('ru-RU')} сум</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
