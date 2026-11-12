import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDocFromServer,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { LessonPlan } from '../types/lesson';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export interface TeacherProfile {
  uid: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  schoolName: string;
  gradesTeaching: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogItem {
  id: string;
  teacherUid: string;
  teacherEmail: string;
  action: 'create' | 'update' | 'print' | 'export_html' | 'export_xlsx' | 'verify' | 'login';
  lessonId: string;
  lessonTitle: string;
  details: string;
  timestamp: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, utilizing offline persistence.');
    }
  }
}

testFirestoreConnection();

export const firebaseService = {
  /**
   * Sign In with Google
   */
  async signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    await signOut(auth);
  },

  /**
   * Fetch Teacher Profile by UID
   */
  async getTeacherProfile(uid: string): Promise<TeacherProfile | null> {
    const path = `teachers/${uid}`;
    try {
      const snap = await getDoc(doc(db, 'teachers', uid));
      if (snap.exists()) {
        return snap.data() as TeacherProfile;
      }
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
    }
  },

  /**
   * Save or Update Teacher Profile with Official Gmail and Phone Number
   */
  async saveTeacherProfile(profile: TeacherProfile): Promise<void> {
    const path = `teachers/${profile.uid}`;
    try {
      await setDoc(doc(db, 'teachers', profile.uid), profile, { merge: true });
      await this.logActivity({
        teacherUid: profile.uid,
        teacherEmail: profile.email,
        action: 'login',
        lessonId: 'profile',
        lessonTitle: 'គណនីគ្រូបង្រៀន',
        details: `បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានគ្រូបង្រៀន (ទូរស័ព្ទ៖ ${profile.phoneNumber})`,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  /**
   * Save Lesson Plan to Cloud Firestore
   */
  async saveLessonToCloud(lesson: LessonPlan, user: User): Promise<void> {
    const path = `lesson_plans/${lesson.id}`;
    try {
      const payload = {
        id: lesson.id,
        teacherUid: user.uid,
        teacherEmail: user.email || '',
        title: lesson.title,
        subject: lesson.subject,
        grade: lesson.grade,
        unit: lesson.unit,
        durationMinutes: String(lesson.durationMinutes),
        date: lesson.date,
        objectives: JSON.stringify(lesson.objectives),
        teachingAids: JSON.stringify(lesson.teachingAids),
        steps: JSON.stringify(lesson.steps),
        verification: JSON.stringify(lesson.verification),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'lesson_plans', lesson.id), payload);

      await this.logActivity({
        teacherUid: user.uid,
        teacherEmail: user.email || '',
        action: 'update',
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        details: `បានរក្សាទុកកិច្ចតែងការ "${lesson.title}" (${lesson.grade}) ទៅកាន់ Cloud Firestore`,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  /**
   * Fetch All Cloud Lesson Plans for this Teacher
   */
  async fetchTeacherLessons(user: User): Promise<LessonPlan[]> {
    const path = 'lesson_plans';
    try {
      const q = query(collection(db, 'lesson_plans'), where('teacherUid', '==', user.uid));
      const snap = await getDocs(q);
      const list: LessonPlan[] = [];

      snap.forEach((d) => {
        const data = d.data();
        try {
          const plan: LessonPlan = {
            id: data.id || d.id,
            title: data.title,
            subject: data.subject,
            grade: data.grade,
            unit: data.unit || '',
            durationMinutes: Number(data.durationMinutes) || 50,
            date: data.date,
            teacherName: user.displayName || 'គ្រូបង្រៀន',
            schoolName: '',
            classRoom: '',
            objectives: data.objectives ? JSON.parse(data.objectives) : { knowledge: '', skills: '', attitude: '' },
            teachingAids: data.teachingAids ? JSON.parse(data.teachingAids) : [],
            steps: data.steps ? JSON.parse(data.steps) : [],
            verification: data.verification ? JSON.parse(data.verification) : {
              auditorName: '',
              auditorRole: '',
              schoolName: '',
              auditDate: '',
              status: 'in_review',
              generalRemarks: '',
              checkedCriteria: {},
            },
            updatedAt: Date.now(),
          };
          list.push(plan);
        } catch (err) {
          console.error('Error parsing lesson plan from Firestore:', err);
        }
      });

      return list;
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  },

  /**
   * Record History / Activity Log to Firestore
   */
  async logActivity(item: {
    teacherUid: string;
    teacherEmail: string;
    action: ActivityLogItem['action'];
    lessonId: string;
    lessonTitle: string;
    details: string;
  }): Promise<void> {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const path = `activity_logs/${logId}`;
    try {
      const payload: ActivityLogItem = {
        id: logId,
        teacherUid: item.teacherUid,
        teacherEmail: item.teacherEmail,
        action: item.action,
        lessonId: item.lessonId,
        lessonTitle: item.lessonTitle,
        details: item.details,
        timestamp: new Date().toISOString(),
      };
      await setDoc(doc(db, 'activity_logs', logId), payload);
    } catch (e) {
      console.warn('Could not record activity log:', e);
    }
  },

  /**
   * Fetch Teacher's Activity History
   */
  async fetchTeacherHistory(user: User): Promise<ActivityLogItem[]> {
    const path = 'activity_logs';
    try {
      const q = query(collection(db, 'activity_logs'), where('teacherUid', '==', user.uid));
      const snap = await getDocs(q);
      const logs: ActivityLogItem[] = [];
      snap.forEach((d) => {
        logs.push(d.data() as ActivityLogItem);
      });
      // Sort newest first
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  },
};
