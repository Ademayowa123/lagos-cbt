import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Clock, 
  Flag, 
  Calculator, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Send,
  HelpCircle,
  ShieldAlert,
  LayoutGrid,
  X,
  Lock,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import CalculatorModal from './CalculatorModal';
import CandidateAvatar from './CandidateAvatar';
import { api } from '../api';
import { DEFAULT_GRADE_CATEGORIES, resolveQuestionSubjectId } from '../data/gradeLevelCategories';
import { get100ExamQuestionsForCategory } from '../data/defaultQuestions';
import { 
  getActiveExamSession, 
  setActiveExamSession, 
  clearActiveExamSession, 
  saveExamQuestionIndex, 
  getExamQuestionIndex, 
  getExamBackupKey,
  saveCachedExamSession,
  getCachedExamSession,
  getCachedAnswers,
  getCachedFlagged
} from '../data/examSession';

// Unbiased shuffle (Fisher-Yates with crypto randomness)
const shuffleList = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Offline fallback: random question order AND random option order, with the correct answer moved to match
const buildLocalExam = (category) =>
  shuffleList(get100ExamQuestionsForCategory(category)).map((q) => {
    const order = shuffleList(q.options.map((_, i) => i));
    return { ...q, options: order.map((i) => q.options[i]), correctAnswer: order.indexOf(q.correctAnswer) };
  });

