/**
 * LAGOS-CBT backend: zero-dependency Node server (Node 22+), SQLite storage.
 * Run:  node server/server.js      (serves the API and the built app from /dist)
 * Env:  PORT, DB_PATH, ADMIN_PASSWORD, MAX_ATTEMPTS, MIN_PASSWORD, SESSION_HOURS, GRACE_SECONDS
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { INITIAL_USERS } from './seedUsers.js';
import { DEFAULT_GRADE_CATEGORIES } from '../src/data/gradeLevelCategories.js';
import { DEFAULT_RESOURCES } from '../src/data/defaultResources.js';
import { get100ExamQuestionsForCategory } from '../src/data/defaultQuestions.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const DB_PATH = process.env.DB_PATH || path.join(here, 'data', 'cbt.db');
const MAX_ATTEMPTS = Number(process.env.MAX_ATTEMPTS) || 1; // real candidates; demo accounts are unlimited
const MIN_PASSWORD = Number(process.env.MIN_PASSWORD) || 4;
const SESSION_MS = (Number(process.env.SESSION_HOURS) || 12) * 3600e3;
const GRACE_MS = (Number(process.env.GRACE_SECONDS) || 15) * 1000; // network grace after the timer ends
const DIST = path.join(here, '..', 'dist');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, username TEXT UNIQUE COLLATE NOCASE, pass_hash TEXT NOT NULL,
  role TEXT NOT NULL, is_demo INTEGER NOT NULL DEFAULT 0, data TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS tokens(token TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL, revoked TEXT);
CREATE TABLE IF NOT EXISTS categories(id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS questions(id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS resources(id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS exams(id TEXT PRIMARY KEY, user_id TEXT NOT NULL, category_id TEXT NOT NULL,
  status TEXT NOT NULL, started_at INTEGER NOT NULL, ends_at INTEGER NOT NULL, snapshot TEXT NOT NULL,
  answers TEXT NOT NULL DEFAULT '{}', flagged TEXT NOT NULL DEFAULT '{}', strikes INTEGER NOT NULL DEFAULT 0,
  submitted_at INTEGER, result TEXT);
CREATE INDEX IF NOT EXISTS idx_exams_user ON exams(user_id, status);
`);

// ---------- helpers ----------
class HttpError extends Error { constructor(status, message, code) { super(message); this.status = status; this.code = code; } }
const J = (s) => JSON.stringify(s);
const rid = (p) => `${p}-${crypto.randomBytes(6).toString('hex')}`;
const hashPw = (pw) => { const s = crypto.randomBytes(16); return `${s.toString('hex')}:${crypto.scryptSync(pw, s, 64).toString('hex')}`; };
const checkPw = (pw, stored) => {
  const [s, h] = stored.split(':');
  const x = crypto.scryptSync(pw, Buffer.from(s, 'hex'), 64);
  return crypto.timingSafeEqual(x, Buffer.from(h, 'hex'));
};
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const publicUser = (r) => ({ id: r.id, username: r.username, role: r.role, isDemo: !!r.is_demo, ...JSON.parse(r.data) });
const PROFILE_FIELDS = ['firstName', 'surname', 'ministry', 'cadre', 'avatar'];
const must = (v, msg) => { if (!v) throw new HttpError(400, msg); return v; };
const checkPassword = (pw) => {
  if (typeof pw !== 'string' || pw.trim().length < MIN_PASSWORD) throw new HttpError(400, `Password must be a minimum of ${MIN_PASSWORD} characters.`);
  return pw.trim();
};

// ---------- seed (first run only) ----------
function seed() {
  const adminPw = process.env.ADMIN_PASSWORD || crypto.randomBytes(6).toString('base64url');
  const { n } = db.prepare('SELECT COUNT(*) n FROM users').get();
  db.exec('BEGIN');
  if (n === 0) {
    for (const u of INITIAL_USERS) {
      const { id, username, password, role, isDemo, ...rest } = u;
      const pw = role === 'admin' ? adminPw : password;
      db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?,?)').run(id, username, hashPw(pw), role, isDemo ? 1 : 0, J(rest), Date.now());
    }
    console.log(process.env.ADMIN_PASSWORD ? 'Admin account created (password from ADMIN_PASSWORD).'
      : `Admin account created. username: admin   password: ${adminPw}   (shown once, change it or set ADMIN_PASSWORD)`);
  }
  if (db.prepare('SELECT COUNT(*) n FROM categories').get().n === 0) {
    for (const c of DEFAULT_GRADE_CATEGORIES) db.prepare('INSERT INTO categories VALUES(?,?)').run(c.id, J(c));
    const seen = new Set();
    for (const c of DEFAULT_GRADE_CATEGORIES) for (const q of get100ExamQuestionsForCategory(c)) {
      if (seen.has(q.id)) continue; seen.add(q.id);
      db.prepare('INSERT INTO questions VALUES(?,?)').run(q.id, J(q));
    }
    for (const r of DEFAULT_RESOURCES) db.prepare('INSERT INTO resources VALUES(?,?)').run(r.id, J(r));
  }
  db.exec('COMMIT');
}
seed();

// ---------- data access ----------
const getCategory = (id) => { if (typeof id !== 'string' || !id) return null; const r = db.prepare('SELECT data FROM categories WHERE id=?').get(id); return r ? JSON.parse(r.data) : null; };
const allCategories = () => db.prepare('SELECT data FROM categories').all().map((r) => JSON.parse(r.data));
const userRow = (id) => db.prepare('SELECT * FROM users WHERE id=?').get(id);

function normalizeQuestion(q) {
  must(q && typeof q.question === 'string' && q.question.trim(), 'Question text is required.');
  must(Array.isArray(q.options) && q.options.length >= 2 && q.options.every((o) => typeof o === 'string' && o.trim()), 'At least two non-empty options are required.');
  const ca = Number(q.correctAnswer);
  must(Number.isInteger(ca) && ca >= 0 && ca < q.options.length, 'correctAnswer must be the index of one option.');
  const categories = q.categories || (q.categoryId ? [q.categoryId] : []);
  must(categories.length, 'Assign the question to at least one grade group.');
  return { ...q, id: q.id || rid('q'), question: q.question.trim(), options: q.options.map((o) => o.trim()), correctAnswer: ca, categories, categoryId: categories[0] };
}

// ---------- exam engine (server-side timer, shuffling and marking) ----------
function buildSnapshot(cat) {
  const pool = db.prepare('SELECT data FROM questions').all().map((r) => JSON.parse(r.data)).filter((q) => q.categories?.includes(cat.id));
  if (!pool.length) throw new HttpError(409, 'No questions have been uploaded for this grade group yet.', 'NO_QUESTIONS');
  const picked = shuffle(pool).slice(0, cat.totalQuestions || 100);
  return picked.map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return {
      id: q.id, question: q.question, options: order.map((i) => q.options[i]), correctAnswer: order.indexOf(q.correctAnswer),
      subjectId: q.subjectId || 'general', chapter: q.chapter, resourceMaterial: q.resourceMaterial || q.referenceRule, explanation: q.explanation,
    };
  });
}

function finalize(ex, answers, strikes) {
  const snap = JSON.parse(ex.snapshot);
  const cat = getCategory(ex.category_id);
  const ans = answers || JSON.parse(ex.answers);
  let totalCorrect = 0; const sectionalScores = {};
  for (const q of snap) {
    const ok = ans[q.id] === q.correctAnswer;
    if (ok) totalCorrect++;
    const s = (sectionalScores[q.subjectId] ||= { total: 0, correct: 0, name: q.subjectId });
    s.total++; if (ok) s.correct++;
  }
  const percentage = Math.round((totalCorrect / snap.length) * 100);
  const now = Date.now();
  const result = {
    candidate: publicUser(userRow(ex.user_id)), category: cat, totalQuestions: snap.length, totalCorrect, percentage,
    passed: percentage >= cat.passScorePercentage, sectionalScores, securityStrikes: strikes ?? ex.strikes,
    timeSpentSeconds: Math.round((Math.min(now, ex.ends_at) - ex.started_at) / 1000), submittedAt: new Date(now).toISOString(),
    userAnswers: ans, examQuestions: snap,
  };
  db.prepare("UPDATE exams SET status='submitted', submitted_at=?, answers=?, strikes=?, result=? WHERE id=? AND status='active'")
    .run(now, J(ans), result.securityStrikes, J(result), ex.id);
  return result;
}

const examView = (ex) => ({
  examId: ex.id, category: getCategory(ex.category_id), startedAt: ex.started_at, endsAt: ex.ends_at,
  remainingSeconds: Math.max(0, Math.round((ex.ends_at - Date.now()) / 1000)), serverNow: Date.now(),
  questions: JSON.parse(ex.snapshot).map(({ id, question, options, subjectId, chapter, resourceMaterial }) => ({ id, question, options, subjectId, chapter, resourceMaterial })),
  answers: JSON.parse(ex.answers), flagged: JSON.parse(ex.flagged), securityStrikes: ex.strikes,
});

function activeExam(user) {
  const ex = db.prepare("SELECT * FROM exams WHERE user_id=? AND status='active'").get(user.id);
  if (ex && Date.now() > ex.ends_at + GRACE_MS) { finalize(ex); return null; } // time ran out: auto-submit what was saved
  return ex || null;
}

// ---------- auth ----------
const failures = new Map();
function throttle(key) {
  const f = (failures.get(key) || []).filter((t) => Date.now() - t < 10 * 60e3);
  failures.set(key, f);
  if (f.length >= 8) throw new HttpError(429, 'Too many failed attempts. Try again in a few minutes.');
}
function openSession(userId) {
  db.prepare("UPDATE tokens SET revoked='replaced' WHERE user_id=? AND revoked IS NULL").run(userId); // one active session per user
  db.prepare('DELETE FROM tokens WHERE expires_at < ?').run(Date.now() - 864e5);
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO tokens VALUES(?,?,?,NULL)').run(token, userId, Date.now() + SESSION_MS);
  return token;
}
function authenticate(req) {
  const m = /^Bearer (\w+)$/.exec(req.headers.authorization || '');
  if (!m) throw new HttpError(401, 'Please log in.', 'NO_SESSION');
  const t = db.prepare('SELECT * FROM tokens WHERE token=?').get(m[1]);
  if (!t) throw new HttpError(401, 'Session not found. Please log in again.', 'NO_SESSION');
  if (t.revoked === 'replaced') throw new HttpError(401, 'You were logged out because this account signed in on another device.', 'SESSION_REPLACED');
  if (t.revoked || t.expires_at < Date.now()) throw new HttpError(401, 'Session expired. Please log in again.', 'SESSION_EXPIRED');
  return { user: userRow(t.user_id), token: t.token };
}

// ---------- routes ----------
const routes = [];
const route = (method, p, access, fn) => routes.push({ method, access, fn, re: new RegExp('^' + p.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$') });

route('GET', '/api/health', 'public', () => ({ ok: true }));
route('GET', '/api/categories', 'public', () => allCategories());

route('POST', '/api/auth/login', 'public', ({ body, req }) => {
  const username = String(body.username || '').trim();
  const key = `${req.socket.remoteAddress}|${username.toLowerCase()}`;
  throttle(key);
  const u = db.prepare('SELECT * FROM users WHERE username=?').get(username);
  if (!u || !checkPw(String(body.password || ''), u.pass_hash)) {
    failures.get(key).push(Date.now());
    throw new HttpError(401, 'Invalid username or password.');
  }
  return { token: openSession(u.id), user: publicUser(u) };
});

route('GET', '/api/demo-users', 'public', () => db.prepare('SELECT * FROM users WHERE is_demo=1 ORDER BY created_at').all().map(publicUser));
route('POST', '/api/auth/demo', 'public', ({ body }) => { // one-click demo login (demo accounts only)
  const u = userRow(String(body.userId || ''));
  if (!u || !u.is_demo) throw new HttpError(403, 'Not a demo account.');
  return { token: openSession(u.id), user: publicUser(u) };
});

route('POST', '/api/auth/register', 'public', ({ body }) => {
  const firstName = must(String(body.firstName || '').trim(), 'First name is required.');
  const surname = must(String(body.surname || '').trim(), 'Surname is required.');
  const password = checkPassword(body.password);
  const cat = getCategory(body.categoryId) || allCategories()[0];
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = body.customNumber ? `${slug(firstName)}.${slug(surname)}${slug(String(body.customNumber))}` : `${slug(firstName)}.${slug(surname)}`;
  let username = base, n = 1;
  while (db.prepare('SELECT 1 FROM users WHERE username=?').get(username)) username = `${base}${++n}`;
  const grade = body.targetGrade || 'GL 10';
  const id = rid('usr');
  const data = {
    fullName: `${firstName} ${surname}`, firstName, surname, registeredAt: new Date().toISOString(),
    ministry: body.ministry || 'Lagos State Civil Service Commission', cadre: body.cadre || 'Administrative Officer I',
    gradeLevel: `GL ${Math.max(6, parseInt(String(grade).replace(/\D/g, '') || 9, 10) - 1)}`, targetGrade: grade, categoryId: cat.id,
    spadevScore: crypto.randomInt(72, 92), serviceNumber: `LASG/CSC/2027/${crypto.randomInt(1000, 9999)}`,
    assignedCenter: 'State Secretariat CBT Arena, Alausa, Ikeja',
  };
  db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?,?)').run(id, username, hashPw(password), 'candidate', 0, J(data), Date.now());
  return { token: openSession(id), user: publicUser(userRow(id)) };
});

route('POST', '/api/auth/logout', 'user', ({ auth }) => { db.prepare("UPDATE tokens SET revoked='logout' WHERE token=?").run(auth.token); return { ok: true }; });
route('GET', '/api/me', 'user', ({ auth }) => publicUser(auth.user));
route('PUT', '/api/me', 'user', ({ auth, body }) => {
  if (auth.user.is_demo) throw new HttpError(403, 'Demo accounts cannot edit their profile.');
  const data = JSON.parse(auth.user.data);
  // Candidates may edit their name, ministry, cadre and photo. Target grade / grade group are fixed at registration.
  for (const k of PROFILE_FIELDS) if (typeof body[k] === 'string' && body[k].trim()) data[k] = body[k].trim();
  data.fullName = `${data.firstName} ${data.surname}`;
  db.prepare('UPDATE users SET data=? WHERE id=?').run(J(data), auth.user.id);
  return publicUser(userRow(auth.user.id));
});
route('POST', '/api/me/password', 'user', ({ auth, body }) => {
  if (auth.user.is_demo) throw new HttpError(403, 'Demo accounts cannot change their password.');
  if (!checkPw(String(body.currentPassword || ''), auth.user.pass_hash)) throw new HttpError(400, 'Current password is incorrect.');
  db.prepare('UPDATE users SET pass_hash=? WHERE id=?').run(hashPw(checkPassword(body.newPassword)), auth.user.id);
  return { ok: true };
});

route('GET', '/api/resources', 'public', () => db.prepare('SELECT data FROM resources').all().map((r) => JSON.parse(r.data)));

// candidate: exam
route('POST', '/api/exam/start', 'candidate', ({ auth, body }) => {
  const u = auth.user;
  const cur = activeExam(u);
  if (cur) return examView(cur);
  if (!u.is_demo && db.prepare("SELECT COUNT(*) n FROM exams WHERE user_id=? AND status='submitted'").get(u.id).n >= MAX_ATTEMPTS)
    throw new HttpError(403, 'You have already completed this examination.', 'ATTEMPTS_EXHAUSTED');
  const profileCat = JSON.parse(u.data).categoryId;
  const cat = getCategory(u.is_demo ? (body.categoryId || profileCat) : profileCat); // registered candidates sit their own grade group only
  must(cat, 'Grade group not found.');
  const id = rid('exam'), now = Date.now();
  db.prepare("INSERT INTO exams(id,user_id,category_id,status,started_at,ends_at,snapshot) VALUES(?,?,?,'active',?,?,?)")
    .run(id, u.id, cat.id, now, now + cat.timeLimitMinutes * 60e3, J(buildSnapshot(cat)));
  return examView(db.prepare('SELECT * FROM exams WHERE id=?').get(id));
});
route('GET', '/api/exam/current', 'candidate', ({ auth }) => {
  const ex = activeExam(auth.user);
  return ex ? examView(ex) : { active: false };
});
route('PUT', '/api/exam/answers', 'candidate', ({ auth, body }) => {
  const ex = activeExam(auth.user);
  if (!ex) throw new HttpError(409, 'The examination has ended.', 'EXAM_ENDED');
  const valid = new Map(JSON.parse(ex.snapshot).map((q) => [q.id, q.options.length]));
  const answers = {};
  for (const [qid, idx] of Object.entries(body.answers || {})) if (valid.has(qid) && Number.isInteger(idx) && idx >= 0 && idx < valid.get(qid)) answers[qid] = idx;
  const strikes = Math.max(ex.strikes, Number(body.securityStrikes) || 0);
  db.prepare('UPDATE exams SET answers=?, flagged=?, strikes=? WHERE id=?').run(J(answers), J(body.flagged || {}), strikes, ex.id);
  return { saved: true, remainingSeconds: Math.max(0, Math.round((ex.ends_at - Date.now()) / 1000)) };
});
route('POST', '/api/exam/submit', 'candidate', ({ auth, body }) => {
  const ex = db.prepare("SELECT * FROM exams WHERE user_id=? AND status='active'").get(auth.user.id);
  if (!ex) {
    const last = db.prepare("SELECT result FROM exams WHERE user_id=? AND status='submitted' ORDER BY submitted_at DESC").get(auth.user.id);
    if (last) return JSON.parse(last.result); // already submitted (e.g. auto-submitted on timeout)
    throw new HttpError(404, 'No examination in progress.');
  }
  const inTime = Date.now() <= ex.ends_at + GRACE_MS;
  const valid = new Set(JSON.parse(ex.snapshot).map((q) => q.id));
  const sent = {};
  if (inTime) for (const [qid, idx] of Object.entries(body.answers || {})) if (valid.has(qid) && Number.isInteger(idx)) sent[qid] = idx;
  return finalize(ex, inTime ? { ...JSON.parse(ex.answers), ...sent } : null, Math.max(ex.strikes, Number(body.securityStrikes) || 0));
});

route('GET', '/api/me/results', 'candidate', ({ auth }) => // own past results, newest first (no answers)
  db.prepare("SELECT result FROM exams WHERE user_id=? AND status='submitted' ORDER BY submitted_at DESC").all(auth.user.id)
    .map((r) => { const { userAnswers, examQuestions, ...summary } = JSON.parse(r.result); return summary; }));

// admin
route('PUT', '/api/categories/:id', 'admin', ({ params, body }) => {
  const cat = must(getCategory(params.id), 'Grade group not found.');
  const t = Number(body.timeLimitMinutes ?? cat.timeLimitMinutes), p = Number(body.passScorePercentage ?? cat.passScorePercentage);
  must(t > 0 && t <= 600, 'Time must be between 1 and 600 minutes.'); must(p >= 0 && p <= 100, 'Pass mark must be 0 to 100.');
  const next = { ...cat, timeLimitMinutes: t, passScorePercentage: p };
  db.prepare('UPDATE categories SET data=? WHERE id=?').run(J(next), cat.id);
  return next;
});
route('GET', '/api/questions', 'admin', () => db.prepare('SELECT data FROM questions').all().map((r) => {
  const q = JSON.parse(r.data); // the admin screen groups by categoryId and searches referenceRule
  return { ...q, categoryId: q.categoryId ?? q.categories?.[0], referenceRule: q.referenceRule ?? q.resourceMaterial };
}));
route('POST', '/api/questions', 'admin', ({ body }) => { // one question or an array (bulk import)
  const items = (Array.isArray(body) ? body : [body]).map(normalizeQuestion);
  db.exec('BEGIN');
  for (const q of items) db.prepare('INSERT OR REPLACE INTO questions VALUES(?,?)').run(q.id, J(q));
  db.exec('COMMIT');
  return { added: items.length, questions: items };
});
route('DELETE', '/api/questions/:id', 'admin', ({ params }) => ({ deleted: db.prepare('DELETE FROM questions WHERE id=?').run(params.id).changes }));
route('POST', '/api/resources', 'admin', ({ body }) => {
  must(body.title, 'Title is required.');
  const r = { ...body, id: body.id || rid('res') };
  db.prepare('INSERT OR REPLACE INTO resources VALUES(?,?)').run(r.id, J(r));
  return r;
});
route('DELETE', '/api/resources/:id', 'admin', ({ params }) => ({ deleted: db.prepare('DELETE FROM resources WHERE id=?').run(params.id).changes }));
route('GET', '/api/candidates', 'admin', () => db.prepare("SELECT * FROM users WHERE role='candidate' ORDER BY created_at").all().map(publicUser));
route('POST', '/api/candidates/:id/reset-password', 'admin', ({ params, body }) => {
  const u = must(userRow(params.id), 'Candidate not found.');
  if (u.role !== 'candidate') throw new HttpError(403, 'Only candidate accounts can be reset here.');
  db.prepare('UPDATE users SET pass_hash=? WHERE id=?').run(hashPw(checkPassword(body.newPassword)), u.id);
  db.prepare("UPDATE tokens SET revoked='reset' WHERE user_id=? AND revoked IS NULL").run(u.id);
  return { ok: true };
});
route('GET', '/api/merit', 'admin', ({ url }) => { // ranked by score; demo accounts hidden unless ?includeDemo=1
  const withDemo = url.searchParams.get('includeDemo') === '1';
  return db.prepare("SELECT e.result, u.is_demo FROM exams e JOIN users u ON u.id=e.user_id WHERE e.status='submitted'").all()
    .filter((r) => withDemo || !r.is_demo).map((r) => {
      const { userAnswers, examQuestions, ...summary } = JSON.parse(r.result); return summary;
    }).sort((a, b) => b.percentage - a.percentage);
});

// ---------- http server ----------
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.ico': 'image/x-icon' };
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
  let size = 0; const chunks = [];
  req.on('data', (c) => { size += c.length; if (size > 2e6) { reject(new HttpError(413, 'Request too large.')); req.destroy(); } else chunks.push(c); });
  req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}); } catch { reject(new HttpError(400, 'Invalid JSON.')); } });
});

function serveStatic(req, res, pathname) {
  let file = path.join(DIST, path.normalize(pathname).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html'); // SPA fallback
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Build the app first: npm run build'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(file).pipe(res);
}

export const server = http.createServer(async (req, res) => {
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
  if (!url.pathname.startsWith('/api/')) return serveStatic(req, res, url.pathname);
  try {
    const r = routes.find((x) => x.method === req.method && x.re.test(url.pathname));
    if (!r) throw new HttpError(404, 'Not found.');
    const ctx = { req, url, params: r.re.exec(url.pathname).groups || {}, body: req.method === 'GET' || req.method === 'DELETE' ? {} : await readBody(req) };
    if (r.access !== 'public') {
      ctx.auth = authenticate(req);
      if (r.access === 'admin' && ctx.auth.user.role !== 'admin') throw new HttpError(403, 'Administrator access required.');
      if (r.access === 'candidate' && ctx.auth.user.role !== 'candidate') throw new HttpError(403, 'Candidate access required.');
    }
    send(res, 200, r.fn(ctx));
  } catch (e) {
    if (!(e instanceof HttpError)) console.error(e);
    send(res, e.status || 500, { error: e instanceof HttpError ? e.message : 'Server error.', code: e.code });
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, '0.0.0.0', () => console.log(`LAGOS-CBT server on http://0.0.0.0:${PORT}  (db: ${DB_PATH})`));
}