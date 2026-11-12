import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Endpoint: Generate standardized 5-step Lesson Plan for Grades 1-6
 */
app.post('/api/ai/generate-primary-lesson', async (req: Request, res: Response) => {
  try {
    const { grade, subject, skillDomain, topic, durationMinutes = 50, extraContext = '' } = req.body;

    if (!grade || !subject || !topic) {
      res.status(400).json({ error: 'សូមបញ្ជាក់ ថ្នាក់ទី មុខវិជ្ជា និងប្រធានបទមេរៀន' });
      return;
    }

    const systemInstruction = `អ្នកជាអ្នកជំនាញគរុកោសល្យបឋមសិក្សាកម្ពុជា (ថ្នាក់ទី១ ដល់ ថ្នាក់ទី៦) នៃក្រសួងអប់រំ យុវជន និងកីឡា។
ភារកិច្ចរបស់អ្នកគឺរៀបចំកិច្ចតែងការបង្រៀនស្តង់ដារ ៥ ជំហាន (៥០ នាទី) សម្រាប់សិស្សបឋមសិក្សា ដោយផ្អែកលើមុខវិជ្ជា និងបំណិនគោល៖

១. មុខវិជ្ជា ភាសាខ្មែរ (បំណិនទាំង ៤)៖
- អំណាន (Reading)៖ បង្រៀនសូរសព្ទ, ការស្គាល់តួអក្សរ, ការផ្សំប្រកប, ការអានពាក្យ/ល្បះ, អំណានរលូន និងការយល់ន័យ។
- ការស្តាប់ (Listening)៖ ការស្តាប់រឿងនិទាន/សេចក្តីណែនាំ, ការទស្សន៍ទាយមុនពេលស្តាប់, ការឆ្លើយសំណួរការយល់ដឹង។
- ការសរសេរ (Writing)៖ ការគូសវាស, សរសេរតាមអាន, ការតែងល្បះ, ការតែងកថាខណ្ឌពិពណ៌នា ឬសំបុត្រ។
- ការនិយាយ (Speaking)៖ ការសន្ទនាជាដៃគូ, ការរៀបរាប់អំពីរូបភាព, ការឆ្លើយផ្ទាល់មាត់, ការសម្តែងតួ។

២. មុខវិជ្ជា គណិតវិទ្យា (បំណិនទាំង ៥)៖
- ចំនួន (Numbers & Operations)៖ ការរាប់, តម្លៃតាមខ្ទង់, ប្រមាណវិធីបូក ដក គុណ ចែក, ប្រភាគ, ទសភាគ តាមវិធីសាស្ត្រ CPA (វត្ថុពិត -> រូបភាព -> លេខ)។
- រង្វាស់រង្វាល់ (Measurement)៖ ប្រវែង (cm, m), ម៉ាស (g, kg), ចំណុះ (l, ml), ពេលវេលា (ម៉ោង, នាទី), រូបិយវត្ថុ (រៀល)។
- ពីជគណិត (Algebra)៖ លំនាំចំនួន, ទំនាក់ទំនងសមភាព, ការដោះស្រាយប្រអប់ទទេ (□ + a = b)។
- ធរណីមាត្រ (Geometry)៖ រូបធរណីមាត្រ ២ វិមាត្រ និង ៣ វិមាត្រ, បន្ទាត់, មុំ, បរិមាត្រ និងផ្ទៃក្រឡា។
- ស្ថិតិ (Statistics)៖ ការប្រមូលទិន្នន័យ, គំនូសតាងរូបភាព, គំនូសតាងសសរ, តារាងទិន្នន័យ។

កិច្ចតែងការត្រូវមានជំហានទាំង ៥ យ៉ាងច្បាស់លាស់៖
- ជំហានទី១ (៣ នាទី)៖ រដ្ឋបាលថ្នាក់
- ជំហានទី២ (៥ នាទី)៖ រំលឹកមេរៀនចាស់
- ជំហានទី៣ (២០ នាទី)៖ មេរៀនថ្មី (សិស្សស្វែងយល់ ពិសោធ ឬអនុវត្តដោយសម្ភារ)
- ជំហានទី៤ (១៥ នាទី)៖ ពង្រឹងចំណេះដឹង (សិស្សអនុវត្តជាក្រុម ឬបុគ្គល)
- ជំហានទី៥ (៧ នាទី)៖ វាយតម្លៃ និងកិច្ចការផ្ទះ (ឧបករណ៍វាស់វែង)
សរុប = ៥០ នាទី។ ឆ្លើយតបជា JSON ជាភាសាខ្មែរ។`;

    const prompt = `ចូរបង្កើតកិច្ចតែងការបង្រៀនបឋមសិក្សា៖
- ថ្នាក់ទី៖ ${grade}
- មុខវិជ្ជា៖ ${subject}
${skillDomain ? `- បំណិនគោលដែលត្រូវបង្រៀន៖ ${skillDomain}` : ''}
- ប្រធានបទ/ចំណងជើង៖ ${topic}
- រយៈពេល៖ ${durationMinutes} នាទី
- បរិបទបន្ថែម៖ ${extraContext || 'គ្មាន'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            skillDomain: { type: Type.STRING },
            grade: { type: Type.STRING },
            unit: { type: Type.STRING },
            durationMinutes: { type: Type.INTEGER },
            objectives: {
              type: Type.OBJECT,
              properties: {
                knowledge: { type: Type.STRING },
                skills: { type: Type.STRING },
                attitude: { type: Type.STRING },
              },
              required: ['knowledge', 'skills', 'attitude'],
            },
            teachingAids: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  name: { type: Type.STRING },
                  durationMinutes: { type: Type.INTEGER },
                  content: { type: Type.STRING },
                  teacherActivity: { type: Type.STRING },
                  studentActivity: { type: Type.STRING },
                  teacherKey: { type: Type.STRING },
                  verificationNote: { type: Type.STRING },
                },
                required: [
                  'stepNumber',
                  'name',
                  'durationMinutes',
                  'content',
                  'teacherActivity',
                  'studentActivity',
                  'teacherKey',
                  'verificationNote',
                ],
              },
            },
          },
          required: ['title', 'subject', 'grade', 'unit', 'durationMinutes', 'objectives', 'teachingAids', 'steps'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    if (!parsedJson.skillDomain && skillDomain) {
      parsedJson.skillDomain = skillDomain;
    }
    res.json({ success: true, lesson: parsedJson });
  } catch (error: any) {
    console.error('Error generating primary lesson:', error);
    res.status(500).json({
      error: error.message || 'បរាជ័យក្នុងការបង្កើតកិច្ចតែងការដោយ AI',
    });
  }
});

/**
 * Endpoint: Teacher Pedagogical Assistant & Q&A
 */
app.post('/api/ai/teacher-assistant', async (req: Request, res: Response) => {
  try {
    const { message, grade, subject } = req.body;

    if (!message) {
      res.status(400).json({ error: 'សូមបញ្ចូលសំណួរ' });
      return;
    }

    const systemInstruction = `អ្នកជាទីប្រឹក្សាគរុកោសល្យបឋមសិក្សា (ថ្នាក់ទី១ ដល់ ថ្នាក់ទី៦) នៃកម្ពុជា។
ឆ្លើយសំណួរគ្រូបង្រៀនដោយការលើកទឹកចិត្ត ច្បាស់លាស់ ខ្លីខ្លឹម និងស្របតាមសៀវភៅគោល និងគោលការណ៍ក្រសួងអប់រំ។
មុខវិជ្ជា៖ ${subject || 'ទូទៅ'} · ថ្នាក់ទី៖ ${grade || 'ថ្នាក់ទី១ ដល់ ៦'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Error in teacher assistant:', error);
    res.status(500).json({
      error: error.message || 'បរាជ័យក្នុងការឆ្លើយតប',
    });
  }
});

/**
 * Endpoint: Voice-to-Text Transcription via Gemini API
 */
app.post('/api/ai/transcribe-audio', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      res.status(400).json({ error: 'មិនមានទិន្នន័យសំឡេង (Missing audioBase64)' });
      return;
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');

    let transcribedText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: 'ចូរបំប្លែងសំឡេងដែលបានថតនេះទៅជាអត្ថបទភាសាខ្មែរឱ្យបានត្រឹមត្រូវ ច្បាស់លាស់ និងមានក្បៀសចំណុចសមរម្យ។ ចេញតែអត្ថបទដែលបានបំប្លែងប៉ុណ្ណោះ មិនបាច់ពន្យល់អ្វីបន្ថែមឡើយ។',
          },
        ],
      });
      transcribedText = response.text?.trim() || '';
    } catch (transcribeErr) {
      // Fallback model
      const fbResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: 'Please transcribe the spoken audio into accurate Khmer text without any conversational preamble.',
          },
        ],
      });
      transcribedText = fbResponse.text?.trim() || '';
    }

    res.json({ success: true, text: transcribedText });
  } catch (error: any) {
    console.error('Error in voice transcription:', error);
    res.status(500).json({
      error: error.message || 'បរាជ័យក្នុងការបំប្លែងសំឡេងទៅជាអក្សរ',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`KruSmart Server running on http://localhost:${PORT}`);
  });
}

startServer();
