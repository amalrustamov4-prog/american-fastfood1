'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Phone,
  Navigation,
  RefreshCw,
  Car,
  Bike,
  Footprints,
  Clock,
  Store,
  Compass,
  Zap,
  X,
  ExternalLink
} from 'lucide-react';
import { Employee, Order } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

interface AdminFleetMapTabProps {
  employees: Employee[];
  orders: Order[];
  onRefresh: () => void;
}

export const AdminFleetMapTab: React.FC<AdminFleetMapTabProps> = ({
  employees,
  orders,
  onRefresh
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'on_order' | 'busy' | 'no_gps'>('all');
  const [selectedPerformer, setSelectedPerformer] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'kuryer' | 'taksi'>('all');

  // Counts matching Screenshot 4
  const couriersOnly = employees.filter((e) => e.role === 'kuryer' || e.role === 'taksi');
  const freeCount = couriersOnly.filter((e) => e.status === 'free').length;
  const onOrderCount = couriersOnly.filter((e) => e.status === 'on_order').length;
  const busyCount = couriersOnly.filter((e) => e.status === 'busy').length;
  const noGpsCount = couriersOnly.filter((e) => !e.hasGps || e.status === 'no_gps').length;

  // Initialize Leaflet Map (Dynamic client-side only)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;

      // Ensure leaflet styles are in DOM
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Default center: Samarkand (matching Screenshot 4 coordinates 39.6542, 66.9597)
      const map = L.map(mapContainerRef.current, {
        center: [39.6542, 66.9597],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Dark theme tiles: CartoDB Dark Matter (Identical to Yandex Fleet Dark map)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Custom Zoom control at left top
      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Restaurant marker (AMERICAN Fast Food)
      const cafeIcon = L.divIcon({
        className: 'custom-cafe-icon',
        html: `
          <div style="
            background: linear-gradient(135deg, #FF5500 0%, #CC2200 100%);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            box-shadow: 0 0 16px rgba(255, 85, 0, 0.8), 0 0 0 4px rgba(255, 85, 0, 0.25);
            border: 2px solid #fff;
            font-weight: 900;
            font-size: 14px;
            cursor: pointer;
          ">
            🍔
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const cafeMarker = L.marker([39.6542, 66.9597], { icon: cafeIcon }).addTo(map);
      cafeMarker.bindPopup(`
        <div style="color: #000; padding: 4px;">
          <strong style="font-size: 14px;">Кафе AMERICAN (База)</strong>
          <div style="font-size: 12px; color: #555; margin-top: 2px;">ул. Амира Темура, 45</div>
        </div>
      `);

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Courier Markers whenever employees change
  useEffect(() => {
    async function updateMarkers() {
      if (!mapInstanceRef.current) return;
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      couriersOnly.forEach((emp) => {
        if (!emp.lat || !emp.lng) return;

        const isSelected = selectedPerformer?.id === emp.id;
        const color =
          emp.status === 'free'
            ? '#10B981' // Green
            : emp.status === 'on_order'
            ? '#FF9900' // Yellow/Orange
            : emp.status === 'busy'
            ? '#EF4444' // Red
            : '#888888'; // Grey

        const markerHtml = `
          <div style="
            position: relative;
            cursor: pointer;
            transition: transform 0.2s;
            transform: ${isSelected ? 'scale(1.3)' : 'scale(1)'};
          ">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: ${color};
              border: 3px solid #fff;
              box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 12px ${color};
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: 12px;
              font-weight: 900;
            ">
              ${
                emp.courierType === 'avto'
                  ? '🚗'
                  : emp.courierType === 'moto'
                  ? '🛵'
                  : emp.courierType === 'yuk'
                  ? '🚚'
                  : '🚶'
              }
            </div>
            ${
              emp.status === 'on_order'
                ? `<div style="
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #FFCC00;
                    border: 2px solid #fff;
                    animation: pulse 1.5s infinite;
                  "></div>`
                : ''
            }
          </div>
        `;

        const icon = L.divIcon({
          className: 'courier-fleet-pin',
          html: markerHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([emp.lat, emp.lng], { icon }).addTo(map);

        marker.on('click', () => {
          setSelectedPerformer(emp);
        });

        markersRef.current.set(emp.id, marker);
      });
    }

    updateMarkers();
  }, [employees, selectedPerformer]);

  // Center map on selected performer
  const handleSelectPerformer = (emp: Employee) => {
    setSelectedPerformer(emp);
    if (mapInstanceRef.current && emp.lat && emp.lng) {
      mapInstanceRef.current.flyTo([emp.lat, emp.lng], 15, { duration: 1 });
    }
  };

  // Filter list
  const filteredPerformers = couriersOnly.filter((emp) => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'no_gps') {
        if (emp.hasGps && emp.status !== 'no_gps') return false;
      } else if (emp.status !== statusFilter) {
        return false;
      }
    }
    if (activeTab === 'kuryer' && emp.role !== 'kuryer') return false;
    if (activeTab === 'taksi' && emp.role !== 'taksi') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = `${emp.lastName} ${emp.firstName}`.toLowerCase();
      const plate = (emp.vehiclePlate || '').toLowerCase();
      const phone = emp.phone.toLowerCase();
      return name.includes(q) || plate.includes(q) || phone.includes(q);
    }
    return true;
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        background: '#181818',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* TOP HEADER BAR (Matching Screenshot 4) */}
      <div
        style={{
          background: '#212121',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Left: Brand Icon + Xarita */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              background: '#FFCC00',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '16px',
              color: '#000'
            }}
          >
            Y
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>
            Xarita
          </h2>
        </div>

        {/* Center: Status Counters (Bo'sh, Buyurtmada, Band, GPS yo'q) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Bo'sh Pill */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'free' ? 'all' : 'free')}
            style={{
              background: statusFilter === 'free' ? '#10B981' : '#2C2C2C',
              color: statusFilter === 'free' ? '#000' : '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span
              style={{
                background: '#10B981',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 900,
                padding: '1px 6px',
                borderRadius: '9999px'
              }}
            >
              {freeCount}
            </span>
            <span>Bo'sh</span>
          </button>

          {/* Buyurtmada Pill */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'on_order' ? 'all' : 'on_order')}
            style={{
              background: statusFilter === 'on_order' ? '#FFB800' : '#2C2C2C',
              color: statusFilter === 'on_order' ? '#000' : '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span
              style={{
                background: '#FFB800',
                color: '#000',
                fontSize: '11px',
                fontWeight: 900,
                padding: '1px 6px',
                borderRadius: '9999px'
              }}
            >
              {onOrderCount}
            </span>
            <span>Buyurtmada</span>
          </button>

          {/* Band Pill */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'busy' ? 'all' : 'busy')}
            style={{
              background: statusFilter === 'busy' ? '#EF4444' : '#2C2C2C',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span
              style={{
                background: '#EF4444',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 900,
                padding: '1px 6px',
                borderRadius: '9999px'
              }}
            >
              {busyCount}
            </span>
            <span>Band</span>
          </button>

          {/* GPS yo'q Pill */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'no_gps' ? 'all' : 'no_gps')}
            style={{
              background: statusFilter === 'no_gps' ? '#6B7280' : '#2C2C2C',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span
              style={{
                background: '#4B5563',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 900,
                padding: '1px 6px',
                borderRadius: '9999px'
              }}
            >
              {noGpsCount}
            </span>
            <span>GPS yo'q</span>
          </button>

          {/* Filtrlar button */}
          <button
            style={{
              background: '#2C2C2C',
              border: 'none',
              color: '#bbb',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <SlidersHorizontal size={14} />
            <span>+ Filtrlar</span>
          </button>
        </div>

        {/* Right: Search & Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#888" style={{ position: 'absolute', left: '10px', top: '9px' }} />
            <input
              type="text"
              placeholder="Qidiruv"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: '#2C2C2C',
                border: 'none',
                borderRadius: '9999px',
                color: '#fff',
                padding: '6px 14px 6px 32px',
                fontSize: '13px',
                outline: 'none',
                width: '180px'
              }}
            />
          </div>

          <div
            style={{
              fontSize: '12px',
              color: '#999',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <ArrowUpDown size={13} />
            <span>Statusdagi vaqt bo'yicha</span>
          </div>

          <button
            onClick={onRefresh}
            title="Yangilash"
            style={{
              background: 'none',
              border: 'none',
              color: '#bbb',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* BODY: SIDEBAR + INTERACTIVE MAP */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* LEFT SIDEBAR (Matching Screenshot 4) */}
        <div
          style={{
            width: '380px',
            background: '#1F1F1F',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}
        >
          {filteredPerformers.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
              Ushbu holatda ijrochilar topilmadi
            </div>
          ) : (
            filteredPerformers.map((emp) => {
              const isSelected = selectedPerformer?.id === emp.id;
              return (
                <div
                  key={emp.id}
                  onClick={() => handleSelectPerformer(emp)}
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    background: isSelected ? '#2C2C2C' : 'transparent',
                    borderLeft: isSelected ? '4px solid #FFCC00' : '4px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Driver Avatar */}
                    <div style={{ position: 'relative' }}>
                      <img
                        src={emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                        alt={emp.firstName}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1.5px solid rgba(255,255,255,0.15)'
                        }}
                      />
                      {/* Active indicator dot */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background:
                            emp.status === 'free'
                              ? '#10B981'
                              : emp.status === 'on_order'
                              ? '#FFB800'
                              : emp.status === 'busy'
                              ? '#EF4444'
                              : '#6B7280',
                          border: '2px solid #1F1F1F'
                        }}
                      />
                    </div>

                    {/* Driver Info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                          {emp.lastName} {emp.firstName} {emp.middleName ? emp.middleName.charAt(0) + '.' : ''}
                        </span>

                        {/* NO GPS or GPS Badge */}
                        <span
                          style={{
                            background: emp.hasGps ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
                            color: emp.hasGps ? '#10B981' : '#aaa',
                            fontSize: '9px',
                            fontWeight: 900,
                            padding: '1px 5px',
                            borderRadius: '4px'
                          }}
                        >
                          {emp.hasGps ? 'GPS' : 'NO GPS'}
                        </span>
                      </div>

                      {/* Status Line */}
                      <div style={{ fontSize: '12px', color: '#bbb', marginTop: '2px' }}>
                        <span
                          style={{
                            color:
                              emp.status === 'free'
                                ? '#10B981'
                                : emp.status === 'on_order'
                                ? '#FFB800'
                                : emp.status === 'busy'
                                ? '#EF4444'
                                : '#888',
                            fontWeight: 700
                          }}
                        >
                          {emp.status === 'free'
                            ? 'Bo\'sh'
                            : emp.status === 'on_order'
                            ? 'Buyurtmada'
                            : emp.status === 'busy'
                            ? 'Band'
                            : 'Oflayn'}{' '}
                        </span>
                        <span>{emp.status === 'on_order' ? '12 мин' : emp.status === 'busy' ? '6 ч 25 мин' : '15 мин'}</span>
                      </div>

                      {/* Balance & Plate Line */}
                      <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                        <span style={{ color: '#fff', fontWeight: 700 }}>
                          {emp.balance.toLocaleString('ru-RU')} UZS
                        </span>
                        {emp.vehiclePlate ? ` · ${emp.vehiclePlate}` : emp.courierType === 'piyoda' ? ' · Piyoda' : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ color: '#555', fontSize: '16px' }}>›</div>
                </div>
              );
            })
          )}
        </div>

        {/* CENTER INTERACTIVE DARK MAP */}
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#121212' }} />

          {/* Quick Floating Controls */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div
              style={{
                background: '#242424',
                padding: '8px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
              }}
            >
              <Store size={15} color="#FF5500" />
              <span>Кафе AMERICAN: Самарканд</span>
            </div>
          </div>

          {/* SELECTED PERFORMER POPUP CARD ON MAP */}
          {selectedPerformer && (
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                zIndex: 1000,
                background: '#212121',
                borderRadius: '20px',
                padding: '20px',
                width: '360px',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={selectedPerformer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#fff', margin: 0 }}>
                      {selectedPerformer.lastName} {selectedPerformer.firstName}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#FFCC00', fontWeight: 700, marginTop: '2px' }}>
                      {selectedPerformer.courierType === 'avto'
                        ? `🚗 ${selectedPerformer.vehiclePlate || 'Avtomobil'}`
                        : selectedPerformer.courierType === 'moto'
                        ? `🛵 ${selectedPerformer.vehiclePlate || 'Skuter'}`
                        : '🚶 Piyoda kuryer'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPerformer(null)}
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status details */}
              <div
                style={{
                  background: '#181818',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  fontSize: '12px'
                }}
              >
                <div>
                  <div style={{ color: '#888', marginBottom: '2px' }}>Holat:</div>
                  <div
                    style={{
                      fontWeight: 800,
                      color:
                        selectedPerformer.status === 'free'
                          ? '#10B981'
                          : selectedPerformer.status === 'on_order'
                          ? '#FFB800'
                          : selectedPerformer.status === 'busy'
                          ? '#EF4444'
                          : '#888'
                    }}
                  >
                    ● {selectedPerformer.status === 'free' ? 'Bo\'sh' : selectedPerformer.status === 'on_order' ? 'Buyurtmada' : 'Band'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#888', marginBottom: '2px' }}>Buyurtmalar:</div>
                  <div style={{ fontWeight: 800, color: '#fff' }}>
                    {selectedPerformer.completedOrdersCount} ta
                  </div>
                </div>

                <div>
                  <div style={{ color: '#888', marginBottom: '2px' }}>Balans:</div>
                  <div style={{ fontWeight: 800, color: '#FFCC00' }}>
                    {selectedPerformer.balance.toLocaleString('ru-RU')} UZS
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`tel:${selectedPerformer.phone}`}
                  style={{
                    flex: 1,
                    background: '#10B981',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontWeight: 800,
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={15} />
                  <span>Qo'ng'iroq ({selectedPerformer.phone})</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
