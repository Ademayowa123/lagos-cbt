import React, { useEffect, useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Printer, 
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  QrCode,
  Layers,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CandidateAvatar from './CandidateAvatar';
import { DEFAULT_GRADE_CATEGORIES, resolveQuestionSubjectId } from '../data/gradeLevelCategories';

export default function ExamResultView({ resultData, onRetake, onGoAdmin }) {
  // Enabled by default so candidates immediately see their complete question-by-question feedback
  const [showReview, setShowReview] = useState(true);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all', 'correct', 'incorrect', 'unanswered'

  const { 
    candidate, 
    category, 
    totalQuestions, 
    totalCorrect, 
    percentage: cbtPercentage, 
    timeSpentSeconds, 
    securityStrikes,
    submittedAt,
    userAnswers = {},
    examQuestions = [],
    sectionalScores = {}
  } = resultData || {};

  const safeCategory = category || DEFAULT_GRADE_CATEGORIES[0];
  const safeCandidate = candidate || {
    fullName: 'Candidate Officer',
    serviceNumber: 'LASG/CSC/2027/0001',
    cadre: 'Administrative Officer I',
    targetGrade: 'GL 10',
    ministry: 'Lagos State Civil Service Commission'
  };

  // Pure 100% CBT Evaluation: Pass mark is 50%
  const isOverallPassed = cbtPercentage >= (safeCategory.passScorePercentage || 50);

  // Breakdown statistics for questions
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = examQuestions.length - answeredCount;
  const incorrectCount = answeredCount - totalCorrect;

  // Accurately compute and reconcile sectional scores across all 100 questions
  const computedSectionalScores = React.useMemo(() => {
    if (Array.isArray(examQuestions) && examQuestions.length > 0) {
      const scores = {};
      for (const q of examQuestions) {
        const sId = resolveQuestionSubjectId(q, safeCategory?.id);
        const sec = (scores[sId] ||= { total: 0, correct: 0, name: sId });
        sec.total++;
        const chosen = userAnswers[q.id] !== undefined ? Number(userAnswers[q.id]) : (userAnswers[String(q.id)] !== undefined ? Number(userAnswers[String(q.id)]) : undefined);
        if (chosen !== undefined && chosen === Number(q.correctAnswer)) {
          sec.correct++;
        }
      }
      return scores;
    }
    return sectionalScores || {};
  }, [examQuestions, safeCategory?.id, userAnswers, sectionalScores]);

  // Stable docket reference and date for candidate
  const docketRef = React.useMemo(() => {
    const raw = String(safeCandidate?.serviceNumber || safeCandidate?.username || '2027');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash * 31 + raw.charCodeAt(i)) % 900000;
    }
    return String(100000 + Math.abs(hash));
  }, [safeCandidate?.serviceNumber, safeCandidate?.username]);

  const certifiedDate = React.useMemo(() => {
    try {
      return new Date(submittedAt || Date.now()).toLocaleString();
    } catch {
      return new Date().toLocaleString();
    }
  }, [submittedAt]);

  useEffect(() => {
    if (isOverallPassed) {
      try {
        confetti({
          particleCount: 130,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log("Confetti triggered");
      }
    }
  }, [isOverallPassed]);

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered review questions
  const filteredReviewQuestions = examQuestions.filter((q, idx) => {
    const selectedIdx = userAnswers[q.id];
    const isAnswered = selectedIdx !== undefined;
    const isCorrect = isAnswered && selectedIdx === q.correctAnswer;
    const isIncorrect = isAnswered && selectedIdx !== q.correctAnswer;

    if (reviewFilter === 'correct') return isCorrect;
    if (reviewFilter === 'incorrect') return isIncorrect;
    if (reviewFilter === 'unanswered') return !isAnswered;
    return true; // all
  });

  return (
    <div className="result-container animate-fade-in" style={{ maxWidth: '980px' }}>
      {/* Printable Official Slip Card */}
      <div className="result-card" id="printable-result-slip">
        {/* Slip Watermark / Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-medium)', paddingBottom: '1.5rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: '#ffffff', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>🏛️</span>
          </div>
          <h2 className="result-slip-title">
            LAGOS STATE CIVIL SERVICE COMMISSION
          </h2>
          <div className="result-slip-address">
            STATE SECRETARIAT COMPLEX, ALAUSA, IKEJA, LAGOS
          </div>
          <div className="result-slip-subtitle">
            YEAR 2027 PROMOTION EXERCISE - OFFICIAL CBT SCORECARD & FEEDBACK REPORT
          </div>
          <div className="result-slip-docket">
            Docket Ref: LSCSC/PRO/2027/CBT-{docketRef} • Certified: {certifiedDate}
          </div>
        </div>

        {/* Candidate Detail Matrix */}
        <div className="candidate-matrix-grid">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CandidateAvatar name={safeCandidate.fullName} size={42} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Candidate Name:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>{safeCandidate.fullName}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Service / Reg No:</div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{safeCandidate.serviceNumber}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cadre:</div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{safeCandidate.cadre}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Promotion Grade:</div>
            <div style={{ fontWeight: 700, color: 'var(--brand-emerald)', fontSize: '1.05rem' }}>{safeCandidate.targetGrade}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ministry / MDA:</div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>{safeCandidate.ministry}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exam Group:</div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>{safeCategory.title || safeCategory.code}</div>
          </div>
        </div>

        {/* Big Score Presentation */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>
              <div className={`result-score-circle ${!isOverallPassed ? 'failed' : ''}`} style={{ width: '160px', height: '160px', fontSize: '3.2rem', margin: '0 auto' }}>
                <span>{cbtPercentage}%</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isOverallPassed ? 'var(--brand-emerald)' : 'var(--brand-danger)', marginTop: '0.65rem' }}>
                Official CBT Score: {totalCorrect} / {examQuestions.length || totalQuestions}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Graded strictly over 100% Computer-Based Testing
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            {isOverallPassed ? (
              <span className="badge badge-emerald result-benchmark-pill">
                <Award size={18} style={{ flexShrink: 0 }} />
                <span>RECOMMENDED FOR PROMOTION TO {safeCandidate.targetGrade}</span>
              </span>
            ) : (
              <span className="badge badge-red result-benchmark-pill">
                <XCircle size={18} style={{ flexShrink: 0 }} />
                <span>PROMOTION BENCHMARK NOT MET (&lt;{safeCategory.passScorePercentage || 50}% THRESHOLD)</span>
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto' }}>
            Per Commission Standard: Candidates must obtain a minimum score of {safeCategory.passScorePercentage || 50}% in the Computer-Based Test (CBT) to be recommended for promotion.
          </p>
        </div>

        {/* Sectional Performance Breakdown */}
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--brand-primary)" />
              Prescribed Regulatory Chapters Performance:
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Pass Benchmark: ≥50%
            </span>
          </div>

          {/* 1. Desktop & Print Table View */}
          <div className="breakdown-table-wrapper">
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th className="breakdown-domain">Regulatory Domain</th>
                  <th className="breakdown-attempted">Attempted</th>
                  <th className="breakdown-score">Score</th>
                  <th className="breakdown-percent">Domain %</th>
                  <th className="breakdown-eval">Evaluation</th>
                </tr>
              </thead>
              <tbody>
                {(safeCategory?.subjects || []).map((sub, idx) => {
                  const sec = computedSectionalScores[sub.id] || { total: 0, correct: 0 };
                  const subPerc = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;
                  const isPass = subPerc >= 50;

                  return (
                    <tr key={idx}>
                      <td className="breakdown-domain">
                        <div style={{ fontWeight: 600 }}>{sub.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Weight: {sub.weight}%</div>
                      </td>
                      <td className="breakdown-attempted">{sec.total} Questions</td>
                      <td className="breakdown-score" style={{ fontFamily: 'var(--font-mono)' }}>{sec.correct} / {sec.total}</td>
                      <td className="breakdown-percent" style={{ fontWeight: 700, color: isPass ? 'var(--brand-emerald)' : 'var(--brand-danger)' }}>
                        {subPerc}%
                      </td>
                      <td className="breakdown-eval">
                        <span className={`badge ${isPass ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                          {isPass ? 'Competent (≥50%)' : 'Sub-Benchmark'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 2. Mobile Responsive Cards View (Active on mobile viewports <= 768px) */}
          <div className="breakdown-mobile-cards">
            {(safeCategory?.subjects || []).map((sub, idx) => {
              const sec = computedSectionalScores[sub.id] || { total: 0, correct: 0 };
              const subPerc = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;
              const isPass = subPerc >= 50;

              return (
                <div 
                  key={idx} 
                  className={`breakdown-card ${isPass ? 'passed' : 'failed'}`}
                >
                  <div className="breakdown-card-header">
                    <div>
                      <div className="breakdown-card-title">{sub.name}</div>
                      <div className="breakdown-card-meta">
                        <span className="badge-subtle">Weight: {sub.weight}%</span>
                      </div>
                    </div>
                    <span className={`badge ${isPass ? 'badge-emerald' : 'badge-amber'} breakdown-card-status`}>
                      {isPass ? 'Competent' : 'Sub-Benchmark'}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="breakdown-progress-track">
                    <div 
                      className={`breakdown-progress-fill ${isPass ? 'bg-emerald' : 'bg-danger'}`}
                      style={{ width: `${Math.min(100, subPerc)}%` }}
                    />
                  </div>

                  {/* 3 Stats Grid */}
                  <div className="breakdown-card-stats">
                    <div className="breakdown-stat-col">
                      <span className="stat-label">ATTEMPTED</span>
                      <span className="stat-value">{sec.total} Questions</span>
                    </div>
                    <div className="breakdown-stat-col">
                      <span className="stat-label">SCORE</span>
                      <span className="stat-value mono">{sec.correct} / {sec.total}</span>
                    </div>
                    <div className="breakdown-stat-col">
                      <span className="stat-label">DOMAIN %</span>
                      <span className={`stat-value perc ${isPass ? 'text-emerald' : 'text-danger'}`}>{subPerc}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proctoring & Integrity Audit Docket */}
        <div className="result-audit-docket">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={20} color="var(--brand-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CBT Time Taken</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatSeconds(timeSpentSeconds)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={20} color={securityStrikes === 0 ? "var(--brand-emerald)" : "var(--brand-danger)"} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proctoring Strikes</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {securityStrikes === 0 ? "0 Violations (Clean Audit)" : `${securityStrikes} Warning(s)`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <QrCode size={20} color="var(--brand-gold)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Digital Security Seal</div>
              <div style={{ fontWeight: 600, fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                SHA256: 9b2d...f410
              </div>
            </div>
          </div>
        </div>

        {/* Commission Official Footer for Print */}
        <div className="print-only" style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #ccc', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ borderBottom: '1px solid black', width: '220px', marginBottom: '0.25rem' }}></div>
              <div style={{ fontSize: '0.8rem' }}>Director of Examinations (CSC)</div>
            </div>
            <div>
              <div style={{ borderBottom: '1px solid black', width: '220px', marginBottom: '0.25rem' }}></div>
              <div style={{ fontSize: '0.8rem' }}>Permanent Secretary / Commissioner</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Excluded from Print) */}
      <div className="result-actions-bar no-print">
        <button 
          id="print-slip-btn"
          className="btn btn-emerald btn-lg" 
          onClick={handlePrint}
        >
          <Printer size={18} />
          <span>Print Official Clearance Slip</span>
        </button>

        <button 
          id="toggle-review-btn"
          className="btn btn-secondary btn-lg" 
          onClick={() => setShowReview(!showReview)}
        >
          <FileText size={18} />
          <span>{showReview ? "Collapse Detailed Feedback" : "Show All 100 Questions Feedback"}</span>
          {showReview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <button 
          id="retake-exam-btn"
          className="btn btn-outline btn-lg" 
          onClick={onRetake}
        >
          <RotateCcw size={18} />
          <span>Test Another Candidate</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* DETAILED QUESTION FEEDBACK & RESOURCE CITATION REPORT */}
      {/* ================================================================= */}
      {showReview && (
        <div className="no-print animate-fade-in" style={{ marginTop: '3rem', textAlign: 'left' }}>
          <div style={{ borderBottom: '2px solid var(--border-medium)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.45rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
              Complete Examination Question Feedback & Resource Material Locator
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Detailed breakdown of all {examQuestions.length} questions. See questions answered correctly, missed answers with correct choices, and the exact chapters in the reference materials where the solutions are found.
            </p>
          </div>

          {/* Feedback Filter Tabs */}
          <div className="review-filter-bar">
            <button 
              id="filter-all-questions-btn"
              className={`btn btn-sm ${reviewFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setReviewFilter('all')}
            >
              All Questions ({examQuestions.length})
            </button>
            <button 
              id="filter-correct-btn"
              className={`btn btn-sm ${reviewFilter === 'correct' ? 'btn-emerald' : 'btn-secondary'}`}
              onClick={() => setReviewFilter('correct')}
            >
              ✓ Answered Correctly ({totalCorrect})
            </button>
            <button 
              id="filter-incorrect-btn"
              className={`btn btn-sm ${reviewFilter === 'incorrect' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setReviewFilter('incorrect')}
            >
              ✗ Missed / Incorrect ({incorrectCount})
            </button>
            {unansweredCount > 0 && (
              <button 
                id="filter-unanswered-btn"
                className={`btn btn-sm ${reviewFilter === 'unanswered' ? 'btn-gold' : 'btn-secondary'}`}
                onClick={() => setReviewFilter('unanswered')}
              >
                ⚠ Unanswered ({unansweredCount})
              </button>
            )}
          </div>

          {/* Feedback Question Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredReviewQuestions.map((q) => {
              // Locate original index for question numbering
              const originalIndex = examQuestions.findIndex(item => item.id === q.id);
              const selectedIdx = userAnswers[q.id];
              const isAnswered = selectedIdx !== undefined;
              const isCorrect = isAnswered && selectedIdx === q.correctAnswer;
              const isMissed = isAnswered && selectedIdx !== q.correctAnswer;
              const isUnanswered = !isAnswered;

              let cardBorder = 'var(--border-subtle)';
              let statusBadge = null;

              if (isCorrect) {
                cardBorder = 'rgba(16, 185, 129, 0.5)';
                statusBadge = (
                  <span className="badge badge-emerald" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                    ✓ Got It Right (+1 Mark)
                  </span>
                );
              } else if (isMissed) {
                cardBorder = 'rgba(239, 68, 68, 0.5)';
                statusBadge = (
                  <span className="badge badge-red" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                    ✗ Missed / Incorrect (0 Marks)
                  </span>
                );
              } else {
                cardBorder = 'rgba(245, 158, 11, 0.5)';
                statusBadge = (
                  <span className="badge badge-amber" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                    ⚠ Unanswered (0 Marks)
                  </span>
                );
              }

              return (
                <div 
                  key={q.id}
                  id={`review-card-${originalIndex + 1}`}
                  className="card"
                  style={{ 
                    borderColor: cardBorder,
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        Question {originalIndex + 1} of {examQuestions.length}
                      </span>
                      {statusBadge}
                    </div>

                    {/* Exact Resource Material Location Badge (Matches screenshot format) */}
                    <span 
                      className="badge"
                      style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                        color: '#2563eb',
                        border: '1px solid rgba(59, 130, 246, 0.35)',
                        borderRadius: '9999px',
                        padding: '0.3rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {q.resourceMaterial || q.referenceRule || q.chapter}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.25rem', fontWeight: 500 }}>
                    {q.question}
                  </p>

                  {/* 4 Options Grid with clear Candidate Choice vs Correct Answer */}
                  <div className="review-options-grid">
                    {q.options.map((opt, optIdx) => {
                      const isCandidateChoice = selectedIdx === optIdx;
                      const isRealAnswer = q.correctAnswer === optIdx;

                      let optBg = 'var(--bg-tertiary)';
                      let optBorder = 'var(--border-subtle)';
                      let indicatorPill = null;

                      if (isRealAnswer) {
                        optBg = 'rgba(16, 185, 129, 0.14)';
                        optBorder = 'var(--brand-emerald)';
                        indicatorPill = (
                          <span style={{ fontSize: '0.725rem', color: '#10b981', fontWeight: 800 }}>
                            ✓ CORRECT ANSWER
                          </span>
                        );
                      } else if (isCandidateChoice && !isRealAnswer) {
                        optBg = 'rgba(239, 68, 68, 0.14)';
                        optBorder = 'var(--brand-danger)';
                        indicatorPill = (
                          <span style={{ fontSize: '0.725rem', color: '#ef4444', fontWeight: 800 }}>
                            ✗ YOUR CHOICE (INCORRECT)
                          </span>
                        );
                      }

                      return (
                        <div 
                          key={optIdx}
                          style={{ 
                            padding: '0.85rem 1rem', 
                            borderRadius: 'var(--radius-md)', 
                            background: optBg, 
                            border: `1.5px solid ${optBorder}`,
                            fontSize: '0.9rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '0.35rem'
                          }}
                        >
                          <div style={{ fontWeight: isRealAnswer || isCandidateChoice ? 700 : 500, color: 'var(--text-main)' }}>
                            <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </div>
                          {indicatorPill}
                        </div>
                      );
                    })}
                  </div>

                  {/* Where the Answer Can Be Found In The Resource Material */}
                  <div style={{ 
                    background: 'rgba(59, 130, 246, 0.08)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '0.85rem 1.1rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <BookOpen size={20} color="#2563eb" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Where this Answer is Found in the Resource Material:
                      </div>
                      <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                        {q.resourceMaterial || q.referenceRule || q.chapter}
                      </div>
                    </div>
                  </div>

                  {/* Regulatory Explanation */}
                  <div style={{ 
                    padding: '0.75rem 1.1rem', 
                    background: 'var(--bg-input)', 
                    borderRadius: 'var(--radius-md)', 
                    borderLeft: '4px solid var(--brand-emerald)',
                    fontSize: '0.875rem'
                  }}>
                    <strong style={{ color: 'var(--brand-emerald)' }}>Official Rule Rationale: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
