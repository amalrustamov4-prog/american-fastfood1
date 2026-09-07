'use client';

import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Review } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

interface AdminReviewsTabProps {
  reviews: Review[];
  onRefresh: () => void;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({
  reviews,
  onRefresh
}) => {
  const handleDelete = async (id: string) => {
    if (confirm('Удалить этот отзыв из базы данных?')) {
      try {
        await apiClient.deleteReview(id);
        onRefresh();
      } catch (err) {
        alert('Не удалось удалить отзыв');
      }
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
        ⭐ Отзывы гостей (База данных)
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Модерируйте отзывы, оставленные гостями через сайт и мобильные клиенты
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {reviews.map((rev) => (
          <div
            key={rev.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>{rev.author}</div>
                <div style={{ display: 'flex', color: 'var(--secondary)' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < rev.rating ? 'var(--secondary)' : 'none'}
                      color="var(--secondary)"
                    />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{rev.text}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{rev.date || 'Недавно'}</span>
              <button
                onClick={() => handleDelete(rev.id)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                <Trash2 size={13} />
                <span>Удалить</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
