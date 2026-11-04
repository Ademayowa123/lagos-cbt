/**
 * Comprehensive Civil Service Promotion CBT Question Bank
 * Curated from:
 * 1. Public Service Rules (PSR 2015): Chapters 2, 4, 6, 8, 10, 12
 * 2. Financial Regulations (FR 2009): Chapters 1, 3, 4, 6, 20, 25
 * 3. Lagos State Public Procurement Law (2021)
 * 4. Management & Leadership Principles
 * 
 * Provides an exact 100-question session for each Grade Level Group
 * with precise Resource Material Citations.
 */

import { resolveQuestionSubjectId } from './gradeLevelCategories.js';
import newQuestionsBank from '../../new_questions.json' with { type: 'json' };

// Base Authentic Question Items
const BASE_QUESTIONS = [
  // ==========================================
  // PSR CHAPTER 2: RECRUITMENT, APPOINTMENT, PROMOTION
  // ==========================================
  {
    id: "psr-ch2-001",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020101",
    question: "According to Chapter 2, recruitment activities in the Public Service should principally be based on what?",
    options: [
      "Merit, gender equality, social inclusion and service needs",
      "Merit, seniority, residence and the recommendation of serving officers",
      "Qualifications, length of service, family background and referee reports",
      "Merit, age bracket, experience and sponsorship by a senior officer"
    ],
    correctAnswer: 0,
    explanation: "Rule 020101 specifies that recruitment into the Public Service must be strictly anchored on merit, gender equality, social inclusion, and demonstrable service needs.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-002",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020102",
    question: "What clearance is required for all new entrants to the State Public Service before appointment confirmation?",
    options: [
      "Security clearance",
      "Tax litigation clearance",
      "Legislative clearance for each individual",
      "Contractor clearance"
    ],
    correctAnswer: 0,
    explanation: "Security clearance from authorized state security apparatus is a statutory prerequisite for all entrants.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-003",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020101",
    question: "Which instrument may formally establish an officer's appointment under Rule 020101?",
    options: [
      "A verbal directive from the Permanent Secretary confirmed by the Head of Service",
      "A circular issued by the Office of the Head of Service",
      "A certificate of fitness issued by a government medical officer",
      "An authorised appointment letter or formal agreement"
    ],
    correctAnswer: 3,
    explanation: "Appointments are formally established through an authorized letter of appointment issued under the authority of the Civil Service Commission.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-004",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020104",
    question: "Who ordinarily appoints officers to posts graded GL 07-10 in the Civil Service?",
    options: [
      "The Head of Service or another empowered officer",
      "The State Civil Service Commission or another empowered body",
      "The Permanent Secretary of the employing ministry or department",
      "The Governor on the advice of the Executive Council"
    ],
    correctAnswer: 1,
    explanation: "Under the Constitution and service regulations, the Civil Service Commission appoints officers to senior posts from GL 07 to 10.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-005",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020104",
    question: "How should appointments to GL 12-14 vacancies ordinarily be publicised?",
    options: [
      "Only by private invitations to relatives",
      "Through due advertisement",
      "Through retirement notices only",
      "By an internal cash-book entry"
    ],
    correctAnswer: 1,
    explanation: "Rule 020104 requires appointments to senior vacancies on GL 12-14 to be publicized through due public advertisement.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-006",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020104",
    question: "Whose inputs are specified for Commission appointments to GL 15-17, where applicable?",
    options: [
      "The Revenue Collector",
      "The Head Driver",
      "The Stores Assistant",
      "The Head of Service"
    ],
    correctAnswer: 3,
    explanation: "Commission appointments to directorate posts (GL 15-17) require input and recommendations from the Head of Service.",
    categories: ["group-gl-15-16"]
  },
  {
    id: "psr-ch2-007",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020102",
    question: "The annual competitive entry examination specified in Rule 020102 principally concerns which grades?",
    options: [
      "GL 04-06 only",
      "GL 15-17 only",
      "GL 01-03 only",
      "GL 07-10"
    ],
    correctAnswer: 3,
    explanation: "The competitive entry examination principally screens candidates seeking appointment into officer ranks on GL 07-10.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "psr-ch2-008",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020102",
    question: "What qualification is specified for the GL 07-10 entry examination, subject to the Schemes of Service?",
    options: [
      "An appropriate Honours Degree or Higher National Diploma",
      "An appropriate Ordinary National Diploma with five years' experience",
      "A Nigeria Certificate in Education with at least a Merit pass",
      "Five credits at SSCE level including English Language and Mathematics"
    ],
    correctAnswer: 0,
    explanation: "Entry on GL 07-10 requires a minimum of a recognized University Honours Degree or Higher National Diploma (HND).",
    categories: ["group-gl-06-10"]
  },
  {
    id: "psr-ch2-009",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020103",
    question: "Junior staff recruitment under Rule 020103 covers which grades?",
    options: [
      "GL 01-06",
      "GL 12-14",
      "GL 07-10",
      "GL 15-17"
    ],
    correctAnswer: 0,
    explanation: "Recruitment into junior cadres covers Grade Levels 01 to 06 handled by the Junior Staff Committee.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "psr-ch2-011",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020103",
    question: "Which committee conducts interviews for appointment into junior cadres (GL 01-06)?",
    options: [
      "The Contract Arbitration Committee",
      "The Junior Staff Committee",
      "The Public Accounts Committee",
      "The Revenue Appeal Committee"
    ],
    correctAnswer: 1,
    explanation: "The Junior Staff Committee of each MDA conducts interviews for appointments into junior cadres.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "psr-ch2-014",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020106",
    question: "An officer's incremental date is ordinarily fixed on which dates after the first appointment anniversary?",
    options: [
      "1 February or 1 August",
      "1 January or 1 July",
      "1 March or 1 September",
      "1 April or 1 October"
    ],
    correctAnswer: 1,
    explanation: "Standard public service incremental dates are 1st January and 1st July.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-018",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020108",
    question: "Which form is prescribed for the official Staff Record of Service?",
    options: [
      "LS/ESTAB Form No. 4",
      "LS/ESTAB Form No. 6",
      "LS/ESTAB Form No. 1",
      "LS/ESTAB Form No. 9"
    ],
    correctAnswer: 2,
    explanation: "LS/ESTAB Form No. 1 is the prescribed document for staff records of service.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-020",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020108",
    question: "What is the status of the date of birth recorded on appointment?",
    options: [
      "It may be adjusted by the officer's supervisor informally",
      "It may be replaced whenever retirement approaches",
      "It must not be changed throughout the officer's career",
      "It may be changed at every promotion"
    ],
    correctAnswer: 2,
    explanation: "Under Rule 020108, the date of birth declared on first appointment remains inviolate and cannot be changed throughout an officer's service career.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-021",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020108",
    question: "Changing the recorded date of birth contrary to Rule 020108 constitutes what?",
    options: [
      "An authorised leave adjustment",
      "A routine record update",
      "Serious misconduct",
      "A promotion requirement"
    ],
    correctAnswer: 2,
    explanation: "Attempting to change or forge date of birth constitutes Serious Misconduct carrying dismissal penalty.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-027",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020205",
    question: "What is the ordinary minimum appointment age under Rule 020205?",
    options: [
      "21 years",
      "18 years",
      "25 years",
      "16 years"
    ],
    correctAnswer: 1,
    explanation: "The minimum entry age for pensionable civil service employment is 18 years.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-028",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020205",
    question: "What is the ordinary maximum appointment age under Rule 020205, apart from contract/part-time exceptions?",
    options: [
      "65 years",
      "55 years",
      "50 years",
      "45 years"
    ],
    correctAnswer: 1,
    explanation: "Rule 020205 specifies 55 years as the general ceiling for pensionable direct appointment.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-035",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020209",
    question: "Who must sign the Oath of Secrecy under Rule 020209 upon entry into the Public Service?",
    options: [
      "All officers and temporary staff",
      "Only confirmed accountants",
      "Only Permanent Secretaries",
      "Only contract officers from abroad"
    ],
    correctAnswer: 0,
    explanation: "Every officer, permanent employee, and temporary staff must execute the statutory Oath of Secrecy.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-037",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020301",
    question: "What is the normal probationary period for pensionable officers?",
    options: [
      "Five years",
      "Six weeks",
      "Four years",
      "Two years"
    ],
    correctAnswer: 3,
    explanation: "The normal probationary period before confirmation of appointment is two (2) years.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-040",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020303",
    question: "Which examination is specified for Clerical Grade Officers on probation?",
    options: [
      "The Combined Promotion/Confirmation Examination",
      "The Senior Staff Qualifying Examination",
      "The Civil Service Commission Aptitude Test",
      "The Higher Clerical Proficiency Examination"
    ],
    correctAnswer: 0,
    explanation: "Clerical cadre staff on probation take the Combined Confirmation/Promotion Examination.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "psr-ch2-046",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020403",
    question: "What is the normal contract tour under Rule 020403 for contract staff?",
    options: [
      "Five years without renewal",
      "One year, renewable indefinitely",
      "Two years, renewable once",
      "Ten years, renewable twice"
    ],
    correctAnswer: 2,
    explanation: "Contract tours ordinarily run for two (2) years, renewable once upon satisfactory performance.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-058",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020501",
    question: "What is secondment under Public Service Rules Chapter 2?",
    options: [
      "Temporary release to another approved body or recognised international organisation",
      "Permanent release to another approved body or recognised international organisation",
      "Temporary posting to another department within the same ministry",
      "Temporary release on full pay to pursue a course of study abroad"
    ],
    correctAnswer: 0,
    explanation: "Secondment is the formal temporary release of an officer to an approved body or agency.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-059",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020502",
    question: "What is transfer under Public Service Rules Chapter 2?",
    options: [
      "Temporary release from one scheduled service to another",
      "Permanent movement between two departments in the same scheduled service",
      "Permanent release from a scheduled service to an unscheduled body",
      "Permanent release from one scheduled service to another"
    ],
    correctAnswer: 3,
    explanation: "Transfer is the permanent release from one scheduled service to another.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-060",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020503",
    question: "What is conversion under Public Service Rules Chapter 2?",
    options: [
      "Movement from one cadre to another on obtaining prerequisite additional qualifications",
      "Permanent release from one scheduled service to another without any change of cadre",
      "Movement from one grade level to the next higher grade level in the same cadre",
      "Movement from one department to another in the same cadre after additional experience"
    ],
    correctAnswer: 0,
    explanation: "Conversion refers to movement between different professional cadres upon obtaining required qualifications.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-064",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020501",
    question: "An officer's own-request secondment normally lasts how long initially?",
    options: [
      "Ten years",
      "Four years",
      "Two years",
      "Six months"
    ],
    correctAnswer: 2,
    explanation: "Own-request secondment is initially granted for a period of two (2) years.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-075",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020601",
    question: "What is the minimum maturity time in post for promotion consideration at GL 01-06?",
    options: [
      "Three years",
      "Four years",
      "One year",
      "Two years"
    ],
    correctAnswer: 3,
    explanation: "Officers on GL 01-06 become eligible for promotion consideration after two (2) years in post.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "psr-ch2-076",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020601",
    question: "What is the minimum maturity time in post for promotion consideration at GL 07-14?",
    options: [
      "Three years",
      "Five years",
      "Two years",
      "One year"
    ],
    correctAnswer: 0,
    explanation: "Officers on GL 07 to 14 require three (3) years maturity on their current grade.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "psr-ch2-077",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020601",
    question: "What is the minimum maturity time in post for promotion consideration at GL 15-17?",
    options: [
      "Four years",
      "Three years",
      "Two years",
      "Six years"
    ],
    correctAnswer: 0,
    explanation: "Officers on GL 15, 16, and 17 must serve a minimum of four (4) years before promotion consideration.",
    categories: ["group-gl-15-16"]
  },
  {
    id: "psr-ch2-085",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020605",
    question: "What are the normal effective dates of promotion in the Public Service?",
    options: [
      "1 May or 1 November",
      "1 March or 1 September",
      "Every officer's birthday",
      "1 January or 1 July"
    ],
    correctAnswer: 3,
    explanation: "Normal effective dates for promotion are either 1st January or 1st July.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "psr-ch2-090",
    chapter: "PSR Chapter 2",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 2, Rule 020810",
    question: "What is the general statutory retirement ceiling in this edition of the Public Service Rules?",
    options: [
      "60 years of age or 30 years of pensionable service, whichever is earlier",
      "60 years of age or 35 years of pensionable service, whichever is earlier",
      "65 years of age or 35 years of pensionable service, whichever is earlier",
      "60 years of age or 35 years of pensionable service, whichever is later"
    ],
    correctAnswer: 1,
    explanation: "Retirement is compulsory on attaining 60 years of age or 35 years of pensionable service, whichever is earlier.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },

  // ==========================================
  // PSR CHAPTER 4: DISCIPLINE, MISCONDUCT, QUERIES
  // ==========================================
  {
    id: "psr-ch4-001",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040101",
    question: "What is the ordinary completion period for disciplinary procedures, apart from criminal cases or exceptional circumstances?",
    options: [
      "One year",
      "Six months",
      "Seven days",
      "60 days"
    ],
    correctAnswer: 3,
    explanation: "Disciplinary procedures must ordinarily be investigated and determined within 60 days.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-002",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040201",
    question: "Under Chapter 4's general principles, interdiction should ordinarily last no longer than what period?",
    options: [
      "One month, except in peculiar cases",
      "Three months, except in peculiar cases",
      "Six months, except in peculiar cases",
      "Two months, except in peculiar cases"
    ],
    correctAnswer: 3,
    explanation: "Interdiction is an interim measure and should not ordinarily exceed two (2) months.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-003",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040202",
    question: "Under the general disciplinary principles, suspension without pay should not exceed what period?",
    options: [
      "Six years",
      "Twelve months",
      "Three months",
      "Three years"
    ],
    correctAnswer: 2,
    explanation: "Suspension without pay should not exceed three (3) months.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-009",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040301",
    question: "For which grades have Permanent Secretaries/MDA heads received full delegated disciplinary powers?",
    options: [
      "GL 07-12",
      "GL 13-17",
      "GL 01-06",
      "GL 15-17 only"
    ],
    correctAnswer: 2,
    explanation: "Permanent Secretaries possess full delegated disciplinary power over junior staff on GL 01-06.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-010",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040302",
    question: "Disciplinary recommendations concerning GL 07-12 should be sent where?",
    options: [
      "Directly to the Commission for ratification",
      "Only to the employee's professional association",
      "Only to the employee's bank",
      "Only to the Junior Staff Committee for final approval"
    ],
    correctAnswer: 0,
    explanation: "Recommendations on GL 07-12 are sent directly to the Civil Service Commission for statutory ratification.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-011",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040303",
    question: "Personnel Management Board proceedings for GL 13 and above are endorsed to the Commission through whom?",
    options: [
      "The Revenue Collector",
      "The Head of Service",
      "The Chief Driver",
      "The contractor's consultant"
    ],
    correctAnswer: 1,
    explanation: "Disciplinary matters for GL 13 and above are submitted to the Commission through the Head of Service.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-020",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040304",
    question: "Before removal proceedings for inefficiency, which warning requirement is stated as an alternative to loss/deferment of increment?",
    options: [
      "Two or more previous written warnings",
      "Five or more previous written warnings",
      "One previous written warning and a query",
      "Three or more previous written warnings"
    ],
    correctAnswer: 3,
    explanation: "Removal for general inefficiency requires at least three (3) recorded written warnings.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-028",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040401",
    question: "How is misconduct defined under Rule 040401?",
    options: [
      "A series of omissions that cumulatively show an inability to discharge duties",
      "A general decline in standards of performance established through appraisal",
      "A breach of the Constitution punishable only by the courts",
      "A specific act of wrongdoing or improper behaviour that can be investigated and proved"
    ],
    correctAnswer: 3,
    explanation: "Misconduct is a specific act of improper behaviour that can be investigated and proved.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-040",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040406",
    question: "What is the minimum membership of a Board of Inquiry under Rule 040406?",
    options: [
      "Three persons",
      "Two persons",
      "One person",
      "Ten persons"
    ],
    correctAnswer: 0,
    explanation: "A Board of Inquiry must consist of not less than three (3) persons.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-041",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040406",
    question: "Who must not be a member of the Board of Inquiry into the officer's case?",
    options: [
      "The officer's Head of Department",
      "Any person appointed as chairman",
      "Every person of equivalent status",
      "Every officer outside the department"
    ],
    correctAnswer: 0,
    explanation: "The officer's Head of Department is disqualified to ensure impartiality.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-064",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040503",
    question: "What is the minimum proportion of pay stated for an interdicted officer?",
    options: [
      "One tenth",
      "No pay in every case",
      "One quarter",
      "One half"
    ],
    correctAnswer: 3,
    explanation: "An interdicted officer is entitled to not less than one-half (50%) of their pay.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch4-073",
    chapter: "PSR Chapter 4",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 4, Rule 040508",
    question: "What is the ultimate disciplinary penalty for serious misconduct?",
    options: [
      "A routine transfer",
      "An annual increment",
      "Dismissal",
      "Proportionate leave"
    ],
    correctAnswer: 2,
    explanation: "Dismissal is the ultimate penalty for serious misconduct in the Public Service.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },

  // ==========================================
  // PSR CHAPTER 12: LEAVE REGULATIONS
  // ==========================================
  {
    id: "psr-ch12-001",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120101",
    question: "What is leave under Rule 120101?",
    options: [
      "Authorised absence from duty for a specified period",
      "An approved period of reduced duty hours granted to an officer on request",
      "Unauthorised absence from duty that is later regularised by the Permanent Secretary",
      "A period of paid rest to which every officer is entitled after each promotion"
    ],
    correctAnswer: 0,
    explanation: "Leave is an authorized absence from official duties for a specified timeframe.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-006",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120106",
    question: "What period constitutes the leave year in the Public Service?",
    options: [
      "1 January to 31 December of the same year",
      "1 April to 31 March",
      "The officer's birthday to the next birthday",
      "1 July to 30 June"
    ],
    correctAnswer: 0,
    explanation: "The leave year runs from 1st January to 31st December.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-012",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120206",
    question: "Annual vacation leave is calculated using which days?",
    options: [
      "Only public holidays",
      "Only Saturdays",
      "Every calendar day without exception",
      "Working days only"
    ],
    correctAnswer: 3,
    explanation: "Annual leave is counted strictly in working days, excluding weekends and public holidays.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-015",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120208",
    question: "What is the annual leave entitlement for officers on GL 08 and above?",
    options: [
      "30 working days",
      "45 working days",
      "21 working days",
      "14 working days"
    ],
    correctAnswer: 0,
    explanation: "Officers on GL 08 and above enjoy thirty (30) working days annual vacation leave.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-016",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120208",
    question: "What is the annual leave entitlement for officers on GL 04-07?",
    options: [
      "21 working days",
      "14 working days",
      "10 working days",
      "30 working days"
    ],
    correctAnswer: 0,
    explanation: "Officers on GL 04 to 07 are entitled to twenty-one (21) working days annual leave.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "psr-ch12-057",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120231",
    question: "What is the ordinary annual aggregate for casual leave under the specific casual-leave rules?",
    options: [
      "Twenty-one working days",
      "Thirty working days",
      "Twelve weeks",
      "Five working days"
    ],
    correctAnswer: 3,
    explanation: "Casual leave must not exceed five (5) working days in an aggregate leave year.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-062",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120234",
    question: "What maternity entitlement applies to the first two deliveries in this edition?",
    options: [
      "24 weeks with full pay",
      "Four working weeks",
      "12 weeks without pay in every case",
      "10 working days"
    ],
    correctAnswer: 0,
    explanation: "Female officers receive twenty-four (24) weeks maternity leave on full pay for their first two deliveries.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-063",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120234",
    question: "What maternity duration applies to third and subsequent deliveries in this edition?",
    options: [
      "10 days",
      "24 weeks",
      "Two years",
      "12 weeks"
    ],
    correctAnswer: 3,
    explanation: "For the third and subsequent deliveries, female officers are granted twelve (12) weeks maternity leave.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-074",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120236",
    question: "What is the maximum paternity leave specified in this edition?",
    options: [
      "5 consecutive days",
      "10 consecutive days",
      "7 consecutive days",
      "14 consecutive days"
    ],
    correctAnswer: 1,
    explanation: "Paternity leave is granted for ten (10) consecutive days upon the spouse's delivery.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-080",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120239",
    question: "What is the minimum grade for sabbatical leave under Rule 120239?",
    options: [
      "GL 10 or equivalent",
      "GL 12 or equivalent",
      "GL 15 or equivalent",
      "GL 14 or equivalent"
    ],
    correctAnswer: 2,
    explanation: "Sabbatical leave is available to senior officers on Grade Level 15 and above.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-081",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120239",
    question: "What duration and frequency apply to sabbatical leave for eligible officers?",
    options: [
      "Three months every month",
      "12 months once in five years",
      "Two years every two years",
      "Six months every year"
    ],
    correctAnswer: 1,
    explanation: "Sabbatical leave is granted for up to twelve (12) months once every five (5) years.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-088",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120244",
    question: "What is the normal maximum duration of study leave with pay before extension?",
    options: [
      "Four years",
      "Six years",
      "Ten years",
      "Two years"
    ],
    correctAnswer: 3,
    explanation: "Study leave with pay is initially granted for a maximum of two (2) years.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "psr-ch12-091",
    chapter: "PSR Chapter 12",
    resourceMaterial: "Public Service Rules (PSR 2015), Chapter 12, Rule 120245",
    question: "What is the initial maximum duration of study leave without pay?",
    options: [
      "Four years",
      "Two months",
      "Six months",
      "Ten years"
    ],
    correctAnswer: 0,
    explanation: "Study leave without pay may be granted for an initial period not exceeding four (4) years.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },

  // ==========================================
  // FINANCIAL REGULATIONS: CHAPTERS 1, 3, 4, 6, 20, 25
  // ==========================================
  {
    id: "fr-ch1-001",
    chapter: "Financial Regulations Chapter 1",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 1, FR 101",
    question: "According to FR 101, what are Financial Authorities?",
    options: [
      "Rules that fix the salary scales and allowances of public officers",
      "Legal instruments that empower and guide public officers in carrying out financial transactions",
      "Books of account in which public officers record receipts and payments of government",
      "Officially approved forms bearing Treasury numbers used by ministries"
    ],
    correctAnswer: 1,
    explanation: "FR 101 defines financial authorities as legal instruments empowering public officers to receive, safe-keep, and disburse public funds and stores.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "fr-ch1-003",
    chapter: "Financial Regulations Chapter 1",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 1, FR 103",
    question: "Under FR 103, no payments shall be made from public funds except on the authority of what?",
    options: [
      "A warrant duly issued and signed by the Minister of Finance",
      "A circular duly issued and signed by the Head of Service",
      "An authority duly issued and signed by the Accountant-General",
      "A resolution duly passed and signed by the Executive Council"
    ],
    correctAnswer: 0,
    explanation: "FR 103 mandates that no payment shall be made except on the authority of a warrant signed by the Minister of Finance.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "fr-ch1-006",
    chapter: "Financial Regulations Chapter 1",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 1, FR 106",
    question: "Who is designated as the Head of the State Treasury and Accounting Services under Lagos State Financial Regulations (FR 106)?",
    options: [
      "The Auditor-General of Lagos State / Permanent Secretary, Office of the Auditor-General",
      "The Accountant-General of Lagos State / Permanent Secretary State Treasury Office (STO)",
      "The Commissioner for Finance / Permanent Secretary, Ministry of Finance",
      "The Head of the Civil Service of Lagos State / Permanent Secretary, Establishments"
    ],
    correctAnswer: 1,
    explanation: "FR 106 designates the Accountant-General of Lagos State (Permanent Secretary State Treasury Office) as the Chief Accounting Officer and Head of State Treasury Services.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "fr-ch1-011",
    chapter: "Financial Regulations Chapter 1",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 1, FR 111",
    question: "Under Financial Regulation 111, the term 'Accounting Officer' means who?",
    options: [
      "The Commissioner or Political Head of the ministry",
      "The Permanent Secretary or Head of Extra-Ministerial Office",
      "The Accountant-General or Head of Finance and Accounts of the ministry",
      "The Director of Administration of the ministry or extra-ministerial office"
    ],
    correctAnswer: 1,
    explanation: "FR 111 defines the Accounting Officer as the Permanent Secretary of a ministry or head of an extra-ministerial office.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "fr-ch1-017",
    chapter: "Financial Regulations Chapter 1",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 1, FR 117",
    question: "According to FR 117, any directive to the Accounting Officer by a Political Head having financial implications must be in what form?",
    options: [
      "Oral discussion",
      "In writing",
      "Anonymous email",
      "Informal note"
    ],
    correctAnswer: 1,
    explanation: "FR 117 requires all directives from a Political Head carrying financial implications to be conveyed in writing.",
    categories: ["group-gl-15-16"]
  },
  {
    id: "fr-ch1-025",
    chapter: "Financial Regulations Chapter 1",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 1, FR 125",
    question: "Under FR 125, is an officer relieved of pecuniary responsibility when delegating functions to a subordinate?",
    options: [
      "Yes; delegating in writing transfers full pecuniary responsibility to the subordinate",
      "No; an officer delegating functions is not thereby relieved of that responsibility",
      "Yes, but only where the subordinate is on a higher grade level than the officer",
      "No, but the officer is relieved after the subordinate's first annual audit"
    ],
    correctAnswer: 1,
    explanation: "FR 125 affirms that delegation does not relieve an officer of their statutory financial responsibility.",
    categories: ["group-gl-06-10", "group-gl-15-16"]
  },
  {
    id: "fr-ch3-002",
    chapter: "Financial Regulations Chapter 3",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 3, FR 302",
    question: "From which fund is Recurrent Expenditure paid under Financial Regulation 302?",
    options: [
      "The Development Fund",
      "The Consolidated Revenue Fund (CRF)",
      "The Contingencies Fund",
      "The Federation Account"
    ],
    correctAnswer: 1,
    explanation: "FR 302 provides that recurrent expenditure is paid from the Consolidated Revenue Fund under warrant signed by the Minister of Finance.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch3-003",
    chapter: "Financial Regulations Chapter 3",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 3, FR 303",
    question: "A Provisional General Warrant under FR 303 authorizes expenditure for what maximum duration pending the Appropriation Act?",
    options: [
      "A period not exceeding three (3) months",
      "A period not exceeding nine (9) months",
      "A period not exceeding six (6) months",
      "A period not exceeding twelve (12) months"
    ],
    correctAnswer: 2,
    explanation: "FR 303 limits a Provisional General Warrant to a period not exceeding six (6) months.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch3-009",
    chapter: "Financial Regulations Chapter 3",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 3, FR 309",
    question: "Which warrant is issued under FR 309 when additional provision is needed under one sub-head and equivalent savings exist in another sub-head of the same Head?",
    options: [
      "Supplementary General Warrant",
      "Virement Warrant",
      "Imprest Warrant",
      "Contingencies Warrant"
    ],
    correctAnswer: 1,
    explanation: "FR 309 defines the Virement Warrant as the authority to transfer savings between sub-heads of the same Head.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch3-016",
    chapter: "Financial Regulations Chapter 3",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 3, FR 316(iii)",
    question: "Under FR 316(iii), is virement permitted between a Recurrent Expenditure Head and a Capital Expenditure Head?",
    options: [
      "Virement from Recurrent to Capital is allowed with the approval of the Accountant-General",
      "Virement between Recurrent and Capital is allowed only within the same Head of Expenditure",
      "Virement from Recurrent to Capital or vice versa shall not be allowed",
      "Virement from Capital to Recurrent is allowed, but not from Recurrent to Capital"
    ],
    correctAnswer: 2,
    explanation: "FR 316(iii) explicitly forbids virement between Recurrent and Capital expenditure heads.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch3-018",
    chapter: "Financial Regulations Chapter 3",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 3, FR 318",
    question: "From which fund is Capital Expenditure paid under Financial Regulation 318?",
    options: [
      "Consolidated Revenue Fund",
      "Development Fund",
      "Contingencies Fund",
      "Treasury Clearance Fund"
    ],
    correctAnswer: 1,
    explanation: "FR 318 states that Capital Expenditure is charged upon the Development Fund under warrant signed by the Minister of Finance.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch4-002",
    chapter: "Financial Regulations Chapter 4",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 4, FR 402",
    question: "Under FR 402, what accounting record must every officer controlling a vote maintain to record all expenditure and liabilities?",
    options: [
      "Departmental Vote Book",
      "Cheque Summary Register",
      "Station Diary",
      "Imprest Ledger"
    ],
    correctAnswer: 0,
    explanation: "FR 402 mandates that every officer controlling a vote must maintain an up-to-date Departmental Vote Book.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "fr-ch4-005",
    chapter: "Financial Regulations Chapter 4",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 4, FR 405",
    question: "When an Accounting Officer authorizes another officer to incur expenditure on his behalf, which document is issued under FR 405?",
    options: [
      "General Warrant supported by the Annual Estimates",
      "Authority to Incur Expenditure (A.I.E) supported by cash backing",
      "Cheque Order Form supported by a copy of the vote book",
      "Provisional Warrant supported by the Appropriation Law"
    ],
    correctAnswer: 1,
    explanation: "FR 405 provides for the issuance of an Authority to Incur Expenditure (A.I.E) backed with cash allocation.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "fr-ch4-007",
    chapter: "Financial Regulations Chapter 4",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 4, FR 407",
    question: "Under FR 407, all vouchers, indents, and contracts must be stamped with what before payment is authorized?",
    options: [
      "RECORDED IN COMMITMENT REGISTER",
      "ENTERED IN VOTE BOOK",
      "PASSED FOR PAYMENT",
      "CHECKED AND VERIFIED"
    ],
    correctAnswer: 1,
    explanation: "FR 407 requires all commitment documents to be stamped 'ENTERED IN VOTE BOOK' and initialled.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "fr-ch4-011",
    chapter: "Financial Regulations Chapter 4",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 4, FR 411",
    question: "What is the minimum rank of an officer authorized to sign payment vouchers under FR 411?",
    options: [
      "Accountant II or Higher Executive Officer (Accounts) - GL 08",
      "Accountant I or Senior Executive Officer (Accounts) - GL 09",
      "Executive Officer (Accounts) - GL 07",
      "Higher Accounts Clerk - GL 06"
    ],
    correctAnswer: 1,
    explanation: "FR 411 states officers signing payment vouchers shall not be below the rank of Accountant I or Senior Executive Officer (Accounts).",
    categories: ["group-gl-06-10"]
  },
  {
    id: "fr-ch4-013",
    chapter: "Financial Regulations Chapter 4",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 4, FR 413",
    question: "What happens to recurrent expenditure warrant authorities at the end of the financial year under FR 413?",
    options: [
      "They remain valid for the first quarter of the next year and unspent balances are revoted",
      "They lapse at the end of the financial year and unspent balances cannot be revoted",
      "They lapse at the end of the financial year but unspent balances are automatically revoted",
      "They remain valid until the Accountant-General cancels them in writing"
    ],
    correctAnswer: 1,
    explanation: "FR 413 provides that all recurrent expenditure warrants lapse at the end of the financial year; unspent funds cannot be revoted.",
    categories: ["group-gl-06-10"]
  },
  {
    id: "fr-ch6-004",
    chapter: "Financial Regulations Chapter 6",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 6, FR 604 & FR 3008",
    question: "Under FR 604 and 3008, what is strictly forbidden in preparing payment vouchers and accounting documents?",
    options: [
      "Writing in black ink, initialling corrections, and using a ruler to cross out errors",
      "Typing particulars, signing in ink, and using a rubber stamp for certificates",
      "Writing in pencil, erasures, and using correction fluid (Tippex / Liquid Paper)",
      "Writing in ballpoint pen, cancelling errors with a single line, and initialling them"
    ],
    correctAnswer: 2,
    explanation: "FR 604 and FR 3008 strictly prohibit pencil writing, erasures, and correction fluid on vouchers and accounting books.",
    categories: ["group-gl-12-14"]
  },
  {
    id: "fr-ch6-006",
    chapter: "Financial Regulations Chapter 6",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 6, FR 606",
    question: "What rule governs the signing of original payment vouchers under FR 606?",
    options: [
      "Originals and duplicates shall be signed in pencil; facsimile signature stamps shall be used for convenience",
      "Only originals shall be signed in full in ink or ball pens; facsimile signature stamps shall NOT be used",
      "Only duplicates shall be signed in full in ink; facsimile signature stamps may be used on originals",
      "Originals may be signed by an initial in ink; facsimile signature stamps are permitted for senior officers"
    ],
    correctAnswer: 1,
    explanation: "FR 606 mandates full signatures in ink on originals and forbids facsimile signature stamps.",
    categories: ["group-gl-12-14"]
  },
  {
    id: "fr-ch6-009",
    chapter: "Financial Regulations Chapter 6",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 6, FR 609",
    question: "Under FR 609, what is the maximum duration a payment voucher may be held in the Checking Section?",
    options: [
      "Not more than twenty-four (24) hours",
      "Not more than forty-eight (48) hours",
      "Not more than seventy-two (72) hours",
      "Not more than seven (7) days"
    ],
    correctAnswer: 1,
    explanation: "FR 609(iii) requires payment vouchers in the checking section to be dealt with within 48 hours.",
    categories: ["group-gl-12-14"]
  },
  {
    id: "fr-ch6-011",
    chapter: "Financial Regulations Chapter 6",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 6, FR 611",
    question: "Under FR 611, what is the validity period of a signed payment voucher before it becomes stale?",
    options: [
      "Not more than three (3) months",
      "Not more than one (1) month",
      "Not more than six (6) months",
      "Not more than twelve (12) months"
    ],
    correctAnswer: 0,
    explanation: "FR 611(c) states that payment vouchers signed by the controlling officer are valid for not more than three (3) months.",
    categories: ["group-gl-12-14"]
  },
  {
    id: "fr-ch6-014",
    chapter: "Financial Regulations Chapter 6",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 6, FR 614",
    question: "Where a payee on a voucher is an illiterate, how must the payment be attested under FR 614?",
    options: [
      "The mark must be witnessed by the paying officer and one other literate official",
      "The mark must be witnessed by a literate official other than the paying officer",
      "The mark must be witnessed by a relative of the payee who can read and write",
      "The mark must be countersigned by the officer controlling the vote"
    ],
    correctAnswer: 1,
    explanation: "FR 614 requires an illiterate payee's mark to be witnessed by a literate official other than the paying officer.",
    categories: ["group-gl-12-14"]
  },
  {
    id: "fr-ch6-032",
    chapter: "Financial Regulations Chapter 6",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 6, FR 632 & Chapter 31, FR 3128",
    question: "Under FR 632 and 3128, how are public payments made and what is the sanction for making unauthorized cash/cheque payments?",
    options: [
      "Cheques are preferred, and cash is allowed up to a limit set by the Accountant-General; violation is Minor Misconduct",
      "The use of cheques and cash is prohibited under the e-payment policy; violation is Gross Misconduct",
      "Cash and cheques may be used with the approval of the Accounting Officer; violation is General Inefficiency",
      "Cash payments are allowed to individuals but prohibited for firms; violation is Gross Misconduct"
    ],
    correctAnswer: 1,
    explanation: "FR 632 and FR 3128 prohibit cash/cheque payments under the e-payment framework; violation is Gross Misconduct.",
    categories: ["group-gl-12-14"]
  },
  {
    id: "fr-ch20-001",
    chapter: "Financial Regulations Chapter 20",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 20, FR 2001",
    question: "Under FR 2001, which official log book must be maintained for each government vehicle?",
    options: [
      "Vehicle Log-Book (Gen. 59)",
      "Vehicle Log-Book (Gen. 51)",
      "Vehicle Log-Book (Gen. 62)",
      "Vehicle Log-Book (Gen. 73)"
    ],
    correctAnswer: 0,
    explanation: "FR 2001(c) prescribes the Vehicle Log-Book (Gen. 59) for journey authorizations and monitoring.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch20-002",
    chapter: "Financial Regulations Chapter 20",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 20, FR 2002",
    question: "What does FR 2002 state regarding the use of official government transport?",
    options: [
      "Official transport may be used for private journeys if the officer pays the prescribed rate",
      "Official transport is to be used on all occasions to facilitate government business but shall not be used for private journeys",
      "Official transport is to be used only for journeys outside the station; local journeys use private cars",
      "Official transport may be used for private journeys with the Permanent Secretary's approval"
    ],
    correctAnswer: 1,
    explanation: "FR 2002 states official transport must be used solely to facilitate government business and strictly not for private journeys.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch20-012",
    chapter: "Financial Regulations Chapter 20",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 20, FR 2012",
    question: "When an accident occurs involving a government vehicle, what must the driver NOT do at the scene under FR 2012?",
    options: [
      "Give his name and address to the police",
      "Admit liability to any member of the public or make statements admitting fault",
      "State the identification mark of his vehicle",
      "Report to his Head of Department"
    ],
    correctAnswer: 1,
    explanation: "FR 2012(ii) strictly prohibits the driver from admitting liability to any member of the public.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch20-014",
    chapter: "Financial Regulations Chapter 20",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 20, FR 2014",
    question: "Who is designated under FR 2014 to inspect and assess damage to a government vehicle involved in an accident?",
    options: [
      "A Transport Officer requested from the Ministry of Transportation",
      "A Mechanical Engineer requested from the Ministry of Works",
      "A motor assessor requested from the vehicle's insurance company",
      "A garage manager requested from the approved repairer"
    ],
    correctAnswer: 1,
    explanation: "FR 2014 requires a Mechanical Engineer from the Ministry of Works to inspect vehicle damage.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch20-018",
    chapter: "Financial Regulations Chapter 20",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 20, Endnote (Road Traffic Act)",
    question: "Under Section 23 of the Road Traffic Act and FR Chapter 20, within what time must a vehicle accident be reported to the nearest Police Station?",
    options: [
      "Within 24 hours of occurrence",
      "Within 12 hours of occurrence",
      "Within 48 hours of occurrence",
      "Within 7 days of occurrence"
    ],
    correctAnswer: 0,
    explanation: "Section 23 of the Road Traffic Act mandates reporting the accident to the nearest Police Station within 24 hours.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "fr-ch25-001",
    chapter: "Financial Regulations Chapter 25",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 25, FR 2501",
    question: "What is a loss or shortage of funds defined as under FR 2501?",
    options: [
      "A shortfall between estimated and actual revenue at the end of the financial year due to under-collection",
      "A depletion of government fund at a given time due to misappropriation, falsification, conversion, theft or negligence",
      "A delay in the remittance of collected revenue to the Treasury by a revenue collector",
      "An excess of expenditure over the approved provision of a sub-head at any given time"
    ],
    correctAnswer: 1,
    explanation: "FR 2501 defines loss of funds as a depletion arising from misappropriation, falsification, theft, conversion, or negligence.",
    categories: ["group-gl-15-16"]
  },
  {
    id: "fr-ch25-002",
    chapter: "Financial Regulations Chapter 25",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 25, FR 2502",
    question: "Where a cash loss of N50,000 or below occurs without fraud or theft, what power does an Accounting Officer have under FR 2502?",
    options: [
      "Surcharge the officer responsible up to the full amount, provided the officer is not above Grade Level 10",
      "Surcharge the officer responsible up to half the amount, provided the officer is not above Grade Level 10",
      "Surcharge the officer responsible up to the full amount, provided the officer is not above Grade Level 12",
      "Write off the loss without surcharge, provided the officer is not above Grade Level 10"
    ],
    correctAnswer: 0,
    explanation: "FR 2502 empowers Accounting Officers to surcharge officers up to GL 10 for non-fraudulent cash losses of N50,000 or below.",
    categories: ["group-gl-15-16"]
  },
  {
    id: "fr-ch25-004",
    chapter: "Financial Regulations Chapter 25",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 25, FR 2504 & Appendix 17",
    question: "On discovery of a loss or shortage of government funds, which statutory form must be initiated under FR 2504?",
    options: [
      "Treasury Form 146 in quintuplicate",
      "Treasury Form 146 in triplicate",
      "Treasury Form 164 in quintuplicate",
      "Treasury Form 416 in duplicate"
    ],
    correctAnswer: 0,
    explanation: "FR 2504 requires the officer in-charge to initiate action immediately on Treasury Form 146 in quintuplicate.",
    categories: ["group-gl-15-16"]
  },
  {
    id: "fr-ch25-024",
    chapter: "Financial Regulations Chapter 25",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 25, FR 2524",
    question: "Under FR 2524, to which account is a discovered loss of funds initially charged pending investigation?",
    options: [
      "Below-the-line Account 1800 (Advances Non-Personal)",
      "Below-the-line Account 1700 (Advances Personal)",
      "Below-the-line Account 2100 (Suspense Deposits)",
      "Below-the-line Account 1900 (Imprest Clearing)"
    ],
    correctAnswer: 0,
    explanation: "FR 2524 specifies charging the loss to Below-the-line Account 1800 (Advances Non-Personal) pending investigation.",
    categories: ["group-gl-15-16"]
  },
  {
    id: "fr-ch25-034",
    chapter: "Financial Regulations Chapter 25",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 25, FR 2534",
    question: "What is the statutory composition of the Permanent Board of Survey and Enquiry under FR 2534?",
    options: [
      "Not fewer than 24 members; President not below salary Grade Level 15 and other members not below GL 12",
      "Not fewer than 12 members; President not below salary Grade Level 15 and other members not below GL 12",
      "Not fewer than 24 members; President not below salary Grade Level 17 and other members not below GL 14",
      "Not fewer than 24 members; President not below salary Grade Level 14 and other members not below GL 10"
    ],
    correctAnswer: 0,
    explanation: "FR 2534 requires a minimum of 24 members, with the President not below GL 15 and others not below GL 12.",
    categories: ["group-gl-15-16"]
  },
  {
    id: "fr-ch25-036",
    chapter: "Financial Regulations Chapter 25",
    resourceMaterial: "Lagos State Financial Regulations / Treasury Guidelines, Chapter 25, FR 2536",
    question: "Under FR 2536, what fair hearing right is guaranteed to an officer under investigation by a Board of Enquiry?",
    options: [
      "Right to be present, question witnesses, and be supplied with copies of documentary evidence",
      "Right to be present and be represented by counsel, but not to question witnesses",
      "Right to receive the Board's report before it is submitted, but not to be present",
      "Right to be present and to nominate a member of the Board to represent his interests"
    ],
    correctAnswer: 0,
    explanation: "FR 2536 mandates that the officer is entitled to be present, cross-examine witnesses, and inspect all evidence beforehand.",
    categories: ["group-gl-15-16"]
  },

  // ==========================================
  // LAGOS STATE PROCUREMENT LAW (2021) & LEADERSHIP
  // ==========================================
  {
    id: "ppa-001",
    chapter: "Public Procurement Law",
    resourceMaterial: "Lagos State Public Procurement Law (2021), Section 22 & FR 2906",
    question: "Under the Public Procurement Law, what certificate must be obtained from the Bureau/Agency before a contract falling within review thresholds can be validly awarded?",
    options: [
      "Certificate of 'No Objection' to award contract",
      "Certificate of 'Completion' of the procurement process",
      "Certificate of 'Fitness' of the successful bidder to receive payment",
      "Certificate of 'Compliance' with the procurement plan"
    ],
    correctAnswer: 0,
    explanation: "Contracts above statutory review thresholds require a Certificate of 'No Objection' to award contract.",
    categories: ["group-gl-06-10", "group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "ppa-002",
    chapter: "Public Procurement Law",
    resourceMaterial: "Lagos State Public Procurement Law (2021), Section 35 & FR 2933",
    question: "What is the maximum statutory mobilization fee payable to a contractor under public procurement guidelines?",
    options: [
      "Shall not exceed 15% of the contract sum, backed by a bank guarantee from a reputable financial institution",
      "Shall not exceed 25% of the contract sum, backed by a bank guarantee from a reputable financial institution",
      "Shall not exceed 15% of the contract sum, backed by a personal guarantee from the contractor's directors",
      "Shall not exceed 10% of the contract sum, paid without any guarantee after award"
    ],
    correctAnswer: 0,
    explanation: "Mobilization fees are capped at 15% and must be secured with an unconditional bank guarantee.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "lead-001",
    chapter: "Management & Leadership",
    resourceMaterial: "Civil Service Leadership & Management Handbook, Section on Delegation of Authority",
    question: "In management and leadership principles, what does effective 'Delegation of Authority' require?",
    options: [
      "Entrusting responsibility and authority while transferring ultimate accountability to the subordinate",
      "Entrusting responsibility and commensurate authority while retaining ultimate managerial accountability",
      "Entrusting responsibility without authority so that the manager retains full control of resources",
      "Entrusting only routine tasks while reserving all decisions and accountability to the manager"
    ],
    correctAnswer: 1,
    explanation: "Delegation involves transferring responsibility and authority while the delegator maintains ultimate accountability.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  },
  {
    id: "lead-002",
    chapter: "Management & Leadership",
    resourceMaterial: "Civil Service Leadership & Management Handbook, Section on Kotter's Change Management",
    question: "Which core step is paramount in Kotter's 8-Step Change Management Model when driving institutional public sector reforms?",
    options: [
      "Creating a sense of urgency and building a guiding coalition",
      "Imposing fines on staff who question changes",
      "Stopping all public communication until projects conclude",
      "Maintaining traditional manual registries indefinitely"
    ],
    correctAnswer: 0,
    explanation: "Kotter's model emphasizes establishing a compelling sense of urgency and building a guiding coalition.",
    categories: ["group-gl-12-14", "group-gl-15-16"]
  }
];

const RAW_QUESTIONS = (() => {
  const seenNorm = new Set();
  const list = [];
  for (const q of [...BASE_QUESTIONS, ...newQuestionsBank]) {
    const norm = (q.question || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!norm || seenNorm.has(norm)) continue;
    seenNorm.add(norm);
    list.push(q);
  }
  return list;
})();

// Helper to expand and guarantee EXACTLY 100 questions per exam session
// with authentic distribution across all prescribed chapters and strictly zero repeated questions
export function get100ExamQuestionsForCategory(category) {
  const categoryId = category.id;
  const targetTotal = Number(category.totalQuestions) || 100;

  // Strict text deduplication of all questions matching this category
  const seenNorm = new Set();
  const pool = [];

  for (const q of RAW_QUESTIONS) {
    if (q.categories && q.categories.includes(categoryId)) {
      const norm = (q.question || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (norm && !seenNorm.has(norm)) {
        seenNorm.add(norm);
        pool.push({
          ...q,
          subjectId: q.subjectId || resolveQuestionSubjectId(q, categoryId)
        });
      }
    }
  }

  // Helper to extract uniform resource material label
  const getMaterial = (q) => String(q.chapter || q.resourceMaterial || 'General Civil Service Regulations').trim();

  // Group unique pool by resource material
  const materialMap = new Map();
  for (const q of pool) {
    const mat = getMaterial(q);
    if (!materialMap.has(mat)) materialMap.set(mat, []);
    materialMap.get(mat).push(q);
  }

  const picked = [];
  const pickedIds = new Set();
  const numMaterials = materialMap.size;
  const baseQuota = Math.max(1, Math.floor(targetTotal / Math.max(1, numMaterials)));

  // Pass 1: Guarantee base quota from each resource material
  for (const [mat, questions] of materialMap.entries()) {
    const quota = Math.min(questions.length, baseQuota);
    for (let i = 0; i < quota; i++) {
      picked.push(questions[i]);
      pickedIds.add(questions[i].id);
    }
  }

  // Pass 2: Round-robin fill across remaining questions until target total (100) is reached
  const remainingByMaterial = [];
  for (const [mat, questions] of materialMap.entries()) {
    const remaining = questions.filter((q) => !pickedIds.has(q.id));
    if (remaining.length > 0) remainingByMaterial.push(remaining);
  }

  while (picked.length < targetTotal && remainingByMaterial.length > 0) {
    let addedInRound = false;
    for (let i = 0; i < remainingByMaterial.length; i++) {
      if (picked.length >= targetTotal) break;
      const list = remainingByMaterial[i];
      if (list.length > 0) {
        const nextQ = list.shift();
        if (!pickedIds.has(nextQ.id)) {
          picked.push(nextQ);
          pickedIds.add(nextQ.id);
          addedInRound = true;
        }
      }
    }
    if (!addedInRound) break;
  }

  // Pass 3: In rare fallback cases, pull from remaining pool
  if (picked.length < targetTotal) {
    for (const q of pool) {
      if (picked.length >= targetTotal) break;
      if (!pickedIds.has(q.id)) {
        picked.push(q);
        pickedIds.add(q.id);
      }
    }
  }

  return picked.slice(0, targetTotal);
}

export const DEFAULT_QUESTIONS = RAW_QUESTIONS.map(q => ({
  ...q,
  subjectId: q.subjectId || resolveQuestionSubjectId(q, q.categories?.[0] || 'group-gl-06-10')
}));