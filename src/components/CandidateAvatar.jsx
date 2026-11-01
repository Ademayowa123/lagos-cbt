import React from 'react';

/**
 * Generates an initial-letter avatar with a consistent, attractive gradient.
 * e.g., "Babatunde Olatunji" -> "BO" or "B"
 */
export function getInitials(name) {
  if (!name) return "?";
  const clean = name.replace(/^(dr\.|mr\.|mrs\.|ms\.|chief|engr\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const GRADIENTS = [
  'linear-gradient(135deg, #059669 0%, #10b981 100%)', // Emerald
  'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', // Blue
  'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', // Purple
  'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', // Amber
  'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', // Cyan
  'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)', // Rose
];

function getGradientForName(name) {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export default function CandidateAvatar({ 
  name = "Candidate", 
  size = 40, 
  fontSize,
  className = "", 
  style = {} 
}) {
  const initials = getInitials(name);
  const background = getGradientForName(name);
  const calculatedFontSize = fontSize || `${Math.round(size * 0.42)}px`;

  return (
    <div
      className={`candidate-initial-avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        background,
        color: '#ffffff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
        fontSize: calculatedFontSize,
        letterSpacing: '0.04em',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        userSelect: 'none',
        flexShrink: 0,
        ...style
      }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
