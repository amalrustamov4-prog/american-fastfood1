'use client';

import React from 'react';
import { Utensils, ShoppingBag, Star, Settings, ArrowLeft, LogOut, MapPin, Users } from 'lucide-react';
import { Logo } from '@/components/Logo';

export type AdminTabType = 'orders' | 'fleet_map' | 'performers' | 'menu' | 'reviews' | 'settings';

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
    { id: 'orders', name: 'Заказы клиентов', icon: <ShoppingBag size={18} />, count: activeOrdersCount, badgeColor: '#FFCC00' },
    { id: 'fleet_map', name: 'Xarita (Fleet GPS)', icon: <MapPin size={18} /> },
    { id: 'performers', name: 'Bajaruvchilar & Xodimlar', icon: <Users size={18} /> },
    { id: 'menu', name: 'Редактор Меню', icon: <Utensils size={18} /> },
    { id: 'reviews', name: 'Отзывы гостей', icon: <Star size={18} /> },
    { id: 'settings', name: 'Настройки заведения', icon: <Settings size={18} /> }
  ];

  return (
    <aside
      style={{
        width: '270px',
        background: '#10131E',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        minHeight: '100vh'
      }}
    >
      <div style={{ padding: '0 8px', marginBottom: '28px' }}>
        <Logo size="sm" />
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
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                background: isActive ? 'var(--primary-gradient)' : 'none',
                color: isActive ? '#fff' : 'var(--text-muted)',
                boxShadow: isActive ? '0 4px 15px rgba(255, 85, 0, 0.35)' : 'none',
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
                    background: isActive ? '#fff' : (tab.badgeColor || 'var(--primary)'),
                    color: isActive ? 'var(--primary)' : '#000',
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

      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '13px',
            fontWeight: 600,
            padding: '10px 14px',
            borderRadius: '10px',
            textDecoration: 'none'
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
