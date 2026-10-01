import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  DownloadCloud, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  EyeOff
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminPanel({ adminUser, adminToken, onLogin, onLogout, addToast }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminSection, setAdminSection] = useState('users'); // 'users' or 'activity'

  // Admin login form states
  const [username, setUsername] = useState('Nilay');
  const [password, setPassword] = useState('123');

  // Load Admin Dashboard
  const loadDashboard = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const data = await api.getAdminDashboard(adminToken);
      setDashboardData(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      loadDashboard();
    }
  }, [adminToken]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(username, password);
      if (res.user.role !== 'ADMIN') {
        addToast('Access denied. Only Admin account "Nilay" can access the Admin Panel.', 'error');
        return;
      }
      onLogin(res.user, res.token);
      addToast('Welcome back, Administrator Nilay!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const fillAdminCredentials = () => {
    setUsername('Nilay');
    setPassword('123');
    addToast('Admin demo credentials populated.', 'info');
  };

  // If Admin is not logged in, render the Admin Login Panel
  if (!adminUser || adminUser.role !== 'ADMIN') {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div className="brand-emblem" style={{ margin: '0 auto 1rem', width: '50px', height: '50px' }}>
              <ShieldCheck size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-dark)' }}>
              Admin Panel Login
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Restricted portal for platform administration
            </p>
          </div>

          {/* Demo shortcut helper */}
          <div className="demo-shortcut-bar">
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
              Authorized Admin Account:
            </span>
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={fillAdminCredentials}
            >
              Fill Nilay / 123
            </button>
          </div>

          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label className="form-label">Admin Username</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter admin username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Lock size={16} />
              <span>Log In to Admin Dashboard</span>
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            🛡️ Only the single authorized account <strong>Nilay</strong> has administrative access.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-body" id="admin-panel-container">
      {/* Admin Sidebar Navigation */}
      <aside className="app-sidebar">
        <div>
          <div style={{ padding: '0.5rem 0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Administrative Portal
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-dark)', marginTop: '0.15rem' }}>
              Nilay (Admin)
            </div>
          </div>

          <ul className="sidebar-nav">
            <li>
              <button 
                className={`nav-link-btn ${adminSection === 'users' ? 'active' : ''}`}
                onClick={() => setAdminSection('users')}
              >
                <Users size={18} />
                <span>Registered Users</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${adminSection === 'activity' ? 'active' : ''}`}
                onClick={() => setAdminSection('activity')}
              >
                <Clock size={18} />
                <span>Platform Activity</span>
              </button>
            </li>
          </ul>
        </div>

        <div>
          <button 
            className="btn btn-outline" 
            style={{ width: '100%', color: 'var(--status-danger)' }}
            onClick={onLogout}
          >
            <LogOut size={16} />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="main-content-panel">
        {/* Top Privacy Restriction Notice */}
        <div className="privacy-alert-banner">
          <EyeOff size={22} style={{ color: '#1E40AF', flexShrink: 0 }} />
          <div>
            <strong>Strict Privacy Enforcement:</strong> The Administrator is not permitted to open, read, preview, or download users' actual documents or private contents. Only system-level metrics and basic account activity are visible.
          </div>
        </div>

        {/* Dynamic Metric Cards from Actual Database */}
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ background: '#EFF6FF', color: 'var(--primary-blue)' }}>
              <Users size={26} />
            </div>
            <div>
              <div className="metric-number">
                {dashboardData ? dashboardData.totalUsers : '...'}
              </div>
              <div className="metric-label">Total Registered Users</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ background: '#ECFDF5', color: 'var(--status-success)' }}>
              <FileText size={26} />
            </div>
            <div>
              <div className="metric-number">
                {dashboardData ? dashboardData.totalDocuments : '...'}
              </div>
              <div className="metric-label">Total Documents Uploaded</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ background: '#F0F9FF', color: 'var(--accent-blue)' }}>
              <DownloadCloud size={26} />
            </div>
            <div>
              <div className="metric-number">
                {dashboardData ? dashboardData.totalDownloads : '...'}
              </div>
              <div className="metric-label">Total Documents Downloaded</div>
            </div>
          </div>
        </div>

        {/* Section 1: Registered Users List */}
        {adminSection === 'users' && (
          <div className="white-card">
            <div className="card-header-bar">
              <div>
                <h3 className="card-title">List of Registered Users</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Basic account information and activity statistics derived from database
                </p>
              </div>
              <button 
                className="btn btn-outline btn-sm"
                onClick={loadDashboard}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>Refresh Data</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User ID / Username</th>
                    <th>Account Role</th>
                    <th>Creation Date</th>
                    <th>Documents Uploaded</th>
                    <th>Downloads</th>
                    <th>Basic Activity Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData && dashboardData.userList && dashboardData.userList.length > 0 ? (
                    dashboardData.userList.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{u.username}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                        </td>
                        <td>
                          <span className="user-badge-role role-user">
                            {u.role}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
                            {u.documentsCount} file(s)
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>
                            {u.downloadsCount} download(s)
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Active • {new Date(u.lastActivity).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                        No registered users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 2: Recent Platform Activity */}
        {adminSection === 'activity' && (
          <div className="white-card">
            <div className="card-header-bar">
              <div>
                <h3 className="card-title">Recent Platform Activity</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Audit log of upload, download, and registration events across the platform
                </p>
              </div>
              <button 
                className="btn btn-outline btn-sm"
                onClick={loadDashboard}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>Event Details</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData && dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map(act => (
                      <tr key={act.id}>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(act.timestamp).toLocaleString()}
                        </td>
                        <td>
                          <span className="doc-badge" style={{
                            background: 
                              act.action === 'UPLOAD' ? '#ECFDF5' : 
                              act.action === 'DOWNLOAD' ? '#EFF6FF' : 
                              act.action === 'REGISTER' ? '#FEF3C7' : '#F1F5F9',
                            color:
                              act.action === 'UPLOAD' ? '#065F46' : 
                              act.action === 'DOWNLOAD' ? '#1E40AF' : 
                              act.action === 'REGISTER' ? '#B45309' : '#334155'
                          }}>
                            {act.action}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{act.username}</td>
                        <td style={{ fontSize: '0.88rem' }}>{act.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                        No recent platform activity logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
