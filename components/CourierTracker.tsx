'use client';

import React, { useState, useEffect } from 'react';
import { Bike, MapPin, Store, Navigation, Phone, CheckCircle, Clock } from 'lucide-react';
import { Order } from '@/lib/types';

interface CourierTrackerProps {
  order: Order;
  onClose: () => void;
}

export const CourierTracker: React.FC<CourierTrackerProps> = ({ order, onClose }) => {
  const [progress, setProgress] = useState(25);
  const [etaMinutes, setEtaMinutes] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 5;
      });
      setEtaMinutes((prev) => (prev > 5 ? prev - 1 : 5));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1250 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '500px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>
              Живой GPS-радар доставки
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>
              Заказ #{order.id} в пути
            </h3>
          </div>

          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10B981',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={14} />
            <span>ETA ~{etaMinutes} мин</span>
          </div>
        </div>

        {/* Interactive Radar Visual */}
        <div
          style={{
            position: 'relative',
            height: '180px',
            background: '#0B0D14',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            marginBottom: '20px',
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
          <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', textAlign: 'center' }}>
            <div style={{ background: '#FF5500', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <Store size={18} color="#fff" />
            </div>
            <div style={{ fontSize: '10px', color: '#fff', fontWeight: 700, marginTop: '4px' }}>Кафе AMERICAN</div>
          </div>

          {/* Delivery Route Progress Line */}
          <div style={{ position: 'absolute', left: '60px', right: '60px', top: '50%', height: '3px', background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #FF5500, #10B981)', transition: 'width 0.8s ease' }} />
          </div>

          {/* Moving Courier Icon */}
          <div
            style={{
              position: 'absolute',
              left: `calc(50px + (100% - 120px) * ${progress / 100})`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.8s ease',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                background: '#7000FF',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px #7000FF'
              }}
            >
              <Bike size={22} color="#fff" />
            </div>
            <div style={{ fontSize: '10px', color: '#A78BFA', fontWeight: 800, marginTop: '2px' }}>Курьер</div>
          </div>

          {/* Client Destination Marker */}
          <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', textAlign: 'center' }}>
            <div style={{ background: '#10B981', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <MapPin size={18} color="#fff" />
            </div>
            <div style={{ fontSize: '10px', color: '#fff', fontWeight: 700, marginTop: '4px' }}>Ваш адрес</div>
          </div>
        </div>

        {/* Courier Info Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#7000FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '16px'
              }}
            >
              🚀
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>
                Фаррух (Курьер Uzum Tezkor)
              </div>
              <div style={{ fontSize: '12px', color: '#FFB800' }}>
                ⭐ 4.98 • Электроскутер
              </div>
            </div>
          </div>

          <a
            href="tel:+998901234567"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              padding: '8px 12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <Phone size={14} />
            <span>Позвонить</span>
          </a>
        </div>

        <button onClick={onClose} className="btn-secondary" style={{ width: '100%', padding: '12px' }}>
          Закрыть окно отслеживания
        </button>
      </div>
    </div>
  );
};
