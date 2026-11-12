import React, { useState } from 'react';
import { TEACHING_GUIDELINES, TeachingGuideline } from '../data/teachingGuidelines';
import {
  FileText,
  Search,
  X,
  Filter,
  CheckCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGuidelineToNewLesson: (guide: TeachingGuideline) => void;
  onOpenPlp?: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({
  isOpen,
  onClose,
  onApplyGuidelineToNewLesson,
  onOpenPlp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<TeachingGuideline>(TEACHING_GUIDELINES[0]);

  if (!isOpen) return null;

  const filteredGuides = TEACHING_GUIDELINES.filter((g) => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      g.titleKh.toLowerCase().includes(q) ||
      g.subject.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-xl border border-slate-200 flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                បណ្ណាល័យឯកសារបង្រៀន និងលិខិតណែនាំក្រសួង
              </h3>
              <p className="text-[11px] text-slate-500">
                ស្តង់ដារកម្មវិធីសិក្សា វិធីសាស្ត្របង្រៀនថ្នាក់ដំបូង និងសារាចរណែនាំបឋមសិក្សា (ថ្នាក់ទី១ ដល់ ទី៦)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MoEYS PLP Portal Direct Links Banner */}
        <div className="my-2.5 p-2.5 rounded-xl bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-sky-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              PLP
            </span>
            <div>
              <div className="text-xs font-bold text-slate-900">
                វិបសាយផ្លូវការកញ្ចប់សម្ភារបឋមសិក្សា (PLP MoEYS):
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-sky-800 font-medium mt-0.5">
                <a href="https://plp.moeys.gov.kh/menu" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                  <span>• មាតិកា (/menu)</span>
                  <ExternalLink className="w-2.5 h-2.5 text-sky-500" />
                </a>
                <a href="https://plp.moeys.gov.kh/book" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                  <span>• សៀវភៅ (/book)</span>
                  <ExternalLink className="w-2.5 h-2.5 text-sky-500" />
                </a>
                <a href="https://plp.moeys.gov.kh/examination" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                  <span>• វិញ្ញាសា (/examination)</span>
                  <ExternalLink className="w-2.5 h-2.5 text-sky-500" />
                </a>
                <a href="https://plp.moeys.gov.kh/homework" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                  <span>• កិច្ចការផ្ទះ (/homework)</span>
                  <ExternalLink className="w-2.5 h-2.5 text-sky-500" />
                </a>
                <a href="https://plp.moeys.gov.kh/video" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                  <span>• វីដេអូ (/video)</span>
                  <ExternalLink className="w-2.5 h-2.5 text-sky-500" />
                </a>
              </div>
            </div>
          </div>
          {onOpenPlp && (
            <button
              onClick={() => {
                onClose();
                onOpenPlp();
              }}
              className="px-2.5 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span>បើកមជ្ឈមណ្ឌល PLP ក្នុងអែប</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search & Category Filter */}
        <div className="py-3 flex flex-wrap items-center gap-2 border-b border-slate-200">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកតាមចំណងជើង, លេខលិខិត, មុខវិជ្ជា (ឧ. អំណាន, គណិត, ៥ ជំហាន)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ទាំងអស់ ({TEACHING_GUIDELINES.length})
            </button>
            <button
              onClick={() => setSelectedCategory('circular')}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors ${
                selectedCategory === 'circular'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              លិខិតណែនាំ
            </button>
            <button
              onClick={() => setSelectedCategory('pedagogy')}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors ${
                selectedCategory === 'pedagogy'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              វិធីសាស្ត្របង្រៀន
            </button>
            <button
              onClick={() => setSelectedCategory('assessment')}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-colors ${
                selectedCategory === 'assessment'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ការវាស់វែង
            </button>
          </div>
        </div>

        {/* 2-Column Split: List on Left, Document Details on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden pt-3">
          {/* List (5 cols) */}
          <div className="md:col-span-5 overflow-y-auto space-y-2 pr-1">
            {filteredGuides.map((guide) => {
              const isSelected = selectedGuide?.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-600 bg-sky-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-sky-800">{guide.categoryLabel}</span>
                    <span className="text-slate-400 font-mono">{guide.subject}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {guide.titleKh}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {guide.summary}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400">
                    <span>{guide.code}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details (7 cols) */}
          <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-y-auto flex flex-col">
            {selectedGuide ? (
              <div className="space-y-4 flex-1">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
                    {selectedGuide.categoryLabel} · {selectedGuide.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedGuide.titleKh}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">ចេញដោយ៖ {selectedGuide.issuedBy}</p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedGuide.fullContent}
                </div>

                {/* Key Principles */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2">គោលការណ៍គន្លឹះ៖</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedGuide.keyPrinciples.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Time Distribution */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>បំណែងចែកនាទីគំរូ (៥០ នាទី)៖</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedGuide.recommendedSteps.map((st, idx) => (
                      <div key={idx} className="p-2 bg-white border border-slate-200 rounded-lg">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{st.step}</span>
                          <span className="text-sky-700">{st.minutes}mn</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{st.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onApplyGuidelineToNewLesson(selectedGuide);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>យកលិខិតណែនាំនេះមកបង្កើតកិច្ចតែងការបង្រៀន</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                ជ្រើសរើសឯកសារណែនាំដើម្បីអានលម្អិត
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
