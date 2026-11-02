import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  UserCheck, 
  BookOpen, 
  Lock, 
  Menu, 
  X, 
  LogOut,
  Home,
  UserPlus,
  LogIn,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import CandidateAvatar from './CandidateAvatar';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  theme, 
  toggleTheme, 
  activeCandidate, 
  isExamActive,
  onLogout,
  onNavigateAuth
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Check if current logged in user is administrator
  const isAdmin = activeCandidate?.role === 'admin';

  const handleAdminClick = () => {
    setIsMobileMenuOpen(false);
    if (isAdmin || currentView === 'admin') {
      setCurrentView('admin');
      return;
    }
    // If not authenticated as admin, take to login form
    if (onNavigateAuth) {
      onNavigateAuth('login');
    } else {
      setCurrentView('auth');
    }
  };

  const handleNavClick = (view) => {
    setIsMobileMenuOpen(false);
    setCurrentView(view);
  };

  return (
    <>
      <header className={`app-navbar no-print ${isExamActive ? 'navbar-static' : 'navbar-fixed'}`}>
        <div className="container nav-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo & Lagos State Branding - Clicking goes to Dashboard if logged in, or Home if guest */}
          <div 
            className="nav-logo" 
            style={{ cursor: isExamActive ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
            onClick={() => {
              if (!isExamActive) {
                if (activeCandidate) {
                  setCurrentView('dashboard');
                } else {
                  setCurrentView('home');
                }
              }
            }}
            title={activeCandidate ? "Go to Officer Dashboard" : "Return to Home"}
          >
            <div className="nav-emblem" style={{ fontSize: '1.6rem' }}>🏛️</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  LAGOS-CBT
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                  YEAR 2027
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Lagos State Civil Service Commission
              </div>
            </div>
          </div>

          {/* Desktop Navigation Actions */}
          {!isExamActive && (
            <div className="nav-actions desktop-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              
              {activeCandidate ? (
                /* ==============================================================
                   LOGGED IN OFFICER NAVBAR (Home navbar is removed)
                   Features: Dashboard, Study Materials, Admin (if admin), Settings, Profile, Log Out
                   ============================================================== */
                <>
                  {/* Dashboard Link */}
                  <button
                    id="nav-dashboard-btn"
                    className={`btn btn-sm ${currentView === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleNavClick('dashboard')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                  >
                    <LayoutDashboard size={15} />
                    <span>Dashboard</span>
                  </button>

                  {/* Study Materials - Only for registered candidates (not demo accounts) */}
                  {!activeCandidate?.isDemo && (
                    <button 
                      id="nav-resources-btn"
                      className={`btn btn-sm ${currentView === 'resources' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => handleNavClick('resources')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                    >
                      <BookOpen size={15} />
                      <span>Study Materials</span>
                    </button>
                  )}

                  {/* Commission Admin Suite (If role is admin) */}
                  {isAdmin && (
                    <button 
                      id="nav-admin-btn"
                      className={`btn btn-sm ${currentView === 'admin' ? 'btn-gold' : 'btn-secondary'}`}
                      onClick={handleAdminClick}
                      title="Commission Administrator Suite"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: 600,
                        border: '1px solid var(--brand-gold)',
                        // Gold text only when inactive; active state keeps dark text on the gold fill
                        ...(currentView === 'admin' ? {} : { color: 'var(--brand-gold)' })
                      }}
                    >
                      <Lock size={14} />
                      <span>Commission Admin</span>
                    </button>
                  )}

                  {/* Account Settings Link - Disabled for Demo accounts */}
                  {!activeCandidate?.isDemo && (
                    <button
                      id="nav-settings-btn"
                      className={`btn btn-sm ${currentView === 'settings' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => handleNavClick('settings')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                      title="Account & Profile Settings"
                    >
                      <Settings size={15} />
                      <span>Settings</span>
                    </button>
                  )}

                  {/* Active User Chip */}
                  <div 
                    className="nav-candidate-chip"
                    onClick={() => handleNavClick('dashboard')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.2rem 0.6rem 0.2rem 0.3rem',
                      borderRadius: '9999px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                    title={`Logged in as ${activeCandidate.fullName} (${activeCandidate.username}). Click to open Dashboard.`}
                  >
                    <CandidateAvatar name={activeCandidate.fullName} size={26} />
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activeCandidate.firstName || activeCandidate.fullName.split(' ')[0]}
                    </span>
                    <span className={`badge ${isAdmin ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                      {isAdmin ? 'Admin' : (activeCandidate.targetGrade || 'GL')}
                    </span>
                  </div>

                  {/* Log Out Button */}
                  <button
                    id="nav-logout-btn"
                    className="btn btn-sm btn-logout"
                    onClick={() => setIsLogoutModalOpen(true)}
                    title="Sign out of your account"
                    style={{ padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                /* ==============================================================
                   GUEST / VISITOR NAVBAR (Home, Study Materials, Log In, Sign Up)
                   ============================================================== */
                <>
                  <button
                    id="nav-home-btn"
                    className={`btn btn-sm ${currentView === 'home' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handleNavClick('home')}
                  >
                    <Home size={15} />
                    <span>Home</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.25rem' }}>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => onNavigateAuth ? onNavigateAuth('login') : handleNavClick('auth')}
                      style={{ fontSize: '0.8rem' }}
                    >
                      <LogIn size={14} />
                      <span>Log In</span>
                    </button>
                    <button
                      className="btn btn-sm btn-emerald"
                      onClick={() => onNavigateAuth ? onNavigateAuth('register') : handleNavClick('auth')}
                      style={{ fontSize: '0.8rem' }}
                    >
                      <UserPlus size={14} />
                      <span>Sign Up</span>
                    </button>
                  </div>
                </>
              )}

              {/* Dark / Light Mode Toggle */}
              <button 
                id="theme-toggle-btn"
                className="btn btn-sm btn-secondary" 
                onClick={toggleTheme}
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                style={{ width: '36px', height: '36px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} />}
              </button>
            </div>
          )}

          {/* Examination Active State (Minimalist) */}
          {isExamActive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-amber" style={{ animation: 'pulseGlow 2s infinite ease-in-out', fontWeight: 700 }}>
                EXAMINATION IN PROGRESS
              </span>
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={toggleTheme}
                style={{ width: '36px', height: '36px', padding: 0 }}
              >
                {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} />}
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          {!isExamActive && (
            <div className="mobile-nav-toggle" style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }}>
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={toggleTheme}
                style={{ width: '36px', height: '36px', padding: 0 }}
              >
                {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} />}
              </button>
              <button
                id="mobile-menu-toggle-btn"
                className="btn btn-sm btn-outline"
                style={{ width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Slide-Down Menu Drawer */}
        {isMobileMenuOpen && !isExamActive && (
          <div 
            className="mobile-nav-drawer animate-fade-in"
            style={{
              background: 'var(--bg-card)',
              borderBottom: '1px solid var(--border-medium)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {activeCandidate && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '0.35rem'
              }}>
                <CandidateAvatar name={activeCandidate.fullName} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {activeCandidate.fullName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {activeCandidate.cadre} • <span style={{ color: 'var(--brand-emerald)', fontWeight: 600 }}>{isAdmin ? 'Administrator' : (activeCandidate.targetGrade || 'Candidate')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Nav Links */}
            {activeCandidate ? (
              /* LOGGED IN OFFICER MOBILE DRAWER */
              <>
                <button 
                  id="mobile-nav-dashboard"
                  className={`btn btn-md ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', justifyContent: 'flex-start', gap: '0.65rem' }}
                  onClick={() => handleNavClick('dashboard')}
                >
                  <LayoutDashboard size={18} />
                  <span>Officer Dashboard</span>
                </button>

                {!activeCandidate?.isDemo && (
                  <button 
                    id="mobile-nav-resources"
                    className={`btn btn-md ${currentView === 'resources' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', justifyContent: 'flex-start', gap: '0.65rem' }}
                    onClick={() => handleNavClick('resources')}
                  >
                    <BookOpen size={18} />
                    <span>Study Resources (PSR & FR)</span>
                  </button>
                )}

                {isAdmin && (
                  <button 
                    id="mobile-nav-admin"
                    className={`btn btn-md ${currentView === 'admin' ? 'btn-gold' : 'btn-secondary'}`}
                    style={{ width: '100%', justifyContent: 'flex-start', gap: '0.65rem' }}
                    onClick={handleAdminClick}
                  >
                    <Lock size={18} color={currentView === 'admin' ? '#1e1e1e' : 'var(--brand-gold)'} />
                    <span>Commission Administrator Suite</span>
                  </button>
                )}

                {!activeCandidate?.isDemo && (
                  <button 
                    id="mobile-nav-settings"
                    className={`btn btn-md ${currentView === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', justifyContent: 'flex-start', gap: '0.65rem' }}
                    onClick={() => handleNavClick('settings')}
                  >
                    <Settings size={18} />
                    <span>Account & Password Settings</span>
                  </button>
                )}

                <button 
                  id="mobile-nav-logout"
                  className="btn btn-md btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: '0.65rem', color: 'var(--brand-danger)', marginTop: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                >
                  <LogOut size={18} />
                  <span>Sign Out / Log Out</span>
                </button>
              </>
            ) : (
              /* GUEST / VISITOR MOBILE DRAWER */
              <>
                <button 
                  id="mobile-nav-home"
                  className={`btn btn-md ${currentView === 'home' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', justifyContent: 'flex-start', gap: '0.65rem' }}
                  onClick={() => handleNavClick('home')}
                >
                  <Home size={18} />
                  <span>Home Page</span>
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    className="btn btn-md btn-outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onNavigateAuth) onNavigateAuth('login');
                    }}
                  >
                    <LogIn size={16} />
                    <span>Log In</span>
                  </button>
                  <button
                    className="btn btn-md btn-emerald"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onNavigateAuth) onNavigateAuth('register');
                    }}
                  >
                    <UserPlus size={16} />
                    <span>Sign Up</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={onLogout}
        userName={activeCandidate?.fullName}
      />
    </>
  );
}