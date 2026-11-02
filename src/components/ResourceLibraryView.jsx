import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Layers, Search, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { DEFAULT_RESOURCES } from '../data/defaultResources';

export default function ResourceLibraryView({ 
  resources, 
  gradeCategories, 
  onStartExamForCategory 
}) {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeReadingModal, setActiveReadingModal] = useState(null);

  const safeResources = Array.isArray(resources) && resources.length > 0 ? resources : DEFAULT_RESOURCES;

  const count0610 = safeResources.filter(r => {
    const cids = Array.isArray(r.categoryIds) ? r.categoryIds : (r.categoryId ? [r.categoryId] : []);
    const band = String(r.gradeBand || '').toLowerCase();
    return cids.includes('group-gl-06-10') || band.includes('06') || band.includes('all');
  }).length;

  const count1214 = safeResources.filter(r => {
    const cids = Array.isArray(r.categoryIds) ? r.categoryIds : (r.categoryId ? [r.categoryId] : []);
    const band = String(r.gradeBand || '').toLowerCase();
    return cids.includes('group-gl-12-14') || band.includes('12') || band.includes('all');
  }).length;

  const count1516 = safeResources.filter(r => {
    const cids = Array.isArray(r.categoryIds) ? r.categoryIds : (r.categoryId ? [r.categoryId] : []);
    const band = String(r.gradeBand || '').toLowerCase();
    return cids.includes('group-gl-15-16') || band.includes('15') || band.includes('all');
  }).length;

  const filtered = safeResources.filter(res => {
    if (!res) return false;
    const title = String(res.title || '').toLowerCase();
    const summary = String(res.summary || '').toLowerCase();
    const type = String(res.type || '').toLowerCase();
    const gradeBand = String(res.gradeBand || '').toLowerCase();
    const categoryIds = Array.isArray(res.categoryIds) 
      ? res.categoryIds 
      : (res.categoryId ? [res.categoryId] : []);
    const q = search.toLowerCase().trim();

    const matchSearch = !q || title.includes(q) || summary.includes(q) || type.includes(q);

    let matchCat = false;
    if (selectedFilter === 'all') {
      matchCat = true;
    } else if (selectedFilter === 'group-gl-06-10' || selectedFilter === 'GL 06 - 10') {
      matchCat = categoryIds.includes('group-gl-06-10') || gradeBand.includes('06') || gradeBand.includes('10') || gradeBand.includes('all');
    } else if (selectedFilter === 'group-gl-12-14' || selectedFilter === 'GL 12 - 14') {
      matchCat = categoryIds.includes('group-gl-12-14') || gradeBand.includes('12') || gradeBand.includes('14') || gradeBand.includes('all');
    } else if (selectedFilter === 'group-gl-15-16' || selectedFilter === 'GL 15 - 16') {
      matchCat = categoryIds.includes('group-gl-15-16') || gradeBand.includes('15') || gradeBand.includes('16') || gradeBand.includes('all');
    } else {
      matchCat = categoryIds.includes(selectedFilter) || gradeBand.includes(selectedFilter.toLowerCase());
    }

    return matchSearch && matchCat;
  });

  return (
    <div className="container resource-library-container animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
          OFFICIAL SYLLABUS & STUDY REPOSITORY
        </span>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Civil Service Promotion Study Resources
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          Review statutory rulebooks, financial regulations, reform whitepapers, and examination directives categorized by grade level bands.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search study resources, circulars, PSR rules, or keywords..."
            style={{ paddingLeft: '2.4rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            id="resource-filter-all"
            className={`btn btn-sm ${selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedFilter('all')}
          >
            All Resources ({safeResources.length})
          </button>
          <button 
            id="resource-filter-gl-06-10"
            className={`btn btn-sm ${selectedFilter === 'group-gl-06-10' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedFilter('group-gl-06-10')}
          >
            Officer (GL 06 - 10) ({count0610})
          </button>
          <button 
            id="resource-filter-gl-12-14"
            className={`btn btn-sm ${selectedFilter === 'group-gl-12-14' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedFilter('group-gl-12-14')}
          >
            Middle Management (GL 12 - 14) ({count1214})
          </button>
          <button 
            id="resource-filter-gl-15-16"
            className={`btn btn-sm ${selectedFilter === 'group-gl-15-16' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedFilter('group-gl-15-16')}
          >
            Directorate (GL 15 - 16) ({count1516})
          </button>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="resource-library-grid">
        {filtered.map((res) => (
          <div key={res.id} className="resource-card card-interactive">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-blue">{res.type}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{res.readingTime}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                {res.title}
              </h3>

              <div style={{ fontSize: '0.825rem', color: 'var(--brand-emerald)', fontWeight: 700, marginBottom: '0.75rem' }}>
                Target Band: {res.gradeBand}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {res.summary}
              </p>

              {/* Chapter Highlights */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                  Core Chapters & Examination Blueprint:
                </div>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {res.keyChapters?.slice(0, 3).map((ch, idx) => (
                    <li key={idx} style={{ marginBottom: '0.2rem' }}>{ch}</li>
                  ))}
                  {res.keyChapters?.length > 3 && (
                    <li style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
                      +{res.keyChapters.length - 3} additional regulatory topics
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="resource-card-footer">
              <span className="badge badge-emerald">{res.badge || "Verified"}</span>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => setActiveReadingModal(res)}
              >
                <BookOpen size={14} />
                <span>Open Reading Reader</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeReadingModal && createPortal(
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '0.35rem' }}>
                  {activeReadingModal.type}
                </span>
                <h3 style={{ fontSize: '1.35rem' }}>{activeReadingModal.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--brand-emerald)', marginTop: '0.2rem' }}>
                  Applicable Grade Levels: {activeReadingModal.gradeBand}
                </div>
              </div>
              <button 
                onClick={() => setActiveReadingModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: 'left', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  Executive Overview:
                </h4>
                <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  {activeReadingModal.summary}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  Detailed Chapter Breakdown & Regulatory References:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {activeReadingModal.keyChapters?.map((chap, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        padding: '0.75rem 1rem', 
                        background: 'var(--bg-tertiary)', 
                        border: '1px solid var(--border-subtle)', 
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <CheckCircle2 size={16} color="var(--brand-emerald)" />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{chap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h5 style={{ color: 'var(--brand-primary)', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                  Examiner's Recommendation for Candidates:
                </h5>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Questions from this syllabus section carry high weighting in the General Papers and Cadre-specific tests. Ensure thorough familiarity with statutory numbers and retirement/procurement regulations.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveReadingModal(null)}
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
