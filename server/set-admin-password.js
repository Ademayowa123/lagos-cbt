/**
 * Set (or reset) the administrator password.
 * Use when the admin password was lost or the first-run password was not noted.
 *
 *   node server/set-admin-password.js "your-new-password"
 *
 * Stop the server first, then start it again afterwards.
 */
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const here = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(here, 'data', 'cbt.db');
const password = (process.argv[2] || '').trim();

if (password.length < 6) {
  console.error('Usage: node server/set-admin-password.js "new-password"   (at least 6 characters)');
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);
const admin = db.prepare("SELECT id FROM users WHERE role='admin' LIMIT 1").get();
if (!admin) {
  console.error('No administrator account found. Start the server once so it can create one.');
  process.exit(1);
}
const salt = crypto.randomBytes(16);
const hash = `${salt.toString('hex')}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
db.prepare('UPDATE users SET pass_hash=? WHERE id=?').run(hash, admin.id);
db.prepare("UPDATE tokens SET revoked='reset' WHERE user_id=? AND revoked IS NULL").run(admin.id);
console.log('Administrator password updated. Username: admin');