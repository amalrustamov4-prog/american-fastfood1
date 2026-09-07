'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, Store, Phone, MapPin, DollarSign, Clock } from 'lucide-react';
import { CafeSettings } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

interface AdminSettingsTabProps {
  cafeSettings: CafeSettings;
  onRefresh: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  cafeSettings,
  onRefresh
}) => {
  const [form, setForm] = useState<CafeSettings>(cafeSettings);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.saveSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Ошибка сохранения настроек');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
        ⚙️ Настройки заведения (PostgreSQL)
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Управляйте тарифами доставки, порогами бесплатной доставки и контактами кафе
      </p>

      {saved && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10B981',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>Настройки успешно сохранены в базе данных!</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Название бренда / заведения
          </label>
          <input
            type="text"
            value={form.name || form.brand || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value, brand: e.target.value })}
            required
            style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Контактный телефон
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              График работы
            </label>
            <input
              type="text"
              value={form.workHours}
              onChange={(e) => setForm({ ...form, workHours: e.target.value })}
              required
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Адрес заведения
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
            style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Стоимость доставки (сум)
            </label>
            <input
              type="number"
              value={form.deliveryFee}
              onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })}
              required
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Порог бесплатной доставки (сум)
            </label>
            <input
              type="number"
              value={form.freeDeliveryThreshold}
              onChange={(e) => setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })}
              required
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Текст верхнего рекламного баннера
          </label>
          <input
            type="text"
            value={form.bannerText || ''}
            onChange={(e) => setForm({ ...form, bannerText: e.target.value })}
            placeholder="Бесплатная доставка от 150 000 сум! 🔥"
            style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
          />
        </div>

        <div style={{ paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: '15px' }}
          >
            <Save size={16} />
            <span>{loading ? 'Сохранение в БД...' : 'Сохранить настройки'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
