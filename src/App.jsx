import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './styles/cbt-exam.css';
import './styles/admin.css';

import { DEFAULT_GRADE_CATEGORIES } from './data/gradeLevelCategories';
import { getCurrentUser, logoutUser } from './data/authData';
import { api } from './api';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CandidateDashboard from './components/CandidateDashboard';
import CandidateSettings from './components/CandidateSettings';
import CandidateAuth from './components/CandidateAuth';
import ExamInstructions from './components/ExamInstructions';
import CBTExamEngine from './components/CBTExamEngine';
import ExamResultView from './components/ExamResultView';
import AdminPortal from './components/AdminPortal';
import ResourceLibraryView from './components/ResourceLibraryView';
import ErrorBoundary from './components/ErrorBoundary';
import { ShieldAlert, ArrowLeft, LogIn, UserPlus } from 'lucide-react';

function getRouteFromLocation() {
  if (typeof window === 'undefined') return null;
  const hash = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0].toLowerCase();
  const path = (window.location.pathname || '').replace(/^\/+/, '').split('/')[0].toLowerCase();
  const r = hash || path;
  if (['demo', 'login', 'register', 'auth'].includes(r)) {
    return { view: 'auth', tab: r === 'auth' ? 'demo' : r };
  }
  if (['home', 'dashboard', 'settings', 'instructions', 'exam', 'result', 'admin', 'resources'].includes(r)) {
    return { view: r, tab: 'demo' };
  }
  return null;
}

