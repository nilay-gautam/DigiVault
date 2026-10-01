import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  FileCheck2,
  Lock,
  ArrowRight
} from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import { api } from './services/api';

export default function App() {
  // Unified Authentication Session State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('digivault_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('digivault_auth_token') || null;
  });

  // Auth Form State (Common Login & Registration)
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loginIdentifier, setLoginIdentifier] = useState('Nilay');
  const [loginPassword, setLoginPassword] = useState('123');

  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync Auth Storage
  useEffect(() => {
    if (currentUser && authToken) {
      localStorage.setItem('digivault_auth_user', JSON.stringify(currentUser));
      localStorage.setItem('digivault_auth_token', authToken);
    } else {
      localStorage.removeItem('digivault_auth_user');
      localStorage.removeItem('digivault_auth_token');
    }
  }, [currentUser, authToken]);

  // Common Login Handler (Automatically detects Admin vs User role from credentials)
  const handleCommonLogin = async (e) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      addToast('Please enter both username/email and password.', 'warning');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await api.login(loginIdentifier, loginPassword);
      setCurrentUser(res.user);
      setAuthToken(res.token);

      if (res.user.role === 'ADMIN') {
        addToast(`Login → Admin Dashboard. Welcome, Administrator ${res.user.username}!`, 'success');
      } else {
        addToast(`Login → User Dashboard. Welcome, ${res.user.username}!`, 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  // User Registration Handler (Automatically assigned role "USER")
  const handleUserRegister = async (e) => {
    e.preventDefault();
    if (!regUsername || !regPassword) {
      addToast('Username and password are required.', 'warning');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    if (regPassword.length < 3) {
      addToast('Password must be at least 3 characters long.', 'warning');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await api.register(regUsername, regPassword, regConfirmPassword);
      setCurrentUser(res.user);
      setAuthToken(res.token);
      addToast(`Account '${res.user.username}' created! Assigned ROLE = USER. Welcome to your User Dashboard!`, 'success');
      
      setRegUsername('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    const roleName = currentUser ? (currentUser.role === 'ADMIN' ? 'Administrator' : currentUser.username) : 'User';
    setCurrentUser(null);
    setAuthToken(null);
    addToast(`${roleName} logged out successfully.`, 'info');
  };

  // Demo autofill shortcut
  const fillCredentials = (identifier, pass) => {
    setLoginIdentifier(identifier);
    setLoginPassword(pass);
    addToast(`Populated credentials for '${identifier}'`, 'info');
  };

  return (
    <div className="app-container">
      {/* Top Application Header */}
      <header className="top-header">
        <div className="header-inner">
          {/* Logo / Brand */}
          <div className="brand-wrapper">
            <div className="brand-emblem">
              <FileCheck2 size={24} />
            </div>
            <div>
              <div className="brand-title">
                Digi<span>Vault</span>
              </div>
              <div className="brand-subtitle">
                Secure Document Management System
              </div>
            </div>
          </div>

          {/* User Account / Role Badge */}
          <div className="user-info-bar">
            {currentUser ? (
              <div className="user-badge">
                <div 
                  className="user-badge-avatar"
                  style={{ 
                    background: currentUser.role === 'ADMIN' ? '#B45309' : 'var(--primary-blue)' 
                  }}
                >
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {currentUser.username}
                  </div>
                  <span className={`user-badge-role ${currentUser.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
                    {currentUser.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text-muted)', 
                    marginLeft: '0.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Lock size={14} />
                <span>Secure Vault Portal</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN APPLICATION VIEW */}
      {!currentUser || !authToken ? (
        /* 1. SINGLE COMMON LOGIN & REGISTRATION SYSTEM */
        <div className="auth-wrapper">
          <div className="auth-card">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="brand-emblem" style={{ margin: '0 auto 1rem', width: '52px', height: '52px' }}>
                <FileCheck2 size={28} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-dark)' }}>
                Secure Document Vault
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Unified access portal for Administrators and Standard Users
              </p>
            </div>

            {/* Switch tabs: Sign In vs Create Account */}
            <div className="auth-switch-tabs">
              <button 
                type="button" 
                className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button 
                type="button" 
                className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Create Account
              </button>
            </div>

            {authMode === 'login' ? (
              /* COMMON SIGN IN FORM */
              <div>
                {/* Demo Account Quick Shortcuts */}
                <div className="demo-shortcut-bar">
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                    Demo Credentials:
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D' }}
                      onClick={() => fillCredentials('Nilay', '123')}
                    >
                      Nilay (Admin)
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => fillCredentials('Sidd', '123')}
                    >
                      Sidd (User)
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => fillCredentials('Harsh', '123')}
                    >
                      Harsh (User)
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCommonLogin}>
                  <div className="form-group">
                    <label className="form-label">Email or Username / User ID</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Nilay or Sidd"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="••••••"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    disabled={authLoading}
                  >
                    <span>{authLoading ? 'Verifying Account...' : 'Sign In to Vault'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>

                <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  The system automatically identifies your role (Admin or User) upon authentication.
                </div>
              </div>
            ) : (
              /* USER REGISTRATION FORM */
              <form onSubmit={handleUserRegister}>
                <div className="form-group">
                  <label className="form-label">Custom User ID / Username</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. RahulKumar"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Custom Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Min 3 characters"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Confirm your password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={authLoading}
                >
                  <span>{authLoading ? 'Registering Account...' : 'Register User Account'}</span>
                </button>

                <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  New accounts automatically receive role <strong>USER</strong> and immediately appear in the Admin user list.
                </div>
              </form>
            )}
          </div>
        </div>
      ) : currentUser.role === 'ADMIN' ? (
        /* 2. ADMIN DASHBOARD */
        <AdminPanel 
          adminUser={currentUser}
          adminToken={authToken}
          onLogout={handleLogout}
          addToast={addToast}
        />
      ) : (
        /* 3. USER DASHBOARD */
        <UserPanel 
          currentUser={currentUser}
          userToken={authToken}
          onLogout={handleLogout}
          addToast={addToast}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-bar">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            {t.type === 'success' && <CheckCircle size={17} style={{ color: 'var(--status-success)' }} />}
            {t.type === 'error' && <AlertCircle size={17} style={{ color: 'var(--status-danger)' }} />}
            {t.type === 'info' && <Info size={17} style={{ color: 'var(--primary-blue)' }} />}
            <span style={{ flex: 1 }}>{t.message}</span>
            <button 
              onClick={() => removeToast(t.id)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
