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

  return (
    <div className="container dashboard-container animate-fade-in">
      
      {/* 1. TOP WELCOME & IDENTITY BANNER */}
      <div className="dashboard-hero">
        <div style={{
          position: 'absolute',
          right: '-20px',
          top: '-20px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <CandidateAvatar 
              name={candidate?.fullName} 
              size={72} 
              fontSize="1.75rem"
              style={{ border: '3px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <span className={`badge ${isAdmin ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.725rem', padding: '0.2rem 0.65rem' }}>
                  {isAdmin ? 'Commission Administrator' : 'Verified Promotion Candidate'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {candidate?.serviceNumber || 'LASG/CSC/2027'}
                </span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.85rem)', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                {candidate?.fullName}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0.35rem 0 0' }}>
                Year 2027 Lagos State Civil Service Promotion Exercise Portal
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!candidate?.isDemo ? (
              <button
                id="dashboard-settings-btn"
                className="btn btn-secondary"
                onClick={onNavigateSettings}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.15rem' }}
              >
                <Settings size={16} />
                <span>Account Settings</span>
              </button>
            ) : (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  background: 'rgba(245, 158, 11, 0.15)', 
                  border: '1px solid rgba(245, 158, 11, 0.3)', 
                  padding: '0.5rem 0.85rem', 
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--brand-amber)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
                title="Demo candidate accounts cannot modify name, ministry, cadre, or password"
              >
                <span>Demo Mode (Read-Only)</span>
              </div>
            )}

            {isAdmin && (
              <button
                id="dashboard-admin-btn"
                className="btn btn-gold"
                onClick={onNavigateAdmin}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.15rem' }}
              >
                <ShieldCheck size={16} />
                <span>Admin Suite</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 PRIMARY PROFILE HIGHLIGHT CARDS (Name, Level, Ministry, Cadre) */}
        <div className="dashboard-profile-cards">
          {/* Card 1: Candidate Name */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <User size={14} />
              <span>Full Name</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {candidate?.fullName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              @{candidate?.username}
            </div>
          </div>

          {/* Card 2: Promotion Grade Level */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-emerald)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Award size={14} />
                <span>Promotion Level</span>
              </div>
              {!candidate?.isDemo && (
                <button
                  type="button"
                  id="dashboard-change-grade-btn"
                  onClick={handleOpenGradeModal}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--brand-emerald)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.55rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="Change Target Promotion Grade"
                >
                  <Edit3 size={11} />
                  <span>Change Grade</span>
                </button>
              )}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-emerald)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {candidate?.targetGrade || 'GL 09 to 10'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Category: {category?.code || 'GL 06 - 10'} (Cut-off: {category?.passScorePercentage || 50}%)
            </div>
          </div>

          {/* Card 3: Ministry / MDA */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <Building2 size={14} />
              <span>Ministry / MDA</span>
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={candidate?.ministry}>
              {candidate?.ministry || 'Lagos State Civil Service'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              State Secretariat, Alausa, Ikeja
            </div>
          </div>

          {/* Card 4: Cadre / Professional Track */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <Briefcase size={14} />
              <span>Cadre / Track</span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={candidate?.cadre}>
              {candidate?.cadre || 'Administrative Officer'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Official Designation
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT GRID */}
      <div className="dashboard-main-grid">
        
        {/* ACTION TILE: START CBT PROMOTION EXAM */}
        <div style={{
          background: 'var(--bg-card)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          textAlign: 'left',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                <Zap size={13} /> 100 QUESTIONS • TIMED SESSION
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>
                {category?.timeLimitMinutes || 90} Minutes
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Official Year 2027 CBT Promotion Examination
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Enter the computer-based test platform calibrated for <strong>{candidate?.targetGrade}</strong>. Exactly 100 questions covering your prescribed Lagos State PSR and Financial Regulations chapters, with full statutory rule citations upon completion.
            </p>

            {/* Prescribed Chapter Summary */}
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-emerald)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={14} />
                Prescribed Reading Scope for {category?.code}:
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                <div>• <strong>Public Service Rules:</strong> {category?.psrChapters?.map(p => `Ch.${p.chapter}`).join(', ') || 'Ch. 1-10'}</div>
                <div style={{ marginTop: '0.2rem' }}>• <strong>Financial Regulations:</strong> {category?.frChapters?.map(f => `Ch.${f.chapter}`).join(', ') || 'Ch. 1-8'}</div>
              </div>
            </div>
          </div>

          <button
            id="dashboard-start-exam-btn"
            className="btn btn-emerald btn-lg"
            onClick={onStartExam}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', minHeight: '52px', fontWeight: 700, fontSize: '1rem' }}
          >
            <Play size={18} fill="currentColor" />
            <span>Launch 100-Question Exam</span>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* STUDY RESOURCES & ASSESSMENT MATRIX TILE */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          textAlign: 'left',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                <Layers size={13} /> CBT EXAMINATION STRUCTURE
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                100% CBT Evaluation
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Study Resources & CBT Format
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Master the official Lagos State Public Service Rules (2015) and Financial Regulations before sitting for the CBT exercise.
            </p>

            {/* CBT Assessment Breakdown Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>CBT WEIGHT</div>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>
                  {category?.totalQuestions || 100}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>QUESTIONS</div>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-gold)' }}>
                  {category?.timeLimitMinutes || 90}m
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>TIME LIMIT</div>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a78bfa' }}>
                  {category?.passScorePercentage || 50}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>PASS BENCHMARK</div>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(59, 130, 246, 0.08)', 
              border: '1px solid rgba(59, 130, 246, 0.25)', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.775rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem'
            }}>
              ⚖️ <strong>Promotion Benchmark:</strong> Candidates are graded strictly out of 100% on the Computer-Based Test (CBT). A score of 50% or above qualifies for promotion.
            </div>
          </div>

          {!candidate?.isDemo ? (
            <button
              id="dashboard-study-materials-btn"
              className="btn btn-outline btn-lg"
              onClick={onNavigateResources}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', minHeight: '52px', fontWeight: 700 }}
            >
              <BookOpen size={18} />
              <span>Open Study Materials & Digests</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              <strong style={{ color: 'var(--brand-danger)' }}>🔒 Study Materials Locked:</strong> Demo accounts do not have access to study materials. Please register an official candidate account to view official compendiums.
            </div>
          )}
        </div>

      </div>

      {/* 3. PERFORMANCE & PREVIOUS ATTEMPTS SECTION */}
      {latestAttempt && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          textAlign: 'left',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              <BarChart3 size={18} color="var(--brand-primary)" />
              <span>Latest CBT Performance Record</span>
            </div>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Submitted on: {new Date(latestAttempt.submittedAt).toLocaleDateString()}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CBT Score:</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: latestAttempt.percentage >= 50 ? 'var(--brand-emerald)' : 'var(--brand-danger)' }}>
                {latestAttempt.percentage}% ({latestAttempt.totalCorrect}/{latestAttempt.totalQuestions})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</div>
              <span className={`badge ${latestAttempt.passed ? 'badge-emerald' : 'badge-red'}`} style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {latestAttempt.passed ? 'RECOMMENDED FOR PROMOTION' : 'BENCHMARK NOT MET (<50%)'}
              </span>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Grade:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {latestAttempt.candidate?.targetGrade || candidate?.targetGrade}
              </div>
            </div>
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
          <div className="card" style={{
            maxWidth: '520px',
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={22} color="var(--brand-emerald)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
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

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Select the grade level you are seeking promotion to in the Year 2027 Promotion Exercise. Your CBT examination questions and regulatory syllabus will automatically update to match this category.
            </p>

            {/* Grade Selector */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="modal-target-grade-select" className="form-label" style={{ fontWeight: 700 }}>
                Target Promotion Grade:
              </label>
              <select
                id="modal-target-grade-select"
                className="form-select"
                value={modalSelectedGrade}
                onChange={(e) => setModalSelectedGrade(e.target.value)}
                style={{ width: '100%' }}
              >
                {categoriesList.map((cat) => (
                  <optgroup key={cat.id} label={`${cat.code} — ${cat.title}`}>
                    {(cat.gradeLevels || []).map((gl, idx) => (
                      <option key={`${cat.id}-${idx}`} value={gl}>
                        {gl} ({cat.code})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Live Preview of Matching Exam Band */}
            {modalMatchingCat && (
              <div style={{
                padding: '0.85rem 1rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.825rem',
                color: 'var(--text-main)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--brand-emerald)', marginBottom: '0.35rem' }}>
                  <span className={`badge ${modalMatchingCat.badgeColor || 'badge-emerald'}`} style={{ fontSize: '0.7rem' }}>
                    {modalMatchingCat.code}
                  </span>
                  <span>{modalMatchingCat.title}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                  • Assessment Structure: 100 Questions ({modalMatchingCat.timeLimitMinutes || 90} Mins)<br/>
                  • Minimum Pass Mark: {modalMatchingCat.passScorePercentage || 50}%<br/>
                  • PSR & FR Scope: {modalMatchingCat.psrChapters?.length || 3} PSR Chapters, {modalMatchingCat.frChapters?.length || 3} Financial Regs Chapters
                </div>
              </div>
            )}

            {modalError && (
              <div style={{
                padding: '0.65rem 0.85rem',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                marginBottom: '1rem'
              }}>
                {modalError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
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
