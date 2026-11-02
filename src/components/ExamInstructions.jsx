import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Monitor, 
  Maximize, 
  ArrowLeft, 
  Award,
  BookOpen
} from 'lucide-react';
import { DEFAULT_GRADE_CATEGORIES } from '../data/gradeLevelCategories';
import CandidateAvatar from './CandidateAvatar';

export default function ExamInstructions({ 
  candidate, 
  category, 
  onStartExam, 
  onBack 
}) {
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const safeCategory = category || DEFAULT_GRADE_CATEGORIES[0];
  const safeCandidate = candidate || {
    fullName: 'Candidate Officer',
    serviceNumber: 'LASG/CSC/2027/0001',
    cadre: 'Administrative Officer I',
    ministry: 'Lagos State Civil Service Commission',
    targetGrade: 'GL 10',
    assignedCenter: 'State Secretariat CBT Arena, Alausa, Ikeja'
  };

  return (
    <div className="instructions-container animate-fade-in" style={{ maxWidth: '980px' }}>
      {/* Official Heading */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '0.65rem' }}>
          LAGOS STATE CIVIL SERVICE COMMISSION • YEAR 2027 PROMOTION
        </span>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '0.4rem' }}>
          Lagos State Civil Service Promotion Examination
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Assessment Parameters, Prescribed Regulatory Chapters & Anti-Malpractice Directives
        </p>
      </div>

      {/* Candidate Verification Docket */}
      <div className="card" style={{ marginBottom: '2rem', background: 'var(--bg-tertiary)', borderColor: 'var(--border-medium)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <CandidateAvatar name={safeCandidate.fullName} size={80} />
          <div style={{ flex: 1, minWidth: '260px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              {safeCandidate.fullName}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Service No: <strong style={{ color: 'var(--text-main)' }}>{safeCandidate.serviceNumber}</strong> | Cadre: <strong style={{ color: 'var(--text-main)' }}>{safeCandidate.cadre}</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Ministry: <strong>{safeCandidate.ministry}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: '220px' }}>
            <div className="badge badge-blue" style={{ marginBottom: '0.35rem' }}>
              {safeCategory.code}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Target Grade: <strong style={{ color: 'var(--brand-emerald)', fontSize: '1.05rem' }}>{safeCandidate.targetGrade}</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
              Venue: {safeCandidate.assignedCenter}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Scoring Matrix */}
      <div className="card" style={{ textAlign: 'left', marginBottom: '2rem', background: 'var(--bg-card)' }}>
        <h4 style={{ fontSize: '1rem', color: 'var(--brand-emerald)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} /> Official Examination Parameters & Grading:
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Grading is strictly based on your Computer-Based Test (CBT) score over <strong>100%</strong>. A minimum score of <strong>50%</strong> is required to qualify for promotion.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1.5px solid var(--brand-primary)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Examination Format</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)' }}>100% CBT</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Graded over 100%</div>
          </div>

          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1.5px solid var(--brand-emerald)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Questions</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>{safeCategory.totalQuestions || 100} Qs</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Standard Multiple Choice</div>
          </div>

          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1.5px solid var(--brand-gold)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Allotted</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-gold)' }}>{safeCategory.timeLimitMinutes || 60} Mins</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Real-Time Clock</div>
          </div>

          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1.5px solid #a78bfa' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pass Benchmark</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa' }}>{safeCategory.passScorePercentage || 50}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Promotion Cut-Off</div>
          </div>
        </div>
      </div>

      {/* Prescribed Chapters for CBT Section 8 */}
      <div className="card" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <BookOpen size={18} color="var(--brand-primary)" />
          Prescribed Study Chapters & Materials for {safeCategory.title || safeCategory.code} (Circular Section 8):
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: 'var(--brand-emerald)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Public Service Rules (PSR 2015):
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {safeCategory.psrChapters?.map((p, idx) => (
                <li key={idx}><strong style={{ color: 'var(--text-main)' }}>{p.name}</strong></li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: 'var(--brand-gold)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Financial Regulations (FR 2009):
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {safeCategory.frChapters?.map((f, idx) => (
                <li key={idx}><strong style={{ color: 'var(--text-main)' }}>{f.name}</strong></li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', gridColumn: '1 / -1' }}>
            <div style={{ fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              State Policy, Cadres & Circular Resource Materials:
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.25rem' }}>
              {(safeCategory.additionalReferences || []).map((ref, idx) => (
                <li key={idx}><strong style={{ color: 'var(--text-main)' }}>{ref}</strong></li>
              ))}
            </ul>
          </div>
        </div>

        {category.writtenTopics && (
          <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: 'var(--brand-purple)', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              Written Assessment Scope (GL 12-16):
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Leadership, Team Work, Motivation, Delegation of Authority, and Change Management.
            </div>
          </div>
        )}
      </div>

      {/* 4 Pillars of CBT Testing */}
      <div className="instructions-grid">
        <div className="instruction-step">
          <div style={{ color: 'var(--brand-primary)', marginBottom: '0.75rem' }}>
            <Clock size={28} />
          </div>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>Time Allocation</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
            Total duration is <strong>{category.timeLimitMinutes} minutes</strong>. The server timer will automatically submit all answers upon expiry.
          </p>
        </div>

        <div className="instruction-step">
          <div style={{ color: 'var(--brand-emerald)', marginBottom: '0.75rem' }}>
            <CheckCircle size={28} />
          </div>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>Qualifying Benchmark</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
            Scoring below <strong>50%</strong> in the CBT disqualifies an officer from promotion eligibility.
          </p>
        </div>

        <div className="instruction-step">
          <div style={{ color: 'var(--brand-gold)', marginBottom: '0.75rem' }}>
            <Monitor size={28} />
          </div>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>Keyboard Shortcuts</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
            Select options quickly using keys <kbd style={{ padding: '1px 5px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}>A</kbd>, <kbd style={{ padding: '1px 5px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}>B</kbd>, <kbd style={{ padding: '1px 5px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}>C</kbd>, <kbd style={{ padding: '1px 5px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}>D</kbd> and arrows to navigate.
          </p>
        </div>

        <div className="instruction-step">
          <div style={{ color: 'var(--brand-danger)', marginBottom: '0.75rem' }}>
            <ShieldAlert size={28} />
          </div>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>Proctoring Lockdown</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
            Tab switching or minimizing the exam window is prohibited. Exceeding <strong>3 security strikes</strong> triggers instant exam lock and submission.
          </p>
        </div>
      </div>

      {/* Integrity Pledge Checkbox */}
      <div 
        className="card" 
        style={{ 
          background: pledgeChecked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-tertiary)',
          borderColor: pledgeChecked ? 'var(--brand-emerald)' : 'var(--border-subtle)',
          textAlign: 'left', 
          marginBottom: '2rem',
          cursor: 'pointer'
        }}
        onClick={() => setPledgeChecked(!pledgeChecked)}
      >
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            id="integrity-pledge-checkbox"
            checked={pledgeChecked} 
            onChange={(e) => setPledgeChecked(e.target.checked)}
            style={{ width: '20px', height: '20px', marginTop: '0.15rem', accentColor: 'var(--brand-emerald)' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              Candidate Solemn Pledge & Code of Conduct Acceptance
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              I hereby certify that I am the verified Lagos State Civil Servant candidate under Examination Roll {candidate.serviceNumber}. I agree to abide strictly by Lagos State Civil Service Examination Regulations and acknowledge that examination malpractice constitutes Gross Misconduct under Public Service Rule 040501.
            </div>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-secondary" 
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Return to Verification</span>
        </button>

        <button 
          id="start-exam-button"
          className="btn btn-emerald btn-lg" 
          disabled={!pledgeChecked}
          onClick={onStartExam}
          style={{ minWidth: '260px' }}
        >
          <Maximize size={18} />
          <span>Enter CBT Exam Hall & Begin</span>
        </button>
      </div>
    </div>
  );
}
