import React, { useState } from 'react';
import { LessonPlan } from '../types/lesson';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LessonOverviewProps {
  lesson: LessonPlan;
  showTeacherKeys: boolean;
  showMinutes: boolean;
  showVerification: boolean;
  isAllExpanded: boolean;
  onUpdateStepVerified?: (stepId: string, verified: boolean) => void;
}

export const LessonOverview: React.FC<LessonOverviewProps> = ({
  lesson,
  showTeacherKeys,
  showMinutes,
  showVerification,
  isAllExpanded,
  onUpdateStepVerified,
}) => {
  // Local collapsed states for sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const isSectionOpen = (key: string) => {
    if (collapsedSections[key] !== undefined) {
      return !collapsedSections[key];
    }
    return isAllExpanded;
  };

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !isSectionOpen(key),
    }));
  };

  const totalMinutes = lesson.steps.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 font-sans">
      {/* Official Cambodia Lesson Plan Document Frame */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden print:border-none print:shadow-none">
        {/* National Header */}
        <div className="p-6 sm:p-8 border-b border-slate-200 text-center bg-slate-50/50 print:bg-white print:border-b-2 print:border-slate-800">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide">
            ព្រះរាជាណាចក្រកម្ពុជា
          </h1>
          <h2 className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            ជាតិ សាសនា ព្រះមហាក្សត្រ
          </h2>
          <div className="w-16 h-0.5 bg-slate-300 mx-auto my-3" />
          <h3 className="text-xl sm:text-2xl font-bold text-sky-800 tracking-tight">
            កិច្ចតែងការបង្រៀន (LESSON PLAN)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ទម្រង់ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា · KruSmart Pedagogy
          </p>
        </div>

        {/* Lesson Meta Grid */}
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                មុខវិជ្ជា (Subject)
              </span>
              <span className="font-bold text-slate-800 text-base">{lesson.subject}</span>
              {lesson.skillDomain && (
                <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded">
                  បំណិន៖ {lesson.skillDomain}
                </span>
              )}
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                ថ្នាក់ទី (Grade)
              </span>
              <span className="font-bold text-slate-800 text-base">{lesson.grade}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                រយៈពេល (Duration)
              </span>
              <span className="font-bold text-sky-700 text-base flex items-center gap-1">
                <Clock className="w-4 h-4 inline" />
                <span>{lesson.durationMinutes} នាទី</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                កាលបរិច្ឆេទ (Date)
              </span>
              <span className="font-semibold text-slate-700">{lesson.date}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                ចំណងជើងមេរៀន (Lesson Topic)
              </span>
              <span className="font-bold text-slate-900 text-base">{lesson.title}</span>
              <span className="text-xs text-slate-500 block">{lesson.unit}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                គ្រូបង្រៀន (Teacher)
              </span>
              <span className="font-semibold text-slate-800">{lesson.teacherName}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                សាលារៀន (School)
              </span>
              <span className="font-semibold text-slate-700">{lesson.schoolName}</span>
              <span className="text-xs text-slate-400 block">{lesson.classRoom}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Objectives (វត្ថុបំណង) */}
        <div className="border-b border-slate-200">
          <button
            onClick={() => toggleSection('objectives')}
            className="w-full px-6 py-3.5 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between text-left text-sm font-bold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-sky-100 text-sky-800 text-xs flex items-center justify-center font-bold">
                ១
              </span>
              <span>វត្ថុបំណងមេរៀន (Lesson Objectives)</span>
            </span>
            <span className="text-slate-400">
              {isSectionOpen('objectives') ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </button>

          {isSectionOpen('objectives') && (
            <div className="p-6 bg-white space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <span className="font-semibold text-sky-700 min-w-[130px] shrink-0">
                  • វិជ្ជាសម្បទា (Knowledge):
                </span>
                <span>{lesson.objectives.knowledge}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-semibold text-emerald-700 min-w-[130px] shrink-0">
                  • បំណិនសម្បទា (Skills):
                </span>
                <span>{lesson.objectives.skills}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-semibold text-amber-700 min-w-[130px] shrink-0">
                  • ចរិយាសម្បទា (Attitude):
                </span>
                <span>{lesson.objectives.attitude}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Teaching Aids (សម្ភារឧបទេស) */}
        <div className="border-b border-slate-200">
          <button
            onClick={() => toggleSection('aids')}
            className="w-full px-6 py-3.5 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between text-left text-sm font-bold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-sky-100 text-sky-800 text-xs flex items-center justify-center font-bold">
                ២
              </span>
              <span>សម្ភារឧបទេស និងធនធានបង្រៀន (Teaching Aids & Resources)</span>
            </span>
            <span className="text-slate-400">
              {isSectionOpen('aids') ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </button>

          {isSectionOpen('aids') && (
            <div className="p-6 bg-white">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                {lesson.teachingAids.map((aid, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>{aid}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section 3: 5-Step Teaching Delivery Table (ជំហានបង្រៀន និងបែងចែកនាទី) */}
        <div className="border-b border-slate-200">
          <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="w-5 h-5 rounded bg-sky-100 text-sky-800 text-xs flex items-center justify-center font-bold">
                ៣
              </span>
              <span>សកម្មភាពបង្រៀនតាមជំហានទាំង ៥ និងបំណែងចែកនាទី</span>
            </span>

            {showMinutes && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 text-sky-700" />
                <span>
                  សរុប៖ <strong className="text-sky-800">{totalMinutes} នាទី</strong> / ៥០ នាទី
                </span>
              </div>
            )}
          </div>

          {/* Interactive Steps List */}
          <div className="divide-y divide-slate-200">
            {lesson.steps.map((step) => {
              const stepKey = `step_${step.id}`;
              const open = isSectionOpen(stepKey);

              return (
                <div key={step.id} className="bg-white print-break-inside-avoid">
                  {/* Step Header Toggle */}
                  <div
                    onClick={() => toggleSection(stepKey)}
                    className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-sky-700 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                        {step.stepNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{step.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {step.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {showMinutes && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          <span>{step.durationMinutes} នាទី</span>
                        </span>
                      )}

                      {showVerification && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onUpdateStepVerified) {
                              onUpdateStepVerified(step.id, !step.isVerified);
                            }
                          }}
                          className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                            step.isVerified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                          title="ចុចដើម្បីផ្ទៀងផ្ទាត់ជំហាននេះ"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">
                            {step.isVerified ? 'ផ្ទៀងផ្ទាត់រួច' : 'មិនទាន់ផ្ទៀងផ្ទាត់'}
                          </span>
                        </button>
                      )}

                      <span className="text-slate-400">
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Step Expanded Content */}
                  {open && (
                    <div className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-100 bg-slate-50/30">
                      {/* Content Overview */}
                      <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          ខ្លឹមសារមេរៀន (Lesson Content)
                        </span>
                        <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                          {step.content}
                        </p>
                      </div>

                      {/* Side by side Teacher vs Student Activity */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-lg">
                          <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5 mb-2">
                            <span className="w-2 h-2 rounded-full bg-sky-600" />
                            <span>សកម្មភាពគ្រូបង្រៀន (Teacher Activity)</span>
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                            {step.teacherActivity}
                          </p>
                        </div>

                        <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-lg">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span>សកម្មភាពសិស្សានុសិស្ស (Student Activity)</span>
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                            {step.studentActivity}
                          </p>
                        </div>
                      </div>

                      {/* Teacher Key / Solutions (Collapsible / Toggleable) */}
                      {showTeacherKeys && (
                        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-950">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                            <span>គន្លឹះគ្រូ & ចម្លើយត្រឹមត្រូវ (Teacher Key & Pedagogy Notes):</span>
                          </div>
                          <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                            {step.teacherKey}
                          </p>
                        </div>
                      )}

                      {/* Verification Criteria */}
                      {showVerification && (
                        <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-lg flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-600">
                            <strong className="text-slate-800">ចំណុចផ្ទៀងផ្ទាត់គរុកោសល្យ៖ </strong>
                            {step.verificationNote}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Minutes Breakdown Visualizer */}
        {showMinutes && (
          <div className="p-6 border-b border-slate-200 bg-slate-50/40">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>ការបែងចែកនាទីសរុប (Minutes Allocation Breakdown)</span>
            </h4>

            {/* Visual Bar */}
            <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
              {lesson.steps.map((step, idx) => {
                const colors = [
                  'bg-sky-500',
                  'bg-indigo-500',
                  'bg-emerald-500',
                  'bg-amber-500',
                  'bg-purple-500',
                ];
                const pct = totalMinutes > 0 ? (step.durationMinutes / totalMinutes) * 100 : 20;
                return (
                  <div
                    key={step.id}
                    style={{ width: `${pct}%` }}
                    className={`${colors[idx % colors.length]} transition-all duration-300 relative group`}
                    title={`${step.name}: ${step.durationMinutes} នាទី (${Math.round(pct)}%)`}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-xs text-slate-600">
              {lesson.steps.map((step, idx) => {
                const dotColors = [
                  'bg-sky-500',
                  'bg-indigo-500',
                  'bg-emerald-500',
                  'bg-amber-500',
                  'bg-purple-500',
                ];
                const pct = totalMinutes > 0 ? Math.round((step.durationMinutes / totalMinutes) * 100) : 0;
                return (
                  <div key={step.id} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColors[idx % dotColors.length]}`} />
                    <span className="truncate">{step.stepNumber}. {step.name.split('៖')[1] || step.name}</span>
                    <strong className="text-slate-800 ml-auto tabular-nums">{step.durationMinutes}m ({pct}%)</strong>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 5: Verification & Signature Block */}
        {showVerification && (
          <div className="p-6 bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-600" />
                  <span>ការផ្ទៀងផ្ទាត់ និងការអនុម័តគរុកោសល្យ</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ត្រួតពិនិត្យដោយ៖ {lesson.verification.auditorName} ({lesson.verification.auditorRole}) · {lesson.verification.auditDate}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {lesson.verification.status === 'approved' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>បានផ្ទៀងផ្ទាត់ និងយល់ព្រម (Approved)</span>
                  </span>
                ) : lesson.verification.status === 'in_review' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>កំពុងត្រួតពិនិត្យ (In Review)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>ត្រូវកែសម្រួលបន្ថែម (Needs Revision)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Auditor remarks */}
            {lesson.verification.generalRemarks && (
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700">
                <strong className="text-slate-900">មតិកែលម្អ៖ </strong>
                {lesson.verification.generalRemarks}
              </div>
            )}

            {/* Official Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-8 text-center text-xs sm:text-sm pt-4">
              <div>
                <p className="text-slate-500 font-medium">បានឃើញ និងអនុម័ត</p>
                <p className="font-bold text-slate-900 mt-1">នាយក / នាយិការង</p>
                <div className="h-16 flex items-center justify-center">
                  <div className="w-24 h-12 border-2 border-emerald-600/40 rounded-lg flex items-center justify-center text-[10px] text-emerald-700 font-bold rotate-[-4deg]">
                    ✓ បានផ្ទៀងផ្ទាត់
                  </div>
                </div>
                <p className="text-slate-400 font-mono">............................................</p>
              </div>

              <div>
                <p className="text-slate-500 font-medium">កាលបរិច្ឆេទ៖ {lesson.date}</p>
                <p className="font-bold text-slate-900 mt-1">ហត្ថលេខាគ្រូបង្រៀន</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-slate-400 italic text-xs font-serif">Sign: {lesson.teacherName}</span>
                </div>
                <p className="font-semibold text-slate-800">{lesson.teacherName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
