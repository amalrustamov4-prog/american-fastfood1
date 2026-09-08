'use client';

import React, { useState, useEffect } from 'react';
import { Bike, MapPin, Store, Navigation, Phone, CheckCircle, Clock, Flame, Sparkles } from 'lucide-react';
import { Order } from '@/lib/types';

interface CourierTrackerProps {
  order: Order;
  onClose: () => void;
}

export const CourierTracker: React.FC<CourierTrackerProps> = ({ order, onClose }) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [etaMinutes, setEtaMinutes] = useState(25);

  // Poll real status from database every 3 seconds so client sees instant updates from Admin & Courier!
  useEffect(() => {
    let isMounted = true;

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && data.id) {
            setCurrentOrder(data);
          }
        }
      } catch (e) {
        // Soft fallback to prop order
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [order.id]);

  const status = currentOrder.status; // 'new' | 'cooking' | 'delivering' | 'completed' | 'cancelled'

  // Dynamic progress based on real order lifecycle
  const progress =
    status === 'new'
      ? 15
      : status === 'cooking'
      ? 45
      : status === 'delivering'
      ? 80
      : status === 'completed'
      ? 100
      : 10;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1250 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          background: '#141724',
          border: '1.5px solid rgba(255, 85, 0, 0.3)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📍 Живой радар заказа (Термез)
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
              Заказ #{currentOrder.id}
            </h3>
          </div>

          <div
            style={{
              background:
                status === 'completed'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : status === 'delivering'
                  ? 'rgba(96, 165, 250, 0.2)'
                  : status === 'cooking'
                  ? 'rgba(255, 85, 0, 0.2)'
                  : 'rgba(255, 204, 0, 0.2)',
              border: `1px solid ${
                status === 'completed'
                  ? '#10B981'
                  : status === 'delivering'
                  ? '#60A5FA'
                  : status === 'cooking'
                  ? '#FF5500'
                  : '#FFCC00'
              }`,
              color:
                status === 'completed'
                  ? '#10B981'
                  : status === 'delivering'
                  ? '#93C5FD'
                  : status === 'cooking'
                  ? '#FF7722'
                  : '#FFCC00',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {status === 'completed' ? (
              <>
                <CheckCircle size={14} />
                <span>Доставлен</span>
              </>
            ) : status === 'delivering' ? (
              <>
                <Bike size={14} />
                <span>В пути ~15 мин</span>
              </>
            ) : status === 'cooking' ? (
              <>
                <Flame size={14} />
                <span>Готовится</span>
              </>
            ) : (
              <>
                <Clock size={14} />
                <span>Ожидает кафе</span>
              </>
            )}
          </div>
        </div>

        {/* Real-time Status Card Notification */}
        <div
          style={{
            background:
              status === 'new'
                ? 'rgba(255, 204, 0, 0.1)'
                : status === 'cooking'
                ? 'rgba(255, 85, 0, 0.15)'
                : status === 'delivering'
                ? 'rgba(112, 0, 255, 0.15)'
                : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${
              status === 'new'
                ? 'rgba(255, 204, 0, 0.3)'
                : status === 'cooking'
                ? 'rgba(255, 85, 0, 0.4)'
                : status === 'delivering'
                ? 'rgba(112, 0, 255, 0.4)'
                : 'rgba(16, 185, 129, 0.4)'
            }`,
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '18px'
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {status === 'new' && <span>⏳ Заказ отправлен в кафе AMERICAN</span>}
            {status === 'cooking' && <span>🔥 Кафе приняло ваш заказ! Шеф-повар готовит блюда</span>}
            {status === 'delivering' && <span>🚗 Заказ передан курьеру и уже едет к вам!</span>}
            {status === 'completed' && <span>✅ Заказ доставлен! Приятного аппетита!</span>}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {status === 'new' && 'Администратор подтверждает заказ на кухне ресторана.'}
            {status === 'cooking' && 'Ваши бургеры и блюда готовятся свежими на гриле (Термез).'}
            {status === 'delivering' && `Курьер: ${currentOrder.courierName || 'Назначен курьер'} уже направляется по вашему адресу.`}
            {status === 'completed' && 'Спасибо, что выбрали AMERICAN Fast Food! Будем рады вашему отзыву.'}
          </div>
        </div>

        {/* Interactive Radar Visual */}
        <div
          style={{
            position: 'relative',
            height: '160px',
            background: '#0B0D14',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Grid lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,85,0,0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Restaurant Marker */}
          <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', zIndex: 2 }}>
            <div style={{ background: '#FF5500', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 0 14px #FF5500' }}>
              <Store size={18} color="#fff" />
            </div>
            <div style={{ fontSize: '10px', color: '#fff', fontWeight: 700, marginTop: '4px' }}>Кафе AMERICAN</div>
          </div>

          {/* Delivery Route Progress Line */}
          <div style={{ position: 'absolute', left: '60px', right: '60px', top: '50%', height: '4px', background: 'rgba(255,255,255,0.1)', zIndex: 1 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #FF5500 0%, #10B981 100%)', transition: 'width 0.8s ease' }} />
          </div>

          {/* Moving Courier Icon */}
          <div
            style={{
              position: 'absolute',
              left: `calc(50px + (100% - 120px) * ${progress / 100})`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.8s ease',
              textAlign: 'center',
              zIndex: 3
            }}
          >
            <div
              style={{
                background: status === 'completed' ? '#10B981' : '#7000FF',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: status === 'completed' ? '0 0 20px #10B981' : '0 0 20px #7000FF',
                border: '2px solid #fff'
              }}
            >
              {status === 'completed' ? <CheckCircle size={20} color="#fff" /> : <Bike size={20} color="#fff" />}
            </div>
            <div style={{ fontSize: '10px', color: '#A78BFA', fontWeight: 800, marginTop: '2px' }}>
              {status === 'completed' ? 'Прибыл' : 'Курьер'}
            </div>
          </div>

          {/* Client Destination Marker */}
          <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', zIndex: 2 }}>
            <div style={{ background: '#10B981', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 0 14px #10B981' }}>
              <MapPin size={18} color="#fff" />
            </div>
            <div style={{ fontSize: '10px', color: '#fff', fontWeight: 700, marginTop: '4px' }}>Ваш адрес</div>
          </div>
        </div>

        {/* Courier Details Card if Assigned */}
        {currentOrder.courierName && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#7000FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                🛵
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '13px', color: '#fff' }}>
                  {currentOrder.courierName}
                </div>
                <div style={{ fontSize: '11px', color: '#10B981' }}>
                  ● Курьер доставляет ваш заказ (Термез)
                </div>
              </div>
            </div>

            {currentOrder.courierPhone && (
              <a
                href={`tel:${currentOrder.courierPhone}`}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10B981',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <Phone size={13} />
                <span>Позвонить</span>
              </a>
            )}
          </div>
        )}

        {/* Close Button */}
        <button onClick={onClose} className="btn-secondary" style={{ width: '100%', padding: '12px' }}>
          Закрыть окно отслеживания
        </button>
      </div>
    </div>
  );
};
