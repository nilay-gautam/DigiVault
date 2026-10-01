import React from 'react';
import { 
  Shield, 
  FileText, 
  User, 
  Lock, 
  Layers, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogOut, 
  LogIn, 
  UserCheck, 
  ShieldAlert 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  setCurrentUser, 
  onOpenAuth, 
  onLogout,
  theme,
  toggleTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleRole = () => {
    if (currentUser.role === 'admin') {
      setCurrentUser({
        ...currentUser,
        role: 'user',
        name: 'John Doe',
        email: 'john.doe@example.com'
      });
    } else {
      setCurrentUser({
        ...currentUser,
        role: 'admin',
        name: 'Admin Officer',
        email: 'admin@securedoc.vault'
      });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Layers },
    { id: 'vault', label: 'Document Vault', icon: FileText },
    { id: 'about', label: 'About & Security', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
    ...(currentUser.role === 'admin' ? [{ id: 'admin', label: 'Admin Console', icon: ShieldAlert }] : [])
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar" id="site-header">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => handleNavClick('home')} 
          style={{ cursor: 'pointer' }}
          id="brand-logo"
        >
          <div className="brand-icon">
            <Shield size={22} />
          </div>
          <div className="brand-name">
            Secure<span>Doc</span>
          </div>
          <span className="badge badge-role-user" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
            MERN Vault
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    id={`nav-link-${item.id}`}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    style={{ background: 'none', border: 'none' }}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions & User State */}
        <div className="nav-actions">
          {/* Quick Role Switcher Pill */}
          <button 
            className="user-badge-pill" 
            onClick={toggleRole} 
            title="Click to quickly switch between User & Admin views"
            id="role-switcher-btn"
          >
            <div className="avatar-dot">
              {currentUser.name.charAt(0)}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.68rem', color: currentUser.role === 'admin' ? '#C084FC' : '#34D399' }}>
                {currentUser.role === 'admin' ? '🛡️ Admin View' : '👤 User View'} (Click to switch)
              </div>
            </div>
          </button>

          {/* Theme Toggle */}
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth Button */}
          {currentUser.isLoggedIn ? (
            <button 
              className="btn btn-outline btn-sm" 
              onClick={onLogout}
              id="logout-btn"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => onOpenAuth('login')}
              id="login-btn"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}

          {/* Hamburger Menu for Mobile */}
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
            id="hamburger-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" id="mobile-menu-drawer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`btn ${activeTab === item.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleNavClick(item.id)}
                  style={{ justifyContent: 'flex-start', padding: '0.85rem 1.25rem' }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: 'auto' }}>
            <button 
              className="btn btn-outline w-full" 
              onClick={toggleRole}
              style={{ width: '100%', marginBottom: '0.75rem' }}
            >
              Switch Role ({currentUser.role === 'admin' ? 'Now Admin' : 'Now User'})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
