import React, { useState } from 'react';
import { LessonPlan, KHMER_SKILLS, MATH_SKILLS } from '../types/lesson';
import {
  Sparkles,
  X,
  BookOpen,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLessonGenerated: (lesson: LessonPlan) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onLessonGenerated,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'chat'>('generate');

  // Generator form
  const [grade, setGrade] = useState('ថ្នាក់ទី១');
  const [subject, setSubject] = useState('ភាសាខ្មែរ');
  const [skillDomain, setSkillDomain] = useState('អំណាន');
  const [topic, setTopic] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [extraContext, setExtraContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample prompt topics per skill
  const sampleTopics: Record<string, string[]> = {
    'អំណាន': [
      'ការបង្រៀនព្យញ្ជនៈ ក ផ្សំស្រៈ',
      'ការអានពាក្យគន្លឹះ និងសូរសព្ទ',
      'ការអានអត្ថបទរឿង និងការយល់ន័យ',
      'ការអានរលូន និងល្ប្បះខ្លីៗ',
    ],
    'ការស្តាប់': [
      'ការស្តាប់រឿងនិទាន "សត្វទន្សាយ និងអណ្តើក"',
      'ការស្តាប់ការណែនាំអំពីអនាម័យខ្លួនប្រាណ',
      'ការស្តាប់សូរសព្ទ និងទស្សន៍ទាយពាក្យ',
    ],
    'ការសរសេរ': [
      'ការគូសវាស និងសរសេរព្យញ្ជនៈតម្រង់ជួរ',
      'សរសេរតាមអានពាក្យមានស្រៈនិស្ស័យ',
      'ការតែងល្បះលាតសាមញ្ញ',
      'ការតែងកថាខណ្ឌពិពណ៌នាមិត្តភក្តិ',
    ],
    'ការនិយាយ': [
      'ការសន្ទនាអំពីសកម្មភាពពេលព្រឹកនៅសាលា',
      'ការរៀបរាប់អំពីរូបភាពគ្រួសារខ្ញុំ',
      'ការឆ្លើយសំណួរ និងសម្តែងតួជាសត្វ',
    ],
    'ចំនួន': [
      'ការរាប់ និងការស្គាល់តម្លៃលេខ ១ ដល់ ១០',
      'តម្លៃតាមខ្ទង់ (ខ្ទង់រាយ និងខ្ទង់ដប់)',
      'ប្រមាណវិធីបូកមានត្រីតុកក្នុងរង្វង់ ១០០',
      'ប្រមាណវិធីគុណ និងមេគុណ ២ ដល់ ៥',
    ],
    'រង្វាស់រង្វាល់': [
      'ការវាស់ប្រវែងជា សង់ទីម៉ែត្រ (cm) និងម៉ែត្រ (m)',
      'ការអានម៉ោង និងនាទីលើនាឡិកា',
      'ការចំណាយ និងការគិតប្រាក់រៀល',
      'ការថ្លឹងម៉ាសជា ក្រាម (g) និងគីឡូក្រាម (kg)',
    ],
    'ពីជគណិត': [
      'លំនាំចំនួនកើនឡើងម្តង ២ និងម្តង ៥',
      'ការដោះស្រាយប្រអប់ទទេក្នុងសមភាព (□ + ៤ = ៩)',
      'ទំនាក់ទំនងរវាងវិធីបូក និងវិធីដក',
    ],
    'ធរណីមាត្រ': [
      'រូបធរណីមាត្រ ២ វិមាត្រ (ត្រីកោណ ការ៉េ ចតុកោណកែង រង្វង់)',
      'ការគណនាបរិមាត្រចតុកោណកែង',
      'មុំស្រួច មុំកែង និងមុំទាល',
      'រូបធរណីមាត្រ ៣ វិមាត្រ (គូប និងប្រលេពីប៉ែត)',
    ],
    'ស្ថិតិ': [
      'ការប្រមូលទិន្នន័យ និងគំនូសតាងរូបភាព',
      'ការអានគំនូសតាងសសរ',
      'ការរៀបចំទិន្នន័យចំណូលចិត្តក្នុងតារាង',
    ],
  };

  // Chat form
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: 'ជម្រាបសួរលោកគ្រូ អ្នកគ្រូ! ខ្ញុំជាជំនួយការ AI គរុកោសល្យបឋមសិក្សា។\n\nខ្ញុំយល់ច្បាស់អំពី៖\n• ភាសាខ្មែរ (បំណិនទាំង ៤)៖ អំណាន ការស្តាប់ ការសរសេរ ការនិយាយ\n• គណិតវិទ្យា (បំណិនទាំង ៥)៖ ចំនួន រង្វាស់រង្វាល់ ពីជគណិត ធរណីមាត្រ ស្ថិតិ\n\nសូមសួរខ្ញុំអំពីវិធីសាស្ត្របង្រៀន ឬការរៀបចំសកម្មភាពបឋមសិក្សាបានគ្រប់ពេល!',
      time: 'ឥឡូវនេះ',
    },
  ]);

  if (!isOpen) return null;

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    if (newSubject === 'ភាសាខ្មែរ') {
      setSkillDomain('អំណាន');
    } else if (newSubject === 'គណិតវិទ្យា') {
      setSkillDomain('ចំនួន');
    } else {
      setSkillDomain('');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('សូមបញ្ចូលចំណងជើង ឬប្រធានបទមេរៀន');
      return;
    }
    setErrorMsg('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate-primary-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subject,
          skillDomain,
          topic,
          durationMinutes,
          extraContext,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'បរាជ័យក្នុងការបង្កើត');
      }

      const generated = data.lesson;
      const formattedLesson: LessonPlan = {
        id: `ai_lesson_${Date.now()}`,
        title: generated.title || topic,
        subject: generated.subject || subject,
        skillDomain: generated.skillDomain || skillDomain,
        grade: generated.grade || grade,
        unit: generated.unit || (skillDomain ? `បំណិន៖ ${skillDomain}` : 'មេរៀនបឋមសិក្សា'),
        durationMinutes: generated.durationMinutes || 50,
        date: new Date().toISOString().slice(0, 10),
        teacherName: 'លោកគ្រូ/អ្នកគ្រូ',
        schoolName: 'សាលាបឋមសិក្សា...',
        classRoom: 'ថ្នាក់បឋម',
        objectives: generated.objectives || {
          knowledge: 'សិស្សអាចចងចាំ...',
          skills: 'សិស្សអាចអនុវត្ត...',
          attitude: 'សិស្សស្រឡាញ់ការសិក្សា...',
        },
        teachingAids: generated.teachingAids || ['បណ្ណអក្សរ', 'ក្តារខៀន', 'សន្លឹកកិច្ចការ'],
        steps: (generated.steps || []).map((s: any, idx: number) => ({
          id: `step_${Date.now()}_${idx}`,
          stepNumber: s.stepNumber || idx + 1,
          name: s.name || `ជំហានទី ${idx + 1}`,
          durationMinutes: s.durationMinutes || 10,
          teacherActivity: s.teacherActivity || '',
          studentActivity: s.studentActivity || '',
          content: s.content || '',
          teacherKey: s.teacherKey || '',
          verificationNote: s.verificationNote || '',
          isVerified: false,
        })),
        verification: {
          auditorName: 'ប្រធានក្រុមបច្ចេកទេស',
          auditorRole: 'អ្នកផ្ទៀងផ្ទាត់',
          schoolName: 'សាលាបឋមសិក្សា',
          auditDate: new Date().toISOString().slice(0, 10),
          status: 'in_review',
          generalRemarks: `កិច្ចតែងការបឋមសិក្សា ${subject} (${skillDomain ? `បំណិន៖ ${skillDomain}` : ''})`,
          checkedCriteria: {},
        },
        updatedAt: Date.now(),
      };

      onLessonGenerated(formattedLesson);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/teacher-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${userText} (មុខវិជ្ជា៖ ${subject}, បំណិន៖ ${skillDomain || 'ទូទៅ'}, ថ្នាក់ទី៖ ${grade})`,
          grade,
          subject,
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'មិនមានការឆ្លើយតប');
      }
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'សូមអភ័យទោស៖ មិនអាចទទួលចម្លើយពី AI បានទេនៅពេលនេះ។ សូមព្យាយាមម្តងទៀត។',
          time: 'Error',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>ជំនួយការ AI គរុកោសល្យបឋមសិក្សា</span>
                <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                  ថ្នាក់ទី១ ដល់ ទី៦
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                ភាសាខ្មែរ (៤ បំណិន) & គណិតវិទ្យា (៥ បំណិន) · ស្តង់ដារ ៥ ជំហាន (៥០ នាទី)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 border-b border-slate-200 pt-2.5 pb-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'generate'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>បង្កើតកិច្ចតែងការថ្មី</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'chat'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>ប្រឹក្សាគរុកោសល្យ AI</span>
          </button>
        </div>

        {/* Tab 1: Lesson Generator */}
        {activeTab === 'generate' && (
          <form onSubmit={handleGenerate} className="py-3.5 space-y-3.5 overflow-y-auto flex-1 pr-1">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Grade & Subject Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  កម្រិតថ្នាក់ (Primary Grade) *
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ថ្នាក់ទី១">ថ្នាក់ទី ១ (Grade 1)</option>
                  <option value="ថ្នាក់ទី២">ថ្នាក់ទី ២ (Grade 2)</option>
                  <option value="ថ្នាក់ទី៣">ថ្នាក់ទី ៣ (Grade 3)</option>
                  <option value="ថ្នាក់ទី៤">ថ្នាក់ទី ៤ (Grade 4)</option>
                  <option value="ថ្នាក់ទី៥">ថ្នាក់ទី ៥ (Grade 5)</option>
                  <option value="ថ្នាក់ទី៦">ថ្នាក់ទី ៦ (Grade 6)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  មុខវិជ្ជាគោល (Core Subject) *
                </label>
                <select
                  value={subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full p-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ភាសាខ្មែរ">ភាសាខ្មែរ (បំណិនទាំង ៤)</option>
                  <option value="គណិតវិទ្យា">គណិតវិទ្យា (បំណិនទាំង ៥)</option>
                  <option value="វិទ្យាសាស្ត្រ និងការសិក្សាសង្គម">វិទ្យាសាស្ត្រ និងសង្គម</option>
                  <option value="អប់រំកាយ និងកីឡា">អប់រំកាយ និងសុខភាព</option>
                  <option value="សិល្បៈ">សិល្បៈ និងគំនូរ</option>
                </select>
              </div>
            </div>

            {/* Targeted Skill Domain Selector */}
            {subject === 'ភាសាខ្មែរ' && (
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-purple-900">
                    ជ្រើសរើសបំណិនភាសាខ្មែរ (៤ បំណិន) *
                  </label>
                  <span className="text-[10px] text-purple-700 font-semibold">
                    AI នឹងរៀបចំសកម្មភាពឆ្លើយតបនឹងបំណិននេះ
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {KHMER_SKILLS.map((sk) => (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => setSkillDomain(sk.labelKh)}
                      className={`p-2.5 rounded-lg border text-center text-xs font-semibold transition-all ${
                        skillDomain === sk.labelKh
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white border-purple-200 text-purple-900 hover:bg-purple-100/50'
                      }`}
                    >
                      <span className="text-sm block mb-0.5">{sk.icon}</span>
                      <span>{sk.labelKh}</span>
                      <span className="text-[10px] block opacity-75">{sk.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {subject === 'គណិតវិទ្យា' && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-blue-900">
                    ជ្រើសរើសបំណិនគណិតវិទ្យា (៥ វិស័យ) *
                  </label>
                  <span className="text-[10px] text-blue-700 font-semibold">
                    AI នឹងរៀបចំគរុកោសល្យ CPA (វត្ថុពិត-រូបភាព-លេខ)
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {MATH_SKILLS.map((sk) => (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => setSkillDomain(sk.labelKh)}
                      className={`p-2 rounded-lg border text-center text-xs font-semibold transition-all ${
                        skillDomain === sk.labelKh
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white border-blue-200 text-blue-900 hover:bg-blue-100/50'
                      }`}
                    >
                      <span className="text-sm block mb-0.5">{sk.icon}</span>
                      <span className="truncate block">{sk.labelKh}</span>
                      <span className="text-[9px] block opacity-75 truncate">{sk.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Topic Input with Sample Quick Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  ប្រធានបទ ឬចំណងជើងមេរៀន (Lesson Topic) *
                </label>
                {skillDomain && (
                  <span className="text-[11px] text-purple-700 font-semibold">
                    បំណិនដែលបានរើស៖ <strong>{skillDomain}</strong>
                  </span>
                )}
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="ឧ. ព្យញ្ជនៈ ក ផ្សំស្រៈ ឬ ការបូកមានត្រីតុក..."
                className="w-full p-2.5 text-xs sm:text-sm font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />

              {/* Sample Topic Chips */}
              {skillDomain && sampleTopics[skillDomain] && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-medium">ឧទាហរណ៍៖</span>
                  {sampleTopics[skillDomain].map((sTopic, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTopic(sTopic)}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                    >
                      {sTopic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  រយៈពេលសរុប (នាទី)
                </label>
                <input
                  type="number"
                  min={20}
                  max={120}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 50)}
                  className="w-full p-2 text-xs font-semibold border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ស្តង់ដារបឋមសិក្សា
                </label>
                <span className="text-[11px] text-slate-500 block pt-1.5 font-medium">
                  ៥ ជំហាន (៣mn, ៥mn, ២០mn, ១៥mn, ៧mn)
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                បរិបទ ឬតម្រូវការបន្ថែម (Optional Context)
              </label>
              <textarea
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                rows={2}
                placeholder="ឧ. បញ្ចូលល្បែងសិក្សាជាក្រុម, ប្រើប្រាស់សម្ភារគ្រាប់រាប់, ជួយសិស្សរៀនយឺត..."
                className="w-full p-2 text-xs border border-slate-300 rounded-xl resize-none"
              />
              <div className="flex items-center gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setExtraContext((prev) =>
                      prev
                        ? `${prev}, ស្របតាមកញ្ចប់សម្ភារ និងធនធានបឋមសិក្សា PLP MoEYS (plp.moeys.gov.kh)`
                        : 'ស្របតាមកញ្ចប់សម្ភារ និងធនធានបឋមសិក្សា PLP MoEYS (plp.moeys.gov.kh)'
                    )
                  }
                  className="text-[10px] bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded border border-sky-200 transition-colors"
                >
                  + ស្របតាមកញ្ចប់ធនធាន PLP ក្រសួងអប់រំ (plp.moeys.gov.kh)
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                បោះបង់
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI កំពុងរៀបចំកិច្ចតែងការ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>បង្កើតកិច្ចតែងការបឋមសិក្សាដោយ AI</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Teacher Assistant Chat */}
        {activeTab === 'chat' && (
          <div className="py-3 flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-center gap-2 text-xs text-purple-700 bg-white p-2.5 rounded-xl border border-slate-200 w-fit">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI កំពុងរិះគិតចម្លើយ...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="សួរសំណួរគរុកោសល្យបឋមសិក្សា (ឧ. វិធីបង្រៀនសិស្សរៀនយឺតលើបំណិនអំណាន)..."
                className="flex-1 p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
