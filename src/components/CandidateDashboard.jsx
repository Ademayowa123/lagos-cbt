import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Layers, 
  Play, 
  Settings, 
  ShieldCheck, 
  User, 
  Zap,
  BarChart3,
  Edit3,
  X
} from 'lucide-react';
import CandidateAvatar from './CandidateAvatar';
import { updateUserProfile } from '../data/authData';
import { DEFAULT_GRADE_CATEGORIES } from '../data/gradeLevelCategories';
import ModernSelect from './ModernSelect';

export default function CandidateDashboard({
  candidate,
  category,
  gradeCategories = [],
  onCandidateUpdated,
  setSelectedCategory,
  onStartExam,
  onNavigateResources,
  onNavigateSettings,
  onNavigateAdmin,
  meritHistory = []
}) {
  const isAdmin = candidate?.role === 'admin';

  // Quick Change Target Grade Modal State
  const [showChangeGradeModal, setShowChangeGradeModal] = useState(false);
  const [modalSelectedGrade, setModalSelectedGrade] = useState(candidate?.targetGrade || 'GL 09 to 10');
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleOpenGradeModal = () => {
    setModalSelectedGrade(candidate?.targetGrade || 'GL 09 to 10');
    setModalError('');
    setShowChangeGradeModal(true);
  };

  const categoriesList = Array.isArray(gradeCategories) && gradeCategories.length > 0 ? gradeCategories : DEFAULT_GRADE_CATEGORIES;
  const modalMatchingCat = categoriesList.find(c => 
    (c.gradeLevels || []).includes(modalSelectedGrade)
  ) || category;

  const handleSaveModalGrade = async () => {
    if (!candidate?.id) return;
    setModalError('');
    setIsSavingGrade(true);
    try {
      const matchingCat = categoriesList.find(c => 
        (c.gradeLevels || []).includes(modalSelectedGrade)
      ) || category;

      const updated = await updateUserProfile(candidate.id, {
        targetGrade: modalSelectedGrade,
        categoryId: matchingCat?.id || 'group-gl-06-10'
      });

      if (setSelectedCategory && matchingCat) {
        setSelectedCategory(matchingCat);
      }
      if (onCandidateUpdated) {
        onCandidateUpdated(updated);
      }
      setShowChangeGradeModal(false);
    } catch (err) {
      setModalError(err.message || 'Failed to update target grade.');
    } finally {
      setIsSavingGrade(false);
    }
  };

  // Find candidate's previous exam attempts if any
  const candidateAttempts = meritHistory.filter(
    m => m.candidate?.username === candidate?.username || m.candidate?.fullName === candidate?.fullName
  );
  const latestAttempt = candidateAttempts[0];

  // Last 3 submitted CBT examinations, newest first
  const recentAttempts = [...candidateAttempts]
    .filter((m) => m.submittedAt)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 3);

  const formatSubmitted = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  return (
    <div className="container dashboard-container animate-fade-in">
      
      {/* 1. TOP WELCOME & IDENTITY BANNER */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-glow" />

        <div className="dashboard-hero-header">
          <div className="dashboard-hero-identity">
            <CandidateAvatar 
              name={candidate?.fullName} 
              size={64} 
              fontSize="1.5rem"
              className="dashboard-hero-avatar"
            />
            <div className="dashboard-hero-details">
              <div className="dashboard-hero-meta">
                <span className={`badge ${isAdmin ? 'badge-amber' : 'badge-emerald'} dashboard-role-badge`}>
                  {isAdmin ? 'Commission Administrator' : 'Verified Candidate'}
                </span>
                <span className="dashboard-hero-service-no">
                  {candidate?.serviceNumber || 'LASG/CSC/2027'}
                </span>
              </div>
              <h1 className="dashboard-hero-name">
                {candidate?.fullName}
              </h1>
              <p className="dashboard-hero-sub">
                Year 2027 Lagos State Civil Service Promotion Exercise Portal
              </p>
            </div>
          </div>

          <div className="dashboard-hero-actions">
            {!candidate?.isDemo ? (
              <button
                id="dashboard-settings-btn"
                className="btn btn-secondary dashboard-settings-btn"
                onClick={onNavigateSettings}
              >
                <Settings size={15} />
                <span>Account Settings</span>
              </button>
            ) : (
              <div 
                className="dashboard-demo-badge"
                title="Demo candidate accounts cannot modify name, ministry, cadre, or password"
              >
                <span>Demo Mode (Read-Only)</span>
              </div>
            )}

            {isAdmin && (
              <button
                id="dashboard-admin-btn"
                className="btn btn-gold dashboard-admin-btn"
                onClick={onNavigateAdmin}
              >
                <ShieldCheck size={15} />
                <span>Admin Suite</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 PRIMARY PROFILE HIGHLIGHT CARDS (Name, Level, Ministry, Cadre) */}
        <div className="dashboard-profile-cards">
          {/* Card 1: Candidate Name */}
          <div className="dashboard-profile-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-label" style={{ color: 'var(--brand-primary)' }}>
                <User size={13} />
                <span>Full Name</span>
              </div>
            </div>
            <div className="dashboard-card-val" title={candidate?.fullName}>
              {candidate?.fullName}
            </div>
            <div className="dashboard-card-sub" style={{ fontFamily: 'var(--font-mono)' }}>
              @{candidate?.username}
            </div>
          </div>

          {/* Card 2: Promotion Grade Level */}
          <div className="dashboard-profile-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-label text-emerald">
                <Award size={13} />
                <span>Grade Level</span>
              </div>
              {!candidate?.isDemo && (
                <button
                  type="button"
                  id="dashboard-change-grade-btn"
                  className="dashboard-grade-change-btn"
                  onClick={handleOpenGradeModal}
                  title="Change Target Promotion Grade"
                >
                  <Edit3 size={10} />
                  <span>Change</span>
                </button>
              )}
            </div>
            <div className="dashboard-card-val text-emerald">
              {candidate?.targetGrade || 'GL 09 to 10'}
            </div>
            <div className="dashboard-card-sub">
              {category?.code || 'GL 06 - 10'} • Pass: {category?.passScorePercentage || 50}%
            </div>
          </div>

          {/* Card 3: Ministry / MDA */}
          <div className="dashboard-profile-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-label text-gold">
                <Building2 size={13} />
                <span>Ministry / MDA</span>
              </div>
            </div>
            <div className="dashboard-card-val" title={candidate?.ministry}>
              {candidate?.ministry || 'Lagos State Civil Service'}
            </div>
            <div className="dashboard-card-sub">
              State Secretariat, Alausa
            </div>
          </div>

          {/* Card 4: Cadre / Professional Track */}
          <div className="dashboard-profile-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-label text-purple">
                <Briefcase size={13} />
                <span>Cadre / Track</span>
              </div>
            </div>
            <div className="dashboard-card-val" title={candidate?.cadre}>
              {candidate?.cadre || 'Administrative Officer'}
            </div>
            <div className="dashboard-card-sub">
              Official Designation
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT GRID */}
      <div className="dashboard-main-grid">
        
        {/* ACTION TILE 1: START CBT PROMOTION EXAM */}
        <div className="dashboard-action-card dashboard-exam-card">
          <div className="dashboard-action-card-body">
            <div className="dashboard-card-top-row">
              <span className="badge badge-emerald dashboard-exam-badge">
                <Zap size={12} /> 100 QUESTIONS • TIMED
              </span>
              <span className="dashboard-time-limit-tag">
                <Clock size={12} />
                <span>{category?.timeLimitMinutes || 60} Minutes</span>
              </span>
            </div>

            <h3 className="dashboard-action-title">
              Official Year 2027 CBT Promotion Examination
            </h3>
            <p className="dashboard-action-desc">
              Enter the computer-based test platform calibrated for <strong>{candidate?.targetGrade}</strong>. Exactly 100 questions covering your prescribed Lagos State PSR, Financial Regulations, and State Policy resource materials, with full statutory citations upon completion.
            </p>

            {/* Prescribed Chapter Summary */}
            <div className="dashboard-scope-box">
              <div className="dashboard-scope-header">
                <BookOpen size={13} />
                <span>Prescribed Reading Scope for {category?.code}:</span>
              </div>
              <div className="dashboard-scope-content">
                <div className="dashboard-scope-line">
                  <span className="scope-bullet">📘</span>
                  <span className="scope-label">Public Service Rules:</span>
                  <span className="scope-val">{category?.psrChapters?.map(p => `Ch.${p.chapter}`).join(', ') || 'Ch. 1-10'}</span>
                </div>
                <div className="dashboard-scope-line">
                  <span className="scope-bullet">📙</span>
                  <span className="scope-label">Financial Regulations:</span>
                  <span className="scope-val">{category?.frChapters?.map(f => `Ch.${f.chapter}`).join(', ') || 'Ch. 1-8'}</span>
                </div>
                <div className="dashboard-scope-line">
                  <span className="scope-bullet">📜</span>
                  <span className="scope-label">Circulars & Policies:</span>
                  <span className="scope-val">Procurement, Schemes of Service, THEMES+, CSC Handbook, Directives</span>
                </div>
              </div>
            </div>
          </div>

          <button
            id="dashboard-start-exam-btn"
            className="btn btn-emerald btn-lg dashboard-launch-exam-btn"
            onClick={onStartExam}
          >
            <Play size={17} fill="currentColor" />
            <span>Launch 100-Question Exam</span>
            <ChevronRight size={17} />
          </button>
        </div>

        {/* ACTION TILE 2: STUDY RESOURCES & CBT MATRIX */}
        <div className="dashboard-action-card dashboard-study-card">
          <div className="dashboard-action-card-body">
            <div className="dashboard-card-top-row">
              <span className="badge badge-blue dashboard-structure-badge">
                <Layers size={12} /> CBT EXAM MATRIX
              </span>
              <span className="dashboard-eval-tag">
                100% CBT Evaluation
              </span>
            </div>

            <h3 className="dashboard-action-title">
              Study Resources & CBT Format
            </h3>
            <p className="dashboard-action-desc">
              Master the official Lagos State Public Service Rules (2015) and Financial Regulations before sitting for the CBT exercise.
            </p>

            {/* CBT Assessment Breakdown Cards - Clean 4-col or 2x2 grid */}
            <div className="dashboard-metrics-grid">
              <div className="dashboard-metric-box">
                <div className="dashboard-metric-val text-primary">
                  100%
                </div>
                <div className="dashboard-metric-lbl">CBT WEIGHT</div>
              </div>

              <div className="dashboard-metric-box">
                <div className="dashboard-metric-val text-emerald">
                  {category?.totalQuestions || 100}
                </div>
                <div className="dashboard-metric-lbl">QUESTIONS</div>
              </div>

              <div className="dashboard-metric-box">
                <div className="dashboard-metric-val text-gold">
                  {category?.timeLimitMinutes || 60}m
                </div>
                <div className="dashboard-metric-lbl">TIME LIMIT</div>
              </div>

              <div className="dashboard-metric-box">
                <div className="dashboard-metric-val text-purple">
                  {category?.passScorePercentage || 50}%
                </div>
                <div className="dashboard-metric-lbl">PASS BENCHMARK</div>
              </div>
            </div>

            <div className="dashboard-benchmark-callout">
              <span className="benchmark-icon">⚖️</span>
              <div className="benchmark-text">
                <strong>Promotion Benchmark:</strong> Candidates are graded strictly out of 100% on the Computer-Based Test (CBT). A score of 50% or above qualifies for promotion.
              </div>
            </div>
          </div>

          {!candidate?.isDemo ? (
            <button
              id="dashboard-study-materials-btn"
              className="btn btn-outline btn-lg dashboard-study-btn"
              onClick={onNavigateResources}
            >
              <BookOpen size={17} />
              <span>Open Study Materials & Digests</span>
              <ChevronRight size={17} />
            </button>
          ) : (
            <div className="dashboard-demo-lock-box">
              <strong style={{ color: 'var(--brand-danger)' }}>🔒 Study Materials Locked:</strong> Demo accounts do not have access to study materials. Please register an official candidate account to view official compendiums.
            </div>
          )}
        </div>

      </div>

      {/* 3. PERFORMANCE & PREVIOUS ATTEMPTS SECTION */}
      {latestAttempt && (
        <div className="dashboard-performance-card">
          <div className="dashboard-perf-header">
            <div className="dashboard-perf-title">
              <BarChart3 size={18} color="var(--brand-primary)" />
              <span>Latest CBT Performance Record</span>
            </div>
            <span className="dashboard-perf-date">
              Submitted on: {formatSubmitted(latestAttempt.submittedAt).date}, {formatSubmitted(latestAttempt.submittedAt).time}
            </span>
          </div>

          <div className="dashboard-perf-grid">
            <div className="dashboard-perf-stat">
              <div className="perf-label">CBT Score:</div>
              <div className={`perf-value ${latestAttempt.percentage >= 50 ? 'text-emerald' : 'text-danger'}`}>
                {latestAttempt.percentage}% ({latestAttempt.totalCorrect}/{latestAttempt.totalQuestions})
              </div>
            </div>

            <div className="dashboard-perf-stat">
              <div className="perf-label">Evaluation Status:</div>
              <span className={`badge ${latestAttempt.passed ? 'badge-emerald' : 'badge-red'} perf-badge`}>
                {latestAttempt.passed ? 'RECOMMENDED FOR PROMOTION' : 'BENCHMARK NOT MET (<50%)'}
              </span>
            </div>

            <div className="dashboard-perf-stat">
              <div className="perf-label">Exam Grade Level:</div>
              <div className="perf-value-text">
                {latestAttempt.candidate?.targetGrade || candidate?.targetGrade}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last 3 CBT examinations with date and time of submission */}
      {!isAdmin && recentAttempts.length > 0 && (
        <div className="dashboard-performance-card dashboard-history-card">
          <div className="dashboard-perf-header">
            <div className="dashboard-perf-title">
              <Clock size={18} color="var(--brand-primary)" />
              <span>Last {recentAttempts.length === 1 ? 'CBT Examination' : `${recentAttempts.length} CBT Examinations`}</span>
            </div>
          </div>

          <div className="dashboard-history-list">
            {recentAttempts.map((attempt, idx) => {
              const when = formatSubmitted(attempt.submittedAt);
              return (
                <div className="dashboard-history-row" key={`${attempt.submittedAt}-${idx}`}>
                  <div className="dashboard-history-when">
                    <div className="dashboard-history-date">{when.date}</div>
                    <div className="dashboard-history-time">{when.time}</div>
                  </div>
                  <div className="dashboard-history-grade">
                    {attempt.candidate?.targetGrade || attempt.category?.name || candidate?.targetGrade}
                  </div>
                  <div className={`dashboard-history-score ${attempt.passed ? 'text-emerald' : 'text-danger'}`}>
                    {attempt.percentage}% <span>({attempt.totalCorrect}/{attempt.totalQuestions})</span>
                  </div>
                  <span className={`badge ${attempt.passed ? 'badge-emerald' : 'badge-red'} perf-badge`}>
                    {attempt.passed ? 'PASSED' : 'NOT MET'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Change Target Promotion Grade Modal */}
      {showChangeGradeModal && (
        <div className="modal-backdrop animate-fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 10, 24, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card dashboard-grade-modal-card">
            <div className="dashboard-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="var(--brand-emerald)" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Change Target Promotion Grade
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowChangeGradeModal(false)}
                className="btn-ghost"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <p className="dashboard-modal-desc">
              Select the grade level you are seeking promotion to in the Year 2027 Promotion Exercise. Your CBT questions and regulatory syllabus will automatically update to match this category.
            </p>

            {/* Grade Selector */}
            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label htmlFor="modal-target-grade-select" className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                Target Promotion Grade:
              </label>
              <ModernSelect
                id="modal-target-grade-select"
                name="targetGrade"
                value={modalSelectedGrade}
                onChange={(e) => setModalSelectedGrade(e.target.value)}
                options={categoriesList.map((cat) => ({
                  group: `${cat.code} — ${cat.title}`,
                  options: (cat.gradeLevels || []).map((gl) => ({
                    value: gl,
                    label: `${gl} (${cat.code})`
                  }))
                }))}
                placeholder="Select Promotion Grade"
                title="Target Promotion Grade Level"
                searchable={true}
              />
            </div>

            {/* Live Preview of Matching Exam Band */}
            {modalMatchingCat && (
              <div className="dashboard-modal-preview">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--brand-emerald)', marginBottom: '0.35rem' }}>
                  <span className={`badge ${modalMatchingCat.badgeColor || 'badge-emerald'}`} style={{ fontSize: '0.7rem' }}>
                    {modalMatchingCat.code}
                  </span>
                  <span style={{ fontSize: '0.85rem' }}>{modalMatchingCat.title}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                  • Assessment: 100 Questions ({modalMatchingCat.timeLimitMinutes || 60} Mins)<br/>
                  • Pass Mark: {modalMatchingCat.passScorePercentage || 50}%<br/>
                  • Syllabus: {modalMatchingCat.psrChapters?.length || 3} PSR Chapters, {modalMatchingCat.frChapters?.length || 3} Financial Regs Chapters + 5 State Policy Materials
                </div>
              </div>
            )}

            {modalError && (
              <div className="dashboard-modal-error">
                {modalError}
              </div>
            )}

            <div className="dashboard-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowChangeGradeModal(false)}
                disabled={isSavingGrade}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveModalGrade}
                disabled={isSavingGrade || modalSelectedGrade === candidate?.targetGrade}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                {isSavingGrade ? (
                  <>
                    <Clock size={16} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Confirm & Update Grade</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}