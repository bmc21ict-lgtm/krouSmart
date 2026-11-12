import React, { useState } from 'react';
import {
  PLP_PORTAL_SECTIONS,
  PLP_CURATED_RESOURCES,
  PlpItem,
  PlpPortalSection,
} from '../data/plpResources';
import {
  ExternalLink,
  BookOpen,
  FileCheck,
  ClipboardList,
  Video,
  Menu as MenuIcon,
  Search,
  X,
  Filter,
  CheckCircle,
  Copy,
  PlusCircle,
  Sparkles,
  Bookmark,
  Share2,
} from 'lucide-react';

interface PlpPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertContent?: (target: 'step4' | 'step5' | 'materials' | 'title', text: string) => void;
  initialCategory?: 'menu' | 'book' | 'examination' | 'homework' | 'video' | 'all';
}

export const PlpPortalModal: React.FC<PlpPortalModalProps> = ({
  isOpen,
  onClose,
  onInsertContent,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<PlpItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedNotice, setInsertedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const getSectionIcon = (key: string) => {
    switch (key) {
      case 'menu':
        return <MenuIcon className="w-5 h-5" />;
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'examination':
        return <FileCheck className="w-5 h-5" />;
      case 'homework':
        return <ClipboardList className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const filteredResources = PLP_CURATED_RESOURCES.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesGrade =
      selectedGrade === 'all' || item.grade === selectedGrade || item.grade === 'ទាំងអស់';
    const matchesSubj = selectedSubject === 'all' || item.subject === selectedSubject;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      item.titleKh.toLowerCase().includes(q) ||
      item.descriptionKh.toLowerCase().includes(q) ||
      (item.skillOrStrand && item.skillOrStrand.toLowerCase().includes(q)) ||
      (item.referenceCode && item.referenceCode.toLowerCase().includes(q));

    return matchesCat && matchesGrade && matchesSubj && matchesQuery;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (target: 'step4' | 'step5' | 'materials' | 'title', text: string) => {
    if (onInsertContent) {
      onInsertContent(target, text);
      setInsertedNotice(`បានបញ្ចូលទៅក្នុង ${target === 'step5' ? 'ជំហានទី៥ (កិច្ចការផ្ទះ)' : target === 'step4' ? 'ជំហានទី៤ (ពង្រឹងចំណេះ)' : target === 'materials' ? 'សម្ភារឧបទេស' : 'ចំណងជើង'} រួចរាល់!`);
      setTimeout(() => setInsertedNotice(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  កញ្ចប់សម្ភារ និងធនធានបឋមសិក្សា (PLP MoEYS)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  ក្រសួងអប់រំ យុវជន និងកីឡា
                </span>
              </div>
              <p className="text-xs text-slate-500">
                វិបសាយផ្លូវការ plp.moeys.gov.kh សម្រាប់គ្រូបង្រៀនថ្នាក់ទី១ ដល់ទី៦ (ភាសាខ្មែរ & គណិតវិទ្យា)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 5 Official Portals Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 py-3 border-b border-slate-200 shrink-0">
          {PLP_PORTAL_SECTIONS.map((sec) => {
            const isCurrent = selectedCategory === sec.key;
            return (
              <div
                key={sec.key}
                className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isCurrent
                    ? 'border-sky-500 bg-sky-50/70 shadow-xs ring-1 ring-sky-400'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      onClick={() => setSelectedCategory(sec.key)}
                      className="text-xs font-bold text-slate-900 hover:text-sky-700 flex items-center gap-1.5"
                    >
                      <span className="text-sky-600">{getSectionIcon(sec.key)}</span>
                      <span>{sec.titleKh}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                    {sec.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-auto">
                  <button
                    onClick={() => setSelectedCategory(sec.key)}
                    className="text-[10px] font-semibold text-sky-600 hover:underline cursor-pointer"
                  >
                    ជ្រើសរើស
                  </button>
                  <a
                    href={sec.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-sky-700 bg-white px-2 py-0.5 rounded border border-slate-200 hover:border-sky-300 shadow-2xs"
                    title={`បើកវិបសាយ ${sec.officialUrl}`}
                  >
                    <span>បើក PLP</span>
                    <ExternalLink className="w-3 h-3 text-sky-500" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកតាមចំណងជើង, លំហាត់, កូដយោង, បំណិន..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                លុប
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1 px-2.5 text-xs border border-slate-300 rounded-lg font-medium text-slate-700 bg-white"
            >
              <option value="all">ផ្នែកទាំងអស់ (៥)</option>
              <option value="menu">មាតិកាកម្មវិធី (/menu)</option>
              <option value="book">សៀវភៅពុម្ព & ជំនួយ (/book)</option>
              <option value="examination">វិញ្ញាសា & តេស្ត (/examination)</option>
              <option value="homework">កិច្ចការផ្ទះ & លំហាត់ (/homework)</option>
              <option value="video">វីដេអូបង្រៀន (/video)</option>
            </select>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="py-1 px-2.5 text-xs border border-slate-300 rounded-lg font-medium text-slate-700 bg-white"
            >
              <option value="all">គ្រប់កម្រិតថ្នាក់</option>
              <option value="ថ្នាក់ទី១">ថ្នាក់ទី១</option>
              <option value="ថ្នាក់ទី២">ថ្នាក់ទី២</option>
              <option value="ថ្នាក់ទី៣">ថ្នាក់ទី៣</option>
              <option value="ថ្នាក់ទី៤">ថ្នាក់ទី៤</option>
              <option value="ថ្នាក់ទី៥">ថ្នាក់ទី៥</option>
              <option value="ថ្នាក់ទី៦">ថ្នាក់ទី៦</option>
            </select>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="py-1 px-2.5 text-xs border border-slate-300 rounded-lg font-medium text-slate-700 bg-white"
            >
              <option value="all">គ្រប់មុខវិជ្ជា</option>
              <option value="ភាសាខ្មែរ">ភាសាខ្មែរ (បំណិនទាំង៤)</option>
              <option value="គណិតវិទ្យា">គណិតវិទ្យា (បំណិនទាំង៥)</option>
            </select>
          </div>
        </div>

        {/* Notice Banner when content inserted */}
        {insertedNotice && (
          <div className="my-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center justify-between border border-emerald-200">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {insertedNotice}
            </span>
          </div>
        )}

        {/* Main Content: Split List and Preview */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-4 pt-3">
          {/* Left: Resource List */}
          <div className="md:col-span-6 lg:col-span-5 overflow-y-auto pr-1 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
              ធនធានរកឃើញ ({filteredResources.length})
            </div>

            {filteredResources.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">មិនមានទិន្នន័យត្រូវគ្នានឹងការស្វែងរកទេ</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedGrade('all');
                    setSelectedSubject('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 text-xs text-sky-600 underline font-semibold"
                >
                  សម្អាតការច្រោះ (Reset Filters)
                </button>
              </div>
            ) : (
              filteredResources.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.grade} · {item.subject}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {item.referenceCode}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                      {item.titleKh}
                    </h4>

                    {item.skillOrStrand && (
                      <div className="text-[10px] text-sky-700 font-medium mb-1">
                        🎯 បំណិន/ផ្នែក៖ {item.skillOrStrand}
                      </div>
                    )}

                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                      {item.descriptionKh}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                      <span className="capitalize text-slate-500 font-semibold flex items-center gap-1">
                        {getSectionIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                      <span className="text-sky-600 font-medium flex items-center gap-0.5">
                        មើលព័ត៌មានលម្អិត &gt;
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Detailed Preview & Insert Actions */}
          <div className="md:col-span-6 lg:col-span-7 bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-y-auto flex flex-col justify-between">
            {selectedItem ? (
              <div className="space-y-4">
                {/* Title & Official Link */}
                <div className="pb-3 border-b border-slate-200">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-sky-600 text-white">
                      {selectedItem.grade}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800">
                      {selectedItem.subject}
                    </span>
                    {selectedItem.skillOrStrand && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                        {selectedItem.skillOrStrand}
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-500 ml-auto">
                      {selectedItem.referenceCode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                    {selectedItem.titleKh}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">{selectedItem.titleEn}</div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <a
                      href={selectedItem.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>បើកមើលទំព័រផ្លូវការលើ PLP ({selectedItem.officialUrl})</span>
                    </a>

                    <button
                      onClick={() => handleCopy(selectedItem.officialUrl, 'url')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedId === 'url' ? 'បានចម្លង!' : 'ចម្លងតំណ (Copy Link)'}</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-800 mb-1">ខ្លឹមសារសង្ខេប៖</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedItem.descriptionKh}
                  </p>
                </div>

                {/* Sample Content & Prompts for lesson plan */}
                {selectedItem.sampleContent && (
                  <div className="space-y-3">
                    {selectedItem.sampleContent.teacherGuideSnippet && (
                      <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            ខ្លឹមសារណែនាំគ្រូ (Teacher Guidance)
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(
                                selectedItem.sampleContent?.teacherGuideSnippet || '',
                                'snippet'
                              )
                            }
                            className="text-[11px] text-emerald-700 font-semibold hover:underline"
                          >
                            {copiedId === 'snippet' ? 'បានចម្លង!' : 'ចម្លង'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                          {selectedItem.sampleContent.teacherGuideSnippet}
                        </p>
                      </div>
                    )}

                    {selectedItem.sampleContent.exercisesOrQuestions && (
                      <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                            សំណួរ ឬលំហាត់អនុវត្ត (Exercises / Assessment)
                          </span>
                          {onInsertContent && (
                            <button
                              onClick={() =>
                                handleInsert(
                                  'step4',
                                  selectedItem.sampleContent?.exercisesOrQuestions?.join('\n') || ''
                                )
                              }
                              className="text-[11px] text-amber-800 font-bold hover:underline bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
                            >
                              + បញ្ចូលក្នុងជំហានទី៤
                            </button>
                          )}
                        </div>
                        <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                          {selectedItem.sampleContent.exercisesOrQuestions.map((q, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedItem.sampleContent.homeworkPrompt && (
                      <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                            <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
                            កិច្ចការផ្ទះសិស្ស (Homework Worksheet)
                          </span>
                          {onInsertContent && (
                            <button
                              onClick={() =>
                                handleInsert(
                                  'step5',
                                  selectedItem.sampleContent?.homeworkPrompt || ''
                                )
                              }
                              className="text-[11px] text-purple-800 font-bold hover:underline bg-purple-50 px-2 py-0.5 rounded border border-purple-200"
                            >
                              + បញ្ចូលក្នុងជំហានទី៥
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                          {selectedItem.sampleContent.homeworkPrompt}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Append to Lesson Plan Actions */}
                {onInsertContent && (
                  <div className="pt-2 border-t border-slate-200">
                    <div className="text-xs font-bold text-slate-800 mb-2">
                      បញ្ចូលធនធាននេះទៅក្នុងកិច្ចតែងការកំពុងកែសម្រួល៖
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleInsert(
                            'materials',
                            `សៀវភៅជំនួយគ្រូ និងសិស្ស PLP (${selectedItem.titleKh}) - ${selectedItem.officialUrl}`
                          )
                        }
                        className="px-2.5 py-1.5 text-xs font-semibold text-sky-800 bg-sky-100/80 hover:bg-sky-200 rounded-lg transition-colors border border-sky-300"
                      >
                        + ដាក់ជាសម្ភារឧបទេស
                      </button>

                      {selectedItem.sampleContent?.homeworkPrompt && (
                        <button
                          onClick={() =>
                            handleInsert(
                              'step5',
                              selectedItem.sampleContent?.homeworkPrompt || ''
                            )
                          }
                          className="px-2.5 py-1.5 text-xs font-semibold text-purple-800 bg-purple-100/80 hover:bg-purple-200 rounded-lg transition-colors border border-purple-300"
                        >
                          + ដាក់ជាកិច្ចការផ្ទះ (ជំហានទី៥)
                        </button>
                      )}

                      {selectedItem.sampleContent?.exercisesOrQuestions && (
                        <button
                          onClick={() =>
                            handleInsert(
                              'step4',
                              selectedItem.sampleContent?.exercisesOrQuestions?.join('\n') || ''
                            )
                          }
                          className="px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100/80 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300"
                        >
                          + ដាក់ជាលំហាត់ពង្រឹង (ជំហានទី៤)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="text-sm font-bold text-slate-700 mb-1">
                  ជ្រើសរើសធនធានណាមួយពីបញ្ជីខាងឆ្វេង
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  អ្នកអាចមើលខ្លឹមសារគំរូ ចម្លងកូដឯកសារយោង ឬបញ្ចូលកិច្ចការផ្ទះ និងលំហាត់ពី PLP ក្រសួងអប់រំ ចូលក្នុងកិច្ចតែងការដោយផ្ទាល់។
                </p>
              </div>
            )}

            {/* Official MoEYS Footer Note */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <span>ប្រភព៖ នាយកដ្ឋានបឋមសិក្សា ក្រសួងអប់រំ យុវជន និងកីឡា (plp.moeys.gov.kh)</span>
              <span>Primary Learning Portal (PLP)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
