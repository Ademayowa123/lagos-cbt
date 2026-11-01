/**
 * Official Grade Level Groups and Examination Matrix
 * Based on Year 2027 Promotion Exercise Circular (Civil Service Commission)
 */

export const DEFAULT_GRADE_CATEGORIES = [
  {
    id: "group-gl-06-10",
    code: "GL 06 - 10",
    title: "Senior / Officer Promotion Group (GL 06 - 10)",
    gradeLevels: ["GL 06 to 07", "GL 07 to 08", "GL 08 to 09", "GL 09 to 10"],
    targetLevel: "Grade Level 06 - 10",
    description: "Assessment for junior-to-officer and senior officer advancement. Evaluates mastery of appointment rules, core discipline, leave entitlements, and foundational financial regulations.",
    timeLimitMinutes: 90,
    passScorePercentage: 50, // Minimum 50% in any component per circular
    totalQuestions: 100,
    assessmentMatrix: {
      cbtWeight: 60,
      spadevWeight: 40,
      writtenWeight: 0,
      interviewWeight: 0
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
      "Officers' Cadres in The Schemes of Service (2000, 2003 & extant circulars)",
      "Civil Service Commission Annual Report/Handbook",
      "Establishments & Training Circulars"
    ],
    subjects: [
      { id: "psr_ch2", name: "PSR Chapter 2: Appointments, Confirmations & Promotions", weight: 25 },
      { id: "psr_ch4", name: "PSR Chapter 4: Discipline & Code of Conduct", weight: 25 },
      { id: "psr_ch12", name: "PSR Chapter 12: Leave Entitlements & Absences", weight: 20 },
      { id: "fr_ch1_3_4", name: "Financial Regulations: Chapters 1, 3 & 4 (Authorities & Vote Book)", weight: 30 }
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
    gradeLevels: ["GL 10 to 12", "GL 12 to 13", "GL 13 to 14"],
    targetLevel: "Grade Level 12 - 14",
    description: "Assessment for middle management and chief officers transitioning into upper administration. Examines disciplinary jurisdiction, allowances, payment procedures, and transport administration.",
    timeLimitMinutes: 90,
    passScorePercentage: 50,
    totalQuestions: 100,
    assessmentMatrix: {
      cbtWeight: 30,
      writtenWeight: 30,
      interviewWeight: 20,
      spadevWeight: 20
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
      "State Developmental Objectives & Megacity Programmes",
      "Treasury Circulars on e-Payment & Centralized Billings"
    ],
    subjects: [
      { id: "psr_ch4_8_10_12", name: "PSR Chapters 4, 8, 10 & 12 (Discipline, Allowances, Leave)", weight: 35 },
      { id: "fr_ch3_6_20", name: "Financial Regulations: Chapters 3, 6 & 20 (Warrants, Payments, Vehicles)", weight: 35 },
      { id: "procurement_law", name: "Lagos State Public Procurement Law & Tenders Rules", weight: 15 },
      { id: "leadership_mgmt", name: "Management, Teamwork, Delegation & Change Administration", weight: 15 }
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
    gradeLevels: ["GL 14 to 15", "GL 15 to 16", "GL 16 to 17"],
    targetLevel: "Grade Level 15 - 16",
    description: "Assessment for Directorate leadership and Substantive Directors. Focuses on Commission appointments, constitutional appeals, health policies, loss of public funds, and Board of Enquiry procedures.",
    timeLimitMinutes: 90,
    passScorePercentage: 50,
    totalQuestions: 100,
    assessmentMatrix: {
      cbtWeight: 30,
      writtenWeight: 30,
      interviewWeight: 20,
      spadevWeight: 20
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
      "Civil Service Commission Annual Report/Handbook",
      "State Treasury Circulars, Codification of Offences & Sanctions (FR 31)"
    ],
    subjects: [
      { id: "psr_ch2_4_6_10_12", name: "PSR Chapters 2, 4, 6, 10 & 12 (Appeals, Executive Discipline, Leave)", weight: 35 },
      { id: "fr_ch1_3_20_25", name: "Financial Regulations: Chapters 1, 3, 20 & 25 (Authorities, Losses & Boards)", weight: 35 },
      { id: "procurement_law", name: "Procurement Governance & Tender Thresholds", weight: 15 },
      { id: "leadership_mgmt", name: "Executive Leadership, Strategic Policy & Public Financial Governance", weight: 15 }
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
