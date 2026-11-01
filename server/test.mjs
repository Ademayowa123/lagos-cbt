// Smoke test: node server/test.mjs   (uses a temporary database)
import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
process.env.DB_PATH = path.join(os.tmpdir(), `cbt-test-${Date.now()}.db`);
process.env.ADMIN_PASSWORD = 'test-admin-pass';
process.env.GRACE_SECONDS = '1';
const { server } = await import('./server.js');
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const call = async (method, url, body, token) => {
  const r = await fetch(base + url, { method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }, body: body && JSON.stringify(body) });
  return { status: r.status, body: await r.json() };
};
const ok = (m) => console.log('  ✓', m);

let cand2; let r = await call('POST', '/api/auth/login', { username: 'admin', password: 'wrong' });
assert.equal(r.status, 401); ok('wrong admin password rejected');
r = await call('POST', '/api/auth/login', { username: 'admin', password: 'admin2027' });
assert.equal(r.status, 401); ok('old hard-coded admin password no longer works');
const admin = (await call('POST', '/api/auth/login', { username: 'admin', password: 'test-admin-pass' })).body.token; ok('admin login');

r = await call('POST', '/api/auth/register', { firstName: 'Ada', surname: 'Obi', password: 'secret1', categoryId: 'group-gl-06-10' });
assert.equal(r.status, 200); assert.equal(r.body.user.username, 'ada.obi'); assert.equal(r.body.user.password, undefined);
let cand = r.body.token; ok('candidate registered (no password in response)');
r = await call('POST', '/api/auth/register', { firstName: 'Ada', surname: 'Obi', password: 'secret1' });
assert.equal(r.body.user.username, 'ada.obi2'); ok('duplicate username numbered');
r = await call('GET', '/api/questions', null, cand); assert.equal(r.status, 403); ok('candidate cannot read the question bank');
r = await call('GET', '/api/merit', null, cand); assert.equal(r.status, 403); ok('candidate cannot read the merit roster');

r = await call('POST', '/api/exam/start', {}, cand);
assert.equal(r.status, 200); const exam = r.body;
assert.equal(exam.questions.length, 100); assert.ok(exam.remainingSeconds > 5000);
assert.ok(!JSON.stringify(exam).includes('correctAnswer')); ok('exam started: 100 questions, timer on server, no answers sent to browser');
r = await call('POST', '/api/exam/start', {}, cand); assert.equal(r.body.examId, exam.examId); ok('starting again resumes the same exam');

const answers = Object.fromEntries(exam.questions.slice(0, 10).map((q) => [q.id, 0]));
r = await call('PUT', '/api/exam/answers', { answers, securityStrikes: 1 }, cand); assert.equal(r.body.saved, true); ok('autosave');
r = await call('GET', '/api/exam/current', null, cand); assert.equal(Object.keys(r.body.answers).length, 10); ok('resume returns saved answers and strikes=' + r.body.securityStrikes);

r = await call('POST', '/api/exam/submit', { answers }, cand);
assert.equal(r.status, 200); assert.equal(r.body.totalQuestions, 100); assert.ok(r.body.examQuestions[0].correctAnswer !== undefined);
const res1 = r.body; ok(`submitted & marked by server: ${res1.totalCorrect}/100 (${res1.percentage}%)`);
r = await call('POST', '/api/exam/start', {}, cand); assert.equal(r.status, 403); assert.equal(r.body.code, 'ATTEMPTS_EXHAUSTED'); ok('second attempt blocked');

r = await call('GET', '/api/merit', null, admin); assert.equal(r.body.length, 1); assert.equal(r.body[0].candidate.username, 'ada.obi'); ok('merit roster shows the result');

const first = (await call('POST', '/api/auth/login', { username: 'babatunde.olatunji', password: 'pass' })).body.token;
await call('POST', '/api/auth/login', { username: 'babatunde.olatunji', password: 'pass' });
r = await call('GET', '/api/me', null, first); assert.equal(r.body.code, 'SESSION_REPLACED'); ok('second login kicks out the first (SESSION_REPLACED)');

