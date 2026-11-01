import React from 'react';
import { 
  Award, 
  BookOpen, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  FileText, 
  Layers, 
  Play, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Zap,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';
import CandidateAvatar from './CandidateAvatar';

export default function CandidateDashboard({
  candidate,
  category,
  onStartExam,
  onNavigateResources,
  onNavigateSettings,
  onNavigateAdmin,
  meritHistory = []
}) {
  const isAdmin = candidate?.role === 'admin';

  // Find candidate's previous exam attempts if any
  const candidateAttempts = meritHistory.filter(
    m => m.candidate?.username === candidate?.username || m.candidate?.fullName === candidate?.fullName
  );
  const latestAttempt = candidateAttempts[0];

  const matrix = category?.assessmentMatrix || { cbtWeight: 60, spadevWeight: 40 };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.25rem 5rem' }}>
      
      {/* 1. TOP WELCOME & IDENTITY BANNER */}
      <div 
        style={{
          background: 'var(--grad-hero)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-medium)',
          padding: '2rem 1.75rem',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
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
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginTop: '1.75rem'
        }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-emerald)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <Award size={14} />
              <span>Promotion Level</span>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
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
                <Layers size={13} /> CIRCULAR ASSESSMENT MATRIX
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Circular Section 7
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Study Resources & Weightings
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Master the official Lagos State Public Service Rules (2015) and Financial Regulations before sitting for the CBT exercise.
            </p>

            {/* Assessment Breakdown Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  {matrix.cbtWeight}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>CBT WEIGHT</div>
              </div>

              {matrix.writtenWeight > 0 && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-gold)' }}>
                    {matrix.writtenWeight}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>WRITTEN</div>
                </div>
              )}

              {matrix.interviewWeight > 0 && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a78bfa' }}>
                    {matrix.interviewWeight}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>INTERVIEW</div>
                </div>
              )}

              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>
                  {matrix.spadevWeight}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>SPADEV</div>
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
              ⚖️ <strong>Eligibility Clause:</strong> An officer who scores below 50% in any of the components of the Exercise shall not be eligible for promotion.
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

    </div>
  );
}
