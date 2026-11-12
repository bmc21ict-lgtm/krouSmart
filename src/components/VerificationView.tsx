import React, { useState } from 'react';
import { LessonPlan } from '../types/lesson';
import { VERIFICATION_CRITERIA_LIST } from '../data/defaultLessons';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Save,
  UserCheck,
  Building,
  FileCheck,
  Check,
  X,
} from 'lucide-react';

interface VerificationViewProps {
  lesson: LessonPlan;
  onSaveVerification: (updatedLesson: LessonPlan) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  lesson,
  onSaveVerification,
}) => {
  const [auditorName, setAuditorName] = useState(lesson.verification.auditorName);
  const [auditorRole, setAuditorRole] = useState(lesson.verification.auditorRole);
  const [schoolName, setSchoolName] = useState(lesson.verification.schoolName);
  const [auditDate, setAuditDate] = useState(lesson.verification.auditDate || new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState(lesson.verification.status);
  const [generalRemarks, setGeneralRemarks] = useState(lesson.verification.generalRemarks);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>(
    lesson.verification.checkedCriteria || {}
  );
  const [stepsVerification, setStepsVerification] = useState<Record<string, boolean>>(
    lesson.steps.reduce((acc, step) => ({ ...acc, [step.id]: step.isVerified }), {})
  );
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Compute verification score
  let totalScore = 0;
  VERIFICATION_CRITERIA_LIST.forEach((crit) => {
    if (checkedCriteria[crit.id]) {
      totalScore += crit.weight;
    }
  });

  const toggleCriterion = (id: string) => {
    setCheckedCriteria((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleStepVerification = (stepId: string) => {
    setStepsVerification((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleSave = () => {
    const updatedSteps = lesson.steps.map((step) => ({
      ...step,
      isVerified: !!stepsVerification[step.id],
    }));

    const updatedLesson: LessonPlan = {
      ...lesson,
      steps: updatedSteps,
      verification: {
        auditorName,
        auditorRole,
        schoolName,
        auditDate,
        status,
        generalRemarks,
        checkedCriteria,
      },
      updatedAt: Date.now(),
    };

    onSaveVerification(updatedLesson);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              ការផ្ទៀងផ្ទាត់ និងអធិការកិច្ចគរុកោសល្យ (PEDAGOGICAL VERIFICATION)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {lesson.title}
          </h2>
          <p className="text-xs text-slate-500">
            គ្រូបង្រៀន៖ <strong className="text-slate-700">{lesson.teacherName}</strong> · មុខវិជ្ជា៖ {lesson.subject} · {lesson.grade}
          </p>
        </div>

        {/* Save Verification Button */}
        <div className="flex items-center gap-2">
          {showSavedToast && (
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md animate-fade-in">
              បានរក្សាទុកក្នុង Free Store!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>រក្សាទុកលទ្ធផលផ្ទៀងផ្ទាត់</span>
          </button>
        </div>
      </div>

      {/* Score Summary & Status Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Scorecard */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            ពិន្ទុផ្ទៀងផ្ទាត់គរុកោសល្យ
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-sky-700 tabular-nums font-mono">
              {totalScore}%
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {totalScore >= 80 ? '✓ កម្រិតល្អឥតខ្ចោះ' : totalScore >= 60 ? '✓ កម្រិតល្អបង្គួរ' : '▲ ត្រូវកែលម្អ'}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              style={{ width: `${totalScore}%` }}
              className={`h-full transition-all duration-300 ${
                totalScore >= 80 ? 'bg-emerald-500' : totalScore >= 60 ? 'bg-sky-500' : 'bg-amber-500'
              }`}
            />
          </div>
        </div>

        {/* Status Selection */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs md:col-span-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            សេចក្តីសម្រេចផ្ទៀងផ្ទាត់ (Verification Status)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setStatus('approved')}
              className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg text-xs font-bold transition-all border ${
                status === 'approved'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>បានអនុម័ត</span>
            </button>

            <button
              onClick={() => setStatus('in_review')}
              className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg text-xs font-bold transition-all border ${
                status === 'in_review'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>កំពុងត្រួតពិនិត្យ</span>
            </button>

            <button
              onClick={() => setStatus('needs_revision')}
              className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg text-xs font-bold transition-all border ${
                status === 'needs_revision'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>ត្រូវកែសម្រួល</span>
            </button>
          </div>
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-sky-600" />
          <span>ក្របខ័ណ្ឌផ្ទៀងផ្ទាត់គុណភាពគរុកោសល្យទាំង ៦ ចំណុច</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          ចុចលើប្រអប់ដើម្បីផ្ទៀងផ្ទាត់ថាតើកិច្ចតែងការបានបំពេញតាមស្តង់ដារក្រសួងអប់រំឬនៅ
        </p>

        <div className="divide-y divide-slate-100">
          {VERIFICATION_CRITERIA_LIST.map((crit) => {
            const isChecked = checkedCriteria[crit.id] ?? false;
            return (
              <div
                key={crit.id}
                onClick={() => toggleCriterion(crit.id)}
                className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      isChecked
                        ? 'bg-sky-600 border-sky-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>
                      {crit.titleKh}
                    </p>
                    <span className="text-[11px] text-slate-400">{crit.titleEn}</span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-500 tabular-nums">
                  {crit.weight}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step by Step Verification Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>ការផ្ទៀងផ្ទាត់ជំហានបង្រៀនទាំង ៥ (5-Step Pedagogical Checks)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          ពិនិត្យ និងផ្ទៀងផ្ទាត់តាមជំហាននីមួយៗ
        </p>

        <div className="space-y-3">
          {lesson.steps.map((step) => {
            const isVerified = stepsVerification[step.id] ?? false;
            return (
              <div
                key={step.id}
                className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step.stepNumber}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {step.name} <span className="text-sky-700 font-semibold font-mono">({step.durationMinutes} នាទី)</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong>លក្ខខណ្ឌផ្ទៀងផ្ទាត់៖</strong> {step.verificationNote}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStepVerification(step.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer ${
                    isVerified
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isVerified ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>{isVerified ? 'ផ្ទៀងផ្ទាត់ត្រឹមត្រូវ' : 'មិនទាន់ផ្ទៀងផ្ទាត់'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auditor Information & Feedback Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-sky-600" />
          <span>ព័ត៌មានអ្នកផ្ទៀងផ្ទាត់ និងមតិកែលម្អ (Auditor Remarks & Sign-off)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              ឈ្មោះអ្នកផ្ទៀងផ្ទាត់ (Auditor Name)
            </label>
            <input
              type="text"
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              placeholder="ឧ. លោក គង់ សម្បត្តិ"
              className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              តួនាទី (Role)
            </label>
            <input
              type="text"
              value={auditorRole}
              onChange={(e) => setAuditorRole(e.target.value)}
              placeholder="ឧ. ប្រធានក្រុមបច្ចេកទេស / នាយករង"
              className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              កាលបរិច្ឆេទផ្ទៀងផ្ទាត់ (Date)
            </label>
            <input
              type="date"
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            មតិកែលម្អគរុកោសល្យ និងការណែនាំ (General Remarks)
          </label>
          <textarea
            value={generalRemarks}
            onChange={(e) => setGeneralRemarks(e.target.value)}
            rows={3}
            placeholder="សរសេរការវាយតម្លៃ និងមតិកែលម្អជូនលោកគ្រូ/អ្នកគ្រូ..."
            className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          />
        </div>

        {/* Digital Approval Stamp Simulation */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center p-1 text-center rotate-[-6deg] bg-emerald-50/50">
              <span className="text-[9px] font-bold text-emerald-800 uppercase">KRUSMART</span>
              <span className="text-[11px] font-extrabold text-emerald-700 leading-tight">បានផ្ទៀងផ្ទាត់</span>
              <span className="text-[8px] text-emerald-600 font-mono">{auditDate}</span>
            </div>
            <div className="text-xs text-slate-500">
              <p className="font-semibold text-slate-800">ត្រាផ្ទៀងផ្ទាត់គរុកោសល្យឌីជីថល</p>
              <p>បានផ្ទៀងផ្ទាត់ត្រឹមត្រូវតាមក្របខ័ណ្ឌស្តង់ដារបង្រៀន</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>យល់ព្រម & រក្សាទុកក្នុង Free Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};
