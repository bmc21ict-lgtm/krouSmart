import React from 'react';
import { ActiveTab } from '../types/lesson';
import {
  Plus,
  BookOpen,
  Presentation,
  CheckCircle,
  Database,
  Sparkles,
  FileText,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { TeacherProfile } from '../services/firebase';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewLesson: () => void;
  onOpenStoreManager: () => void;
  onOpenAIAssistant: () => void;
  onOpenGuidelines: () => void;
  onOpenPlp: () => void;
  onOpenTeacherAuth: () => void;
  currentUser: User | null;
  teacherProfile: TeacherProfile | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewLesson,
  onOpenStoreManager,
  onOpenAIAssistant,
  onOpenGuidelines,
  onOpenPlp,
  onOpenTeacherAuth,
  currentUser,
  teacherProfile,
}) => {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-3 bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            គ
          </span>
          <span>KruSmart</span>
        </a>
        <span className="text-xs text-slate-400 hidden lg:inline">·</span>
        <span className="text-xs text-slate-500 hidden lg:inline">បឋមសិក្សា (ថ្នាក់ទី១ ដល់ ៦)</span>
      </div>

      {/* Zone 2: Concise single-line nav links & tools */}
      <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'overview'
              ? 'bg-sky-50 text-sky-700 font-semibold'
              : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>កិច្ចតែងការ</span>
        </button>

        <button
          onClick={() => setActiveTab('teaching')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'teaching'
              ? 'bg-sky-50 text-sky-700 font-semibold'
              : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>បង្រៀនផ្ទាល់ (នាទី)</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'verification'
              ? 'bg-sky-50 text-sky-700 font-semibold'
              : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span className="hidden md:inline">ផ្ទៀងផ្ទាត់គរុកោសល្យ</span>
          <span className="md:hidden">ផ្ទៀងផ្ទាត់</span>
        </button>

        {/* AI Primary Assistant Button */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-purple-700 bg-purple-50/70 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0 font-semibold"
          title="ជំនួយការ AI បង្កើតកិច្ចតែងការបឋមសិក្សា (ថ្នាក់ទី១ ដល់ ៦)"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>AI ថ្នាក់ទី១-៦</span>
        </button>

        {/* Guidelines / Circulars Button */}
        <button
          onClick={onOpenGuidelines}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          title="ស្វែងរកឯកសារបង្រៀន និងលិខិតណែនាំក្រសួង"
        >
          <FileText className="w-4 h-4 text-sky-600" />
          <span className="hidden sm:inline">លិខិតណែនាំ</span>
        </button>

        {/* MoEYS PLP Portal Hub Button */}
        <button
          onClick={onOpenPlp}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sky-800 bg-sky-50 hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0 font-semibold border border-sky-200"
          title="កញ្ចប់សម្ភារ និងធនធានបង្រៀន PLP ក្រសួង (plp.moeys.gov.kh)"
        >
          <GraduationCap className="w-4 h-4 text-sky-700" />
          <span>PLP ក្រសួង</span>
        </button>

        {/* Free Store Button */}
        <button
          onClick={onOpenStoreManager}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          title="Free Store - ឃ្លាំងផ្ទុកទិន្នន័យឥតគិតថ្លៃ"
        >
          <Database className="w-4 h-4 text-emerald-600" />
          <span className="hidden lg:inline">Free Store</span>
        </button>

        {/* Teacher Auth Button */}
        <button
          onClick={onOpenTeacherAuth}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
            currentUser
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
          title="ចូលប្រើប្រាស់ដោយ Gmail និងលេខទូរស័ព្ទផ្លូវការ"
        >
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span className="max-w-[100px] truncate">
            {currentUser ? teacherProfile?.displayName || currentUser.displayName || 'គណនីគ្រូ' : 'ចូលប្រើប្រាស់'}
          </span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onNewLesson}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ បង្កើតថ្មី</span>
        </button>
      </div>
    </header>
  );
};
