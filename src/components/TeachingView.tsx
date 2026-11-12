import React, { useState, useEffect } from 'react';
import { LessonPlan } from '../types/lesson';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
} from 'lucide-react';

interface TeachingViewProps {
  lesson: LessonPlan;
}

export const TeachingView: React.FC<TeachingViewProps> = ({ lesson }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTeacherKeyOnScreen, setShowTeacherKeyOnScreen] = useState(false);
  const [classNotes, setClassNotes] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentStep = lesson.steps[currentStepIndex] || lesson.steps[0];
  const stepTargetSeconds = (currentStep?.durationMinutes || 5) * 60;
  const isTimeOver = secondsElapsed > stepTargetSeconds;
  const progressPercent = Math.min(100, Math.round((secondsElapsed / stepTargetSeconds) * 100));

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // When step changes, reset local timer
  const handleSelectStep = (idx: number) => {
    setCurrentStepIndex(idx);
    setSecondsElapsed(0);
    setIsTimerRunning(false);
    setShowTeacherKeyOnScreen(false);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`max-w-6xl mx-auto py-6 px-4 sm:px-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 text-white p-6 overflow-y-auto max-w-none' : ''}`}>
      {/* Top Banner: Mode & Step Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              របៀបបង្រៀនផ្ទាល់ក្នុងថ្នាក់ (LIVE TEACHING MODE)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {lesson.title}
          </h2>
          <p className="text-xs text-slate-500">
            {lesson.subject} {lesson.skillDomain && `(បំណិន៖ ${lesson.skillDomain})`} · {lesson.grade} · {lesson.teacherName} · {lesson.schoolName}
          </p>
        </div>

        {/* Global Lesson Timing Summary */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">គោលដៅមេរៀន</span>
            <span className="text-sm font-bold text-slate-800 tabular-nums">
              {lesson.durationMinutes} នាទី (៥ ជំហាន)
            </span>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title={isFullscreen ? 'ចាកចេញពីពេញអេក្រង់' : 'ពេញអេក្រង់ (Full Screen)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Step Tabs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {lesson.steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          return (
            <button
              key={step.id}
              onClick={() => handleSelectStep(idx)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  ជំហានទី {step.stepNumber}
                </span>
                <span className={`tabular-nums font-semibold ${isActive ? 'text-sky-100' : 'text-sky-700'}`}>
                  {step.durationMinutes}mn
                </span>
              </div>
              <p className="text-xs font-semibold truncate">
                {step.name.split('៖')[1] || step.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Classroom Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step Core Presentation Canvas (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Step Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-sky-700 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                  {currentStep.stepNumber}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {currentStep.name}
                  </h3>
                  <span className="text-xs text-sky-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>រយៈពេលគ្រោងទុក៖ {currentStep.durationMinutes} នាទី</span>
                  </span>
                </div>
              </div>

              {/* Reveal Answers / Teacher Keys Toggle */}
              <button
                onClick={() => setShowTeacherKeyOnScreen(!showTeacherKeyOnScreen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  showTeacherKeyOnScreen
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
                title="លាក់-បង្ហាញ ចម្លើយត្រឹមត្រូវ និងគន្លឹះគ្រូ"
              >
                {showTeacherKeyOnScreen ? <Eye className="w-4 h-4 text-amber-600" /> : <EyeOff className="w-4 h-4" />}
                <span>{showTeacherKeyOnScreen ? 'លាក់ចម្លើយ' : 'បង្ហាញចម្លើយ'}</span>
              </button>
            </div>

            {/* Core Lesson Content for Students */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                ខ្លឹមសារចម្បង (Main Concept)
              </span>
              <p className="text-base sm:text-lg text-slate-900 font-medium whitespace-pre-line leading-relaxed">
                {currentStep.content}
              </p>
            </div>

            {/* Dual Activities: Teacher vs Student */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  <span>សកម្មភាពគ្រូបង្រៀន</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {currentStep.teacherActivity}
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>សកម្មភាពសិស្សានុសិស្ស</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {currentStep.studentActivity}
                </p>
              </div>
            </div>

            {/* Revealed Teacher Key / Solutions */}
            {showTeacherKeyOnScreen && (
              <div className="mt-5 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>គន្លឹះគ្រូ & ចម្លើយត្រឹមត្រូវ (TEACHER KEY & SOLUTION)</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 font-medium whitespace-pre-line leading-relaxed">
                  {currentStep.teacherKey}
                </p>
              </div>
            )}
          </div>

          {/* Step Control Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => handleSelectStep(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ជំហានមុន</span>
            </button>

            <span className="text-xs text-slate-500 font-medium">
              ជំហាន {currentStepIndex + 1} នៃ {lesson.steps.length}
            </span>

            <button
              onClick={() =>
                handleSelectStep(Math.min(lesson.steps.length - 1, currentStepIndex + 1))
              }
              disabled={currentStepIndex === lesson.steps.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
            >
              <span>ជំហានបន្ទាប់</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Live Timer & Classroom Scratchpad */}
        <div className="space-y-6">
          {/* Minutes Timer Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>នាឡិកាវាស់នាទី (STEP TIMER)</span>
              {isTimeOver && (
                <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                  លើសម៉ោងកំណត់!
                </span>
              )}
            </h4>

            {/* Big Digital Clock Display */}
            <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <div
                className={`text-4xl sm:text-5xl font-mono font-bold tracking-tight ${
                  isTimeOver ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {formatTime(secondsElapsed)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                គោលដៅ៖ {formatTime(stepTargetSeconds)} ({currentStep.durationMinutes} នាទី)
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
              <div
                style={{ width: `${progressPercent}%` }}
                className={`h-full transition-all duration-300 ${
                  isTimeOver ? 'bg-rose-500' : progressPercent > 80 ? 'bg-amber-500' : 'bg-sky-600'
                }`}
              />
            </div>

            {/* Timer Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isTimerRunning
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    : 'bg-sky-600 text-white hover:bg-sky-700 shadow-xs'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? 'ផ្អាក' : 'ចាប់ផ្តើម'}</span>
              </button>

              <button
                onClick={() => {
                  setSecondsElapsed(0);
                  setIsTimerRunning(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="កំណត់ឡើងវិញ"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>កំណត់ឡើងវិញ</span>
              </button>

              <button
                onClick={() => setSecondsElapsed((prev) => prev + 60)}
                className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="បន្ថែម ១ នាទី"
              >
                +1 នាទី
              </button>
            </div>
          </div>

          {/* Classroom Scratchpad */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              កំណត់សម្គាល់ពេលបង្រៀន (CLASS NOTES)
            </h4>
            <p className="text-[11px] text-slate-400 mb-2">
              កត់ត្រាឈ្មោះសិស្សឡើងឆ្លើយ ឬចំណុចដែលត្រូវពន្យល់បន្ថែម
            </p>
            <textarea
              value={classNotes}
              onChange={(e) => setClassNotes(e.target.value)}
              placeholder="ឧទាហរណ៍៖ សិស្សឈ្មោះ សុខា ឆ្លើយបានល្អ, ក្រុមទី២ នៅខ្វះការយល់ដឹងលើការបំប្លែងរូបមន្ត..."
              rows={5}
              className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none font-sans"
            />
            {classNotes && (
              <button
                onClick={() => setClassNotes('')}
                className="text-[11px] text-rose-600 hover:underline mt-1"
              >
                សម្អាតកំណត់សម្គាល់
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