r = await call('GET', '/api/demo-users');
assert.ok(r.body.length >= 3 && !JSON.stringify(r.body).includes('pass_hash') && !JSON.stringify(r.body).includes('admin2027') && r.body.every((u) => u.password === undefined)); ok('demo list is public and contains no passwords');
const demoId = r.body[0].id;
r = await call('POST', '/api/auth/demo', { userId: demoId }); assert.equal(r.status, 200); ok('one-click demo login');
r = await call('POST', '/api/auth/demo', { userId: 'usr-admin' }); assert.equal(r.status, 403); ok('demo login cannot be used on the admin or real accounts');
r = await call('PUT', '/api/me', { firstName: 'Adaeze', categoryId: 'group-gl-15-16', targetGrade: 'GL 16' }, (await call('POST', '/api/auth/login', { username: 'ada.obi2', password: 'secret1' })).body.token);
assert.equal(r.body.firstName, 'Adaeze'); assert.equal(r.body.categoryId, 'group-gl-06-10'); ok('candidate can edit name but not switch grade group');

r = await call('POST', '/api/questions', { question: 'Test?', options: ['a', 'b'], correctAnswer: 1, categoryId: 'group-gl-06-10' }, admin);
assert.equal(r.body.added, 1); ok('admin added a question');
r = await call('POST', '/api/questions', { question: 'Bad', options: ['a', 'b'], correctAnswer: 5, categoryId: 'x' }, admin); assert.equal(r.status, 400); ok('invalid question rejected');
r = await call('POST', `/api/candidates/${(await call('GET', '/api/candidates', null, admin)).body.find((u) => u.username === 'ada.obi').id}/reset-password`, { newPassword: 'newpass' }, admin);
assert.equal(r.body.ok, true);
r = await call('GET', '/api/me', null, cand); assert.equal(r.status, 401); ok('password reset signs the candidate out');
r = await call('POST', '/api/auth/login', { username: 'ada.obi', password: 'newpass' }); assert.equal(r.status, 200); ok('login with reset password');
r = await call('PUT', '/api/categories/group-gl-06-10', { timeLimitMinutes: 60, passScorePercentage: 55 }, admin); assert.equal(r.body.timeLimitMinutes, 60); ok('admin edited time/pass mark');

r = await call('GET', '/api/me/results', null, cand2 ?? (await call('POST', '/api/auth/login', { username: 'ada.obi', password: 'newpass' })).body.token);
assert.equal(r.body.length, 1); assert.equal(r.body[0].userAnswers, undefined); ok('candidate sees own past results (no answers)');
r = await call('GET', '/api/questions', null, admin);
assert.ok(r.body.every((q) => q.categoryId) && r.body.some((q) => q.question === 'Test?')); ok('admin question list carries categoryId for every question');
r = await call('GET', '/api/resources'); assert.ok(r.body.length > 0); ok('study materials are public');

// --- timer runs out before the candidate submits ---
await call('PUT', '/api/categories/group-gl-06-10', { timeLimitMinutes: 0.02 }, admin); // about 1 second
const demoTok = (await call('POST', '/api/auth/demo', { userId: 'usr-demo-gl06-10' })).body.token;
r = await call('POST', '/api/exam/start', {}, demoTok); assert.equal(r.status, 200);
const dq = r.body.questions.slice(0, 5);
await call('PUT', '/api/exam/answers', { answers: Object.fromEntries(dq.map((q) => [q.id, 1])) }, demoTok);
await new Promise((res) => setTimeout(res, 3500));
r = await call('PUT', '/api/exam/answers', { answers: { [dq[0].id]: 2 } }, demoTok);
assert.equal(r.status, 409); assert.equal(r.body.code, 'EXAM_ENDED'); ok('answers sent after time is up are refused');
r = await call('GET', '/api/exam/current', null, demoTok); assert.equal(r.body.active, false); ok('expired exam is closed by the server');
r = await call('POST', '/api/exam/submit', { answers: { [dq[1].id]: 3 } }, demoTok);
assert.equal(r.status, 200); assert.equal(Object.keys(r.body.userAnswers).length, 5); assert.equal(r.body.userAnswers[dq[1].id], 1); ok('timed-out exam auto-submitted with the saved answers; late answers ignored');

console.log('\nAll checks passed.'); server.close(); process.exit(0);
