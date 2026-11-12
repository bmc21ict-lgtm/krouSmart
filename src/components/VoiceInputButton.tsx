import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Check, AlertCircle } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: string; // 'km-KH' by default
  className?: string;
  fieldLabel?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  language = 'km-KH',
  className = '',
  fieldLabel = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState('');
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllRecording();
    };
  }, []);

  const stopAllRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
  };

  const startRecording = async () => {
    setErrorMessage('');
    setTranscriptPreview('');
    setRecordSeconds(0);
    setIsRecording(true);

    // Timer
    timerRef.current = setInterval(() => {
      setRecordSeconds((prev) => prev + 1);
    }, 1000);

    let webSpeechStarted = false;

    // 1. Try Browser Web Speech API for instantaneous real-time transcription
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setTranscriptPreview(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
        };

        recognition.onend = () => {
          // If ended naturally while still flagged recording, allow stopping
        };

        recognition.start();
        recognitionRef.current = recognition;
        webSpeechStarted = true;
      } catch (e) {
        console.warn('Web Speech API start error, fallback to audio recording:', e);
      }
    }

    // 2. Also start MediaRecorder as reliable audio capture for Gemini AI transcription
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
    } catch (err: any) {
      console.warn('Microphone stream error:', err);
      if (!webSpeechStarted) {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setErrorMessage('មិនអាចបើកមីក្រូហ្វូនបានទេ សូមអនុញ្ញាតសិទ្ធិប្រើប្រាស់ Microphone');
      }
    }
  };

  const stopAndApply = async () => {
    if (!isRecording) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    // Stop Web Speech
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // If we have live transcript preview from Web Speech, use it directly!
    if (transcriptPreview.trim()) {
      onTranscript(transcriptPreview.trim());
      setTranscriptPreview('');
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
      return;
    }

    // Otherwise, process audio chunk with Gemini AI transcription endpoint
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsProcessing(true);
      mediaRecorderRef.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorderRef.current?.mimeType || 'audio/webm',
          });
          mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());

          if (audioBlob.size < 1000) {
            setIsProcessing(false);
            return;
          }

          // Convert to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            try {
              const res = await fetch('/api/ai/transcribe-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioBase64: base64Audio,
                  mimeType: audioBlob.type || 'audio/webm',
                }),
              });
              const data = await res.json();
              if (data.success && data.text) {
                onTranscript(data.text);
              } else {
                setErrorMessage(data.error || 'មិនអាចចាប់សំឡេងបានទេ សូមសាកល្បងម្តងទៀត');
              }
            } catch (err: any) {
              setErrorMessage('កំហុសក្នុងការតភ្ជាប់ប្រព័ន្ធបំប្លែងសំឡេង');
            } finally {
              setIsProcessing(false);
            }
          };
        } catch (e) {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    stopAllRecording();
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsProcessing(false);
    setTranscriptPreview('');
    setRecordSeconds(0);
  };

  const formatSecs = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {!isRecording && !isProcessing && (
        <button
          type="button"
          onClick={startRecording}
          title={`ចុចនិយាយបញ្ចូលក្នុង ${fieldLabel || 'ប្រអប់នេះ'}`}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors cursor-pointer"
        >
          <Mic className="w-3.5 h-3.5 text-purple-600" />
          <span>និយាយ (Voice)</span>
        </button>
      )}

      {/* Active Recording State */}
      {isRecording && (
        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2 py-1 rounded-md text-xs font-semibold text-rose-800 shadow-xs animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span className="font-mono tabular-nums text-[11px]">{formatSecs(recordSeconds)}</span>

          <button
            type="button"
            onClick={stopAndApply}
            className="flex items-center gap-1 px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold cursor-pointer transition-colors"
            title="បញ្ចប់ និងបញ្ចូលអត្ថបទ"
          >
            <Check className="w-3 h-3" />
            <span>រួចរាល់</span>
          </button>

          <button
            type="button"
            onClick={cancelRecording}
            className="text-rose-500 hover:text-rose-700 px-1 text-xs"
            title="បោះបង់"
          >
            &times;
          </button>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md text-xs text-purple-700">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="text-[11px] font-semibold">AI កំពុងបំប្លែងសំឡេង...</span>
        </div>
      )}

      {/* Error Tooltip */}
      {errorMessage && (
        <div className="absolute left-0 top-full mt-1 z-30 p-2 bg-rose-900 text-white text-[11px] rounded-lg shadow-lg flex items-center gap-1 whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 text-rose-300 shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="ml-1 text-white hover:text-rose-200"
          >
            &times;
          </button>
        </div>
      )}

      {/* Live transcript bubble while speaking */}
      {isRecording && transcriptPreview && (
        <div className="absolute right-0 top-full mt-1 z-30 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg max-w-xs leading-snug">
          <span className="text-purple-300 font-semibold block text-[10px] mb-0.5">កំពុងស្តាប់៖</span>
          <p className="line-clamp-2">{transcriptPreview}</p>
        </div>
      )}
    </div>
  );
};
