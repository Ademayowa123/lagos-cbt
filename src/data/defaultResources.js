/**
 * Categorized Resource Library for Civil Service Promotion Preparation
 * Directly aligned with Year 2027 Promotion Exercise Circular:
 * - GL 06-10: PSR Ch 2, 4, 12 | FR Ch 1, 3, 4
 * - GL 12-14: PSR Ch 4, 8, 10, 12 | FR Ch 3, 6, 20 | Management & Leadership
 * - GL 15-16: PSR Ch 2, 4, 6, 10, 12 | FR Ch 1, 3, 20, 25
 */

export const DEFAULT_RESOURCES = [
  // ==========================================
  // GROUP 1: GL 06 - 10 REFERENCE MATERIALS
  // ==========================================
  {
    id: "res-gl06-10-psr",
    title: "PSR Study Compendium for GL 06-10 (Chapters 2, 4, 12)",
    categoryIds: ["group-gl-06-10"],
    gradeBand: "GL 06 - 10",
    type: "Public Service Rules (PSR 2015)",
    format: "Statutory Digest",
    summary: "Essential regulations governing entry qualifications, confirmation of appointment, competitive examinations, disciplinary control, queries, warnings, and comprehensive leave entitlements.",
    keyChapters: [
      "Chapter 2: Rule 020101-020810 (Recruitment on merit, 2-year probation, confirmation examinations, promotion seniority, statutory retirement at 60 yrs or 35 yrs service)",
      "Chapter 4: Rule 040101-040701 (Disciplinary proceedings within 60 days, general inefficiency, 3 written warnings, misconduct definition, queries and 48hr exculpation, interdiction at half pay)",
      "Chapter 12: Rule 120101-120254 (Annual leave computed in working days: 21 days for GL 04-07, 30 days for GL 08+; 5 days casual leave; 24 weeks maternity leave for 1st two deliveries; 10 days paternity leave)"
    ],
    readingTime: "2.5 Hours",
    badge: "Circular Mandate"
  },
  {
    id: "res-gl06-10-fr",
    title: "Financial Regulations for GL 06-10 (Chapters 1, 3, 4)",
    categoryIds: ["group-gl-06-10"],
    gradeBand: "GL 06 - 10",
    type: "Financial Regulations (FR 2009)",
    format: "Treasury Guide",
    summary: "Covers financial authorities and responsibilities of public officers, recurrent and capital expenditure warrants, and vote book maintenance.",
    keyChapters: [
      "Chapter 1: FR 101-127 (Financial authorities, Minister of Finance warrants, Accountant-General duties, Accounting Officer Permanent Secretary role, pecuniary responsibilities)",
      "Chapter 3: FR 301-326 (Consolidated Revenue Fund, Provisional General Warrant for 6 months, General Warrant, Supplementary Warrants, Virement limitations)",
      "Chapter 4: FR 401-422 (Departmental Vote Book maintenance, entries of commitments and liabilities, stamping 'ENTERED IN VOTE BOOK', Authority to Incur Expenditure - AIE)"
    ],
    readingTime: "2 Hours",
    badge: "Treasury Standard"
  },

  // ==========================================
  // GROUP 2: GL 12 - 14 REFERENCE MATERIALS
  // ==========================================
  {
    id: "res-gl12-14-psr",
    title: "PSR Study Compendium for GL 12-14 (Chapters 4, 8, 10, 12)",
    categoryIds: ["group-gl-12-14"],
    gradeBand: "GL 12 - 14",
    type: "Public Service Rules (PSR 2015)",
    format: "Managerial Digest",
    summary: "Senior and middle management regulatory requirements focusing on disciplinary tribunals, interdiction/suspension administration, duty tour allowances, medical boards, and long-term leave.",
    keyChapters: [
      "Chapter 4: Senior disciplinary hearings, Board of Inquiry constitution (min 3 members, excluding HoD), interdiction conditions, suspension without pay (max 3 months), criminal prosecution and conviction rules",
      "Chapter 8: Emoluments, Duty Tour Allowances (DTA), local and overseas estacode rates, overtime and responsibility allowances",
      "Chapter 10: Medical examination, invalidation from service, sick leave procedures, Medical Board certifications",
      "Chapter 12: Advanced leave rules: deferred leave, study leave with pay (max 2 yrs + 1 yr extension) and study leave without pay (max 4 yrs), adoption leave (12 weeks), public policy leave of absence"
    ],
    readingTime: "3 Hours",
    badge: "Circular Mandate"
  },
  {
    id: "res-gl12-14-fr",
    title: "Financial Regulations for GL 12-14 (Chapters 3, 6, 20)",
    categoryIds: ["group-gl-12-14"],
    gradeBand: "GL 12 - 14",
    type: "Financial Regulations (FR 2009)",
    format: "Policy Manual",
    summary: "Focuses on capital expenditure authorities, rigorous payment voucher controls, e-payment compliance, and official transport management.",
    keyChapters: [
      "Chapter 3: FR 301-326 (Capital expenditure warrants: Development Fund General Warrant, Supplementary Warrants, Special Warrants, strict prohibition of virement between recurrent and capital)",
      "Chapter 6: FR 601-633 (Payment vouchers, strict ban on pencil/erasures/Tippex, no facsimile stamps, Checking Section 48hr rule, 3-month voucher validity, mandatory e-payment policy)",
      "Chapter 20: FR 2001-2028 (Government Vehicles: Log Book Gen. 59, strict prohibition of private journeys, accident reporting within 24 hours under Road Traffic Act, driver non-admission of liability, Ministry of Works mechanical inspection)"
    ],
    readingTime: "2.5 Hours",
    badge: "Financial Core"
  },
  {
    id: "res-gl12-14-leadership",
    title: "Management & Leadership Principles (Written Assessment Blueprint)",
    categoryIds: ["group-gl-12-14"],
    gradeBand: "GL 12 - 14",
    type: "Leadership Manual",
    format: "Executive Syllabus",
    summary: "Preparation for the 30% Written Assessment component: Leadership styles, Teamwork dynamics, Employee Motivation theories, Delegation of Authority, and Change Management.",
    keyChapters: [
      "Topic 1: Leadership Models: Transformational, Situational, and Servant Leadership in public governance",
      "Topic 2: Teamwork & Synergy: Belbin team roles, conflict resolution, inter-departmental collaboration",
      "Topic 3: Motivation Frameworks: Maslow's Hierarchy, Herzberg's Two-Factor Theory, and public sector non-monetary incentives",
      "Topic 4: Delegation of Authority: Principles of effective delegation, accountability vs responsibility, avoiding micromanagement",
      "Topic 5: Change Management: Kotter's 8-step model, managing resistance to digital transformation and civil service reforms"
    ],
    readingTime: "2 Hours",
    badge: "Written Assessment"
  },

  // ==========================================
  // GROUP 3: GL 15 - 16 REFERENCE MATERIALS
  // ==========================================
  {
    id: "res-gl15-16-psr",
    title: "Directorate PSR Compendium for GL 15-16 (Chapters 2, 4, 6, 10, 12)",
    categoryIds: ["group-gl-15-16"],
    gradeBand: "GL 15 - 16",
    type: "Public Service Rules (PSR 2015)",
    format: "Executive Treatise",
    summary: "Comprehensive directorate examination syllabus covering Commission appointments, serious misconduct, statutory petitions, constitutional appeals, and executive sabbatical leave.",
    keyChapters: [
      "Chapter 2: Commission appointments to GL 15-17 with inputs from the Head of Service, 4-year minimum maturity in post for directorship, notional promotion rules",
      "Chapter 4: Serious misconduct (bribery, falsification of records, unauthorized disclosure, holding dual full-time jobs), dismissal procedures, Public Accounts Committee appearances",
      "Chapter 6: Petitions, appeals, and redress mechanisms to the Civil Service Commission and Governor",
      "Chapter 10: Medical Boards, certification of permanent unfitness, invalidation retirement procedures",
      "Chapter 12: Executive sabbatical leave (12 months once in 5 years for GL 15+), public policy leave of absence for political appointments"
    ],
    readingTime: "3.5 Hours",
    badge: "Directorate Level"
  },
  {
    id: "res-gl15-16-fr",
    title: "Directorate Financial Regulations (Chapters 1, 3, 20, 25)",
    categoryIds: ["group-gl-15-16"],
    gradeBand: "GL 15 - 16",
    type: "Financial Regulations (FR 2009)",
    format: "Statutory Law",
    summary: "High-level accounting officer responsibilities, expenditure governance, fleet asset oversight, and statutory handling of loss of public funds and Boards of Enquiry.",
    keyChapters: [
      "Chapter 1: FR 101-127 (Accounting Officer's personal liability, relations with Political Head, directives in writing, statutory audits by Auditor-General, PPA obligations)",
      "Chapter 3: FR 301-326 (Budget authorization, Consolidated Revenue Fund, Development Fund, Special Contingencies Warrants, legislative scrutiny)",
      "Chapter 20: FR 2001-2028 (Fleet management, accidents, Board of Survey for beyond-economic-repair vehicles, quarterly returns to Ministry of Finance)",
      "Chapter 25: FR 2501-2539 (Loss or shortage of government funds: Treasury Form 146, write-off limits, surcharges, Permanent Board of Survey & Enquiry constitution of min 24 members with President GL 15+, natural justice fair hearing)"
    ],
    readingTime: "3 Hours",
    badge: "Executive Financial"
  },
  {
    id: "res-ppa-2021",
    title: "Lagos State Public Procurement Law (2021 Compendium)",
    categoryIds: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"],
    gradeBand: "All Grade Levels",
    type: "Procurement Law",
    format: "Statutory Act",
    summary: "Fundamental principles of transparency, open competitive bidding, approval thresholds, Tenders Boards, Certificate of No Objection, and sanctions under procurement law.",
    keyChapters: [
      "Part I: General Principles - Open competitive bidding, equality of bidders, domestic preference",
      "Part II: Procurement Planning Committees - Composition, needs assessment, cost survey",
      "Part III: Tenders Board Thresholds - Ministerial Tenders Board, approvals, 15% mobilization fee limit supported by bank guarantee",
      "Part IV: Special Bidding Methods - Restrictive tendering, two-stage bidding, direct emergency procurement",
      "Part V: Offences & Sanctions - Bid-rigging, contract splitting, 5-year imprisonment without option of fine for corrupt officers"
    ],
    readingTime: "2 Hours",
    badge: "Public Procurement"
  }
];

