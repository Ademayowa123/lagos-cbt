import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, X } from 'lucide-react';

/**
 * ModernSelect - Premium responsive dropdown for PC and Mobile.
 * Replaces clunky native OS select dialogs with a sleek, searchable, accessible UI.
 */
export default function ModernSelect({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option...",
  searchable,
  disabled = false,
  className = "",
  icon: Icon,
  title
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options into a flat array with group support
  // options can be:
  // 1. ['Option 1', 'Option 2']
  // 2. [{ value: 'v1', label: 'Option 1', group?: 'Group A' }]
  // 3. [{ group: 'Group A', options: ['Option 1', 'Option 2'] }]
  const normalizedOptions = useMemo(() => {
    const list = [];
    if (!Array.isArray(options)) return list;

    for (const item of options) {
      if (typeof item === 'string' || typeof item === 'number') {
        list.push({ value: String(item), label: String(item) });
      } else if (item && item.options && Array.isArray(item.options)) {
        // optgroup structure
        const groupName = item.group || item.label || '';
        for (const sub of item.options) {
          if (typeof sub === 'string' || typeof sub === 'number') {
            list.push({ value: String(sub), label: String(sub), group: groupName });
          } else if (sub && sub.value !== undefined) {
            list.push({ value: String(sub.value), label: String(sub.label || sub.value), group: groupName });
          }
        }
      } else if (item && item.value !== undefined) {
        list.push({
          value: String(item.value),
          label: String(item.label || item.value),
          group: item.group
        });
      }
    }
    return list;
  }, [options]);

  // Determine if search should be active (defaults to true if > 6 options)
  const shouldSearch = searchable !== undefined ? searchable : normalizedOptions.length > 6;

  // Selected option label
  const selectedOption = useMemo(() => {
    return normalizedOptions.find(o => String(o.value) === String(value));
  }, [normalizedOptions, value]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filtered options based on search query
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return normalizedOptions;
    const q = search.toLowerCase().trim();
    return normalizedOptions.filter(o => 
      o.label.toLowerCase().includes(q) || 
      (o.group && o.group.toLowerCase().includes(q))
    );
  }, [normalizedOptions, search]);

  // Close on outside click (for desktop dropdown)
  useEffect(() => {
    if (!isOpen || isMobile) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && shouldSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen, shouldSearch]);

  const handleSelect = (val) => {
    if (onChange) {
      // Provide both direct value and simulated event for standard handler compatibility
      const syntheticEvent = {
        target: { name: name || id, value: val }
      };
      onChange(syntheticEvent);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Render options list content
  const renderOptionsList = () => {
    if (filteredOptions.length === 0) {
      return (
        <div className="modern-select-empty">
          No matching options found
        </div>
      );
    }

    // Group options if groups exist
    let currentGroup = null;

    return filteredOptions.map((opt, idx) => {
      const isSelected = String(opt.value) === String(value);
      const showGroupHeader = opt.group && opt.group !== currentGroup;
      if (showGroupHeader) {
        currentGroup = opt.group;
      }

      return (
        <React.Fragment key={`${opt.value}-${idx}`}>
          {showGroupHeader && (
            <div className="modern-select-group-header">
              {opt.group}
            </div>
          )}
          <div
            id={`${id || 'modern-select'}-opt-${idx}`}
            className={`modern-select-item ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.value)}
          >
            <span className="modern-select-item-text">{opt.label}</span>
            {isSelected && (
              <Check size={16} className="modern-select-item-check" />
            )}
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`modern-select-wrapper ${className} ${disabled ? 'disabled' : ''}`}>
      {/* Hidden native input to support form serialization if needed */}
      <input type="hidden" name={name || id} value={value || ''} />

      {/* Main Trigger Button */}
      <button
        type="button"
        id={id}
        ref={triggerRef}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`modern-select-trigger ${isOpen ? 'active' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="modern-select-trigger-content">
          {Icon && <Icon size={16} className="modern-select-trigger-icon" />}
          <span className={`modern-select-trigger-label ${!selectedOption ? 'placeholder' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={17} className={`modern-select-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {/* DESKTOP FLOATING DROPDOWN */}
      {isOpen && !isMobile && (
        <div ref={dropdownRef} className="modern-select-dropdown animate-fade-in" role="listbox">
          {shouldSearch && (
            <div className="modern-select-search-bar">
              <Search size={14} className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="modern-select-search-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearch('')}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
          <div className="modern-select-options-list">
            {renderOptionsList()}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET MODAL (Replaces native Android radio dialog) */}
      {isOpen && isMobile && createPortal(
        <div className="modal-overlay modern-select-mobile-overlay animate-fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="modern-select-mobile-sheet animate-slide-up" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="modern-select-sheet-handle" />

            {/* Header */}
            <div className="modern-select-sheet-header">
              <h3 className="modern-select-sheet-title">
                {title || placeholder || "Select Option"}
              </h3>
              <button 
                type="button"
                className="btn-ghost modern-select-sheet-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            {shouldSearch && (
              <div className="modern-select-mobile-search">
                <Search size={16} className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-input modern-select-mobile-search-input"
                  placeholder="Type to filter options..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearch('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Options List */}
            <div className="modern-select-mobile-list">
              {renderOptionsList()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
