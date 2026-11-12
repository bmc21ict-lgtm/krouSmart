export interface PlpItem {
  id: string;
  category: 'menu' | 'book' | 'examination' | 'homework' | 'video';
  titleKh: string;
  titleEn: string;
  subject: 'ភាសាខ្មែរ' | 'គណិតវិទ្យា' | 'ទូទៅ';
  grade: 'ថ្នាក់ទី១' | 'ថ្នាក់ទី២' | 'ថ្នាក់ទី៣' | 'ថ្នាក់ទី៤' | 'ថ្នាក់ទី៥' | 'ថ្នាក់ទី៦' | 'ទាំងអស់';
  skillOrStrand?: string; // ឧ. អំណាន, ការសរសេរ, ចំនួន, ធរណីមាត្រ
  descriptionKh: string;
  officialUrl: string;
  referenceCode?: string;
  sampleContent?: {
    lessonTitle?: string;
    objectiveSummary?: string;
    exercisesOrQuestions?: string[];
    homeworkPrompt?: string;
    teacherGuideSnippet?: string;
  };
}

export interface PlpPortalSection {
  key: 'menu' | 'book' | 'examination' | 'homework' | 'video';
  titleKh: string;
  titleEn: string;
  description: string;
  icon: string;
  officialUrl: string;
  accentColor: string;
}

export const PLP_PORTAL_SECTIONS: PlpPortalSection[] = [
  {
    key: 'menu',
    titleKh: 'មាតិកា និងកម្មវិធីសិក្សា',
    titleEn: 'Curriculum & Lesson Menu',
    description: 'ផែនការបង្រៀនប្រចាំឆ្នាំ ប្រចាំឆមាស និងតារាងបែងចែកម៉ោងសិក្សាតាមសប្តាហ៍ សម្រាប់ថ្នាក់ទី១ ដល់ទី៦។',
    icon: 'Menu',
    officialUrl: 'https://plp.moeys.gov.kh/menu',
    accentColor: 'from-blue-600 to-indigo-600',
  },
  {
    key: 'book',
    titleKh: 'សៀវភៅពុម្ព & ជំនួយស្មារតីគ្រូ',
    titleEn: 'Textbooks & Teacher Guides',
    description: 'សៀវភៅជំនួយគ្រូ សៀវភៅសិក្សាគោលសិស្ស ភាសាខ្មែរ និងគណិតវិទ្យា របស់ក្រសួងអប់រំ យុវជន និងកីឡា។',
    icon: 'BookOpen',
    officialUrl: 'https://plp.moeys.gov.kh/book',
    accentColor: 'from-emerald-600 to-teal-600',
  },
  {
    key: 'examination',
    titleKh: 'វិញ្ញាសា & ការវាយតម្លៃ',
    titleEn: 'Examinations & Assessments',
    description: 'សំណុំវិញ្ញាសាតេស្តរោគវិនិច្ឆ័យ (Diagnostic Test), តេស្តប្រចាំខែ, ឆមាស និងការវាយតម្លៃលទ្ធផលសិក្សា EGRA/EGMA។',
    icon: 'FileCheck',
    officialUrl: 'https://plp.moeys.gov.kh/examination',
    accentColor: 'from-amber-600 to-orange-600',
  },
  {
    key: 'homework',
    titleKh: 'កិច្ចការផ្ទះ & សន្លឹកលំហាត់',
    titleEn: 'Homework & Practice Worksheets',
    description: 'សន្លឹកកិច្ចការផ្ទះ វិញ្ញាសាអនុវត្តដោយខ្លួនឯងសម្រាប់ជំហានទី៥ នៃកិច្ចតែងការបង្រៀន ដើម្បីពង្រឹងការចងចាំសិស្ស។',
    icon: 'ClipboardList',
    officialUrl: 'https://plp.moeys.gov.kh/homework',
    accentColor: 'from-purple-600 to-pink-600',
  },
  {
    key: 'video',
    titleKh: 'វីដេអូបង្រៀនគំរូ',
    titleEn: 'Model Teaching Videos',
    description: 'វីដេអូបង្ហាញពីវិធីសាស្ត្របង្រៀនគរុកោសល្យជាក់ស្តែងក្នុងថ្នាក់ របស់គ្រូបង្រៀនឆ្នើម និងគ្រូបង្គោលជាតិ។',
    icon: 'Video',
    officialUrl: 'https://plp.moeys.gov.kh/video',
    accentColor: 'from-rose-600 to-red-600',
  },
];

