'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Review } from '@/lib/types';

interface ReviewsSectionProps {
  reviews: Review[];
  onSubmitReview: (review: { author: string; rating: number; text: string }) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onSubmitReview
}) => {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const avgRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : '5.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    onSubmitReview({
      author: author.trim(),
      rating,
      text: text.trim()
    });

    setAuthor('');
    setText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="section-block" id="reviews">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <Star size={26} color="#FFB800" fill="#FFB800" />
            <span>⭐ Отзывы наших Гостей</span>
          </h2>
          <p className="section-subtitle">
            Нам доверяют тысячи любителей сочных бургеров и нежного чизкейка Сан-Себастьян
          </p>
        </div>

        {/* Rating Score Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.1) 0%, rgba(21, 24, 36, 0.8) 100%)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '30px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '44px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
              {avgRating}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} color="#FFB800" fill="#FFB800" />
                ))}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                На основе {approvedReviews.length} отзывов гостей
              </div>
            </div>
          </div>

          <a
            href="#review-form"
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '13px' }}
          >
            <MessageSquare size={16} />
            <span>Оставить отзыв</span>
          </a>
        </div>

        {/* Reviews Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '40px'
          }}
        >
          {approvedReviews.map((r) => (
            <div
              key={r.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img
                  src={r.avatar}
                  alt={r.author}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>{r.author}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{r.date}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={14} color="#FFB800" fill="#FFB800" />
                ))}
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {r.text}
              </p>
            </div>
          ))}
        </div>

        {/* Review Form */}
        <div
          id="review-form"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '680px',
            margin: '0 auto'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
            Поделитесь вашим впечатлением
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Ваш отзыв помогает нам становиться лучше с каждым днем
          </p>

          {submitted && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34D399',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <CheckCircle2 size={18} />
              <span>Спасибо за отзыв! Он появится на сайте после быстрой проверки.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Ваше имя *
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Сардор"
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Оценка (звезды)
                </label>
                <div style={{ display: 'flex', gap: '6px', paddingTop: '6px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      style={{
                        background: 'none',
                        color: s <= rating ? '#FFB800' : 'var(--text-dim)',
                        padding: '2px'
                      }}
                    >
                      <Star size={24} fill={s <= rating ? '#FFB800' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Текст отзыва *
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Что вам больше всего понравилось (вкус бургера, чизкейк, скорость доставки)..."
                required
                rows={3}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
              <Send size={16} />
              <span>Отправить отзыв</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
