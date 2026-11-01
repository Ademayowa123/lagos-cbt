/**
 * Lagos State Civil Service Promotion Examination Platform - Authentication
 *
 * Accounts, passwords and sessions are now handled by the server (see /server).
 * This file only calls the server and keeps a copy of the signed-in user for the screens.
 * Starter accounts live in server/seedUsers.js (server only).
 */
import { api, getToken, saveSession, saveUser, clearSession, CURRENT_USER_KEY } from '../api';

/** Signed-in user (null if not logged in). The server re-checks the session on every request. */
export function getCurrentUser() {
  if (!getToken()) return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading current user:', e);
  }
  return null;
}

/** Password rule shown to users (the server enforces it too). */
export function validatePassword(password) {
  if (!password) return { isValid: false, message: 'Password is required.' };
  if (password.length < 4) return { isValid: false, message: 'Password must be a minimum of 4 characters.' };
  return { isValid: true, message: '' };
}

/** Username preview only. The server assigns the final name and adds a number if it is taken. */
export function previewUsername(firstName, surname, forcedNumber = '') {
  const clean = (s) => (s || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const first = clean(firstName);
  const sur = clean(surname);
  if (!first || !sur) return '';
  const num = forcedNumber !== null && forcedNumber !== '' && !isNaN(forcedNumber) ? forcedNumber : '';
  return `${first}.${sur}${num}`;
}

/** Log in as candidate or administrator. */
export async function authenticateUser(username, password) {
  if (!username?.trim() || !password) throw new Error('Username and password are required.');
  const { token, user } = await api('/auth/login', { method: 'POST', body: { username: username.trim(), password }, auth: false });
  saveSession(token, user);
  return user;
}

/** Register a new candidate; the server creates the username and signs them in. */
export async function registerCandidate(fields) {
  const { token, user } = await api('/auth/register', { method: 'POST', body: fields, auth: false });
  saveSession(token, user);
  return user;
}

/** Demo accounts shown on the Demo Mode tab (no passwords are ever sent). */
export async function fetchDemoUsers() {
  return api('/demo-users', { auth: false });
}

/** One-click demo login. */
export async function loginDemo(userId) {
  const { token, user } = await api('/auth/demo', { method: 'POST', body: { userId }, auth: false });
  saveSession(token, user);
  return user;
}

/** Log out (also ends the session on the server). */
export function logoutUser() {
  const token = getToken();
  if (token) fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
  clearSession();
}

/** Update the signed-in candidate's profile. */
export async function updateUserProfile(_userId, updates) {
  const user = await api('/me', { method: 'PUT', body: updates });
  saveUser(user);
  return user;
}

/** Change the signed-in user's password. */
export async function changeUserPassword(_userId, currentPassword, newPassword) {
  await api('/me/password', { method: 'POST', body: { currentPassword, newPassword } });
  return getCurrentUser();
}

/** Admin: list registered candidates. */
export async function getRegisteredCandidates() {
  return api('/candidates');
}

/** Admin: set a new password for a candidate. */
export async function resetCandidatePassword(candidateId, newPassword) {
  return api(`/candidates/${candidateId}/reset-password`, { method: 'POST', body: { newPassword } });
}