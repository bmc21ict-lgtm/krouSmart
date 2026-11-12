import React, { useState } from 'react';
import { LessonPlan, LessonStep } from '../types/lesson';
import { VoiceInputButton } from './VoiceInputButton';
import {
  Save,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Copy,
  ChevronUp,
  ChevronDown,
  Mic,
  GraduationCap,
  ExternalLink,
  FileCheck,
  ClipboardList,
} from 'lucide-react';

interface LessonEditorProps {
  lesson: LessonPlan;
  onSave: (updatedLesson: LessonPlan) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenPlp?: (category?: 'menu' | 'book' | 'examination' | 'homework' | 'video' | 'all') => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  onSave,
  onDuplicate,
  onDelete,
  onOpenPlp,
}) => {
  const [formData, setFormData] = useState<LessonPlan>(JSON.parse(JSON.stringify(lesson)));
  const [newAidInput, setNewAidInput] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [voiceMode, setVoiceMode] = useState<'append' | 'replace'>('append');
  const [masterTarget, setMasterTarget] = useState<string>('step_0_content');
  const [lastVoiceTranscript, setLastVoiceTranscript] = useState<string>('');

  const handleFieldChange = (field: keyof LessonPlan, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleObjectiveChange = (field: 'knowledge' | 'skills' | 'attitude', value: string) => {
    setFormData((prev) => ({
      ...prev,
      objectives: {
        ...prev.objectives,
        [field]: value,
      },
    }));
  };

  const handleStepChange = (index: number, field: keyof LessonStep, value: any) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, steps: updatedSteps }));
  };

  const appendOrSet = (currentVal: string, spokenText: string) => {
    if (voiceMode === 'replace' || !currentVal.trim()) {
      return spokenText;
    }
    return `${currentVal}\n${spokenText}`;
  };

  // Master dictation handler
  const handleMasterVoiceTranscript = (spokenText: string) => {
    setLastVoiceTranscript(spokenText);
    if (masterTarget === 'obj_knowledge') {
      handleObjectiveChange('knowledge', appendOrSet(formData.objectives.knowledge, spokenText));
    } else if (masterTarget === 'obj_skills') {
      handleObjectiveChange('skills', appendOrSet(formData.objectives.skills, spokenText));
    } else if (masterTarget === 'obj_attitude') {
      handleObjectiveChange('attitude', appendOrSet(formData.objectives.attitude, spokenText));
    } else if (masterTarget.startsWith('step_')) {
      const parts = masterTarget.split('_');
      const stepIdx = parseInt(parts[1]) || 0;
      const stepField = (parts[2] as keyof LessonStep) || 'content';
      if (formData.steps[stepIdx]) {
        const curVal = (formData.steps[stepIdx][stepField] as string) || '';
        handleStepChange(stepIdx, stepField, appendOrSet(curVal, spokenText));
      }
    }
  };

  const handleAddAid = () => {
    if (!newAidInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      teachingAids: [...prev.teachingAids, newAidInput.trim()],
    }));
    setNewAidInput('');
  };

  const handleRemoveAid = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      teachingAids: prev.teachingAids.filter((_, i) => i !== idx),
    }));
  };

  const handleAddStep = () => {
    const newStepNumber = formData.steps.length + 1;
    const newStep: LessonStep = {
      id: `step_${Date.now()}`,
      stepNumber: newStepNumber,
      name: `ជំហានទី ${newStepNumber}៖ ...`,
      durationMinutes: 5,
      teacherActivity: '- សកម្មភាពគ្រូ...',
      studentActivity: '- សកម្មភាពសិស្ស...',
      content: 'ខ្លឹមសារមេរៀន...',
      teacherKey: 'គន្លឹះគ្រូ និងចម្លើយ...',
      verificationNote: 'ចំណុចផ្ទៀងផ្ទាត់...',
      isVerified: false,
    };
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const handleRemoveStep = (index: number) => {
    if (formData.steps.length <= 1) return;
    const filtered = formData.steps.filter((_, i) => i !== index);
    const renumbered = filtered.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1,
    }));
    setFormData((prev) => ({ ...prev, steps: renumbered }));
  };

  const handleSave = () => {
    const totalMinutes = formData.steps.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
    const finalLesson: LessonPlan = {
      ...formData,
      durationMinutes: totalMinutes > 0 ? totalMinutes : formData.durationMinutes,
      updatedAt: Date.now(),
    };
    onSave(finalLesson);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const totalCalculatedMinutes = formData.steps.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
            ទម្រង់កែសម្រួលកិច្ចតែងការ (LESSON PLAN BUILDER)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {formData.title || 'កិច្ចតែងការថ្មី'}
          </h2>
          <p className="text-xs text-slate-500">
            ទិន្នន័យត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិក្នុ​ង Free Store នៅពេលចុចរក្សាទុក
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showSavedToast && (
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md animate-fade-in">
              បានរក្សាទុកក្នុង Free Store!
            </span>
          )}

          <button
            onClick={() => onDuplicate(lesson.id)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="ចម្លងកិច្ចតែងការនេះ"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ចម្លង</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>រក្សាទុកក្នុង Free Store</span>
          </button>
        </div>
      </div>

      {/* Voice-to-Text Master Dictation Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 via-sky-50 to-emerald-50 border border-purple-200 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>មុខងារបញ្ចេញសំឡេងជាអក្សរ (Voice-to-Text Dictation)</span>
                <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  ខ្មែរ / English
                </span>
              </h4>
              <p className="text-[11px] text-slate-600">
                ចុចនិយាយដើម្បីកត់ត្រាគំនិតបង្រៀន ឬប្រើប៊ូតុងមីក្រូហ្វូននៅតាមប្រអប់នីមួយៗ
              </p>
            </div>
          </div>

          {/* Master Voice Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Target Field Dropdown */}
            <select
              value={masterTarget}
              onChange={(e) => setMasterTarget(e.target.value)}
              className="p-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg shadow-2xs text-slate-800"
            >
              <optgroup label="វត្ថុបំណង (Objectives)">
                <option value="obj_knowledge">វត្ថុបំណង៖ វិជ្ជាសម្បទា</option>
                <option value="obj_skills">វត្ថុបំណង៖ បំណិនសម្បទា</option>
                <option value="obj_attitude">វត្ថុបំណង៖ ចរិយាសម្បទា</option>
              </optgroup>
              {formData.steps.map((st, i) => (
                <optgroup key={st.id} label={`ជំហានទី ${st.stepNumber}`}>
                  <option value={`step_${i}_content`}>ជំហាន {st.stepNumber}៖ ខ្លឹមសារមេរៀន</option>
                  <option value={`step_${i}_teacherActivity`}>ជំហាន {st.stepNumber}៖ សកម្មភាពគ្រូ</option>
                  <option value={`step_${i}_studentActivity`}>ជំហាន {st.stepNumber}៖ សកម្មភាពសិស្ស</option>
                  <option value={`step_${i}_teacherKey`}>ជំហាន {st.stepNumber}៖ គន្លឹះគ្រូ &amp; ចម្លើយ</option>
                  <option value={`step_${i}_verificationNote`}>ជំហាន {st.stepNumber}៖ ចំណុចផ្ទៀងផ្ទាត់</option>
                </optgroup>
              ))}
            </select>

            {/* Append vs Replace Mode */}
            <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setVoiceMode('append')}
                className={`px-2 py-1 rounded transition-colors ${
                  voiceMode === 'append' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                + បន្ថែមបន្ត
              </button>
              <button
                type="button"
                onClick={() => setVoiceMode('replace')}
                className={`px-2 py-1 rounded transition-colors ${
                  voiceMode === 'replace' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ជំនួស
              </button>
            </div>

            {/* Master Mic Button */}
            <VoiceInputButton
              onTranscript={handleMasterVoiceTranscript}
              fieldLabel="ប្រអប់ដែលបានរើស"
            />
          </div>
        </div>

        {lastVoiceTranscript && (
          <div className="mt-2.5 pt-2 border-t border-purple-200/60 flex items-center justify-between text-xs text-purple-900 bg-white/70 p-2 rounded-lg">
            <span className="truncate">
              <strong>បានកត់ត្រា៖</strong> &ldquo;{lastVoiceTranscript}&rdquo;
            </span>
            <span className="text-[11px] text-emerald-700 font-bold shrink-0 ml-2">✓ បានបញ្ចូលជោគជ័យ</span>
          </div>
        )}
      </div>

      {/* Main Info Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-600" />
          <span>ព័ត៌មានទូទៅនៃកិច្ចតែងការ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                ចំណងជើងមេរៀន (Lesson Topic) *
              </label>
              <VoiceInputButton
                fieldLabel="ចំណងជើង"
                onTranscript={(text) => handleFieldChange('title', appendOrSet(formData.title, text))}
              />
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
              placeholder="ឧ. ព្យញ្ជនៈ ក ផ្សំស្រៈ ឬ ទ្រឹស្ដីបទពីតាករ"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              មុខវិជ្ជា (Subject) *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleFieldChange('subject', e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
              placeholder="ឧ. ភាសាខ្មែរ ឬ គណិតវិទ្យា"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              ថ្នាក់ទី (Grade) *
            </label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => handleFieldChange('grade', e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="ឧ. ថ្នាក់ទី ១"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              បំណិនគោល (Skill Domain)
            </label>
            {formData.subject.includes('ភាសាខ្មែរ') ? (
              <select
                value={formData.skillDomain || 'អំណាន'}
                onChange={(e) => handleFieldChange('skillDomain', e.target.value)}
                className="w-full p-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="អំណាន">📖 អំណាន (Reading)</option>
                <option value="ការស្តាប់">👂 ការស្តាប់ (Listening)</option>
                <option value="ការសរសេរ">✍️ ការសរសេរ (Writing)</option>
                <option value="ការនិយាយ">🗣️ ការនិយាយ (Speaking)</option>
              </select>
            ) : formData.subject.includes('គណិត') ? (
              <select
                value={formData.skillDomain || 'ចំនួន'}
                onChange={(e) => handleFieldChange('skillDomain', e.target.value)}
                className="w-full p-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="ចំនួន">🔢 ចំនួន (Numbers & Operations)</option>
                <option value="រង្វាស់រង្វាល់">📏 រង្វាស់រង្វាល់ (Measurement)</option>
                <option value="ពីជគណិត">🔣 ពីជគណិត (Algebra & Patterns)</option>
                <option value="ធរណីមាត្រ">📐 ធរណីមាត្រ (Geometry)</option>
                <option value="ស្ថិតិ">📊 ស្ថិតិ (Statistics & Data)</option>
              </select>
            ) : (
              <input
                type="text"
                value={formData.skillDomain || ''}
                onChange={(e) => handleFieldChange('skillDomain', e.target.value)}
                placeholder="ឧ. បំណិនជាក់លាក់..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              ជំពូក ឬផ្នែក (Unit / Chapter)
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => handleFieldChange('unit', e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="ឧ. មេរៀនទី ១ ឬ ជំពូកទី ២"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              ឈ្មោះគ្រូបង្រៀន (Teacher Name)
            </label>
            <input
              type="text"
              value={formData.teacherName}
              onChange={(e) => handleFieldChange('teacherName', e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="ឧ. លោកគ្រូ សុខ ចិន្តា"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              ឈ្មោះសាលារៀន (School Name)
            </label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => handleFieldChange('schoolName', e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="ឧ. សាលាបឋមសិក្សា..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              កាលបរិច្ឆេទ (Date)
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              បន្ទប់រៀន (Classroom)
            </label>
            <input
              type="text"
              value={formData.classRoom}
              onChange={(e) => handleFieldChange('classRoom', e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="ឧ. បន្ទប់ ១A"
            />
          </div>
        </div>
      </div>

      {/* Objectives Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          ១. វត្ថុបំណងមេរៀន (Lesson Objectives)
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-sky-800">
                • វិជ្ជាសម្បទា (Knowledge)
              </label>
              <VoiceInputButton
                fieldLabel="វិជ្ជាសម្បទា"
                onTranscript={(text) => handleObjectiveChange('knowledge', appendOrSet(formData.objectives.knowledge, text))}
              />
            </div>
            <textarea
              value={formData.objectives.knowledge}
              onChange={(e) => handleObjectiveChange('knowledge', e.target.value)}
              rows={2}
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="សិស្សអាចចងចាំ យល់ដឹង ឬថ្លែង..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-emerald-800">
                • បំណិនសម្បទា (Skills)
              </label>
              <VoiceInputButton
                fieldLabel="បំណិនសម្បទា"
                onTranscript={(text) => handleObjectiveChange('skills', appendOrSet(formData.objectives.skills, text))}
              />
            </div>
            <textarea
              value={formData.objectives.skills}
              onChange={(e) => handleObjectiveChange('skills', e.target.value)}
              rows={2}
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="សិស្សអាចគណនា ដោះស្រាយ ឬអនុវត្ត..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-amber-800">
                • ចរិយាសម្បទា (Attitude)
              </label>
              <VoiceInputButton
                fieldLabel="ចរិយាសម្បទា"
                onTranscript={(text) => handleObjectiveChange('attitude', appendOrSet(formData.objectives.attitude, text))}
              />
            </div>
            <textarea
              value={formData.objectives.attitude}
              onChange={(e) => handleObjectiveChange('attitude', e.target.value)}
              rows={2}
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="បណ្តុះស្មារតីសហការ ស្រឡាញ់ការសិក្សា..."
            />
          </div>
        </div>
      </div>

      {/* Teaching Aids */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          ២. សម្ភារឧបទេស (Teaching Aids)
        </h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newAidInput}
            onChange={(e) => setNewAidInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAid()}
            placeholder="បញ្ចូលឈ្មោះសម្ភារឧបទេសថ្មី (ឧ. បណ្ណអក្សរ, ក្តារឈ្នួន...)"
            className="flex-1 p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <VoiceInputButton
            fieldLabel="សម្ភារឧបទេស"
            onTranscript={(text) => {
              if (text.trim()) {
                setFormData((prev) => ({
                  ...prev,
                  teachingAids: [...prev.teachingAids, text.trim()],
                }));
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddAid}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            + បន្ថែម
          </button>

          {onOpenPlp && (
            <button
              type="button"
              onClick={() => onOpenPlp('book')}
              className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              title="ស្វែងរកសៀវភៅពុម្ព និងជំនួយគ្រូពី PLP ក្រសួង"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>សៀវភៅ PLP</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.teachingAids.map((aid, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 text-xs rounded-md border border-slate-200"
            >
              <span>{aid}</span>
              <button
                type="button"
                onClick={() => handleRemoveAid(idx)}
                className="text-slate-400 hover:text-rose-600"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Steps Editor */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              ៣. ជំហានបង្រៀនទាំង ៥ និងការបែងចែកនាទី
            </h3>
            <span className="text-xs text-sky-700 font-semibold">
              សរុបគណនា៖ <strong>{totalCalculatedMinutes} នាទី</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddStep}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-lg border border-sky-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ បន្ថែមជំហាន</span>
          </button>
        </div>

        <div className="space-y-6">
          {formData.steps.map((step, idx) => (
            <div
              key={step.id}
              className="p-5 border border-slate-200 rounded-xl bg-slate-50/40 relative"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-6 h-6 rounded bg-sky-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => handleStepChange(idx, 'name', e.target.value)}
                    className="flex-1 p-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white px-2 py-1 border border-slate-300 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={step.durationMinutes}
                      onChange={(e) =>
                        handleStepChange(idx, 'durationMinutes', parseInt(e.target.value) || 0)
                      }
                      className="w-12 text-xs font-bold text-center focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">នាទី</span>
                  </div>

                  {formData.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="លុបជំហាននេះ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Contextual PLP helper banners for Step 4 & Step 5 */}
              {onOpenPlp && (step.stepNumber === 4 || idx === 3) && (
                <div className="flex items-center justify-between mb-3 px-3 py-1.5 rounded-lg bg-amber-50/90 border border-amber-200 text-xs">
                  <span className="text-amber-900 font-medium flex items-center gap-1.5 text-[11px]">
                    <FileCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>ត្រូវការសំណួរ ឬលំហាត់អនុវត្តស្តង់ដារក្រសួង?</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenPlp('examination')}
                    className="text-[11px] font-bold text-amber-900 hover:text-amber-950 underline bg-white px-2 py-0.5 rounded border border-amber-300 cursor-pointer"
                  >
                    ស្វែងរកវិញ្ញាសា &amp; តេស្ត PLP ↗
                  </button>
                </div>
              )}

              {onOpenPlp && (step.stepNumber === 5 || idx === 4) && (
                <div className="flex items-center justify-between mb-3 px-3 py-1.5 rounded-lg bg-purple-50/90 border border-purple-200 text-xs">
                  <span className="text-purple-900 font-medium flex items-center gap-1.5 text-[11px]">
                    <ClipboardList className="w-3.5 h-3.5 text-purple-700" />
                    <span>ត្រូវការសន្លឹកកិច្ចការផ្ទះបឋមសិក្សាផ្លូវការ?</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenPlp('homework')}
                    className="text-[11px] font-bold text-purple-900 hover:text-purple-950 underline bg-white px-2 py-0.5 rounded border border-purple-300 cursor-pointer"
                  >
                    ស្វែងរកកិច្ចការផ្ទះ PLP ↗
                  </button>
                </div>
              )}

              {/* Step Content */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    ខ្លឹមសារមេរៀន (Lesson Content)
                  </label>
                  <VoiceInputButton
                    fieldLabel={`ខ្លឹមសារជំហានទី ${idx + 1}`}
                    onTranscript={(text) => handleStepChange(idx, 'content', appendOrSet(step.content, text))}
                  />
                </div>
                <textarea
                  value={step.content}
                  onChange={(e) => handleStepChange(idx, 'content', e.target.value)}
                  rows={2}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Teacher & Student Activities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                      សកម្មភាពគ្រូបង្រៀន (Teacher Activity)
                    </label>
                    <VoiceInputButton
                      fieldLabel={`សកម្មភាពគ្រូ ជំហានទី ${idx + 1}`}
                      onTranscript={(text) => handleStepChange(idx, 'teacherActivity', appendOrSet(step.teacherActivity, text))}
                    />
                  </div>
                  <textarea
                    value={step.teacherActivity}
                    onChange={(e) => handleStepChange(idx, 'teacherActivity', e.target.value)}
                    rows={3}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      សកម្មភាពសិស្សានុសិស្ស (Student Activity)
                    </label>
                    <VoiceInputButton
                      fieldLabel={`សកម្មភាពសិស្ស ជំហានទី ${idx + 1}`}
                      onTranscript={(text) => handleStepChange(idx, 'studentActivity', appendOrSet(step.studentActivity, text))}
                    />
                  </div>
                  <textarea
                    value={step.studentActivity}
                    onChange={(e) => handleStepChange(idx, 'studentActivity', e.target.value)}
                    rows={3}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Teacher Key & Solutions */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                    គន្លឹះគ្រូ &amp; ចម្លើយត្រឹមត្រូវ (Teacher Keys &amp; Solutions)
                  </label>
                  <VoiceInputButton
                    fieldLabel={`គន្លឹះគ្រូ ជំហានទី ${idx + 1}`}
                    onTranscript={(text) => handleStepChange(idx, 'teacherKey', appendOrSet(step.teacherKey, text))}
                  />
                </div>
                <textarea
                  value={step.teacherKey}
                  onChange={(e) => handleStepChange(idx, 'teacherKey', e.target.value)}
                  rows={2}
                  className="w-full p-2 text-xs border border-amber-300 rounded-lg bg-amber-50/50 text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Verification note */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    ចំណុចផ្ទៀងផ្ទាត់គរុកោសល្យ (Verification Check)
                  </label>
                  <VoiceInputButton
                    fieldLabel={`ចំណុចផ្ទៀងផ្ទាត់ ជំហានទី ${idx + 1}`}
                    onTranscript={(text) => handleStepChange(idx, 'verificationNote', appendOrSet(step.verificationNote, text))}
                  />
                </div>
                <input
                  type="text"
                  value={step.verificationNote}
                  onChange={(e) => handleStepChange(idx, 'verificationNote', e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save & Actions Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <button
          type="button"
          onClick={() => onDelete(lesson.id)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>លុបកិច្ចតែងការនេះ</span>
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>រក្សាទុកទាំងអស់ក្នុង Free Store</span>
        </button>
      </div>
    </div>
  );
};