export default function CBTExamEngine({
  candidate,
  category: categoryProp,
  onExamSubmit,
  onExit
}) {
  const safeCategory = categoryProp || DEFAULT_GRADE_CATEGORIES[0];
  const safeCandidate = candidate || {
    fullName: 'Candidate Officer',
    serviceNumber: 'LASG/CSC/2027/0001',
    cadre: 'Administrative Officer I',
    ministry: 'Lagos State Civil Service Commission'
  };

  const storageKey = getExamBackupKey(safeCandidate?.id, safeCategory?.id);

  // Synchronously resume the exam session questions without flash or delay
  const [session, setSession] = useState(() => {
    return getCachedExamSession(safeCandidate?.id, safeCategory?.id);
  });
  const [loadError, setLoadError] = useState('');
  const examQuestions = session?.questions || [];
  const category = session?.category || safeCategory;

  // Synchronously resume at the exact question index where candidate stopped
  const [currentIndex, setCurrentIndex] = useState(() => {
    return getExamQuestionIndex(safeCandidate?.id, safeCategory?.id);
  });
  const [userAnswers, setUserAnswers] = useState(() => {
    return getCachedAnswers(safeCandidate?.id, safeCategory?.id);
  });
  const [flaggedQuestions, setFlaggedQuestions] = useState(() => {
    return getCachedFlagged(safeCandidate?.id, safeCategory?.id);
  });
  const [paletteFilter, setPaletteFilter] = useState(() => {
    try {
      return localStorage.getItem('cbt_palette_filter') || 'all';
    } catch (e) {
      return 'all';
    }
  });
  const [fontSize, setFontSize] = useState(() => {
    try {
      return localStorage.getItem('cbt_font_size') || 'md';
    } catch (e) {
      return 'md';
    }
  });
  const [isCalcOpen, setIsCalcOpen] = useState(() => {
    try {
      return localStorage.getItem('cbt_calc_open') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [securityStrikes, setSecurityStrikes] = useState(0);
  const [showStrikeWarning, setShowStrikeWarning] = useState(false);
  const [showViolationLockoutModal, setShowViolationLockoutModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState(new Date().toLocaleTimeString());
  const [autosaveFailed, setAutosaveFailed] = useState(false);

  // 5-Minute Warning & Submission States
  const [hasShown5MinWarning, setHasShown5MinWarning] = useState(false);
  const [showFiveMinWarningModal, setShowFiveMinWarningModal] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);

  // Time left comes from the server clock (ends-at time); synchronously resumed on reload
  const [timeLeft, setTimeLeft] = useState(() => {
    const cached = getCachedExamSession(safeCandidate?.id, safeCategory?.id);
    if (cached?.endsAt) {
      return Math.max(0, Math.round((cached.endsAt - Date.now()) / 1000));
    }
    return (safeCategory?.timeLimitMinutes || 60) * 60;
  });
  const endsAtRef = useRef(0);
  const clockOffsetRef = useRef(0);

  // Initialize endsAt from cache immediately
  useEffect(() => {
    const cached = getCachedExamSession(safeCandidate?.id, safeCategory?.id);
    if (cached?.endsAt) {
      endsAtRef.current = cached.endsAt;
    }
  }, [safeCandidate?.id, safeCategory?.id]);

  // Latest values for the save/submit calls
  const answersRef = useRef({});
  const flaggedRef = useRef({});
  const strikesRef = useRef(0);
  const submittingRef = useRef(false);
  answersRef.current = userAnswers;
  flaggedRef.current = flaggedQuestions;
  strikesRef.current = securityStrikes;

  // Persist current question index whenever candidate navigates to another question
  useEffect(() => {
    saveExamQuestionIndex(safeCandidate?.id, safeCategory?.id, currentIndex);
  }, [currentIndex, safeCandidate?.id, safeCategory?.id]);

  // Exam Lockdown: trap browser Back/Forward navigation and warn on window close/reload
  useEffect(() => {
    if (window.location.hash !== '#exam') {
      window.location.hash = 'exam';
    }
    window.history.pushState({ inExam: true }, '', '#exam');

    const handlePopState = () => {
      if (!submittingRef.current) {
        window.history.pushState({ inExam: true }, '', '#exam');
      }
    };

    const handleBeforeUnload = (e) => {
      if (submittingRef.current) return;
      e.preventDefault();
      e.returnValue = 'Examination in progress. All answers are autosaved, but you cannot leave until you submit.';
      return e.returnValue;
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Start the exam on the server, or resume it with the saved answers and the time really left
  useEffect(() => {
    let cancelled = false;
    let cachedAnswers = getCachedAnswers(safeCandidate?.id, safeCategory?.id);
    let cachedFlagged = getCachedFlagged(safeCandidate?.id, safeCategory?.id);

    api('/exam/start', { method: 'POST', body: { categoryId: safeCategory?.id } })
      .then((s) => {
        if (cancelled) return;
        endsAtRef.current = s.endsAt;
        clockOffsetRef.current = s.serverNow - Date.now();
        setSession(s);
        saveCachedExamSession(safeCandidate?.id, safeCategory?.id, s);
        setActiveExamSession({
          candidateId: safeCandidate?.id,
          categoryId: safeCategory?.id,
          endsAt: s.endsAt,
          startedAt: s.startedAt || Date.now(),
          currentIndex
        });
        const mergedAnswers = { ...cachedAnswers, ...(s.answers || {}) };
        const mergedFlagged = { ...cachedFlagged, ...(s.flagged || {}) };
        setUserAnswers(mergedAnswers);
        setFlaggedQuestions(mergedFlagged);
        setSecurityStrikes(s.securityStrikes || 0);
        setTimeLeft(s.remainingSeconds);
        if (s.remainingSeconds <= 300) setHasShown5MinWarning(true);

        // Resume at saved question index
        if (s.questions?.length > 0) {
          const savedIdx = getExamQuestionIndex(safeCandidate?.id, safeCategory?.id);
          if (savedIdx >= 0 && savedIdx < s.questions.length) {
            setCurrentIndex(savedIdx);
          }
        }
      })
      .catch((err) => {
        // Resilient fallback: initialize local 100-question session so exam starts even if offline
        if (!cancelled) {
          const rawQ = buildLocalExam(safeCategory);
          const now = Date.now();
          const durationSec = (safeCategory.timeLimitMinutes || 60) * 60;
          const fallbackSession = {
            examId: 'local-' + now,
            category: safeCategory,
            startedAt: now,
            endsAt: now + durationSec * 1000,
            remainingSeconds: durationSec,
            serverNow: now,
            questions: rawQ.map(({ id, question, options, subjectId, chapter, resourceMaterial }) => ({
              id, question, options, subjectId, chapter, resourceMaterial
            })),
            rawQuestions: rawQ,
            answers: cachedAnswers,
            flagged: cachedFlagged,
            securityStrikes: 0,
            isLocal: true
          };
          endsAtRef.current = fallbackSession.endsAt;
          clockOffsetRef.current = 0;
          setSession(fallbackSession);
          saveCachedExamSession(safeCandidate?.id, safeCategory?.id, fallbackSession);
          setActiveExamSession({
            candidateId: safeCandidate?.id,
            categoryId: safeCategory?.id,
            endsAt: fallbackSession.endsAt,
            startedAt: fallbackSession.startedAt,
            currentIndex
          });
          setUserAnswers(cachedAnswers);
          setFlaggedQuestions(cachedFlagged);
          setTimeLeft(durationSec);

          if (fallbackSession.questions?.length > 0) {
            const savedIdx = getExamQuestionIndex(safeCandidate?.id, safeCategory?.id);
            if (savedIdx >= 0 && savedIdx < fallbackSession.questions.length) {
              setCurrentIndex(savedIdx);
            }
          }
        }
      });
    return () => { cancelled = true; };
  }, [safeCandidate?.id, safeCategory?.id, safeCategory?.timeLimitMinutes, storageKey]);

  // Final submission: the server marks the answers and returns the result (with local fallback)
  const handleFinalSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsAutoSubmitting(true);

    clearActiveExamSession(safeCandidate?.id, safeCategory?.id);
    const answersToSend = answersRef.current || {};

    try {
      const result = await api('/exam/submit', {
        method: 'POST',
        body: { answers: answersToSend, securityStrikes: strikesRef.current }
      });
      clearActiveExamSession(safeCandidate?.id, safeCategory?.id);
      try {
        localStorage.removeItem('cbt_font_size');
        localStorage.removeItem('cbt_palette_filter');
        localStorage.removeItem('cbt_calc_open');
      } catch (e) {}
      onExamSubmit(result);
      return;
    } catch (err) {
      // Local scoring fallback
      const pool = session?.rawQuestions || get100ExamQuestionsForCategory(category);
      const answers = answersToSend;
      let totalCorrect = 0;
      const sectionalScores = {};
      for (const q of pool) {
        const chosen = answers[q.id] !== undefined ? Number(answers[q.id]) : (answers[String(q.id)] !== undefined ? Number(answers[String(q.id)]) : undefined);
        const ok = chosen !== undefined && chosen === Number(q.correctAnswer);
        if (ok) totalCorrect++;
        const sId = q.subjectId || resolveQuestionSubjectId(q, category?.id);
        const s = (sectionalScores[sId] ||= { total: 0, correct: 0, name: sId });
        s.total++;
        if (ok) s.correct++;
      }
      const percentage = Math.round((totalCorrect / (pool.length || 100)) * 100);
      const localResult = {
        candidate: safeCandidate,
        category,
        totalQuestions: pool.length,
        totalCorrect,
        percentage,
        passed: percentage >= (category?.passScorePercentage || 50),
        sectionalScores,
        securityStrikes: strikesRef.current || 0,
        timeSpentSeconds: Math.round(((session?.endsAt || Date.now()) - (session?.startedAt || Date.now())) / 1000),
        submittedAt: new Date().toISOString(),
        userAnswers: answers,
        examQuestions: pool
      };
      clearActiveExamSession(safeCandidate?.id, safeCategory?.id);
      try {
        localStorage.removeItem('cbt_font_size');
        localStorage.removeItem('cbt_palette_filter');
        localStorage.removeItem('cbt_calc_open');
      } catch (e) {}
      onExamSubmit(localResult);
      return;
    }
  }, [category, onExamSubmit, safeCandidate, safeCategory?.id, session]);

  // 5-Minute Warning Trigger (at exactly 300 seconds)
  useEffect(() => {
    if (timeLeft <= 300 && timeLeft > 0 && !hasShown5MinWarning) {
      setHasShown5MinWarning(true);
      setShowFiveMinWarningModal(true);

      // Audible alert notification
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {}
    }
  }, [timeLeft, hasShown5MinWarning]);

  // Countdown from the server's end time; submits automatically at 00:00
  useEffect(() => {
    if (!session) return;
    const tick = () => {
      const left = Math.max(0, Math.round((endsAtRef.current - (Date.now() + clockOffsetRef.current)) / 1000));
      setTimeLeft(left);
      if (left <= 0) handleFinalSubmit();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session, handleFinalSubmit]);

  // Autosave to the server (with local backup persistence)
  const saveNow = useCallback(async () => {
    if (submittingRef.current) return;
    const currentAns = answersRef.current || {};
    const currentFlg = flaggedRef.current || {};
    const currentStrikes = strikesRef.current || 0;

    // Instantly save to local storage
    try {
      localStorage.setItem(`${storageKey}_answers`, JSON.stringify(currentAns));
      localStorage.setItem(`${storageKey}_flagged`, JSON.stringify(currentFlg));
    } catch (e) {}

    if (session?.isLocal) {
      setAutosaveFailed(false);
      setLastAutoSaveTime(new Date().toLocaleTimeString());
      return;
    }

    try {
      await api('/exam/answers', {
        method: 'PUT',
        body: { answers: currentAns, flagged: currentFlg, securityStrikes: currentStrikes }
      });
      setAutosaveFailed(false);
      setLastAutoSaveTime(new Date().toLocaleTimeString());
    } catch (err) {
      if (err.code === 'EXAM_ENDED') {
        handleFinalSubmit();
      } else {
        // If server connection is temporarily down, answers are still safely stored locally
        setAutosaveFailed(true);
      }
    }
  }, [handleFinalSubmit, safeCandidate?.id, safeCategory?.id, session?.isLocal]);

  // Save a moment after every change...
  useEffect(() => {
    if (!session) return;
    const id = setTimeout(saveNow, 1200);
    return () => clearTimeout(id);
  }, [userAnswers, flaggedQuestions, securityStrikes, session, saveNow]);

  // ...and every 20 seconds, which also retries after a dropped connection
  useEffect(() => {
    if (!session) return;
    const id = setInterval(saveNow, 20000);
    return () => clearInterval(id);
  }, [session, saveNow]);

  // Security Integrity Monitoring (Tab Switch / Window Blur)
  useEffect(() => {
    if (!session) return;
    const handleVisibilityChange = () => {
      if (!document.hidden) return;
      const next = strikesRef.current + 1;
      strikesRef.current = next;
      setSecurityStrikes(next);
      if (next >= 3) {
        setShowStrikeWarning(false);
        setShowViolationLockoutModal(true);
        // Automatically finalize submission after brief review window
        setTimeout(() => {
          handleFinalSubmit();
        }, 4500);
      } else {
        setShowStrikeWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [session, handleFinalSubmit]);

  // Keyboard Shortcuts (A, B, C, D to answer, Left/Right for navigation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSubmitModal || isCalcOpen) return;
      const currentQ = examQuestions[currentIndex];
      if (!currentQ) return;

      const key = e.key.toUpperCase();
      if (key === 'A') handleSelectOption(currentQ.id, 0);
      else if (key === 'B') handleSelectOption(currentQ.id, 1);
      else if (key === 'C') handleSelectOption(currentQ.id, 2);
      else if (key === 'D') handleSelectOption(currentQ.id, 3);
      else if (e.key === 'ArrowRight' && currentIndex < examQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, examQuestions, isCalcOpen, showSubmitModal, userAnswers]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // UI Preference persistence handlers
  const handleSetFontSize = (size) => {
    setFontSize(size);
    try { localStorage.setItem('cbt_font_size', size); } catch (e) {}
  };

  const handleToggleCalc = () => {
    setIsCalcOpen(prev => {
      const next = !prev;
      try { localStorage.setItem('cbt_calc_open', String(next)); } catch (e) {}
      return next;
    });
  };

  const handleSetPaletteFilter = (filter) => {
    setPaletteFilter(filter);
    try { localStorage.setItem('cbt_palette_filter', filter); } catch (e) {}
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setUserAnswers(prev => {
      const next = {
        ...prev,
        [questionId]: optionIdx
      };
      try {
        localStorage.setItem(`${storageKey}_answers`, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleClearAnswer = (questionId) => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[questionId];
      try {
        localStorage.setItem(`${storageKey}_answers`, JSON.stringify(copy));
      } catch (e) {}
      return copy;
    });
  };

  const handleToggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const next = {
        ...prev,
        [questionId]: !prev[questionId]
      };
      try {
        localStorage.setItem(`${storageKey}_flagged`, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Timer Formatting
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft < 300) return 'cbt-timer-critical';
    if (timeLeft < 600) return 'cbt-timer-warning';
    return 'cbt-timer-normal';
  };

  const currentQ = examQuestions[currentIndex] || examQuestions[0];
  const isCurrentAnswered = currentQ ? (userAnswers[currentQ.id] !== undefined || userAnswers[String(currentQ.id)] !== undefined) : false;
  const isCurrentFlagged = currentQ ? (!!flaggedQuestions[currentQ.id] || !!flaggedQuestions[String(currentQ.id)]) : false;

  // Palette Counts
  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = examQuestions.length - answeredCount;

  // Filtered Question Grid
  const filteredQuestions = examQuestions.map((q, idx) => ({ q, originalIndex: idx })).filter(item => {
    const isAns = userAnswers[item.q.id] !== undefined || userAnswers[String(item.q.id)] !== undefined;
    const isFlg = !!flaggedQuestions[item.q.id] || !!flaggedQuestions[String(item.q.id)];
    if (paletteFilter === 'answered') return isAns;
    if (paletteFilter === 'unanswered') return !isAns;
    if (paletteFilter === 'flagged') return isFlg;
    return true; // all
  });

  if (loadError || !session) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
        {loadError ? (
          <>
            <ShieldAlert size={44} style={{ color: 'var(--brand-danger)', marginBottom: '0.75rem' }} />
            <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Unable to start the examination</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{loadError}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {onExit && <button className="btn btn-secondary" onClick={onExit}>Back to dashboard</button>}
              <button className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>
            </div>
          </>
        ) : (
          <>
            <Clock size={44} style={{ color: 'var(--brand-primary)', marginBottom: '0.75rem' }} />
            <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Preparing your examination…</h2>
            <p style={{ color: 'var(--text-muted)' }}>Please wait while your questions are loaded.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`cbt-container font-${fontSize}`}>
      {/* Top Fixed Control Bar */}
      <header className="cbt-header">
        <div className="cbt-header-brand">
          <div className="cbt-seal">🏛️</div>
          <div>
            <div className="cbt-exam-title">
              LAGOS STATE CIVIL SERVICE COMMISSION
            </div>
            <div className="cbt-exam-subtitle">
              YEAR 2027 PROMOTION CBT • {category?.title || category?.code || 'GL 06 - 10'}
            </div>
          </div>
        </div>

        {/* Center Countdown Timer */}
        <div className={`cbt-timer-box ${getTimerClass()}`} id="cbt-countdown-timer">
          <Clock size={20} />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Mobile Question Matrix Trigger Button */}
        <button
          type="button"
          id="cbt-mobile-matrix-trigger"
          className="btn btn-sm btn-outline mobile-matrix-pill"
          onClick={() => setIsMobilePaletteOpen(true)}
          title="Open 100-Question Matrix"
        >
          <LayoutGrid size={15} />
          <span>Matrix (100)</span>
          <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
            {answeredCount}/100
          </span>
        </button>

        {/* Right Candidate Meta & Tools */}
        <div className="cbt-candidate-bar">
          {/* Font Controls */}
          <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-sm)' }}>
            <button 
              className={`btn btn-sm ${fontSize === 'sm' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => handleSetFontSize('sm')}
              title="Small text"
            >
              A-
            </button>
            <button 
              className={`btn btn-sm ${fontSize === 'md' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => handleSetFontSize('md')}
              title="Default text"
            >
              A
            </button>
            <button 
              className={`btn btn-sm ${fontSize === 'lg' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => handleSetFontSize('lg')}
              title="Large text"
            >
              A+
            </button>
          </div>

          {/* Calculator Trigger */}
          <button 
            id="cbt-calculator-toggle"
            className={`btn btn-sm ${isCalcOpen ? 'btn-emerald' : 'btn-secondary'}`}
            onClick={handleToggleCalc}
            title="Open Examination Calculator"
          >
            <Calculator size={16} />
            <span style={{ display: 'none', md: 'inline' }}>Calc</span>
          </button>

          {/* Fullscreen Trigger */}
          <button 
            className="btn btn-sm btn-secondary"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Candidate Profile Chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CandidateAvatar name={safeCandidate.fullName} size={34} />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {safeCandidate.fullName.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                {safeCandidate.serviceNumber ? safeCandidate.serviceNumber.split('/').pop() : '2027'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Examination Layout */}
      <main className="cbt-main-grid">
        {/* Left: Active Question Canvas */}
        <section className="cbt-question-card animate-fade-in" key={currentQ?.id}>
          <div>
            <div className="cbt-question-header">
              <div className="cbt-q-meta-group">
                <span className="cbt-q-number">
                  Question {currentIndex + 1} <span className="cbt-q-total">of {examQuestions.length}</span>
                </span>
                {(currentQ?.resourceMaterial || currentQ?.referenceRule || currentQ?.chapter || category?.code) && (
                  <div 
                    className="cbt-rule-citation-pill"
                    title={currentQ?.resourceMaterial || currentQ?.referenceRule || currentQ?.chapter || category?.code}
                  >
                    <BookOpen size={13} className="cbt-rule-icon" />
                    <span>{currentQ?.resourceMaterial || currentQ?.referenceRule || currentQ?.chapter || category?.code}</span>
                  </div>
                )}
              </div>

              <div className="cbt-q-action-tools">
                <button 
                  id="flag-question-btn"
                  className={`btn btn-sm ${isCurrentFlagged ? 'btn-gold' : 'btn-outline'}`}
                  onClick={() => handleToggleFlag(currentQ?.id)}
                  title="Flag question to review later"
                >
                  <Flag size={14} />
                  <span>{isCurrentFlagged ? "Flagged for Review" : "Flag Question"}</span>
                </button>

                {isCurrentAnswered && (
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => handleClearAnswer(currentQ?.id)}
                    title="Clear selected choice"
                  >
                    <RotateCcw size={14} />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="cbt-q-text">
              {currentQ?.question}
            </div>

            {/* Options List */}
            <div className="cbt-options-list">
              {currentQ?.options.map((opt, optIdx) => {
                const optKeys = ['A', 'B', 'C', 'D'];
                const isSelected = userAnswers[currentQ?.id] === optIdx || userAnswers[String(currentQ?.id)] === optIdx;

                return (
                  <div 
                    key={optIdx}
                    id={`q-option-${optIdx}`}
                    className={`cbt-option-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(currentQ?.id, optIdx)}
                  >
                    <div className="cbt-option-key">
                      {optKeys[optIdx]}
                    </div>
                    <div className="cbt-option-text">
                      {opt}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Action Bar */}
          <footer className="cbt-action-bar">
            <div className="cbt-action-nav-group">
              <button 
                id="cbt-prev-btn"
                className="btn btn-secondary"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
              >
                <ChevronLeft size={18} />
                <span>Previous Question</span>
              </button>

              {currentIndex < examQuestions.length - 1 ? (
                <button 
                  id="cbt-next-btn"
                  className="btn btn-primary"
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                >
                  <span>Next Question</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  id="cbt-final-review-btn"
                  className="btn btn-emerald"
                  onClick={() => setShowSubmitModal(true)}
                >
                  <Send size={16} />
                  <span>Review & Finish</span>
                </button>
              )}
            </div>

            <div className="cbt-keyboard-tip" style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Tip: Press keys <kbd style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>A</kbd>, <kbd style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>B</kbd>, <kbd style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>C</kbd>, <kbd style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>D</kbd> or arrow keys
            </div>

            <button 
              id="cbt-persistent-submit-btn"
              className="btn btn-emerald cbt-persistent-submit-btn"
              onClick={() => setShowSubmitModal(true)}
              title="Submit & Finalize Promotion Examination"
            >
              <Send size={15} />
              <span>Submit Examination ({answeredCount}/{examQuestions.length})</span>
            </button>
          </footer>
        </section>

        {/* Right: Question Palette & Proctoring Console */}
        <aside className="cbt-palette-sidebar">
          <div className="cbt-palette-card">
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', textAlign: 'left' }}>
              Question Matrix Palette
            </h4>

            {/* Quick Stats Pill */}
            <div className="cbt-palette-stats">
              <div className="cbt-stat-pill stat-answered">
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{answeredCount}</div>
                <div>Answered</div>
              </div>
              <div className="cbt-stat-pill stat-unanswered">
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{unansweredCount}</div>
                <div>Unanswered</div>
              </div>
              <div className="cbt-stat-pill stat-flagged">
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{flaggedCount}</div>
                <div>Flagged</div>
              </div>
            </div>

            {/* Palette Filters */}
            <div className="cbt-filter-tabs">
              <button 
                className={`cbt-filter-tab ${paletteFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleSetPaletteFilter('all')}
              >
                All ({examQuestions.length})
              </button>
              <button 
                className={`cbt-filter-tab ${paletteFilter === 'answered' ? 'active' : ''}`}
                onClick={() => handleSetPaletteFilter('answered')}
              >
                Answered
              </button>
              <button 
                className={`cbt-filter-tab ${paletteFilter === 'unanswered' ? 'active' : ''}`}
                onClick={() => handleSetPaletteFilter('unanswered')}
              >
                Unanswered
              </button>
              <button 
                className={`cbt-filter-tab ${paletteFilter === 'flagged' ? 'active' : ''}`}
                onClick={() => handleSetPaletteFilter('flagged')}
              >
                Flagged
              </button>
            </div>

            {/* Grid of Numbered Buttons */}
            <div className="cbt-palette-grid">
              {filteredQuestions.map(({ q, originalIndex }) => {
                const isAns = userAnswers[q.id] !== undefined || userAnswers[String(q.id)] !== undefined;
                const isFlg = !!flaggedQuestions[q.id] || !!flaggedQuestions[String(q.id)];
                const isCurr = originalIndex === currentIndex;

                let cls = 'cbt-grid-btn';
                if (isAns) cls += ' answered';
                if (isFlg) cls += ' flagged';
                if (isCurr) cls += ' current';

                return (
                  <button 
                    key={q.id}
                    id={`palette-btn-${originalIndex + 1}`}
                    className={cls}
                    onClick={() => setCurrentIndex(originalIndex)}
                    title={`Question ${originalIndex + 1}: ${isAns ? 'Answered' : 'Unanswered'}${isFlg ? ' (Flagged)' : ''}`}
                  >
                    {originalIndex + 1}
                  </button>
                );
              })}
            </div>

            {/* Autosave Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--brand-emerald)' }}>
              <CheckCircle2 size={13} />
              <span style={autosaveFailed ? { color: 'var(--brand-danger)' } : undefined}>{autosaveFailed ? 'Not saved yet. Reconnecting…' : `Autosaved securely at ${lastAutoSaveTime}`}</span>
            </div>

            {/* Submit Button Trigger */}
            <button 
              id="cbt-submit-exam-trigger"
              className="btn btn-danger" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => setShowSubmitModal(true)}
            >
              <Send size={15} />
              <span>Submit Examination</span>
            </button>
          </div>

          {/* Anti-Tamper Security Monitoring Widget */}
          <div className="card" style={{ padding: '1rem', textAlign: 'left', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={14} color="var(--brand-danger)" />
                Proctoring Watchdog
              </span>
              <span className={`badge ${securityStrikes > 0 ? 'badge-red' : 'badge-emerald'}`} style={{ fontSize: '0.7rem' }}>
                Strikes: {securityStrikes}/3
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Active browser lockdown monitors tab switching, unauthorized shortcuts, and external window blurs.
            </div>
          </div>
        </aside>
      </main>

      {/* Floating Calculator */}
      <CalculatorModal 
        isOpen={isCalcOpen} 
        onClose={() => setIsCalcOpen(false)} 
      />

      {/* Tab Switch Security Warning Modal */}
      {showStrikeWarning && createPortal(
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '480px', textAlign: 'center' }}>
            <div style={{ color: 'var(--brand-danger)', marginBottom: '1rem' }}>
              <AlertTriangle size={48} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--brand-danger)' }}>
              SECURITY BREACH WARNING
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              You navigated away from the active examination window. This incident has been logged against your service record.
            </p>
            <div className="badge badge-red" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
              Security Strike {securityStrikes} of 3 Allowed
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>
              A 3rd strike will result in immediate disqualification and automated exam submission.
            </p>
            <button 
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => setShowStrikeWarning(false)}
            >
              I Understand & Return to Examination
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* SECURITY VIOLATION LIMIT EXCEEDED MODAL (Replaces native browser alert) */}
      {showViolationLockoutModal && createPortal(
        <div className="cbt-lockout-modal-overlay animate-fade-in" style={{ zIndex: 10002 }}>
          <div className="cbt-lockout-card animate-scale-up" role="alertdialog" aria-modal="true">
            <div className="cbt-lockout-icon-box">
              <ShieldAlert size={64} />
            </div>

            <div className="cbt-lockout-badge">
              Security Protocol Strike 3 of 3 • Terminal Infraction
            </div>

            <h3 className="cbt-lockout-title">
              Security Violation Limit Exceeded
            </h3>

            <p className="cbt-lockout-desc">
              Candidate <strong>{candidate?.fullName || 'Candidate'}</strong>, the proctoring monitor recorded repeated navigation away from the active examination window. In accordance with Lagos State Civil Service Examination Integrity Regulations, your session has been locked and submitted.
            </p>

            <div className="cbt-lockout-stats">
              <div>
                <div className="cbt-lockout-stat-val" style={{ color: 'var(--brand-danger)' }}>3 / 3</div>
                <div className="cbt-lockout-stat-label">Security Strikes</div>
              </div>
              <div>
                <div className="cbt-lockout-stat-val" style={{ color: 'var(--brand-emerald)' }}>{answeredCount}</div>
                <div className="cbt-lockout-stat-label">Answers Saved</div>
              </div>
              <div>
                <div className="cbt-lockout-stat-val" style={{ color: 'var(--brand-gold)' }}>{unansweredCount}</div>
                <div className="cbt-lockout-stat-label">Unanswered</div>
              </div>
            </div>

            <button 
              type="button"
              id="cbt-proceed-lockout-results-btn"
              className="btn btn-danger btn-lg"
              style={{ width: '100%', justifyContent: 'center', fontWeight: 800, minHeight: '48px', gap: '0.5rem' }}
              onClick={handleFinalSubmit}
            >
              <Lock size={18} />
              <span>Proceed to Official Results</span>
              <ArrowRight size={18} />
            </button>

            <div className="cbt-lockout-auto-timer">
              Finalizing examination audit log and scoring records…
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Final Submission Confirmation Modal */}
      {showSubmitModal && createPortal(
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Confirm Examination Submission</h3>
              <button 
                onClick={() => setShowSubmitModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>
                Are you sure you wish to conclude and submit your promotion examination?
              </p>

              <div style={{ 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-medium)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>
                      {answeredCount}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Questions Answered</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: unansweredCount > 0 ? 'var(--brand-danger)' : 'var(--text-muted)' }}>
                      {unansweredCount}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unanswered</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-gold)' }}>
                      {flaggedCount}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Flagged Items</div>
                  </div>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <AlertTriangle size={16} />
                  <span>Attention: You still have <strong>{unansweredCount}</strong> unattempted question(s). Unanswered questions receive zero marks.</span>
                </div>
              )}

              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                Once submitted, your answers will be sealed, cryptographic hashes recorded, and results calculated against official Civil Service promotion thresholds.
              </p>
            </div>

            <div className="modal-actions">
              <button 
                id="cancel-submit-btn"
                className="btn btn-secondary"
                onClick={() => setShowSubmitModal(false)}
              >
                Return to Exam
              </button>

              <button 
                id="confirm-submit-btn"
                className="btn btn-emerald"
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmit();
                }}
              >
                <CheckCircle2 size={16} />
                <span>Yes, Finalize & Submit</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Mobile Question Palette Drawer / Bottom Sheet */}
      {isMobilePaletteOpen && (
        <div 
          className="mobile-palette-overlay animate-fade-in"
          onClick={() => setIsMobilePaletteOpen(false)}
        >
          <div 
            className="mobile-palette-modal animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-palette-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LayoutGrid size={18} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                  Question Matrix ({examQuestions.length} Items)
                </h3>
              </div>
              <button 
                id="close-mobile-palette-btn"
                className="btn btn-sm btn-ghost"
                onClick={() => setIsMobilePaletteOpen(false)}
                style={{ padding: '0.3rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Stats Pill */}
            <div className="cbt-palette-stats" style={{ margin: '0.75rem 0' }}>
              <div className="cbt-stat-pill stat-answered">
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{answeredCount}</div>
                <div>Answered</div>
              </div>
              <div className="cbt-stat-pill stat-unanswered">
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{unansweredCount}</div>
                <div>Unanswered</div>
              </div>
              <div className="cbt-stat-pill stat-flagged">
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{flaggedCount}</div>
                <div>Flagged</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="cbt-palette-filters" style={{ marginBottom: '0.75rem' }}>
              <button 
                className={`filter-btn ${paletteFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleSetPaletteFilter('all')}
              >
                All (100)
              </button>
              <button 
                className={`filter-btn ${paletteFilter === 'answered' ? 'active' : ''}`}
                onClick={() => handleSetPaletteFilter('answered')}
              >
                Answered
              </button>
              <button 
                className={`filter-btn ${paletteFilter === 'unanswered' ? 'active' : ''}`}
                onClick={() => handleSetPaletteFilter('unanswered')}
              >
                Unanswered
              </button>
              <button 
                className={`filter-btn ${paletteFilter === 'flagged' ? 'active' : ''}`}
                onClick={() => handleSetPaletteFilter('flagged')}
              >
                Flagged
              </button>
            </div>

            {/* 100-Question Matrix Grid */}
            <div className="mobile-palette-grid-scroll">
              <div className="cbt-palette-grid">
                {examQuestions.map((q, idx) => {
                  const isCurrent = currentIndex === idx;
                  const isAns = userAnswers[q.id] !== undefined || userAnswers[String(q.id)] !== undefined;
                  const isFlag = !!flaggedQuestions[q.id] || !!flaggedQuestions[String(q.id)];

                  if (paletteFilter === 'answered' && !isAns) return null;
                  if (paletteFilter === 'unanswered' && isAns) return null;
                  if (paletteFilter === 'flagged' && !isFlag) return null;

                  let itemClass = 'unanswered';
                  if (isCurrent) itemClass = 'current';
                  else if (isFlag) itemClass = 'flagged';
                  else if (isAns) itemClass = 'answered';

                  return (
                    <button
                      key={q.id}
                      id={`mobile-q-btn-${idx + 1}`}
                      className={`palette-num-btn ${itemClass}`}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsMobilePaletteOpen(false);
                      }}
                      title={`Jump to Question ${idx + 1}`}
                    >
                      {idx + 1}
                      {isFlag && <span className="flag-dot" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Tap any question number to jump immediately
              </span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setIsMobilePaletteOpen(false)}
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-MINUTE REMAINING OFFICIAL WARNING MODAL */}
      {showFiveMinWarningModal && createPortal(
        <div className="cbt-modal-overlay animate-fade-in" style={{ zIndex: 9999 }}>
          <div className="cbt-modal-card" style={{ maxWidth: '500px', border: '2px solid var(--brand-amber)', boxShadow: '0 10px 40px rgba(245, 158, 11, 0.35)' }}>
            <div style={{ color: 'var(--brand-amber)', display: 'flex', justifyContent: 'center', marginBottom: '1rem', animation: 'pulseGlow 1.5s infinite ease-in-out' }}>
              <AlertTriangle size={56} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', textAlign: 'center' }}>
              ⚠️ 5 Minutes Remaining!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center', marginBottom: '1.25rem' }}>
              Candidate <strong>{candidate.fullName}</strong>, you have exactly <strong>5 minutes (300 seconds)</strong> remaining in this examination session. The system will automatically lock and submit all recorded answers at <strong>00:00</strong>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>{answeredCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Answered</div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-danger)' }}>{unansweredCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unanswered</div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-gold)' }}>{flaggedCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Flagged</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                id="cbt-5min-warning-ack-btn"
                className="btn btn-amber btn-lg"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
                onClick={() => setShowFiveMinWarningModal(false)}
              >
                <span>Acknowledge & Continue Examination</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* TIME EXPIRED AUTO-SUBMISSION OVERLAY */}
      {isAutoSubmitting && createPortal(
        <div className="cbt-modal-overlay" style={{ zIndex: 10000 }}>
          <div className="cbt-modal-card" style={{ maxWidth: '460px', textAlign: 'center', padding: '2.5rem 1.5rem', border: '2px solid var(--brand-danger)', boxShadow: '0 10px 40px rgba(239, 68, 68, 0.35)' }}>
            <div style={{ color: 'var(--brand-danger)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <Clock size={56} style={{ animation: 'spin 2s linear infinite' }} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {timeLeft <= 0 ? '⏰ Time Expired!' : 'Submitting your examination…'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {timeLeft <= 0 ? 'The examination duration has ended. ' : ''}Your responses are being finalized and transmitted to the Lagos State Civil Service Commission scoring board...
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>Calculating official results...</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}