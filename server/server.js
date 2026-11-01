/**
 * LAGOS-CBT backend: Supports both Supabase (Cloud PostgreSQL) and SQLite.
 * Run:  node server/server.js      (serves the API and the built app from /dist)
 * Env:  PORT, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DB_PATH, ADMIN_PASSWORD
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { db } from './db.js';
import { INITIAL_USERS } from './seedUsers.js';
import { DEFAULT_GRADE_CATEGORIES } from '../src/data/gradeLevelCategories.js';
import { DEFAULT_RESOURCES } from '../src/data/defaultResources.js';
import { get100ExamQuestionsForCategory } from '../src/data/defaultQuestions.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const MAX_ATTEMPTS = Number(process.env.MAX_ATTEMPTS) || 1; // real candidates; demo accounts unlimited
const MIN_PASSWORD = Number(process.env.MIN_PASSWORD) || 4;
const SESSION_MS = (Number(process.env.SESSION_HOURS) || 12) * 3600e3;
const GRACE_MS = (Number(process.env.GRACE_SECONDS) || 15) * 1000; // network grace after the timer ends
const DIST = path.join(here, '..', 'dist');

// ---------- helpers ----------
export class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
const J = (s) => JSON.stringify(s);
const rid = (p) => `${p}-${crypto.randomBytes(6).toString('hex')}`;
const hashPw = (pw) => {
  const s = crypto.randomBytes(16);
  return `${s.toString('hex')}:${crypto.scryptSync(pw, s, 64).toString('hex')}`;
};
const checkPw = (pw, stored) => {
  if (!stored || !stored.includes(':')) return false;
  const [s, h] = stored.split(':');
  const x = crypto.scryptSync(pw, Buffer.from(s, 'hex'), 64);
  return crypto.timingSafeEqual(x, Buffer.from(h, 'hex'));
};
const shuffle = (a) => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const parseData = (val) => (typeof val === 'string' ? JSON.parse(val) : (val || {}));
const publicUser = (r) => {
  if (!r) return null;
  const extra = parseData(r.data);
  return { id: r.id, username: r.username, role: r.role, isDemo: !!r.is_demo, ...extra };
};
const PROFILE_FIELDS = ['firstName', 'surname', 'ministry', 'cadre', 'avatar'];
const must = (v, msg) => {
  if (!v) throw new HttpError(400, msg);
  return v;
};
const checkPassword = (pw) => {
  if (typeof pw !== 'string' || pw.trim().length < MIN_PASSWORD) {
    throw new HttpError(400, `Password must be a minimum of ${MIN_PASSWORD} characters.`);
  }
  return pw.trim();
};

// ---------- seed (first run only) ----------
let isSeeded = false;
async function ensureSeeded() {
  if (isSeeded) return;
  const adminPw = process.env.ADMIN_PASSWORD || 'admin2027';
  await db.seedIfEmpty({
    defaultCategories: DEFAULT_GRADE_CATEGORIES,
    defaultQuestions: get100ExamQuestionsForCategory,
    defaultResources: DEFAULT_RESOURCES,
    initialUsers: INITIAL_USERS,
    adminPassword: adminPw
  });
  isSeeded = true;
}

// Initial seed trigger
ensureSeeded().catch(err => console.error('[Seed Error]:', err));

function normalizeQuestion(q) {
  must(q && typeof q.question === 'string' && q.question.trim(), 'Question text is required.');
  must(Array.isArray(q.options) && q.options.length >= 2 && q.options.every((o) => typeof o === 'string' && o.trim()), 'At least two non-empty options are required.');
  const ca = Number(q.correctAnswer);
  must(Number.isInteger(ca) && ca >= 0 && ca < q.options.length, 'correctAnswer must be the index of one option.');
  const categories = q.categories || (q.categoryId ? [q.categoryId] : []);
  must(categories.length, 'Assign the question to at least one grade group.');
  return {
    ...q,
    id: q.id || rid('q'),
    question: q.question.trim(),
    options: q.options.map((o) => o.trim()),
    correctAnswer: ca,
    categories,
    categoryId: categories[0]
  };
}

// ---------- exam engine (server-side timer, shuffling and marking) ----------
async function buildSnapshot(cat) {
  const allQ = await db.allQuestions();
  const pool = allQ.filter((q) => q.categories?.includes(cat.id));
  if (!pool.length) throw new HttpError(409, 'No questions have been uploaded for this grade group yet.', 'NO_QUESTIONS');
  const picked = shuffle(pool).slice(0, cat.totalQuestions || 100);
  return picked.map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return {
      id: q.id,
      question: q.question,
      options: order.map((i) => q.options[i]),
      correctAnswer: order.indexOf(q.correctAnswer),
      subjectId: q.subjectId || 'general',
      chapter: q.chapter,
      resourceMaterial: q.resourceMaterial || q.referenceRule,
      explanation: q.explanation,
    };
  });
}

async function finalize(ex, answers, strikes) {
  const snap = parseData(ex.snapshot);
  const cat = await db.getCategory(ex.category_id);
  const ans = answers || parseData(ex.answers) || {};
  let totalCorrect = 0;
  const sectionalScores = {};
  for (const q of snap) {
    const ok = ans[q.id] === q.correctAnswer;
    if (ok) totalCorrect++;
    const s = (sectionalScores[q.subjectId] ||= { total: 0, correct: 0, name: q.subjectId });
    s.total++;
    if (ok) s.correct++;
  }
  const percentage = Math.round((totalCorrect / snap.length) * 100);
  const now = Date.now();
  const user = await db.getUserById(ex.user_id);
  const result = {
    candidate: publicUser(user),
    category: cat,
    totalQuestions: snap.length,
    totalCorrect,
    percentage,
    passed: percentage >= (cat?.passScorePercentage || 60),
    sectionalScores,
    securityStrikes: strikes ?? ex.strikes,
    timeSpentSeconds: Math.round((Math.min(now, ex.ends_at) - ex.started_at) / 1000),
    submittedAt: new Date(now).toISOString(),
    userAnswers: ans,
    examQuestions: snap,
  };
  await db.finalizeExam(ex.id, now, ans, result.securityStrikes, result);
  return result;
}

async function examView(ex) {
  const cat = await db.getCategory(ex.category_id);
  const snap = parseData(ex.snapshot);
  const ans = parseData(ex.answers);
  const flg = parseData(ex.flagged);
  return {
    examId: ex.id,
    category: cat,
    startedAt: ex.started_at,
    endsAt: ex.ends_at,
    remainingSeconds: Math.max(0, Math.round((ex.ends_at - Date.now()) / 1000)),
    serverNow: Date.now(),
    questions: snap.map(({ id, question, options, subjectId, chapter, resourceMaterial }) => ({
      id, question, options, subjectId, chapter, resourceMaterial
    })),
    answers: ans,
    flagged: flg,
    securityStrikes: ex.strikes,
  };
}

async function activeExam(user) {
  const ex = await db.getActiveExam(user.id);
  if (ex && Date.now() > ex.ends_at + GRACE_MS) {
    await finalize(ex);
    return null;
  }
  return ex || null;
}

// ---------- auth & throttling ----------
const failures = new Map();
function throttle(key) {
  const f = (failures.get(key) || []).filter((t) => Date.now() - t < 10 * 60e3);
  failures.set(key, f);
  if (f.length >= 8) throw new HttpError(429, 'Too many failed attempts. Try again in a few minutes.');
}

async function openSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  await db.openSession(userId, token, Date.now() + SESSION_MS);
  return token;
}

async function authenticate(req) {
  const m = /^Bearer (\w+)$/.exec(req.headers.authorization || '');
  if (!m) throw new HttpError(401, 'Please log in.', 'NO_SESSION');
  const t = await db.getToken(m[1]);
  if (!t) throw new HttpError(401, 'Session not found. Please log in again.', 'NO_SESSION');
  if (t.revoked === 'replaced') throw new HttpError(401, 'You were logged out because this account signed in on another device.', 'SESSION_REPLACED');
  if (t.revoked || t.expires_at < Date.now()) throw new HttpError(401, 'Session expired. Please log in again.', 'SESSION_EXPIRED');
  const user = await db.getUserById(t.user_id);
  if (!user) throw new HttpError(401, 'User account not found.', 'NO_SESSION');
  return { user, token: t.token };
}

// ---------- routes ----------
const routes = [];
const route = (method, p, access, fn) => {
  routes.push({
    method,
    access,
    fn,
    re: new RegExp('^' + p.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$')
  });
};

route('GET', '/api/health', 'public', async () => ({
  ok: true,
  database: db.isSupabase ? 'supabase' : 'sqlite',
  time: new Date().toISOString()
}));

route('GET', '/api/categories', 'public', async () => {
  await ensureSeeded();
  const list = await db.allCategories();
  return list && list.length ? list : DEFAULT_GRADE_CATEGORIES;
});

route('POST', '/api/auth/login', 'public', async ({ body, req }) => {
  await ensureSeeded();
  const username = String(body.username || '').trim();
  const key = `${req.socket?.remoteAddress || 'unknown'}|${username.toLowerCase()}`;
  throttle(key);
  const u = await db.getUserByUsername(username);
  if (!u || !checkPw(String(body.password || ''), u.pass_hash)) {
    (failures.get(key) || []).push(Date.now());
    throw new HttpError(401, 'Invalid username or password.');
  }
  const token = await openSession(u.id);
  return { token, user: publicUser(u) };
});

route('GET', '/api/demo-users', 'public', async () => {
  await ensureSeeded();
  const list = await db.demoUsers();
  return list && list.length ? list.map(publicUser) : INITIAL_USERS.filter((u) => u.isDemo).map(publicUser);
});

route('POST', '/api/auth/demo', 'public', async ({ body }) => {
  await ensureSeeded();
  const u = await db.getUserById(String(body.userId || ''));
  if (!u || !u.is_demo) throw new HttpError(403, 'Not a demo account.');
  const token = await openSession(u.id);
  return { token, user: publicUser(u) };
});

route('POST', '/api/auth/register', 'public', async ({ body }) => {
  await ensureSeeded();
  const firstName = must(String(body.firstName || '').trim(), 'First name is required.');
  const surname = must(String(body.surname || '').trim(), 'Surname is required.');
  const password = checkPassword(body.password);
  const allCats = await db.allCategories();
  const cat = (await db.getCategory(body.categoryId)) || allCats[0];
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = body.customNumber ? `${slug(firstName)}.${slug(surname)}${slug(String(body.customNumber))}` : `${slug(firstName)}.${slug(surname)}`;
  let username = base, n = 1;
  while (await db.getUserByUsername(username)) {
    username = `${base}${++n}`;
  }
  const grade = body.targetGrade || 'GL 10';
  const id = rid('usr');
  const data = {
    fullName: `${firstName} ${surname}`,
    firstName,
    surname,
    registeredAt: new Date().toISOString(),
    ministry: body.ministry || 'Lagos State Civil Service Commission',
    cadre: body.cadre || 'Administrative Officer I',
    gradeLevel: `GL ${Math.max(6, parseInt(String(grade).replace(/\D/g, '') || 9, 10) - 1)}`,
    targetGrade: grade,
    categoryId: cat?.id || 'group-gl-06-10',
    spadevScore: crypto.randomInt(72, 92),
    serviceNumber: `LASG/CSC/2027/${crypto.randomInt(1000, 9999)}`,
    assignedCenter: 'State Secretariat CBT Arena, Alausa, Ikeja',
  };
  await db.insertUser({
    id,
    username,
    pass_hash: hashPw(password),
    role: 'candidate',
    is_demo: 0,
    data,
    created_at: Date.now()
  });
  const created = await db.getUserById(id);
  const token = await openSession(id);
  return { token, user: publicUser(created) };
});

route('POST', '/api/auth/logout', 'user', async ({ auth }) => {
  await db.revokeToken(auth.token, 'logout');
  return { ok: true };
});

route('GET', '/api/me', 'user', async ({ auth }) => publicUser(auth.user));

route('PUT', '/api/me', 'user', async ({ auth, body }) => {
  if (auth.user.is_demo) throw new HttpError(403, 'Demo accounts cannot edit their profile.');
  const data = parseData(auth.user.data);
  for (const k of PROFILE_FIELDS) {
    if (typeof body[k] === 'string' && body[k].trim()) data[k] = body[k].trim();
  }
  data.fullName = `${data.firstName} ${data.surname}`;
  await db.updateUserData(auth.user.id, data);
  const updated = await db.getUserById(auth.user.id);
  return publicUser(updated);
});

route('POST', '/api/me/password', 'user', async ({ auth, body }) => {
  if (auth.user.is_demo) throw new HttpError(403, 'Demo accounts cannot change their password.');
  if (!checkPw(String(body.currentPassword || ''), auth.user.pass_hash)) {
    throw new HttpError(400, 'Current password is incorrect.');
  }
  await db.updateUserPassword(auth.user.id, hashPw(checkPassword(body.newPassword)));
  return { ok: true };
});

route('GET', '/api/resources', 'public', async () => await db.allResources());

// Candidate Exam Routes
route('POST', '/api/exam/start', 'candidate', async ({ auth, body }) => {
  const u = auth.user;
  const cur = await activeExam(u);
  if (cur) return await examView(cur);
  if (!u.is_demo && (await db.getSubmittedAttemptsCount(u.id)) >= MAX_ATTEMPTS) {
    throw new HttpError(403, 'You have already completed this examination.', 'ATTEMPTS_EXHAUSTED');
  }
  const uData = parseData(u.data);
  const profileCat = uData.categoryId;
  const cat = await db.getCategory(u.is_demo ? (body.categoryId || profileCat) : profileCat);
  must(cat, 'Grade group not found.');
  const id = rid('exam'), now = Date.now();
  const snapshot = await buildSnapshot(cat);
  await db.createExam({
    id,
    user_id: u.id,
    category_id: cat.id,
    started_at: now,
    ends_at: now + cat.timeLimitMinutes * 60e3,
    snapshot
  });
  const created = await db.getExamById(id);
  return await examView(created);
});

route('GET', '/api/exam/current', 'candidate', async ({ auth }) => {
  const ex = await activeExam(auth.user);
  return ex ? await examView(ex) : { active: false };
});

route('PUT', '/api/exam/answers', 'candidate', async ({ auth, body }) => {
  const ex = await activeExam(auth.user);
  if (!ex) throw new HttpError(409, 'The examination has ended.', 'EXAM_ENDED');
  const snap = parseData(ex.snapshot);
  const valid = new Map(snap.map((q) => [q.id, q.options.length]));
  const answers = {};
  for (const [qid, idx] of Object.entries(body.answers || {})) {
    if (valid.has(qid) && Number.isInteger(idx) && idx >= 0 && idx < valid.get(qid)) {
      answers[qid] = idx;
    }
  }
  const strikes = Math.max(ex.strikes || 0, Number(body.securityStrikes) || 0);
  await db.updateExamProgress(ex.id, answers, body.flagged || {}, strikes);
  return { saved: true, remainingSeconds: Math.max(0, Math.round((ex.ends_at - Date.now()) / 1000)) };
});

route('POST', '/api/exam/submit', 'candidate', async ({ auth, body }) => {
  const ex = await db.getActiveExam(auth.user.id);
  if (!ex) {
    const last = await db.getLastSubmittedExam(auth.user.id);
    if (last) return last;
    throw new HttpError(404, 'No examination in progress.');
  }
  const inTime = Date.now() <= ex.ends_at + GRACE_MS;
  const snap = parseData(ex.snapshot);
  const valid = new Set(snap.map((q) => q.id));
  const sent = {};
  if (inTime) {
    for (const [qid, idx] of Object.entries(body.answers || {})) {
      if (valid.has(qid) && Number.isInteger(idx)) sent[qid] = idx;
    }
  }
  const prevAns = parseData(ex.answers);
  return await finalize(ex, inTime ? { ...prevAns, ...sent } : null, Math.max(ex.strikes || 0, Number(body.securityStrikes) || 0));
});

route('GET', '/api/me/results', 'candidate', async ({ auth }) => {
  const list = await db.getUserSubmittedExams(auth.user.id);
  return list.map((res) => {
    const { userAnswers, examQuestions, ...summary } = res;
    return summary;
  });
});

// Admin Routes
route('PUT', '/api/categories/:id', 'admin', async ({ params, body }) => {
  const cat = must(await db.getCategory(params.id), 'Grade group not found.');
  const t = Number(body.timeLimitMinutes ?? cat.timeLimitMinutes);
  const p = Number(body.passScorePercentage ?? cat.passScorePercentage);
  must(t > 0 && t <= 600, 'Time must be between 1 and 600 minutes.');
  must(p >= 0 && p <= 100, 'Pass mark must be 0 to 100.');
  const next = { ...cat, timeLimitMinutes: t, passScorePercentage: p };
  await db.updateCategory(cat.id, next);
  return next;
});

route('GET', '/api/questions', 'admin', async () => {
  const list = await db.allQuestions();
  return list.map((q) => ({
    ...q,
    categoryId: q.categoryId ?? q.categories?.[0],
    referenceRule: q.referenceRule ?? q.resourceMaterial
  }));
});

route('POST', '/api/questions', 'admin', async ({ body }) => {
  const items = (Array.isArray(body) ? body : [body]).map(normalizeQuestion);
  await db.upsertQuestions(items);
  return { added: items.length, questions: items };
});

route('DELETE', '/api/questions/:id', 'admin', async ({ params }) => {
  return await db.deleteQuestion(params.id);
});

route('POST', '/api/resources', 'admin', async ({ body }) => {
  must(body.title, 'Title is required.');
  const r = { ...body, id: body.id || rid('res') };
  await db.upsertResource(r);
  return r;
});

route('DELETE', '/api/resources/:id', 'admin', async ({ params }) => {
  return await db.deleteResource(params.id);
});

route('GET', '/api/candidates', 'admin', async () => {
  const list = await db.allCandidates();
  return list.map(publicUser);
});

route('POST', '/api/candidates/:id/reset-password', 'admin', async ({ params, body }) => {
  const u = must(await db.getUserById(params.id), 'Candidate not found.');
  if (u.role !== 'candidate') throw new HttpError(403, 'Only candidate accounts can be reset here.');
  await db.updateUserPassword(u.id, hashPw(checkPassword(body.newPassword)));
  await db.revokeUserTokens(u.id, 'reset');
  return { ok: true };
});

route('GET', '/api/merit', 'admin', async ({ url }) => {
  const withDemo = url.searchParams.get('includeDemo') === '1';
  const list = await db.getAllSubmittedExamsForMerit(withDemo);
  return list.map((res) => {
    const { userAnswers, examQuestions, ...summary } = res;
    return summary;
  });
});

// ---------- HTTP server & Request Dispatcher ----------
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

const send = (res, status, obj) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(J(obj));
};

const readBody = (req) => new Promise((resolve, reject) => {
  let size = 0;
  const chunks = [];
  req.on('data', (c) => {
    size += c.length;
    if (size > 2e6) {
      reject(new HttpError(413, 'Request too large.'));
      req.destroy();
    } else chunks.push(c);
  });
  req.on('end', () => {
    try {
      resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {});
    } catch {
      reject(new HttpError(400, 'Invalid JSON.'));
    }
  });
});

function serveStatic(req, res, pathname) {
  let file = path.join(DIST, path.normalize(pathname).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(DIST, 'index.html'); // SPA fallback
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    return res.end('Build the app first: npm run build');
  }
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff'
  });
  fs.createReadStream(file).pipe(res);
}

/** Core request handler used by both local http server and Vercel serverless functions */
export async function handleRequest(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const url = new URL(req.url, 'http://x');
  let pathname = url.pathname;

  // Normalize path if rewritten or missing /api prefix in serverless environment
  if (!pathname.startsWith('/api/') && pathname !== '/api') {
    if (routes.some((x) => x.re.test('/api' + pathname))) {
      pathname = '/api' + pathname;
    } else {
      return serveStatic(req, res, pathname);
    }
  }

  try {
    const r = routes.find((x) => x.method === req.method && x.re.test(pathname));
    if (!r) throw new HttpError(404, 'Endpoint not found.');
    const ctx = {
      req,
      url,
      params: r.re.exec(pathname).groups || {},
      body: req.method === 'GET' || req.method === 'DELETE' ? {} : (req.body || await readBody(req))
    };
    if (r.access !== 'public') {
      ctx.auth = await authenticate(req);
      if (r.access === 'admin' && ctx.auth.user.role !== 'admin') {
        throw new HttpError(403, 'Administrator access required.');
      }
      if (r.access === 'candidate' && ctx.auth.user.role !== 'candidate') {
        throw new HttpError(403, 'Candidate access required.');
      }
    }
    const result = await r.fn(ctx);
    send(res, 200, result);
  } catch (e) {
    if (!(e instanceof HttpError)) console.error('[Request Error]:', e);
    send(res, e.status || 500, { error: e instanceof HttpError ? e.message : 'Server error.', code: e.code });
  }
}

export const server = http.createServer(handleRequest);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`LAGOS-CBT server on http://0.0.0.0:${PORT} [Database: ${db.isSupabase ? 'Supabase' : 'SQLite'}]`);
  });
}