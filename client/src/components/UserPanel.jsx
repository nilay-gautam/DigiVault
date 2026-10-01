import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Clock, 
  User, 
  Shield, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  LogOut,
  Calendar,
  Hash,
  Eye,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function UserPanel({ currentUser, userToken, onLogin, onLogout, addToast }) {
  const [userSection, setUserSection] = useState('documents'); // 'documents', 'upload', 'history', 'profile'
  
  // Auth Form State (Login / Register)
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loginUsername, setLoginUsername] = useState('Sidd');
  const [loginPassword, setLoginPassword] = useState('123');

  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // User Documents State
  const [documents, setDocuments] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    name: '',
    docType: 'Aadhaar Card',
    description: '',
    docDate: new Date().toISOString().split('T')[0],
    docNumber: '',
    file: null
  });

  // Fetch Documents
  const loadUserDocuments = async () => {
    if (!userToken) return;
    setLoading(true);
    try {
      const docs = await api.getUserDocuments(userToken);
      setDocuments(docs);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch History
  const loadUserHistory = async () => {
    if (!userToken) return;
    try {
      const logs = await api.getUserHistory(userToken);
      setActivityLogs(logs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userToken) {
      loadUserDocuments();
      loadUserHistory();
    }
  }, [userToken]);

  // Handle User Login
  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(loginUsername, loginPassword);
      if (res.user.role !== 'USER') {
        addToast('This account is an Administrator. Please use the Admin Panel.', 'warning');
        return;
      }
      onLogin(res.user, res.token);
      addToast(`Welcome back, ${res.user.username}!`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Handle New User Registration
  const handleUserRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    try {
      const res = await api.register(regUsername, regPassword, regConfirmPassword);
      onLogin(res.user, res.token);
      addToast(`Account '${res.user.username}' created! Role: USER assigned.`, 'success');
      setRegUsername('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Quick Demo Account Helpers
  const fillDemoUser = (name) => {
    setLoginUsername(name);
    setLoginPassword('123');
    addToast(`Filled demo account for ${name}`, 'info');
  };

  // Handle Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.name) {
      addToast('Document Name is required.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('name', uploadForm.name);
    formData.append('docType', uploadForm.docType);
    formData.append('description', uploadForm.description);
    formData.append('docDate', uploadForm.docDate);
    formData.append('docNumber', uploadForm.docNumber);
    if (uploadForm.file) {
      formData.append('file', uploadForm.file);
    }

    try {
      setLoading(true);
      const res = await api.uploadDocument(formData, userToken);
      addToast(`Document '${res.document.name}' uploaded successfully!`, 'success');
      // Reset form and refresh list
      setUploadForm({
        name: '',
        docType: 'Aadhaar Card',
        description: '',
        docDate: new Date().toISOString().split('T')[0],
        docNumber: '',
        file: null
      });
      await loadUserDocuments();
      await loadUserHistory();
      setUserSection('documents');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Download (strictly retrieves actual stored original file bytes from backend)
  const handleDownload = async (doc) => {
    try {
      addToast(`Initiating download for '${doc.name}'...`, 'info');
      const { blob, filename } = await api.downloadDocument(doc.id, userToken);
      
      const downloadName = filename || doc.fileName || `${doc.name}.pdf`;
      const url = window.URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      element.download = downloadName;
      document.body.appendChild(element);
      element.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(element);

      addToast(`Downloaded '${downloadName}' successfully!`, 'success');

      // Refresh documents and logs to reflect updated download counts
      await loadUserDocuments();
      await loadUserHistory();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Handle Delete
  const handleDelete = async (docId, docName) => {
    if (!window.confirm(`Are you sure you want to permanently delete '${docName}' from your secure locker?`)) {
      return;
    }
    try {
      await api.deleteDocument(docId, userToken);
      addToast(`'${docName}' was deleted.`, 'info');
      await loadUserDocuments();
      await loadUserHistory();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Filter and search user's documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.docNumber && doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedType === 'All') return matchesSearch;
    return matchesSearch && doc.docType === selectedType;
  });

  const totalUserDownloads = documents.reduce((acc, d) => acc + (d.downloads || 0), 0);

  // If user is not logged in, render the User Login / Register Panel
  if (!currentUser || currentUser.role !== 'USER') {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="brand-emblem" style={{ margin: '0 auto 1rem', width: '50px', height: '50px' }}>
              <User size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-dark)' }}>
              User Document Portal
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Access, upload, and manage your private personal documents
            </p>
          </div>

          {/* Switch tabs: Sign In vs Register */}
          <div className="auth-switch-tabs">
            <button 
              type="button" 
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              User Sign In
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
            <div>
              {/* Existing Demo Account Shortcuts */}
              <div className="demo-shortcut-bar">
                <span style={{ fontSize: '0.78rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                  Demo Accounts:
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm"
                    onClick={() => fillDemoUser('Sidd')}
                  >
                    Sidd (123)
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm"
                    onClick={() => fillDemoUser('Harsh')}
                  >
                    Harsh (123)
                  </button>
                </div>
              </div>

              <form onSubmit={handleUserLogin}>
                <div className="form-group">
                  <label className="form-label">Username / User ID</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter your username"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
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

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <span>Log In to User Dashboard</span>
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleUserRegister}>
              <div className="form-group">
                <label className="form-label">Custom Username / User ID</label>
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
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Create your password"
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <span>Register User Account</span>
              </button>

              <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Your account will automatically be created with role <strong>USER</strong> and reflected in the Admin dashboard.
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Logged-in User Dashboard
  return (
    <div className="layout-body" id="user-panel-container">
      {/* User Sidebar Navigation */}
      <aside className="app-sidebar">
        <div>
          <div style={{ padding: '0.5rem 0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              User Locker
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-dark)', marginTop: '0.15rem' }}>
              {currentUser.username}
            </div>
          </div>

          <ul className="sidebar-nav">
            <li>
              <button 
                className={`nav-link-btn ${userSection === 'documents' ? 'active' : ''}`}
                onClick={() => setUserSection('documents')}
              >
                <FileText size={18} />
                <span>My Documents</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${userSection === 'upload' ? 'active' : ''}`}
                onClick={() => setUserSection('upload')}
              >
                <UploadCloud size={18} />
                <span>Upload Document</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${userSection === 'history' ? 'active' : ''}`}
                onClick={() => setUserSection('history')}
              >
                <Clock size={18} />
                <span>Activity History</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${userSection === 'profile' ? 'active' : ''}`}
                onClick={() => setUserSection('profile')}
              >
                <User size={18} />
                <span>My Account</span>
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
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main User Content */}
      <main className="main-content-panel">
        {/* User Summary Metric Cards */}
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ background: '#EFF6FF', color: 'var(--primary-blue)' }}>
              <FileText size={26} />
            </div>
            <div>
              <div className="metric-number">{documents.length}</div>
              <div className="metric-label">My Uploaded Documents</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ background: '#F0F9FF', color: 'var(--accent-blue)' }}>
              <Download size={26} />
            </div>
            <div>
              <div className="metric-number">{totalUserDownloads}</div>
              <div className="metric-label">My Total Downloads</div>
            </div>
          </div>
        </div>

        {/* SECTION 1: MY DOCUMENTS */}
        {userSection === 'documents' && (
          <div className="white-card">
            <div className="card-header-bar">
              <div>
                <h3 className="card-title">My Secure Documents</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Strictly your personal documents. Other users and administrators cannot view your files.
                </p>
              </div>

              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setUserSection('upload')}
              >
                <Plus size={16} />
                <span>Upload New Document</span>
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="search-box-wrapper">
                <Search size={16} className="search-icon-pos" />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search by name, number, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} style={{ color: 'var(--text-muted)' }} />
                <select 
                  className="form-select" 
                  style={{ width: 'auto', padding: '0.55rem 1rem' }}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All Document Types</option>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Educational Certificate">Educational Certificate</option>
                  <option value="Passport">Passport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button 
                className="btn btn-outline btn-sm"
                onClick={loadUserDocuments}
                title="Refresh Documents"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Document Table */}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Document Number</th>
                    <th>Date / Uploaded</th>
                    <th>Downloads</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map(doc => (
                      <tr key={doc.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{doc.name}</div>
                          {doc.description && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doc.description}</div>
                          )}
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                            File: {doc.fileName} ({doc.fileSize})
                          </div>
                        </td>
                        <td>
                          <span className={`doc-badge ${
                            doc.docType === 'Aadhaar Card' ? 'doc-badge-aadhaar' :
                            doc.docType === 'PAN Card' ? 'doc-badge-pan' :
                            doc.docType === 'Driving License' ? 'doc-badge-license' :
                            doc.docType === 'Educational Certificate' ? 'doc-badge-edu' : ''
                          }`}>
                            {doc.docType}
                          </span>
                        </td>
                        <td>
                          <code style={{ fontSize: '0.85rem', background: '#F1F5F9', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>
                            {doc.docNumber || '—'}
                          </code>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          <div>{doc.docDate}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--accent-blue)', fontSize: '0.88rem' }}>
                            {doc.downloads} times
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => handleDownload(doc)}
                              title="Download your document"
                            >
                              <Download size={14} />
                              <span>Download</span>
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(doc.id, doc.name)}
                              title="Delete document"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          <FileText size={40} style={{ opacity: 0.3 }} />
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No documents found</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {searchQuery ? 'Try resetting search filters.' : 'You have not uploaded any documents to your locker yet.'}
                        </p>
                        <button 
                          className="btn btn-primary btn-sm"
                          style={{ marginTop: '1rem' }}
                          onClick={() => setUserSection('upload')}
                        >
                          <Plus size={14} />
                          <span>Upload First Document</span>
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: UPLOAD DOCUMENT */}
        {userSection === 'upload' && (
          <div className="white-card" style={{ maxWidth: '720px' }}>
            <div className="card-header-bar">
              <div>
                <h3 className="card-title">Upload Document to Secure Locker</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Provide document details and upload your official file.
                </p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Document Name <span style={{ color: 'var(--status-danger)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. My Aadhaar Card, B.Tech Marksheet, Vehicle RC"
                  required
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Document Type</label>
                  <select 
                    className="form-select"
                    value={uploadForm.docType}
                    onChange={(e) => setUploadForm({ ...uploadForm, docType: e.target.value })}
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Educational Certificate">Educational Certificate</option>
                    <option value="Passport">Passport</option>
                    <option value="Vehicle RC">Vehicle RC</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Document Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    required
                    value={uploadForm.docDate}
                    onChange={(e) => setUploadForm({ ...uploadForm, docDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Optional Document Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. XXXX-XXXX-1234 or DL-0420110098"
                  value={uploadForm.docNumber}
                  onChange={(e) => setUploadForm({ ...uploadForm, docNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Remarks</label>
                <textarea 
                  className="form-textarea" 
                  rows="3"
                  placeholder="Optional brief notes or issuing authority details..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Document File</label>
                <input 
                  type="file" 
                  className="form-input" 
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Supports PDF, PNG, JPG, DOCX (Max 25 MB)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <UploadCloud size={16} />
                  <span>{loading ? 'Uploading & Encrypting...' : 'Upload & Save to Locker'}</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setUserSection('documents')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECTION 3: ACTIVITY HISTORY */}
        {userSection === 'history' && (
          <div className="white-card">
            <div className="card-header-bar">
              <div>
                <h3 className="card-title">My Upload &amp; Download History</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Personal activity history for uploads, downloads, and account events
                </p>
              </div>
              <button 
                className="btn btn-outline btn-sm"
                onClick={loadUserHistory}
              >
                <RefreshCw size={14} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.length > 0 ? (
                    activityLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td>
                          <span className="doc-badge" style={{
                            background: 
                              log.action === 'UPLOAD' ? '#ECFDF5' : 
                              log.action === 'DOWNLOAD' ? '#EFF6FF' : '#F1F5F9',
                            color:
                              log.action === 'UPLOAD' ? '#065F46' : 
                              log.action === 'DOWNLOAD' ? '#1E40AF' : '#334155'
                          }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.88rem' }}>{log.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                        No account activity recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 4: MY ACCOUNT / PROFILE */}
        {userSection === 'profile' && (
          <div className="white-card" style={{ maxWidth: '640px' }}>
            <div className="card-header-bar">
              <div>
                <h3 className="card-title">My Account Information</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Basic account details for {currentUser.username}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Username / User ID</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--navy-dark)' }}>{currentUser.username}</strong>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Account Role</span>
                <span className="user-badge-role role-user" style={{ display: 'inline-block', marginTop: '0.25rem' }}>
                  {currentUser.role}
                </span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Member Since</span>
                <strong style={{ fontSize: '0.95rem' }}>
                  {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Active Member'}
                </strong>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Total Uploaded</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-blue)' }}>
                  {documents.length} Document(s)
                </strong>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ color: 'var(--status-danger)' }}
                onClick={onLogout}
              >
                <LogOut size={16} />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
