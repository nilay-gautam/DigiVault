import React from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Download, 
  Check, 
  XCircle, 
  Clock, 
  Hash, 
  HardDrive 
} from 'lucide-react';

export default function DocPreviewModal({ 
  document, 
  onClose, 
  onUpdateStatus, 
  currentUser, 
  addToast 
}) {
  if (!document) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
          <div className="brand-icon">
            <FileText size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>{document.title}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {document.fileName} • {document.fileSize}
            </div>
          </div>
        </div>

        {/* Visual Document Preview Card */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '2.5rem 1.5rem', 
            textAlign: 'center', 
            borderRadius: 'var(--radius-lg)', 
            marginBottom: '1.5rem',
            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)'
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary-light)' }}>
            <FileText size={36} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {document.title}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
            <ShieldCheck size={16} /> Authenticated &amp; Encrypted with {document.encryption || 'AES-256-GCM'}
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'inline-block', maxWidth: '100%', wordBreak: 'break-all' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SHA-256 Cryptographic Fingerprint
            </div>
            <code style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>
              {document.hash || '0xA98F32C0D411E87B56209'}
            </code>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', fontSize: '0.88rem' }}>
          <div className="glass-panel" style={{ padding: '0.85rem 1rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Submitted By</span>
            <strong>{document.user || 'John Doe'}</strong>
          </div>
          <div className="glass-panel" style={{ padding: '0.85rem 1rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Upload Timestamp</span>
            <strong>{document.date || 'Today'}</strong>
          </div>
          <div className="glass-panel" style={{ padding: '0.85rem 1rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Current Status</span>
            <span className={`badge ${
              document.status === 'approved' ? 'badge-approved' : 
              document.status === 'rejected' ? 'badge-rejected' : 'badge-pending'
            }`} style={{ marginTop: '0.2rem' }}>
              {document.status?.toUpperCase()}
            </span>
          </div>
          <div className="glass-panel" style={{ padding: '0.85rem 1rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Storage Payload</span>
            <strong>{document.fileSize}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button 
            className="btn btn-outline"
            onClick={() => addToast(`Downloaded copy of "${document.fileName}"!`, 'success')}
          >
            <Download size={16} />
            <span>Download Copy</span>
          </button>

          {currentUser.role === 'admin' ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  onUpdateStatus(document.id, 'approved');
                  addToast(`"${document.title}" approved!`, 'success');
                  onClose();
                }}
              >
                <Check size={16} />
                <span>Approve Document</span>
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  onUpdateStatus(document.id, 'rejected');
                  addToast(`"${document.title}" rejected.`, 'error');
                  onClose();
                }}
              >
                <XCircle size={16} />
                <span>Reject</span>
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
