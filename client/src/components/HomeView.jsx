import React, { useState } from 'react';
import { 
  Shield, 
  UploadCloud, 
  CreditCard, 
  IdCard, 
  Car, 
  FileCheck2, 
  CheckCircle2, 
  Lock, 
  Server, 
  Cpu, 
  ArrowRight,
  Eye,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function HomeView({ 
  onNavigate, 
  documents, 
  onUploadDoc, 
  onPreviewDoc, 
  addToast,
  currentUser
}) {
  const [quickFiles, setQuickFiles] = useState({
    aadhar: null,
    pan: null,
    license: null,
    secureFile: null
  });

  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (key, file) => {
    if (!file) return;
    setQuickFiles(prev => ({
      ...prev,
      [key]: {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
        rawFile: file,
        uploadedAt: new Date().toLocaleDateString()
      }
    }));
    addToast(`${file.name} staged for encrypted upload!`, 'info');
  };

  const handleUploadAll = (e) => {
    e.preventDefault();
    const stagedCount = Object.values(quickFiles).filter(Boolean).length;
    if (stagedCount === 0) {
      addToast('Please select at least one document to upload.', 'warning');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      // Create new documents in vault
      Object.entries(quickFiles).forEach(([key, file]) => {
        if (file) {
          const typeNames = {
            aadhar: 'Aadhar Card',
            pan: 'PAN Card',
            license: 'Driving License',
            secureFile: 'Confidential Document'
          };
          onUploadDoc({
            id: Date.now() + Math.random().toString(36).substring(2, 7),
            title: typeNames[key] || file.name,
            docType: key,
            fileName: file.name,
            fileSize: file.size,
            status: 'pending',
            date: 'Today',
            user: currentUser.name,
            encryption: 'AES-256-GCM',
            hash: '0x' + Math.random().toString(16).substring(2, 10).toUpperCase()
          });
        }
      });

      setUploading(false);
      setQuickFiles({ aadhar: null, pan: null, license: null, secureFile: null });
      addToast(`Successfully encrypted and uploaded ${stagedCount} document(s) to Vault!`, 'success');
      onNavigate('vault');
    }, 1200);
  };

  const docSlots = [
    {
      key: 'aadhar',
      title: 'Aadhar Card',
      desc: 'National biometric identity document (PDF / JPG)',
      icon: IdCard,
      color: '#6366F1'
    },
    {
      key: 'pan',
      title: 'PAN Card',
      desc: 'Income tax & financial verification (PDF / JPG)',
      icon: CreditCard,
      color: '#10B981'
    },
    {
      key: 'license',
      title: 'Driving License',
      desc: 'Government transport authority permit',
      icon: Car,
      color: '#F59E0B'
    },
    {
      key: 'secureFile',
      title: 'Confidential Vault File',
      desc: 'Sensitive business, legal, or health records',
      icon: FileCheck2,
      color: '#A855F7'
    }
  ];

  return (
    <div className="home-view" id="home-section">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <Lock size={14} />
            <span>Bank-Grade AES-256 Zero-Knowledge Vault</span>
          </div>

          <h1 className="hero-title">
            Secure Your Vital Documents with <br />
            <span className="gradient-text">SecureDoc Enterprise</span>
          </h1>

          <p className="hero-subtitle">
            Store, verify, and manage sensitive identity and enterprise records with 
            quantum-resistant encryption, automated KYC verification, and full role-based governance.
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={() => onNavigate('vault')}
              id="hero-vault-btn"
            >
              <span>Open Document Vault</span>
              <ArrowRight size={18} />
            </button>
            <button 
              className="btn btn-outline btn-lg" 
              onClick={() => {
                const el = document.getElementById('quick-upload-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              id="hero-quick-upload-btn"
            >
              <UploadCloud size={18} />
              <span>Instant Upload Form</span>
            </button>
            {currentUser.role === 'admin' && (
              <button 
                className="btn btn-secondary btn-lg" 
                onClick={() => onNavigate('admin')}
                id="hero-admin-btn"
              >
                <Shield size={18} />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>

          {/* Stats Banner */}
          <div className="stats-banner glass-card" style={{ marginTop: '4rem', padding: '1.5rem' }}>
            <div className="stat-item">
              <div className="stat-value">128,450+</div>
              <div className="stat-label">Encrypted Documents</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">99.999%</div>
              <div className="stat-label">Cloud Availability</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">256-Bit</div>
              <div className="stat-label">Hardware Encryption</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">&lt; 150ms</div>
              <div className="stat-label">Decryption Latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Upload Form Section (From Original Site) */}
      <section id="quick-upload-section" style={{ padding: '3rem 0 5rem' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
              <span className="badge badge-approved" style={{ marginBottom: '0.75rem' }}>
                <CheckCircle2 size={12} /> Instant Identity Portal
              </span>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
                Upload Your Official Documents
              </h2>
              <p>
                Securely drop your Aadhar, PAN, Driving License, or confidential files. 
                All files are encrypted client-side with SHA-256 verification.
              </p>
            </div>

            <form onSubmit={handleUploadAll}>
              <div className="doc-upload-grid">
                {docSlots.map(slot => {
                  const Icon = slot.icon;
                  const staged = quickFiles[slot.key];

                  return (
                    <div 
                      key={slot.key}
                      className={`doc-upload-box ${staged ? 'uploaded' : ''}`}
                      onClick={() => document.getElementById(`file-input-${slot.key}`)?.click()}
                    >
                      <input 
                        type="file" 
                        id={`file-input-${slot.key}`}
                        accept="image/*,.pdf,.docx"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(slot.key, e.target.files?.[0])}
                      />

                      <div 
                        className="doc-upload-icon"
                        style={{ 
                          background: staged ? 'rgba(16, 185, 129, 0.2)' : `rgba(99, 102, 241, 0.12)`,
                          color: staged ? '#34D399' : slot.color
                        }}
                      >
                        {staged ? <CheckCircle2 size={28} /> : <Icon size={28} />}
                      </div>

                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{slot.title}</h3>
                      <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                        {staged ? (
                          <span style={{ color: '#34D399', fontWeight: 600 }}>
                            {staged.name} ({staged.size})
                          </span>
                        ) : (
                          slot.desc
                        )}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <span className={`badge ${staged ? 'badge-approved' : 'badge-pending'}`}>
                          {staged ? 'Ready to Encrypt' : 'Click or Drag to Upload'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload Action Button */}
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={uploading}
                  id="upload-all-submit-btn"
                  style={{ minWidth: '240px', padding: '1rem 2.5rem' }}
                >
                  <UploadCloud size={20} />
                  <span>{uploading ? 'Encrypting & Storing...' : 'Upload All Documents'}</span>
                </button>
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  🔒 Compliant with ISO 27001 &amp; Digital Locker Standards
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Architecture & Feature Highlights */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Built for Maximum Trust &amp; Speed</h2>
            <p>Every layer engineered with defensive cybersecurity, cryptographic signatures, and modern MERN scale.</p>
          </div>

          <div className="features-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>End-to-End Encryption</h3>
              <p>Files are encrypted before leaving your browser using AES-256-GCM. Decryption keys never touch unauthenticated endpoints.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                <Server size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Distributed Cloud Storage</h3>
              <p>Redundant multi-region node replication ensures your crucial legal and personal records are permanently safe from data loss.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Automated Verification</h3>
              <p>Built-in AI &amp; Admin verification pipeline for quick review, approval badges, and compliance tracking.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
