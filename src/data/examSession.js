/**
 * Lagos State Civil Service Commission Promotion Examination
 * Active Exam Session Persistence & Navigation Lockdown Manager
 *
 * Ensures:
 * 1. An active exam session is persisted in localStorage across page reloads.
 * 2. On reload, the exam reloads immediately without loss of question position, answers, or time.
 * 3. The candidate is strictly locked inside the exam hall until final submission.
 */

export const ACTIVE_EXAM_KEY = 'cbt_active_exam';

/**
 * Builds standard local storage key for a candidate's category backup
 */
export function getExamBackupKey(candidateId = 'demo', categoryId = 'general') {
  return `cbt_backup_${candidateId || 'demo'}_${categoryId || 'general'}`;
}

/**
 * Retrieves the current active exam session from localStorage.
 * Returns null if no exam is active or if the session has expired past grace period.
 */
export function getActiveExamSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_EXAM_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.active) return null;

    // Check if endsAt has passed by more than 10 minutes (grace period)
    if (session.endsAt && Date.now() > session.endsAt + 600000) {
      localStorage.removeItem(ACTIVE_EXAM_KEY);
      return null;
    }

    return session;
  } catch (e) {
    console.error('[ExamSession] Failed to read active exam session:', e);
    return null;
  }
}

/**
 * Sets or updates the active exam session in localStorage.
 */
export function setActiveExamSession(sessionData) {
  try {
    let current = {};
    try {
      const raw = localStorage.getItem(ACTIVE_EXAM_KEY);
      if (raw) current = JSON.parse(raw);
    } catch (e) {}

    const updated = {
      ...current,
      ...sessionData,
      active: true,
      lastUpdatedAt: Date.now()
    };

    localStorage.setItem(ACTIVE_EXAM_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('[ExamSession] Failed to set active exam session:', e);
    return null;
  }
}

/**
 * Clears the active exam session flag and optionally cleans up local backup keys.
 */
export function clearActiveExamSession(candidateId, categoryId) {
  try {
    localStorage.removeItem(ACTIVE_EXAM_KEY);

    if (candidateId && categoryId) {
      const key = getExamBackupKey(candidateId, categoryId);
      localStorage.removeItem(`${key}_answers`);
      localStorage.removeItem(`${key}_flagged`);
      localStorage.removeItem(`${key}_index`);
      localStorage.removeItem(`${key}_session`);
    }

    if (candidateId) {
      const prefix = `cbt_backup_${candidateId}_`;
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) toRemove.push(k);
      }
      toRemove.forEach(k => localStorage.removeItem(k));
    }
  } catch (e) {
    console.error('[ExamSession] Failed to clear active exam session:', e);
  }
}

/**
 * Persists the current question index where the candidate is actively working.
 */
export function saveExamQuestionIndex(candidateId, categoryId, index) {
  if (typeof index !== 'number' || isNaN(index) || index < 0) return;
  try {
    const key = getExamBackupKey(candidateId, categoryId);
    localStorage.setItem(`${key}_index`, String(index));

    // Also update index in active session object
    const active = getActiveExamSession();
    if (active) {
      active.currentIndex = index;
      localStorage.setItem(ACTIVE_EXAM_KEY, JSON.stringify(active));
    }
  } catch (e) {
    console.error('[ExamSession] Failed to save question index:', e);
  }
}

/**
 * Retrieves the saved question index so the candidate resumes exactly where they stopped.
 */
export function getExamQuestionIndex(candidateId, categoryId) {
  try {
    const key = getExamBackupKey(candidateId, categoryId);
    const raw = localStorage.getItem(`${key}_index`);
    if (raw !== null && raw !== '') {
      const parsed = parseInt(raw, 10);
      if (Number.isFinite(parsed) && parsed >= 0) return parsed;
    }

    const active = getActiveExamSession();
    if (active && typeof active.currentIndex === 'number' && active.currentIndex >= 0) {
      return active.currentIndex;
    }
  } catch (e) {
    console.error('[ExamSession] Failed to retrieve question index:', e);
  }
  return 0;
}

/**
 * Caches the active exam session snapshot (questions, category, timer timestamps).
 */
export function saveCachedExamSession(candidateId, categoryId, session) {
  if (!session || !session.questions || session.questions.length === 0) return;
  try {
    const key = getExamBackupKey(candidateId, categoryId);
    localStorage.setItem(`${key}_session`, JSON.stringify(session));
  } catch (e) {
    console.error('[ExamSession] Failed to cache exam session:', e);
  }
}

/**
 * Retrieves the cached exam session snapshot so reload is instantaneous without loading delays.
 */
export function getCachedExamSession(candidateId, categoryId) {
  try {
    const key = getExamBackupKey(candidateId, categoryId);
    const raw = localStorage.getItem(`${key}_session`);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session && Array.isArray(session.questions) && session.questions.length > 0) {
      // Validate that the session has not expired past grace period
      if (session.endsAt && Date.now() > session.endsAt + 600000) {
        localStorage.removeItem(`${key}_session`);
        return null;
      }
      return session;
    }
  } catch (e) {
    console.error('[ExamSession] Failed to retrieve cached exam session:', e);
  }
  return null;
}

/**
 * Retrieves cached selected answers { [qId]: optionIndex }
 */
export function getCachedAnswers(candidateId, categoryId) {
  try {
    const key = getExamBackupKey(candidateId, categoryId);
    const raw = localStorage.getItem(`${key}_answers`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('[ExamSession] Failed to read cached answers:', e);
  }
  return {};
}

/**
 * Retrieves cached flagged question statuses { [qId]: boolean }
 */
export function getCachedFlagged(candidateId, categoryId) {
  try {
    const key = getExamBackupKey(candidateId, categoryId);
    const raw = localStorage.getItem(`${key}_flagged`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('[ExamSession] Failed to read cached flags:', e);
  }
  return {};
}
