import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X, AlertTriangle } from 'lucide-react';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm, userName }) {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="modal-overlay animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="modal-dialog animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-medium)',
          maxWidth: '440px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-xl)',
          textAlign: 'center'
        }}
      >
        {/* Header Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.12)',
          color: 'var(--brand-rose, #ef4444)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <LogOut size={26} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Confirm Sign Out
        </h3>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {userName ? (
            <>Are you sure you want to sign out, <strong>{userName}</strong>? You will be redirected to the home page.</>
          ) : (
            <>Are you sure you want to end your current session? You will be redirected to the home page.</>
          )}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            style={{ padding: '0.65rem 1rem' }}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            style={{ 
              background: '#dc2626', 
              color: '#ffffff', 
              borderColor: '#dc2626',
              padding: '0.65rem 1rem',
              fontWeight: 700 
            }}
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
