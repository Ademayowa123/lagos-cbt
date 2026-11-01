/**
 * Unified Database Adapter for LAGOS-CBT
 * Supports:
 *   1. Supabase (PostgreSQL in the cloud) - used when SUPABASE_URL is configured (e.g. on Vercel / Netlify / Production)
 *   2. SQLite (node:sqlite) - used for offline local development and testing
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

// Auto-load .env if present (zero dependencies)
const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(here, '..', '.env');
try {
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq > 0) {
        const k = t.slice(0, eq).trim();
        let v = t.slice(eq + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        if (!process.env[k]) process.env[k] = v;
      }
    }
  }
} catch (e) {
  // ignore
}

export const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL && 
  (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY)
);

let supabase = null;
let sqliteDb = null;

if (isSupabaseConfigured) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  console.log(`[Database] Connected to Supabase Cloud PostgreSQL (${url})`);
} else {
  try {
    const { DatabaseSync } = await import('node:sqlite');
    const DB_PATH = process.env.DB_PATH || path.join(here, 'data', 'cbt.db');
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    sqliteDb = new DatabaseSync(DB_PATH);
    sqliteDb.exec(`
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
    console.log(`[Database] Using local SQLite (${DB_PATH})`);
  } catch (err) {
    console.warn(`[Database] SQLite (node:sqlite) not available in this runtime (${process.version}): ${err.message}. Using memory store.`);
  }
}

// In-memory fallback store when neither Supabase nor SQLite is available
const memStore = {
  users: new Map(),
  tokens: new Map(),
  categories: new Map(),
  questions: new Map(),
  resources: new Map(),
  exams: new Map()
};

const parseJson = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch (e) { return val; }
};

const stringifyJson = (val) => {
  if (val === null || val === undefined) return '{}';
  return typeof val === 'string' ? val : JSON.stringify(val);
};

// -------------------------------------------------------------
// Database Operations Interface
// -------------------------------------------------------------

export const db = {
  isSupabase: isSupabaseConfigured,
  client: supabase,

  // --- Seed Initialization ---
  async seedIfEmpty({ defaultCategories, defaultQuestions, defaultResources, initialUsers, adminPassword }) {
    if (isSupabaseConfigured) {
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
      if (!count || count === 0) {
        console.log('[Supabase] Seeding initial tables and users...');
        const userInserts = initialUsers.map(u => {
          const { id, username, password, role, isDemo, ...rest } = u;
          const pw = role === 'admin' ? adminPassword : password;
          const salt = crypto.randomBytes(16);
          const hash = `${salt.toString('hex')}:${crypto.scryptSync(pw, salt, 64).toString('hex')}`;
          return {
            id,
            username,
            pass_hash: hash,
            role,
            is_demo: !!isDemo,
            data: rest,
            created_at: Date.now()
          };
        });
        await supabase.from('users').upsert(userInserts);

        const catInserts = defaultCategories.map(c => ({ id: c.id, data: c }));
        await supabase.from('categories').upsert(catInserts);

        const seen = new Set();
        const qInserts = [];
        for (const c of defaultCategories) {
          for (const q of defaultQuestions(c)) {
            if (!seen.has(q.id)) {
              seen.add(q.id);
              qInserts.push({ id: q.id, data: q });
            }
          }
        }
        // Insert questions in chunks of 50 to avoid payload limits
        for (let i = 0; i < qInserts.length; i += 50) {
          await supabase.from('questions').upsert(qInserts.slice(i, i + 50));
        }

        const resInserts = defaultResources.map(r => ({ id: r.id, data: r }));
        await supabase.from('resources').upsert(resInserts);
        console.log('[Supabase] Initial seed completed successfully.');
      }
    } else {
      const { n } = sqliteDb.prepare('SELECT COUNT(*) n FROM users').get();
      if (n === 0) {
        sqliteDb.exec('BEGIN');
        for (const u of initialUsers) {
          const { id, username, password, role, isDemo, ...rest } = u;
          const pw = role === 'admin' ? adminPassword : password;
          const salt = crypto.randomBytes(16);
          const hash = `${salt.toString('hex')}:${crypto.scryptSync(pw, salt, 64).toString('hex')}`;
          sqliteDb.prepare('INSERT INTO users VALUES(?,?,?,?,?,?,?)').run(
            id, username, hash, role, isDemo ? 1 : 0, JSON.stringify(rest), Date.now()
          );
        }
        for (const c of defaultCategories) {
          sqliteDb.prepare('INSERT INTO categories VALUES(?,?)').run(c.id, JSON.stringify(c));
        }
        const seen = new Set();
        for (const c of defaultCategories) {
          for (const q of defaultQuestions(c)) {
            if (seen.has(q.id)) continue;
            seen.add(q.id);
            sqliteDb.prepare('INSERT INTO questions VALUES(?,?)').run(q.id, JSON.stringify(q));
          }
        }
        for (const r of defaultResources) {
          sqliteDb.prepare('INSERT INTO resources VALUES(?,?)').run(r.id, JSON.stringify(r));
        }
        sqliteDb.exec('COMMIT');
      }
    }
  },

  // --- Categories ---
  async getCategory(id) {
    if (!id || typeof id !== 'string') return null;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('categories').select('data').eq('id', id).maybeSingle();
      if (error || !data) return null;
      return parseJson(data.data);
    } else {
      const r = sqliteDb.prepare('SELECT data FROM categories WHERE id=?').get(id);
      return r ? parseJson(r.data) : null;
    }
  },

  async allCategories() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('categories').select('data');
      if (error || !data) return [];
      return data.map(r => parseJson(r.data));
    } else {
      return sqliteDb.prepare('SELECT data FROM categories').all().map(r => parseJson(r.data));
    }
  },

  async updateCategory(id, nextData) {
    if (isSupabaseConfigured) {
      await supabase.from('categories').upsert({ id, data: nextData });
      return nextData;
    } else {
      sqliteDb.prepare('UPDATE categories SET data=? WHERE id=?').run(JSON.stringify(nextData), id);
      return nextData;
    }
  },

  // --- Users ---
  async getUserById(id) {
    if (!id) return null;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
      if (error || !data) return null;
      return { ...data, is_demo: data.is_demo ? 1 : 0 };
    } else {
      return sqliteDb.prepare('SELECT * FROM users WHERE id=?').get(id) || null;
    }
  },

  async getUserByUsername(username) {
    if (!username) return null;
    const clean = username.trim();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('users').select('*').ilike('username', clean).maybeSingle();
      if (error || !data) return null;
      return { ...data, is_demo: data.is_demo ? 1 : 0 };
    } else {
      return sqliteDb.prepare('SELECT * FROM users WHERE username=?').get(clean) || null;
    }
  },

  async insertUser({ id, username, pass_hash, role, is_demo, data, created_at }) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('users').insert({
        id,
        username,
        pass_hash,
        role,
        is_demo: !!is_demo,
        data: parseJson(data),
        created_at: created_at || Date.now()
      });
      if (error) throw new Error(error.message);
    } else {
      sqliteDb.prepare('INSERT INTO users VALUES(?,?,?,?,?,?,?)').run(
        id, username, pass_hash, role, is_demo ? 1 : 0, stringifyJson(data), created_at || Date.now()
      );
    }
  },

  async updateUserData(userId, dataObj) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('users').update({ data: dataObj }).eq('id', userId);
      if (error) throw new Error(error.message);
    } else {
      sqliteDb.prepare('UPDATE users SET data=? WHERE id=?').run(JSON.stringify(dataObj), userId);
    }
  },

  async updateUserPassword(userId, passHash) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('users').update({ pass_hash: passHash }).eq('id', userId);
      if (error) throw new Error(error.message);
    } else {
      sqliteDb.prepare('UPDATE users SET pass_hash=? WHERE id=?').run(passHash, userId);
    }
  },

  async allCandidates() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('users').select('*').eq('role', 'candidate').order('created_at', { ascending: true });
      if (error || !data) return [];
      return data.map(u => ({ ...u, is_demo: u.is_demo ? 1 : 0 }));
    } else {
      return sqliteDb.prepare("SELECT * FROM users WHERE role='candidate' ORDER BY created_at").all();
    }
  },

  async demoUsers() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('users').select('*').eq('is_demo', true).order('created_at', { ascending: true });
      if (error || !data) return [];
      return data.map(u => ({ ...u, is_demo: 1 }));
    } else {
      return sqliteDb.prepare('SELECT * FROM users WHERE is_demo=1 ORDER BY created_at').all();
    }
  },

  // --- Tokens / Sessions (Single Active Session) ---
  async openSession(userId, token, expiresAt) {
    if (isSupabaseConfigured) {
      // Kick out any previous active tokens for this user
      await supabase.from('tokens').update({ revoked: 'replaced' }).eq('user_id', userId).is('revoked', null);
      // Clean old expired tokens
      await supabase.from('tokens').delete().lt('expires_at', Date.now() - 864e5);
      // Insert fresh session token
      await supabase.from('tokens').insert({ token, user_id: userId, expires_at: expiresAt, revoked: null });
    } else {
      sqliteDb.prepare("UPDATE tokens SET revoked='replaced' WHERE user_id=? AND revoked IS NULL").run(userId);
      sqliteDb.prepare('DELETE FROM tokens WHERE expires_at < ?').run(Date.now() - 864e5);
      sqliteDb.prepare('INSERT INTO tokens VALUES(?,?,?,NULL)').run(token, userId, expiresAt);
    }
  },

  async getToken(token) {
    if (!token) return null;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('tokens').select('*').eq('token', token).maybeSingle();
      if (error || !data) return null;
      return data;
    } else {
      return sqliteDb.prepare('SELECT * FROM tokens WHERE token=?').get(token) || null;
    }
  },

  async revokeToken(token, reason = 'logout') {
    if (!token) return;
    if (isSupabaseConfigured) {
      await supabase.from('tokens').update({ revoked: reason }).eq('token', token);
    } else {
      sqliteDb.prepare('UPDATE tokens SET revoked=? WHERE token=?').run(reason, token);
    }
  },

  async revokeUserTokens(userId, reason = 'reset') {
    if (!userId) return;
    if (isSupabaseConfigured) {
      await supabase.from('tokens').update({ revoked: reason }).eq('user_id', userId).is('revoked', null);
    } else {
      sqliteDb.prepare('UPDATE tokens SET revoked=? WHERE user_id=? AND revoked IS NULL').run(reason, userId);
    }
  },

  // --- Questions Bank ---
  async allQuestions() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('questions').select('data');
      if (error || !data) return [];
      return data.map(r => parseJson(r.data));
    } else {
      return sqliteDb.prepare('SELECT data FROM questions').all().map(r => parseJson(r.data));
    }
  },

  async upsertQuestions(questionItems) {
    const list = Array.isArray(questionItems) ? questionItems : [questionItems];
    if (isSupabaseConfigured) {
      for (let i = 0; i < list.length; i += 50) {
        const batch = list.slice(i, i + 50).map(q => ({ id: q.id, data: q }));
        const { error } = await supabase.from('questions').upsert(batch);
        if (error) throw new Error(error.message);
      }
    } else {
      sqliteDb.exec('BEGIN');
      for (const q of list) {
        sqliteDb.prepare('INSERT OR REPLACE INTO questions VALUES(?,?)').run(q.id, JSON.stringify(q));
      }
      sqliteDb.exec('COMMIT');
    }
  },

  async deleteQuestion(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      return { deleted: error ? 0 : 1 };
    } else {
      const res = sqliteDb.prepare('DELETE FROM questions WHERE id=?').run(id);
      return { deleted: res.changes };
    }
  },

  // --- Study Resources ---
  async allResources() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('resources').select('data');
      if (error || !data) return [];
      return data.map(r => parseJson(r.data));
    } else {
      return sqliteDb.prepare('SELECT data FROM resources').all().map(r => parseJson(r.data));
    }
  },

  async upsertResource(resObj) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('resources').upsert({ id: resObj.id, data: resObj });
      if (error) throw new Error(error.message);
      return resObj;
    } else {
      sqliteDb.prepare('INSERT OR REPLACE INTO resources VALUES(?,?)').run(resObj.id, JSON.stringify(resObj));
      return resObj;
    }
  },

  async deleteResource(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      return { deleted: error ? 0 : 1 };
    } else {
      const res = sqliteDb.prepare('DELETE FROM resources WHERE id=?').run(id);
      return { deleted: res.changes };
    }
  },

  // --- Exams ---
  async getActiveExam(userId) {
    if (!userId) return null;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('exams').select('*').eq('user_id', userId).eq('status', 'active').maybeSingle();
      if (error || !data) return null;
      return {
        ...data,
        snapshot: stringifyJson(data.snapshot),
        answers: stringifyJson(data.answers),
        flagged: stringifyJson(data.flagged),
        result: stringifyJson(data.result)
      };
    } else {
      return sqliteDb.prepare("SELECT * FROM exams WHERE user_id=? AND status='active'").get(userId) || null;
    }
  },

  async getSubmittedAttemptsCount(userId) {
    if (isSupabaseConfigured) {
      const { count } = await supabase.from('exams').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'submitted');
      return count || 0;
    } else {
      return sqliteDb.prepare("SELECT COUNT(*) n FROM exams WHERE user_id=? AND status='submitted'").get(userId)?.n || 0;
    }
  },

  async createExam({ id, user_id, category_id, started_at, ends_at, snapshot }) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('exams').insert({
        id,
        user_id,
        category_id,
        status: 'active',
        started_at,
        ends_at,
        snapshot: parseJson(snapshot),
        answers: {},
        flagged: {},
        strikes: 0
      });
      if (error) throw new Error(error.message);
    } else {
      sqliteDb.prepare("INSERT INTO exams(id,user_id,category_id,status,started_at,ends_at,snapshot) VALUES(?,?,?,'active',?,?,?)").run(
        id, user_id, category_id, started_at, ends_at, stringifyJson(snapshot)
      );
    }
  },

  async getExamById(id) {
    if (!id) return null;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('exams').select('*').eq('id', id).maybeSingle();
      if (error || !data) return null;
      return {
        ...data,
        snapshot: stringifyJson(data.snapshot),
        answers: stringifyJson(data.answers),
        flagged: stringifyJson(data.flagged),
        result: stringifyJson(data.result)
      };
    } else {
      return sqliteDb.prepare('SELECT * FROM exams WHERE id=?').get(id) || null;
    }
  },

  async updateExamProgress(examId, answers, flagged, strikes) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('exams').update({
        answers: answers || {},
        flagged: flagged || {},
        strikes: strikes || 0
      }).eq('id', examId).eq('status', 'active');
      if (error) throw new Error(error.message);
    } else {
      sqliteDb.prepare('UPDATE exams SET answers=?, flagged=?, strikes=? WHERE id=?').run(
        JSON.stringify(answers || {}), JSON.stringify(flagged || {}), strikes || 0, examId
      );
    }
  },

  async finalizeExam(examId, submittedAt, answers, strikes, resultObj) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('exams').update({
        status: 'submitted',
        submitted_at: submittedAt,
        answers: answers || {},
        strikes: strikes || 0,
        result: resultObj
      }).eq('id', examId).eq('status', 'active');
      if (error) throw new Error(error.message);
    } else {
      sqliteDb.prepare("UPDATE exams SET status='submitted', submitted_at=?, answers=?, strikes=?, result=? WHERE id=? AND status='active'").run(
        submittedAt, JSON.stringify(answers || {}), strikes || 0, JSON.stringify(resultObj), examId
      );
    }
  },

  async getLastSubmittedExam(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('exams').select('result').eq('user_id', userId).eq('status', 'submitted').order('submitted_at', { ascending: false }).limit(1).maybeSingle();
      if (error || !data) return null;
      return parseJson(data.result);
    } else {
      const r = sqliteDb.prepare("SELECT result FROM exams WHERE user_id=? AND status='submitted' ORDER BY submitted_at DESC").get(userId);
      return r ? parseJson(r.result) : null;
    }
  },

  async getUserSubmittedExams(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('exams').select('result').eq('user_id', userId).eq('status', 'submitted').order('submitted_at', { ascending: false });
      if (error || !data) return [];
      return data.map(r => parseJson(r.result));
    } else {
      return sqliteDb.prepare("SELECT result FROM exams WHERE user_id=? AND status='submitted' ORDER BY submitted_at DESC").all(userId).map(r => parseJson(r.result));
    }
  },

  async getAllSubmittedExamsForMerit(includeDemo = false) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('exams').select('result, users!inner(is_demo)').eq('status', 'submitted');
      if (error || !data) return [];
      return data
        .filter(r => includeDemo || !r.users?.is_demo)
        .map(r => parseJson(r.result))
        .sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
    } else {
      return sqliteDb.prepare("SELECT e.result, u.is_demo FROM exams e JOIN users u ON u.id=e.user_id WHERE e.status='submitted'").all()
        .filter(r => includeDemo || !r.is_demo)
        .map(r => parseJson(r.result))
        .sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
    }
  }
};
