'use client';

import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, ShoppingBag, Flame } from 'lucide-react';
import { Logo } from './Logo';

interface WelcomePresentationProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMenu: () => void;
}

const HIGHLIGHTS = [
  {
    title: 'Легендарный San Sebastian',
    subtitle: 'Баскские сожженные чизкейки Lotus, Nutella & Strawberry',
    image: '/images/dish_san_seb_lotus.jpg',
    tag: 'Хит Десертов ⭐',
    price: '65 000 сум',
    desc: 'Нежнейшая сливочная текстура, карамельная паста Lotus Biscoff и свежие бельгийские топпинги.'
  },
  {
    title: 'Сочные Бургеры & Сеты',
    subtitle: 'Двойной Big Chizburger и сеты с картошкой фри',
    image: '/images/dish_big_chizburger.jpg',
    tag: '100% Мясо Гриль 🔥',
    price: '49 000 сум',
    desc: 'Отборная мраморная говядина, расплавленный сыр Чеддер, сочные томаты и фирменный бургер-соус.'
  },
  {
    title: 'Тандыр Лаваши в кунжуте',
    subtitle: 'Запеченный хрустящий лаваш с сыром Моцарелла',
    image: '/images/dish_tandir_sirli.jpg',
    tag: 'Свежая выпечка 🌯',
    price: '48 000 сум',
    desc: 'Ароматный лаваш из тандыра в золотистом кунжуте, много сочного мяса и тягучего сыра.'
  },
  {
    title: 'American Pizza & Пиде',
    subtitle: 'Пицца с деликатесом Казы и турецкие пиде',
    image: '/images/dish_pizza_qazili.jpg',
    tag: 'Премиум рецепт 🍕',
    price: '100 000 сум',
    desc: 'Пышное фирменное тесто, сочный казы, спелые помидоры и двойной слой моцареллы.'
  }
];

export const WelcomePresentation: React.FC<WelcomePresentationProps> = ({
  isOpen,
  onClose,
  onSelectMenu
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const current = HIGHLIGHTS[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HIGHLIGHTS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HIGHLIGHTS.length) % HIGHLIGHTS.length);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '720px',
          background: 'linear-gradient(145deg, #151824 0%, #0E1017 100%)',
          border: '1px solid rgba(255, 85, 0, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 85, 0, 0.25)',
          overflow: 'hidden',
          borderRadius: '24px'
        }}
      >
        {/* Presentation Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/images/logo.png"
              alt="American"
              style={{
                height: '44px',
                width: 'auto',
                maxWidth: '180px',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Presentation Hero Slide */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              width: '100%',
              height: '290px',
              background: '#0B0D14',
              position: 'relative'
            }}
          >
            <img
              src={current.image}
              alt={current.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.9)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(14, 16, 23, 0.95) 100%)'
              }}
            />

            {/* Tag Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'var(--primary-gradient)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(255, 85, 0, 0.4)'
              }}
            >
              <Sparkles size={14} />
              {current.tag}
            </div>

            {/* Price Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(15, 18, 27, 0.85)',
                border: '1px solid rgba(255, 184, 0, 0.4)',
                color: 'var(--secondary)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '13px'
              }}
            >
              {current.price}
            </div>

            {/* Arrows */}
            <button
              onClick={prevSlide}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)'
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)'
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slide Description Body */}
          <div style={{ padding: '24px 28px' }}>
            <h3
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.2,
                marginBottom: '6px'
              }}
            >
              {current.title}
            </h3>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--secondary)',
                marginBottom: '10px'
              }}
            >
              {current.subtitle}
            </p>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginBottom: '20px'
              }}
            >
              {current.desc}
            </p>

            {/* Dots */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '22px'
              }}
            >
              {HIGHLIGHTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: currentSlide === idx ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background:
                      currentSlide === idx
                        ? 'var(--primary)'
                        : 'rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  onClose();
                  onSelectMenu();
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '14px 20px', minWidth: '200px' }}
              >
                <ShoppingBag size={18} />
                <span>Перейти к заказу меню</span>
              </button>
              <button
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '14px 20px' }}
              >
                <span>Смотреть сайт</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
