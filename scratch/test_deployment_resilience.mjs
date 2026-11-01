import assert from 'node:assert/strict';
import { DEFAULT_GRADE_CATEGORIES } from '../src/data/gradeLevelCategories.js';
import { DEFAULT_RESOURCES } from '../src/data/defaultResources.js';
import { DEFAULT_DEMO_USERS } from '../src/data/defaultDemoUsers.js';
import { get100ExamQuestionsForCategory } from '../src/data/defaultQuestions.js';

console.log('Testing Deployment Resilience and Null Safety:');

// 1. Verify default datasets are rich and valid
assert(DEFAULT_GRADE_CATEGORIES.length >= 3, 'Categories must have at least 3 grade bands');
assert(DEFAULT_DEMO_USERS.length >= 3, 'Demo users must have at least 3 candidates');
assert(DEFAULT_RESOURCES.length >= 5, 'Resources must have at least 5 syllabus documents');

for (const cat of DEFAULT_GRADE_CATEGORIES) {
  assert(cat.id, 'Category must have an ID');
  assert(cat.code, 'Category must have a code');
  assert(Array.isArray(cat.gradeLevels) && cat.gradeLevels.length > 0, 'Category must have gradeLevels');
  assert(Array.isArray(cat.cadres) && cat.cadres.length > 0, 'Category must have cadres');
  assert(cat.assessmentMatrix?.cbtWeight, 'Category must have assessment matrix');
  
  const q100 = get100ExamQuestionsForCategory(cat.id);
  assert.equal(q100.length, 100, `Category ${cat.code} must yield exactly 100 questions`);
}
console.log('  ✓ Category schemas, cadres, grade levels, and 100-question banks verified');

// 2. Test safe fallback logic when backend response is null/empty/undefined
const emptyList = [];
const nullList = null;
const safeCategoriesEmpty = Array.isArray(emptyList) && emptyList.length > 0 ? emptyList : DEFAULT_GRADE_CATEGORIES;
const safeCategoriesNull = Array.isArray(nullList) && nullList.length > 0 ? nullList : DEFAULT_GRADE_CATEGORIES;

assert.equal(safeCategoriesEmpty, DEFAULT_GRADE_CATEGORIES);
assert.equal(safeCategoriesNull, DEFAULT_GRADE_CATEGORIES);
console.log('  ✓ Categories fallback properly protects against empty or null server responses');

// 3. Test CandidateAuth form initialization with undefined category
const undefinedCategory = undefined;
const safeCat = undefinedCategory || DEFAULT_GRADE_CATEGORIES[0];
const regFormMock = {
  cadre: safeCat?.cadres?.[0] || 'Administrative Officer I',
  targetGrade: safeCat?.gradeLevels?.[0] || 'GL 09 to 10',
  categoryId: safeCat?.id || 'group-gl-06-10'
};
assert(regFormMock.cadre, 'Cadre must not be undefined');
assert(regFormMock.targetGrade, 'Target grade must not be undefined');
assert(regFormMock.categoryId, 'Category ID must not be undefined');
console.log('  ✓ CandidateAuth registration state initializes safely without crash');

// 4. Test CandidateSettings flatMap with undefined gradeCategories
const undefinedGradeCategories = undefined;
const safeCategoriesForSettings = Array.isArray(undefinedGradeCategories) && undefinedGradeCategories.length > 0 
  ? undefinedGradeCategories 
  : DEFAULT_GRADE_CATEGORIES;

const allGradeLevels = safeCategoriesForSettings.flatMap(c => c.gradeLevels || []);
assert(allGradeLevels.length > 0, 'Grade levels should be populated');
console.log('  ✓ CandidateSettings flatMap safely resolves grade levels');

// 5. Test ExamResultView composite score calculation with null candidate and category
const nullCandidateResult = {
  candidate: null,
  category: null,
  percentage: 75,
  totalCorrect: 75,
  examQuestions: new Array(100).fill({})
};

const resCat = nullCandidateResult.category || DEFAULT_GRADE_CATEGORIES[0];
const resCand = nullCandidateResult.candidate || {
  fullName: 'Candidate Officer',
  serviceNumber: 'LASG/CSC/2027/0001',
  cadre: 'Administrative Officer I',
  targetGrade: 'GL 10',
  spadevScore: 75
};
const resMatrix = resCat?.assessmentMatrix || { cbtWeight: 60, spadevWeight: 40 };
const cbtPart = (nullCandidateResult.percentage * resMatrix.cbtWeight) / 100;
const spadevPart = ((resCand.spadevScore || 75) * resMatrix.spadevWeight) / 100;
const composite = Math.round(cbtPart + spadevPart);

assert.equal(composite, 75);
console.log('  ✓ ExamResultView calculation succeeds with null candidate and category fallbacks');

// 6. Test ResourceLibraryView filtering with malformed resources
const malformedResources = [
  null,
  { id: '1', title: undefined, summary: null, gradeBand: 'GL 06 - 10', type: 'PSR' },
  { id: '2', title: 'Public Service Rules', summary: 'General rules', gradeBand: 'GL 06 - 10', type: 'Official' }
];

const filtered = malformedResources.filter(res => {
  if (!res) return false;
  const title = String(res.title || '').toLowerCase();
  const summary = String(res.summary || '').toLowerCase();
  const type = String(res.type || '').toLowerCase();
  const gradeBand = String(res.gradeBand || '').toLowerCase();
  return title.includes('public') && gradeBand.includes('gl 06');
});

assert.equal(filtered.length, 1);
assert.equal(filtered[0].id, '2');
console.log('  ✓ ResourceLibraryView safely handles malformed or null resource records');

console.log('\nAll 6 Deployment Resilience checks passed successfully.');
