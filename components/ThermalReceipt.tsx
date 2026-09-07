'use client';

import React from 'react';
import { Printer, Download, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { CafeSettings, Order } from '@/lib/types';

interface ThermalReceiptProps {
  order: Order | null;
  cafeSettings: CafeSettings;
  onClose: () => void;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  order,
  cafeSettings,
  onClose
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '24px',
          maxHeight: '95vh',
          overflowY: 'auto'
        }}
      >
        {/* Action Header */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={22} color="var(--success)" />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>
              Заказ оформлен!
            </h3>
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

        {/* Action Buttons */}
        <div
          className="no-print"
          style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
        >
          <button
            onClick={handlePrint}
            className="btn-primary"
            style={{ flex: 1, padding: '12px 16px', fontSize: '14px' }}
          >
            <Printer size={16} />
            <span>Распечатать чек (POS)</span>
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '12px 16px', fontSize: '14px' }}
          >
            Закрыть
          </button>
        </div>

        {/* =========================================================================
             REAL POS THERMAL RECEIPT PAPER (58mm / 80mm format)
             ========================================================================= */}
        <div className="pos-receipt-paper" id="receipt-printable-area">
          {/* Cafe Header */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
              AMERICAN
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' }}>
              PREMIUM FAST FOOD & GRILL
            </div>
            <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '4px' }}>
              {cafeSettings.address}
            </div>
            <div style={{ fontSize: '11px', color: '#4B5563' }}>
              Тел: {cafeSettings.phone}
            </div>
          </div>

          <hr className="receipt-divider" />

          {/* Receipt Info */}
          <div className="receipt-row">
            <span>ЧЕК ЗАКАЗА:</span>
            <span style={{ fontWeight: 800 }}>#{order.id}</span>
          </div>
          <div className="receipt-row">
            <span>ДАТА / ВРЕМЯ:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="receipt-row">
            <span>ТИП:</span>
            <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>
              {order.deliveryType === 'delivery' ? '🚗 Доставка' : '🏃 Самовывоз'}
            </span>
          </div>
          <div className="receipt-row">
            <span>КЛИЕНТ:</span>
            <span>{order.customerName}</span>
          </div>
          <div className="receipt-row">
            <span>ТЕЛЕФОН:</span>
            <span>{order.phone}</span>
          </div>
          {order.deliveryType === 'delivery' && (
            <div style={{ margin: '4px 0', fontSize: '12px' }}>
              <span>АДРЕС: </span>
              <span style={{ fontWeight: 600 }}>{order.address}</span>
            </div>
          )}

          <hr className="receipt-divider" />

          {/* Items Table */}
          <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '12px' }}>
            СОСТАВ ЗАКАЗА:
          </div>

          {order.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '6px' }}>
              <div className="receipt-row">
                <span style={{ fontWeight: 700 }}>
                  {idx + 1}. {item.name}
                </span>
                <span style={{ fontWeight: 700 }}>
                  {(item.price * item.quantity).toLocaleString('ru-RU')}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#4B5563', display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  {item.quantity} шт x {item.price.toLocaleString('ru-RU')} сум
                </span>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <span>(+{item.selectedOptions.map((o) => o.name).join(', ')})</span>
                )}
              </div>
            </div>
          ))}

          <hr className="receipt-divider" />

          {/* Totals */}
          <div className="receipt-row">
            <span>Сумма блюд:</span>
            <span>{order.itemsTotal.toLocaleString('ru-RU')} сум</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="receipt-row" style={{ color: '#059669' }}>
              <span>Скидка ({order.promoCode || 'Промо'}):</span>
              <span>-{order.discountAmount.toLocaleString('ru-RU')} сум</span>
            </div>
          )}
          <div className="receipt-row">
            <span>Доставка:</span>
            <span>
              {order.deliveryFee === 0 ? 'БЕСПЛАТНО' : `${order.deliveryFee.toLocaleString('ru-RU')} сум`}
            </span>
          </div>

          <hr className="receipt-divider" />

          <div
            className="receipt-row"
            style={{ fontSize: '16px', fontWeight: 900, margin: '8px 0' }}
          >
            <span>ИТОГО К ОПЛАТЕ:</span>
            <span>{order.total.toLocaleString('ru-RU')} сум</span>
          </div>

          <div className="receipt-row" style={{ fontSize: '12px' }}>
            <span>ОПЛАТА:</span>
            <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>
              {order.paymentMethod} •{' '}
              {order.paymentStatus === 'paid' ? 'ОПЛАЧЕНО' : 'ПРИ ПОЛУЧЕНИИ'}
            </span>
          </div>

          {order.comment && (
            <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '6px' }}>
              <span>Комментарий: {order.comment}</span>
            </div>
          )}

          {/* Barcode & Thank You */}
          <div className="receipt-barcode">
            <div style={{ fontFamily: 'monospace', letterSpacing: '4px', fontSize: '18px' }}>
              ||||| | |||| ||| |||||
            </div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
              {order.id}-{Math.floor(Math.random() * 89999 + 10000)}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, marginTop: '8px', textAlign: 'center' }}>
              СПАСИБО ЗА ЗАКАЗ! ПРИЯТНОГО АППЕТИТА!
            </div>
            <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>
              american-fastfood.uz
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
