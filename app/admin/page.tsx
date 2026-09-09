'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminTabType } from '@/components/admin/AdminSidebar';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminMenuTab } from '@/components/admin/AdminMenuTab';
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab';
import { AdminReviewsTab } from '@/components/admin/AdminReviewsTab';
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab';
import { playKitchenNewOrderSound } from '@/components/AudioNotifier';
import { apiClient } from '@/lib/api/client';
import { Category, Order, Product, Review } from '@/lib/types';
import { CAFE_SETTINGS } from '@/lib/initialData';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTabType>('orders');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cafeSettings, setCafeSettings] = useState<any>(CAFE_SETTINGS);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();

      // Poll server for new orders every 5 seconds with kitchen sound alert
      const interval = setInterval(async () => {
        try {
          const freshOrders = await apiClient.getOrders();
          setOrders((prev) => {
            const hasNew = freshOrders.some(
              (fo) => fo.status === 'new' && !prev.some((po) => po.id === fo.id && po.status === 'new')
            );
            if (hasNew) {
              playKitchenNewOrderSound();
            }
            return freshOrders;
          });
        } catch (e) {
          // Ignore background poll errors
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const user = await apiClient.getMe();
      if (user && user.role === 'ADMIN') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [prods, cats, ords, revs, settings] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories(),
        apiClient.getOrders(),
        apiClient.getReviews(),
        apiClient.getSettings()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setReviews(revs);
      setCafeSettings(settings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      setIsAuthenticated(false);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0D14', color: '#fff' }}>
        <div style={{ fontWeight: 700 }}>Загрузка сессии администратора...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  const activeOrdersCount = orders.filter((o) => ['new', 'accepted', 'cooking', 'ready'].includes(o.status)).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0B0D14' }}>
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeOrdersCount={activeOrdersCount}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {activeTab === 'orders' && (
          <AdminOrdersTab
            orders={orders}
            onRefresh={loadAllData}
            cafeSettings={cafeSettings}
          />
        )}

        {activeTab === 'menu' && (
          <AdminMenuTab
            products={products}
            categories={categories}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'reviews' && (
          <AdminReviewsTab
            reviews={reviews}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsTab
            cafeSettings={cafeSettings}
            onRefresh={loadAllData}
          />
        )}
      </main>
    </div>
  );
}
