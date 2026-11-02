import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  UserCheck, 
  UserPlus, 
  Lock, 
  FileText, 
  Scale, 
  Building2, 
  BarChart3, 
  Smartphone,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function HomePage({ 
  currentUser, 
  onNavigateAuth, 
  onNavigateResources, 
  onStartExamForCategory, 
  gradeCategories 
}) {
  return (
    <div className="home-page animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Hero Welcome Banner */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.04) 50%, transparent 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '3.5rem 1rem 3rem',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>
          
          {/* Official Commission Crest Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-medium)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            marginBottom: '1.25rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🏛️</span>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-emerald)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Lagos State Civil Service Commission (LSCSC)
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1rem',
            color: 'var(--text-main)',
            letterSpacing: '-0.02em'
          }}>
            Year 2027 Promotion Exercise CBT Portal
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '740px',
            margin: '0 auto 2rem'
          }}>
            The official computer-based testing, regulatory assessment, and merit evaluation platform for <strong>Lagos State Civil Servants</strong>. Prepare for promotion advancement with authentic circular-mandated questions, rule citations, and full performance analytics.
          </p>

          {/* Primary Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.85rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            {/* If user is logged in, show direct exam hall button */}
            {currentUser ? (
              <>
                <button
                  type="button"
                  id="hero-go-exam-btn"
                  className="btn btn-emerald btn-lg"
                  style={{ minWidth: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => onNavigateAuth('demo')}
                >
                  <Zap size={18} />
                  <span>Launch CBT Examination</span>
                  <ChevronRight size={18} />
                </button>
                <button
                  type="button"
                  id="hero-study-btn"
                  className="btn btn-secondary btn-lg"
                  onClick={onNavigateResources}
                  style={{ minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <BookOpen size={18} />
                  <span>Study Regulatory Compendiums</span>
                </button>
              </>
            ) : (
              <>
                {/* Unauthenticated: Instant Demo Mode First, Signup & Login */}
                <button
                  type="button"
                  id="hero-demo-btn"
                  className="btn btn-emerald btn-lg"
                  style={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => onNavigateAuth('demo')}
                  title="Instant access without registration"
                >
                  <Zap size={18} />
                  <span>1-Click Demo Mode</span>
                  <ChevronRight size={18} />
                </button>

                <button
                  type="button"
                  id="hero-login-btn"
                  className="btn btn-primary btn-lg"
                  style={{ minWidth: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => onNavigateAuth('login')}
                >
                  <UserCheck size={18} />
                  <span>Candidate Login</span>
                </button>

                <button
                  type="button"
                  id="hero-register-btn"
                  className="btn btn-secondary btn-lg"
                  style={{ minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => onNavigateAuth('register')}
                >
                  <UserPlus size={18} />
                  <span>Register Account</span>
                </button>
              </>
            )}
          </div>

          {/* Quick Statistics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>100</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Questions per Session</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>60 Mins</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Standard Time Limit</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-gold)' }}>50%</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Statutory Pass Benchmark</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-purple)' }}>GL 06 – 16</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Covered Promotion Bands</div>
            </div>
          </div>

        </div>
      </section>

      {/* Concept Explanation Section */}
      <section className="container" style={{ maxWidth: '1060px', margin: '3.5rem auto 0', padding: '0 1rem', textAlign: 'left' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
            REGULATORY FRAMEWORK & ASSESSMENT CONCEPT
          </span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: 'var(--text-main)' }}>
            How the Promotion Examination Exercise Works
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '680px', margin: '0.5rem auto 0' }}>
            In compliance with the Year 2027 Promotion Exercise Circular issued by the Lagos State Civil Service Commission, promotion eligibility is evaluated through rigorous statutory components.
          </p>
        </div>

        {/* 3 Core Examination Group Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}>
          {gradeCategories.map((cat) => (
            <div 
              key={cat.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-card)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className={`badge ${cat.badgeColor}`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {cat.code}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-emerald)' }}>
                    Pass Cut-off: {cat.passScorePercentage}%
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {cat.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {cat.description}
                </p>

                {/* Scoring Format Pill */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    EXAMINATION FORMAT:
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>CBT: <strong>100%</strong> (Graded over 100%)</span>
                    <span>• Pass Benchmark: <strong>{cat.passScorePercentage || 50}%</strong></span>
                  </div>
                </div>

                {/* Prescribed Chapters */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
                  <div>📖 <strong>Lagos State PSR:</strong> {cat.psrChapters?.map(p => `Ch.${p.chapter}`).join(', ')}</div>
                  <div style={{ marginTop: '0.2rem' }}>💰 <strong>Lagos State FR:</strong> {cat.frChapters?.map(f => `Ch.${f.chapter}`).join(', ')}</div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
                  onClick={() => onStartExamForCategory(cat)}
                >
                  <span>Practice 100 Questions for {cat.code}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights Grid */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-main)' }}>
            Key Features Built for Lagos State Civil Servants
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.12)', color: 'var(--brand-primary)', height: 'fit-content' }}>
                <Scale size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Statutory Rule Citations
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Every question card displays the exact statutory authority (e.g. <code>[PSR Chapter 2, Rule 020101]</code> or <code>[Financial Regulations Chapter 1, FR 106]</code>) so candidates learn the regulations as they test.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--brand-emerald)', height: 'fit-content' }}>
                <FileText size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Full 100-Question Review Slip
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  After submitting your test, instantly review all 100 questions. See which ones you got right, missed questions with the correct answer indicated, and the exact reference material.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--brand-gold)', height: 'fit-content' }}>
                <Smartphone size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Mobile-Optimized Exam Hall
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Features a collapsible 100-question matrix drawer on smartphones and tablets, sticky thumb-friendly action bars, and large 52px touch options for easy test-taking on the go.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--brand-purple)', height: 'fit-content' }}>
                <Building2 size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Strictly Lagos State Service
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Tailored exclusively to Lagos State Civil Service rules, State Treasury Office guidelines, Alausa ministries, and Lagos State Public Procurement Law (no federal confusion).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Footer Box */}
        <div style={{
          marginTop: '3.5rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 1.5rem'
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Ready to Begin Your Promotion Preparation?
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 1.5rem' }}>
            Try 1-Click Demo Mode right now to experience the examination engine, or register a custom candidate profile with your official name.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-emerald btn-lg"
              onClick={() => onNavigateAuth('demo')}
            >
              <Zap size={18} />
              <span>Launch 1-Click Demo Mode</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onNavigateAuth('register')}
            >
              <UserPlus size={18} />
              <span>Register Candidate Profile</span>
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}
