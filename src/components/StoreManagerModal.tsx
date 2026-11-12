import React, { useRef, useState } from 'react';
import { storageService } from '../services/storageService';
import { LessonPlan } from '../types/lesson';
import {
  Database,
  X,
  Download,
  Upload,
  RotateCcw,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface StoreManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: LessonPlan[];
  onReloadLessons: (lessons: LessonPlan[]) => void;
}

export const StoreManagerModal: React.FC<StoreManagerModalProps> = ({
  isOpen,
  onClose,
  lessons,
  onReloadLessons,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const stats = storageService.getStorageStats();

  const handleExportBackup = () => {
    storageService.exportToJsonFile(lessons);
    setNotification({
      type: 'success',
      message: 'បានទាញយកឯកសារបម្រុងទុកជោគជ័យ!',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storageService.importFromJsonFile(content);
      if (res.success && res.lessons) {
        onReloadLessons(res.lessons);
        setNotification({
          type: 'success',
          message: `បានបញ្ចូលទិន្នន័យជោគជ័យចំនួន ${res.lessons.length} កិច្ចតែងការ!`,
        });
      } else {
        setNotification({
          type: 'error',
          message: res.error || 'មិនអាចអានឯកសារបម្រុងទុកបានទេ',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យឡើងវិញទៅកាន់កិច្ចតែងការគំរូដើមមែនទេ?')) {
      const defaultLessons = storageService.resetToDefaults();
      onReloadLessons(defaultLessons);
      setNotification({
        type: 'success',
        message: 'បានកំណត់ទិន្នន័យឡើងវិញទៅកាន់កិច្ចតែងការគំរូរួចរាល់!',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ឃ្លាំងទិន្នន័យឥតគិតថ្លៃ (Free Store)
              </h3>
              <p className="text-[11px] text-slate-500">
                ការផ្ទុកទិន្នន័យអចិន្ត្រៃយ៍ក្រៅបណ្តាញ (Persistent Offline Storage)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notification && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="py-4 space-y-4">
          {/* Storage stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                ចំនួនកិច្ចតែងការ
              </span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {stats.count} កិច្ចតែងការ
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                ទំហំប្រើប្រាស់ (Free)
              </span>
              <span className="text-xl font-bold text-emerald-700 tabular-nums">
                {stats.formattedSize}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            ទិន្នន័យកិច្ចតែងការបង្រៀនទាំងអស់ត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិក្នុង Browser Local Database របស់លោកអ្នក ដោយមិនចាំបាច់បង់ប្រាក់ ឬភ្ជាប់គណនីខាងក្រៅឡើយ។
          </p>

          <div className="space-y-2 pt-2">
            {/* Backup export */}
            <button
              onClick={handleExportBackup}
              className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    ទាញយកឯកសារបម្រុងទុក (Export JSON Backup)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    រក្សាទុកកិច្ចតែងការទាំងអស់ជាឯកសារបម្រុងទុកក្នុងកុំព្យូទ័រ
                  </p>
                </div>
              </div>
            </button>

            {/* Restore import */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    បញ្ចូលឯកសារបម្រុងទុក (Import Backup)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ស្តារទិន្នន័យកិច្ចតែងការពីឯកសារ JSON ពីមុន
                  </p>
                </div>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            {/* Reset to defaults */}
            <button
              onClick={handleResetDefaults}
              className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-rose-50/50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-rose-900">
                    កំណត់ឡើងវិញទៅកិច្ចតែងការគំរូដើម
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ស្តារមេរៀនគំរូស្តង់ដារក្រសួង (គណិតវិទ្យា, ភាសាខ្មែរ)
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            បិទផ្ទាំង
          </button>
        </div>
      </div>
    </div>
  );
};
