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
      "Family connections and personal recommendations",
      "Political sponsorship and informal interviews",
      "Length of residence alone"
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
      "A colleague's recommendation alone",
      "A verbal assurance from a contractor",
      "An unsigned attendance sheet",
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
      "The Junior Staff Committee acting independently",
      "The State Civil Service Commission or another empowered body",
      "The local revenue collection office",
      "The officer's professional association"
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
      "No educational qualification",
      "A primary school certificate alone",
      "Any informal apprenticeship certificate"
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
      "General Form 57",
      "Form Gen. 74",
      "LS/ESTAB Form No. 1",
      "Treasury Form 15"
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
      "The judicial appointment examination",
      "The pension valuation examination",
      "The annual procurement examination only"
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
      "Automatic termination following study",
      "Permanent release from one scheduled service to another",
      "Movement within a cadre due to added qualifications"
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
      "Movement to a higher step within the same salary scale",
      "Temporary absence for annual leave",
      "Temporary release for an assignment only",
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
      "Permanent retirement from service",
      "Temporary release to a foreign organisation",
      "Movement upward within the same cadre solely by increment"
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
      "55 years of age or 20 years of service",
      "60 years of age or 35 years of pensionable service, whichever is earlier",
      "65 years of age and 40 years of service in every case",
      "70 years of age regardless of service"
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
      "Six months in every case",
      "Two years without review",
      "One week in every case",
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
      "Five newspaper notices",
      "One anonymous complaint",
      "One verbal warning from a colleague",
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
      "Every unsuccessful promotion attempt",
      "An officer's refusal to disclose a password to a stranger",
      "Any request for approved leave",
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
      "Any absence chosen by an officer",
      "Automatic release from all public-service rules",
      "Permanent termination of appointment"
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
      "30 working days",
      "10 consecutive days",
      "12 weeks",
      "24 weeks"
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
      "GL 01",
      "GL 04",
      "GL 15 or equivalent",
      "GL 08"
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
      "Informal departmental notes",
      "Legal instruments that empower and guide public officers in carrying out financial transactions",
      "Commercial bank credit cards",
      "Private vendor contracts"
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
      "An oral request from an accountant",
      "A contractor's commercial invoice",
      "A personal voucher from a cashier"
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
      "The State Auditor-General",
      "The Accountant-General of Lagos State / Permanent Secretary State Treasury Office (STO)",
      "The Chairman of the Civil Service Commission",
      "The Director of Budgets"
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
      "The Honourable Minister",
      "The Permanent Secretary or Head of Extra-Ministerial Office",
      "The Director of Finance and Accounts",
      "The Chief Internal Auditor"
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
      "Yes, completely relieved",
      "No; an officer delegating functions is not thereby relieved of that responsibility",
      "Relieved after 30 days",
      "Only if the subordinate signs a bond"
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
      "The Personal Advances Fund"
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
      "Twelve months",
      "Three months",
      "A period not exceeding six (6) months",
      "One month"
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
      "Yes, freely permitted",
      "Permitted with Auditor-General approval only",
      "Virement from Recurrent to Capital or vice versa shall not be allowed",
      "Permitted in the last month of the year"
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
      "Treasury Form 15",
      "Authority to Incur Expenditure (A.I.E) supported by cash backing",
      "Receipt Book Issue Note",
      "Stores Issue Voucher"
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
      "PAID IN FULL",
      "ENTERED IN VOTE BOOK",
      "TREASURY CLEARED",
      "CHECKED AND PASSED"
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
      "Clerical Officer (GL 04)",
      "Accountant I or Senior Executive Officer (Accounts) - GL 09",
      "Assistant Executive Officer on GL 06",
      "Storekeeper"
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
      "They roll over indefinitely",
      "They lapse at the end of the financial year and unspent balances cannot be revoted",
      "They are converted to an imprest",
      "They transfer to commercial banks"
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
      "Using ballpoint pen",
      "Writing amounts in words and figures",
      "Writing in pencil, erasures, and using correction fluid (Tippex / Liquid Paper)",
      "Typing the vouchers"
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
      "Facsimile signature stamps are encouraged",
      "Only originals shall be signed in full in ink or ball pens; facsimile signature stamps shall NOT be used",
      "Signatures are only needed on copies",
      "Signatures can be written in pencil"
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
      "7 days",
      "Not more than forty-eight (48) hours",
      "14 days",
      "One month"
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
      "Six months",
      "One year",
      "Thirty days"
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
      "The paying officer witnesses the mark alone",
      "The mark must be witnessed by a literate official other than the paying officer",
      "Payment cannot be made to an illiterate",
      "Payment must be made by bank draft"
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
      "Payment is exclusively by cash",
      "The use of cheques and cash is prohibited under the e-payment policy; violation is Gross Misconduct",
      "Payment can be made in any currency",
      "Cheques may be issued without crossing"
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
      "Treasury Form 14",
      "Form Gen. 74",
      "Stores Form 15"
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
      "Official transport may be used for private family shopping on weekends",
      "Official transport is to be used on all occasions to facilitate government business but shall not be used for private journeys",
      "Drivers may operate commercial transport after office hours",
      "Private journeys are allowed with supervisor's verbal consent"
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
      "The driver's personal mechanic",
      "A Mechanical Engineer requested from the Ministry of Works",
      "The local traffic warden",
      "The storekeeper"
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
      "Within seven days",
      "At the end of the month",
      "Within thirty days"
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
      "An approved budgetary variance",
      "A depletion of government fund at a given time due to misappropriation, falsification, conversion, theft or negligence",
      "An unspent balance at the end of the year",
      "A routine bank charge"
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
      "Dismiss the officer without hearing",
      "Ignore the loss if it falls in the current quarter",
      "Report directly to the President"
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
      "Treasury Form 15A",
      "Treasury Book 6A",
      "Form Gen. 59"
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
      "Personal Emoluments Vote",
      "Consolidated Revenue Fund",
      "Contingencies Fund"
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
      "Two junior officers on GL 04",
      "External commercial auditors only",
      "Five storekeepers"
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
      "Right to unilaterally dismiss the panel",
      "Right to withhold all office keys",
      "Right to destroy relevant payment vouchers"
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
      "Certificate of Temporary Clearance",
      "Auditor's Internal Query",
      "Treasury Form 15A"
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
      "50% of the contract sum in cash",
      "100% advance payment without guarantee",
      "35% without any bank guarantee"
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
      "Transferring blame while withholding decision-making authority",
      "Entrusting responsibility and commensurate authority while retaining ultimate managerial accountability",
      "Completely abandoning oversight of the delegated schedule",
      "Delegating only to officers outside the public service"
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
  const isGL0610 = categoryId === "group-gl-06-10";
  const isGL1214 = categoryId === "group-gl-12-14";
  const isGL1516 = categoryId === "group-gl-15-16";

  const seenNorm = new Set();
  const full100 = [];

  // Filter matching base questions and ensure every question has a valid subjectId
  for (const q of RAW_QUESTIONS) {
    if (q.categories && q.categories.includes(categoryId)) {
      const norm = (q.question || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (norm && !seenNorm.has(norm)) {
        seenNorm.add(norm);
        full100.push({
          ...q,
          subjectId: q.subjectId || resolveQuestionSubjectId(q, categoryId)
        });
      }
    }
  }

  // Syllabi definitions for systematic expansion
  const topicsForGL0610 = [
    { ch: "PSR Chapter 2", ref: "PSR Rule 020206", q: "Who certifies an applicant medically fit for employment in the Public Service?", opts: ["A State Government Medical Officer", "The applicant's landlord", "A traditional herbalist", "Any office colleague"], ans: 0, exp: "Rule 020206 requires medical fitness certification by a recognized State Government Medical Officer." },
    { ch: "PSR Chapter 2", ref: "PSR Rule 020207", q: "An applicant with no previous employment should ordinarily obtain a good-conduct testimonial from where?", opts: ["The last school or college attended", "A prospective supplier", "The nearest bank cashier", "A political campaign office"], ans: 0, exp: "Rule 020207 specifies that testimonials for new graduates must originate from the last educational institution attended." },
    { ch: "PSR Chapter 2", ref: "PSR Rule 020401", q: "What is the primary condition for offering a contract appointment to an expatriate?", opts: ["When suitable Nigerians are unavailable", "Whenever an expatriate requests employment", "Only after the expatriate retires abroad", "Only for sub-clerical cadres"], ans: 0, exp: "Rule 020401 permits contract appointments to expatriates only where qualified Nigerian personnel are unavailable." },
    { ch: "PSR Chapter 2", ref: "PSR Rule 020606", q: "What is the purpose of 'Notional Promotion' under Rule 020606?", opts: ["Restoring appropriate seniority after approved absence", "Paying double salary retroactively", "Eliminating vacancies permanently", "Replacing disciplinary proceedings"], ans: 0, exp: "Notional promotion restores an officer's relative seniority upon return from qualifying approved courses or postings." },
    { ch: "PSR Chapter 4", ref: "PSR Rule 040305", q: "Who must be formally notified in all cases when an officer's salary increment is withheld or deferred?", opts: ["The State Accountant-General and State Auditor-General", "The staff cooperative president only", "The officer's bank manager", "The nearest magistrate"], ans: 0, exp: "Rule 040305 requires immediate notification to the Accountant-General and Auditor-General of increment deferment." },
    { ch: "PSR Chapter 4", ref: "PSR Rule 040409", q: "What does Rule 040409 prescribe regarding the imposition of fines as disciplinary punishment in the Public Service?", opts: ["No fine shall be imposed on an officer as punishment", "A fine can be imposed at the discretion of any supervisor", "Fines are deducted from pension funds directly", "Fines replace written queries"], ans: 0, exp: "Rule 040409 strictly forbids the imposition of fines as disciplinary punishment on public servants." },
    { ch: "PSR Chapter 4", ref: "PSR Rule 040410", q: "Under Rule 040410, what is a surcharge intended to address?", opts: ["A revenue or property loss caused by an officer's fault or neglect", "An annual leave penalty", "An automatic fee for promotion screening", "A union dues levy"], ans: 0, exp: "Surcharge is a financial recovery mechanism to make good a loss caused to government through an officer's negligence." },
    { ch: "PSR Chapter 4", ref: "PSR Rule 040502", q: "Which of the following acts is explicitly categorized as Serious Misconduct?", opts: ["Holding more than one full-time paid appointment simultaneously", "Attending an approved official training seminar", "Submitting an accurate medical certificate", "Applying for annual leave in advance"], ans: 0, exp: "Holding dual full-time jobs is an egregious violation categorized as Serious Misconduct." },
    { ch: "PSR Chapter 12", ref: "PSR Rule 120202", q: "What document must an officer submit immediately upon returning to duty after annual vacation leave?", opts: ["An endorsed Resumption of Duty Certificate", "A private travel receipt", "A new job application", "A medical fitness clearance"], ans: 0, exp: "Rule 120202 requires every returning officer to complete and submit an endorsed Resumption of Duty Certificate." },
    { ch: "PSR Chapter 12", ref: "PSR Rule 120215", q: "What happens to annual vacation leave that is not utilized within the leave year and not formally deferred due to service exigency?", opts: ["It is automatically forfeited", "It doubles in the subsequent year", "It converts into cash payment automatically", "It is transferred to a colleague"], ans: 0, exp: "Annual leave not taken within the calendar year and not officially deferred is forfeited." },
    { ch: "PSR Chapter 12", ref: "PSR Rule 120235", q: "What is the duration of Adoption Leave granted to an officer who legally adopts a child under Rule 120235?", opts: ["12 weeks at a stretch with full pay", "5 working days", "Two years without pay", "24 hours only"], ans: 0, exp: "Rule 120235 grants twelve (12) weeks paid adoption leave commencing from the date the baby is legally released." },
    { ch: "PSR Chapter 12", ref: "PSR Rule 120237", q: "How long may the daily 2-hour nursing-mother concession be enjoyed following resumption from maternity leave?", opts: ["Up to six (6) months", "Only one week", "Up to five years", "Two days only"], ans: 0, exp: "Nursing mothers are entitled to 2 hours off duty daily for up to six (6) months following resumption." },
    { ch: "Financial Regulations Chapter 1", ref: "FR 114", q: "Who is responsible under FR 114 for maintaining proper accounting records, main and subsidiary ledgers in an MDA?", opts: ["The Head of Finance and Accounts", "The Storekeeper", "The Internal Auditor", "The Transport Officer"], ans: 0, exp: "FR 114 assigns the maintenance of books of accounts, main and subsidiary ledgers to the Head of Finance and Accounts." },
    { ch: "Financial Regulations Chapter 1", ref: "FR 115", q: "Under FR 115, what is a Sub-Accounting Officer required to maintain?", opts: ["A recognized Cash Book and other accounts prescribed by the Accountant-General", "A private bank account", "An informal diary", "A vehicle log book only"], ans: 0, exp: "FR 115 defines a Sub-Accounting Officer as an officer entrusted with public funds who keeps a recognized Cash Book." },
    { ch: "Financial Regulations Chapter 1", ref: "FR 119", q: "What is a 'Revenue Collector' under Financial Regulation 119?", opts: ["An officer entrusted with official receipt or licence booklets for collection of revenue who maintains a cash book", "A private debt collection contractor", "The driver of the cash vehicle", "The Chairman of the Tenders Board"], ans: 0, exp: "FR 119 defines a Revenue Collector as an officer entrusted with receipt/licence booklets who maintains a revenue cash book." },
    { ch: "Financial Regulations Chapter 3", ref: "FR 304", q: "What authority does the Annual General Warrant convey under Financial Regulation 304?", opts: ["Authorises the Accountant-General to issue funds to pay for personal emoluments and services in the Annual Estimates", "Permits contract awards without tenders", "Allows private commercial borrowing", "Suspends public financial reporting"], ans: 0, exp: "FR 304 provides that the General Warrant authorises the Accountant-General to issue funds provided in the Annual Estimates." },
    { ch: "Financial Regulations Chapter 3", ref: "FR 306", q: "Under what circumstance may a Supplementary (Contingencies) Warrant be issued under FR 306?", opts: ["Where virement is impossible and expenditure is so urgent that delay would seriously injure the public interest", "To buy luxury office furniture", "To pay private contractor bonuses", "To fund political party campaigns"], ans: 0, exp: "FR 306 permits Contingencies Warrants only for exceptional, urgent matters where virement is impossible." },
    { ch: "Financial Regulations Chapter 4", ref: "FR 403", q: "How are liabilities and commitments (such as LPOs and Job Orders) treated in the Vote Book under FR 403?", opts: ["Entered as soon as they are incurred and cleared when payment is effected", "Ignored until cash is paid", "Recorded in pencil on scrap paper", "Kept in a private file by the supplier"], ans: 0, exp: "FR 403 mandates that all liabilities and commitments must be entered immediately in the Vote Book." },
    { ch: "Financial Regulations Chapter 4", ref: "FR 415", q: "What fundamental principle does Lagos State Financial Regulations (FR 415) mandate regarding public spending?", opts: ["Officers must exercise due economy; money must not be spent merely because it has been voted", "Budget votes must be exhausted at all costs before year end", "Funds may be transferred to private accounts", "Expenditure records should be kept secret"], ans: 0, exp: "FR 415 requires due economy: money must never be spent merely because funds have been voted in the estimates." },
    { ch: "Financial Regulations Chapter 4", ref: "FR 420", q: "Before making any payment, what must a Sub-Accounting Officer satisfy himself of under FR 420?", opts: ["That expenditure is authorised by Warrant, voucher is correctly classified, and salary deductions are made", "That the contractor is a personal friend", "That the payment voucher is written in pencil", "That no certificate is signed"], ans: 0, exp: "FR 420 requires the Sub-Accounting Officer to verify warrant authority, correct classification, and statutory deductions." }
  ];

  const topicsForGL1214 = [
    { ch: "PSR Chapter 4", ref: "PSR Rule 040402", q: "If an officer successfully exculpates himself in response to a written query, what action follows under Rule 040402?", opts: ["Written notification is given and no further disciplinary action taken on that query", "A fine is deducted from salary", "The officer is demoted one rank", "The query is forwarded to the police"], ans: 0, exp: "Rule 040402 provides that upon successful exculpation, the officer is notified in writing and the matter is closed." },
    { ch: "PSR Chapter 4", ref: "PSR Rule 040507", q: "Under Rule 040507, when does an order of Suspension apply?", opts: ["Where a serious prima facie case of misconduct has been established against an officer", "Whenever an officer requests vacation leave", "When an office changes location", "Only upon reaching retirement age"], ans: 0, exp: "Suspension applies where a prima facie case of serious misconduct has been established against the officer." },
    { ch: "PSR Chapter 8", ref: "PSR Chapter 8, Allowances", q: "What is the statutory basis for Duty Tour Allowance (DTA) paid to officers on official journeys within Nigeria?", opts: ["It covers boarding and lodging expenses at approved daily rates according to grade levels", "It is an unconditional salary bonus", "It is a taxable entertainment gift", "It must be retired within 3 years"], ans: 0, exp: "DTA is a per diem allowance designed to cover verified lodging and feeding expenses on official tours." },
    { ch: "PSR Chapter 10", ref: "PSR Chapter 10, Rule 100101", q: "Who possesses the statutory authority to constitute a Medical Board to examine an officer's physical or mental fitness for continued service?", opts: ["The Permanent Secretary / Head of Department in consultation with the State Health Board", "The staff union chairman", "The commercial insurance agent", "The officer's family physician"], ans: 0, exp: "Medical Boards are officially convened through the supervising Ministry/Establishment in conjunction with the Health Board." },
    { ch: "PSR Chapter 12", ref: "PSR Rule 120223", q: "Under what specific condition may annual vacation leave be formally deferred to the next leave year under Rule 120223?", opts: ["Due to overriding exigencies of official duties approved in writing by the Permanent Secretary/MDA Head", "Whenever an officer wishes to travel on private vacation next year", "To accumulate leave for terminal cash out", "At the personal discretion of the cashier"], ans: 0, exp: "Leave deferment requires written executive approval demonstrating that official duty exigencies prevented taking leave." },
    { ch: "Financial Regulations Chapter 3", ref: "FR 314", q: "What is the rule under Financial Regulation 314 regarding an unspent balance on a recurrent expenditure vote?", opts: ["An unspent balance on a recurrent expenditure vote cannot be revoted", "It carries over automatically into the new budget", "It is distributed to staff as year-end bonuses", "It is placed in a private savings account"], ans: 0, exp: "FR 314 states that unspent recurrent balances lapse and cannot be revoted in the subsequent year." },
    { ch: "Financial Regulations Chapter 6", ref: "FR 610", q: "Under FR 610, are alterations to the amount of a payment voucher permitted in either words or figures?", opts: ["Alterations to the amount whether in words or figures are NOT allowed; a new voucher must be prepared", "Alterations are allowed if covered with Tippex", "Alterations can be signed by a messenger", "Figures can be crossed out without full signature"], ans: 0, exp: "FR 610 strictly prohibits alterations to the amount on vouchers; any error requires raising a fresh voucher." },
    { ch: "Financial Regulations Chapter 6", ref: "FR 616", q: "Under FR 616, how must all payments to corporate firms and contractors be executed?", opts: ["Only by cheques or electronic mandates crossed 'Account Payee Only' in favour of the firm", "In cash through a third-party courier", "By open bearer cheques", "By promissory notes"], ans: 0, exp: "FR 616 mandates that payments to firms must be made only by crossed cheques or electronic transfers to the firm's account." },
    { ch: "Financial Regulations Chapter 6", ref: "FR 624", q: "Within what period must payment vouchers withdrawn against cash/cheque order forms be returned to the Sub-Treasury or Cash Office under FR 624?", opts: ["Within seven (7) days", "Within 30 days", "Within two months", "At the end of the financial year"], ans: 0, exp: "FR 624 requires vouchers withdrawn against cash orders to be returned receipted or cash refunded within 7 days." },
    { ch: "Financial Regulations Chapter 20", ref: "FR 2004", q: "What does FR 2004 recommend regarding driver allocation to ensure vehicle care and accountability?", opts: ["A particular vehicle should be attached to a particular driver over a period to facilitate accountability", "Any driver should drive any pool vehicle at random", "Private transport operators should take over vehicles", "Vehicles should not have assigned drivers"], ans: 0, exp: "FR 2004 condemns the pool system and mandates attaching specific vehicles to designated drivers." },
    { ch: "Financial Regulations Chapter 20", ref: "FR 2021", q: "Under FR 2021, when may an Accounting Officer dispose of an accident report and order vehicle repairs?", opts: ["When no civil claim against government exists, government will not sue, and funds are available", "Whenever the driver requests it verbally", "Only after five years have elapsed", "Without any technical inspection"], ans: 0, exp: "FR 2021 empowers the Accounting Officer to order repairs when liabilities are clear and repair funds exist." },
    { ch: "Management & Leadership", ref: "Leadership Principles, Module 1", q: "Which leadership style is characterized by empowering team members, setting inspirational vision, and coaching for high performance?", opts: ["Transformational Leadership", "Autocratic Micromanagement", "Laissez-faire Abandonment", "Transactional Penalization"], ans: 0, exp: "Transformational leadership inspires, motivates, and develops public sector teams toward institutional goals." },
    { ch: "Management & Leadership", ref: "Leadership Principles, Module 2", q: "According to Herzberg's Two-Factor Motivation Theory, which factor is a true 'Motivator' rather than a 'Hygiene' factor?", opts: ["Challenging work and recognition for achievement", "Basic salary and job security", "Company administrative policies", "Physical office air conditioning"], ans: 0, exp: "Herzberg identifies recognition, responsibility, and meaningful achievement as true intrinsic motivators." },
    { ch: "Management & Leadership", ref: "Leadership Principles, Module 3", q: "What is the primary danger of failing to delegate authority as a middle/senior manager in a public service department?", opts: ["Operational bottlenecks, burnout, and stunted development of subordinate officers", "Excessive expenditure savings", "Faster file processing", "Reduced audit scrutiny"], ans: 0, exp: "Failure to delegate creates organizational bottlenecks, manager burnout, and prevents junior staff capacity development." }
  ];

  const topicsForGL1516 = [
    { ch: "PSR Chapter 2", ref: "PSR Rule 020601(b)", q: "Which officers are expressly excluded from promotion consideration under Rule 020601(b)?", opts: ["Officers currently under active disciplinary action or interdiction", "Officers who hold postgraduate degrees", "Officers with clean service records", "Officers with approved leave"], ans: 0, exp: "Rule 020601(b) bars officers undergoing disciplinary proceedings from promotion consideration." },
    { ch: "PSR Chapter 6", ref: "PSR Chapter 6, Rule 060101", q: "Under Public Service Rules Chapter 6, to whom does a civil servant address a formal petition against an administrative grievance?", opts: ["Through proper official channels to the Head of Service and Civil Service Commission", "Directly to social media platforms", "To external commercial media", "To private legal contractors"], ans: 0, exp: "Petitions and appeals must follow hierarchical official channels through the Head of Service to the Commission." },
    { ch: "PSR Chapter 10", ref: "PSR Chapter 10, Rule 100201", q: "When an officer is certified by a duly constituted Medical Board to be permanently incapacitated for further service, what procedure follows?", opts: ["Statutory retirement on medical grounds (invalidation) with accrued retirement benefits", "Immediate dismissal without pension", "Compulsory transfer to a remote station", "Conversion to casual contract"], ans: 0, exp: "Medical Board certification of permanent unfitness leads to honorable retirement on grounds of invalidation." },
    { ch: "Financial Regulations Chapter 1", ref: "FR 108", q: "Who is the constitutional officer responsible for audit and reporting on the public accounts of the Federation and all MDAs under FR 108?", opts: ["The Auditor-General for the Federation", "The Accountant-General", "The Minister of Finance", "The Central Bank Governor"], ans: 0, exp: "FR 108 designates the Auditor-General as the independent constitutional authority for public sector audit." },
    { ch: "Financial Regulations Chapter 1", ref: "FR 113", q: "Under FR 113, what annual duty must an Accounting Officer perform regarding procurement records for the Bureau/Agency?", opts: ["Render annual returns of procurement records to the Public Procurement Bureau/Agency", "Destroy all tender files at the end of the year", "Hide contract records from auditors", "Keep procurement records secret for 50 years"], ans: 0, exp: "FR 113(g) mandates rendering annual returns of all procurement records to the Bureau of Public Procurement." },
    { ch: "Financial Regulations Chapter 20", ref: "FR 2027", q: "When an accident renders a government vehicle beyond economic repair, what body must be convened under FR 2027?", opts: ["A Board of Survey under Chapter 26/27 to inspect and recommend boarding and write-off", "A private auctioneer without survey", "The drivers' disciplinary panel", "A commercial insurance broker"], ans: 0, exp: "FR 2027 requires convening a Board of Survey to inspect vehicles beyond economic repair before write-off." },
    { ch: "Financial Regulations Chapter 25", ref: "FR 2505", q: "Under FR 2505, when MUST a formal Board of Enquiry be convened following a loss of public funds?", opts: ["If fraud is probable, the loss is substantial, or collusion among officers is suspected", "Whenever an officer misplaces an empty envelope", "For losses under N500", "Only when the police dismiss the case"], ans: 0, exp: "FR 2505(ii) makes a Board of Enquiry mandatory if fraud is probable, the loss is substantial, or collusion is suspected." },
    { ch: "Financial Regulations Chapter 25", ref: "FR 2515", q: "Under FR 2515, what is the maximum delegated power of write-off of losses granted to the Accountant-General?", opts: ["Up to the value of N200,000 (except losses occurring within his own office)", "Up to N100,000,000", "Unlimited write-off authority", "N10,000 only"], ans: 0, exp: "FR 2515 delegates write-off authority up to N200,000 to the Accountant-General; losses above require the Minister of Finance." },
    { ch: "Financial Regulations Chapter 25", ref: "FR 2522", q: "Where a public officer is convicted by a court for criminal embezzlement of public funds, what civil action must be taken under FR 2522?", opts: ["Liaise with the Attorney-General to explore recovering funds through civil action against the convict's assets", "Waive all recovery efforts", "Pay the officer a retirement bonus", "Destroy the court judgment"], ans: 0, exp: "FR 2522 requires liaising with the Attorney-General to seize assets and recover embezzled public funds." },
    { ch: "Public Procurement Law", ref: "Lagos State Procurement Law (2021), Offences", q: "What penalty applies under Section 3126 of the Regulations and the Procurement Law to an officer convicted of collusive bid-rigging or procurement corruption?", opts: ["Imprisonment of not less than five (5) calendar years without option of fine, and summary dismissal", "A verbal warning from the supervisor", "A small fine of N5,000", "Transfer to another department with full pay"], ans: 0, exp: "Procurement offenses carry a mandatory minimum 5-year prison term without option of fine, plus summary dismissal." }
  ];

  const targetTopics = isGL0610 ? topicsForGL0610 : isGL1214 ? topicsForGL1214 : topicsForGL1516;
  let counter = full100.length + 1;

  for (const t of targetTopics) {
    if (full100.length >= 100) break;
    const norm = (t.q || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm && !seenNorm.has(norm)) {
      seenNorm.add(norm);
      full100.push({
        id: `${categoryId}-t-${counter++}`,
        chapter: t.ch,
        resourceMaterial: `${t.ch} (${t.ref})`,
        question: t.q,
        options: t.opts,
        correctAnswer: t.ans,
        explanation: t.exp,
        categories: [categoryId],
        subjectId: resolveQuestionSubjectId({ chapter: t.ch, resourceMaterial: t.ref, question: t.q }, categoryId)
      });
    }
  }

  // If still need more to reach 100, pull distinct questions from other topics without any repeats
  const otherTopics = [topicsForGL0610, topicsForGL1214, topicsForGL1516].flat();
  for (const t of otherTopics) {
    if (full100.length >= 100) break;
    const norm = (t.q || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm && !seenNorm.has(norm)) {
      seenNorm.add(norm);
      full100.push({
        id: `${categoryId}-ot-${counter++}`,
        chapter: t.ch,
        resourceMaterial: `${t.ch} (${t.ref})`,
        question: t.q,
        options: t.opts,
        correctAnswer: t.ans,
        explanation: t.exp,
        categories: [categoryId],
        subjectId: resolveQuestionSubjectId({ chapter: t.ch, resourceMaterial: t.ref, question: t.q }, categoryId)
      });
    }
  }

  // If still under 100, add from any remaining questions in RAW_QUESTIONS
  for (const q of RAW_QUESTIONS) {
    if (full100.length >= 100) break;
    const norm = (q.question || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm && !seenNorm.has(norm)) {
      seenNorm.add(norm);
      full100.push({
        ...q,
        subjectId: q.subjectId || resolveQuestionSubjectId(q, categoryId)
      });
    }
  }

  return full100.slice(0, 100);
}

export const DEFAULT_QUESTIONS = RAW_QUESTIONS.map(q => ({
  ...q,
  subjectId: q.subjectId || resolveQuestionSubjectId(q, q.categories?.[0] || 'group-gl-06-10')
}));
