'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';
import { PaymentMethod } from '@/lib/types';

interface PaymentSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  method: PaymentMethod;
  total: number;
  onPaymentSuccess: () => void;
}

export const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({
  isOpen,
  onClose,
  method,
  total,
  onPaymentSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState('+998 (90) 123-45-67');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isClick = method === 'click';
  const isPayme = method === 'payme';
  const isCard = method === 'card';

  const brandName = isClick ? 'Click Evolution' : isPayme ? 'Payme' : 'Банковская Карта (Uzcard/Humo)';
  const brandColor = isClick ? '#0073FF' : isPayme ? '#00CCCC' : '#8B5CF6';

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1150 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '420px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: brandColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '14px'
              }}
            >
              {isClick ? 'C' : isPayme ? 'P' : '💳'}
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                Оплата через {brandName}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Безопасный платежный шлюз
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Amount Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Сумма к списанию:</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--secondary)', marginTop: '4px' }}>
            {total.toLocaleString('ru-RU')} сум
          </div>
        </div>

        {/* Payment simulator interactive body */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
            {isCard ? 'Номер карты Uzcard / Humo' : 'Номер телефона в системе'}
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 600
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '10px',
              fontSize: '12px',
              color: '#10B981'
            }}
          >
            <ShieldCheck size={16} />
            <span>256-bit SSL шифрование платежа</span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            background: isClick
              ? 'linear-gradient(135deg, #0073FF 0%, #0052B4 100%)'
              : isPayme
              ? 'linear-gradient(135deg, #00CCCC 0%, #009999 100%)'
              : 'var(--primary-gradient)'
          }}
        >
          {isProcessing ? (
            <span>Обработка платежа... ⏳</span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Оплатить {total.toLocaleString('ru-RU')} сум</span>
              <ArrowRight size={16} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
