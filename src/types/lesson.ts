/**
 * KruSmart Lesson Plan & Verification Types
 */

export interface LessonStep {
  id: string;
  stepNumber: number;
  name: string; // ជំហានទី១៖ រដ្ឋបាលថ្នាក់, ជំហានទី២៖ រំលឹកមេរៀនចាស់, etc.
  durationMinutes: number; // រយៈពេល (នាទី)
  teacherActivity: string; // សកម្មភាពគ្រូ
  studentActivity: string; // សកម្មភាពសិស្ស
  content: string; // ខ្លឹមសារមេរៀន
  teacherKey: string; // គន្លឹះគ្រូ ចម្លើយ និងចំណុចត្រូវសង្កត់ធ្ងន់
  verificationNote: string; // លក្ខខណ្ឌផ្ទៀងផ្ទាត់
  isVerified: boolean; // បានផ្ទៀងផ្ទាត់
  isCollapsed?: boolean;
}

export interface LessonObjectives {
  knowledge: string; // វិជ្ជាសម្បទា
  skills: string; // បំណិនសម្បទា
  attitude: string; // ចរិយាសម្បទា
}

export interface VerificationCriterion {
  id: string;
  titleKh: string;
  titleEn: string;
  weight: number;
}

export interface LessonVerification {
  auditorName: string;
  auditorRole: string; // នាយកសាលា, ប្រធានក្រុមបច្ចេកទេស, គរុនិស្សិត
  schoolName: string;
  auditDate: string;
  status: 'approved' | 'in_review' | 'needs_revision';
  generalRemarks: string;
  checkedCriteria: Record<string, boolean>;
}

export const KHMER_SKILLS = [
  { id: 'reading', labelKh: 'អំណាន', labelEn: 'Reading', icon: '📖' },
  { id: 'listening', labelKh: 'ការស្តាប់', labelEn: 'Listening', icon: '👂' },
  { id: 'writing', labelKh: 'ការសរសេរ', labelEn: 'Writing', icon: '✍️' },
  { id: 'speaking', labelKh: 'ការនិយាយ', labelEn: 'Speaking', icon: '🗣️' },
] as const;

export const MATH_SKILLS = [
  { id: 'numbers', labelKh: 'ចំនួន', labelEn: 'Numbers & Operations', icon: '🔢' },
  { id: 'measurement', labelKh: 'រង្វាស់រង្វាល់', labelEn: 'Measurement', icon: '📏' },
  { id: 'algebra', labelKh: 'ពីជគណិត', labelEn: 'Algebra & Patterns', icon: '🔣' },
  { id: 'geometry', labelKh: 'ធរណីមាត្រ', labelEn: 'Geometry', icon: '📐' },
  { id: 'statistics', labelKh: 'ស្ថិតិ', labelEn: 'Statistics & Data', icon: '📊' },
] as const;

export interface LessonPlan {
  id: string;
  title: string; // ចំណងជើងមេរៀន
  subject: string; // មុខវិជ្ជា (ភាសាខ្មែរ, គណិតវិទ្យា, etc.)
  skillDomain?: string; // បំណិនគោល (អំណាន, ការស្តាប់, ការសរសេរ, ការនិយាយ ឬ ចំនួន, រង្វាស់រង្វាល់, ពីជគណិត, ធរណីមាត្រ, ស្ថិតិ)
  grade: string; // ថ្នាក់ទី (ថ្នាក់ទី១ ដល់ ៦)
  unit: string; // ជំពូក / ផ្នែក
  durationMinutes: number; // រយៈពេលសរុប (នាទី)
  date: string;
  teacherName: string;
  schoolName: string;
  classRoom: string;
  objectives: LessonObjectives;
  teachingAids: string[]; // សម្ភារឧបទេស
  steps: LessonStep[];
  verification: LessonVerification;
  updatedAt: number;
}

export type ActiveTab = 'overview' | 'editor' | 'teaching' | 'verification';
