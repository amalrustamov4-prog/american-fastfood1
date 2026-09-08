'use client';

import React, { useState } from 'react';
import { Star, Trash2, CheckCircle, Clock } from 'lucide-react';
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
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const handleApprove = async (id: string) => {
    try {
      await apiClient.updateReviewStatus(id, 'approved');
      onRefresh();
    } catch (err) {
      alert('Не удалось одобрить отзыв');
    }
  };

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

  const filtered = reviews.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>
            ⭐ Модерация отзывов гостей
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Защита от фейковых отзывов: одобряйте только реальные отзывы гостей
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              background: filter === 'all' ? 'var(--primary-gradient)' : 'var(--bg-card)',
              color: filter === 'all' ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Все ({reviews.length})
          </button>

          <button
            onClick={() => setFilter('pending')}
            style={{
              background: filter === 'pending' ? '#FFB800' : 'var(--bg-card)',
              color: filter === 'pending' ? '#000' : '#FFB800',
              border: '1px solid var(--border)',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={14} />
            <span>На модерации ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilter('approved')}
            style={{
              background: filter === 'approved' ? '#10B981' : 'var(--bg-card)',
              color: filter === 'approved' ? '#fff' : '#10B981',
              border: '1px solid var(--border)',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Одобренные ({reviews.filter((r) => r.status === 'approved').length})
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', background: 'var(--bg-card)', padding: '40px', borderRadius: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Отзывов в этой категории нет
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
              style={{
                background: rev.status === 'pending' ? 'rgba(255, 184, 0, 0.05)' : 'var(--bg-card)',
                border: rev.status === 'pending' ? '1.5px solid rgba(255, 184, 0, 0.4)' : '1px solid var(--border)',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>{rev.author}</div>
                    <span
                      style={{
                        background: rev.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 184, 0, 0.2)',
                        color: rev.status === 'approved' ? '#10B981' : '#FFB800',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {rev.status === 'approved' ? 'ОДОБРЕН' : 'МОДЕРАЦИЯ'}
                    </span>
                  </div>

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

                <div style={{ display: 'flex', gap: '8px' }}>
                  {rev.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(rev.id)}
                      style={{
                        background: '#10B981',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <CheckCircle size={13} />
                      <span>Одобрить</span>
                    </button>
                  )}

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
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Удалить</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
