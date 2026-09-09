'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShoppingBag,
  Clock,
  Phone,
  Calendar,
  LogOut,
  Printer,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Flame,
  Check
} from 'lucide-react';
import { Order, OrderStatus, UserProfile } from '@/lib/types';
import { apiClient } from '@/lib/api/client';
import { ThermalReceipt } from './ThermalReceipt';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLogout: () => void;
  onProfileUpdated: (user: UserProfile) => void;
  cafeSettings: any;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onProfileUpdated,
  cafeSettings
}) => {
  const [tab, setTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Edit profile state
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [lastName, setLastName] = useState(currentUser.lastName || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [birthDate, setBirthDate] = useState(currentUser.birthDate || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadMyOrders();
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setPhone(currentUser.phone || '');
      setBirthDate(currentUser.birthDate || '');
      setAddress(currentUser.address || '');
    }
  }, [isOpen, currentUser]);

  const loadMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const myOrds = await apiClient.getMyOrders();
      setOrders(myOrds);
    } catch (e) {
      // ignore
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Вы уверены, что хотите отменить этот заказ?')) return;
    try {
      await apiClient.cancelOrder(orderId);
      loadMyOrders();
    } catch (e: any) {
      alert(e.message || 'Не удалось отменить заказ');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    try {
      const updated = await apiClient.updateProfile({
        firstName,
        lastName,
        phone,
        birthDate,
        address
      });
      onProfileUpdated(updated);
      setSaveMessage('Данные успешно сохранены!');
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (e: any) {
      alert(e.message || 'Ошибка обновления данных');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return { label: 'НОВЫЙ ЗАКАЗ', desc: 'Передан администратору ресторана', color: '#EF4444', step: 1 };
      case 'accepted':
        return { label: 'ПРИНЯТ', desc: 'Ресторан подтвердил ваш заказ', color: '#3B82F6', step: 2 };
      case 'cooking':
        return { label: 'ГОТОВИТСЯ', desc: 'Блюда готовятся на кухне', color: '#F59E0B', step: 3 };
      case 'ready':
        return { label: 'ГОТОВ', desc: 'Заказ готов к выдаче в ресторане / упакован', color: '#10B981', step: 4 };
      case 'completed':
        return { label: 'ЗАВЕРШЁН', desc: 'Заказ выдан / доставлен. Приятного аппетита!', color: '#6B7280', step: 5 };
      case 'rejected':
        return { label: 'ОТКЛОНЁН', desc: 'Заказ был отклонен рестораном', color: '#991B1B', step: 0 };
      case 'cancelled':
        return { label: 'ОТМЕНЁН', desc: 'Заказ был отменен', color: '#4B5563', step: 0 };
      default:
        return { label: status, desc: '', color: '#94A3B8', step: 1 };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '620px',
          background: '#121622',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E11D48, #FF5500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontSize: '18px',
                fontWeight: 900
              }}
            >
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#FFF', fontSize: '18px', fontWeight: 800 }}>
                {currentUser.name}
              </h3>
              <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '2px' }}>
                {currentUser.email || currentUser.phone}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '9999px',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={14} />
              <span>Выйти</span>
            </button>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px'
          }}
        >
          <button
            onClick={() => setTab('orders')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'orders' ? '#E11D48' : 'transparent',
              color: tab === 'orders' ? '#FFF' : '#94A3B8',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Clock size={15} />
            <span>Мои заказы ({orders.length})</span>
          </button>

          <button
            onClick={() => setTab('profile')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'profile' ? '#E11D48' : 'transparent',
              color: tab === 'profile' ? '#FFF' : '#94A3B8',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <User size={15} />
            <span>Данные профиля</span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {tab === 'orders' ? (
            <div>
              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                  Загрузка ваших заказов...
                </div>
              ) : orders.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '50px 20px',
                    color: '#94A3B8',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px'
                  }}
                >
                  <ShoppingBag size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>У вас пока нет заказов</p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                    Выберите любимые блюда в меню и оформите первый заказ!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const isActive = ['new', 'accepted', 'cooking', 'ready'].includes(order.status);

                    return (
                      <div
                        key={order.id}
                        style={{
                          background: isActive ? 'rgba(225, 29, 72, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                          border: isActive ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          padding: '18px'
                        }}
                      >
                        {/* Order Header */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '12px'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '16px', fontWeight: 900, color: '#FFF' }}>
                                {order.orderNumber || order.id}
                              </span>
                              <span
                                style={{
                                  background: statusInfo.color,
                                  color: '#FFF',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  padding: '3px 8px',
                                  borderRadius: '9999px'
                                }}
                              >
                                {statusInfo.label}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                              {new Date(order.createdAt).toLocaleString('ru-RU')}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '16px', fontWeight: 900, color: '#E11D48' }}>
                              {order.total.toLocaleString('ru-RU')} сум
                            </div>
                            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                              {order.paymentMethod.toUpperCase()} • {order.paymentStatus === 'paid' ? 'Оплачено' : 'При получении'}
                            </div>
                          </div>
                        </div>

                        {/* Visual Progress Steps for Active Orders */}
                        {isActive && (
                          <div style={{ margin: '14px 0', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', fontWeight: 700 }}>
                              <span style={{ color: statusInfo.step >= 1 ? '#E11D48' : '#64748B' }}>1. Новый</span>
                              <span style={{ color: statusInfo.step >= 2 ? '#3B82F6' : '#64748B' }}>2. Принят</span>
                              <span style={{ color: statusInfo.step >= 3 ? '#F59E0B' : '#64748B' }}>3. Готовится</span>
                              <span style={{ color: statusInfo.step >= 4 ? '#10B981' : '#64748B' }}>4. Готов</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${(statusInfo.step / 4) * 100}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #E11D48, #10B981)',
                                  borderRadius: '9999px',
                                  transition: 'width 0.4s ease'
                                }}
                              />
                            </div>
                            <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '8px', textAlign: 'center', fontWeight: 600 }}>
                              {statusInfo.desc}
                            </div>
                          </div>
                        )}

                        {/* Status History Timeline */}
                        {order.statusHistory && order.statusHistory.length > 0 && (
                          <div style={{ margin: '10px 0', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '10px' }}>
                            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
                              История статусов
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                              {order.statusHistory.map((h: any, idx: number) => {
                                const si = getStatusInfo(h.status);
                                return (
                                  <div key={h.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <div style={{
                                      fontSize: '9px',
                                      fontWeight: 700,
                                      color: si.color,
                                      background: `${si.color}18`,
                                      border: `1px solid ${si.color}44`,
                                      borderRadius: '6px',
                                      padding: '2px 6px',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {si.label} • {new Date(h.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    {idx < order.statusHistory.length - 1 && (
                                      <span style={{ color: '#4B5563', fontSize: '10px' }}>→</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Rejection / cancellation info */}
                        {order.status === 'rejected' && order.rejectionReason && (
                          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', color: '#FCA5A5', fontSize: '12px', marginBottom: '10px' }}>
                            Причина отклонения: {order.rejectionReason}
                          </div>
                        )}

                        {/* Items list */}
                        <div style={{ fontSize: '13px', color: '#CBD5E1', marginBottom: '12px' }}>
                          {order.items.map((i, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                              <span>
                                {i.quantity}x {i.name}
                              </span>
                              <span style={{ color: '#94A3B8' }}>
                                {(i.price * i.quantity).toLocaleString('ru-RU')} сум
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Actions: Receipt / Cancel */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <button
                            onClick={() => setReceiptOrder(order)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: '#CBD5E1',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Printer size={13} />
                            <span>Чек</span>
                          </button>

                          {order.status === 'new' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#EF4444',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Отменить заказ
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Profile Edit Tab */
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {saveMessage && (
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', borderRadius: '10px', fontSize: '13px', textAlign: 'center' }}>
                  {saveMessage}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>
                    Имя
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#FFF',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>
                    Фамилия
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#FFF',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>
                  Номер телефона
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#FFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>
                  Дата рождения
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#FFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>
                  Адрес доставки по умолчанию
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Термез, ул..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#FFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #E11D48 0%, #FF5500 100%)',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: 'none',
                  cursor: isSaving ? 'wait' : 'pointer'
                }}
              >
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </form>
          )}
        </div>
      </div>

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
