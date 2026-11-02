import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BarChart3, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Plus, 
  Trash2, 
  Download, 
  Edit3, 
  Check, 
  Search, 
  Filter, 
  FileText,
  Upload,
  Clock,
  Award,
  Key,
  KeyRound,
  UserCheck,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  ChevronUp,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import CandidateAvatar from './CandidateAvatar';
import { getRegisteredCandidates, resetCandidatePassword, deleteCandidate } from '../data/authData';
import { DEFAULT_GRADE_CATEGORIES } from '../data/gradeLevelCategories';
import { api } from '../api';

export default function AdminPortal({
  gradeCategories,
  setGradeCategories,
  questions,
  setQuestions,
  resources,
  setResources,
  meritHistory
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, categories, questions, resources, merit, candidates

  // Mobile "tap to see more" cards: which table rows are expanded
  const [expandedRows, setExpandedRows] = useState({});
  const toggleRow = (key) => setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  const rowCls = (key, forceOpen = false) => (expandedRows[key] || forceOpen ? 'row-expanded' : '');
  const renderRowToggle = (key) => (
    <button
      type="button"
      className="row-toggle"
      aria-expanded={!!expandedRows[key]}
      aria-label={expandedRows[key] ? 'Show less' : 'Show more'}
      onClick={(e) => { e.stopPropagation(); toggleRow(key); }}
    >
      <ChevronUp size={18} />
    </button>
  );
  
  // Registered Candidates & Password Reset State
  const [registeredCandidates, setRegisteredCandidates] = useState([]);
  const refreshCandidates = () => getRegisteredCandidates().then(setRegisteredCandidates).catch(() => {});
  useEffect(() => { refreshCandidates(); }, []);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [resetModalCandidate, setResetModalCandidate] = useState(null);
  const [adminResetNewPass, setAdminResetNewPass] = useState('');
  const [adminResetConfirmPass, setAdminResetConfirmPass] = useState('');
  const [showAdminResetPass, setShowAdminResetPass] = useState(false);
  const [adminResetSuccess, setAdminResetSuccess] = useState('');
  const [adminResetError, setAdminResetError] = useState('');
  const [copiedUser, setCopiedUser] = useState('');

  // Candidate Deletion State
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isDeletingCandidate, setIsDeletingCandidate] = useState(false);
  const [candidateDeleteNotice, setCandidateDeleteNotice] = useState('');

  // Question Bank Excel Import/Export State
  const excelFileInputRef = React.useRef(null);
  const [isImportingQuestions, setIsImportingQuestions] = useState(false);
  const [excelImportResult, setExcelImportResult] = useState(null);
  
  // Question Bank State
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const safeCategories = Array.isArray(gradeCategories) && gradeCategories.length > 0 ? gradeCategories : DEFAULT_GRADE_CATEGORIES;
  const [newQuestionForm, setNewQuestionForm] = useState({
    categoryId: safeCategories[0]?.id || 'group-gl-06-10',
    gradeLevel: 'GL 06 to 10',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 0,
    explanation: '',
    referenceRule: ''
  });

  // Resource Upload / Ingestion State
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResourceForm, setNewResourceForm] = useState({
    title: '',
    gradeBand: 'GL 06 - 10',
    type: 'Public Service Rules (PSR 2015)',
    format: 'Official Manual',
    summary: '',
    keyChapters: '',
    readingTime: '2 Hours'
  });

  // Category Edit State
  const [editingCategory, setEditingCategory] = useState(null);

  // 1. Add Question Handler
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionForm.question || !newQuestionForm.optionA || !newQuestionForm.optionB) {
      alert("Please fill in the question and options.");
      return;
    }

    const payload = {
      categoryId: newQuestionForm.categoryId,
      gradeLevel: newQuestionForm.gradeLevel,
      question: newQuestionForm.question,
      options: [
        newQuestionForm.optionA,
        newQuestionForm.optionB,
        newQuestionForm.optionC || 'None of the above',
        newQuestionForm.optionD || 'All of the above'
      ],
      correctAnswer: parseInt(newQuestionForm.correctAnswer, 10),
      explanation: newQuestionForm.explanation || 'Verified Civil Service Regulatory Standard.',
      referenceRule: newQuestionForm.referenceRule || 'PSR / FR Rule Citation'
    };

    try {
      const res = await api('/questions', { method: 'POST', body: payload });
      setQuestions(prev => [...res.questions, ...prev]);
    } catch (err) {
      alert(err.message);
      return;
    }

    setShowAddQuestionModal(false);
    setNewQuestionForm({
      categoryId: gradeCategories[0]?.id || '',
      gradeLevel: 'GL 06 to 10',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 0,
      explanation: '',
      referenceRule: ''
    });
    alert("New question successfully added to the Civil Service Question Bank!");
  };

  const handleDeleteQuestion = async (qId) => {
    if (confirm("Are you sure you want to remove this question from the examination bank?")) {
      try {
        await api(`/questions/${encodeURIComponent(qId)}`, { method: 'DELETE' });
        setQuestions(prev => prev.filter(q => q.id !== qId));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // 2. Add Resource Handler (Direct user resource input)
  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newResourceForm.title || !newResourceForm.summary) {
      alert("Please enter title and summary for the study resource.");
      return;
    }

    const createdRes = {
      title: newResourceForm.title,
      categoryIds: [gradeCategories[0]?.id],
      gradeBand: newResourceForm.gradeBand,
      type: newResourceForm.type,
      format: newResourceForm.format,
      summary: newResourceForm.summary,
      keyChapters: newResourceForm.keyChapters
        ? newResourceForm.keyChapters.split('\n').filter(Boolean)
        : ["Chapter 1: Standard Operating Procedure", "Chapter 2: Key Statutory Rules"],
      readingTime: newResourceForm.readingTime,
      downloadLink: "#",
      badge: "Commission Ingested"
    };

    try {
      const saved = await api('/resources', { method: 'POST', body: createdRes });
      setResources(prev => [saved, ...prev]);
    } catch (err) {
      alert(err.message);
      return;
    }
    setShowAddResourceModal(false);
    setNewResourceForm({
      title: '',
      gradeBand: 'GL 06 - 10',
      type: 'Public Service Rules (PSR 2015)',
      format: 'Official Manual',
      summary: '',
      keyChapters: '',
      readingTime: '2 Hours'
    });
    alert("Resource uploaded and categorized successfully!");
  };

  // 3. Category Update
  const handleSaveCategory = async (catId, newTime, newPass) => {
    try {
      const updated = await api(`/categories/${catId}`, {
        method: 'PUT',
        body: { timeLimitMinutes: parseInt(newTime, 10), passScorePercentage: parseInt(newPass, 10) }
      });
      setGradeCategories(prev => prev.map(c => (c.id === catId ? updated : c)));
      setEditingCategory(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // 4. Candidate Password Reset Handlers
  const handleOpenResetModal = (candidate) => {
    setResetModalCandidate(candidate);
    setAdminResetNewPass('');
    setAdminResetConfirmPass('');
    setAdminResetSuccess('');
    setAdminResetError('');
    setShowAdminResetPass(false);
  };

  const handleGenerateRandomPass = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const pass = `Lagos${randomSuffix}`;
    setAdminResetNewPass(pass);
    setAdminResetConfirmPass(pass);
  };

  const handleExecutePasswordReset = async (e) => {
    e.preventDefault();
    setAdminResetError('');
    setAdminResetSuccess('');

    if (!adminResetNewPass || adminResetNewPass.length < 4) {
      setAdminResetError("Password must be a minimum of 4 characters.");
      return;
    }

    if (adminResetNewPass !== adminResetConfirmPass) {
      setAdminResetError("Passwords do not match. Please verify both fields.");
      return;
    }

    try {
      await resetCandidatePassword(resetModalCandidate.id, adminResetNewPass);
      await refreshCandidates();
      setAdminResetSuccess(`Password for ${resetModalCandidate.fullName} (${resetModalCandidate.username}) has been updated to "${adminResetNewPass}".`);
      setTimeout(() => {
        setResetModalCandidate(null);
        setAdminResetNewPass('');
        setAdminResetConfirmPass('');
        setAdminResetSuccess('');
      }, 2500);
    } catch (err) {
      setAdminResetError(err.message || "Failed to reset candidate password.");
    }
  };

  const handleCopyUsername = (uname) => {
    navigator.clipboard?.writeText(uname);
    setCopiedUser(uname);
    setTimeout(() => setCopiedUser(''), 2000);
  };

  // 4. Candidate Deletion Handler
  const handleExecuteDeleteCandidate = async () => {
    if (!candidateToDelete) return;
    try {
      setIsDeletingCandidate(true);
      await deleteCandidate(candidateToDelete.id);
      setRegisteredCandidates(prev => prev.filter(c => c.id !== candidateToDelete.id));
      setCandidateDeleteNotice(`Candidate "${candidateToDelete.fullName}" (${candidateToDelete.username}) was permanently removed from the system.`);
      setCandidateToDelete(null);
      setTimeout(() => setCandidateDeleteNotice(''), 5000);
    } catch (err) {
      alert(err.message || "Failed to delete candidate.");
    } finally {
      setIsDeletingCandidate(false);
    }
  };

  // 5. Excel Template Download Handler
  const handleDownloadExcelTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Questions Template with sample civil service questions across all grade bands
    const headers = [
      "Question Text",
      "Option A",
      "Option B",
      "Option C",
      "Option D",
      "Correct Answer (A/B/C/D)",
      "Grade Category (GL 06-10 / GL 12-14 / GL 15-16 / All)",
      "Chapter / Subject",
      "Reference Rule",
      "Explanation"
    ];

    const sampleRows = [
      [
        "According to Public Service Rules Chapter 2, recruitment into the Civil Service must be strictly anchored on what principle?",
        "Merit, equality, and demonstrable service needs",
        "Personal recommendations and family ties",
        "Informal verbal interviews alone",
        "Commercial contracting history",
        "A",
        "GL 06-10",
        "PSR Chapter 2",
        "PSR Rule 020101",
        "Rule 020101 requires recruitment based on merit, gender equality, and demonstrable service needs."
      ],
      [
        "Under Financial Regulation 114, who is officially tasked with maintaining proper main and subsidiary ledgers in an MDA?",
        "The Head of Finance and Accounts",
        "The Storekeeper",
        "The Transport Officer",
        "The Internal Audit Messenger",
        "A",
        "GL 06-10",
        "Financial Regulations Chapter 1",
        "FR 114",
        "FR 114 designates the Head of Finance and Accounts as responsible for accounting books and ledgers."
      ],
      [
        "When an officer successfully exculpates himself against a formal written query, what action follows under PSR Rule 040402?",
        "The officer is formally notified in writing and no further disciplinary action is taken",
        "A disciplinary fine is deducted from salary",
        "The officer is demoted by one grade step",
        "The query is forwarded to external law enforcement",
        "A",
        "GL 12-14",
        "PSR Chapter 4",
        "PSR Rule 040402",
        "Rule 040402 provides that upon successful exculpation, the matter is formally closed in writing."
      ],
      [
        "Under Financial Regulation 314, what is the mandatory rule regarding unspent recurrent expenditure votes at financial year-end?",
        "Unspent recurrent balances lapse and cannot be revoted in the subsequent year",
        "They roll over automatically into next year's budget",
        "They are distributed to officers as year-end bonuses",
        "They are transferred into private commercial accounts",
        "A",
        "GL 12-14",
        "Financial Regulations Chapter 3",
        "FR 314",
        "FR 314 specifies that unspent recurrent balances lapse and cannot be revoted."
      ],
      [
        "Under Lagos State Public Procurement Law, what statutory penalty applies to an officer convicted of collusive bid-rigging?",
        "Imprisonment of not less than 5 years without option of fine, plus summary dismissal",
        "A verbal reprimand from the supervisor",
        "A nominal fine of N5,000",
        "Lateral redeployment to another ministry",
        "A",
        "GL 15-16",
        "Public Procurement Law",
        "Lagos Procurement Law Sec. 3126",
        "Corrupt procurement practices carry a mandatory minimum 5-year prison sentence and summary dismissal."
      ],
      [
        "Under Financial Regulation 2505, when MUST a formal Board of Enquiry be convened following a loss of public funds?",
        "Where fraud is probable, the loss is substantial, or collusion among officers is suspected",
        "For any loss under N1,000",
        "Whenever a routine file is misfiled",
        "Only when authorized by a commercial bank",
        "A",
        "All",
        "Financial Regulations Chapter 25",
        "FR 2505",
        "FR 2505 mandates a formal Board of Enquiry when fraud or collusion is suspected."
      ]
    ];

    const wsQuestions = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
    wsQuestions['!cols'] = [
      { wch: 60 },
      { wch: 35 },
      { wch: 35 },
      { wch: 35 },
      { wch: 35 },
      { wch: 26 },
      { wch: 35 },
      { wch: 25 },
      { wch: 25 },
      { wch: 55 }
    ];

    XLSX.utils.book_append_sheet(wb, wsQuestions, "Questions_Template");

    // Sheet 2: Guide & Instructions
    const guideRows = [
      ["LAGOS STATE CIVIL SERVICE COMMISSION — CBT QUESTION IMPORT SPECIFICATION"],
      [""],
      ["COLUMN", "REQUIRED?", "ALLOWED VALUES / INSTRUCTIONS"],
      ["Question Text", "YES", "The full, clear statement of the examination question."],
      ["Option A", "YES", "Choice A text."],
      ["Option B", "YES", "Choice B text."],
      ["Option C", "OPTIONAL", "Choice C text (optional for true/false)."],
      ["Option D", "OPTIONAL", "Choice D text."],
      ["Correct Answer (A/B/C/D)", "YES", "Enter 'A', 'B', 'C', or 'D' corresponding to the correct option."],
      ["Grade Category", "YES", "Enter: 'GL 06-10', 'GL 12-14', 'GL 15-16', or 'All'."],
      ["Chapter / Subject", "RECOMMENDED", "e.g. PSR Chapter 2, Financial Regulations Chapter 3, Procurement Law."],
      ["Reference Rule", "RECOMMENDED", "e.g. PSR 020101, FR 114, Section 3126."],
      ["Explanation", "RECOMMENDED", "Official rationale shown to candidate in results breakdown."],
      [""],
      ["GRADE CATEGORIES KEY:"],
      ["• GL 06-10: Pool of Executive and Clerical Officers (GL 06, 07, 08, 09, 10)"],
      ["• GL 12-14: Middle Management and Senior Officers (GL 12, 13, 14)"],
      ["• GL 15-16: Directorate Cadre and Executive Leadership (GL 15, 16)"],
      ["• All: Universal questions applied across all three promotion categories"]
    ];

    const wsGuide = XLSX.utils.aoa_to_sheet(guideRows);
    wsGuide['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(wb, wsGuide, "Instructions_Guide");

    XLSX.writeFile(wb, "LAGOS_CBT_Questions_Template.xlsx");
  };

  // 6. Excel File Upload & Ingestion Handler
  const handleExcelFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImportingQuestions(true);
    setExcelImportResult(null);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (!rawRows || rawRows.length === 0) {
        throw new Error("The selected file contains no readable data rows.");
      }

      const parsedQuestions = [];
      let skippedCount = 0;

      for (let i = 0; i < rawRows.length; i++) {
        const row = rawRows[i];

        const getCol = (patterns) => {
          for (const key of Object.keys(row)) {
            const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            for (const p of patterns) {
              if (cleanKey.includes(p.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
                return String(row[key] || '').trim();
              }
            }
          }
          return '';
        };

        const questionText = getCol(['Question Text', 'question', 'prompt', 'text']);
        const optA = getCol(['Option A', 'optionA', 'optA', 'choiceA', 'a']);
        const optB = getCol(['Option B', 'optionB', 'optB', 'choiceB', 'b']);
        const optC = getCol(['Option C', 'optionC', 'optC', 'choiceC', 'c']);
        const optD = getCol(['Option D', 'optionD', 'optD', 'choiceD', 'd']);
        const answerRaw = getCol(['Correct Answer', 'correct', 'answer', 'ans']);
        const gradeCatRaw = getCol(['Grade Category', 'category', 'grade', 'group']);
        const chapter = getCol(['Chapter', 'subject', 'topic']) || 'Civil Service Regulations';
        const refRule = getCol(['Reference Rule', 'rule', 'citation', 'resourceMaterial']) || 'Civil Service Rule';
        const explanation = getCol(['Explanation', 'exp', 'rationale', 'reason']) || 'Refer to official civil service regulations.';

        if (!questionText || !optA || !optB) {
          skippedCount++;
          continue;
        }

        const options = [optA, optB];
        if (optC) options.push(optC);
        if (optD) options.push(optD);

        let correctAnswerIdx = 0;
        const ansClean = answerRaw.toUpperCase().trim();
        if (ansClean === 'B' || ansClean === '1') correctAnswerIdx = 1;
        else if (ansClean === 'C' || ansClean === '2') correctAnswerIdx = Math.min(2, options.length - 1);
        else if (ansClean === 'D' || ansClean === '3') correctAnswerIdx = Math.min(3, options.length - 1);

        const catClean = gradeCatRaw.toLowerCase();
        let categories = [];
        if (catClean.includes('all') || catClean.includes('universal') || !catClean) {
          categories = ['group-gl-06-10', 'group-gl-12-14', 'group-gl-15-16'];
        } else {
          if (catClean.includes('06') || catClean.includes('10')) categories.push('group-gl-06-10');
          if (catClean.includes('12') || catClean.includes('14')) categories.push('group-gl-12-14');
          if (catClean.includes('15') || catClean.includes('16')) categories.push('group-gl-15-16');
        }
        if (categories.length === 0) categories = ['group-gl-06-10'];

        parsedQuestions.push({
          question: questionText,
          options,
          correctAnswer: correctAnswerIdx,
          categories,
          categoryId: categories[0],
          chapter,
          referenceRule: refRule,
          resourceMaterial: `${chapter} (${refRule})`,
          explanation
        });
      }

      if (parsedQuestions.length === 0) {
        throw new Error("No valid questions found in file. Ensure Question Text, Option A, Option B, and Correct Answer columns are populated.");
      }

      // Ingest via API
      const res = await api('/questions', { method: 'POST', body: parsedQuestions });
      const addedQuestions = res.questions || parsedQuestions;

      setQuestions(prev => [...addedQuestions, ...prev]);
      setExcelImportResult({
        success: true,
        count: parsedQuestions.length,
        skipped: skippedCount,
        categories: {
          gl0610: parsedQuestions.filter(q => q.categories.includes('group-gl-06-10')).length,
          gl1214: parsedQuestions.filter(q => q.categories.includes('group-gl-12-14')).length,
          gl1516: parsedQuestions.filter(q => q.categories.includes('group-gl-15-16')).length,
        }
      });
    } catch (err) {
      setExcelImportResult({
        success: false,
        error: err.message || "Failed to process question file."
      });
    } finally {
      setIsImportingQuestions(false);
      if (e.target) e.target.value = '';
    }
  };

  // 4. Export CSV
  const handleExportCSV = () => {
    const rows = [
      ["Candidate Name", "Service Number", "Ministry", "Cadre", "Target Grade", "CBT Score (%)", "Score Breakdown", "Status", "Date"]
    ];

    meritHistory.forEach(m => {
      rows.push([
        m.candidate.fullName,
        m.candidate.serviceNumber,
        m.candidate.ministry,
        m.candidate.cadre,
        m.candidate.targetGrade,
        `${m.percentage}%`,
        `${m.totalCorrect}/${m.totalQuestions}`,
        m.passed ? "RECOMMENDED FOR PROMOTION" : "NOT QUALIFIED",
        new Date(m.submittedAt).toLocaleDateString()
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Year_2027_Civil_Service_Promotion_Merit_Roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    const matchCat = selectedCatFilter === 'all' || q.categoryId === selectedCatFilter;
    const matchText = q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
                      q.referenceRule?.toLowerCase().includes(questionSearch.toLowerCase());
    return matchCat && matchText;
  });

  // Filtered Candidates for Roster & Password Management
  const filteredCandidates = registeredCandidates.filter(c => {
    if (!candidateSearch) return true;
    const term = candidateSearch.toLowerCase().trim();
    return (
      c.fullName?.toLowerCase().includes(term) ||
      c.username?.toLowerCase().includes(term) ||
      c.serviceNumber?.toLowerCase().includes(term) ||
      c.ministry?.toLowerCase().includes(term) ||
      c.cadre?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Admin Title & Summary */}
      <div className="admin-header">
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
            LAGOS STATE CIVIL SERVICE COMMISSION • ADMINISTRATIVE SUITE
          </span>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>
            Year 2027 Promotion Exercise Control & Monitoring Center
          </h1>
          <p style={{ fontSize: '0.9rem' }}>
            Prescribed PSR & FR Study Chapters, CBT Bank Governance, Resource Ingestion & Merit Roster Oversight.
          </p>
        </div>

        <div className="admin-header-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            id="admin-add-question-btn"
            className="btn btn-primary"
            onClick={() => setShowAddQuestionModal(true)}
          >
            <Plus size={16} />
            <span>Add Question</span>
          </button>
          <button 
            id="admin-add-resource-btn"
            className="btn btn-emerald"
            onClick={() => setShowAddResourceModal(true)}
          >
            <Upload size={16} />
            <span>Ingest Study Resource</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          id="admin-tab-overview"
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={17} />
          <span>Commission Overview</span>
        </button>

        <button 
          id="admin-tab-categories"
          className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Layers size={17} />
          <span>Prescribed Grade Groups ({gradeCategories.length})</span>
        </button>

        <button 
          id="admin-tab-questions"
          className={`admin-tab ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <HelpCircle size={17} />
          <span>Question Bank ({questions.length})</span>
        </button>

        <button 
          id="admin-tab-resources"
          className={`admin-tab ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          <BookOpen size={17} />
          <span>Resource Repository ({resources.length})</span>
        </button>

        <button 
          id="admin-tab-merit"
          className={`admin-tab ${activeTab === 'merit' ? 'active' : ''}`}
          onClick={() => setActiveTab('merit')}
        >
          <Award size={17} />
          <span>Promotion Merit Roster ({meritHistory.length})</span>
        </button>

        <button 
          id="admin-tab-candidates"
          className={`admin-tab ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => {
            refreshCandidates();
            setActiveTab('candidates');
          }}
        >
          <UserCheck size={17} />
          <span>Registered Candidates ({registeredCandidates.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <div className="admin-stats-grid">
            <div 
              className="admin-stat-card"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                refreshCandidates();
                setActiveTab('candidates');
              }}
              title="Click to view candidate roster & reset passwords"
            >
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{registeredCandidates.length}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Candidates (Roster)</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <Award size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  {meritHistory.length > 0 
                    ? `${Math.round((meritHistory.filter(m => m.passed).length / meritHistory.length) * 100)}%` 
                    : '100%'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Promotion Eligibility Rate</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <HelpCircle size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{questions.length}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Standard Questions</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
                <BookOpen size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{resources.length}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Categorized Chapters & Guides</div>
              </div>
            </div>
          </div>

          {/* Grade Level Groups Summary */}
          <div className="card" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              Year 2027 Promotion Exercise - Grade Level Groups & Prescribed Chapters
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {gradeCategories.map(cat => (
                <div 
                  key={cat.id} 
                  style={{ 
                    background: 'var(--bg-tertiary)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '1.25rem' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className={`badge ${cat.badgeColor}`}>{cat.code}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>
                      Qualifying Cut-off: {cat.passScorePercentage}%
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                    {cat.title}
                  </div>

                  <div style={{ background: 'var(--bg-primary)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.2rem' }}>
                      ASSESSMENT & SCORING MATRIX:
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <span>CBT Assessment: <strong>100%</strong></span>
                      <span>• Pass Benchmark: <strong>{cat.passScorePercentage || 50}%</strong></span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <div><strong>📖 PSR Chapters:</strong> {cat.psrChapters?.map(p => `Ch.${p.chapter}`).join(', ')}</div>
                    <div style={{ marginTop: '0.2rem' }}><strong>💰 FR Chapters:</strong> {cat.frChapters?.map(f => `Ch.${f.chapter}`).join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIZED GRADE LEVELS */}
      {activeTab === 'categories' && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Grade Level Groups & Circular Parameters</h3>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Code</th>
                  <th>Grade Level Band</th>
                  <th>Allocated Time</th>
                  <th>Passing Benchmark</th>
                  <th>Mandatory Study Chapters</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gradeCategories.map(cat => {
                  const isEditing = editingCategory?.id === cat.id;

                  return (
                    <tr key={cat.id} className={rowCls(`cat-${cat.id}`, isEditing)}>
                      <td data-label="Category Code" className="cell-head" onClick={() => toggleRow(`cat-${cat.id}`)}>
                        <span className={`badge ${cat.badgeColor}`}>{cat.code}</span>
                      {renderRowToggle(`cat-${cat.id}`)}</td>
                      <td data-label="Grade Level Band" className="cell-keep">
                        <div style={{ fontWeight: 700 }}>{cat.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {cat.gradeLevels.join(', ')}
                        </div>
                      </td>
                      <td data-label="Allocated Time">
                        {isEditing ? (
                          <input 
                            type="number" 
                            defaultValue={cat.timeLimitMinutes} 
                            id={`time-input-${cat.id}`}
                            className="form-input" 
                            style={{ width: '80px', padding: '0.4rem' }} 
                          />
                        ) : (
                          <span>{cat.timeLimitMinutes} Minutes</span>
                        )}
                      </td>
                      <td data-label="Passing Benchmark">
                        {isEditing ? (
                          <input 
                            type="number" 
                            defaultValue={cat.passScorePercentage} 
                            id={`pass-input-${cat.id}`}
                            className="form-input" 
                            style={{ width: '80px', padding: '0.4rem' }} 
                          />
                        ) : (
                          <strong style={{ color: 'var(--brand-emerald)' }}>{cat.passScorePercentage}%</strong>
                        )}
                      </td>
                      <td data-label="Study Chapters">
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <div>PSR: {cat.psrChapters?.map(p => `Ch.${p.chapter}`).join(', ')}</div>
                          <div>FR: {cat.frChapters?.map(f => `Ch.${f.chapter}`).join(', ')}</div>
                        </div>
                      </td>
                      <td data-label="Action">
                        {isEditing ? (
                          <button 
                            className="btn btn-sm btn-emerald"
                            onClick={() => {
                              const timeVal = document.getElementById(`time-input-${cat.id}`).value;
                              const passVal = document.getElementById(`pass-input-${cat.id}`).value;
                              handleSaveCategory(cat.id, timeVal, passVal);
                            }}
                          >
                            <Check size={14} /> Save
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => setEditingCategory(cat)}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTION BANK */}
      {activeTab === 'questions' && (
        <div style={{ textAlign: 'left' }}>
          {/* Filter Bar */}
          <div className="admin-filter-bar" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div className="admin-filter-group" style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search questions by text or PSR/FR rule citation..."
                  style={{ paddingLeft: '2.4rem' }}
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                />
              </div>

              <select 
                className="form-select admin-filter-select"
                style={{ width: '240px' }}
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
              >
                <option value="all">All Grade Groups</option>
                {gradeCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button 
                id="download-excel-template-btn"
                type="button"
                className="btn btn-outline"
                onClick={handleDownloadExcelTemplate}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem' }}
                title="Download formatted Excel (.xlsx) template for importing questions across Grade Levels"
              >
                <Download size={15} />
                <span>Download Excel Template</span>
              </button>

              <input 
                ref={excelFileInputRef}
                type="file" 
                accept=".xlsx,.xls,.csv" 
                onChange={handleExcelFileUpload} 
                style={{ display: 'none' }} 
              />

              <button 
                id="import-excel-questions-btn"
                type="button"
                className="btn btn-emerald"
                onClick={() => excelFileInputRef.current?.click()}
                disabled={isImportingQuestions}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem' }}
                title="Import questions from Excel (.xlsx/.xls) or CSV file"
              >
                <FileSpreadsheet size={15} />
                <span>{isImportingQuestions ? 'Importing Questions...' : 'Import Excel / CSV'}</span>
              </button>

              <button 
                className="btn btn-primary"
                onClick={() => setShowAddQuestionModal(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem' }}
              >
                <Plus size={15} />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Excel Import Feedback Banner */}
          {excelImportResult && (
            <div style={{
              padding: '0.9rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              background: excelImportResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${excelImportResult.success ? 'var(--brand-emerald)' : 'var(--brand-danger)'}`,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                {excelImportResult.success ? (
                  <CheckCircle2 size={20} color="var(--brand-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <AlertCircle size={20} color="var(--brand-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
                <div>
                  <div style={{ fontWeight: 700, color: excelImportResult.success ? 'var(--brand-emerald)' : 'var(--brand-danger)', marginBottom: '0.2rem' }}>
                    {excelImportResult.success ? 'Questions Successfully Imported!' : 'Excel Question Import Failed'}
                  </div>
                  {excelImportResult.success ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      Ingested <strong>{excelImportResult.count}</strong> question(s) into CBT examination pool.
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        GL 06-10: <strong>{excelImportResult.categories.gl0610}</strong> • GL 12-14: <strong>{excelImportResult.categories.gl1214}</strong> • GL 15-16: <strong>{excelImportResult.categories.gl1516}</strong>
                        {excelImportResult.skipped > 0 && ` • Skipped ${excelImportResult.skipped} incomplete row(s).`}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {excelImportResult.error}
                    </div>
                  )}
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setExcelImportResult(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Questions Table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th>Category</th>
                  <th>Question & Options</th>
                  <th>Rule Reference</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q, idx) => {
                  const cat = gradeCategories.find(c => c.id === q.categoryId);

                  return (
                    <tr key={q.id} className={rowCls(`q-${q.id}`)}>
                      <td data-label="No." className="cell-head" onClick={() => toggleRow(`q-${q.id}`)} style={{ fontFamily: 'var(--font-mono)' }}>{idx + 1}{renderRowToggle(`q-${q.id}`)}</td>
                      <td data-label="Category">
                        <span className="badge badge-blue">{cat ? cat.code : 'General'}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {q.gradeLevel || 'Standard'}
                        </div>
                      </td>
                      <td data-label="Question & Options" className="cell-keep" style={{ maxWidth: '480px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                          {q.question}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--brand-emerald)' }}>
                          ✓ Correct: {q.options[q.correctAnswer]}
                        </div>
                      </td>
                      <td data-label="Rule Reference">
                        <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                          {q.referenceRule || 'Civil Service Standard'}
                        </span>
                      </td>
                      <td data-label="Action">
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteQuestion(q.id)}
                          title="Delete question from bank"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RESOURCE REPOSITORY */}
      {activeTab === 'resources' && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Categorized Examination Resources & Prescribed Chapters</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Study digests, statutory circulars, and syllabus guides provided for each grade level category.
              </p>
            </div>

            <button 
              className="btn btn-emerald"
              onClick={() => setShowAddResourceModal(true)}
            >
              <Upload size={16} />
              <span>Ingest New Study Resource</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {resources.map((res) => (
              <div key={res.id} className="resource-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className="badge badge-blue">{res.type}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.readingTime}</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {res.title}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-emerald)', fontWeight: 600, marginBottom: '0.65rem' }}>
                    Grade Band: {res.gradeBand}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {res.summary}
                  </p>

                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                      Key Chapters / Topics:
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      {res.keyChapters?.slice(0, 3).map((ch, i) => (
                        <li key={i}>{ch}</li>
                      ))}
                      {res.keyChapters?.length > 3 && (
                        <li>+{res.keyChapters.length - 3} more chapters</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{res.badge}</span>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => alert(`Opening ${res.title}... Full syllabus text is loaded and indexed.`)}
                  >
                    <BookOpen size={14} /> Read Resource
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROMOTION MERIT ROSTER */}
      {activeTab === 'merit' && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Promotion Eligibility & Merit Ranking Roster</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Official compiled scores for civil servants evaluated for Year 2027 promotion advancement.
              </p>
            </div>

            <button 
              id="export-merit-csv-btn"
              className="btn btn-primary"
              onClick={handleExportCSV}
              disabled={meritHistory.length === 0}
            >
              <Download size={16} />
              <span>Export Merit List (CSV)</span>
            </button>
          </div>

          {meritHistory.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <Award size={48} color="var(--text-subtle)" style={{ margin: '0 auto 1rem' }} />
              <h4>No Completed Exam Submissions Yet</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Candidates who take the CBT examination in the Candidate Portal will automatically be ranked here by composite score.
              </p>
            </div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Candidate & Service No</th>
                    <th>Cadre & Ministry</th>
                    <th>Target Grade</th>
                    <th>CBT Score (%)</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[...meritHistory].sort((a, b) => b.percentage - a.percentage).map((m, idx) => {
                    return (
                      <tr key={idx} className={rowCls(`merit-${idx}`)}>
                        <td data-label="Rank" className="cell-head" onClick={() => toggleRow(`merit-${idx}`)} style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                          #{idx + 1}
                        {renderRowToggle(`merit-${idx}`)}</td>
                        <td data-label="Candidate" className="cell-keep">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <CandidateAvatar name={m.candidate.fullName} size={32} />
                            <div>
                              <div style={{ fontWeight: 700 }}>{m.candidate.fullName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {m.candidate.serviceNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Cadre & Ministry">
                          <div>{m.candidate.cadre}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{m.candidate.ministry}</div>
                        </td>
                        <td data-label="Target Grade">
                          <strong style={{ color: 'var(--brand-emerald)' }}>{m.candidate.targetGrade}</strong>
                        </td>
                        <td data-label="CBT Score (%)" className="cell-keep">
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: m.passed ? 'var(--brand-emerald)' : 'var(--brand-danger)' }}>
                            {m.percentage}%
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {m.totalCorrect} / {m.totalQuestions}
                          </div>
                        </td>
                        <td data-label="Status" className="cell-keep">
                          <span className={`badge ${m.passed ? 'badge-emerald' : 'badge-red'}`}>
                            {m.passed ? "RECOMMENDED" : "STEPPED DOWN"}
                          </span>
                        </td>
                        <td data-label="Date" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(m.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: REGISTERED CANDIDATES ROSTER & ON-DEMAND PASSWORD RESET */}
      {activeTab === 'candidates' && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                Commission Candidate Roster & Password Management
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Official roll of all registered promotion candidates. Commission Administrators can reset candidate passwords on demand.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                id="refresh-candidates-btn"
                className="btn btn-secondary"
                onClick={() => refreshCandidates()}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                title="Refresh registered candidate list"
              >
                <RefreshCw size={15} />
                <span>Refresh List</span>
              </button>
            </div>
          </div>

          {/* Candidate Delete Notification Toast */}
          {candidateDeleteNotice && (
            <div className="animate-fade-in" style={{
              padding: '0.85rem 1.25rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--brand-emerald)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              color: 'var(--brand-emerald)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} />
              <span>{candidateDeleteNotice}</span>
            </div>
          )}

          {/* Search bar & filter */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                id="search-candidates-input"
                type="text"
                placeholder="Search candidate by name, username, service number, ministry, or cadre..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredCandidates.length} of {registeredCandidates.length} candidate(s)
            </div>
          </div>

          {/* Candidate Table */}
          {filteredCandidates.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <UserCheck size={48} color="var(--text-subtle)" style={{ margin: '0 auto 1rem' }} />
              <h4>No Candidates Matching Search</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Try adjusting your search query or clear the filter to view all registered candidates.
              </p>
            </div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Username</th>
                    <th>Account Type</th>
                    <th>Ministry & Cadre</th>
                    <th>Target Grade</th>
                    <th>Service Number</th>
                    <th style={{ textAlign: 'center' }}>Admin Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((cand) => (
                    <tr key={cand.id} className={rowCls(`cand-${cand.id}`)}>
                      <td data-label="Candidate" className="cell-head" onClick={() => toggleRow(`cand-${cand.id}`)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <CandidateAvatar name={cand.fullName} size={34} />
                          <div>
                            <div style={{ fontWeight: 700 }}>{cand.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {cand.firstName} {cand.surname}
                            </div>
                          </div>
                        </div>
                      {renderRowToggle(`cand-${cand.id}`)}</td>
                      <td data-label="Username">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.825rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                          <span>{cand.username}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyUsername(cand.username)}
                            style={{ background: 'none', border: 'none', color: copiedUser === cand.username ? 'var(--brand-emerald)' : 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                            title="Copy username"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>
                      <td data-label="Account Type">
                        {cand.isDemo ? (
                          <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                            Demo Mode
                          </span>
                        ) : (
                          <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                            Registered Candidate
                          </span>
                        )}
                      </td>
                      <td data-label="Ministry & Cadre">
                        <div style={{ fontWeight: 600 }}>{cand.cadre}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{cand.ministry}</div>
                      </td>
                      <td data-label="Target Grade" className="cell-keep">
                        <strong style={{ color: 'var(--brand-emerald)' }}>{cand.targetGrade || 'GL 10'}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cand.categoryId}</div>
                      </td>
                      <td data-label="Service Number" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {cand.serviceNumber || 'LASG/CSC/2027'}
                      </td>
                      <td data-label="Admin Action" style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button
                            id={`reset-pass-btn-${cand.username}`}
                            className="btn btn-sm btn-outline"
                            onClick={() => handleOpenResetModal(cand)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.75rem',
                              padding: '0.35rem 0.65rem',
                              borderColor: 'var(--brand-primary)',
                              color: 'var(--brand-primary)'
                            }}
                            title={`Reset password for ${cand.fullName}`}
                          >
                            <KeyRound size={13} />
                            <span>Reset Pass</span>
                          </button>

                          <button
                            id={`delete-cand-btn-${cand.username}`}
                            type="button"
                            className="btn btn-sm"
                            onClick={() => setCandidateToDelete(cand)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.75rem',
                              padding: '0.35rem 0.65rem',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: 'var(--brand-danger)',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer'
                            }}
                            title={`Permanently delete candidate account ${cand.fullName}`}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Question */}
      {showAddQuestionModal && createPortal(
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Add New Promotion Examination Question</h3>
              <button 
                onClick={() => setShowAddQuestionModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestion} style={{ textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Grade Level Group:</label>
                  <select 
                    className="form-select"
                    value={newQuestionForm.categoryId}
                    onChange={(e) => setNewQuestionForm({...newQuestionForm, categoryId: e.target.value})}
                  >
                    {gradeCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Grade Band:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. GL 07 to 08"
                    value={newQuestionForm.gradeLevel}
                    onChange={(e) => setNewQuestionForm({...newQuestionForm, gradeLevel: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Question Text:</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Enter official civil service question..."
                  value={newQuestionForm.question}
                  onChange={(e) => setNewQuestionForm({...newQuestionForm, question: e.target.value})}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Option A:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newQuestionForm.optionA}
                    onChange={(e) => setNewQuestionForm({...newQuestionForm, optionA: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option B:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newQuestionForm.optionB}
                    onChange={(e) => setNewQuestionForm({...newQuestionForm, optionB: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Option C:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newQuestionForm.optionC}
                    onChange={(e) => setNewQuestionForm({...newQuestionForm, optionC: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option D:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newQuestionForm.optionD}
                    onChange={(e) => setNewQuestionForm({...newQuestionForm, optionD: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Correct Option Index:</label>
                  <select 
                    className="form-select"
                    value={newQuestionForm.correctAnswer}
                    onChange={(e) => setNewQuestionForm({...newQuestionForm, correctAnswer: e.target.value})}
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Regulatory Rule Citation:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. PSR 020101, FR 103"
                    value={newQuestionForm.referenceRule}
                    onChange={(e) => setNewQuestionForm({...newQuestionForm, referenceRule: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Regulatory Explanation:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Explain why this option is correct based on civil service rules..."
                  value={newQuestionForm.explanation}
                  onChange={(e) => setNewQuestionForm({...newQuestionForm, explanation: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddQuestionModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to Question Bank
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal: Add Resource */}
      {showAddResourceModal && createPortal(
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Ingest Grade Level Study Resource</h3>
              <button 
                onClick={() => setShowAddResourceModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddResource} style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label">Document / Resource Title:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Public Service Rules Chapter 2 Compendium"
                  value={newResourceForm.title}
                  onChange={(e) => setNewResourceForm({...newResourceForm, title: e.target.value})}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Grade Band:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. GL 06 - 10"
                    value={newResourceForm.gradeBand}
                    onChange={(e) => setNewResourceForm({...newResourceForm, gradeBand: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Document Classification:</label>
                  <select 
                    className="form-select"
                    value={newResourceForm.type}
                    onChange={(e) => setNewResourceForm({...newResourceForm, type: e.target.value})}
                  >
                    <option value="Public Service Rules (PSR 2015)">Public Service Rules (PSR 2015)</option>
                    <option value="Financial Regulations (FR 2009)">Financial Regulations (FR 2009)</option>
                    <option value="Procurement Law">Procurement Law</option>
                    <option value="Management & Leadership">Management & Leadership</option>
                    <option value="Statutory Circular">Statutory Circular</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Executive Summary / Syllabus Scope:</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Summary of chapters and regulatory scope..."
                  value={newResourceForm.summary}
                  onChange={(e) => setNewResourceForm({...newResourceForm, summary: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Key Chapters / Topics (One per line):</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Chapter 2: Appointments & Confirmations&#10;Chapter 4: Disciplinary Procedures&#10;Chapter 12: Leave Regulations"
                  value={newResourceForm.keyChapters}
                  onChange={(e) => setNewResourceForm({...newResourceForm, keyChapters: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddResourceModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald">
                  Save & Index Resource
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal: Admin Password Reset On Demand */}
      {resetModalCandidate && createPortal(
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999 }}>
          <div className="modal-dialog" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={20} color="var(--brand-primary)" />
                <h3 style={{ margin: 0 }}>Reset Candidate Password</h3>
              </div>
              <button 
                onClick={() => setResetModalCandidate(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecutePasswordReset} style={{ textAlign: 'left', marginTop: '1rem' }}>
              {/* Target Candidate Summary Card */}
              <div style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <CandidateAvatar name={resetModalCandidate.fullName} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {resetModalCandidate.fullName}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Username: <strong>{resetModalCandidate.username}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {resetModalCandidate.cadre} • {resetModalCandidate.serviceNumber}
                  </div>
                </div>
              </div>

              {adminResetSuccess && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid var(--brand-emerald)',
                  color: 'var(--brand-emerald)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.825rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Check size={16} />
                  <span>{adminResetSuccess}</span>
                </div>
              )}

              {adminResetError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid var(--brand-danger)',
                  color: 'var(--brand-danger)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.825rem',
                  marginBottom: '1rem'
                }}>
                  {adminResetError}
                </div>
              )}

              {/* Password Fields */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600 }}>
                    New Password (Min 4 chars) <span style={{ color: 'var(--brand-danger)' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPass}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Generate Quick Password
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    id="admin-reset-new-password"
                    type={showAdminResetPass ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter new password (min. 4 characters)"
                    value={adminResetNewPass}
                    onChange={(e) => setAdminResetNewPass(e.target.value)}
                    required
                    style={{ width: '100%', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminResetPass(prev => !prev)}
                    style={{
                      position: 'absolute',
                      right: '0.65rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showAdminResetPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Confirm New Password <span style={{ color: 'var(--brand-danger)' }}>*</span>
                </label>
                <input 
                  id="admin-reset-confirm-password"
                  type={showAdminResetPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Re-enter new password to confirm"
                  value={adminResetConfirmPass}
                  onChange={(e) => setAdminResetConfirmPass(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setResetModalCandidate(null)}
                >
                  Cancel
                </button>
                <button 
                  id="admin-confirm-reset-btn"
                  type="submit" 
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <KeyRound size={15} />
                  <span>Update Password Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal: Delete Candidate Confirmation */}
      {candidateToDelete && createPortal(
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999 }}>
          <div className="modal-dialog" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-danger)' }}>
                <AlertTriangle size={22} />
                <h3 style={{ margin: 0, color: 'var(--brand-danger)' }}>Confirm Candidate Deletion</h3>
              </div>
              <button 
                onClick={() => setCandidateToDelete(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: 'left', marginTop: '1rem' }}>
              <div style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <CandidateAvatar name={candidateToDelete.fullName} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {candidateToDelete.fullName}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Username: <strong>{candidateToDelete.username}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {candidateToDelete.cadre} • {candidateToDelete.ministry}
                  </div>
                </div>
              </div>

              <div style={{
                padding: '0.85rem 1rem',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                marginBottom: '1.5rem'
              }}>
                <strong style={{ color: 'var(--brand-danger)', display: 'block', marginBottom: '0.25rem' }}>Warning: Permanent Action</strong>
                Are you sure you want to delete this candidate? This will permanently remove their profile, login access, and all recorded examination attempts from the Commission database.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setCandidateToDelete(null)}
                  disabled={isDeletingCandidate}
                >
                  Cancel
                </button>
                <button 
                  id="confirm-delete-candidate-btn"
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleExecuteDeleteCandidate}
                  disabled={isDeletingCandidate}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Trash2 size={15} />
                  <span>{isDeletingCandidate ? 'Deleting...' : 'Delete Candidate Account'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}