export const PLP_CURATED_RESOURCES: PlpItem[] = [
  // --- MENU / CURRICULUM ---
  {
    id: 'plp_menu_kh_g1',
    category: 'menu',
    titleKh: 'តារាងបែងចែកកម្មវិធីសិក្សាភាសាខ្មែរ ថ្នាក់ទី១ (បំណិនទាំង៤)',
    titleEn: 'Khmer Grade 1 Curriculum Distribution Matrix (4 Skills)',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី១',
    skillOrStrand: 'អំណាន និងការសរសេរ',
    descriptionKh: 'បែងចែក ៣៣ សប្តាហ៍៖ ព្យញ្ជនៈ ៣៣ តួ, ស្រៈនិស្ស័យ ២៣ តួ, ព្យញ្ជនៈផ្ញើជើង និងអត្ថបទអំណានខ្លីៗ។',
    officialUrl: 'https://plp.moeys.gov.kh/menu',
    referenceCode: 'PLP-MENU-KH-G1',
    sampleContent: {
      lessonTitle: 'ភាសាខ្មែរ ថ្នាក់ទី១៖ មាតិកាអំណានថ្នាក់ដំបូង',
      objectiveSummary: 'កំណត់លំដាប់លំដោយនៃការបង្រៀនសូរសព្ទ និងតួអក្សរស្របតាមប្រតិទិនសិក្សាផ្លូវការ',
      teacherGuideSnippet: 'សប្តាហ៍ទី១-ទី៨៖ ព្យញ្ជនៈពួក អ (ក ខ ច ឆ...), សប្តាហ៍ទី៩-១៦៖ ស្រៈនិស្ស័យ និងការផ្សំប្រកប',
    },
  },
  {
    id: 'plp_menu_math_g2',
    category: 'menu',
    titleKh: 'ផែនការបង្រៀនគណិតវិទ្យា ថ្នាក់ទី២ តាមបំណិនទាំង៥',
    titleEn: 'Math Grade 2 Curriculum Plan by 5 Strands',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី២',
    skillOrStrand: 'ចំនួន និងរង្វាស់រង្វាល់',
    descriptionKh: 'តារាងបែងចែកម៉ោងសិក្សាគណិតវិទ្យា ថ្នាក់ទី២ លើបំណិនចំនួនដល់ ១០០០, ប្រមាណវិធីបូកដកមានត្រាទុក និងប្រវែង។',
    officialUrl: 'https://plp.moeys.gov.kh/menu',
    referenceCode: 'PLP-MENU-MATH-G2',
    sampleContent: {
      lessonTitle: 'គណិតវិទ្យា ថ្នាក់ទី២៖ មាតិកាចំនួនដល់ ១០០០',
      objectiveSummary: 'បង្រៀនពីចំនួន ខ្ទង់រាយ ខ្ទង់ដប់ ខ្ទង់រយ និងប្រមាណវិធីតាមកាលវិភាគ',
    },
  },
  {
    id: 'plp_menu_kh_g4',
    category: 'menu',
    titleKh: 'កម្មវិធីសិក្សាភាសាខ្មែរ ថ្នាក់ទី៤ (វេយ្យាករណ៍ និងការតែងសេចក្តី)',
    titleEn: 'Khmer Grade 4 Curriculum (Grammar & Composition)',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី៤',
    skillOrStrand: 'ការសរសេរ និងការនិយាយ',
    descriptionKh: 'កម្មវិធីលម្អិតសម្រាប់ការសរសេរតែងសេចក្តីពណ៌នា វេយ្យាករណ៍នាម កិរិយាសព្ទ និងការអានយល់ន័យ។',
    officialUrl: 'https://plp.moeys.gov.kh/menu',
    referenceCode: 'PLP-MENU-KH-G4',
  },

  // --- BOOKS & TEACHER GUIDES ---
  {
    id: 'plp_book_kh_g1_tg',
    category: 'book',
    titleKh: 'សៀវភៅណែនាំគ្រូ ភាសាខ្មែរ ថ្នាក់ទី១ (កញ្ចប់អំណានថ្នាក់ដំបូង)',
    titleEn: 'Khmer Grade 1 Teacher Guide (Early Grade Reading Package)',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី១',
    skillOrStrand: 'អំណាន',
    descriptionKh: 'សៀវភៅណែនាំគ្រូបង្រៀនលម្អិតគ្រប់ម៉ោង វិធីសាស្ត្របង្រៀន ៥ សមាសភាគអំណាន និងកាយវិការដៃ។',
    officialUrl: 'https://plp.moeys.gov.kh/book',
    referenceCode: 'PLP-BK-KH-G1-TG',
    sampleContent: {
      lessonTitle: 'មេរៀនព្យញ្ជនៈ "ក" (ម៉ោងទី១)',
      teacherGuideSnippet: 'ជំហានទី១៖ គ្រូធ្វើកាយវិការដៃទះដៃពេលឮសូរ /k/។ ជំហានទី២៖ បង្ហាញបណ្ណអក្សរ "ក" និងរូបមាន់គក។ ជំហានទី៣៖ សរសេរអក្សរ "ក" លើខ្យល់។',
      homeworkPrompt: 'ឱ្យសិស្សរកពាក្យដែលមានសូរ "ក" ចំនួន ៣ ពាក្យនៅផ្ទះជាមួយមាតាបិតា។',
    },
  },
  {
    id: 'plp_book_math_g1_tg',
    category: 'book',
    titleKh: 'សៀវភៅណែនាំគ្រូ គណិតវិទ្យា ថ្នាក់ទី១ (វិធីសាស្ត្រ CPA)',
    titleEn: 'Math Grade 1 Teacher Guide (CPA Concrete-Pictorial-Abstract)',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី១',
    skillOrStrand: 'ចំនួន',
    descriptionKh: 'ការប្រើប្រាស់សម្ភាររាប់ជាក់ស្តែង (គ្រាប់ក្រួស ឈើគូស ដុំឡូស៊ីកូ) រូបភាពតំណាង និងនិមិត្តសញ្ញាលេខ។',
    officialUrl: 'https://plp.moeys.gov.kh/book',
    referenceCode: 'PLP-BK-MATH-G1-TG',
    sampleContent: {
      lessonTitle: 'ការបូកចំនួនត្រឹម ១០ ដោយប្រើវត្ថុជាក់ស្តែង',
      teacherGuideSnippet: 'ដាក់បំពង់បឺត ៣ ដើម ថែម ២ ដើមទៀត។ ឱ្យសិស្សរាប់រួមគ្នា៖ ១, ២, ៣, ៤, ៥។ បង្ហាញកាតលេខ 3 + 2 = 5។',
      homeworkPrompt: 'គូររូបផ្លែឈើ ៤ ផ្លែ បូកនឹង ២ ផ្លែទៀត ហើយសរសេរផលបូក។',
    },
  },
  {
    id: 'plp_book_kh_g3_tb',
    category: 'book',
    titleKh: 'សៀវភៅសិក្សាគោល ភាសាខ្មែរ ថ្នាក់ទី៣ (សៀវភៅសិស្ស)',
    titleEn: 'Khmer Grade 3 Student Textbook',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី៣',
    skillOrStrand: 'អំណាន និងការយល់ន័យ',
    descriptionKh: 'មេរៀនអត្ថបទអំណាន រឿងនិទានប្រជាប្រិយ កំណាព្យអប់រំ និងសំណួរស្វែងយល់ខ្លឹមសារ។',
    officialUrl: 'https://plp.moeys.gov.kh/book',
    referenceCode: 'PLP-BK-KH-G3-ST',
  },
  {
    id: 'plp_book_math_g5_tb',
    category: 'book',
    titleKh: 'សៀវភៅសិក្សាគោល គណិតវិទ្យា ថ្នាក់ទី៥',
    titleEn: 'Math Grade 5 Student Textbook',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី៥',
    skillOrStrand: 'ពីជគណិត និងធរណីមាត្រ',
    descriptionKh: 'មេរៀនប្រភាគ ចំនួនទសភាគ ផ្ទៃក្រឡា និងបរិមាត្ររាងធរណីមាត្រ (ចតុកោណកែង ត្រីកោណ)។',
    officialUrl: 'https://plp.moeys.gov.kh/book',
    referenceCode: 'PLP-BK-MATH-G5-ST',
  },

  // --- EXAMINATIONS & ASSESSMENTS ---
  {
    id: 'plp_exam_kh_g1_egra',
    category: 'examination',
    titleKh: 'កញ្ចប់តេស្តរោគវិនិច្ឆ័យអំណាន EGRA ថ្នាក់ទី១ (ដើមឆ្នាំ និងចុងឆមាស)',
    titleEn: 'EGRA Early Grade Reading Assessment Tool Grade 1',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី១',
    skillOrStrand: 'អំណាន',
    descriptionKh: 'ឧបករណ៍វាស់ស្ទង់សមត្ថភាពអាន៖ ការស្គាល់សូរអក្សរ, ការអានព្យាង្គមិនមានន័យ, ការអានពាក្យក្នុងរយៈពេល ១ នាទី។',
    officialUrl: 'https://plp.moeys.gov.kh/examination',
    referenceCode: 'PLP-EXAM-EGRA-G1',
    sampleContent: {
      lessonTitle: 'តេស្តវាស់ស្ទង់ការស្គាល់តួអក្សរ និងការអានពាក្យ',
      exercisesOrQuestions: [
        '១. ចូរអានតួអក្សរខាងក្រោមក្នុងពេល ៦០ វិនាទី៖ ក ច ដ ត ប ខ ឆ ឋ',
        '២. ចូរអានពាក្យផ្សំស្រៈ៖ កា ចា ដា បា កី ចី',
        '៣. ចូរផ្គូផ្គងរូបភាពជាមួយពាក្យដែលត្រូវគ្នា (គោ មាន់ កង្កែប)',
      ],
      teacherGuideSnippet: 'កត់ត្រាចំនួនតួអក្សរត្រឹមត្រូវក្នុង ១ នាទី។ ប្រសិនបើសិស្សអានមិនបាន ៥ តួជាប់គ្នា សូមបញ្ឈប់តេស្តដោយថ្នមៗ។',
    },
  },
  {
    id: 'plp_exam_math_g2_monthly',
    category: 'examination',
    titleKh: 'វិញ្ញាសាគណិតវិទ្យាប្រចាំខែ ថ្នាក់ទី២ (ប្រមាណវិធីបូកដកត្រឹម ១០០)',
    titleEn: 'Math Grade 2 Monthly Assessment Test (Addition & Subtraction within 100)',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី២',
    skillOrStrand: 'ចំនួន',
    descriptionKh: 'វិញ្ញាសាវាស់ស្ទង់ការគិតលេខក្នុងចិត្ត ការបូកដកមានត្រាទុក និងចំណោទបញ្ហាជាក់ស្តែងក្នុងជីវភាព។',
    officialUrl: 'https://plp.moeys.gov.kh/examination',
    referenceCode: 'PLP-EXAM-MATH-G2',
    sampleContent: {
      lessonTitle: 'ការប្រឡងប្រចាំខែ៖ ប្រមាណវិធីបូកដក និងចំណោទ',
      exercisesOrQuestions: [
        '១. គណនាផលបូក៖ ៤៧ + ៣៥ = ?',
        '២. គណនាផលដក៖ ៨២ - ៣៨ = ?',
        '៣. ចំណោទ៖ ក្នុងថ្នាក់រៀនមានសិស្សប្រុស ២៤ នាក់ និងសិស្សស្រី ១៩ នាក់។ តើក្នុងថ្នាក់នោះមានសិស្សសរុបប៉ុន្មាននាក់?',
      ],
    },
  },
  {
    id: 'plp_exam_kh_g6_semester',
    category: 'examination',
    titleKh: 'វិញ្ញាសាភាសាខ្មែរប្រឡងឆមាស ថ្នាក់ទី៦ (តែងសេចក្តី និងវេយ្យាករណ៍)',
    titleEn: 'Khmer Grade 6 Semester Examination (Composition & Grammar)',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី៦',
    skillOrStrand: 'ការសរសេរ',
    descriptionKh: 'វិញ្ញាសាត្រៀមប្រឡងបញ្ចប់បឋមសិក្សា៖ អត្ថបទអានយល់ន័យ ពន្យល់ពាក្យ វេយ្យាករណ៍ និងប្រធានតែងសេចក្តីពណ៌នា។',
    officialUrl: 'https://plp.moeys.gov.kh/examination',
    referenceCode: 'PLP-EXAM-KH-G6',
    sampleContent: {
      lessonTitle: 'វិញ្ញាសាឆមាសទី១ ភាសាខ្មែរ ថ្នាក់ទី៦',
      exercisesOrQuestions: [
        '១. ពន្យល់ពាក្យ៖ "បរិស្ថាន", "សាមគ្គីភាព", "គរុកោសល្យ"',
        '២. រកប្រភេទពាក្យនៃពាក្យគូសបន្ទាត់ក្រោមក្នុងល្បះ',
        '៣. ប្រធានតែងសេចក្តី៖ ចូរពណ៌នាអំពីទិដ្ឋភាពសាលារៀនរបស់អ្នកនៅពេលព្រឹកព្រលឹម។',
      ],
    },
  },

  // --- HOMEWORK & WORKSHEETS ---
  {
    id: 'plp_hw_kh_g1_consonants',
    category: 'homework',
    titleKh: 'សន្លឹកកិច្ចការផ្ទះ៖ សរសេរតាមគន្លងព្យញ្ជនៈ និងគូររូប (ថ្នាក់ទី១)',
    titleEn: 'Homework Worksheet: Consonant Tracing & Drawing (Grade 1)',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី១',
    skillOrStrand: 'ការសរសេរ',
    descriptionKh: 'កិច្ចការផ្ទះសម្រាប់ជំហានទី៥៖ ឱ្យសិស្សហាត់សរសេរតាមគន្លងអក្សរ "ក" "ខ" និងគូររូបភាពសត្វមាន់គក។',
    officialUrl: 'https://plp.moeys.gov.kh/homework',
    referenceCode: 'PLP-HW-KH-G1',
    sampleContent: {
      lessonTitle: 'កិច្ចការផ្ទះអក្សរ "ក"',
      homeworkPrompt: '១. ហាត់សរសេរតួអក្សរ "ក" ឱ្យបាន ៥ ជួរក្នុងសៀវភៅកិច្ចការផ្ទះ។ ២. គូររូបវត្ថុ ឬសត្វដែលចាប់ផ្តើមដោយសូរ "ក" ចំនួន ១ រូប។',
      exercisesOrQuestions: [
        'សរសេរតួអក្សរ ក ក ក ក ក',
        'គូសរង្វង់ជុំវិញពាក្យដែលមានអក្សរ ក (ក្អែក, មាន់, កូន)',
      ],
    },
  },
  {
    id: 'plp_hw_math_g1_addition',
    category: 'homework',
    titleKh: 'សន្លឹកកិច្ចការផ្ទះ៖ ការបូកលេខរូបភាពត្រឹម ១០ (ថ្នាក់ទី១)',
    titleEn: 'Homework Worksheet: Pictorial Addition within 10 (Grade 1)',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី១',
    skillOrStrand: 'ចំនួន',
    descriptionKh: 'លំហាត់បូកលេខដោយរាប់រូបភាពផ្លែឈើ និងសត្វ រួចសរសេរលេខក្នុងប្រអប់ទទេ។',
    officialUrl: 'https://plp.moeys.gov.kh/homework',
    referenceCode: 'PLP-HW-MATH-G1',
    sampleContent: {
      lessonTitle: 'កិច្ចការផ្ទះ៖ ការបូកត្រឹម ១០',
      homeworkPrompt: 'ធ្វើលំហាត់បូកចំនួន ៤ ក្នុងសៀវភៅសិស្សទំព័រ ២៥ និងឱ្យឪពុកម្តាយជួយពិនិត្យចុះហត្ថលេខា។',
      exercisesOrQuestions: [
        '៣ + ៤ = [  ]',
        '៥ + ២ = [  ]',
        '៦ + ៣ = [  ]',
        '១ + ៨ = [  ]',
      ],
    },
  },
  {
    id: 'plp_hw_math_g3_multiplication',
    category: 'homework',
    titleKh: 'សន្លឹកកិច្ចការផ្ទះ៖ មេគុណ ២ ដល់ ៥ និងចំណោទខ្លី (ថ្នាក់ទី៣)',
    titleEn: 'Homework Worksheet: Times Table 2-5 & Short Word Problems (Grade 3)',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី៣',
    skillOrStrand: 'ចំនួន',
    descriptionKh: 'កិច្ចការផ្ទះទន្ទេញមេលេខ និងអនុវត្តចំណោទគុណជាក់ស្តែងក្នុងជីវភាពប្រចាំថ្ងៃ។',
    officialUrl: 'https://plp.moeys.gov.kh/homework',
    referenceCode: 'PLP-HW-MATH-G3',
    sampleContent: {
      lessonTitle: 'កិច្ចការផ្ទះ៖ ប្រមាណវិធីគុណមេ ៣ និង ៤',
      homeworkPrompt: 'បំពេញតារាងមេគុណ និងដោះស្រាយចំណោទ ១ ក្នុងទំព័រ ៤២។',
      exercisesOrQuestions: [
        '៣ x ៦ = ?',
        '៤ x ៧ = ?',
        'ចំណោទ៖ កន្ត្រកមួយមានក្រូច ៥ ផ្លែ។ តើ ៤ កន្ត្រកមានក្រូចសរុបប៉ុន្មានផ្លែ?',
      ],
    },
  },

  // --- VIDEOS ---
  {
    id: 'plp_vid_kh_early_reading',
    category: 'video',
    titleKh: 'វីដេអូបង្រៀនគំរូ៖ វិធីសាស្ត្របង្រៀនអំណានថ្នាក់ដំបូង ៥ ជំហាន',
    titleEn: 'Model Video: 5-Step Early Grade Reading Methodology',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី១',
    skillOrStrand: 'អំណាន',
    descriptionKh: 'វីដេអូបង្ហាញពីសកម្មភាពជាក់ស្តែងក្នុងថ្នាក់រៀន៖ ការធ្វើកាយវិការដៃ ការអានរួមគ្នា និងការប្រើប្រាស់បណ្ណអក្សររូបភាព។',
    officialUrl: 'https://plp.moeys.gov.kh/video',
    referenceCode: 'PLP-VID-KH-G1',
    sampleContent: {
      lessonTitle: 'វីដេអូគំរូអំណានថ្នាក់ទី១ (ក្រសួងអប់រំ)',
      teacherGuideSnippet: 'ចំណុចគន្លឹះក្នុងវីដេអូ៖ គ្រូមិននិយាយច្រើនពេកទេ គឺទុកពេល ៦០% ឱ្យសិស្សបានបញ្ចេញសូរ និងអនុវត្តដោយដៃផ្ទាល់។',
    },
  },
  {
    id: 'plp_vid_math_cpa_demo',
    category: 'video',
    titleKh: 'វីដេអូបង្រៀនគំរូ៖ ការបង្រៀនគណិតវិទ្យាថ្នាក់ដំបូងតាមវិធី CPA',
    titleEn: 'Model Video: Early Grade Mathematics Teaching via CPA Model',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី១',
    skillOrStrand: 'ចំនួន',
    descriptionKh: 'ការណែនាំពីរបៀបរៀបចំសម្ភាររាប់ក្នុងមូលដ្ឋាន (គម្របដប គ្រាប់ក្រួស បំពង់បឺត) និងការបម្លែងទៅជារូបភាព និងលេខ។',
    officialUrl: 'https://plp.moeys.gov.kh/video',
    referenceCode: 'PLP-VID-MATH-G1',
    sampleContent: {
      lessonTitle: 'វីដេអូគំរូគណិតវិទ្យា CPA (ក្រសួងអប់រំ)',
      teacherGuideSnippet: 'ចំណុចគន្លឹះក្នុងវីដេអូ៖ ឱ្យសិស្សកាន់វត្ថុពិតរាប់ជាមុនសិន មុននឹងសរសេរលេខលើក្តារខៀន ដើម្បីកុំឱ្យសិស្សទន្ទេញចាំមាត់ដោយមិនយល់។',
    },
  },
  {
    id: 'plp_vid_kh_interactive_g4',
    category: 'video',
    titleKh: 'វីដេអូបង្រៀនគំរូ៖ ការបង្រៀនតែងសេចក្តីពណ៌នា ថ្នាក់ទី៤',
    titleEn: 'Model Video: Descriptive Composition Writing Grade 4',
    subject: 'ភាសាខ្មែរ',
    grade: 'ថ្នាក់ទី៤',
    skillOrStrand: 'ការសរសេរ',
    descriptionKh: 'ការណែនាំសិស្សឱ្យចេះប្រើអារម្មណ៍ទាំង៥ ក្នុងការសង្កេត និងជ្រើសរើសគុណនាមពណ៌នាឱ្យមានជីវិត។',
    officialUrl: 'https://plp.moeys.gov.kh/video',
    referenceCode: 'PLP-VID-KH-G4',
  },
];
