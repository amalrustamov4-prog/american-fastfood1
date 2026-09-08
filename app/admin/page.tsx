'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminTabType } from '@/components/admin/AdminSidebar';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminMenuTab } from '@/components/admin/AdminMenuTab';
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab';
import { AdminReviewsTab } from '@/components/admin/AdminReviewsTab';
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab';
import { AdminPerformersTab } from '@/components/admin/AdminPerformersTab';
import { AdminFleetMapTab } from '@/components/admin/AdminFleetMapTab';
import { playKitchenNewOrderSound } from '@/components/AudioNotifier';
import { apiClient } from '@/lib/api/client';
import { Category, Order, Product, Review, Employee } from '@/lib/types';
import { CAFE_SETTINGS } from '@/lib/initialData';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTabType>('orders');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [cafeSettings, setCafeSettings] = useState<any>(CAFE_SETTINGS);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();

      // Poll server for new orders every 5 seconds with sound alert
      const interval = setInterval(async () => {
        try {
          const freshOrders = await apiClient.getOrders();
          setOrders((prev) => {
            if (freshOrders.length > prev.length && prev.length > 0) {
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
      const [prods, cats, ords, revs, emps, settings] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories(),
        apiClient.getOrders(),
        apiClient.getReviews(),
        apiClient.getEmployees(),
        apiClient.getSettings()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setReviews(revs);
      setEmployees(emps);
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
        <div style={{ fontWeight: 700 }}>Загрузка сессии...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  const activeOrdersCount = orders.filter((o) => o.status === 'cooking' || o.status === 'new').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0B0D14' }}>
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeOrdersCount={activeOrdersCount}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: activeTab === 'fleet_map' ? '16px 20px' : '32px 40px', overflowY: 'auto' }}>
        {activeTab === 'orders' && (
          <AdminOrdersTab
            orders={orders}
            onRefresh={loadAllData}
            cafeSettings={cafeSettings}
            couriers={employees}
          />
        )}

        {activeTab === 'fleet_map' && (
          <AdminFleetMapTab
            employees={employees}
            orders={orders}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'performers' && (
          <AdminPerformersTab
            employees={employees}
            onRefresh={loadAllData}
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
