'use client';

import React, { useState } from 'react';
import {
  Printer,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Flame,
  Search,
  Check,
  AlertCircle,
  TrendingUp,
  DollarSign,
  PackageCheck,
  AlertTriangle
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  // Rejection modal
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
    paymentStatus?: string,
    reason?: string
  ) => {
    setLoadingOrderId(orderId);
    try {
      await apiClient.updateOrderStatus(orderId, newStatus, paymentStatus, reason);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Не удалось обновить статус');
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalOrder) return;
    await handleStatusChange(
      rejectModalOrder.id,
      'rejected',
      undefined,
      rejectionReason || 'Отклонено администратором'
    );
    setRejectModalOrder(null);
    setRejectionReason('');
  };

  // Filter and search
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? ['new', 'accepted', 'cooking', 'ready'].includes(o.status)
        : o.status === filterStatus;

    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q)
    );
  });

  // Calculate KPIs
  const totalRevenue = orders
    .filter((o) => o.status === 'completed' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter((o) =>
    ['new', 'accepted', 'cooking', 'ready'].includes(o.status)
  ).length;

  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
  const avgCheck = completedOrdersCount > 0 ? Math.round(totalRevenue / completedOrdersCount) : 0;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return { label: 'НОВЫЙ ЗАКАЗ', bg: '#EF4444', color: '#FFF' };
      case 'accepted':
        return { label: 'ПРИНЯТ', bg: '#3B82F6', color: '#FFF' };
      case 'cooking':
        return { label: 'ГОТОВИТСЯ', bg: '#F59E0B', color: '#000' };
      case 'ready':
        return { label: 'ГОТОВ К ВЫДАЧЕ', bg: '#10B981', color: '#FFF' };
      case 'completed':
        return { label: 'ЗАВЕРШЁН', bg: '#6B7280', color: '#FFF' };
      case 'rejected':
        return { label: 'ОТКЛОНЁН', bg: '#991B1B', color: '#FFF' };
      case 'cancelled':
        return { label: 'ОТМЕНЁН', bg: '#4B5563', color: '#FFF' };
      default:
        return { label: status, bg: '#374151', color: '#FFF' };
    }
  };

  return (
    <div>
      {/* Top Header */}
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
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: 0 }}>
            Управление заказами
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: '4px 0 0 0' }}>
            Централизованная система приёма заказов без курьеров
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              color: '#FFF',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} />
            <span>Обновить</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.15) 0%, rgba(255, 85, 0, 0.05) 100%)',
            border: '1px solid rgba(225, 29, 72, 0.3)',
            borderRadius: '16px',
            padding: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#E11D48', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>В работе (Активные)</span>
            <Flame size={20} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFF' }}>{activeOrdersCount}</div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10B981', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Выручка (Оплачено)</span>
            <DollarSign size={20} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>
            {totalRevenue.toLocaleString('ru-RU')} <span style={{ fontSize: '14px', color: '#94A3B8' }}>сум</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#3B82F6', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Завершено заказов</span>
            <PackageCheck size={20} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFF' }}>{completedOrdersCount}</div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#F59E0B', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Средний чек</span>
            <TrendingUp size={20} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>
            {avgCheck.toLocaleString('ru-RU')} <span style={{ fontSize: '14px', color: '#94A3B8' }}>сум</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `Все (${orders.length})` },
            { id: 'active', label: `В работе (${activeOrdersCount})` },
            { id: 'new', label: `Новые (${orders.filter((o) => o.status === 'new').length})` },
            { id: 'accepted', label: 'Приняты' },
            { id: 'cooking', label: 'Готовятся' },
            { id: 'ready', label: 'Готовы' },
            { id: 'completed', label: 'Завершены' },
            { id: 'rejected', label: 'Отклонены' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                background: filterStatus === tab.id ? '#E11D48' : 'rgba(255, 255, 255, 0.05)',
                color: filterStatus === tab.id ? '#FFF' : '#94A3B8',
                border: '1px solid',
                borderColor: filterStatus === tab.id ? '#E11D48' : 'rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div
          style={{
            position: 'relative',
            minWidth: '280px',
            flex: '1',
            maxWidth: '360px'
          }}
        >
          <Search
            size={16}
            color="#94A3B8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по #AM-1042, имени, телефону..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFF',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            color: '#94A3B8'
          }}
        >
          <AlertCircle size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ fontSize: '15px', fontWeight: 600 }}>Заказы по заданным критериям не найдены</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const isProcessing = loadingOrderId === order.id;

            return (
              <div
                key={order.id}
                style={{
                  background: order.status === 'new' ? 'rgba(239, 68, 68, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                  border: order.status === 'new' ? '2px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: order.status === 'new' ? '0 8px 30px rgba(239, 68, 68, 0.15)' : 'none'
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    paddingBottom: '14px',
                    marginBottom: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: 900,
                        color: '#FFF',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {order.orderNumber || order.id}
                    </span>

                    <span
                      style={{
                        background: badge.bg,
                        color: badge.color,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 900,
                        letterSpacing: '0.5px'
                      }}
                    >
                      {badge.label}
                    </span>

                    <span
                      style={{
                        background: order.paymentStatus === 'paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: order.paymentStatus === 'paid' ? '#10B981' : '#F59E0B',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      {order.paymentMethod.toUpperCase()} • {order.paymentStatus === 'paid' ? 'Оплачен' : 'Ожидает оплаты'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '12px' }}>
                    <Clock size={14} />
                    <span>
                      {new Date(order.createdAt).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {' • '}
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                {/* Customer & delivery info */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '12px 16px',
                    borderRadius: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Клиент
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
                      {order.customerName}
                    </div>
                    <a
                      href={`tel:${order.phone}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#3B82F6',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        marginTop: '2px'
                      }}
                    >
                      <Phone size={12} />
                      <span>{order.phone}</span>
                    </a>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Способ получения & Адрес
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF', marginTop: '2px' }}>
                      {order.deliveryType === 'delivery' ? '🏠 Доставка на дом' : '🏬 Самовывоз из ресторана'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '2px' }}>
                      {order.address}
                    </div>
                  </div>

                  {order.comment && (
                    <div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Комментарий клиента
                      </div>
                      <div style={{ fontSize: '13px', color: '#FCD34D', fontStyle: 'italic', marginTop: '2px' }}>
                        «{order.comment}»
                      </div>
                    </div>
                  )}

                  {order.rejectionReason && (
                    <div>
                      <div style={{ fontSize: '11px', color: '#EF4444', textTransform: 'uppercase', fontWeight: 700 }}>
                        Причина отклонения
                      </div>
                      <div style={{ fontSize: '13px', color: '#FCA5A5', marginTop: '2px' }}>
                        {order.rejectionReason}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status History Timeline */}
                {order.statusHistory && order.statusHistory.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Хронология статусов
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                      {order.statusHistory.map((h: any, idx: number) => {
                        const badge = getStatusBadge(h.status);
                        return (
                          <div key={h.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              background: 'rgba(255,255,255,0.04)',
                              border: `1px solid ${badge.bg}44`,
                              borderRadius: '8px',
                              padding: '4px 8px',
                              minWidth: '90px'
                            }}>
                              <span style={{ fontSize: '10px', fontWeight: 800, color: badge.bg }}>{badge.label}</span>
                              <span style={{ fontSize: '9px', color: '#64748B', marginTop: '1px' }}>
                                {new Date(h.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {idx < order.statusHistory.length - 1 && (
                              <span style={{ color: '#4B5563', fontSize: '14px' }}>→</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items table */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>
                    Состав заказа ({order.items.reduce((s, i) => s + i.quantity, 0)} шт.):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '6px 12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '8px',
                          fontSize: '13px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, color: '#E11D48' }}>{item.quantity}x</span>
                          <span style={{ color: '#FFF', fontWeight: 600 }}>{item.name}</span>
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <span style={{ color: '#94A3B8', fontSize: '11px' }}>
                              (+{item.selectedOptions.map((o: any) => o.name).join(', ')})
                            </span>
                          )}
                        </div>
                        <span style={{ color: '#FFF', fontWeight: 700 }}>
                          {(item.price * item.quantity).toLocaleString('ru-RU')} сум
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom row: Total & Admin Actions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#94A3B8' }}>Итого к оплате:</span>
                    <span style={{ fontSize: '20px', fontWeight: 900, color: '#FFF' }}>
                      {order.total.toLocaleString('ru-RU')} сум
                    </span>
                    {order.discountAmount > 0 && (
                      <span style={{ fontSize: '12px', color: '#10B981' }}>
                        (Скидка: {order.discountAmount.toLocaleString('ru-RU')} сум)
                      </span>
                    )}
                  </div>

                  {/* Action buttons based on status */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Thermal Receipt Button */}
                    <button
                      onClick={() => setReceiptOrder(order)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        color: '#CBD5E1',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Printer size={14} />
                      <span>Чек</span>
                    </button>

                    {/* Step 1: NEW -> ACCEPT or REJECT */}
                    {order.status === 'new' && (
                      <>
                        <button
                          disabled={isProcessing}
                          onClick={() => handleStatusChange(order.id, 'accepted')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 18px',
                            background: '#10B981',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '13px',
                            cursor: isProcessing ? 'wait' : 'pointer',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
                          }}
                        >
                          <Check size={16} />
                          <span>Принять заказ</span>
                        </button>

                        <button
                          disabled={isProcessing}
                          onClick={() => setRejectModalOrder(order)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#EF4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: isProcessing ? 'wait' : 'pointer'
                          }}
                        >
                          <XCircle size={15} />
                          <span>Отклонить</span>
                        </button>
                      </>
                    )}

                    {/* Step 2: ACCEPTED -> START COOKING */}
                    {order.status === 'accepted' && (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleStatusChange(order.id, 'cooking')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 18px',
                          background: '#F59E0B',
                          color: '#000',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: isProcessing ? 'wait' : 'pointer',
                          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                        }}
                      >
                        <Flame size={16} />
                        <span>Начать готовку</span>
                      </button>
                    )}

                    {/* Step 3: COOKING -> MARK READY */}
                    {order.status === 'cooking' && (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleStatusChange(order.id, 'ready')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 18px',
                          background: '#3B82F6',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: isProcessing ? 'wait' : 'pointer',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <CheckCircle size={16} />
                        <span>Готов к выдаче</span>
                      </button>
                    )}

                    {/* Step 4: READY -> COMPLETE */}
                    {order.status === 'ready' && (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleStatusChange(order.id, 'completed', 'paid')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 18px',
                          background: '#10B981',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '13px',
                          cursor: isProcessing ? 'wait' : 'pointer',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
                        }}
                      >
                        <PackageCheck size={16} />
                        <span>Завершить заказ</span>
                      </button>
                    )}

                    {/* Quick status reset / manual switch if needed */}
                    {['accepted', 'cooking', 'ready'].includes(order.status) && (
                      <button
                        disabled={isProcessing}
                        onClick={() => setRejectModalOrder(order)}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: isProcessing ? 'wait' : 'pointer'
                        }}
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#1A1D26',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '440px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', marginBottom: '12px' }}>
              <AlertTriangle size={20} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                Отклонить заказ {rejectModalOrder.orderNumber || rejectModalOrder.id}
              </h3>
            </div>

            <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '16px' }}>
              Укажите причину для клиента (например: «закончились ингредиенты» или «вне зоны доставки»):
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Причина отклонения..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFF',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '20px'
              }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setRejectModalOrder(null)}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFF',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmReject}
                style={{
                  padding: '10px 18px',
                  background: '#EF4444',
                  color: '#FFF',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Подтвердить отклонение
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
