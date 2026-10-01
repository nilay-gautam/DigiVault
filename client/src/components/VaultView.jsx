import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  UploadCloud, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  Plus, 
  HardDrive,
  FileCheck,
  FileSpreadsheet
} from 'lucide-react';

export default function VaultView({ 
  documents, 
  onUploadDoc, 
  onDeleteDoc, 
  onPreviewDoc, 
  addToast,
  currentUser 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDocData, setNewDocData] = useState({
    title: '',
    docType: 'identity',
    file: null
  });

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'approved') return matchesSearch && doc.status === 'approved';
    if (filterType === 'pending') return matchesSearch && doc.status === 'pending';
    if (filterType === 'identity') return matchesSearch && ['aadhar', 'pan', 'license', 'identity'].includes(doc.docType);
    return matchesSearch;
  });

  const handleManualUpload = (e) => {
    e.preventDefault();
    if (!newDocData.title || !newDocData.file) {
      addToast('Please provide a document title and choose a file.', 'warning');
      return;
    }

    const docObj = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      title: newDocData.title,
      docType: newDocData.docType,
      fileName: newDocData.file.name,
      fileSize: (newDocData.file.size / (1024 * 1024)).toFixed(2) + ' MB',
      status: 'pending',
      date: 'Today',
      user: currentUser.name,
      encryption: 'AES-256-GCM',
      hash: '0x' + Math.random().toString(16).substring(2, 10).toUpperCase()
    };

    onUploadDoc(docObj);
    addToast(`"${newDocData.title}" uploaded and encrypted successfully!`, 'success');
    setIsUploadModalOpen(false);
    setNewDocData({ title: '', docType: 'identity', file: null });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="badge badge-approved">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="badge badge-rejected">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="badge badge-pending">
            <Clock size={12} /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="vault-view container" style={{ padding: '3rem 1.5rem 5rem' }} id="vault-section">
      {/* Vault Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-role-user">Personal Encrypted Storage</span>
            <span className="badge badge-verified">
              <ShieldCheck size={12} /> Hardware Key Active
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem' }}>Document Vault</h1>
          <p>Manage, inspect, and share your bank-grade encrypted personal &amp; legal files.</p>
        </div>

        <button 
          className="btn btn-primary btn-lg"
          onClick={() => setIsUploadModalOpen(true)}
          id="vault-new-upload-btn"
        >
          <Plus size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Storage Gauge & Quick Stats */}
      <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HardDrive size={22} style={{ color: 'var(--primary-light)' }} />
            <span style={{ fontWeight: 600 }}>Vault Capacity: 4.8 GB of 20 GB used (24%)</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>15.2 GB Remaining</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: '24%', height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)', borderRadius: '4px' }}></div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem 1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search documents by title or file name..." 
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="vault-search-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'identity', 'approved', 'pending'].map(tab => (
              <button
                key={tab}
                className={`btn btn-sm ${filterType === tab ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterType(tab)}
                id={`vault-filter-${tab}`}
              >
                {tab === 'all' && 'All Documents'}
                {tab === 'identity' && 'Identity & KYC'}
                {tab === 'approved' && 'Approved (Verified)'}
                {tab === 'pending' && 'Pending Review'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document List Table */}
      <div className="glass-card table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Size</th>
              <th>Status</th>
              <th>Encryption Hash</th>
              <th>Upload Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.length > 0 ? (
              filteredDocs.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doc.fileName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{doc.docType}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {doc.fileSize}
                  </td>
                  <td>
                    {getStatusBadge(doc.status)}
                  </td>
                  <td>
                    <code style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {doc.hash || '0x4F92B1'}
                    </code>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {doc.date}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button 
                        className="btn btn-outline btn-sm" 
                        title="Preview Document Details"
                        onClick={() => onPreviewDoc(doc)}
                        id={`preview-doc-${doc.id}`}
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        className="btn btn-outline btn-sm" 
                        title="Download Encrypted File"
                        onClick={() => addToast(`Decrypted and downloaded "${doc.fileName}"!`, 'success')}
                        id={`download-doc-${doc.id}`}
                      >
                        <Download size={15} />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        title="Delete Document"
                        onClick={() => onDeleteDoc(doc.id)}
                        id={`delete-doc-${doc.id}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <FileText size={48} style={{ opacity: 0.4 }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No documents matched your criteria</h3>
                  <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                    Try searching for another keyword or upload a fresh document to this vault.
                  </p>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => { setSearchQuery(''); setFilterType('all'); }}
                  >
                    Reset Filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Upload Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div className="brand-icon">
                <UploadCloud size={20} />
              </div>
              <h2 style={{ fontSize: '1.5rem' }}>Upload New Vault File</h2>
            </div>

            <form onSubmit={handleManualUpload}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Document Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Passport Copy or Bank Statement" 
                  className="form-input"
                  required
                  value={newDocData.title}
                  onChange={(e) => setNewDocData({ ...newDocData, title: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={newDocData.docType}
                  onChange={(e) => setNewDocData({ ...newDocData, docType: e.target.value })}
                >
                  <option value="identity">Identity &amp; Citizenship (Aadhar, PAN, Passport)</option>
                  <option value="financial">Financial &amp; Tax (Bank Statements, Returns)</option>
                  <option value="legal">Legal Agreements &amp; Deeds</option>
                  <option value="medical">Medical &amp; Health Records</option>
                  <option value="other">General Confidential File</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Choose File</label>
                <div 
                  className="file-upload"
                  onClick={() => document.getElementById('manual-file-input')?.click()}
                  style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255,255,255,0.02)' }}
                >
                  <input 
                    type="file" 
                    id="manual-file-input"
                    accept="image/*,.pdf,.docx,.xlsx"
                    style={{ display: 'none' }}
                    onChange={(e) => setNewDocData({ ...newDocData, file: e.target.files?.[0] })}
                  />
                  <UploadCloud size={32} style={{ color: 'var(--primary-light)', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 600 }}>
                    {newDocData.file ? newDocData.file.name : 'Click to select or drag and drop'}
                  </div>
                  <div className="input-hint">Supports PDF, JPG, PNG, DOCX up to 50MB</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <ShieldCheck size={16} />
                  <span>Encrypt &amp; Upload</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
