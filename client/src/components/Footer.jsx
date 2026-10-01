import React from 'react';
import { Shield, Lock, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div>
            <div className="brand-logo" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
              <div className="brand-icon">
                <Shield size={20} />
              </div>
              <div className="brand-name">
                Secure<span>Doc</span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', maxWidth: '340px', marginBottom: '1.25rem' }}>
              Next-generation MERN enterprise document vault with hardware-grade AES-256 encryption, 
              identity verification pipelines, and cloud resilience.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34D399', fontSize: '0.8rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> ISO 27001 &amp; Digital Locker Compliant
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home Page</a></li>
              <li><a href="#vault" onClick={(e) => { e.preventDefault(); onNavigate('vault'); }}>Document Vault</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Security Architecture</a></li>
              <li><a href="#profile" onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}>User Account &amp; Quota</a></li>
            </ul>
          </div>

          {/* Col 3: Compliance & KYC */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Document Types</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><a href="#vault" onClick={(e) => { e.preventDefault(); onNavigate('vault'); }}>Aadhar Card Verification</a></li>
              <li><a href="#vault" onClick={(e) => { e.preventDefault(); onNavigate('vault'); }}>PAN Card Verification</a></li>
              <li><a href="#vault" onClick={(e) => { e.preventDefault(); onNavigate('vault'); }}>Driving Licenses</a></li>
              <li><a href="#vault" onClick={(e) => { e.preventDefault(); onNavigate('vault'); }}>Confidential Enterprise Files</a></li>
            </ul>
          </div>

          {/* Col 4: Technology */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>MERN Stack</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>MongoDB Clustered Database</li>
              <li>Express.js RESTful API</li>
              <li>React 19 Interactive Client</li>
              <li>Node.js Cryptographic Engine</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} SecureDoc (My Secure Store) • All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
            <a href="#security" style={{ color: 'var(--text-muted)' }}>Security Whitepaper</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
