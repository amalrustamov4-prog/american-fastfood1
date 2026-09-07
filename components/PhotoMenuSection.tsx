'use client';

import React from 'react';
import { Camera, Maximize2, Sparkles } from 'lucide-react';
import { MenuCardPage } from '@/lib/types';

interface PhotoMenuSectionProps {
  menuPages: MenuCardPage[];
  onOpenLightbox: (image: string, title: string) => void;
}

export const PhotoMenuSection: React.FC<PhotoMenuSectionProps> = ({
  menuPages,
  onOpenLightbox
}) => {
  return (
    <section className="section-block" id="photo-menu">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <Camera size={26} color="var(--primary)" />
            <span>📸 Оригинальное Фото-Меню</span>
          </h2>
          <p className="section-subtitle">
            Листайте оригинальные страницы меню заведения и нажимайте на фото для детального просмотра в полном качестве
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          {menuPages.map((page) => (
            <div
              key={page.id}
              onClick={() => onOpenLightbox(page.image, page.title)}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              className="photo-card-hover"
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '320px',
                  background: '#0B0D14',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={page.image}
                  alt={page.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFB800',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    border: '1px solid rgba(255, 184, 0, 0.3)'
                  }}
                >
                  {page.category}
                </span>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Maximize2 size={14} />
                  <span>Увеличить</span>
                </div>
              </div>

              <div style={{ padding: '16px 18px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  {page.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600 }}>
                  🔍 Нажмите для просмотра в высоком разрешении
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
