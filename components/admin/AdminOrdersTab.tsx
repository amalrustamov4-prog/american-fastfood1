'use client';

import React, { useState } from 'react';
import {
  Printer,
  RefreshCw,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Phone,
  Bike,
  Flame,
  UserCheck,
  Ban,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Order, OrderStatus, Employee } from '@/lib/types';
import { apiClient } from '@/lib/api/client';
import { ThermalReceipt } from '@/components/ThermalReceipt';

interface AdminOrdersTabProps {
  orders: Order[];
  onRefresh: () => void;
  cafeSettings: any;
  couriers?: Employee[];
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onRefresh,
  cafeSettings,
  couriers = []
}) => {
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [assignModalOrder, setAssignModalOrder] = useState<Order | null>(null);
  const [selectedCourierId, setSelectedCourierId] = useState<string>('');

  const activeCouriers = couriers.filter((c) => c.role === 'kuryer' || c.role === 'taksi');

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
    paymentStatus?: string,
    courierInfo?: { courierId?: string; courierName?: string; courierPhone?: string }
  ) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus, paymentStatus, courierInfo);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Не удалось обновить статус');
    }
  };

  const handleTransferToCourier = (order: Order) => {
    setAssignModalOrder(order);
    if (activeCouriers.length > 0) {
      // Pick first free courier by default if available
      const free = activeCouriers.find((c) => c.status === 'free');
      setSelectedCourierId(free ? free.id : activeCouriers[0].id);
    }
  };

  const confirmTransfer = async () => {
    if (!assignModalOrder) return;
    const courier = activeCouriers.find((c) => c.id === selectedCourierId);
    await handleStatusChange(assignModalOrder.id, 'delivering', undefined, {
      courierId: courier?.id,
      courierName: courier ? `${courier.lastName} ${courier.firstName}` : 'Kuryer',
      courierPhone: courier?.phone
    });
    setAssignModalOrder(null);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>
            📦 Заказы клиентов (База данных в реальном времени)
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Прямой контроль заказов, защита от фейков и быстрая передача курьерам
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
            <option value="new">⏳ Новые ({orders.filter((o) => o.status === 'new').length})</option>
            <option value="cooking">🔥 Готовятся ({orders.filter((o) => o.status === 'cooking').length})</option>
            <option value="delivering">🚗 Доставляются ({orders.filter((o) => o.status === 'delivering').length})</option>
            <option value="completed">✅ Выполнены ({orders.filter((o) => o.status === 'completed').length})</option>
            <option value="cancelled">❌ Отменены ({orders.filter((o) => o.status === 'cancelled').length})</option>
          </select>

          <button
            onClick={() => {
              setLoading(true);
              onRefresh();
              setTimeout(() => setLoading(false), 500);
            }}
            className="btn-secondary"
            style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Обновить</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '48px 20px',
            textAlign: 'center',
            border: '1px solid var(--border)'
          }}
        >
          <Clock size={40} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Нет заказов в этой категории</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Новые заказы появятся здесь автоматически
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map((order) => {
            const isNew = order.status === 'new';
            const isCooking = order.status === 'cooking';
            const isDelivering = order.status === 'delivering';
            const isCompleted = order.status === 'completed';
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order.id}
                style={{
                  background: isNew ? 'linear-gradient(180deg, #1C2030 0%, #161824 100%)' : 'var(--bg-card)',
                  border: isNew ? '2px solid #FFCC00' : '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: isNew ? '0 8px 30px rgba(255, 204, 0, 0.15)' : 'none'
                }}
              >
                {/* Top Info Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>
                        Заказ #{order.id}
                      </span>

                      {/* Status Badge */}
                      <span
                        style={{
                          background: isCompleted
                            ? 'rgba(16, 185, 129, 0.2)'
                            : isDelivering
                            ? 'rgba(0, 115, 255, 0.25)'
                            : isCancelled
                            ? 'rgba(239, 68, 68, 0.2)'
                            : isCooking
                            ? 'rgba(255, 85, 0, 0.25)'
                            : 'rgba(255, 204, 0, 0.25)',
                          color: isCompleted
                            ? '#10B981'
                            : isDelivering
                            ? '#60A5FA'
                            : isCancelled
                            ? '#EF4444'
                            : isCooking
                            ? '#FF5500'
                            : '#FFCC00',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          border: isNew ? '1px solid #FFCC00' : 'none'
                        }}
                      >
                        {isNew
                          ? '⏳ Янги буюртма (Ожидает)'
                          : isCooking
                          ? '🔥 Готовится на кухне'
                          : isDelivering
                          ? '🚗 В пути (У курьера)'
                          : isCompleted
                          ? '✅ Выполнен'
                          : '❌ Отменен'}
                      </span>

                      {/* Delivery type */}
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#ddd',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        {order.deliveryType === 'delivery' ? '🚗 Доставка' : '🛍️ Самовывоз'}
                      </span>
                    </div>

                    {/* Prominent Customer Contact Box (Required by User!) */}
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', color: '#bbb' }}>
                          Клиент: <strong style={{ color: '#fff', fontSize: '15px' }}>{order.customerName}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#60A5FA', marginTop: '2px', fontWeight: 600 }}>
                          📍 {order.address}
                        </div>
                      </div>

                      {/* Large One-Tap Call Button */}
                      <a
                        href={`tel:${order.phone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: '#10B981',
                          color: '#fff',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: 900,
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <Phone size={16} />
                        <span>Позвонить: {order.phone}</span>
                      </a>
                    </div>

                    {/* Payment details */}
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>
                      Оплата: <strong style={{ color: 'var(--secondary)' }}>{order.paymentMethod.toUpperCase()}</strong>{' '}
                      ({order.paymentStatus === 'paid' ? 'Оплачен ✅' : 'При получении 💵'})
                      {order.courierName && (
                        <span style={{ marginLeft: '12px', color: '#FFCC00', fontWeight: 700 }}>
                          🚗 Курьер: {order.courierName} ({order.courierPhone})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Print */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Printer size={15} />
                      <span>Чек</span>
                    </button>

                    {/* Status Dropdown */}
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
                      <option value="cancelled">Отменен / Фейк</option>
                    </select>
                  </div>
                </div>

                {/* Items in Order */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Состав заказа:</div>
                  {order.items.map((i, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
                      <span>
                        {i.quantity}x {i.name}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>
                        {(i.price * i.quantity).toLocaleString('ru-RU')} сум
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 900,
                      fontSize: '15px',
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border)',
                      color: '#fff'
                    }}
                  >
                    <span>Итого к оплате:</span>
                    <span style={{ color: 'var(--secondary)' }}>{order.total.toLocaleString('ru-RU')} сум</span>
                  </div>
                  {order.comment && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#FFCC00' }}>
                      💬 Комментарий клиента: <em>{order.comment}</em>
                    </div>
                  )}
                </div>

                {/* QUICK WORKFLOW ACTION BUTTONS (As requested by user!) */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    paddingTop: '6px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Step 1: When order is NEW -> Accept & Cook button */}
                  {isNew && (
                    <>
                      <button
                        onClick={() => handleStatusChange(order.id, 'cooking')}
                        style={{
                          background: 'linear-gradient(135deg, #FF5500 0%, #CC2200 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(255, 85, 0, 0.4)'
                        }}
                      >
                        <Flame size={16} />
                        <span>🔥 Принять заказ (Готовится)</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#EF4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Ban size={15} />
                        <span>Отклонить (Фейк)</span>
                      </button>
                    </>
                  )}

                  {/* Step 2: When COOKING -> Dedicated "Передано курьеру" button! */}
                  {isCooking && (
                    <button
                      onClick={() => handleTransferToCourier(order)}
                      style={{
                        background: '#FFCC00',
                        color: '#000',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(255, 204, 0, 0.4)'
                      }}
                    >
                      <Truck size={17} color="#000" />
                      <span>🚗 ПЕРЕДАНО КУРЬЕРУ (Выдать заказ)</span>
                    </button>
                  )}

                  {/* Step 3: When DELIVERING -> Complete order button */}
                  {isDelivering && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'completed', 'paid')}
                      style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <CheckCircle size={16} />
                      <span>✅ Доставлено клиенту (Завершить)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ASSIGN TO COURIER */}
      {assignModalOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#181C2A',
              border: '2px solid #FFCC00',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Truck size={24} color="#FFCC00" />
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>
                Передать заказ #{assignModalOrder.id} курьеру
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Выберите свободного курьера из автопарка Yandex Fleet / AMERICAN для доставки клиенту:
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '8px', fontWeight: 700 }}>
                Курьер для доставки:
              </label>
              <select
                value={selectedCourierId}
                onChange={(e) => setSelectedCourierId(e.target.value)}
                style={{
                  width: '100%',
                  background: '#222',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  color: '#fff',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none'
                }}
              >
                {activeCouriers.length === 0 ? (
                  <option value="">Нет зарегистрированных курьеров</option>
                ) : (
                  activeCouriers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.status === 'free' ? '🟢' : c.status === 'on_order' ? '🟡' : '🔴'} {c.lastName} {c.firstName}{' '}
                      ({c.courierType === 'avto' ? `🚗 ${c.vehiclePlate || 'Авто'}` : c.courierType === 'moto' ? '🛵 Мото' : '🚶 Пеший'}) — {c.phone}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Destination info */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px' }}>
              <div>Клиент: <strong style={{ color: '#fff' }}>{assignModalOrder.customerName}</strong></div>
              <div style={{ color: '#60A5FA', marginTop: '4px' }}>Адрес: {assignModalOrder.address}</div>
              <div style={{ color: '#10B981', marginTop: '4px' }}>Телефон: {assignModalOrder.phone}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={confirmTransfer}
                style={{
                  flex: 1,
                  background: '#FFCC00',
                  color: '#000',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Подтвердить передачу 🚗
              </button>

              <button
                onClick={() => setAssignModalOrder(null)}
                style={{
                  padding: '14px 20px',
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Receipt Modal */}
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
