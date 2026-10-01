import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Key, 
  FileText, 
  Save, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Smartphone, 
  Laptop, 
  Lock, 
  HardDrive,
  AlertCircle
} from 'lucide-react';

export default function ProfileView({ 
  currentUser, 
  setCurrentUser, 
  documents, 
  addToast 
}) {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser.name || 'John Doe',
    email: currentUser.email || 'john.doe@example.com',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    gender: 'Male',
    memberSince: 'March 15, 2024'
  });

  const [passData, setPassData] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email
    }));
    setIsEditing(false);
    addToast('Profile details updated successfully!', 'success');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!passData.current || !passData.newPass) {
      addToast('Please fill all password fields.', 'warning');
      return;
    }
    if (passData.newPass !== passData.confirmPass) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (passData.newPass.length < 6) {
      addToast('New password must be at least 6 characters long.', 'warning');
      return;
    }

    addToast('Password changed successfully! Session credentials renewed.', 'success');
    setPassData({ current: '', newPass: '', confirmPass: '' });
  };

  return (
    <div className="profile-view container" style={{ padding: '3.5rem 1.5rem 5rem' }} id="profile-section">
      <div className="glass-card" style={{ maxWidth: '980px', margin: '0 auto', padding: '2.5rem' }}>
        {/* User Hero Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '2rem' }}>
          <div style={{ 
            width: '90px', 
            height: '90px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontSize: '2.2rem', 
            fontWeight: 800,
            boxShadow: '0 0 25px var(--primary-glow)'
          }}>
            {formData.name.charAt(0)}
          </div>

          <div style={{ flex: '1', minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '2rem' }}>{formData.name}</h1>
              <span className="badge badge-verified">
                <ShieldCheck size={13} /> Verified Account
              </span>
              <span className="badge badge-role-user">
                {currentUser.role === 'admin' ? '🛡️ Administrator' : '👤 Standard Citizen'}
              </span>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              {formData.email} • ID: SEC-88942-IN
            </p>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
            id="tab-personal-info"
          >
            <User size={16} />
            <span>Personal Information</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
            id="tab-security-creds"
          >
            <Key size={16} />
            <span>Security &amp; Passwords</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
            id="tab-documents-status"
          >
            <FileText size={16} />
            <span>Document Status &amp; Quota</span>
          </button>
        </div>

        {/* Tab 1: Personal Info */}
        {activeTab === 'personal' && (
          <div>
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Legal Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Registered Email</label>
                  <input 
                    type="email" 
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City / Jurisdiction</label>
                  <input 
                    type="text" 
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  {isEditing ? (
                    <select 
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      className="form-input" 
                      disabled 
                      value={formData.gender} 
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Member Since</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    disabled 
                    value={formData.memberSince} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {isEditing ? (
                  <>
                    <button type="submit" className="btn btn-secondary">
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                    id="edit-profile-btn"
                  >
                    <Edit3 size={16} />
                    <span>Edit Profile Details</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Security & Credentials */}
        {activeTab === 'security' && (
          <div>
            {/* 2FA Toggle */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                  Two-Factor Authentication (2FA)
                </div>
                <p style={{ fontSize: '0.85rem' }}>
                  Adds a mandatory cryptographic confirmation step to all file downloads and password resets.
                </p>
              </div>
              <button 
                className={`btn btn-sm ${twoFactorEnabled ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  addToast(twoFactorEnabled ? '2FA disabled.' : '2FA activated successfully!', 'info');
                }}
              >
                {twoFactorEnabled ? 'Active (Enabled)' : 'Disabled'}
              </button>
            </div>

            {/* Password Change Form */}
            <form onSubmit={handlePasswordUpdate} style={{ maxWidth: '520px', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Change Vault Password</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Current Master Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={passData.current}
                  onChange={(e) => setPassData({ ...passData, current: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="At least 6 characters"
                  value={passData.newPass}
                  onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Repeat new password"
                  value={passData.confirmPass}
                  onChange={(e) => setPassData({ ...passData, confirmPass: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <Lock size={16} />
                <span>Update Password</span>
              </button>
            </form>

            {/* Active Sessions */}
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Active Signed-In Devices</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Laptop size={20} style={{ color: 'var(--primary-light)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Windows 11 • Chrome 134 (Current Device)</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>IP: 103.21.244.18 • Location: Mumbai, IN</div>
                    </div>
                  </div>
                  <span className="badge badge-approved">Active Now</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Documents Status & Quota */}
        {activeTab === 'documents' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Aadhar Card</h4>
                <div style={{ color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={18} /> Verified &amp; Signed
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  UIDAI Verification Hash Verified
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>PAN Card</h4>
                <div style={{ color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={18} /> Verified &amp; Signed
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Income Tax Authority Matched
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Driving License</h4>
                <div style={{ color: '#FBBF24', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Clock size={18} /> Review Pending
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Under compliance review
                </div>
              </div>
            </div>

            {/* Storage Gauge */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <HardDrive size={24} style={{ color: 'var(--primary-light)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Total Cloud Storage</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tier: Professional 20 GB Plan</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-light)' }}>
                  12.5 / 20 GB (62.5%)
                </div>
              </div>
              <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '62.5%', height: '100%', background: 'linear-gradient(90deg, #6366F1, #34D399)', borderRadius: '5px' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
