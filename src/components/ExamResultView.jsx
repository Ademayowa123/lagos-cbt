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
  } = resultData;

  const matrix = category.assessmentMatrix || { cbtWeight: 60, spadevWeight: 40 };

  // Calculate composite score based on circular parameters
  const spadevScore = candidate.spadevScore || 75;
  const writtenScore = candidate.writtenScore || 70;
  const interviewScore = candidate.interviewScore || 75;

  let compositeScore = 0;
  let componentsEligible = true;

  if (category.code === "GL 06 - 10") {
    const cbtContribution = (cbtPercentage * matrix.cbtWeight) / 100;
    const spadevContribution = (spadevScore * matrix.spadevWeight) / 100;
    compositeScore = Math.round(cbtContribution + spadevContribution);

    // Circular: "An officer who scores below 50% in any of the components of the Exercise shall not be eligible for promotion"
    if (cbtPercentage < 50 || spadevScore < 50) {
      componentsEligible = false;
    }
  } else {
    // GL 12-14 and GL 15-16
    const cbtContribution = (cbtPercentage * matrix.cbtWeight) / 100;
    const writtenContribution = (writtenScore * (matrix.writtenWeight || 30)) / 100;
    const interviewContribution = (interviewScore * (matrix.interviewWeight || 20)) / 100;
    const spadevContribution = (spadevScore * (matrix.spadevWeight || 20)) / 100;
    compositeScore = Math.round(cbtContribution + writtenContribution + interviewContribution + spadevContribution);

    if (cbtPercentage < 50 || writtenScore < 50 || interviewScore < 50 || spadevScore < 50) {
      componentsEligible = false;
    }
  }

  const isOverallPassed = componentsEligible && compositeScore >= 50;

  // Breakdown statistics for questions
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = examQuestions.length - answeredCount;
  const incorrectCount = answeredCount - totalCorrect;

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
          <h2 style={{ fontSize: '1.65rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            LAGOS STATE CIVIL SERVICE COMMISSION
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
            STATE SECRETARIAT COMPLEX, ALAUSA, IKEJA, LAGOS
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--brand-emerald)', fontWeight: 700, letterSpacing: '0.04em' }}>
            YEAR 2027 PROMOTION EXERCISE - OFFICIAL CBT SCORECARD & FEEDBACK REPORT
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Docket Ref: LSCSC/PRO/2027/CBT-{Math.floor(100000 + Math.random() * 900000)} • Certified: {new Date(submittedAt).toLocaleString()}
          </div>
        </div>

        {/* Candidate Detail Matrix */}
        <div style={{ 
          background: 'var(--bg-tertiary)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          textAlign: 'left',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CandidateAvatar name={candidate.fullName} size={42} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Candidate Name:</div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>{candidate.fullName}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Service / Reg No:</div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{candidate.serviceNumber}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cadre:</div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{candidate.cadre}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Promotion Grade:</div>
            <div style={{ fontWeight: 700, color: 'var(--brand-emerald)', fontSize: '1.05rem' }}>{candidate.targetGrade}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ministry / MDA:</div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>{candidate.ministry}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exam Group:</div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>{category.title}</div>
          </div>
        </div>

        {/* Big Score Presentation */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div className={`result-score-circle ${cbtPercentage < 50 ? 'failed' : ''}`} style={{ width: '135px', height: '135px', fontSize: '2.4rem' }}>
                <span>{cbtPercentage}%</span>
              </div>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '0.35rem' }}>
                CBT Score ({totalCorrect} of {examQuestions.length} Questions)
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border-medium)', paddingLeft: '2rem' }}>
              <div className={`result-score-circle ${!isOverallPassed ? 'failed' : ''}`} style={{ width: '150px', height: '150px', fontSize: '2.75rem' }}>
                <span>{compositeScore}%</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-emerald)', marginTop: '0.35rem' }}>
                Composite Promotion Score
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', marginBottom: '0.75rem' }}>
            {isOverallPassed ? (
              <span className="badge badge-emerald" style={{ fontSize: '1.05rem', padding: '0.55rem 1.65rem' }}>
                <Award size={18} /> RECOMMENDED FOR PROMOTION TO {candidate.targetGrade}
              </span>
            ) : (
              <span className="badge badge-red" style={{ fontSize: '1.05rem', padding: '0.55rem 1.65rem' }}>
                <XCircle size={18} /> PROMOTION BENCHMARK NOT MET (&lt;50% THRESHOLD)
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Per Call Circular Section 7: An officer scoring below 50% in any exercise component is ineligible for promotion.
          </p>
        </div>

        {/* Circular Assessment Matrix Breakdown Card */}
        <div style={{ 
          background: 'var(--bg-tertiary)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1.25rem',
          textAlign: 'left',
          marginBottom: '2rem'
        }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--brand-primary)' }}>
            <Layers size={17} /> Circular Assessment Components Breakdown:
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CBT ({matrix.cbtWeight}%)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: cbtPercentage >= 50 ? 'var(--brand-emerald)' : 'var(--brand-danger)' }}>
                {cbtPercentage}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                Weighted: {Math.round((cbtPercentage * matrix.cbtWeight) / 100)}%
              </div>
            </div>

            {matrix.writtenWeight > 0 && (
              <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Written ({matrix.writtenWeight}%)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: writtenScore >= 50 ? 'var(--brand-emerald)' : 'var(--brand-danger)' }}>
                  {writtenScore}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                  Weighted: {Math.round((writtenScore * matrix.writtenWeight) / 100)}%
                </div>
              </div>
            )}

            {matrix.interviewWeight > 0 && (
              <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interview ({matrix.interviewWeight}%)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: interviewScore >= 50 ? 'var(--brand-emerald)' : 'var(--brand-danger)' }}>
                  {interviewScore}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                  Weighted: {Math.round((interviewScore * matrix.interviewWeight) / 100)}%
                </div>
              </div>
            )}

            <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SPADEV ({matrix.spadevWeight}%)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: spadevScore >= 50 ? 'var(--brand-emerald)' : 'var(--brand-danger)' }}>
                {spadevScore}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                Weighted: {Math.round((spadevScore * matrix.spadevWeight) / 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Sectional Performance Breakdown */}
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={17} color="var(--brand-primary)" />
            Prescribed Regulatory Chapters Performance:
          </h4>

          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Regulatory Domain</th>
                <th>Attempted</th>
                <th>Score</th>
                <th>Domain %</th>
                <th>Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {category.subjects.map((sub, idx) => {
                const sec = sectionalScores[sub.id] || { total: 0, correct: 0 };
                const subPerc = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;
                const isPass = subPerc >= 50;

                return (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{sub.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Weight: {sub.weight}%</div>
                    </td>
                    <td>{sec.total} Questions</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{sec.correct} / {sec.total}</td>
                    <td style={{ fontWeight: 700, color: isPass ? 'var(--brand-emerald)' : 'var(--brand-danger)' }}>
                      {subPerc}%
                    </td>
                    <td>
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

        {/* Proctoring & Integrity Audit Docket */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          background: 'var(--bg-tertiary)', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)',
          textAlign: 'left',
          marginBottom: '2rem'
        }}>
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
      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
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
