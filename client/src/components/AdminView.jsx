import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  HardDrive, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  ShieldAlert, 
  TrendingUp, 
  BarChart3, 
  UserPlus, 
  FileCheck 
} from 'lucide-react';

export default function AdminView({ 
  documents, 
  onUpdateDocStatus, 
  onPreviewDoc, 
  addToast 
}) {
  const [adminSection, setAdminSection] = useState('dashboard');
  const [userSearch, setUserSearch] = useState('');
  const [uploadFilter, setUploadFilter] = useState('all');

  // Simulated Registered Users state
  const [userList, setUserList] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+91 98765 43210', city: 'Mumbai', status: 'Active', role: 'user', joined: 'Jul 20' },
    { id: 2, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 91234 56789', city: 'Delhi', status: 'Active', role: 'user', joined: 'Jul 19' },
    { id: 3, name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 98712 34567', city: 'Bengaluru', status: 'Inactive', role: 'user', joined: 'Jul 18' },
    { id: 4, name: 'Admin Officer', email: 'admin@securedoc.vault', phone: '+91 99999 88888', city: 'Hyderabad', status: 'Active', role: 'admin', joined: 'Jul 01' },
    { id: 5, name: 'Rahul Verma', email: 'rahul.v@example.com', phone: '+91 97654 32109', city: 'Pune', status: 'Active', role: 'user', joined: 'Jul 21' }
  ]);

  const toggleUserStatus = (id) => {
    setUserList(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        addToast(`User ${u.name} status updated to ${nextStatus}`, 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const toggleUserRole = (id) => {
    setUserList(prev => prev.map(u => {
      if (u.id === id) {
        const nextRole = u.role === 'admin' ? 'user' : 'admin';
        addToast(`User ${u.name} role changed to ${nextRole.toUpperCase()}`, 'info');
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const deleteUser = (id, name) => {
    setUserList(prev => prev.filter(u => u.id !== id));
    addToast(`User ${name} removed from registry.`, 'warning');
  };

  const filteredUsers = userList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch)
  );

  const filteredUploads = documents.filter(doc => {
    if (uploadFilter === 'all') return true;
    return doc.status === uploadFilter;
  });

  const pendingCount = documents.filter(d => d.status === 'pending').length;
  const approvedCount = documents.filter(d => d.status === 'approved').length;
  const rejectedCount = documents.filter(d => d.status === 'rejected').length;

  return (
    <div className="admin-view container" style={{ padding: '3rem 1.5rem 5rem' }} id="admin-section">
      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-role-admin">
              <ShieldAlert size={12} /> Compliance &amp; Governance Center
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem' }}>Administrator Console</h1>
          <p>Supervise user accounts, verify identity documents, and analyze cluster health.</p>
        </div>

        {/* Section Switcher Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.35rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'User Registry', icon: Users },
            { id: 'uploads', label: 'Review Queue', icon: FileCheck },
            { id: 'reports', label: 'Reports', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`btn btn-sm ${adminSection === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setAdminSection(tab.id)}
                id={`admin-tab-${tab.id}`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: DASHBOARD OVERVIEW */}
      {adminSection === 'dashboard' && (
        <div>
          {/* Stats KPI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="glass-card stat-card">
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Total Vault Documents</h3>
              <div className="stat-number">1,248</div>
              <div style={{ fontSize: '0.8rem', color: '#34D399', marginTop: '0.25rem' }}>↑ +14.2% this week</div>
            </div>

            <div className="glass-card stat-card">
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Active Registered Users</h3>
              <div className="stat-number" style={{ color: 'var(--secondary)' }}>{userList.length + 452}</div>
              <div style={{ fontSize: '0.8rem', color: '#34D399', marginTop: '0.25rem' }}>↑ +28 new today</div>
            </div>

            <div className="glass-card stat-card">
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Storage Quota Used</h3>
              <div className="stat-number" style={{ color: 'var(--accent-purple)' }}>12.5 GB</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>62.5% of 20 GB Capacity</div>
            </div>

            <div className="glass-card stat-card">
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Pending KYC Reviews</h3>
              <div className="stat-number" style={{ color: 'var(--accent-amber)' }}>{pendingCount}</div>
              <div style={{ fontSize: '0.8rem', color: '#FBBF24', marginTop: '0.25rem' }}>Requires officer signature</div>
            </div>
          </div>

          {/* Quick Tables Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
            {/* Recent Registrations Card */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Recent Registered Users</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setAdminSection('users')}>
                  View All
                </button>
              </div>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.slice(0, 3).map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{u.phone}</td>
                        <td>
                          <span className={`badge ${u.status === 'Active' ? 'badge-approved' : 'badge-rejected'}`}>
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Storage Usage Visualizer */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Cluster Storage Health</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>MongoDB Atlas Storage Bucket</span>
                  <span style={{ fontWeight: 600 }}>12.5 / 20 GB (65%)</span>
                </div>
                <div style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #6366F1, #34D399)', borderRadius: '6px' }}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Identity Docs</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-light)' }}>7.4 GB</div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Legal &amp; Business</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34D399' }}>5.1 GB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: USERS MANAGEMENT */}
      {adminSection === 'users' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search registered users by name, email, or phone..." 
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email &amp; City</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>
                      <div>{u.email}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.city}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{u.phone}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-role-admin' : 'badge-role-user'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-approved' : 'badge-rejected'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => toggleUserRole(u.id)}
                          title="Toggle Role (User <-> Admin)"
                        >
                          {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                        </button>
                        <button 
                          className={`btn btn-sm ${u.status === 'Active' ? 'btn-outline' : 'btn-secondary'}`}
                          onClick={() => toggleUserStatus(u.id)}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteUser(u.id, u.name)}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: UPLOADS & KYC REVIEW QUEUE */}
      {adminSection === 'uploads' && (
        <div>
          {/* Review Filter Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div 
              className={`glass-card stat-card ${uploadFilter === 'all' ? 'active-border' : ''}`}
              style={{ cursor: 'pointer', padding: '1.25rem' }}
              onClick={() => setUploadFilter('all')}
            >
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>All Submissions</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{documents.length}</div>
            </div>

            <div 
              className="glass-card stat-card"
              style={{ cursor: 'pointer', padding: '1.25rem', borderColor: uploadFilter === 'pending' ? 'var(--accent-amber)' : 'transparent' }}
              onClick={() => setUploadFilter('pending')}
            >
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-amber)' }}>Pending Review</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{pendingCount}</div>
            </div>

            <div 
              className="glass-card stat-card"
              style={{ cursor: 'pointer', padding: '1.25rem', borderColor: uploadFilter === 'approved' ? 'var(--secondary)' : 'transparent' }}
              onClick={() => setUploadFilter('approved')}
            >
              <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Approved</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>{approvedCount}</div>
            </div>

            <div 
              className="glass-card stat-card"
              style={{ cursor: 'pointer', padding: '1.25rem', borderColor: uploadFilter === 'rejected' ? 'var(--accent-rose)' : 'transparent' }}
              onClick={() => setUploadFilter('rejected')}
            >
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-rose)' }}>Rejected</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{rejectedCount}</div>
            </div>
          </div>

          <div className="glass-card table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Submitter</th>
                  <th>Document Title</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th style={{ textAlign: 'right' }}>Officer Decision</th>
                </tr>
              </thead>
              <tbody>
                {filteredUploads.length > 0 ? (
                  filteredUploads.map(doc => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{doc.user || 'John Doe'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Vault Submitter</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{doc.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doc.fileName}</div>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{doc.docType}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{doc.fileSize}</td>
                      <td>
                        <span className={`badge ${
                          doc.status === 'approved' ? 'badge-approved' : 
                          doc.status === 'rejected' ? 'badge-rejected' : 'badge-pending'
                        }`}>
                          {doc.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{doc.date}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => onPreviewDoc(doc)}
                            title="Inspect Document Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              onUpdateDocStatus(doc.id, 'approved');
                              addToast(`Document "${doc.title}" verified and approved!`, 'success');
                            }}
                            title="Approve Document"
                          >
                            <Check size={14} />
                            <span>Approve</span>
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              onUpdateDocStatus(doc.id, 'rejected');
                              addToast(`Document "${doc.title}" marked as rejected.`, 'error');
                            }}
                            title="Reject Document"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                      <p>No documents found for filter "{uploadFilter}".</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: REPORTS & ANALYTICS */}
      {adminSection === 'reports' && (
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>System Audit &amp; Compliance Reports</h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <label className="form-label">Select Report Period</label>
              <input type="date" className="form-input" defaultValue="2026-10-01" />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button 
                className="btn btn-primary"
                onClick={() => addToast('Audit report generated and saved as PDF!', 'success')}
              >
                <Download size={16} />
                <span>Generate Audit Report</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>User Engagement Velocity</h3>
              <p style={{ marginBottom: '0.5rem' }}>• Weekly uploaded files: <strong>245 (+15%)</strong></p>
              <p style={{ marginBottom: '0.5rem' }}>• Average verification time: <strong>4.2 minutes</strong></p>
              <p style={{ marginBottom: '0.5rem' }}>• Rejected KYC submission rate: <strong>1.8%</strong></p>
              <p>• Total active sessions today: <strong>184 users</strong></p>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Cloud Storage Projection</h3>
              <p style={{ marginBottom: '0.5rem' }}>• Monthly net data growth: <strong>+2.1 GB</strong></p>
              <p style={{ marginBottom: '0.5rem' }}>• Cluster redundancy factor: <strong>3x replication</strong></p>
              <p style={{ marginBottom: '0.5rem' }}>• Projected capacity exhaustion: <strong>14.5 months</strong></p>
              <p>• Backup snapshot integrity: <strong>100% verified</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
