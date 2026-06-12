/* eslint-disable */
/**
 * EduInsight AI — demo data seed script.
 *
 * Inserts a complete, self-consistent demo dataset (school, users for every role,
 * teacher/student profiles, subjects, and an exam with a marking scheme) so the
 * dashboards and the answer-sheet grading pipeline have real data to work with.
 *
 * Usage:  node scripts/seed.js   (or `npm run seed`)
 * Idempotent: clears and re-inserts the demo collections on each run.
 */
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

// Pull MONGODB_URI from .env if not already in the environment.
(function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!process.env.MONGODB_URI && fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*MONGODB_URI\s*=\s*(.+?)\s*$/);
      if (m) process.env.MONGODB_URI = m[1].trim();
    }
  }
})();

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduinsight';
const PASSWORD = 'Password123!';

async function main() {
  const client = new MongoClient(URI, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db();
  console.log(`Connected to ${URI}`);

  const now = new Date();
  const ts = { createdAt: now, updatedAt: now };
  const hash = await bcrypt.hash(PASSWORD, 12);

  for (const c of ['schools', 'users', 'teachers', 'students', 'subjects', 'exams', 'answersheets', 'notifications']) {
    await db.collection(c).deleteMany({});
  }
  console.log('Cleared existing demo collections');

  // ---- School ----
  const schoolId = new ObjectId();
  await db.collection('schools').insertOne({
    _id: schoolId,
    name: 'Springfield High School',
    code: 'SPHS01',
    address: { street: '742 Evergreen Terrace', city: 'Springfield', state: 'IL', country: 'USA', zip: '62704' },
    contactEmail: 'office@springfield.edu',
    contactPhone: '+1-555-0100',
    settings: { academicYear: '2025-2026', gradingSystem: 'percentage', timezone: 'America/Chicago' },
    subscription: { plan: 'pro', status: 'active', expiresAt: new Date('2026-12-31') },
    isActive: true,
    ...ts,
  });

  // ---- Users (one per role) ----
  const makeUser = (role, firstName, lastName, email, withSchool = true) => {
    const u = {
      _id: new ObjectId(),
      email: email.toLowerCase(),
      password: hash,
      firstName,
      lastName,
      role,
      isEmailVerified: true,
      isActive: true,
      refreshTokens: [],
      ...ts,
    };
    if (withSchool) u.school = schoolId;
    return u;
  };
  const superAdmin = makeUser('super_admin', 'Sam', 'Architect', 'admin@eduinsight.ai', false);
  const schoolAdmin = makeUser('school_admin', 'Priya', 'Principal', 'principal@springfield.edu');
  const teacherUser = makeUser('teacher', 'Tom', 'Teacher', 'teacher@springfield.edu');
  const studentUser = makeUser('student', 'Alex', 'Student', 'student@springfield.edu');
  const parentUser = makeUser('parent', 'Pat', 'Parent', 'parent@springfield.edu');
  await db.collection('users').insertMany([superAdmin, schoolAdmin, teacherUser, studentUser, parentUser]);

  // ---- Subjects ----
  const mathId = new ObjectId();
  const physId = new ObjectId();
  const engId = new ObjectId();
  await db.collection('subjects').insertMany([
    {
      _id: mathId, name: 'Mathematics', code: 'MATH10', school: schoolId, grade: '10', category: 'core',
      syllabus: [
        { unit: 'Algebra', topics: ['Quadratic Equations', 'Linear Equations'], weightage: 40 },
        { unit: 'Geometry & Trigonometry', topics: ['Triangles', 'Trigonometric Ratios'], weightage: 35 },
        { unit: 'Statistics & Probability', topics: ['Probability', 'Mean/Median/Mode'], weightage: 25 },
      ],
      isActive: true, ...ts,
    },
    { _id: physId, name: 'Physics', code: 'PHY10', school: schoolId, grade: '10', category: 'core', syllabus: [], isActive: true, ...ts },
    { _id: engId, name: 'English', code: 'ENG10', school: schoolId, grade: '10', category: 'language', syllabus: [], isActive: true, ...ts },
  ]);

  // ---- Teacher profile ----
  const teacherId = new ObjectId();
  await db.collection('teachers').insertOne({
    _id: teacherId, user: teacherUser._id, school: schoolId, employeeId: 'EMP-1001',
    department: 'Science & Mathematics', subjects: [mathId, physId], grades: ['10'],
    qualification: 'M.Sc. Mathematics', experience: 8, specializations: ['Algebra', 'Calculus'], isActive: true, ...ts,
  });
  await db.collection('subjects').updateMany({ _id: { $in: [mathId, physId] } }, { $set: { teacher: teacherId } });

  // ---- Student profile ----
  const studentId = new ObjectId();
  await db.collection('students').insertOne({
    _id: studentId, user: studentUser._id, school: schoolId, rollNumber: '10A-01', admissionNumber: 'ADM-2025-001',
    grade: '10', section: 'A', age: 15, gender: 'other',
    parentInfo: {
      fatherName: 'Pat Parent', motherName: 'Pat Parent', parentUser: parentUser._id,
      contactPhone: '+1-555-0142', contactEmail: 'parent@springfield.edu',
    },
    academicHistory: [{ year: '2024-2025', grade: '9', percentage: 78, rank: 6 }],
    performanceHistory: [
      { examId: new ObjectId(), subjectId: mathId, marks: 38, maxMarks: 50, date: new Date('2026-01-15') },
      { examId: new ObjectId(), subjectId: physId, marks: 33, maxMarks: 50, date: new Date('2026-02-20') },
      { examId: new ObjectId(), subjectId: mathId, marks: 41, maxMarks: 50, date: new Date('2026-03-18') },
    ],
    isActive: true, ...ts,
  });

  // ---- Exam with marking scheme ----
  const examId = new ObjectId();
  await db.collection('exams').insertOne({
    _id: examId, name: 'Mathematics Unit Test 1', type: 'unit_test', subject: mathId, school: schoolId,
    grade: '10', section: 'A', teacher: teacherId, date: new Date('2026-06-10'), duration: 60,
    maxMarks: 50, passingMarks: 20,
    markingScheme: [
      { questionNumber: 1, maxMarks: 10, topic: 'Quadratic Equations', answerKey: 'x = 2 or x = -3; factor (x-2)(x+3)=0', rubric: 'Full marks for both correct roots with method; 5 for method only.' },
      { questionNumber: 2, maxMarks: 10, topic: 'Linear Equations', answerKey: 'x = 4, y = 1', rubric: 'Marks per correctly solved variable with valid steps.' },
      { questionNumber: 3, maxMarks: 10, topic: 'Trigonometry', answerKey: 'height = 50·tan(60°) ≈ 86.6 m', rubric: 'Correct identity (4) + correct computation (6).' },
      { questionNumber: 4, maxMarks: 10, topic: 'Probability', answerKey: 'P = 3/8', rubric: 'Correct sample space (5) + correct probability (5).' },
      { questionNumber: 5, maxMarks: 10, topic: 'Geometry', answerKey: 'Area = 1/2·b·h = 24 cm²', rubric: 'Formula (3) + substitution (3) + answer (4).' },
    ],
    status: 'active', totalAnswerSheets: 0, ...ts,
  });

  // Save key IDs for the verification step / convenience.
  fs.writeFileSync(
    path.join(__dirname, '.seed-ids.json'),
    JSON.stringify({ schoolId, examId, studentId, teacherId, mathId }, null, 2),
  );

  console.log('\n✅ Seed complete');
  console.log('   School:   Springfield High School (code SPHS01)');
  console.log('   Subjects: Mathematics, Physics, English (grade 10)');
  console.log(`   Exam:     "Mathematics Unit Test 1"  id=${examId}`);
  console.log(`   Student:  Alex Student  roll=10A-01  id=${studentId}`);
  console.log(`\n   Login — password for ALL accounts: ${PASSWORD}`);
  console.log('     • super_admin   admin@eduinsight.ai');
  console.log('     • school_admin  principal@springfield.edu');
  console.log('     • teacher       teacher@springfield.edu');
  console.log('     • student       student@springfield.edu');
  console.log('     • parent        parent@springfield.edu');

  await client.close();
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
