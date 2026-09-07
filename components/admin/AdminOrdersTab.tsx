'use client';

import React, { useState } from 'react';
import { Printer, RefreshCw, CheckCircle, Clock, Truck, XCircle, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { apiClient } from '@/lib/api/client';
import { ThermalReceipt } from '@/components/ThermalReceipt';

interface AdminOrdersTabProps {
  orders: Order[];
  onRefresh: () => void;
  cafeSettings: any;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onRefresh,
  cafeSettings
}) => {
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Не удалось обновить статус');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>
            📦 Заказы клиентов (База данных в реальном времени)
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Все заказы приходят напрямую с сайта и мобильных приложений в PostgreSQL
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
            <option value="all">Все статусы ({orders.length})</option>
            <option value="cooking">🔥 Готовятся</option>
            <option value="delivering">🚗 Доставляются</option>
            <option value="completed">✅ Выполнены</option>
            <option value="cancelled">❌ Отменены</option>
          </select>

          <button
            onClick={() => { setLoading(true); onRefresh(); setTimeout(() => setLoading(false), 500); }}
            className="btn-secondary"
            style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Обновить</span>
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '48px 20px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <Clock size={40} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Нет заказов в этой категории</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Новые заказы появятся здесь автоматически</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>
                      Заказ #{order.id}
                    </span>
                    <span
                      style={{
                        background:
                          order.status === 'completed'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : order.status === 'delivering'
                            ? 'rgba(0, 115, 255, 0.2)'
                            : order.status === 'cancelled'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(255, 184, 0, 0.2)',
                        color:
                          order.status === 'completed'
                            ? '#10B981'
                            : order.status === 'delivering'
                            ? '#60A5FA'
                            : order.status === 'cancelled'
                            ? '#EF4444'
                            : '#FFB800',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}
                    >
                      {order.status === 'cooking' ? '🔥 Готовится' : order.status === 'delivering' ? '🚗 Доставляется' : order.status === 'completed' ? '✅ Выполнен' : order.status === 'cancelled' ? '❌ Отменен' : '⏳ Новый'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Клиент: <strong style={{ color: '#fff' }}>{order.customerName}</strong> ({order.phone}) • {order.address}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Оплата: <strong style={{ color: 'var(--secondary)' }}>{order.paymentMethod.toUpperCase()}</strong> ({order.paymentStatus === 'paid' ? 'Оплачен' : 'При получении'})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setReceiptOrder(order)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 700
                    }}
                  >
                    <Printer size={15} />
                    <span>Печать чека</span>
                  </button>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="new">Новый</option>
                    <option value="cooking">Готовится</option>
                    <option value="delivering">Доставляется</option>
                    <option value="completed">Выполнен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: '12px', fontSize: '13px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Состав заказа:</div>
                {order.items.map((i, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
                    <span>{i.quantity}x {i.name}</span>
                    <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>
                      {(i.price * i.quantity).toLocaleString('ru-RU')} сум
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '15px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border)', color: '#fff' }}>
                  <span>Итого к оплате:</span>
                  <span style={{ color: 'var(--secondary)' }}>{order.total.toLocaleString('ru-RU')} сум</span>
                </div>
                {order.comment && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    💬 <em>{order.comment}</em>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {receiptOrder && (
        <ThermalReceipt
          order={receiptOrder}
          cafeSettings={cafeSettings}
          onClose={() => setReceiptOrder(null)}
        />
      )}
    </div>
  );
};
