import React, { useState, useEffect } from 'react';
import { LessonPlan, ActiveTab } from './types/lesson';
import { storageService } from './services/storageService';
import { exportService } from './services/exportService';
import { firebaseService, TeacherProfile, auth } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { LessonOverview } from './components/LessonOverview';
import { LessonEditor } from './components/LessonEditor';
import { TeachingView } from './components/TeachingView';
import { VerificationView } from './components/VerificationView';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { StoreManagerModal } from './components/StoreManagerModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { GuidelinesModal } from './components/GuidelinesModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { PlpPortalModal } from './components/PlpPortalModal';
import { TeachingGuideline } from './data/teachingGuidelines';

export default function App() {
  const [lessons, setLessons] = useState<LessonPlan[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);

  // Display toggles
  const [showTeacherKeys, setShowTeacherKeys] = useState(true);
  const [showMinutes, setShowMinutes] = useState(true);
  const [showVerification, setShowVerification] = useState(true);
  const [isAllExpanded, setIsAllExpanded] = useState(true);

  // Modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isPlpModalOpen, setIsPlpModalOpen] = useState(false);
  const [plpCategory, setPlpCategory] = useState<'menu' | 'book' | 'examination' | 'homework' | 'video' | 'all'>('all');
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState(false);

  // Load from Free Store on mount
  useEffect(() => {
    const loaded = storageService.loadLessons();
    setLessons(loaded);
    if (loaded.length > 0) {
      setSelectedLessonId(loaded[0].id);
    }
  }, []);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await firebaseService.getTeacherProfile(user.uid);
          setTeacherProfile(profile);
          // If no phone number registered, prompt to complete official credentials
          if (!profile || !profile.phoneNumber) {
            setIsTeacherAuthOpen(true);
          }
        } catch (e) {
          console.warn('Error loading teacher profile:', e);
        }
      } else {
        setTeacherProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const selectedLesson =
    lessons.find((l) => l.id === selectedLessonId) || lessons[0];

  // Handlers
  const handleSelectLesson = (lesson: LessonPlan) => {
    setSelectedLessonId(lesson.id);
  };

  const handleSaveLesson = async (updatedLesson: LessonPlan) => {
    const updated = storageService.saveLesson(updatedLesson);
    setLessons(updated);
    setSelectedLessonId(updatedLesson.id);

    // If logged in to Firestore, sync to cloud
    if (currentUser) {
      try {
        await firebaseService.saveLessonToCloud(updatedLesson, currentUser);
      } catch (e) {
        console.warn('Cloud sync error:', e);
      }
    }
  };

  const handleDeleteLesson = (id: string) => {
    if (lessons.length <= 1) {
      alert('មិនអាចលុបកិច្ចតែងការចុងក្រោយបង្អស់បានទេ');
      return;
    }
    if (window.confirm('តើអ្នកពិតជាចង់លុបកិច្ចតែងការនេះមែនទេ?')) {
      const remaining = storageService.deleteLesson(id);
      setLessons(remaining);
      setSelectedLessonId(remaining[0].id);
      setActiveTab('overview');
    }
  };

  const handleDuplicateLesson = (id: string) => {
    const clone = storageService.duplicateLesson(id);
    if (clone) {
      const all = storageService.loadLessons();
      setLessons(all);
      setSelectedLessonId(clone.id);
      setActiveTab('editor');
    }
  };

  const handleCreateNewLesson = () => {
    const newId = `lesson_${Date.now()}`;
    const newLesson: LessonPlan = {
      id: newId,
      title: 'កិច្ចតែងការបឋមសិក្សាថ្មី',
      subject: 'ភាសាខ្មែរ',
      grade: 'ថ្នាក់ទី១',
      unit: 'មេរៀនទី ១',
      durationMinutes: 50,
      date: new Date().toISOString().slice(0, 10),
      teacherName: teacherProfile?.displayName || currentUser?.displayName || 'លោកគ្រូ/អ្នកគ្រូ',
      schoolName: teacherProfile?.schoolName || 'សាលាបឋមសិក្សា...',
      classRoom: 'បន្ទប់ A',
      objectives: {
        knowledge: 'សិស្សអាចចងចាំ និងរៀបរាប់ខ្លឹមសារ...',
        skills: 'សិស្សអាចអនុវត្តលំហាត់ និងដោះស្រាយបញ្ហា...',
        attitude: 'សិស្សមានទំនួលខុសត្រូវ និងសហការជាក្រុម...',
      },
      teachingAids: ['សៀវភៅពុម្ព', 'ក្តារខៀន', 'សន្លឹកកិច្ចការ'],
      steps: [
        {
          id: 'step_1',
          stepNumber: 1,
          name: 'ជំហានទី១៖ រដ្ឋបាលថ្នាក់ (Class Administration)',
          durationMinutes: 3,
          teacherActivity: '- ពិនិត្យវត្តមាន អនាម័យ និងសណ្តាប់ធ្នាប់សិស្ស',
          studentActivity: '- ប្រធានថ្នាក់រាយការណ៍វត្តមាន និងត្រៀមសម្ភារ',
          content: 'ពិនិត្យវិន័យ និងបរិស្ថានសិក្សាស្អាត',
          teacherKey: 'បង្កើតបរិយាកាសសិក្សាស្វាហាប់',
          verificationNote: 'រដ្ឋបាលរហ័សទាន់ចិត្ត (មិនលើស ៣ នាទី)',
          isVerified: true,
        },
        {
          id: 'step_2',
          stepNumber: 2,
          name: 'ជំហានទី២៖ រំលឹកមេរៀនចាស់ (Review)',
          durationMinutes: 5,
          teacherActivity: '- សួរសំណួរភ្ជាប់មេរៀនចាស់',
          studentActivity: '- ឆ្លើយសំណួរគ្រូ',
          content: 'រំលឹកចំណុចសំខាន់នៃមេរៀនមុន',
          teacherKey: 'ចម្លើយសង្ខេប',
          verificationNote: 'ភ្ជាប់មេរៀនចាស់ទៅមេរៀនថ្មីបានល្អ',
          isVerified: true,
        },
        {
          id: 'step_3',
          stepNumber: 3,
          name: 'ជំហានទី៣៖ មេរៀនថ្មី (New Concept)',
          durationMinutes: 20,
          teacherActivity: '- ពន្យល់ខ្លឹមសារមេរៀនថ្មី និងលើកឧទាហរណ៍ជាក់ស្តែង',
          studentActivity: '- ស្តាប់ការពន្យល់ និងកត់ត្រាចំណុចគន្លឹះ',
          content: 'ខ្លឹមសារចម្បងនៃមេរៀន',
          teacherKey: 'គន្លឹះគ្រូ និងដំណោះស្រាយ',
          verificationNote: 'សកម្មភាពសិស្សសកម្ម លើសពី ៥០%',
          isVerified: false,
        },
        {
          id: 'step_4',
          stepNumber: 4,
          name: 'ជំហានទី៤៖ ពង្រឹងចំណេះដឹង និងអនុវត្ត (Practice)',
          durationMinutes: 15,
          teacherActivity: '- ដាក់លំហាត់អនុវត្តជាក្រុម ឬបុគ្គល',
          studentActivity: '- ពិភាក្សា និងដោះស្រាយលំហាត់',
          content: 'អនុវត្តលំហាត់ពង្រឹង',
          teacherKey: 'ចម្លើយលំហាត់គំរូ',
          verificationNote: 'សិស្សគ្រប់រូបបានអនុវត្តផ្ទាល់ដៃ',
          isVerified: false,
        },
        {
          id: 'step_5',
          stepNumber: 5,
          name: 'ជំហានទី៥៖ វាយតម្លៃ និងកិច្ចការផ្ទះ (Evaluation & Homework)',
          durationMinutes: 7,
          teacherActivity: '- សួរសំណួរវាយតម្លៃរហ័ស និងដាក់កិច្ចការផ្ទះ',
          studentActivity: '- ឆ្លើយសំណួរ និងកត់ត្រាកិច្ចការផ្ទះ',
          content: 'បូកសរុបមេរៀន និងកិច្ចការផ្ទះ',
          teacherKey: 'កិច្ចការស្វ័យសិក្សា',
          verificationNote: 'មានការវាស់វែងការយល់ដឹងច្បាស់លាស់',
          isVerified: false,
        },
      ],
      verification: {
        auditorName: 'អ្នកផ្ទៀងផ្ទាត់',
        auditorRole: 'ប្រធានក្រុមបច្ចេកទេស',
        schoolName: teacherProfile?.schoolName || 'សាលាបឋមសិក្សា',
        auditDate: new Date().toISOString().slice(0, 10),
        status: 'in_review',
        generalRemarks: 'កិច្ចតែងការថ្មីកំពុងរៀបចំ...',
        checkedCriteria: {},
      },
      updatedAt: Date.now(),
    };

    handleSaveLesson(newLesson);
    setActiveTab('editor');
  };

  const handleLessonGeneratedByAI = (lesson: LessonPlan) => {
    handleSaveLesson(lesson);
    setActiveTab('overview');
  };

  const handleApplyGuideline = (guide: TeachingGuideline) => {
    const newId = `lesson_${Date.now()}`;
    const newLesson: LessonPlan = {
      id: newId,
      title: guide.titleKh.slice(0, 45),
      subject: guide.subject === 'គ្រប់មុខវិជ្ជា' ? 'ភាសាខ្មែរ' : guide.subject,
      grade: guide.gradeLevels[0] || 'ថ្នាក់ទី១',
      unit: guide.code,
      durationMinutes: 50,
      date: new Date().toISOString().slice(0, 10),
      teacherName: teacherProfile?.displayName || currentUser?.displayName || 'លោកគ្រូ/អ្នកគ្រូ',
      schoolName: teacherProfile?.schoolName || 'សាលាបឋមសិក្សា',
      classRoom: 'ថ្នាក់បឋម',
      objectives: {
        knowledge: `សិស្សយល់ដឹងស្របតាម ${guide.code}៖ ${guide.summary.slice(0, 100)}...`,
        skills: 'សិស្សអាចអនុវត្តបំណិនស្តង់ដារ និងធ្វើការសហការជាក្រុម។',
        attitude: 'បណ្តុះទម្លាប់សិក្សាល្អ វិន័យ និងការចូលរួមយ៉ាងសកម្ម។',
      },
      teachingAids: ['សៀវភៅគោលក្រសួង', 'កញ្ចប់ជំនួយស្មារតី', 'សន្លឹកកិច្ចការ'],
      steps: guide.recommendedSteps.map((st, idx) => ({
        id: `step_${Date.now()}_${idx}`,
        stepNumber: idx + 1,
        name: st.step,
        durationMinutes: st.minutes,
        teacherActivity: `- គ្រូអនុវត្តតាមការណែនាំ៖ ${st.note}`,
        studentActivity: '- សិស្សចូលរួមសកម្មភាព និងអនុវត្តផ្ទាល់ដៃ',
        content: `ខ្លឹមសារជំហានទី ${idx + 1} យោងតាម ${guide.code}`,
        teacherKey: `គន្លឹះគរុកោសល្យ៖ ${st.note}`,
        verificationNote: `ផ្ទៀងផ្ទាត់ការបែងចែក ${st.minutes} នាទី ត្រឹមត្រូវ`,
        isVerified: true,
      })),
      verification: {
        auditorName: 'ប្រធានក្រុមបច្ចេកទេស',
        auditorRole: 'អ្នកផ្ទៀងផ្ទាត់បឋមសិក្សា',
        schoolName: teacherProfile?.schoolName || 'សាលាបឋមសិក្សា',
        auditDate: new Date().toISOString().slice(0, 10),
        status: 'in_review',
        generalRemarks: `បង្កើតផ្អែកលើ ${guide.code} (${guide.categoryLabel})`,
        checkedCriteria: { crit_objectives: true, crit_timing: true },
      },
      updatedAt: Date.now(),
    };

    handleSaveLesson(newLesson);
    setActiveTab('overview');
  };

  const handleUpdateStepVerified = (stepId: string, verified: boolean) => {
    if (!selectedLesson) return;
    const updatedSteps = selectedLesson.steps.map((s) =>
      s.id === stepId ? { ...s, isVerified: verified } : s
    );
    const updatedLesson = {
      ...selectedLesson,
      steps: updatedSteps,
      updatedAt: Date.now(),
    };
    handleSaveLesson(updatedLesson);
  };

  const handleTriggerPrint = (options: {
    includeTeacherKeys: boolean;
    includeVerification: boolean;
    includeMinutes: boolean;
  }) => {
    setShowTeacherKeys(options.includeTeacherKeys);
    setShowVerification(options.includeVerification);
    setShowMinutes(options.includeMinutes);
    setIsAllExpanded(true);

    if (currentUser && selectedLesson) {
      firebaseService.logActivity({
        teacherUid: currentUser.uid,
        teacherEmail: currentUser.email || '',
        action: 'print',
        lessonId: selectedLesson.id,
        lessonTitle: selectedLesson.title,
        details: `បានបោះពុម្ពកិច្ចតែងការ "${selectedLesson.title}" (${options.includeTeacherKeys ? 'ច្បាប់គ្រូ' : 'ច្បាប់សិស្ស'})`,
      });
    }

    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleExportHtml = () => {
    exportService.exportToHtml(selectedLesson);
    if (currentUser && selectedLesson) {
      firebaseService.logActivity({
        teacherUid: currentUser.uid,
        teacherEmail: currentUser.email || '',
        action: 'export_html',
        lessonId: selectedLesson.id,
        lessonTitle: selectedLesson.title,
        details: `បានទាញយកជាឯកសារ HTML សម្រាប់មេរៀន "${selectedLesson.title}"`,
      });
    }
  };

  const handleExportXlsx = () => {
    exportService.exportToXlsx(selectedLesson);
    if (currentUser && selectedLesson) {
      firebaseService.logActivity({
        teacherUid: currentUser.uid,
        teacherEmail: currentUser.email || '',
        action: 'export_xlsx',
        lessonId: selectedLesson.id,
        lessonTitle: selectedLesson.title,
        details: `បានទាញយកជាសៀវភៅបញ្ជី Excel XLSX សម្រាប់មេរៀន "${selectedLesson.title}"`,
      });
    }
  };

  const handleOpenPlp = (category: 'menu' | 'book' | 'examination' | 'homework' | 'video' | 'all' = 'all') => {
    setPlpCategory(category);
    setIsPlpModalOpen(true);
  };

  const handleInsertFromPlp = (target: 'step4' | 'step5' | 'materials' | 'title', text: string) => {
    if (!selectedLesson) return;
    const updated = JSON.parse(JSON.stringify(selectedLesson)) as LessonPlan;
    if (target === 'materials') {
      updated.teachingAids = [...(updated.teachingAids || []), text];
    } else if (target === 'title') {
      updated.title = text;
    } else if (target === 'step4') {
      updated.steps = updated.steps.map((st, idx) => {
        if (st.stepNumber === 4 || idx === 3) {
          return {
            ...st,
            content: st.content ? `${st.content}\n[លំហាត់ PLP]:\n${text}` : text,
            studentActivity: st.studentActivity
              ? `${st.studentActivity}\n- អនុវត្តលំហាត់តាម PLP ក្រសួង`
              : '- អនុវត្តលំហាត់តាម PLP ក្រសួង',
          };
        }
        return st;
      });
    } else if (target === 'step5') {
      updated.steps = updated.steps.map((st, idx) => {
        if (st.stepNumber === 5 || idx === 4) {
          return {
            ...st,
            content: st.content ? `${st.content}\n[កិច្ចការផ្ទះ PLP]:\n${text}` : text,
            studentActivity: st.studentActivity
              ? `${st.studentActivity}\n- កត់ត្រាកិច្ចការផ្ទះធ្វើនៅផ្ទះ`
              : '- កត់ត្រាកិច្ចការផ្ទះធ្វើនៅផ្ទះ',
          };
        }
        return st;
      });
    }
    handleSaveLesson(updated);
  };

  if (!selectedLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <p>កំពុងផ្ទុកទិន្នន័យពី Free Store...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewLesson={handleCreateNewLesson}
        onOpenStoreManager={() => setIsStoreModalOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
        onOpenPlp={() => handleOpenPlp('all')}
        onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
        currentUser={currentUser}
        teacherProfile={teacherProfile}
      />

      {/* Toolbar with Selectors, Hide-Show Toggles & Exports */}
      <Toolbar
        lessons={lessons}
        selectedLesson={selectedLesson}
        onSelectLesson={handleSelectLesson}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showTeacherKeys={showTeacherKeys}
        onToggleTeacherKeys={() => setShowTeacherKeys((prev) => !prev)}
        showMinutes={showMinutes}
        onToggleMinutes={() => setShowMinutes((prev) => !prev)}
        showVerification={showVerification}
        onToggleVerification={() => setShowVerification((prev) => !prev)}
        isAllExpanded={isAllExpanded}
        onToggleExpandAll={() => setIsAllExpanded((prev) => !prev)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onExportHtml={handleExportHtml}
        onExportXlsx={handleExportXlsx}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 pb-16">
        {activeTab === 'overview' && (
          <LessonOverview
            lesson={selectedLesson}
            showTeacherKeys={showTeacherKeys}
            showMinutes={showMinutes}
            showVerification={showVerification}
            isAllExpanded={isAllExpanded}
            onUpdateStepVerified={handleUpdateStepVerified}
          />
        )}

        {activeTab === 'editor' && (
          <LessonEditor
            lesson={selectedLesson}
            onSave={handleSaveLesson}
            onDuplicate={handleDuplicateLesson}
            onDelete={handleDeleteLesson}
            onOpenPlp={handleOpenPlp}
          />
        )}

        {activeTab === 'teaching' && (
          <TeachingView lesson={selectedLesson} />
        )}

        {activeTab === 'verification' && (
          <VerificationView
            lesson={selectedLesson}
            onSaveVerification={handleSaveLesson}
          />
        )}
      </main>

      {/* Modals */}
      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        lesson={selectedLesson}
        onTriggerPrint={handleTriggerPrint}
      />

      <StoreManagerModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        lessons={lessons}
        onReloadLessons={(reloaded) => {
          setLessons(reloaded);
          if (reloaded.length > 0) setSelectedLessonId(reloaded[0].id);
        }}
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onLessonGenerated={handleLessonGeneratedByAI}
      />

      <GuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
        onApplyGuidelineToNewLesson={handleApplyGuideline}
        onOpenPlp={() => handleOpenPlp('all')}
      />

      <PlpPortalModal
        isOpen={isPlpModalOpen}
        onClose={() => setIsPlpModalOpen(false)}
        initialCategory={plpCategory}
        onInsertContent={handleInsertFromPlp}
      />

      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        currentUser={currentUser}
        teacherProfile={teacherProfile}
        onProfileUpdated={(prof) => setTeacherProfile(prof)}
        onLoadCloudLesson={(lesson) => {
          handleSaveLesson(lesson);
          setActiveTab('overview');
        }}
        currentLessonToSync={selectedLesson}
      />
    </div>
  );
}
