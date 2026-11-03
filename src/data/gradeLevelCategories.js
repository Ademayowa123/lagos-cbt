/**
 * Official Grade Level Groups and Examination Matrix
 * Based on Year 2027 Promotion Exercise Circular (Civil Service Commission)
 */

export const DEFAULT_GRADE_CATEGORIES = [
  {
    id: "group-gl-06-10",
    code: "GL 06 - 10",
    title: "Senior / Officer Promotion Group (GL 06 - 10)",
    gradeLevels: ["GL 06 to 07", "GL 07 to 08", "GL 08 to 09", "GL 09 to 10", "GL 10 to 12"],
    targetLevel: "Grade Level 06 - 10",
    description: "Assessment for junior-to-officer and senior officer advancement. Evaluates mastery of appointment rules, core discipline, leave entitlements, financial regulations, and Lagos State circular materials.",
    timeLimitMinutes: 60,
    passScorePercentage: 50, // Minimum 50% pass mark in CBT
    totalQuestions: 100,
    assessmentMatrix: {
      cbtWeight: 100
    },
    psrChapters: [
      { chapter: 2, name: "Chapter 2: Appointments, Confirmations, Promotions, Transfers & Conversions" },
      { chapter: 4, name: "Chapter 4: Disciplinary Procedures, General Inefficiency & Misconduct" },
      { chapter: 12, name: "Chapter 12: Leave Regulations, Allowances & Conditions" }
    ],
    frChapters: [
      { chapter: 1, name: "Chapter 1: Financial Authorities and Responsibilities of Public Officers (FR 101-127)" },
      { chapter: 3, name: "Chapter 3: Expenditure Authorities & Warrants (CRF, Development & Contingencies Funds)" },
      { chapter: 4, name: "Chapter 4: Expenditure Classification, Departmental Vote Book & Control (FR 401-422)" }
    ],
    additionalReferences: [
      "Lagos State Public Procurement Law (2021)",
      "Officers' Cadres in the Schemes of Service (2000, 2003 & extant circulars)",
      "Developmental Objectives and Programmes of the State Government (THEMES+ & LSDP 2052)",
      "Civil Service Commission Y2025 Annual Report/Handbook",
      "Circulars and Directives (OHOS, CSC, STO, MET)"
    ],
    resourceMaterials: [
      "Public Service Rules (PSR 2015)",
      "Financial Regulations (FR 2009)",
      "Lagos State Public Procurement Law (2021)",
      "Officers' Cadres in the Schemes of Service (2000, 2003 & extant circulars)",
      "Developmental Objectives and Programmes of the State Government (THEMES+ & LSDP 2052)",
      "Civil Service Commission Y2025 Annual Report/Handbook",
      "Circulars and Directives (OHOS, CSC, STO, MET)"
    ],
    subjects: [
      { id: "psr_ch2", name: "PSR Chapter 2: Appointments, Confirmations & Promotions", weight: 15 },
      { id: "psr_ch4", name: "PSR Chapter 4: Discipline & Code of Conduct", weight: 15 },
      { id: "psr_ch12", name: "PSR Chapter 12: Leave Entitlements & Absences", weight: 10 },
      { id: "fr_ch1_3_4", name: "Financial Regulations: Chapters 1, 3 & 4 (Authorities & Vote Book)", weight: 15 },
      { id: "procurement_law", name: "Lagos State Public Procurement Law (2021)", weight: 9 },
      { id: "schemes_of_service", name: "Officers' Cadres in the Schemes of Service", weight: 9 },
      { id: "developmental_objectives", name: "Developmental Objectives & Programmes (THEMES+)", weight: 9 },
      { id: "csc_handbook", name: "Civil Service Commission Annual Report/Handbook", weight: 9 },
      { id: "circulars_directives", name: "Circulars and Directives (OHOS/CSC/STO/MET)", weight: 9 }
    ],
    cadres: [
      "Administrative Officer II / I",
      "Executive Officer (General Duties / Accounts)",
      "Accountant II / I",
      "Education Officer II / I",
      "Planning Officer II / I",
      "State Counsel II / I",
      "Engineer II / I",
      "Information Officer II / I",
      "Higher Technical Officer"
    ],
    badgeColor: "badge-blue"
  },
  {
    id: "group-gl-12-14",
    code: "GL 12 - 14",
    title: "Middle Management / Chief Officer Band (GL 12 - 14)",
    gradeLevels: ["GL 12 to 13", "GL 13 to 14", "GL 14 to 15"],
    targetLevel: "Grade Level 12 - 14",
    description: "Assessment for middle management and chief officers transitioning into upper administration. Examines disciplinary jurisdiction, allowances, payment procedures, vehicles, and key state directives.",
    timeLimitMinutes: 60,
    passScorePercentage: 50,
    totalQuestions: 100,
    assessmentMatrix: {
      cbtWeight: 100
    },
    psrChapters: [
      { chapter: 4, name: "Chapter 4: Disciplinary Procedures & Interdiction/Suspension" },
      { chapter: 8, name: "Chapter 8: Emoluments, Duty Tour Allowances & Increments" },
      { chapter: 10, name: "Chapter 10: Medical Regulations, Health Provisions & Sick Leave" },
      { chapter: 12, name: "Chapter 12: Leave Regulations (Maternity, Paternity, Sabbatical & Study Leave)" }
    ],
    frChapters: [
      { chapter: 3, name: "Chapter 3: Expenditure Authorities, Warrants & Virement (FR 301-326)" },
      { chapter: 6, name: "Chapter 6: Payments Procedure, Payment Vouchers & e-Payment (FR 601-633)" },
      { chapter: 20, name: "Chapter 20: Government Vehicles, Log Books & Accidents (FR 2001-2028)" }
    ],
    writtenTopics: [
      "Job/Cadre-specific capacity and readiness for the next grade level",
      "Management & Leadership Principles: Leadership styles, Teamwork, Motivation, Delegation of Authority, Change Management"
    ],
    additionalReferences: [
      "Lagos State Public Procurement Law (2021)",
      "Officers' Cadres in the Schemes of Service (2000, 2003 & extant circulars)",
      "Developmental Objectives and Programmes of the State Government (THEMES+ & LSDP 2052)",
      "Civil Service Commission Y2025 Annual Report/Handbook",
      "Circulars and Directives (OHOS, CSC, STO, MET)"
    ],
    resourceMaterials: [
      "Public Service Rules (PSR 2015)",
      "Financial Regulations (FR 2009)",
      "Lagos State Public Procurement Law (2021)",
      "Officers' Cadres in the Schemes of Service (2000, 2003 & extant circulars)",
      "Developmental Objectives and Programmes of the State Government (THEMES+ & LSDP 2052)",
      "Civil Service Commission Y2025 Annual Report/Handbook",
      "Circulars and Directives (OHOS, CSC, STO, MET)"
    ],
    subjects: [
      { id: "psr_ch4_8_10_12", name: "PSR Chapters 4, 8, 10 & 12 (Discipline, Allowances, Leave)", weight: 25 },
      { id: "fr_ch3_6_20", name: "Financial Regulations: Chapters 3, 6 & 20 (Warrants, Payments, Vehicles)", weight: 25 },
      { id: "procurement_law", name: "Lagos State Public Procurement Law (2021)", weight: 10 },
      { id: "schemes_of_service", name: "Officers' Cadres in the Schemes of Service", weight: 10 },
      { id: "developmental_objectives", name: "Developmental Objectives & Programmes (THEMES+)", weight: 10 },
      { id: "csc_handbook", name: "Civil Service Commission Annual Report/Handbook", weight: 10 },
      { id: "circulars_directives", name: "Circulars and Directives (OHOS/CSC/STO/MET)", weight: 10 }
    ],
    cadres: [
      "Chief Administrative Officer",
      "Assistant Director (Administration / Planning / Finance)",
      "Chief Accountant",
      "Chief Education Officer",
      "Chief State Counsel",
      "Chief Planning Officer",
      "Chief Engineer / Chief Architect"
    ],
    badgeColor: "badge-purple"
  },
  {
    id: "group-gl-15-16",
    code: "GL 15 - 16",
    title: "Directorate & Executive Promotion Group (GL 15 - 16)",
    gradeLevels: ["GL 15 to 16", "GL 16 to 17"],
    targetLevel: "Grade Level 15 - 16",
    description: "Assessment for Directorate leadership and Substantive Directors. Focuses on Commission appointments, constitutional appeals, loss of funds, state procurement governance, and strategic circulars.",
    timeLimitMinutes: 60,
    passScorePercentage: 50,
    totalQuestions: 100,
    assessmentMatrix: {
      cbtWeight: 100
    },
    psrChapters: [
      { chapter: 2, name: "Chapter 2: Commission Appointments & Seniority Structures" },
      { chapter: 4, name: "Chapter 4: Serious Misconduct, Criminal Convictions & Dismissal" },
      { chapter: 6, name: "Chapter 6: Petitions, Redress & Constitutional Appeals" },
      { chapter: 10, name: "Chapter 10: Medical Boards, Invalidation & Health Regulations" },
      { chapter: 12, name: "Chapter 12: Executive Sabbatical, Public-Policy Leave & Absences" }
    ],
    frChapters: [
      { chapter: 1, name: "Chapter 1: Financial Authorities & Accounting Officer Responsibilities (FR 101-127)" },
      { chapter: 3, name: "Chapter 3: Expenditure Authorities, Development Fund & Contingencies Warrants" },
      { chapter: 20, name: "Chapter 20: Government Vehicles, Police Reports & Accidents (FR 2001-2028)" },
      { chapter: 25, name: "Chapter 25: Loss or Shortage of Public Funds & Boards of Enquiry (FR 2501-2539)" }
    ],
    writtenTopics: [
      "High-level Public Policy, Strategy and Inter-Agency Harmonization",
      "Management and Leadership Principles: Transformative Leadership, Crisis Resolution, Change Management"
    ],
    additionalReferences: [
      "Lagos State Public Procurement Law (2021)",
      "Officers' Cadres in the Schemes of Service (2000, 2003 & extant circulars)",
      "Developmental Objectives and Programmes of the State Government (THEMES+ & LSDP 2052)",
      "Civil Service Commission Y2025 Annual Report/Handbook",
      "Circulars and Directives (OHOS, CSC, STO, MET)"
    ],
    resourceMaterials: [
      "Public Service Rules (PSR 2015)",
      "Financial Regulations (FR 2009)",
      "Lagos State Public Procurement Law (2021)",
      "Officers' Cadres in the Schemes of Service (2000, 2003 & extant circulars)",
      "Developmental Objectives and Programmes of the State Government (THEMES+ & LSDP 2052)",
      "Civil Service Commission Y2025 Annual Report/Handbook",
      "Circulars and Directives (OHOS, CSC, STO, MET)"
    ],
    subjects: [
      { id: "psr_ch2_4_6_10_12", name: "PSR Chapters 2, 4, 6, 10 & 12 (Appeals, Executive Discipline, Leave)", weight: 25 },
      { id: "fr_ch1_3_20_25", name: "Financial Regulations: Chapters 1, 3, 20 & 25 (Authorities, Losses & Boards)", weight: 25 },
      { id: "procurement_law", name: "Lagos State Public Procurement Law (2021)", weight: 10 },
      { id: "schemes_of_service", name: "Officers' Cadres in the Schemes of Service", weight: 10 },
      { id: "developmental_objectives", name: "Developmental Objectives & Programmes (THEMES+)", weight: 10 },
      { id: "csc_handbook", name: "Civil Service Commission Annual Report/Handbook", weight: 10 },
      { id: "circulars_directives", name: "Circulars and Directives (OHOS/CSC/STO/MET)", weight: 10 }
    ],
    cadres: [
      "Deputy Director / Director (Administration & HR)",
      "Deputy Director / Director (Planning, Research & Statistics)",
      "Deputy Director / Director (Finance & Accounts)",
      "Deputy Director / Director (Legal Services & Prosecutions)",
      "Deputy Director / Director (Technical & Engineering Services)",
      "Director of Public Health & Clinical Services"
    ],
    badgeColor: "badge-emerald"
  }
];

