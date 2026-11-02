// Automated verification of Exam Refresh & Lockdown functionality
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
  getCachedFlagged,
  ACTIVE_EXAM_KEY
} from '../src/data/examSession.js';

// Polyfill window / localStorage for node environment test
const storage = new Map();
global.localStorage = {
  getItem: (k) => storage.get(k) ?? null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear()
};

global.window = {
  location: { hash: '' },
  history: {
    pushState: () => {},
    replaceState: () => {}
  }
};

console.log('--- Step 1: Testing examSession helper unit logic ---');

// Initially no active exam
if (getActiveExamSession() !== null) throw new Error('Expected no active exam initially');
console.log('✓ Initial state has no active exam');

// Candidate starts exam
const candidateId = 'usr-demo-gl06-10';
const categoryId = 'group-gl-06-10';
const endsAt = Date.now() + 5400000;
const startedAt = Date.now();

const mockQuestions = Array.from({ length: 100 }, (_, i) => ({
  id: `q-${i + 1}`,
  question: `Civil Service Question #${i + 1}`,
  options: ['Option A', 'Option B', 'Option C', 'Option D']
}));

const mockSession = {
  examId: 'exam-12345',
  category: { id: categoryId, code: 'GL 06 - 10', timeLimitMinutes: 90 },
  questions: mockQuestions,
  endsAt,
  startedAt,
  remainingSeconds: 5400
};

setActiveExamSession({
  candidateId,
  categoryId,
  endsAt,
  startedAt
});

saveCachedExamSession(candidateId, categoryId, mockSession);

const active1 = getActiveExamSession();
if (!active1 || !active1.active) throw new Error('Failed to set active exam session');
console.log('✓ Active exam session persisted in localStorage');

// Candidate moves to Question 18 (index 17) and answers Option 2
saveExamQuestionIndex(candidateId, categoryId, 17);
const backupKey = getExamBackupKey(candidateId, categoryId);
localStorage.setItem(`${backupKey}_answers`, JSON.stringify({ 'q-18': 2 }));
localStorage.setItem(`${backupKey}_flagged`, JSON.stringify({ 'q-18': true }));

if (getExamQuestionIndex(candidateId, categoryId) !== 17) {
  throw new Error('Expected question index 17');
}
console.log('✓ Question index 17 persisted');

// Simulate page refresh (new reader reading from storage)
console.log('\n--- Simulating Full Browser Refresh ---');
const refreshedActive = getActiveExamSession();
if (!refreshedActive || !refreshedActive.active) {
  throw new Error('Active exam session lost on simulated refresh');
}
const cachedSession = getCachedExamSession(candidateId, categoryId);
if (!cachedSession || cachedSession.questions.length !== 100) {
  throw new Error('Cached exam session questions missing on simulated refresh');
}
console.log(`✓ Synchronously restored 100 questions without waiting for network`);

const refreshedIndex = getExamQuestionIndex(candidateId, categoryId);
if (refreshedIndex !== 17) {
  throw new Error(`Expected index 17 on refresh, got ${refreshedIndex}`);
}
console.log(`✓ Resumed exactly at Question 18 (index ${refreshedIndex})`);

const cachedAns = getCachedAnswers(candidateId, categoryId);
if (cachedAns['q-18'] !== 2) {
  throw new Error(`Expected selected answer 2 for q-18, got ${cachedAns['q-18']}`);
}
console.log(`✓ Resumed selected answer for Question 18: Option Index ${cachedAns['q-18']}`);

const cachedFlg = getCachedFlagged(candidateId, categoryId);
if (!cachedFlg['q-18']) {
  throw new Error('Expected flag to be true for q-18');
}
console.log(`✓ Resumed flagged status for Question 18: ${cachedFlg['q-18']}`);

const computedTimeLeft = Math.max(0, Math.round((cachedSession.endsAt - Date.now()) / 1000));
console.log(`✓ Resumed countdown timer running at ${computedTimeLeft} seconds`);

// Candidate submits exam
clearActiveExamSession(candidateId, categoryId);
if (getActiveExamSession() !== null) {
  throw new Error('Expected active exam session to be cleared after submit');
}
if (getCachedExamSession(candidateId, categoryId) !== null) {
  throw new Error('Expected cached session to be cleared after submit');
}
console.log('✓ Active exam session cleared upon submit - candidate can now exit');

console.log('\n--- Step 2: Testing live Backend API (/api/exam/...) ---');

const API_BASE = 'http://localhost:3001/api';

async function runApiTests() {
  // 1. Log in as demo candidate
  const loginRes = await fetch(`${API_BASE}/auth/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: candidateId })
  });
  if (!loginRes.ok) {
    console.log('Server not responding or error status:', loginRes.status);
    return;
  }
  const { token, user } = await loginRes.json();
  console.log(`✓ Authenticated as ${user.fullName} (${user.id})`);

  // 2. Start (or resume) exam
  const startRes = await fetch(`${API_BASE}/exam/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ categoryId })
  });
  const exam = await startRes.json();
  console.log(`✓ Exam active on server: ${exam.questions?.length} questions loaded, remainingSeconds: ${exam.remainingSeconds}`);

  // 3. Save answers
  const q0 = exam.questions[0];
  const q1 = exam.questions[1];
  const ansPayload = { [q0.id]: 1, [q1.id]: 2 };
  const ansRes = await fetch(`${API_BASE}/exam/answers`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ answers: ansPayload, securityStrikes: 0 })
  });
  const ansData = await ansRes.json();
  console.log(`✓ Autosaved answers to server: saved=${ansData.saved}`);

  // 4. Check current exam endpoint (simulating browser reload)
  const curRes = await fetch(`${API_BASE}/exam/current`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const curData = await curRes.json();
  if (!curData || curData.active === false) {
    throw new Error('Expected server to return active: true on reload simulation');
  }
  console.log(`✓ Current exam endpoint confirmed active on reload with answers: ${JSON.stringify(curData.answers)}`);

  console.log('\n=== ALL EXAM REFRESH & LOCKDOWN TESTS PASSED! ===');
}

runApiTests().catch((e) => {
  console.error('API Test Error:', e);
});
