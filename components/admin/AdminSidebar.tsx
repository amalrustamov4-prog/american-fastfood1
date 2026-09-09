'use client';

import React from 'react';
import { Utensils, ShoppingBag, Star, Settings, ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';

export type AdminTabType = 'orders' | 'menu' | 'reviews' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  activeOrdersCount: number;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  activeOrdersCount,
  onLogout
}) => {
  const tabs: Array<{ id: AdminTabType; name: string; icon: React.ReactNode; count?: number; badgeColor?: string }> = [
    { id: 'orders', name: 'Управление заказами', icon: <ShoppingBag size={18} />, count: activeOrdersCount, badgeColor: '#FF5500' },
    { id: 'menu', name: 'Редактор меню', icon: <Utensils size={18} /> },
    { id: 'reviews', name: 'Отзывы клиентов', icon: <Star size={18} /> },
    { id: 'settings', name: 'Настройки ресторана', icon: <Settings size={18} /> }
  ];

  return (
    <aside
      style={{
        width: '260px',
        background: '#0D111A',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ padding: '0 8px', marginBottom: '24px' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: '#10B981', fontSize: '11px', fontWeight: 700 }}>
          <ShieldCheck size={14} />
          <span>ПАНЕЛЬ АДМИНИСТРАТОРА</span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                background: isActive ? 'linear-gradient(135deg, #E11D48 0%, #FF5500 100%)' : 'transparent',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                boxShadow: isActive ? '0 4px 15px rgba(225, 29, 72, 0.35)' : 'none',
                transition: 'all 0.2s',
                textAlign: 'left',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {tab.icon}
                <span>{tab.name}</span>
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  style={{
                    background: isActive ? '#FFFFFF' : (tab.badgeColor || '#FF5500'),
                    color: isActive ? '#E11D48' : '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94A3B8',
            fontSize: '13px',
            fontWeight: 600,
            padding: '10px 14px',
            borderRadius: '10px',
            textDecoration: 'none',
            background: 'rgba(255, 255, 255, 0.03)'
          }}
        >
          <ArrowLeft size={16} />
          <span>На клиентский сайт</span>
        </a>

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#EF4444',
            fontSize: '13px',
            fontWeight: 700,
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <LogOut size={16} />
          <span>Выйти из системы</span>
        </button>
      </div>
    </aside>
  );
};
