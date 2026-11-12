import React from 'react';
import { LessonPlan, ActiveTab } from '../types/lesson';
import {
  Printer,
  FileSpreadsheet,
  FileCode,
  Eye,
  EyeOff,
  Clock,
  CheckSquare,
  Edit3,
  BookOpen,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';

interface ToolbarProps {
  lessons: LessonPlan[];
  selectedLesson: LessonPlan;
  onSelectLesson: (lesson: LessonPlan) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  showTeacherKeys: boolean;
  onToggleTeacherKeys: () => void;
  showMinutes: boolean;
  onToggleMinutes: () => void;
  showVerification: boolean;
  onToggleVerification: () => void;
  isAllExpanded: boolean;
  onToggleExpandAll: () => void;
  onOpenPrintModal: () => void;
  onExportHtml: () => void;
  onExportXlsx: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  lessons,
  selectedLesson,
  onSelectLesson,
  activeTab,
  setActiveTab,
  showTeacherKeys,
  onToggleTeacherKeys,
  showMinutes,
  onToggleMinutes,
  showVerification,
  onToggleVerification,
  isAllExpanded,
  onToggleExpandAll,
  onOpenPrintModal,
  onExportHtml,
  onExportXlsx,
}) => {
  return (
    <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 no-print">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Lesson Selector & Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Lesson Plan Selector */}
          <div className="relative min-w-[240px] max-w-sm">
            <select
              value={selectedLesson.id}
              onChange={(e) => {
                const found = lessons.find((l) => l.id === e.target.value);
                if (found) onSelectLesson(found);
              }}
              className="w-full pl-3 pr-8 py-1.5 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
            >
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.subject} · {lesson.grade} · {lesson.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>មើលកិច្ចតែងការ</span>
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>កែសម្រួល</span>
            </button>
          </div>
        </div>

        {/* Right: Hide-Show Toggles & Exports */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hide/Show Section Controls */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={onToggleTeacherKeys}
              title={showTeacherKeys ? 'លាក់ចម្លើយ និងគន្លឹះគ្រូ' : 'បង្ហាញចម្លើយ និងគន្លឹះគ្រូ'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                showTeacherKeys
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {showTeacherKeys ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">ចម្លើយ & គន្លឹះគ្រូ</span>
            </button>

            <button
              onClick={onToggleMinutes}
              title={showMinutes ? 'លាក់នាទី' : 'បង្ហាញនាទី'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                showMinutes
                  ? 'bg-sky-100 text-sky-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-sky-700" />
              <span className="hidden sm:inline">នាទី</span>
            </button>

            <button
              onClick={onToggleVerification}
              title={showVerification ? 'លាក់ការផ្ទៀងផ្ទាត់' : 'បង្ហាញការផ្ទៀងផ្ទាត់'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                showVerification
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">ផ្ទៀងផ្ទាត់</span>
            </button>

            <button
              onClick={onToggleExpandAll}
              title={isAllExpanded ? 'បង្រួមផ្នែកទាំងអស់' : 'ពង្រីកផ្នែកទាំងអស់'}
              className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isAllExpanded ? 'បង្រួម' : 'ពង្រីក'}</span>
            </button>
          </div>

          <div className="h-6 w-px bg-slate-300 hidden sm:block" />

          {/* Export & Print Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onExportHtml}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 shadow-xs transition-colors cursor-pointer"
              title="ទាញយកជាឯកសារ HTML អាចបើកបានគ្រប់ទីកន្លែងដោយគ្មានអ៊ីនធឺណិត"
            >
              <FileCode className="w-3.5 h-3.5 text-orange-600" />
              <span>HTML</span>
            </button>

            <button
              onClick={onExportXlsx}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 shadow-xs transition-colors cursor-pointer"
              title="ទាញយកជាសៀវភៅបញ្ជី Excel (XLSX) មានតារាង ៣ ពេញលេញ"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>XLSX</span>
            </button>

            <button
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="បោះពុម្ពកិច្ចតែងការបង្រៀន ឬរក្សាទុកជា PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
