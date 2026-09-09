'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, X, Save, Image as ImageIcon } from 'lucide-react';
import { Category, Product } from '@/lib/types';
import { apiClient } from '@/lib/api/client';
import { matchProductSearch } from '@/lib/searchUtils';

interface AdminMenuTabProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
}

export const AdminMenuTab: React.FC<AdminMenuTabProps> = ({
  products,
  categories,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    category: 'burgers',
    price: 35000,
    oldPrice: null,
    weight: '300 г',
    calories: '500 ккал',
    image: '/images/photo_2026-08-28_17-22-56.jpg',
    description: '',
    inStock: true,
    options: []
  });

  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setEditingProduct(null);
    setForm({
      id: `prod-custom-${Date.now()}`,
      name: '',
      category: 'burgers',
      price: 35000,
      oldPrice: null,
      weight: '300 г',
      calories: '500 ккал',
      image: '/images/photo_2026-08-28_17-22-56.jpg',
      description: '',
      inStock: true,
      options: []
    });
  };

  const handleOpenEdit = (prod: Product) => {
    setIsAddingNew(false);
    setEditingProduct(prod);
    setForm({ ...prod });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setLoading(true);

    try {
      if (isAddingNew) {
        await apiClient.createProduct(form);
      } else if (editingProduct) {
        await apiClient.updateProduct(editingProduct.id, form);
      }
      setIsAddingNew(false);
      setEditingProduct(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Ошибка сохранения товара');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.toggleProductStock(id, !currentStatus);
      onRefresh();
    } catch (err: any) {
      alert('Не удалось переключить статус наличия');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это блюдо из базы данных?')) {
      try {
        await apiClient.deleteProduct(id);
        onRefresh();
      } catch (err: any) {
        alert('Не удалось удалить товар');
      }
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat = search.trim() ? true : (selectedCategory === 'all' || p.category === selectedCategory);
    const matchesSearch = !search.trim() || matchProductSearch(p, search);
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>
            🍔 Управление Меню (База PostgreSQL)
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Все изменения мгновенно синхронизируются на сервере и в мобильных приложениях
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus size={18} />
          <span>Добавить блюдо</span>
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск блюда..."
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: '#fff',
              padding: '10px 14px 10px 42px',
              borderRadius: '12px',
              fontSize: '14px'
            }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">Все категории ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          overflowX: 'auto'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 18px' }}>Фото / Блюдо</th>
              <th style={{ padding: '14px 18px' }}>Категория</th>
              <th style={{ padding: '14px 18px' }}>Цена</th>
              <th style={{ padding: '14px 18px' }}>Наличие</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod) => (
              <tr key={prod.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>{prod.name}</div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>{prod.weight || 'Стандарт'}</div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '14px 18px' }}>
                  <span style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600, color: '#fff' }}>
                    {categories.find((c) => c.id === prod.category)?.name || prod.category}
                  </span>
                </td>

                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '14px' }}>
                    {prod.price.toLocaleString('ru-RU')} сум
                  </div>
                  {prod.oldPrice && (
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                      {prod.oldPrice.toLocaleString('ru-RU')} сум
                    </div>
                  )}
                </td>

                <td style={{ padding: '14px 18px' }}>
                  <button
                    onClick={() => handleToggleStock(prod.id, prod.inStock)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: prod.inStock ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: prod.inStock ? '#10B981' : '#EF4444',
                      border: prod.inStock ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    {prod.inStock ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{prod.inStock ? 'В наличии' : 'Стоп-лист'}</span>
                  </button>
                </td>

                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      <Edit size={14} />
                      <span>Изменить</span>
                    </button>

                    <button
                      onClick={() => handleDelete(prod.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#EF4444',
                        padding: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit */}
      {(isAddingNew || editingProduct) && (
        <div className="modal-overlay" onClick={() => { setIsAddingNew(false); setEditingProduct(null); }} style={{ zIndex: 1200 }}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', background: 'var(--bg-card)', borderRadius: '24px', padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                {isAddingNew ? 'Новое блюдо' : `Редактирование: ${editingProduct?.name}`}
              </h3>
              <button
                onClick={() => { setIsAddingNew(false); setEditingProduct(null); }}
                style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Название блюда *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Категория *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Цена (сум) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    required
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Ссылка на фото блюда
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/images/photo_..."
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Описание состава
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingProduct(null); }}
                  className="btn-secondary"
                  style={{ padding: '12px 20px' }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  <Save size={16} />
                  <span>{loading ? 'Сохранение...' : 'Сохранить в БД'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