export const MINISTRIES_DEPARTMENTS = [
  "Lagos State Civil Service Commission",
  "Office of the Head of Service (OHOS)",
  "Ministry of Establishments and Training",
  "Ministry of Finance / State Treasury Office",
  "Ministry of Justice / Attorney General Chambers",
  "Ministry of Education",
  "Ministry of Health",
  "Ministry of Physical Planning and Urban Development",
  "Ministry of Works and Infrastructure",
  "Ministry of Transportation",
  "Ministry of Science, Innovation and Technology",
  "Lagos State Public Procurement Agency (PPA)",
  "Lagos State Internal Revenue Service (LIRS)"
];

/**
 * Accurately maps any exam question to its official category subject / regulatory domain.
 * Protects against missing, undefined or misclassified subjectId tags.
 */
export function resolveQuestionSubjectId(q, categoryId = 'group-gl-06-10') {
  if (!q) return 'psr_ch2';
  const rawSubject = q.subjectId;
  const ch = String(q.chapter || q.resourceMaterial || '').toLowerCase();
  const qText = String(q.question || '').toLowerCase();

  // Universal state resource materials across all grade levels
  if (rawSubject === 'procurement_law' || ch.includes('procurement') || qText.includes('procurement') || qText.includes('public procurement agency')) {
    return 'procurement_law';
  }
  if (rawSubject === 'schemes_of_service' || ch.includes('schemes of service') || ch.includes('scheme of service') || ch.includes('cadres in the schemes') || qText.includes('scheme of service') || qText.includes('schemes of service')) {
    return 'schemes_of_service';
  }
  if (rawSubject === 'developmental_objectives' || ch.includes('developmental objectives') || qText.includes('themes+') || qText.includes('lsdp') || qText.includes('2052') || qText.includes('development plan')) {
    return 'developmental_objectives';
  }
  if (rawSubject === 'csc_handbook' || ch.includes('civil service commission') || ch.includes('csc annual report') || ch.includes('annual report/handbook') || (qText.includes('civil service commission') && (qText.includes('handbook') || qText.includes('annual report')))) {
    return 'csc_handbook';
  }
  if (rawSubject === 'circulars_directives' || ch.includes('circulars and directives') || ch.includes('extant circulars') || (qText.includes('circular') && (qText.includes('directive') || qText.includes('official communication')))) {
    return 'circulars_directives';
  }

  if (categoryId === 'group-gl-06-10') {
    if (ch.includes('financial') || ch.includes('fr') || ch.includes('vote book') || qText.includes('fr ') || qText.includes('financial regulation') || qText.includes('warrant') || qText.includes('vote book') || rawSubject === 'fr_ch1_3_4') {
      return 'fr_ch1_3_4';
    }
    if (ch.includes('chapter 4') || ch.includes('rule 04') || ch.includes('discipline') || rawSubject === 'psr_ch4') {
      return 'psr_ch4';
    }
    if (ch.includes('chapter 12') || ch.includes('rule 12') || ch.includes('leave') || rawSubject === 'psr_ch12') {
      return 'psr_ch12';
    }
    if (ch.includes('chapter 2') || ch.includes('rule 02') || rawSubject === 'psr_ch2') {
      return 'psr_ch2';
    }
    // Deep fallback by question text
    if (qText.includes('leave') || qText.includes('maternity') || qText.includes('resumption')) return 'psr_ch12';
    if (qText.includes('misconduct') || qText.includes('query') || qText.includes('surcharge') || qText.includes('dismissal')) return 'psr_ch4';
    return 'psr_ch2';
  }

  if (categoryId === 'group-gl-12-14') {
    if (ch.includes('leadership') || ch.includes('management') || qText.includes('leadership') || qText.includes('management') || rawSubject === 'leadership_mgmt') return 'leadership_mgmt';
    if (ch.includes('financial') || ch.includes('fr') || rawSubject === 'fr_ch3_6_20') return 'fr_ch3_6_20';
    return 'psr_ch4_8_10_12';
  }

  // group-gl-15-16
  if (ch.includes('leadership') || ch.includes('management') || ch.includes('policy') || rawSubject === 'leadership_mgmt') return 'leadership_mgmt';
  if (ch.includes('financial') || ch.includes('fr') || rawSubject === 'fr_ch1_3_20_25') return 'fr_ch1_3_20_25';
  return 'psr_ch2_4_6_10_12';
}
