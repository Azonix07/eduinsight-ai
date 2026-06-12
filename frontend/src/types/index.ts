/* ============================================================
   EduInsight AI — Core TypeScript Types
   ============================================================ */

// ─── User & Auth ─────────────────────────────────────────────

export type UserRole = "super_admin" | "school_admin" | "teacher" | "student" | "parent";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  school?: School;
  avatar?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolCode?: string;
}

// ─── School ──────────────────────────────────────────────────

export interface School {
  _id: string;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  contactEmail: string;
  contactPhone: string;
  logo?: string;
  settings: {
    academicYear: string;
    gradingSystem: string;
    timezone: string;
  };
  subscription: {
    plan: "starter" | "professional" | "enterprise";
    status: "active" | "inactive" | "trial";
    expiresAt: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Student ─────────────────────────────────────────────────

export interface Student {
  _id: string;
  user: User;
  school: School;
  rollNumber: string;
  admissionNumber: string;
  grade: string;
  section: string;
  age: number;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  parentInfo: {
    fatherName: string;
    motherName: string;
    parentUser?: User;
    contactPhone: string;
    contactEmail: string;
  };
  academicHistory: AcademicRecord[];
  performanceHistory: PerformanceRecord[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicRecord {
  year: string;
  grade: string;
  percentage: number;
  rank?: number;
}

export interface PerformanceRecord {
  examId: string;
  subjectId: string;
  marks: number;
  maxMarks: number;
  date: string;
}

// ─── Teacher ─────────────────────────────────────────────────

export interface Teacher {
  _id: string;
  user: User;
  school: School;
  employeeId: string;
  department: string;
  subjects: Subject[];
  grades: string[];
  qualification: string;
  experience: number;
  specializations: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Subject ─────────────────────────────────────────────────

export type SubjectCategory = "core" | "elective" | "language" | "custom";

export interface Subject {
  _id: string;
  name: string;
  code: string;
  school: School;
  grade: string;
  category: SubjectCategory;
  teacher?: Teacher;
  syllabus: SyllabusUnit[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusUnit {
  unit: string;
  topics: string[];
  weightage: number;
}

// ─── Exam ────────────────────────────────────────────────────

export type ExamType = "assignment" | "unit_test" | "midterm" | "final" | "quiz" | "practice";
export type ExamStatus = "draft" | "scheduled" | "active" | "completed" | "evaluated";

export interface Exam {
  _id: string;
  name: string;
  type: ExamType;
  subject: Subject;
  school: School;
  grade: string;
  section: string;
  teacher: Teacher;
  date: string;
  duration: number;
  maxMarks: number;
  passingMarks: number;
  markingScheme: MarkingSchemeItem[];
  status: ExamStatus;
  totalAnswerSheets: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarkingSchemeItem {
  questionNumber: number;
  maxMarks: number;
  topic: string;
  answerKey?: string;
  rubric?: string;
}

// ─── Answer Sheet ────────────────────────────────────────────

export type OCRStatus = "pending" | "processing" | "completed" | "failed";
export type EvaluationStatus = "pending" | "processing" | "completed" | "reviewed" | "published";
export type ErrorType = "conceptual" | "grammar" | "factual" | "calculation" | "incomplete";
export type LearningStyle = "visual" | "practical" | "analytical" | "memory_based";

export interface AnswerSheet {
  _id: string;
  exam: Exam;
  student: Student;
  school: School;
  files: AnswerSheetFile[];
  ocrResult: OCRResult;
  evaluation: Evaluation;
  analysis: StudentAnalysis;
  uploadedAt: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnswerSheetFile {
  url: string;
  publicId: string;
  pageNumber: number;
  format: "jpg" | "png" | "pdf" | "tiff";
}

export interface OCRResult {
  extractedText: string;
  structuredContent: StructuredAnswer[];
  status: OCRStatus;
  processedAt?: string;
}

export interface StructuredAnswer {
  questionNumber: number;
  answerText: string;
  hasDiagrams: boolean;
  hasEquations: boolean;
  confidence: number;
}

export interface Evaluation {
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  questionResults: QuestionResult[];
  status: EvaluationStatus;
  evaluatedAt?: string;
  reviewedBy?: string;
}

export interface QuestionResult {
  questionNumber: number;
  marksAwarded: number;
  maxMarks: number;
  feedback: string;
  improvementSuggestion: string;
  errors: AnswerError[];
  isOverridden: boolean;
  overriddenBy?: string;
  overrideReason?: string;
}

export interface AnswerError {
  type: ErrorType;
  description: string;
}

export interface StudentAnalysis {
  strengths: string[];
  weaknesses: string[];
  learningStyle: LearningStyle;
  conceptUnderstanding: number;
  writingQuality: number;
  criticalThinking: number;
  analyticalAbility: number;
  problemSolving: number;
}

// ─── Intelligence Report ─────────────────────────────────────

export interface IntelligenceReport {
  overallScore: number;
  performanceIndex: number;
  subjectMastery: number;
  conceptUnderstanding: number;
  writingQuality: number;
  criticalThinking: number;
  analyticalAbility: number;
  problemSolving: number;
  confidenceScore: number;
  consistencyScore: number;
  examReadinessScore: number;
  learningEfficiencyScore: number;
}

// ─── AI Improvement Plan ─────────────────────────────────────

export interface ImprovementPlan {
  dailyPlan: StudyPlanItem[];
  weeklyPlan: StudyPlanItem[];
  monthlyPlan: StudyPlanItem[];
  recommendedTopics: string[];
  weakAreas: string[];
  highPriorityTopics: string[];
  suggestedExercises: Exercise[];
  personalizedRecommendations: string[];
}

export interface StudyPlanItem {
  day?: string;
  week?: string;
  month?: string;
  subject: string;
  topic: string;
  activity: string;
  duration: string;
  priority: "high" | "medium" | "low";
}

export interface Exercise {
  title: string;
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
}

// ─── AI Predictions ──────────────────────────────────────────

export interface Prediction {
  riskOfFailure: number;
  likelyExamScore: number;
  subjectDifficulty: Record<string, number>;
  performanceGrowth: number;
  improvementProbability: number;
  alerts: PredictionAlert[];
}

export interface PredictionAlert {
  type: "warning" | "critical" | "info";
  message: string;
  subject?: string;
  recommendation: string;
}

// ─── Notifications ───────────────────────────────────────────

export type NotificationType = "performance" | "exam" | "improvement" | "alert" | "system";

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  sentVia: "in_app" | "email" | "both";
  createdAt: string;
}

// ─── Analytics ───────────────────────────────────────────────

export interface AnalyticsOverview {
  totalStudents: number;
  totalExams: number;
  averageScore: number;
  passRate: number;
  topPerformers: StudentSummary[];
  weakStudents: StudentSummary[];
  subjectPerformance: SubjectPerformance[];
  trends: TrendData[];
}

export interface StudentSummary {
  student: Pick<Student, "_id" | "rollNumber" | "grade" | "section">;
  user: Pick<User, "firstName" | "lastName" | "avatar">;
  averageScore: number;
  totalExams: number;
  trend: "up" | "down" | "stable";
}

export interface SubjectPerformance {
  subject: Pick<Subject, "_id" | "name" | "code">;
  averageScore: number;
  passRate: number;
  topScore: number;
  lowestScore: number;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

// ─── API Pagination ──────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Chat ────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  _id: string;
  user: string;
  messages: ChatMessage[];
  context?: {
    examId?: string;
    subjectId?: string;
  };
  createdAt: string;
  updatedAt: string;
}
