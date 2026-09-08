'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Bike,
  Car,
  Truck,
  Footprints,
  Phone,
  CheckCircle,
  Clock,
  Shield,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings,
  Plus,
  Eye,
  X
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Employee, EmployeeRole, CourierType } from '@/lib/types';

interface AdminPerformersTabProps {
  employees: Employee[];
  onRefresh: () => void;
}

export const AdminPerformersTab: React.FC<AdminPerformersTabProps> = ({
  employees,
  onRefresh
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form State matching Screenshots 1, 2, 3
  const [activeFormTab, setActiveFormTab] = useState<'kuryer' | 'taksi' | 'staff'>('kuryer');
  const [staffRole, setStaffRole] = useState<EmployeeRole>('ofitsiant');
  const [courierType, setCourierType] = useState<CourierType>('piyoda');

  // Fields
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [birthDate, setBirthDate] = useState('');
  const [workCondition, setWorkCondition] = useState('1,4% (Stand.)');

  // Vehicle specific fields
  const [drivingExperienceDate, setDrivingExperienceDate] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCountry, setLicenseCountry] = useState('Uzbekistan');
  const [licenseIssueDate, setLicenseIssueDate] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [address, setAddress] = useState('');
  const [jshshir, setJshshir] = useState('');
  const [trafficSource, setTrafficSource] = useState('Organik trafik');
  const [hearingImpaired, setHearingImpaired] = useState(false);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Determine if current selection requires vehicle & driving license
  const isVehicleCourier =
    (activeFormTab === 'kuryer' || activeFormTab === 'taksi') &&
    (courierType === 'avto' || courierType === 'moto' || courierType === 'yuk');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!lastName.trim() || !firstName.trim() || !phone.trim() || phone === '+998 ') {
      setErrorMessage('Iltimos, Familiya, Ism va Telefon raqamini kiriting');
      return;
    }

    setSaving(true);
    try {
      const computedRole: EmployeeRole =
        activeFormTab === 'kuryer'
          ? 'kuryer'
          : activeFormTab === 'taksi'
          ? 'taksi'
          : staffRole;

      await apiClient.createEmployee({
        lastName,
        firstName,
        middleName,
        phone,
        birthDate,
        role: computedRole,
        courierType: activeFormTab === 'kuryer' || activeFormTab === 'taksi' ? courierType : null,
        workCondition,
        drivingExperienceDate: isVehicleCourier ? drivingExperienceDate : null,
        licenseNumber: isVehicleCourier ? licenseNumber : null,
        licenseCountry: isVehicleCourier ? licenseCountry : null,
        licenseIssueDate: isVehicleCourier ? licenseIssueDate : null,
        licenseExpiryDate: isVehicleCourier ? licenseExpiryDate : null,
        address,
        jshshir: isVehicleCourier ? jshshir : null,
        trafficSource,
        hearingImpaired,
        vehiclePlate: isVehicleCourier ? vehiclePlate : null,
        vehicleModel: isVehicleCourier ? vehicleModel : courierType === 'piyoda' ? 'Piyoda kuryer' : null,
        notes
      });

      // Reset form
      setLastName('');
      setFirstName('');
      setMiddleName('');
      setPhone('+998 ');
      setBirthDate('');
      setVehiclePlate('');
      setVehicleModel('');
      setLicenseNumber('');
      setNotes('');
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Xodimni saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Haqiqatan ham ${name} xodimini o'chirmoqchimisiz?`)) return;
    try {
      await apiClient.deleteEmployee(id);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'O\'chirishda xatolik');
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    if (roleFilter !== 'all') {
      if (roleFilter === 'kuryer' && emp.role !== 'kuryer') return false;
      if (roleFilter === 'staff' && emp.role === 'kuryer') return false;
      if (roleFilter === emp.role) return true;
      if (roleFilter !== 'kuryer' && roleFilter !== 'staff' && emp.role !== roleFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const fullName = `${emp.lastName} ${emp.firstName} ${emp.middleName || ''}`.toLowerCase();
      const phone = emp.phone.toLowerCase();
      const plate = (emp.vehiclePlate || '').toLowerCase();
      return fullName.includes(q) || phone.includes(q) || plate.includes(q);
    }
    return true;
  });

  return (
    <div style={{ color: '#fff' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>
            👥 Bajaruvchilar va Xodimlar boshqaruvi
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Kuryerlar, haydovchilar, ofitsiantlar, oshpazlar va boshqaruv xodimlarini ro'yxatga olish hamda nazorat qilish
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm ? '#333' : '#FFCC00',
            color: showAddForm ? '#fff' : '#000',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            border: 'none',
            boxShadow: showAddForm ? 'none' : '0 4px 16px rgba(255, 204, 0, 0.4)'
          }}
        >
          {showAddForm ? <X size={18} /> : <UserPlus size={18} />}
          <span>{showAddForm ? 'Formani yopish' : 'Yangi profil qo\'shish'}</span>
        </button>
      </div>

      {/* YANDEX FLEET REGISTRATION FORM (Screenshots 1, 2, 3) */}
      {showAddForm && (
        <div
          style={{
            background: '#242424',
            borderRadius: '20px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '32px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.5)'
          }}
        >
          {/* Breadcrumb Title */}
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '20px', fontWeight: 600 }}>
            Bajaruvchilar &nbsp;→&nbsp; <span style={{ color: '#fff', fontWeight: 800 }}>Yangi profil</span>
          </div>

          {/* Main Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveFormTab('kuryer')}
              style={{
                background: 'none',
                border: 'none',
                color: activeFormTab === 'kuryer' ? '#fff' : '#888',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                paddingBottom: '8px',
                borderBottom: activeFormTab === 'kuryer' ? '2px solid #fff' : 'none'
              }}
            >
              Yetkazuvchi kuryer
            </button>

            <button
              type="button"
              onClick={() => setActiveFormTab('taksi')}
              style={{
                background: 'none',
                border: 'none',
                color: activeFormTab === 'taksi' ? '#fff' : '#888',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                paddingBottom: '8px',
                borderBottom: activeFormTab === 'taksi' ? '2px solid #fff' : 'none'
              }}
            >
              Taksi haydovchisi
            </button>

            <button
              type="button"
              onClick={() => setActiveFormTab('staff')}
              style={{
                background: 'none',
                border: 'none',
                color: activeFormTab === 'staff' ? '#fff' : '#888',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                paddingBottom: '8px',
                borderBottom: activeFormTab === 'staff' ? '2px solid #fff' : 'none'
              }}
            >
              Restoran xodimlari (Ofitsiant / Oshpaz / Boshqaruv)
            </button>
          </div>

          {/* If staff tab selected, pick specific staff role */}
          {activeFormTab === 'staff' && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px', fontWeight: 600 }}>
                Lavozimi / Kasbi:
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'ofitsiant', label: 'Ofitsiant (Afitsiant)' },
                  { id: 'povar', label: 'Bosh Oshpaz (Povar)' },
                  { id: 'povar_yordamchisi', label: 'Oshpaz yordamchisi' },
                  { id: 'ish_boshqaruvchi', label: 'Ish boshqaruvchi (Menejer)' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStaffRole(st.id as EmployeeRole)}
                    style={{
                      background: staffRole === st.id ? '#FFCC00' : 'rgba(255,255,255,0.06)',
                      color: staffRole === st.id ? '#000' : '#fff',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courier Type Selector (Screenshots 1, 2, 3) */}
          {(activeFormTab === 'kuryer' || activeFormTab === 'taksi') && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '13px', color: '#bbb', marginBottom: '12px', fontWeight: 600 }}>
                Kuryer turi
              </div>

              <div
                style={{
                  background: '#1c1c1c',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  maxWidth: '360px'
                }}
              >
                {[
                  { id: 'piyoda', label: 'Piyoda kuryer', icon: <Footprints size={18} /> },
                  { id: 'avto', label: 'Avtomobildagi kuryer', icon: <Car size={18} /> },
                  { id: 'moto', label: 'Mototsikldagi kuryer', icon: <Bike size={18} /> },
                  { id: 'yuk', label: 'Yuk mashinasidagi kuryer', icon: <Truck size={18} /> }
                ].map((item) => {
                  const isSelected = courierType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCourierType(item.id as CourierType)}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: isSelected ? 'rgba(255, 204, 0, 0.08)' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600 }}>
                        <span style={{ color: isSelected ? '#FFCC00' : '#888' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>

                      {/* Yellow Check Circle */}
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? 'none' : '2px solid #555',
                          background: isSelected ? '#FFCC00' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isSelected && <CheckCircle size={20} color="#000" fill="#FFCC00" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Fields: Tafsilotlar */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Tafsilotlar</span>
                <ChevronUp size={16} />
              </div>

              {/* Grid Form */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isVehicleCourier ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '18px'
                }}
              >
                {/* Left Column: Personal info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                      Familiyasi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Familiyani kiriting"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                      Ismi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ismni kiriting"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                      Otasining ismi
                    </label>
                    <input
                      type="text"
                      placeholder="Otasining ismini kiriting"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                      Telefon raqami *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {isVehicleCourier && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                          Manzil
                        </label>
                        <input
                          type="text"
                          placeholder="Manzilni ko'rsating"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                          JSHSHIR (PINFL)
                        </label>
                        <input
                          type="text"
                          placeholder="14 xonali JSHSHIR"
                          value={jshshir}
                          onChange={(e) => setJshshir(e.target.value)}
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                          Manba
                        </label>
                        <select
                          value={trafficSource}
                          onChange={(e) => setTrafficSource(e.target.value)}
                          style={inputStyle}
                        >
                          <option value="Organik trafik">Organik trafik</option>
                          <option value="Tavsiya orqali">Tavsiya orqali</option>
                          <option value="Reklama">Reklama</option>
                          <option value="Telegram kanal">Telegram kanal</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Column: Conditions or Driver License */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                      Tavallud sanasi
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                      Ishlash sharti
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={workCondition}
                        onChange={(e) => setWorkCondition(e.target.value)}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <button
                        type="button"
                        style={{
                          background: '#333',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '10px',
                          padding: '0 12px',
                          cursor: 'pointer'
                        }}
                      >
                        <Settings size={16} />
                      </button>
                      <button
                        type="button"
                        style={{
                          background: '#333',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '10px',
                          padding: '0 12px',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* ONLY IF VEHICLE / MOTO COURIER */}
                  {isVehicleCourier && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                          Haydovchilik staji eng kamida
                        </label>
                        <input
                          type="date"
                          value={drivingExperienceDate}
                          onChange={(e) => setDrivingExperienceDate(e.target.value)}
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '12px', color: '#999' }}>HG seriyasi va raqami</label>
                          <span style={{ fontSize: '11px', color: '#60A5FA', cursor: 'pointer' }}>
                            Haydovchini tekshirish
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="AA 1234567"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                          Haydovchilik guvohnomasi berilgan mamlakat
                        </label>
                        <select
                          value={licenseCountry}
                          onChange={(e) => setLicenseCountry(e.target.value)}
                          style={inputStyle}
                        >
                          <option value="Uzbekistan">Uzbekistan</option>
                          <option value="Qozog'iston">Qozog'iston</option>
                          <option value="Rossiya">Rossiya</option>
                          <option value="Tojikiston">Tojikiston</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                            Berilgan sana
                          </label>
                          <input
                            type="date"
                            value={licenseIssueDate}
                            onChange={(e) => setLicenseIssueDate(e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                            Amal qilish muddati
                          </label>
                          <input
                            type="date"
                            value={licenseExpiryDate}
                            onChange={(e) => setLicenseExpiryDate(e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                            Avto/Moto raqami
                          </label>
                          <input
                            type="text"
                            placeholder="30 J 976 RB"
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                            Model / Rusum
                          </label>
                          <input
                            type="text"
                            placeholder="Spark / Nexia / Moto"
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                        <input
                          type="checkbox"
                          id="hearingImpaired"
                          checked={hearingImpaired}
                          onChange={(e) => setHearingImpaired(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#FFCC00' }}
                        />
                        <label htmlFor="hearingImpaired" style={{ fontSize: '13px', color: '#bbb', cursor: 'pointer' }}>
                          Yaxshi eshitmaydigan haydovchi
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Izoh Section (Screenshots 2 & 3) */}
            <div style={{ marginTop: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#bbb', marginBottom: '8px' }}>
                Izoh
              </div>
              <textarea
                placeholder="Xodim yoki haydovchi haqida qo'shimcha ma'lumot..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
            </div>

            {errorMessage && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
                {errorMessage}
              </div>
            )}

            {/* Bright Yellow Save Button */}
            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#FFCC00',
                color: '#000',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 204, 0, 0.4)'
              }}
            >
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </form>
        </div>
      )}

      {/* FILTER & SEARCH ROW */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `Barchasi (${employees.length})` },
            { id: 'kuryer', label: `Yetkazuvchi kuryerlar (${employees.filter((e) => e.role === 'kuryer').length})` },
            { id: 'ofitsiant', label: `Ofitsiantlar (${employees.filter((e) => e.role === 'ofitsiant').length})` },
            { id: 'povar', label: `Oshpazlar (${employees.filter((e) => e.role === 'povar' || e.role === 'povar_yordamchisi').length})` },
            { id: 'ish_boshqaruvchi', label: `Ish boshqaruvchilar (${employees.filter((e) => e.role === 'ish_boshqaruvchi').length})` }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setRoleFilter(flt.id)}
              style={{
                background: roleFilter === flt.id ? 'var(--primary-gradient)' : 'var(--bg-card)',
                color: roleFilter === flt.id ? '#fff' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {flt.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="F.I.O, telefon yoki raqam bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              ...inputStyle,
              paddingLeft: '38px',
              paddingTop: '8px',
              paddingBottom: '8px'
            }}
          />
        </div>
      </div>

      {/* EMPLOYEES TABLE / LIST */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 700 }}>Bajaruvchi / Xodim</th>
                <th style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 700 }}>Lavozim / Kuryer turi</th>
                <th style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 700 }}>Telefon raqami</th>
                <th style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 700 }}>Balans / Avto raqam</th>
                <th style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 700 }}>Buyurtmalar</th>
                <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 700, textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Bajaruvchilar topilmadi
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.2s'
                    }}
                  >
                    {/* Name & Avatar */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                          alt={emp.firstName}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: '#fff' }}>
                            {emp.lastName} {emp.firstName} {emp.middleName || ''}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                            {emp.workCondition || 'Standart'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role / Courier type */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background:
                            emp.role === 'kuryer'
                              ? 'rgba(255, 85, 0, 0.15)'
                              : emp.role === 'ish_boshqaruvchi'
                              ? 'rgba(112, 0, 255, 0.2)'
                              : 'rgba(255, 255, 255, 0.08)',
                          color:
                            emp.role === 'kuryer'
                              ? '#FF5500'
                              : emp.role === 'ish_boshqaruvchi'
                              ? '#A78BFA'
                              : '#fff',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textTransform: 'capitalize'
                        }}
                      >
                        {emp.role === 'kuryer'
                          ? emp.courierType === 'avto'
                            ? '🚗 Avto kuryer'
                            : emp.courierType === 'moto'
                            ? '🛵 Moto kuryer'
                            : emp.courierType === 'yuk'
                            ? '🚚 Yuk kuryer'
                            : '🚶 Piyoda kuryer'
                          : emp.role === 'ofitsiant'
                          ? '🍽️ Ofitsiant'
                          : emp.role === 'povar'
                          ? '👨‍🍳 Bosh Oshpaz'
                          : emp.role === 'povar_yordamchisi'
                          ? '🔪 Oshpaz yordamchisi'
                          : emp.role === 'ish_boshqaruvchi'
                          ? '👔 Ish boshqaruvchi'
                          : emp.role}
                      </span>
                    </td>

                    {/* Phone */}
                    <td style={{ padding: '14px 16px' }}>
                      <a
                        href={`tel:${emp.phone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#10B981',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        <Phone size={14} />
                        <span>{emp.phone}</span>
                      </a>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background:
                            emp.status === 'free'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : emp.status === 'on_order'
                              ? 'rgba(255, 184, 0, 0.2)'
                              : emp.status === 'busy'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(150, 150, 150, 0.2)',
                          color:
                            emp.status === 'free'
                              ? '#10B981'
                              : emp.status === 'on_order'
                              ? '#FFB800'
                              : emp.status === 'busy'
                              ? '#EF4444'
                              : '#aaa',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 800
                        }}
                      >
                        {emp.status === 'free'
                          ? '● Bo\'sh'
                          : emp.status === 'on_order'
                          ? '● Buyurtmada'
                          : emp.status === 'busy'
                          ? '● Band'
                          : '○ GPS yo\'q'}
                      </span>
                    </td>

                    {/* Balance & Plate */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>
                        {emp.balance.toLocaleString('ru-RU')} UZS
                      </div>
                      {emp.vehiclePlate && (
                        <div style={{ fontSize: '11px', color: '#FFCC00', fontWeight: 800 }}>
                          {emp.vehiclePlate} ({emp.vehicleModel || 'Avto'})
                        </div>
                      )}
                    </td>

                    {/* Completed orders */}
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#fff' }}>
                      {emp.completedOrdersCount} ta
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          title="Batafsil ko'rish"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            color: '#fff',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(emp.id, `${emp.lastName} ${emp.firstName}`)}
                          title="O'chirish"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: 'none',
                            color: '#EF4444',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedEmployee && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#181C2A',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={selectedEmployee.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#fff' }}>
                    {selectedEmployee.lastName} {selectedEmployee.firstName} {selectedEmployee.middleName || ''}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#FFCC00', fontWeight: 700 }}>
                    {selectedEmployee.role.toUpperCase()} • {selectedEmployee.courierType ? selectedEmployee.courierType.toUpperCase() : 'Restoran xodimi'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployee(null)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Telefon:</span>
                <a href={`tel:${selectedEmployee.phone}`} style={{ color: '#10B981', fontWeight: 700, textDecoration: 'none' }}>
                  {selectedEmployee.phone}
                </a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tavallud sanasi:</span>
                <span style={{ color: '#fff' }}>{selectedEmployee.birthDate || 'Kiritilmagan'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ishlash sharti:</span>
                <span style={{ color: '#fff' }}>{selectedEmployee.workCondition || '1,4% (Standart)'}</span>
              </div>
              {selectedEmployee.licenseNumber && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Guvohnoma (HG):</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{selectedEmployee.licenseNumber} ({selectedEmployee.licenseCountry})</span>
                </div>
              )}
              {selectedEmployee.vehiclePlate && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Transport:</span>
                  <span style={{ color: '#FFCC00', fontWeight: 700 }}>{selectedEmployee.vehiclePlate} · {selectedEmployee.vehicleModel}</span>
                </div>
              )}
              {selectedEmployee.address && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Manzil:</span>
                  <span style={{ color: '#fff' }}>{selectedEmployee.address}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Jami yetkazilgan:</span>
                <span style={{ color: '#10B981', fontWeight: 800 }}>{selectedEmployee.completedOrdersCount} ta buyurtma</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Balans / Daromad:</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 800 }}>{selectedEmployee.balance.toLocaleString('ru-RU')} UZS</span>
              </div>
              {selectedEmployee.notes && (
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Izoh: </span>
                  <span style={{ color: '#ddd' }}>{selectedEmployee.notes}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <a
                href={`tel:${selectedEmployee.phone}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#10B981',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                <Phone size={16} />
                <span>Qo'ng'iroq qilish</span>
              </a>
              <button
                onClick={() => setSelectedEmployee(null)}
                style={{
                  padding: '12px 20px',
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1a1a1a',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  color: '#fff',
  padding: '10px 14px',
  fontSize: '13px',
  outline: 'none',
  transition: 'border 0.2s'
};
