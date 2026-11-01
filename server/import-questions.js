/**
 * Add questions to the bank from a JSON file.
 *
 *   node server/import-questions.js new_questions.json
 *
 * - Uses the same database as the server: local SQLite by default (server/data/cbt.db, or DB_PATH),
 *   or Supabase when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in the environment.
 * - Safe to run more than once: each question has a fixed id, so re-running updates instead of duplicating.
 * - Existing questions are never deleted.
 */
import fs from 'node:fs';
import path from 'node:path';
import { db } from './db.js';

const file = process.argv[2] || 'new_questions.json';
if (!fs.existsSync(file)) {
  console.error(`File not found: ${path.resolve(file)}\nUsage: node server/import-questions.js new_questions.json`);
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(items) || !items.length) {
  console.error('The file must contain a JSON array of questions.');
  process.exit(1);
}

// Same checks the server applies to a question added from the Admin panel
const problems = [];
const ids = new Set();
items.forEach((q, i) => {
  const at = `#${i + 1} (${q?.id || 'no id'})`;
  if (!q || typeof q.id !== 'string' || !q.id) return problems.push(`${at}: missing id`);
  if (ids.has(q.id)) problems.push(`${at}: duplicate id in file`);
  ids.add(q.id);
  if (typeof q.question !== 'string' || !q.question.trim()) problems.push(`${at}: missing question text`);
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.some((o) => typeof o !== 'string' || !o.trim()))
    problems.push(`${at}: needs at least two non-empty options`);
  if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer >= (q.options?.length || 0))
    problems.push(`${at}: correctAnswer must be the index of one option`);
  if (!Array.isArray(q.categories) || !q.categories.length) problems.push(`${at}: needs at least one grade group in categories`);
});
if (problems.length) {
  console.error(`Nothing was imported. Fix these first:\n - ${problems.slice(0, 20).join('\n - ')}`);
  process.exit(1);
}

const before = (await db.allQuestions()).length;
await db.upsertQuestions(items.map((q) => ({ ...q, categoryId: q.categories[0] })));
const after = (await db.allQuestions()).length;

const perGroup = {};
for (const q of items) for (const g of q.categories) perGroup[g] = (perGroup[g] || 0) + 1;
console.log(`Imported ${items.length} questions. Bank size: ${before} -> ${after}`);
console.log('Added per grade group:', perGroup);
process.exit(0);