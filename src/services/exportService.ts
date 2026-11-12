import * as XLSX from 'xlsx';
import { LessonPlan } from '../types/lesson';
import { VERIFICATION_CRITERIA_LIST } from '../data/defaultLessons';

export const exportService = {
  /**
   * Export lesson plan to XLSX with multiple structured worksheets
   */
  exportToXlsx(lesson: LessonPlan): void {
    const wb = XLSX.utils.book_new();

    // 1. Main Sheet: Lesson Details & Steps
    const lessonInfo = [
      ['ព្រះរាជាណាចក្រកម្ពុជា', '', '', '', '', 'ជាតិ សាសនា ព្រះមហាក្សត្រ'],
      ['កិច្ចតែងការបង្រៀន (LESSON PLAN)', '', '', '', '', ''],
      [''],
      ['មុខវិជ្ជា (Subject):', `${lesson.subject}${lesson.skillDomain ? ` (បំណិន៖ ${lesson.skillDomain})` : ''}`, 'ថ្នាក់ទី (Grade):', lesson.grade, 'កាលបរិច្ឆេទ (Date):', lesson.date],
      ['ចំណងជើង (Title):', lesson.title, 'ជំពូក (Unit):', lesson.unit, 'រយៈពេលសរុប (Duration):', `${lesson.durationMinutes} នាទី (min)`],
      ['ឈ្មោះគ្រូបង្រៀន (Teacher):', lesson.teacherName, 'សាលារៀន (School):', lesson.schoolName, 'បន្ទប់រៀន (Room):', lesson.classRoom],
      [''],
      ['--- វត្ថុបំណងមេរៀន (OBJECTIVES) ---'],
      ['វិជ្ជាសម្បទា (Knowledge):', lesson.objectives.knowledge],
      ['បំណិនសម្បទា (Skills):', lesson.objectives.skills],
      ['ចរិយាសម្បទា (Attitude):', lesson.objectives.attitude],
      [''],
      ['សម្ភារឧបទេស (Teaching Aids):', lesson.teachingAids.join(', ')],
      [''],
      ['--- ជំហានបង្រៀនទាំង៥ និងបំណែងចែកនាទី (5-STEP LESSON DELIVERY) ---'],
      [
        'ជំហាន (Step)',
        'ឈ្មោះជំហាន (Step Name)',
        'នាទី (Minutes)',
        'ខ្លឹមសារមេរៀន (Content)',
        'សកម្មភាពគ្រូ (Teacher Activity)',
        'សកម្មភាពសិស្ស (Student Activity)',
        'គន្លឹះគ្រូ & ចម្លើយ (Teacher Key / Solutions)',
        'ចំណុចផ្ទៀងផ្ទាត់ (Verification Note)',
        'បានផ្ទៀងផ្ទាត់ (Verified)',
      ],
    ];

    // Append steps
    lesson.steps.forEach((step) => {
      lessonInfo.push([
        `ជំហានទី ${step.stepNumber}`,
        step.name,
        step.durationMinutes.toString(),
        step.content,
        step.teacherActivity,
        step.studentActivity,
        step.teacherKey,
        step.verificationNote,
        step.isVerified ? 'ត្រឹមត្រូវ (Yes)' : 'មិនទាន់ (No)',
      ]);
    });

    const wsLesson = XLSX.utils.aoa_to_sheet(lessonInfo);
    // Auto column widths
    wsLesson['!cols'] = [
      { wch: 14 },
      { wch: 28 },
      { wch: 14 },
      { wch: 32 },
      { wch: 35 },
      { wch: 35 },
      { wch: 32 },
      { wch: 28 },
      { wch: 16 },
    ];
    XLSX.utils.book_append_sheet(wb, wsLesson, 'កិច្ចតែងការបង្រៀន');

    // 2. Sheet 2: Minutes Breakdown & Timing Audit
    const totalMinutes = lesson.steps.reduce((sum, s) => sum + s.durationMinutes, 0);
    const timingData = [
      ['តារាងវិភាគបំណែងចែកពេលវេលា (នាទី) - KruSmart'],
      [''],
      ['ជំហាន (Step)', 'នាទី (Minutes)', 'ភាគរយ (%)', 'គោលការណ៍គរុកោសល្យ (Standard Benchmark)'],
    ];

    lesson.steps.forEach((step) => {
      const pct = totalMinutes > 0 ? Math.round((step.durationMinutes / totalMinutes) * 100) : 0;
      let benchmark = '';
      if (step.stepNumber === 1) benchmark = '៣ - ៥ នាទី (រដ្ឋបាលថ្នាក់ និងវិន័យ)';
      else if (step.stepNumber === 2) benchmark = '៥ នាទី (ភ្ជាប់មេរៀនចាស់)';
      else if (step.stepNumber === 3) benchmark = '១៥ - ២០ នាទី (មេរៀនថ្មី & ស្វែងយល់)';
      else if (step.stepNumber === 4) benchmark = '១២ - ១៥ នាទី (សិស្សអនុវត្តជាបុគ្គល/ក្រុម)';
      else if (step.stepNumber === 5) benchmark = '៥ - ៧ នាទី (វាយតម្លៃ & កិច្ចការផ្ទះ)';

      timingData.push([
        `ជំហានទី ${step.stepNumber}: ${step.name}`,
        step.durationMinutes.toString(),
        `${pct}%`,
        benchmark,
      ]);
    });
    timingData.push(['សរុប (Total)', totalMinutes.toString(), '100%', '៥០ នាទី (Standard 50mn)']);

    const wsTiming = XLSX.utils.aoa_to_sheet(timingData);
    wsTiming['!cols'] = [{ wch: 35 }, { wch: 16 }, { wch: 14 }, { wch: 38 }];
    XLSX.utils.book_append_sheet(wb, wsTiming, 'បំណែងចែកនាទី');

    // 3. Sheet 3: Verification & Quality Audit
    const verificationData = [
      ['តារាងផ្ទៀងផ្ទាត់គរុកោសល្យ និងការបង្រៀន (Pedagogical Verification & Audit)'],
      [''],
      ['អ្នកផ្ទៀងផ្ទាត់ (Auditor):', lesson.verification.auditorName],
      ['តួនាទី (Role):', lesson.verification.auditorRole],
      ['កាលបរិច្ឆេទផ្ទៀងផ្ទាត់ (Date):', lesson.verification.auditDate],
      ['ស្ថានភាព (Status):', lesson.verification.status === 'approved' ? 'ជាប់ការផ្ទៀងផ្ទាត់ (Approved)' : lesson.verification.status === 'in_review' ? 'កំពុងត្រួតពិនិត្យ (Under Review)' : 'ត្រូវកែសម្រួល (Needs Revision)'],
      ['មតិកែលម្អ (Remarks):', lesson.verification.generalRemarks],
      [''],
      ['លក្ខខណ្ឌផ្ទៀងផ្ទាត់ (Criteria)', 'ពិន្ទុទម្ងន់ (Weight)', 'លទ្ធផល (Check Result)'],
    ];

    let totalWeight = 0;
    let earnedWeight = 0;
    VERIFICATION_CRITERIA_LIST.forEach((crit) => {
      const isPassed = lesson.verification.checkedCriteria[crit.id] ?? false;
      totalWeight += crit.weight;
      if (isPassed) earnedWeight += crit.weight;
      verificationData.push([
        crit.titleKh,
        `${crit.weight}%`,
        isPassed ? '✓ ឆ្លើយតបបានល្អ (Passed)' : '✗ មិនទាន់គ្រប់ (Pending)',
      ]);
    });
    verificationData.push([
      'ពិន្ទុសរុប (Total Score)',
      `${totalWeight}%`,
      `${earnedWeight}% - ${earnedWeight >= 80 ? 'កម្រិតល្អឥតខ្ចោះ' : earnedWeight >= 50 ? 'កម្រិតមធ្យម' : 'កម្រិតខ្សោយ'}`,
    ]);

    const wsAudit = XLSX.utils.aoa_to_sheet(verificationData);
    wsAudit['!cols'] = [{ wch: 45 }, { wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsAudit, 'លទ្ធផលផ្ទៀងផ្ទាត់');

    // Download the workbook
    const safeTitle = lesson.title.replace(/[^\w\u1780-\u17FF]/g, '_').slice(0, 30);
    XLSX.writeFile(wb, `KruSmart_${safeTitle}_${lesson.date}.xlsx`);
  },

  /**
   * Export lesson plan as a standalone interactive HTML file with print layout and collapsible sections
   */
  exportToHtml(lesson: LessonPlan): void {
    const totalMinutes = lesson.steps.reduce((sum, s) => sum + s.durationMinutes, 0);

    const htmlContent = `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>កិច្ចតែងការបង្រៀន - ${escapeHtml(lesson.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Kantumruy Pro', system-ui, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.6;
      padding: 24px;
    }
    .container {
      max-width: 1040px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .header-kingdom {
      text-align: center;
      margin-bottom: 24px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
    }
    .header-kingdom h1 { font-size: 16px; font-weight: 700; color: #0f172a; }
    .header-kingdom h2 { font-size: 14px; font-weight: 600; color: #475569; margin-top: 4px; }
    .header-kingdom .doc-title { font-size: 22px; font-weight: 700; color: #0284c7; margin-top: 14px; }
    
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 24px;
      padding: 12px 16px;
      background: #f1f5f9;
      border-radius: 8px;
    }
    .btn {
      padding: 8px 14px;
      font-size: 13px;
      font-family: inherit;
      font-weight: 600;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #1e293b;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn:hover { background: #e2e8f0; }
    .btn-primary { background: #0284c7; color: #ffffff; border-color: #0284c7; }
    .btn-primary:hover { background: #0369a1; }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      background: #f8fafc;
      padding: 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .meta-item { font-size: 13px; }
    .meta-label { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 600; display: block; }
    .meta-value { font-weight: 600; color: #0f172a; margin-top: 2px; }

    .section-box {
      margin-bottom: 24px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .section-header {
      background: #f8fafc;
      padding: 12px 18px;
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      cursor: pointer;
    }
    .section-body { padding: 18px; }
    
    .obj-item { margin-bottom: 10px; font-size: 14px; }
    .obj-label { font-weight: 600; color: #0284c7; }

    /* Steps Table */
    table.steps-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 12px;
    }
    table.steps-table th, table.steps-table td {
      border: 1px solid #cbd5e1;
      padding: 10px 12px;
      vertical-align: top;
      text-align: left;
    }
    table.steps-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
    }
    .timing-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 4px;
      white-space: nowrap;
    }
    .teacher-key-box {
      background: #fefce8;
      border: 1px dashed #ca8a04;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      color: #854d0e;
      margin-top: 8px;
    }

    /* Verification card */
    .verification-status {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
      background: #dcfce7;
      color: #15803d;
    }

    /* Print Styles */
    @media print {
      body { background: #fff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; width: 100%; max-width: 100%; }
      .toolbar { display: none !important; }
      .section-box { border: 1px solid #cbd5e1; margin-bottom: 16px; page-break-inside: avoid; }
      table.steps-table th, table.steps-table td { border-color: #94a3b8; font-size: 11px; }
      .hide-in-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-kingdom">
      <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
      <h2>ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
      <div class="doc-title">កិច្ចតែងការបង្រៀន (LESSON PLAN)</div>
      <div style="font-size: 13px; color: #64748b; margin-top: 4px;">KruSmart - កម្រងកិច្ចតែងការបង្រៀន និងផ្ទៀងផ្ទាត់</div>
    </div>

    <!-- Interactive Toolbar -->
    <div class="toolbar" id="toolbar">
      <button class="btn btn-primary" onclick="window.print()">🖨️ បោះពុម្ព (Print / PDF)</button>
      <button class="btn" onclick="toggleTeacherKeys()">👁️ លាក់/បង្ហាញ គន្លឹះគ្រូ & ចម្លើយ</button>
      <button class="btn" onclick="toggleVerificationSection()">📋 លាក់/បង្ហាញ ផ្នែកផ្ទៀងផ្ទាត់</button>
      <button class="btn" onclick="toggleAllAccordions()">📂 ពង្រីក/បង្រួម ទាំងអស់</button>
    </div>

    <!-- Metadata Grid -->
    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">មុខវិជ្ជា &amp; បំណិន (Subject &amp; Skill)</span>
        <div class="meta-value">${escapeHtml(lesson.subject)}${lesson.skillDomain ? ` · បំណិន៖ ${escapeHtml(lesson.skillDomain)}` : ''}</div>
      </div>
      <div class="meta-item">
        <span class="meta-label">ថ្នាក់ទី (Grade)</span>
        <div class="meta-value">${escapeHtml(lesson.grade)}</div>
      </div>
      <div class="meta-item">
        <span class="meta-label">ចំណងជើងមេរៀន (Topic)</span>
        <div class="meta-value">${escapeHtml(lesson.title)}</div>
      </div>
      <div class="meta-item">
        <span class="meta-label">រយៈពេលសរុប (Duration)</span>
        <div class="meta-value">${lesson.durationMinutes} នាទី (Minutes)</div>
      </div>
      <div class="meta-item">
        <span class="meta-label">គ្រូបង្រៀន (Teacher)</span>
        <div class="meta-value">${escapeHtml(lesson.teacherName)}</div>
      </div>
      <div class="meta-item">
        <span class="meta-label">សាលារៀន (School)</span>
        <div class="meta-value">${escapeHtml(lesson.schoolName)}</div>
      </div>
      <div class="meta-item">
        <span class="meta-label">កាលបរិច្ឆេទ (Date)</span>
        <div class="meta-value">${escapeHtml(lesson.date)}</div>
      </div>
    </div>

    <!-- Objectives Section -->
    <div class="section-box" id="box-objectives">
      <div class="section-header" onclick="toggleSection('body-objectives')">
        <span>១. វត្ថុបំណងមេរៀន (Lesson Objectives)</span>
        <span style="font-size: 12px; color: #64748b;">ចុចដើម្បីលាក់/បង្ហាញ</span>
      </div>
      <div class="section-body" id="body-objectives">
        <div class="obj-item">
          <span class="obj-label">• វិជ្ជាសម្បទា (Knowledge):</span> ${escapeHtml(lesson.objectives.knowledge)}
        </div>
        <div class="obj-item">
          <span class="obj-label">• បំណិនសម្បទា (Skills):</span> ${escapeHtml(lesson.objectives.skills)}
        </div>
        <div class="obj-item">
          <span class="obj-label">• ចរិយាសម្បទា (Attitude):</span> ${escapeHtml(lesson.objectives.attitude)}
        </div>
      </div>
    </div>

    <!-- Teaching Aids -->
    <div class="section-box" id="box-aids">
      <div class="section-header" onclick="toggleSection('body-aids')">
        <span>២. សម្ភារឧបទេស (Instructional Materials)</span>
        <span style="font-size: 12px; color: #64748b;">ចុចដើម្បីលាក់/បង្ហាញ</span>
      </div>
      <div class="section-body" id="body-aids">
        <ul style="padding-left: 20px;">
          ${lesson.teachingAids.map((aid) => `<li>${escapeHtml(aid)}</li>`).join('')}
        </ul>
      </div>
    </div>

    <!-- 5-Step Teaching Delivery Table -->
    <div class="section-box">
      <div class="section-header" onclick="toggleSection('body-steps')">
        <span>៣. សកម្មភាពបង្រៀនតាមជំហានទាំង ៥ (៥០ នាទី)</span>
        <span class="timing-badge">សរុប ${totalMinutes} នាទី</span>
      </div>
      <div class="section-body" id="body-steps" style="overflow-x: auto;">
        <table class="steps-table">
          <thead>
            <tr>
              <th style="width: 14%;">ជំហាន & នាទី</th>
              <th style="width: 26%;">ខ្លឹមសារមេរៀន</th>
              <th style="width: 30%;">សកម្មភាពគ្រូ</th>
              <th style="width: 30%;">សកម្មភាពសិស្ស</th>
            </tr>
          </thead>
          <tbody>
            ${lesson.steps
              .map(
                (step) => `
            <tr>
              <td>
                <strong>ជំហានទី ${step.stepNumber}</strong><br>
                <span class="timing-badge">${step.durationMinutes} នាទី</span><br>
                <small style="color: #64748b;">${escapeHtml(step.name.split('៖')[1] || step.name)}</small>
              </td>
              <td>
                ${escapeHtml(step.content).replace(/\n/g, '<br>')}
              </td>
              <td>
                ${escapeHtml(step.teacherActivity).replace(/\n/g, '<br>')}
                <div class="teacher-key-box teacher-keys">
                  <strong>💡 គន្លឹះគ្រូ & ចម្លើយ៖</strong><br>
                  ${escapeHtml(step.teacherKey).replace(/\n/g, '<br>')}
                </div>
              </td>
              <td>
                ${escapeHtml(step.studentActivity).replace(/\n/g, '<br>')}
              </td>
            </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Verification Section -->
    <div class="section-box" id="box-verification">
      <div class="section-header" onclick="toggleSection('body-verification')">
        <span>៤. ការផ្ទៀងផ្ទាត់គរុកោសល្យ និងការវាយតម្លៃ (Verification & Review)</span>
        <span class="verification-status">${lesson.verification.status === 'approved' ? '✓ បានអនុម័ត' : 'កំពុងត្រួតពិនិត្យ'}</span>
      </div>
      <div class="section-body" id="body-verification">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 16px;">
          <div><strong>អ្នកផ្ទៀងផ្ទាត់៖</strong> ${escapeHtml(lesson.verification.auditorName)} (${escapeHtml(lesson.verification.auditorRole)})</div>
          <div><strong>កាលបរិច្ឆេទ៖</strong> ${escapeHtml(lesson.verification.auditDate)}</div>
          <div><strong>សាលារៀន៖</strong> ${escapeHtml(lesson.verification.schoolName)}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 16px;">
          <strong>មតិកែលម្អរបស់អ្នកផ្ទៀងផ្ទាត់៖</strong>
          <p style="margin-top: 4px; color: #334155;">${escapeHtml(lesson.verification.generalRemarks)}</p>
        </div>

        <table class="steps-table" style="margin-top: 8px;">
          <thead>
            <tr>
              <th>លក្ខខណ្ឌផ្ទៀងផ្ទាត់ (Criteria)</th>
              <th style="width: 25%;">លទ្ធផលផ្ទៀងផ្ទាត់</th>
            </tr>
          </thead>
          <tbody>
            ${VERIFICATION_CRITERIA_LIST.map((crit) => {
              const checked = lesson.verification.checkedCriteria[crit.id] ?? false;
              return `
              <tr>
                <td>${escapeHtml(crit.titleKh)}</td>
                <td style="color: ${checked ? '#15803d' : '#b91c1c'}; font-weight: 600;">
                  ${checked ? '✓ ឆ្លើយតបបានល្អ' : '✗ នៅខ្វះខាត'}
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Signatures Block -->
        <div style="display: flex; justify-content: space-between; margin-top: 36px; padding: 0 20px;">
          <div style="text-align: center;">
            <p>បានឃើញ និងយល់ព្រម</p>
            <strong>នាយក / នាយិការង</strong>
            <div style="height: 60px;"></div>
            <p>.......................................</p>
          </div>
          <div style="text-align: center;">
            <p>កាលបរិច្ឆេទ៖ ${escapeHtml(lesson.date)}</p>
            <strong>ហត្ថលេខាគ្រូបង្រៀន</strong>
            <div style="height: 60px;"></div>
            <p>${escapeHtml(lesson.teacherName)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let teacherKeysVisible = true;
    function toggleTeacherKeys() {
      teacherKeysVisible = !teacherKeysVisible;
      const keys = document.querySelectorAll('.teacher-keys');
      keys.forEach(el => {
        el.style.display = teacherKeysVisible ? 'block' : 'none';
      });
    }

    let verificationVisible = true;
    function toggleVerificationSection() {
      verificationVisible = !verificationVisible;
      const el = document.getElementById('box-verification');
      if (el) el.style.display = verificationVisible ? 'block' : 'none';
    }

    function toggleSection(id) {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = (el.style.display === 'none') ? 'block' : 'none';
      }
    }

    let allExpanded = true;
    function toggleAllAccordions() {
      allExpanded = !allExpanded;
      ['body-objectives', 'body-aids', 'body-steps', 'body-verification'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = allExpanded ? 'block' : 'none';
      });
    }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = lesson.title.replace(/[^\w\u1780-\u17FF]/g, '_').slice(0, 30);
    link.download = `KruSmart_${safeTitle}_${lesson.date}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
