import React, { useState, useEffect } from 'react';
import {
  firebaseService,
  TeacherProfile,
  ActivityLogItem,
  auth,
} from '../services/firebase';
import { LessonPlan } from '../types/lesson';
import { User } from 'firebase/auth';
import {
  UserCheck,
  X,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Cloud,
  History,
  LogOut,
  CheckCircle,
  Clock,
  Download,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  teacherProfile: TeacherProfile | null;
  onProfileUpdated: (profile: TeacherProfile) => void;
  onLoadCloudLesson: (lesson: LessonPlan) => void;
  currentLessonToSync?: LessonPlan;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  teacherProfile,
  onProfileUpdated,
  onLoadCloudLesson,
  currentLessonToSync,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'cloud_lessons'>('profile');
  const [phoneNumber, setPhoneNumber] = useState(teacherProfile?.phoneNumber || '');
  const [schoolName, setSchoolName] = useState(teacherProfile?.schoolName || '');
  const [gradesTeaching, setGradesTeaching] = useState(teacherProfile?.gradesTeaching || 'ថ្នាក់ទី១ ដល់ ទី៦');
  const [displayName, setDisplayName] = useState(teacherProfile?.displayName || currentUser?.displayName || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [cloudLessons, setCloudLessons] = useState<LessonPlan[]>([]);
  const [historyLogs, setHistoryLogs] = useState<ActivityLogItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (teacherProfile) {
      setPhoneNumber(teacherProfile.phoneNumber || '');
      setSchoolName(teacherProfile.schoolName || '');
      setGradesTeaching(teacherProfile.gradesTeaching || 'ថ្នាក់ទី១ ដល់ ទី៦');
      setDisplayName(teacherProfile.displayName || '');
    }
  }, [teacherProfile]);

  useEffect(() => {
    if (currentUser && isOpen) {
      loadCloudData(currentUser);
    }
  }, [currentUser, isOpen]);

  const loadCloudData = async (user: User) => {
    try {
      const [lessons, logs] = await Promise.all([
        firebaseService.fetchTeacherLessons(user),
        firebaseService.fetchTeacherHistory(user),
      ]);
      setCloudLessons(lessons);
      setHistoryLogs(logs);
    } catch (e) {
      console.warn('Error loading cloud data:', e);
    }
  };

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const user = await firebaseService.signInWithGoogle();
      // Check if profile exists
      let profile = await firebaseService.getTeacherProfile(user.uid);
      if (!profile) {
        profile = {
          uid: user.uid,
          email: user.email || '',
          phoneNumber: '',
          displayName: user.displayName || 'គ្រូបង្រៀន',
          schoolName: 'សាលាបឋមសិក្សា',
          gradesTeaching: 'ថ្នាក់ទី១ ដល់ ទី៦',
          photoURL: user.photoURL || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      onProfileUpdated(profile);
      await loadCloudData(user);
      setStatusMessage({ type: 'success', text: `បានចូលប្រើប្រាស់ដោយជោគជ័យតាម Gmail: ${user.email}` });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'ការចូលប្រើប្រាស់បរាជ័យ' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!phoneNumber.trim()) {
      setStatusMessage({ type: 'error', text: 'សូមបញ្ចូលលេខទូរស័ព្ទផ្លូវការរបស់គ្រូបង្រៀន' });
      return;
    }

    setIsLoading(true);
    try {
      const updated: TeacherProfile = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        phoneNumber: phoneNumber.trim(),
        displayName: displayName.trim() || currentUser.displayName || 'គ្រូបង្រៀន',
        schoolName: schoolName.trim(),
        gradesTeaching: gradesTeaching.trim(),
        photoURL: currentUser.photoURL || undefined,
        createdAt: teacherProfile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await firebaseService.saveTeacherProfile(updated);
      onProfileUpdated(updated);
      setStatusMessage({ type: 'success', text: 'បានរក្សាទុកព័ត៌មានផ្លូវការគ្រូបង្រៀនក្នុង Firestore រួចរាល់!' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'មិនអាចរក្សាទុកព័ត៌មានបានទេ' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCurrentLesson = async () => {
    if (!currentUser || !currentLessonToSync) return;
    setIsLoading(true);
    try {
      await firebaseService.saveLessonToCloud(currentLessonToSync, currentUser);
      await loadCloudData(currentUser);
      setStatusMessage({
        type: 'success',
        text: `បានរក្សាទុកកិច្ចតែងការ "${currentLessonToSync.title}" ទៅកាន់ Firestore Cloud!`,
      });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'ការធ្វើសមកាលកម្មបរាជ័យ' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await firebaseService.signOut();
    setStatusMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                គណនីគ្រូបង្រៀន & Firestore Cloud
              </h3>
              <p className="text-[11px] text-slate-500">
                ផ្ទៀងផ្ទាត់ដោយ Gmail & លេខទូរស័ព្ទផ្លូវការ រក្សាទុកកិច្ចតែងការ និងប្រវត្តិ
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content depending on login state */}
        {!currentUser ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <Mail className="w-8 h-8 text-sky-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                ចូលប្រើប្រាស់ប្រព័ន្ធគ្រូបង្រៀន (Teacher Login)
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                គ្រូបង្រៀនត្រូវប្រើប្រាស់គណនី <strong>Gmail</strong> និងលេខទូរស័ព្ទផ្លូវការ ដើម្បីធ្វើសមកាលកម្មទិន្នន័យ និងពិនិត្យប្រវត្តិ។
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>កំពុងភ្ជាប់ Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>ចូលប្រើប្រាស់ដោយ Gmail</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="py-3 flex flex-col flex-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === 'profile' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ព័ត៌មានគ្រូ
                </button>
                <button
                  onClick={() => setActiveTab('cloud_lessons')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === 'cloud_lessons' ? 'bg-sky-50 text-sky-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cloud ({cloudLessons.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === 'history' ? 'bg-purple-50 text-purple-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ប្រវត្តិ ({historyLogs.length})
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ចាកចេញ</span>
              </button>
            </div>

            {/* Tab 1: Profile form */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-3 overflow-y-auto flex-1 pr-1">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-900">{currentUser.displayName || displayName}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{currentUser.email}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded font-semibold">✓ Verified Gmail</span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    ឈ្មោះពេញគ្រូបង្រៀន (Full Name) *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    លេខទូរស័ព្ទផ្លូវការ (Official Phone Number) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="ឧ. 012 345 678 ឬ +855..."
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      សាលាបឋមសិក្សា (School)
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="ឧ. សាលាបឋមសិក្សា..."
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      កម្រិតបង្រៀន (Grades)
                    </label>
                    <input
                      type="text"
                      value={gradesTeaching}
                      onChange={(e) => setGradesTeaching(e.target.value)}
                      placeholder="ឧ. ថ្នាក់ទី១, ទី២..."
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {currentLessonToSync && (
                    <button
                      type="button"
                      onClick={handleSyncCurrentLesson}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold rounded-lg hover:bg-sky-100"
                    >
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Sync កិច្ចតែងការបច្ចុប្បន្ន</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ml-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    រក្សាទុកព័ត៌មានគ្រូ
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Cloud Lessons */}
            {activeTab === 'cloud_lessons' && (
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {cloudLessons.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    មិនទាន់មានកិច្ចតែងការរក្សាទុកលើ Cloud នៅឡើយទេ។
                  </div>
                ) : (
                  cloudLessons.map((l) => (
                    <div
                      key={l.id}
                      className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{l.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          {l.subject} · {l.grade} · {l.durationMinutes} នាទី
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onLoadCloudLesson(l);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ទាញយកមកប្រើ</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: History Audit Logs */}
            {activeTab === 'history' && (
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {historyLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    មិនទាន់មានប្រវត្តិសកម្មភាពនៅឡើយទេ។
                  </div>
                ) : (
                  historyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 border border-slate-200 rounded-xl bg-slate-50/70 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-800">{log.action.toUpperCase()}</span>
                        <span className="text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleString('km-KH')}
                        </span>
                      </div>
                      <p className="text-slate-700">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
