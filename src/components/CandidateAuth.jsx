import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Zap, 
  Lock, 
  UserPlus, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  Hash,
  Eye,
  EyeOff,
  Building2,
  Award
} from 'lucide-react';
import {
  fetchDemoUsers,
  loginDemo,
  previewUsername,
  registerCandidate,
  authenticateUser
} from '../data/authData';
import { MINISTRIES_DEPARTMENTS, DEFAULT_GRADE_CATEGORIES } from '../data/gradeLevelCategories';
import CandidateAvatar from './CandidateAvatar';

export default function CandidateAuth({ 
  gradeCategories, 
  selectedCategory, 
  setSelectedCategory, 
  activeCandidate, 
  setActiveCandidate, 
  onVerified,
  onAdminLogin,
  initialAuthTab = 'demo'
}) {
  const safeCategory = selectedCategory || (gradeCategories && gradeCategories[0]) || DEFAULT_GRADE_CATEGORIES[0];

  // Tabs: 'demo' (DEFAULT / FIRST), 'login', 'register'
  const [activeTab, setActiveTab] = useState(initialAuthTab === 'admin' ? 'login' : (initialAuthTab || 'demo'));

  useEffect(() => {
    if (initialAuthTab) {
      setActiveTab(initialAuthTab === 'admin' ? 'login' : initialAuthTab);
    }
  }, [initialAuthTab]);

  // Error & Status feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // 1. DEMO MODE STATE
  const [demoCandidates, setDemoCandidates] = useState([]);
  const [selectedDemoId, setSelectedDemoId] = useState('');

  useEffect(() => {
    fetchDemoUsers()
      .then(list => {
        setDemoCandidates(list);
        setSelectedDemoId(prev => prev || list[0]?.id || '');
      })
      .catch(() => { /* server unreachable: demo list stays empty */ });
  }, []);

  // 2. CANDIDATE LOGIN FORM STATE
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // 3. REGISTRATION FORM STATE
  const [regForm, setRegForm] = useState({
    firstName: '',
    surname: '',
    customNumber: '',
    password: '',
    cadre: safeCategory?.cadres?.[0] || 'Administrative Officer I',
    ministry: MINISTRIES_DEPARTMENTS[0],
    targetGrade: safeCategory?.gradeLevels?.[0] || 'GL 09 to 10',
    categoryId: safeCategory?.id || 'group-gl-06-10'
  });

  // Live auto-generated username for registration
  const [previewUsername, setPreviewUsername] = useState('');

  // Update live preview username whenever First Name, Surname, or Number changes
  useEffect(() => {
    if (regForm.firstName && regForm.surname) {
      const generated = previewUsername(regForm.firstName, regForm.surname, regForm.customNumber);
      setPreviewUsername(generated);
    } else {
      setPreviewUsername('');
    }
  }, [regForm.firstName, regForm.surname, regForm.customNumber]);

  // Keep category in sync with registration category selection
  useEffect(() => {
    const activeCat = selectedCategory || (gradeCategories && gradeCategories[0]) || DEFAULT_GRADE_CATEGORIES[0];
    if (!activeCat) return;
    setRegForm(prev => ({
      ...prev,
      categoryId: activeCat.id,
      cadre: activeCat.cadres?.[0] || prev.cadre || 'Administrative Officer I',
      targetGrade: activeCat.gradeLevels?.[0] || prev.targetGrade || 'GL 10'
    }));
  }, [selectedCategory, gradeCategories]);

  // Handle Demo Mode 1-Click Launch
  const handleLaunchDemo = async (demoUser) => {
    setErrorMessage('');
    const userToUse = demoUser || demoCandidates.find(d => d.id === selectedDemoId) || demoCandidates[0];
    if (!userToUse) {
      setErrorMessage('Demo accounts are not available right now. Check the connection to the server.');
      return;
    }
    try {
      const signedIn = await loginDemo(userToUse.id);
      setActiveCandidate(signedIn);

      // Sync grade category to demo user's grade
      const cat = gradeCategories.find(c => c.id === signedIn.categoryId);
      if (cat) setSelectedCategory(cat);

      onVerified();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Handle Candidate Login (Accepts both candidate and sacred admin credentials)
  const handleCandidateLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = loginForm.username.trim().toLowerCase();
    const cleanPass = loginForm.password;

    if (!cleanUser) {
      setErrorMessage("Please enter your username.");
      return;
    }

    if (cleanPass.length < 4) {
      setErrorMessage("Password must be a minimum of 4 characters.");
      return;
    }

    try {
      const authenticated = await authenticateUser(cleanUser, cleanPass);
      setActiveCandidate(authenticated);

      // Sacred Admin Login Check:
      // When the sacred admin credentials are submitted, take them straight to the Admin Suite!
      if (authenticated.role === 'admin') {
        if (onAdminLogin) {
          onAdminLogin();
        }
        return;
      }

      const cat = gradeCategories.find(c => c.id === authenticated.categoryId);
      if (cat) setSelectedCategory(cat);

      onVerified();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Handle New Candidate Registration
  const handleCandidateRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regForm.firstName.trim() || !regForm.surname.trim()) {
      setErrorMessage("Please enter both First Name and Surname.");
      return;
    }

    if (regForm.password.length < 4) {
      setErrorMessage("Password must be a minimum of 4 characters.");
      return;
    }

    try {
      const newCandidate = await registerCandidate({
        firstName: regForm.firstName,
        surname: regForm.surname,
        customNumber: regForm.customNumber,
        password: regForm.password,
        cadre: regForm.cadre,
        ministry: regForm.ministry,
        targetGrade: regForm.targetGrade,
        categoryId: safeCategory?.id || 'group-gl-06-10'
      });

      setActiveCandidate(newCandidate);
      setSuccessMessage(`Account created successfully! Your username is: ${newCandidate.username}`);
      
      setTimeout(() => {
        onVerified();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="auth-wrapper animate-fade-in" style={{ padding: '1rem 0.75rem 3rem' }}>
      <div className="auth-card" style={{ maxWidth: '860px', width: '100%', margin: '0 auto' }}>
        
        {/* Header with Lagos State Crest */}
        <div className="auth-header" style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '0.65rem', 
            borderRadius: '50%', 
            background: 'rgba(16, 185, 129, 0.15)', 
            color: '#10b981', 
            marginBottom: '0.5rem' 
          }}>
            <ShieldCheck size={38} />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-emerald)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Lagos State Civil Service Commission (LSCSC)
          </div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', margin: '0.35rem 0' }}>
            Year 2027 Promotion Exercise CBT Portal
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
            Official Computer-Based Testing clearance for Lagos State Civil Servants. Instant demo access, candidate verification, and commission monitoring.
          </p>
        </div>

        {/* Global Feedback Alert */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.875rem',
            textAlign: 'left'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#10b981',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.875rem',
            textAlign: 'left'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main 4-Tab Navigation Bar (DEMO MODE IS FIRST) */}
        <div className="auth-tabs" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: '0.4rem', 
          background: 'var(--bg-tertiary)', 
          padding: '0.4rem', 
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem'
        }}>
          {/* Tab 1: Demo Mode (FIRST & DEFAULT) */}
          <button
            type="button"
            id="tab-demo-mode"
            className={`btn btn-sm ${activeTab === 'demo' ? 'btn-emerald' : 'btn-ghost'}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.4rem',
              fontWeight: 700,
              padding: '0.65rem 0.5rem'
            }}
            onClick={() => {
              setActiveTab('demo');
              setErrorMessage('');
            }}
          >
            <Zap size={15} />
            <span>1. Demo Mode</span>
          </button>

          {/* Tab 2: Candidate Login */}
          <button
            type="button"
            id="tab-candidate-login"
            className={`btn btn-sm ${activeTab === 'login' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.4rem',
              fontWeight: 600,
              padding: '0.65rem 0.5rem'
            }}
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
          >
            <UserCheck size={15} />
            <span>2. Login</span>
          </button>

          {/* Tab 3: Register Candidate */}
          <button
            type="button"
            id="tab-candidate-register"
            className={`btn btn-sm ${activeTab === 'register' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.4rem',
              fontWeight: 600,
              padding: '0.65rem 0.5rem'
            }}
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
          >
            <UserPlus size={15} />
            <span>3. Register</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: DEMO MODE (FIRST & DEFAULT) - 1-CLICK INSTANT CBT ENTRY
           ========================================================================= */}
        {activeTab === 'demo' && (
          <div className="animate-fade-in" style={{ textAlign: 'left' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.08))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-emerald)', fontWeight: 700, fontSize: '0.95rem' }}>
                <Zap size={18} />
                <span>Instant Demo Mode Active (No Registration Needed)</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.35rem 0 0' }}>
                Select a Lagos State civil service promotion cadre below and enter the 100-question computer-based exam immediately:
              </p>
            </div>

            {/* Demo Candidate Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {demoCandidates.map((demo) => {
                const isSelected = selectedDemoId === demo.id;
                const matchedCategory = gradeCategories.find(c => c.id === demo.categoryId);

                return (
                  <div
                    key={demo.id}
                    id={`demo-officer-${demo.id}`}
                    onClick={() => {
                      setSelectedDemoId(demo.id);
                      if (matchedCategory) setSelectedCategory(matchedCategory);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.9rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                      border: `2px solid ${isSelected ? 'var(--brand-emerald)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <CandidateAvatar name={demo.fullName} size={50} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                          {demo.fullName}
                        </span>
                        <span className={`badge ${matchedCategory?.badgeColor || 'badge-emerald'}`} style={{ fontSize: '0.65rem' }}>
                          {matchedCategory?.code}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                        {demo.cadre} • <strong>{demo.targetGrade}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {demo.ministry}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>
                        Username:
                      </div>
                      <code style={{ fontSize: '0.775rem', color: 'var(--text-main)', background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px' }}>
                        {demo.username}
                      </code>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Launch Button for Demo Mode */}
            <button
              type="button"
              id="launch-demo-exam-btn"
              className="btn btn-emerald btn-lg"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '52px' }}
              onClick={() => handleLaunchDemo()}
            >
              <Zap size={18} />
              <span>Launch 100-Question Exam as Selected Demo Officer</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CANDIDATE LOGIN (Supports Candidates and Sacred Admin Login)
           ========================================================================= */}
        {activeTab === 'login' && (
          <form 
            method="post" 
            action="#" 
            onSubmit={handleCandidateLogin} 
            className="animate-fade-in" 
            style={{ textAlign: 'left' }}
            autoComplete="on"
          >
            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              
              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label htmlFor="login-username-input" className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Username:</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>e.g. babatunde.olatunji</span>
                </label>
                <input
                  type="text"
                  name="username"
                  id="login-username-input"
                  className="form-input"
                  placeholder="Enter your username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value.toLowerCase().trim() })}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label htmlFor="login-password-input" className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Password:</span>
                  <span style={{ fontSize: '0.75rem', color: loginForm.password.length >= 4 ? 'var(--brand-emerald)' : 'var(--text-muted)' }}>
                    {loginForm.password.length >= 4 ? "✓ Minimum 4 characters" : "Minimum 4 characters required"}
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="login-password-input"
                    className="form-input"
                    placeholder="Enter password (min 4 chars)"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Quick Preset Credentials Chip */}
              <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div style={{ marginBottom: '0.4rem' }}>Quick Fill Demo Credentials:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {demoCandidates.map(demo => (
                    <button
                      key={demo.id}
                      type="button"
                      className="btn btn-sm btn-ghost"
                      style={{ fontSize: '0.725rem', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.5rem' }}
                      onClick={() => setLoginForm({ username: demo.username, password: 'pass' })}
                    >
                      {demo.username}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="submit-candidate-login-btn"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '52px' }}
            >
              <UserCheck size={18} />
              <span>Sign In & Proceed</span>
              <ChevronRight size={18} />
            </button>
          </form>
        )}

        {/* =========================================================================
            TAB 3: REGISTER NEW CANDIDATE (Auto username, Add a Number, Min 4 Chars)
           ========================================================================= */}
        {activeTab === 'register' && (
          <form 
            method="post" 
            action="#" 
            onSubmit={handleCandidateRegister} 
            className="animate-fade-in" 
            style={{ textAlign: 'left' }}
            autoComplete="on"
          >
            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.08)', 
                border: '1px solid rgba(59, 130, 246, 0.25)', 
                padding: '0.75rem', 
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}>
                ℹ️ <strong>Lagos State Civil Service Enrollment:</strong> No Oracle or Service number required. Your login username is automatically generated as <code>firstname.surname</code>.
              </div>

              {/* First Name & Surname */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="reg-firstname-input" className="form-label">First Name:</label>
                  <input
                    type="text"
                    id="reg-firstname-input"
                    name="given-name"
                    className="form-input"
                    placeholder="e.g. Babatunde"
                    value={regForm.firstName}
                    onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-surname-input" className="form-label">Surname:</label>
                  <input
                    type="text"
                    id="reg-surname-input"
                    name="family-name"
                    className="form-input"
                    placeholder="e.g. Olatunji"
                    value={regForm.surname}
                    onChange={(e) => setRegForm({ ...regForm, surname: e.target.value })}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              {/* Assigned Username Field - Detectable for Browser Password Saving */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <label htmlFor="reg-username-input" className="form-label" style={{ margin: 0 }}>
                    Assigned Username (for login):
                  </label>
                  {/* Add a Number Option */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Hash size={14} color="var(--brand-primary)" />
                    <label htmlFor="reg-custom-number-input" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Add Number:</label>
                    <input
                      type="number"
                      id="reg-custom-number-input"
                      placeholder="e.g. 2"
                      style={{ 
                        width: '60px', 
                        padding: '0.2rem 0.4rem', 
                        fontSize: '0.8rem', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border-medium)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-main)'
                      }}
                      value={regForm.customNumber}
                      onChange={(e) => setRegForm({ ...regForm, customNumber: e.target.value })}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="username"
                  id="reg-username-input"
                  className="form-input"
                  value={previewUsername || (regForm.firstName && regForm.surname ? `${regForm.firstName.toLowerCase()}.${regForm.surname.toLowerCase()}` : '')}
                  autoComplete="username"
                  readOnly
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--brand-emerald)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderColor: 'rgba(16, 185, 129, 0.35)'
                  }}
                  placeholder="Enter First Name & Surname above"
                  required
                />
              </div>

              {/* Password with min 4 characters check */}
              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label htmlFor="reg-password-input" className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Create Password:</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    color: regForm.password.length >= 4 ? 'var(--brand-emerald)' : 'var(--brand-rose)' 
                  }}>
                    {regForm.password.length >= 4 ? "✓ Valid (Minimum 4 characters)" : "Minimum 4 characters required"}
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="reg-password-input"
                    className="form-input"
                    placeholder="Enter password (minimum 4 characters)"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Ministry & Cadre */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Ministry / Department / Agency:</label>
                  <select
                    className="form-select"
                    value={regForm.ministry}
                    onChange={(e) => setRegForm({ ...regForm, ministry: e.target.value })}
                  >
                    {MINISTRIES_DEPARTMENTS.map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cadre / Professional Track:</label>
                  <select
                    className="form-select"
                    value={regForm.cadre}
                    onChange={(e) => setRegForm({ ...regForm, cadre: e.target.value })}
                  >
                    {(safeCategory?.cadres || ['Administrative Officer I']).map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Grade Level */}
              <div className="form-group">
                <label className="form-label">Target Promotion Grade Level:</label>
                <select
                  className="form-select"
                  value={regForm.targetGrade}
                  onChange={(e) => setRegForm({ ...regForm, targetGrade: e.target.value })}
                >
                  {(safeCategory?.gradeLevels || ['GL 09 to 10']).map((gl, i) => (
                    <option key={i} value={gl}>{gl}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              id="submit-candidate-register-btn"
              className="btn btn-emerald btn-lg"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '52px' }}
            >
              <UserPlus size={18} />
              <span>Complete Registration & Launch Examination Rules</span>
              <ChevronRight size={18} />
            </button>
          </form>
        )}

        {/* =========================================================================
            PROMOTION GRADE LEVEL GROUP MATRIX (PER CALL CIRCULAR)
           ========================================================================= */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', textAlign: 'left' }}>
          <label className="form-label" style={{ marginBottom: '0.65rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="var(--brand-primary)" />
              Select Promotion Grade Level Group (Per Circular):
            </span>
            <span className="badge badge-emerald">{selectedCategory.code}</span>
          </label>

          <div className="category-select-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.75rem' }}>
            {gradeCategories.map((cat) => {
              const isSelected = selectedCategory.id === cat.id;
              return (
                <div 
                  key={cat.id}
                  id={`cat-card-${cat.id}`}
                  className={`category-card-option ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    padding: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span className={`badge ${cat.badgeColor}`}>{cat.code}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>
                        Cut-off: {cat.passScorePercentage}%
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      {cat.title}
                    </div>

                    {/* Circular Scoring Matrix */}
                    <div style={{ background: 'var(--bg-primary)', padding: '0.45rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
                        SCORING MATRIX:
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-main)', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        <span>CBT: <strong>{cat.assessmentMatrix?.cbtWeight}%</strong></span>
                        {cat.assessmentMatrix?.writtenWeight > 0 && <span>• Written: <strong>{cat.assessmentMatrix.writtenWeight}%</strong></span>}
                        {cat.assessmentMatrix?.interviewWeight > 0 && <span>• Interview: <strong>{cat.assessmentMatrix.interviewWeight}%</strong></span>}
                        <span>• SPADEV: <strong>{cat.assessmentMatrix?.spadevWeight}%</strong></span>
                      </div>
                    </div>

                    {/* Prescribed Chapters */}
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', lineHeight: 1.4 }}>
                      <div>📖 <strong>PSR:</strong> {cat.psrChapters?.map(p => `Ch.${p.chapter}`).join(', ')}</div>
                      <div style={{ marginTop: '0.15rem' }}>💰 <strong>FR:</strong> {cat.frChapters?.map(f => `Ch.${f.chapter}`).join(', ')}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.45rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    ⏱️ {cat.timeLimitMinutes} Mins • <strong>100 Questions</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Syllabus Preview */}
        <div style={{ 
          background: 'var(--bg-tertiary)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: 'var(--radius-md)', 
          padding: '0.85rem 1rem', 
          marginTop: '1.25rem',
          textAlign: 'left'
        }}>
          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={15} /> Prescribed Chapters for {selectedCategory.code} CBT Session:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.5rem', fontSize: '0.78rem' }}>
            <div>
              <strong style={{ color: 'var(--brand-emerald)' }}>Lagos State Public Service Rules (PSR):</strong>
              <ul style={{ paddingLeft: '1.1rem', margin: '0.2rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {selectedCategory.psrChapters?.map((c, i) => (
                  <li key={i}>{c.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong style={{ color: 'var(--brand-gold)' }}>Lagos State Financial Regulations / STO:</strong>
              <ul style={{ paddingLeft: '1.1rem', margin: '0.2rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {selectedCategory.frChapters?.map((c, i) => (
                  <li key={i}>{c.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}