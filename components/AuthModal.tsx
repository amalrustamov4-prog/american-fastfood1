'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, Calendar, KeyRound, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { UserProfile } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('+998 ');
  const [regBirthDate, setRegBirthDate] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regStep, setRegStep] = useState<'info' | 'code'>('info');

  // Cooldown timer state
  const [cooldown, setCooldown] = useState(0);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'code'>('email');

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const resetErrors = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // --- 1. HANDLE LOGIN ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMessage('Пожалуйста, заполните логин и пароль');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.login(loginIdentifier, loginPassword, rememberMe);
      if (res.user) {
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLE SEND CODE (REGISTER) ---
  const handleSendRegisterCode = async () => {
    resetErrors();

    if (!regFirstName.trim() || !regLastName.trim()) {
      setErrorMessage('Укажите ваше имя и фамилию');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 9) {
      setErrorMessage('Укажите корректный номер телефона');
      return;
    }
    if (!regEmail.includes('@')) {
      setErrorMessage('Укажите корректный адрес электронной почты');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.sendVerificationCode(regEmail);
      setSuccessMessage(res.message || 'Код успешно отправлен на ваш Email!');
      setCooldown(res.cooldown || 60);
      setRegStep('code');
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  // --- 3. HANDLE CONFIRM REGISTER ---
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (!regCode.trim() || regCode.trim().length !== 6) {
      setErrorMessage('Введите 6-значный код из письма');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.register({
        username: regUsername.trim() || undefined,
        firstName: regFirstName,
        lastName: regLastName,
        phone: regPhone,
        birthDate: regBirthDate,
        email: regEmail,
        password: regPassword,
        confirmPassword: regConfirmPassword,
        code: regCode.trim()
      });

      if (res.user) {
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка подтверждения регистрации');
    } finally {
      setLoading(false);
    }
  };

  // --- 4. HANDLE FORGOT PASSWORD ---
  const handleSendForgotCode = async () => {
    resetErrors();
    if (!forgotEmail.includes('@')) {
      setErrorMessage('Введите корректный адрес эл. почты');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.sendVerificationCode(forgotEmail);
      setSuccessMessage(res.message || 'Код отправлен на ваш Email!');
      setCooldown(res.cooldown || 60);
      setForgotStep('code');
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (!forgotCode.trim() || forgotCode.trim().length !== 6) {
      setErrorMessage('Введите 6-значный код из письма');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setErrorMessage('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.resetPassword({
        email: forgotEmail,
        code: forgotCode.trim(),
        newPassword: forgotNewPassword
      });

      setSuccessMessage(res.message || 'Пароль успешно изменен! Выполните вход.');
      setTimeout(() => {
        setMode('login');
        setLoginIdentifier(forgotEmail);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          background: '#121622',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Tab Selector: Login vs Register */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '24px'
          }}
        >
          <button
            onClick={() => {
              setMode('login');
              resetErrors();
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: mode === 'login' ? '#E11D48' : 'transparent',
              color: mode === 'login' ? '#FFF' : '#94A3B8',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Вход в аккаунт
          </button>
          <button
            onClick={() => {
              setMode('register');
              resetErrors();
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: mode === 'register' ? '#E11D48' : 'transparent',
              color: mode === 'register' ? '#FFF' : '#94A3B8',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Регистрация
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#FCA5A5',
              fontSize: '13px',
              marginBottom: '16px'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#6EE7B7',
              fontSize: '13px',
              marginBottom: '16px'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* -------------------- 1. LOGIN FORM -------------------- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                Email, логин или номер телефона
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="name@gmail.com или +998..."
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFF',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                Пароль
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFF',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#E11D48', cursor: 'pointer' }}
                />
                <span>Запомнить меня</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  resetErrors();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E11D48',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Забыли пароль?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #E11D48 0%, #FF5500 100%)',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '0 6px 20px rgba(225, 29, 72, 0.4)'
              }}
            >
              {loading ? 'Вход...' : 'Войти в аккаунт'}
            </button>
          </form>
        )}

        {/* -------------------- 2. REGISTER FORM -------------------- */}
        {mode === 'register' && (
          <div>
            {regStep === 'info' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Имя *
                    </label>
                    <input
                      type="text"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="Имя"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFF',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Фамилия *
                    </label>
                    <input
                      type="text"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="Фамилия"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFF',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Username field */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                    Никнейм (необязательно)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                      placeholder="например: ivan_uzb"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 32px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFF',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '3px' }}>Только a-z, 0-9 и _. Можно оставить пустым.</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Номер телефона *
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFF',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Дата рождения
                    </label>
                    <input
                      type="date"
                      value={regBirthDate}
                      onChange={(e) => setRegBirthDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFF',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                    Email (на него придёт 6-значный код) *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFF',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Пароль *
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Мин. 6 симв."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFF',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Повтор пароля *
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Повторите"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFF',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendRegisterCode}
                  disabled={loading}
                  style={{
                    marginTop: '10px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #E11D48 0%, #FF5500 100%)',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '0 6px 20px rgba(225, 29, 72, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{loading ? 'Отправка кода...' : 'Отправить код на Email'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              /* Step 2: Enter 6-digit code */
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ textAlign: 'center', margin: '8px 0' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(225, 29, 72, 0.15)',
                      color: '#E11D48',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px'
                    }}
                  >
                    <KeyRound size={24} />
                  </div>
                  <h4 style={{ color: '#FFF', fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0' }}>
                    Подтверждение Email
                  </h4>
                  <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>
                    Мы отправили 6-значный код на <strong style={{ color: '#FFF' }}>{regEmail}</strong>
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', textAlign: 'center' }}>
                    Введите 6-значный код
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid #E11D48',
                      color: '#FFF',
                      fontSize: '24px',
                      fontWeight: 900,
                      letterSpacing: '12px',
                      textAlign: 'center',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setRegStep('info')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    ← Изменить данные
                  </button>

                  <button
                    type="button"
                    disabled={cooldown > 0 || loading}
                    onClick={handleSendRegisterCode}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: cooldown > 0 ? '#64748B' : '#E11D48',
                      cursor: cooldown > 0 ? 'default' : 'pointer',
                      fontWeight: 700
                    }}
                  >
                    {cooldown > 0 ? `Повтор через ${cooldown}с` : 'Отправить код снова'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: '8px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {loading ? 'Проверка...' : 'Подтвердить и создать аккаунт'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* -------------------- 3. FORGOT PASSWORD -------------------- */}
        {mode === 'forgot' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <h3 style={{ color: '#FFF', fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0' }}>
                Восстановление пароля
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>
                Введите ваш Email, на него придет 6-значный код для смены пароля
              </p>
            </div>

            {forgotStep === 'email' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                    Email аккаунта
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendForgotCode}
                  disabled={loading}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #E11D48 0%, #FF5500 100%)',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer'
                  }}
                >
                  {loading ? 'Отправка...' : 'Отправить код восстановления'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetErrors();
                  }}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '12px', cursor: 'pointer', textAlign: 'center' }}
                >
                  Вернуться к входу
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                    6-значный код из письма
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFF',
                      fontSize: '18px',
                      fontWeight: 800,
                      textAlign: 'center',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer'
                  }}
                >
                  {loading ? 'Смена пароля...' : 'Сохранить новый пароль'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
