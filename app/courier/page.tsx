'use client';

import React, { useState, useEffect } from 'react';
import {
  Bike,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Power,
  TrendingUp,
  DollarSign,
  Store,
  User,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Order } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

export default function CourierPage() {
  const [isOnShift, setIsOnShift] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [todayEarnings, setTodayEarnings] = useState(264000);
  const [completedCount, setCompletedCount] = useState(11);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const list = await apiClient.getOrders();
      setOrders(list);
    } catch (e) {
      console.error('Failed to load courier orders:', e);
    }
  };

  // Find active or available delivery orders
  const activeOrder = orders.find((o) => o.id === activeOrderId);
  const availableOrders = orders.filter(
    (o) => o.status === 'cooking' && o.deliveryType === 'delivery' && o.id !== activeOrderId
  );

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setActiveOrderId(orderId);
      await apiClient.updateOrderStatus(orderId, 'delivering');
      loadOrders();
    } catch (e) {
      alert('Не удалось принять заказ');
    }
  };

  const handleNextStep = async (order: Order, currentStep: number) => {
    if (currentStep === 3) {
      try {
        await apiClient.updateOrderStatus(order.id, 'completed', 'paid');
        setActiveOrderId(null);
        setTodayEarnings((prev) => prev + 22000);
        setCompletedCount((prev) => prev + 1);
        loadOrders();
      } catch (e) {
        alert('Не удалось завершить заказ');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F121C', color: '#fff' }}>
      {/* Uzum Tezkor Partner Top Header */}
      <header
        style={{
          background: '#141724',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #7000FF 0%, #4C00B0 100%)',
              padding: '6px 12px',
              borderRadius: '10px',
              fontWeight: 900,
              fontSize: '13px',
              letterSpacing: '0.5px'
            }}
          >
            UZUM TEZKOR
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>AMERICAN Курьер #402</div>
            <div style={{ fontSize: '11px', color: '#10B981' }}>● Смена активна (Ташкент, Центр)</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setIsOnShift(!isOnShift)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isOnShift ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: isOnShift ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
              color: isOnShift ? '#10B981' : '#EF4444',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 800
            }}
          >
            <Power size={15} />
            <span>{isOnShift ? 'НА СМЕНЕ' : 'ОФФЛАЙН'}</span>
          </button>

          <a
            href="/"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-muted)',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            ← На сайт
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Earnings Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #2A1054 0%, #181C2A 100%)',
            border: '1px solid rgba(112, 0, 255, 0.4)',
            borderRadius: '24px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 10px 30px rgba(112, 0, 255, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#A78BFA', fontWeight: 600 }}>
              Заработок за сегодня
            </span>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800
              }}
            >
              +15% Час Пик 🔥
            </span>
          </div>

          <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
            {todayEarnings.toLocaleString('ru-RU')} сум
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Доставок</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{completedCount}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Рейтинг курьера</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFB800' }}>4.98 ⭐</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Чаевые</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981' }}>34 000 сум</div>
            </div>
          </div>
        </div>

        {/* Status Content */}
        {!isOnShift ? (
          <div
            style={{
              background: '#181C2A',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '40px 20px',
              textAlign: 'center'
            }}
          >
            <Power size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Вы вышли со смены
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Включите статус «НА СМЕНЕ» вверху, чтобы получать заказы от ресторана AMERICAN
            </p>
            <button
              onClick={() => setIsOnShift(true)}
              className="btn-primary"
              style={{ background: '#7000FF', padding: '12px 28px' }}
            >
              Выйти на линию
            </button>
          </div>
        ) : activeOrder ? (
          /* Active Order Workflow */
          <ActiveOrderCard order={activeOrder} onFinish={() => handleNextStep(activeOrder, 3)} />
        ) : availableOrders.length > 0 ? (
          /* Incoming Delivery Orders */
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bike size={18} color="#FF5500" />
              <span>Доступные заказы на доставку ({availableOrders.length})</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {availableOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    background: '#181C2A',
                    border: '1.5px solid var(--primary)',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0 8px 24px rgba(255, 85, 0, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>#{ord.id}</span>
                      <span
                        style={{
                          background: 'rgba(255, 85, 0, 0.2)',
                          color: '#FF5500',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800
                        }}
                      >
                        ГОТОВ К ВЫДАЧЕ
                      </span>
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#10B981' }}>
                      + 22 000 сум
                    </div>
                  </div>

                  {/* Route Steps */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Store size={18} color="#FF5500" />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                          Кафе AMERICAN (Забрать заказ)
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          ул. Амира Темура, 45
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MapPin size={18} color="#10B981" />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                          Клиент: {ord.customerName} ({ord.phone})
                        </div>
                        <div style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 600 }}>
                          {ord.address}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items breakdown */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Состав: {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>

                  <button
                    onClick={() => handleAcceptOrder(ord.id)}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      fontSize: '15px'
                    }}
                  >
                    <span>Принять заказ (+ 22 000 сум)</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Waiting Radar */
          <div
            style={{
              background: '#181C2A',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '40px 20px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(112, 0, 255, 0.15)',
                border: '2px dashed #7000FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                animation: 'spin 6s linear infinite'
              }}
            >
              <Bike size={28} color="#7000FF" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Поиск новых заказов в базе...
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Вы находитесь в активной зоне доставки ресторана. Ожидайте оформления заказа клиентом.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function ActiveOrderCard({ order, onFinish }: { order: Order; onFinish: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <div
      style={{
        background: '#181C2A',
        border: '2px solid #7000FF',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 36px rgba(112, 0, 255, 0.25)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#A78BFA' }}>
            ЭТАП {step} ИЗ 3
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
            Заказ #{order.id}
          </h2>
        </div>

        <div style={{ fontSize: '18px', fontWeight: 900, color: '#10B981' }}>
          + 22 000 сум
        </div>
      </div>

      {/* Dynamic step info */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px'
        }}
      >
        {step === 1 && (
          <div>
            <div style={{ fontSize: '12px', color: '#A78BFA', fontWeight: 700, marginBottom: '4px' }}>
              📍 1. ЕЗЖАЙТЕ В КАФЕ AMERICAN
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
              ул. Амира Темура, 45
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Сообщите кассиру номер заказа <strong>#{order.id}</strong>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: '12px', color: '#FF5500', fontWeight: 700, marginBottom: '4px' }}>
              🛍️ 2. ЗАБЕРИТЕ ПАКЕТ С ЕДОЙ
            </div>
            <div style={{ fontSize: '14px', color: '#fff', fontWeight: 700 }}>
              Проверьте состав заказа:
            </div>
            <ul style={{ paddingLeft: '18px', marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
              {order.items.map((i, idx) => (
                <li key={idx}>
                  {i.quantity}x {i.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, marginBottom: '4px' }}>
              🚗 3. ДОСТАВКА КЛИЕНТУ В ПУТИ
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
              Клиент: {order.customerName}
            </div>
            <div style={{ fontSize: '14px', color: '#60A5FA', fontWeight: 700, marginTop: '2px' }}>
              Адрес: {order.address}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <a
                href={`tel:${order.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <Phone size={15} />
                <span>Позвонить клиенту ({order.phone})</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Step Action Button */}
      {step === 1 && (
        <button
          onClick={() => setStep(2)}
          className="btn-primary"
          style={{ width: '100%', padding: '16px', background: '#7000FF' }}
        >
          <span>Я прибыл в кафе AMERICAN 📍</span>
        </button>
      )}

      {step === 2 && (
        <button
          onClick={() => setStep(3)}
          className="btn-primary"
          style={{ width: '100%', padding: '16px', background: 'var(--primary-gradient)' }}
        >
          <span>Заказ забран, выезжаю к клиенту 🚗</span>
        </button>
      )}

      {step === 3 && (
        <button
          onClick={onFinish}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
          }}
        >
          <CheckCircle2 size={18} />
          <span>Заказ вручен клиенту (Завершить) ✅</span>
        </button>
      )}
    </div>
  );
}
