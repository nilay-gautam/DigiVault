import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Cloud, 
  RefreshCw, 
  FolderTree, 
  Share2, 
  TrendingUp, 
  History, 
  Leaf, 
  CheckCircle2, 
  ChevronDown, 
  ArrowRight,
  Database,
  Cpu,
  Server
} from 'lucide-react';

export default function AboutView({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(0);

  const pillars = [
    {
      icon: Shield,
      title: 'Military-Grade Encryption',
      desc: 'All stored documents are processed through AES-256-GCM cipher with unique cryptographic salts per file.',
      color: '#6366F1'
    },
    {
      icon: Cloud,
      title: 'Seamless Cloud Integration',
      desc: 'Access your encrypted identity vault on any browser, mobile device, or API client without local sync bottlenecks.',
      color: '#06B6D4'
    },
    {
      icon: RefreshCw,
      title: 'Automated Snapshot Backups',
      desc: 'Continuous point-in-time backups across triple-redundant data centers guarantee zero accidental data loss.',
      color: '#10B981'
    },
    {
      icon: FolderTree,
      title: 'Smart Categorization',
      desc: 'Automatic taxonomy indexing for Aadhar, PAN, Driving Licenses, tax filings, passports, and business agreements.',
      color: '#F59E0B'
    },
    {
      icon: Share2,
      title: 'Time-Limited Secure Sharing',
      desc: 'Generate cryptographic expiring links with password-gated access for one-time document verification.',
      color: '#A855F7'
    },
    {
      icon: TrendingUp,
      title: 'Elastic Storage Expansion',
      desc: 'Scale from personal storage up to enterprise multi-terabyte institutional vaults without system downtime.',
      color: '#EC4899'
    },
    {
      icon: History,
      title: 'Immutable Version Audit',
      desc: 'Every file edit, inspection, approval, or download is logged with an irreversible SHA-256 cryptographic audit trail.',
      color: '#3B82F6'
    },
    {
      icon: Leaf,
      title: '100% Paperless & Green',
      desc: 'Eliminate physical paper archiving, reduce corporate carbon footprints, and switch to digital sovereign storage.',
      color: '#10B981'
    }
  ];

  const faqs = [
    {
      q: 'How does SecureDoc protect sensitive documents like Aadhar and PAN cards?',
      a: 'We implement zero-knowledge client-side encryption combined with AES-256 server storage. Even if someone inspects raw database blocks, all records are unreadable without your private authentication credentials.'
    },
    {
      q: 'What is the role of the Admin Console?',
      a: 'The Admin Console allows compliance officers and document verification teams to review submitted KYC documents, approve or reject them with audit notes, monitor storage limits, and govern user accounts.'
    },
    {
      q: 'How does the MERN Stack power this application?',
      a: 'MongoDB provides scalable document storage schemas; Express.js and Node.js manage high-throughput REST APIs and cryptographic hashing; React delivers a blazing fast, responsive user interface with instant live state.'
    },
    {
      q: 'Can I download and export my files at any time?',
      a: 'Yes. You maintain sovereign ownership of your data. You can download, preview, or delete any uploaded file at any time with one click.'
    }
  ];

  return (
    <div className="about-view" id="about-section">
      {/* Header Banner */}
      <section style={{ padding: '4.5rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <div className="hero-pill">
            <Shield size={14} />
            <span>Architecture &amp; Trust Blueprint</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>
            Built for Extreme Confidentiality &amp; Sovereign Control
          </h1>
          <p style={{ maxWidth: '680px', margin: '0 auto 2.5rem', fontSize: '1.15rem' }}>
            SecureDoc was designed to eliminate vulnerable paper storage and insecure email attachments, 
            giving individuals and institutions a fortified digital safe.
          </p>
        </div>
      </section>

      {/* Security Architecture Grid */}
      <section style={{ padding: '1rem 0 4rem' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '3rem 2.5rem', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
              Multi-Layer Defensive Security Pipeline
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Cpu size={20} style={{ color: 'var(--primary-light)' }} />
                  <h3 style={{ fontSize: '1.2rem' }}>1. Client Pre-Processing</h3>
                </div>
                <p style={{ fontSize: '0.9rem' }}>
                  Files are sanitized, mime-verified, and stamped with a local SHA-256 fingerprint before dispatch.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Lock size={20} style={{ color: '#34D399' }} />
                  <h3 style={{ fontSize: '1.2rem' }}>2. AES-256 Envelope</h3>
                </div>
                <p style={{ fontSize: '0.9rem' }}>
                  Payloads are wrapped in AES-256-GCM encryption with Galois/Counter Mode authentication tags to prevent tampering.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid var(--accent-purple)', paddingLeft: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Database size={20} style={{ color: '#C084FC' }} />
                  <h3 style={{ fontSize: '1.2rem' }}>3. MongoDB Vault Clustered</h3>
                </div>
                <p style={{ fontSize: '0.9rem' }}>
                  Metadata and document records persist across encrypted collections with role-guarded schema indexes.
                </p>
              </div>
            </div>
          </div>

          {/* 8 Feature Pillars */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Why Choose SecureDoc?</h2>
            <p>Eight core pillars that make our storage engine the benchmark in confidential file handling.</p>
          </div>

          <div className="features-grid">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="glass-card feature-card">
                  <div className="feature-icon-wrap" style={{ background: `${p.color}22`, color: p.color }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.92rem' }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="glass-card" 
                style={{ padding: '1.5rem', cursor: 'pointer' }}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease' 
                    }} 
                  />
                </div>
                {openFaq === i && (
                  <p style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.95rem' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="glass-card" style={{ marginTop: '4rem', padding: '3rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Ready to Protect Your Identity &amp; Documents?</h2>
            <p style={{ marginBottom: '2rem' }}>Join the next-generation MERN encrypted document revolution today.</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('vault')}
            >
              <span>Explore Your Vault</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
