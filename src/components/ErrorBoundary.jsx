import React from 'react';
import { ShieldAlert, RefreshCw, Home, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CBT Application Error Caught]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.hash = '';
      window.location.pathname = '/';
    }
  };

  handleHardReset = () => {
    try {
      localStorage.removeItem('civil_cbt_token_v1');
      localStorage.removeItem('civil_cbt_current_user_v5');
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: 'var(--bg-card, #1e293b)',
            border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.15))',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '1rem',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              marginBottom: '1.25rem'
            }}>
              <ShieldAlert size={48} />
            </div>

            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--brand-emerald, #10b981)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              Lagos State Civil Service Commission (LSCSC)
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-main, #f8fafc)',
              marginBottom: '0.75rem'
            }}>
              View Display Recovery
            </h2>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted, #94a3b8)',
              lineHeight: 1.6,
              marginBottom: '1.75rem'
            }}>
              The requested view encountered a temporary loading problem. You can safely return to the home screen or reset your active session.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: 'var(--text-subtle, #64748b)',
                fontFamily: 'monospace',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.75rem'
              }}>
                {String(this.state.error?.message || this.state.error)}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleReset}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
              >
                <Home size={16} />
                <span>Return to Home</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={this.handleHardReset}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.8rem' }}
                title="Clears local cookies/session and returns to home"
              >
                <RotateCcw size={14} />
                <span>Reset Session</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
