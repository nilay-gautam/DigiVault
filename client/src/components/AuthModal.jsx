import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function AuthModal({ 
  initialMode = 'login', 
  onClose, 
  onSuccess, 
  addToast 
}) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: true
  });

  const [regData, setRegData] = useState({
    fullname: '',
    email: '',
    phone: '',
    city: '',
    gender: 'Male',
    password: '',
    cpassword: '',
    terms: false
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      addToast('Please enter both email and password.', 'warning');
      return;
    }

    const isAdmin = loginData.email.toLowerCase().includes('admin');
    onSuccess({
      name: isAdmin ? 'Admin Officer' : 'John Doe',
      email: loginData.email,
      role: isAdmin ? 'admin' : 'user',
      isLoggedIn: true
    });
    addToast(`Signed in successfully as ${isAdmin ? 'Administrator' : 'User'}!`, 'success');
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regData.password !== regData.cpassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    if (!regData.terms) {
      addToast('Please accept terms & conditions to continue.', 'warning');
      return;
    }

    onSuccess({
      name: regData.fullname || 'New User',
      email: regData.email,
      role: 'user',
      isLoggedIn: true
    });
    addToast('Account created and verified! Welcome to SecureDoc.', 'success');
    onClose();
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setLoginData({
        email: 'admin@securedoc.vault',
        password: 'AdminPassword123!',
        remember: true
      });
      addToast('Populated Admin demo credentials.', 'info');
    } else {
      setLoginData({
        email: 'john.doe@example.com',
        password: 'UserSecret2026!',
        remember: true
      });
      addToast('Populated User demo credentials.', 'info');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: mode === 'register' ? '580px' : '460px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Tab switch header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
            {mode === 'login' ? 'Access Your Vault' : 'Create Secure Account'}
          </h2>
          <p style={{ fontSize: '0.9rem' }}>
            {mode === 'login' 
              ? 'Enter your encrypted credentials to decrypt your documents.' 
              : 'Join SecureDoc with enterprise-level AES-256 cloud protection.'}
          </p>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-glass)', padding: '0.35rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', border: '1px solid var(--border-glass)' }}>
          <button
            className={`btn btn-sm ${mode === 'login' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`btn btn-sm ${mode === 'register' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {/* Fast Demo Autofill Helper */}
        {mode === 'login' && (
          <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px dashed rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} /> Quick Demo Autofill:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="button" className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }} onClick={() => fillDemo('user')}>
                User
              </button>
              <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }} onClick={() => fillDemo('admin')}>
                Admin
              </button>
            </div>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com" 
                  className="form-input"
                  style={{ paddingLeft: '2.6rem' }}
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Vault Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••" 
                  className="form-input"
                  style={{ paddingLeft: '2.6rem' }}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input 
                  type="checkbox" 
                  checked={loginData.remember} 
                  onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })} 
                />
                Remember this device
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); addToast('Password reset link sent to registered email.', 'info'); }} style={{ color: 'var(--primary-light)' }}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ width: '100%', padding: '0.85rem' }}>
              <span>Unlock Vault</span>
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe" 
                  className="form-input"
                  value={regData.fullname}
                  onChange={(e) => setRegData({ ...regData, fullname: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com" 
                  className="form-input"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 98765 43210" 
                  className="form-input"
                  value={regData.phone}
                  onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input 
                  type="text" 
                  required
                  placeholder="Mumbai" 
                  className="form-input"
                  value={regData.city}
                  onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Min 6 characters" 
                  className="form-input"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Repeat password" 
                  className="form-input"
                  value={regData.cpassword}
                  onChange={(e) => setRegData({ ...regData, cpassword: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Gender</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                  <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="regGender" 
                      checked={regData.gender === g}
                      onChange={() => setRegData({ ...regData, gender: g })}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <input 
                  type="checkbox" 
                  required
                  checked={regData.terms}
                  onChange={(e) => setRegData({ ...regData, terms: e.target.checked })}
                  style={{ marginTop: '0.2rem' }}
                />
                <span>I agree to the Digital Locker Terms of Service, AES-256 Storage Governance, and Privacy Policy.</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ width: '100%', padding: '0.85rem' }}>
              <ShieldCheck size={18} />
              <span>Create Encrypted Vault</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