export const MOCK_CANDIDATES = [
  {
    id: "CAND-2027-0482",
    fullName: "Babatunde Olatunji",
    serviceNumber: "LASG/ADM/2019/3381",
    ministry: "Ministry of Establishments and Training",
    cadre: "Administrative Officer I",
    currentGrade: "GL 09",
    targetGrade: "GL 10",
    categoryId: "group-gl-06-10",
    status: "Verified",
    spadevScore: 82, // 40% component in circular
    assignedCenter: "Public Service Staff Development Centre (PSSDC), Magodo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-2027-1092",
    fullName: "Mrs. Ngozi Chiamaka Eze",
    serviceNumber: "LASG/ACC/2013/8104",
    ministry: "Ministry of Finance / State Treasury Office",
    cadre: "Chief Accountant",
    currentGrade: "GL 13",
    targetGrade: "GL 14",
    categoryId: "group-gl-12-14",
    status: "Verified",
    spadevScore: 86,
    writtenScore: 78,
    interviewScore: 80,
    assignedCenter: "State Secretariat CBT Arena, Alausa, Ikeja",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CAND-2027-0015",
    fullName: "Dr. Abubakar Sadiq Danjuma",
    serviceNumber: "LASG/DIR/2008/0421",
    ministry: "Lagos State Civil Service Commission",
    cadre: "Deputy Director (Administration & HR)",
    currentGrade: "GL 15",
    targetGrade: "GL 16",
    categoryId: "group-gl-15-16",
    status: "Verified",
    spadevScore: 90,
    writtenScore: 84,
    interviewScore: 85,
    assignedCenter: "Executive CBT Suite, Public Service Global Hall, Alausa",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  }
];
