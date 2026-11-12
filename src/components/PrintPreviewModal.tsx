import React, { useState } from 'react';
import { LessonPlan } from '../types/lesson';
import { Printer, X, Check, Eye, EyeOff, Award, Clock } from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonPlan;
  onTriggerPrint: (options: {
    includeTeacherKeys: boolean;
    includeVerification: boolean;
    includeMinutes: boolean;
  }) => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  lesson,
  onTriggerPrint,
}) => {
  const [includeTeacherKeys, setIncludeTeacherKeys] = useState(true);
  const [includeVerification, setIncludeVerification] = useState(true);
  const [includeMinutes, setIncludeMinutes] = useState(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    onTriggerPrint({
      includeTeacherKeys,
      includeVerification,
      includeMinutes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">
              ការកំណត់បោះពុម្ព (Print Setup)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500">កិច្ចតែងការដែលត្រូវបោះពុម្ព៖</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{lesson.title}</p>
            <p className="text-xs text-slate-600">
              {lesson.subject} · {lesson.grade} · {lesson.durationMinutes} នាទី
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              ជម្រើសបោះពុម្ព (Print Options)
            </span>

            {/* Toggle Teacher Keys */}
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  {includeTeacherKeys ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    ច្បាប់គ្រូបង្រៀន (រួមបញ្ចូលចម្លើយ និងគន្លឹះ)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {includeTeacherKeys
                      ? 'បោះពុម្ពទាំងគន្លឹះគ្រូ និងដំណោះស្រាយលម្អិត'
                      : 'លាក់ចម្លើយ (សម្រាប់ចែកជូនសិស្ស ឬសន្លឹកកិច្ចការ)'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeTeacherKeys}
                onChange={(e) => setIncludeTeacherKeys(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </label>

            {/* Toggle Verification */}
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    ផ្នែកផ្ទៀងផ្ទាត់ និងកន្លែងចុះហត្ថលេខា
                  </p>
                  <p className="text-[11px] text-slate-500">
                    រួមបញ្ចូលតារាងផ្ទៀងផ្ទាត់ ហត្ថលេខានាយក និងគ្រូបង្រៀន
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeVerification}
                onChange={(e) => setIncludeVerification(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </label>

            {/* Toggle Minutes */}
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    ការបែងចែកនាទីតាមជំហាន
                  </p>
                  <p className="text-[11px] text-slate-500">
                    បង្ហាញចំនួននាទី និងក្រាហ្វិកបែងចែកពេលវេលា
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeMinutes}
                onChange={(e) => setIncludeMinutes(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            បោះបង់
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពឥឡូវនេះ (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
