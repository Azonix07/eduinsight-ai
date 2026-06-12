/* eslint-disable */
/**
 * EduInsight AI — end-to-end smoke test for the answer-sheet grading pipeline.
 * Requires the API running (npm run start:dev) and a seeded DB (npm run seed).
 *
 * Usage:  node scripts/smoke-test.js
 */
const fs = require('fs');
const path = require('path');

const API = process.env.API_URL || 'http://localhost:4000/api';
const ids = JSON.parse(fs.readFileSync(path.join(__dirname, '.seed-ids.json'), 'utf8'));

async function req(method, url, { token, body, json } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${url}`, { method, headers, body: json ? JSON.stringify(json) : body });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status}: ${text}`);
  return data;
}

(async () => {
  // 1. Login as the seeded teacher.
  const login = await req('POST', '/auth/login', {
    json: { email: 'teacher@springfield.edu', password: 'Password123!' },
  });
  const token = login.data.accessToken;
  console.log(`1. Logged in as ${login.data.user.firstName} ${login.data.user.lastName} (${login.data.user.role})`);

  // 2. Upload an answer sheet (dummy image; demo OCR returns mock structured answers).
  const fd = new FormData();
  fd.append('examId', String(ids.examId));
  fd.append('studentId', String(ids.studentId));
  fd.append('files', new Blob([Buffer.from('demo-answer-sheet-image')], { type: 'image/jpeg' }), 'page1.jpg');
  const up = await req('POST', '/answer-sheets/upload', { token, body: fd });
  const sheetId = up.data._id;
  console.log(`2. Uploaded sheet ${sheetId} — OCR ${up.data.ocrResult.status}, ${up.data.ocrResult.structuredContent.length} answer(s) extracted`);

  // 3. Evaluate against the exam marking scheme (+ deep analysis).
  const ev = await req('POST', `/answer-sheets/${sheetId}/evaluate`, { token });
  const e = ev.data.evaluation;
  console.log(`3. Evaluated: ${e.totalMarks}/${e.maxMarks} (${e.percentage}%) grade ${e.grade}, ${e.questionResults.length} question(s) graded`);

  // 4. Teacher override of question 1.
  const ov = await req('PATCH', `/answer-sheets/${sheetId}/override`, {
    token, json: { questionNumber: 1, marksAwarded: 9, reason: 'Generous partial credit on method' },
  });
  console.log(`4. Override applied — new total ${ov.data.evaluation.totalMarks}/${ov.data.evaluation.maxMarks} (${ov.data.evaluation.percentage}%)`);

  // 5. Re-fetch to confirm persistence.
  const got = await req('GET', `/answer-sheets/${sheetId}`, { token });
  console.log(`5. Re-fetched — exam "${got.data.exam.name}", student roll ${got.data.student.rollNumber}, grade ${got.data.evaluation.grade}`);

  console.log('\n✅ Full pipeline OK: login → upload → OCR → evaluate → override → persist');
})().catch((e) => {
  console.error('❌ Smoke test failed:', e.message);
  process.exit(1);
});