function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('civil_cbt_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('civil_cbt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Grade groups, questions, study materials and results now live on the server.
  // The built-in grade groups are only shown for the instant before the server answers.
  const [gradeCategories, setGradeCategories] = useState(DEFAULT_GRADE_CATEGORIES);

  // Selected Grade Category for candidate
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_GRADE_CATEGORIES[0]);

  // Question Bank (administrators only; candidates never receive the question bank)
  const [questions, setQuestions] = useState([]);

  // Resource Library
  const [resources, setResources] = useState([]);

  useEffect(() => {
    api('/categories', { auth: false })
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setGradeCategories(list);
          setSelectedCategory((prev) => list.find((c) => c.id === prev?.id) || list[0]);
        }
      })
      .catch(() => { /* server unreachable: keep the built-in DEFAULT_GRADE_CATEGORIES */ });
    api('/resources', { auth: false })
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setResources(list);
        }
      })
      .catch(() => {});
  }, []);

  // Candidate State (Loads from authData store or null for guest)
  const [activeCandidate, setActiveCandidate] = useState(() => {
    return getCurrentUser();
  });

  // Single Active Session State
  const [showKickedOutModal, setShowKickedOutModal] = useState(false);

  // Single Active Session Enforcement: the server decides. If this account signs in on another
  // device, the server ends this session and any request here returns SESSION_REPLACED.
  useEffect(() => {
    const onSessionEnded = (e) => {
      setActiveCandidate(null);
      if (e.detail?.code === 'SESSION_REPLACED') setShowKickedOutModal(true);
      setCurrentView('home');
    };
    window.addEventListener('cbt:session-ended', onSessionEnded);
    return () => window.removeEventListener('cbt:session-ended', onSessionEnded);
  }, []);

  // After a refresh, power cut or re-login, go straight back into an examination that is still running
  useEffect(() => {
    if (activeCandidate?.role !== 'candidate') return;
    api('/exam/current')
      .then((cur) => {
        if (!cur || cur.active === false) return;
        const cat = gradeCategories.find((c) => c.id === cur.category?.id) || cur.category;
        if (cat) setSelectedCategory(cat);
        setCurrentView('exam');
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCandidate?.id]);

  // Check the session with the server now and every 15 seconds (catches a sign-in elsewhere while idle)
  useEffect(() => {
    if (!activeCandidate?.id) return;
    const check = () => { api('/me').catch(() => {}); };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [activeCandidate?.id]);

  // Navigation View: 'home', 'dashboard', 'settings', 'auth', 'instructions', 'exam', 'result', 'admin', 'resources'
  const initialRoute = getRouteFromLocation();
  const [currentView, setCurrentView] = useState(() => {
    if (initialRoute?.view) return initialRoute.view;
    const savedUser = getCurrentUser();
    return savedUser ? 'dashboard' : 'home';
  });

  // Sub-tab for Auth view: 'demo', 'login', 'register', 'admin'
  const [authTab, setAuthTab] = useState(() => initialRoute?.tab || 'demo');

  // URL Hash synchronization
  useEffect(() => {
    const handleLocationChange = () => {
      const route = getRouteFromLocation();
      if (route) {
        setCurrentView(route.view);
        if (route.tab) setAuthTab(route.tab);
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Exam Result State
  const [lastExamResult, setLastExamResult] = useState(null);

  // Results: the administrator sees the full merit roster; a candidate sees their own past results
  const [meritHistory, setMeritHistory] = useState([]);

  // Reload results (and the question bank for the administrator) when the screen changes
  useEffect(() => {
    if (!activeCandidate?.id || currentView === 'exam') return;
    if (activeCandidate.role === 'admin') {
      api('/merit').then(setMeritHistory).catch(() => {});
      if (currentView === 'admin') api('/questions').then(setQuestions).catch(() => {});
    } else {
      api('/me/results').then(setMeritHistory).catch(() => {});
    }
  }, [activeCandidate?.id, activeCandidate?.role, currentView]);

  // Navigation Helper to open CandidateAuth on a specific tab
  const handleNavigateAuth = (tab = 'demo') => {
    setAuthTab(tab);
    setCurrentView('auth');
  };

  // Logout Handler
  const handleLogout = () => {
    logoutUser();
    setActiveCandidate(null);
    setCurrentView('home');
  };

  // Exam Completion Handler
  const handleExamSubmit = (resultData) => {
    setLastExamResult(resultData);
    setCurrentView('result');
  };

  const isExamActive = currentView === 'exam';
  const safeSelectedCategory = selectedCategory || (gradeCategories && gradeCategories[0]) || DEFAULT_GRADE_CATEGORIES[0];

  return (
    <div className="app-root">
      {/* Universal Top Navigation Header */}
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        theme={theme}
        toggleTheme={toggleTheme}
        activeCandidate={activeCandidate}
        isExamActive={isExamActive}
        onLogout={handleLogout}
        onNavigateAuth={handleNavigateAuth}
      />

      {/* Main Body View Switcher wrapped in ErrorBoundary */}
      <ErrorBoundary onReset={() => setCurrentView('home')}>
      
      {/* 1. OFFICER DASHBOARD: Default view when logged in (Name, Level, Ministry, Cadre) */}
      {currentView === 'dashboard' && (
        activeCandidate ? (
          <CandidateDashboard 
            candidate={activeCandidate}
            category={safeSelectedCategory}
            onStartExam={() => setCurrentView('instructions')}
            onNavigateResources={() => setCurrentView('resources')}
            onNavigateSettings={() => setCurrentView('settings')}
            onNavigateAdmin={() => setCurrentView('admin')}
            meritHistory={meritHistory}
          />
        ) : (
          <HomePage 
            currentUser={activeCandidate}
            onNavigateAuth={handleNavigateAuth}
            onNavigateResources={() => setCurrentView('resources')}
            onStartExamForCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigateAuth('demo');
            }}
            gradeCategories={gradeCategories}
          />
        )
      )}

      {/* 2. OFFICER SETTINGS PAGE: Edit Name, Change Ministry, Cadre, Level, Change Password */}
      {currentView === 'settings' && (
        activeCandidate ? (
          activeCandidate.isDemo ? (
            <div className="container animate-fade-in" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
              <div className="card" style={{ maxWidth: '540px', margin: '0 auto', padding: '2.5rem 1.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
                <div style={{ color: 'var(--brand-amber)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <ShieldAlert size={52} />
                </div>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Account Settings Disabled in Demo Mode
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  Demo candidate accounts are read-only demonstration accounts. Changing candidate name, ministry, cadre, or password is not permitted in Demo Mode. Please register your own candidate profile to customize your information.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => setCurrentView('dashboard')}>
                    <ArrowLeft size={16} />
                    <span>Return to Officer Dashboard</span>
                  </button>
                  <button className="btn btn-emerald" onClick={() => handleNavigateAuth('register')}>
                    <UserPlus size={16} />
                    <span>Register Candidate Account</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <CandidateSettings 
              candidate={activeCandidate}
              onCandidateUpdated={(updated) => setActiveCandidate(updated)}
              gradeCategories={gradeCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )
        ) : (
          <HomePage 
            currentUser={activeCandidate}
            onNavigateAuth={handleNavigateAuth}
            onNavigateResources={() => setCurrentView('resources')}
            onStartExamForCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigateAuth('demo');
            }}
            gradeCategories={gradeCategories}
          />
        )
      )}

      {/* 3. HOME / LANDING PAGE: Welcoming overview for guests (Dashboard if logged in) */}
      {currentView === 'home' && (
        activeCandidate ? (
          <CandidateDashboard 
            candidate={activeCandidate}
            category={selectedCategory}
            onStartExam={() => setCurrentView('instructions')}
            onNavigateResources={() => setCurrentView('resources')}
            onNavigateSettings={() => setCurrentView('settings')}
            onNavigateAdmin={() => setCurrentView('admin')}
            meritHistory={meritHistory}
          />
        ) : (
          <HomePage 
            currentUser={activeCandidate}
            onNavigateAuth={handleNavigateAuth}
            onNavigateResources={() => setCurrentView('resources')}
            onStartExamForCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigateAuth('demo');
            }}
            gradeCategories={gradeCategories}
          />
        )
      )}

      {/* 4. AUTHENTICATION & VERIFICATION: Demo Mode First, Login, Register */}
      {currentView === 'auth' && (
        <CandidateAuth 
          gradeCategories={gradeCategories}
          selectedCategory={safeSelectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeCandidate={activeCandidate}
          setActiveCandidate={setActiveCandidate}
          initialAuthTab={authTab}
          onVerified={() => setCurrentView('dashboard')}
          onAdminLogin={() => setCurrentView('dashboard')}
        />
      )}

      {/* 5. EXAM INSTRUCTIONS & CODE OF CONDUCT PLEDGE */}
      {currentView === 'instructions' && (
        <ExamInstructions 
          candidate={activeCandidate}
          category={safeSelectedCategory}
          onStartExam={() => setCurrentView('exam')}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {/* 6. 100-QUESTION CBT EXAMINATION ENGINE */}
      {currentView === 'exam' && (
        <CBTExamEngine 
          candidate={activeCandidate}
          category={safeSelectedCategory}
          onExamSubmit={handleExamSubmit}
          onExit={() => setCurrentView('dashboard')}
        />
      )}

      {/* 7. OFFICIAL RESULT SLIP & 100-QUESTION CITATION FEEDBACK */}
      {currentView === 'result' && lastExamResult && (
        <ExamResultView 
          resultData={lastExamResult}
          onRetake={() => setCurrentView('dashboard')}
          onGoAdmin={() => {
            if (activeCandidate?.role === 'admin') {
              setCurrentView('admin');
            } else {
              setCurrentView('dashboard');
            }
          }}
        />
      )}

      {/* 6. COMMISSION ADMINISTRATOR PORTAL: STRICTLY RESTRICTED TO ADMIN */}
      {currentView === 'admin' && (
        activeCandidate?.role === 'admin' ? (
          <AdminPortal 
            gradeCategories={gradeCategories}
            setGradeCategories={setGradeCategories}
            questions={questions}
            setQuestions={setQuestions}
            resources={resources}
            setResources={setResources}
            meritHistory={meritHistory}
          />
        ) : (
          <div className="container animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '540px', margin: '0 auto', padding: '2.5rem 1.5rem', background: 'var(--bg-card)' }}>
              <div style={{ color: 'var(--brand-danger)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <ShieldAlert size={52} />
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Commission Access Restricted
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                The Administrator Suite is strictly reserved for the Commission Examination Executive (<code>admin</code>). Ordinary candidate accounts do not possess administrative permissions.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setCurrentView('home')}
                >
                  <ArrowLeft size={16} />
                  <span>Return to Home Page</span>
                </button>
                <button 
                  className="btn btn-gold"
                  onClick={() => handleNavigateAuth('admin')}
                >
                  <span>Sign In as Administrator</span>
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* 7. REGULATORY COMPENDIUMS & STUDY LIBRARY */}
      {currentView === 'resources' && (
        !activeCandidate ? (
          <div className="container animate-fade-in" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '560px', margin: '0 auto', padding: '2.5rem 1.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <div style={{ color: 'var(--brand-primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <ShieldAlert size={52} />
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Study Materials Restricted to Registered Officers
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Official Lagos State Public Service Rules (PSR 2015), Financial Regulations, and procurement study materials are accessible exclusively to authenticated candidates. Please sign in or register your official account to access the study library.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => setCurrentView('home')}>
                  <ArrowLeft size={16} />
                  <span>Return to Home</span>
                </button>
                <button className="btn btn-outline" onClick={() => handleNavigateAuth('login')}>
                  <LogIn size={16} />
                  <span>Log In</span>
                </button>
                <button className="btn btn-emerald" onClick={() => handleNavigateAuth('register')}>
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          </div>
        ) : activeCandidate.isDemo ? (
          <div className="container animate-fade-in" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '560px', margin: '0 auto', padding: '2.5rem 1.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <div style={{ color: 'var(--brand-amber)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <ShieldAlert size={52} />
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Study Materials Restricted for Demo Accounts
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Demo mode is intended strictly for experiencing the CBT examination engine. Official study materials, regulatory compendiums, and chapter reading scopes are restricted to registered candidate accounts.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => setCurrentView('dashboard')}>
                  <ArrowLeft size={16} />
                  <span>Return to Dashboard</span>
                </button>
                <button className="btn btn-emerald" onClick={() => handleNavigateAuth('register')}>
                  <UserPlus size={16} />
                  <span>Register Candidate Account</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ResourceLibraryView 
            resources={resources}
            gradeCategories={gradeCategories}
            onStartExamForCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigateAuth('demo');
            }}
          />
        )
      )}
      </ErrorBoundary>

      {/* 8. SINGLE ACTIVE SESSION KICK-OUT MODAL */}
      {showKickedOutModal && createPortal(
        <div className="cbt-modal-overlay animate-fade-in" style={{ zIndex: 10000 }}>
          <div className="cbt-modal-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '2.25rem 1.5rem', border: '2px solid var(--brand-amber)', boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)' }}>
            <div style={{ color: 'var(--brand-amber)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <ShieldAlert size={56} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Single Active Session Security Alert
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Your session was terminated because another login was initiated for this candidate account on another terminal or browser. In compliance with Lagos State Civil Service Commission exam security standards, only <strong>one active session</strong> is permitted per candidate.
            </p>
            <button
              id="session-kicked-ack-btn"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
              onClick={() => {
                setShowKickedOutModal(false);
                handleNavigateAuth('login');
              }}
            >
              <span>Acknowledge & Sign In Again</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default App;