import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Briefcase, 
  Award, 
  Lock, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { MINISTRIES_DEPARTMENTS } from '../data/gradeLevelCategories';
import { updateUserProfile, changeUserPassword } from '../data/authData';
import CandidateAvatar from './CandidateAvatar';

export default function CandidateSettings({
  candidate,
  onCandidateUpdated,
  gradeCategories,
  selectedCategory,
  setSelectedCategory,
  onBackToDashboard
}) {
  // Demo Mode Guard: Demo accounts have no settings to change name or anything
  if (candidate?.isDemo) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1.25rem 5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
          <div style={{ color: 'var(--brand-amber)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Lock size={48} />
          </div>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Settings Disabled for Demo Accounts
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Demo candidate accounts are read-only demonstration accounts. Profile editing (names, cadre, ministry, grade level) and password changes are disabled. Please register your own official candidate account to customize your profile.
          </p>
          <button className="btn btn-primary" onClick={onBackToDashboard}>
            <ArrowLeft size={16} />
            <span>Return to Officer Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  // Profile Information State
  const [firstName, setFirstName] = useState(
    candidate?.firstName || candidate?.fullName?.split(' ')[0] || ''
  );
  const [surname, setSurname] = useState(
    candidate?.surname || candidate?.fullName?.split(' ').slice(1).join(' ') || ''
  );
  const [ministry, setMinistry] = useState(
    candidate?.ministry || MINISTRIES_DEPARTMENTS[0]
  );
  const [cadre, setCadre] = useState(
    candidate?.cadre || selectedCategory?.cadres[0] || 'Administrative Officer I'
  );
  const [targetGrade, setTargetGrade] = useState(
    candidate?.targetGrade || selectedCategory?.gradeLevels[0] || 'GL 10'
  );

  // Security & Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Feedback Messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Live preview initials
  const previewFullName = `${firstName.trim()} ${surname.trim()}`.trim() || candidate?.fullName || 'Candidate';

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!firstName.trim() || !surname.trim()) {
      setErrorMessage("Both First Name and Surname are required.");
      return;
    }

    try {
      setIsSaving(true);

      // Determine matching category for chosen grade level
      const matchingCat = gradeCategories.find(c => 
        c.gradeLevels.includes(targetGrade) || c.id === candidate?.categoryId
      ) || selectedCategory;

      const updated = await updateUserProfile(candidate.id, {
        firstName: firstName.trim(),
        surname: surname.trim(),
        ministry: ministry.trim(),
        cadre: cadre.trim(),
        targetGrade: targetGrade.trim(),
        categoryId: matchingCat.id
      });

      if (setSelectedCategory && matchingCat) {
        setSelectedCategory(matchingCat);
      }

      if (onCandidateUpdated) {
        onCandidateUpdated(updated);
      }

      setSuccessMessage("Officer profile information updated successfully!");
      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPassword) {
      setErrorMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage("New password must be a minimum of 4 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await changeUserPassword(candidate.id, currentPassword, newPassword);

      if (onCandidateUpdated) {
        onCandidateUpdated(updated);
      }

      setSuccessMessage("Security password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to change password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.25rem 5rem', maxWidth: '880px', margin: '0 auto' }}>
      
      {/* Top Navigation & Back Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            id="settings-back-btn"
            className="btn btn-sm btn-ghost"
            onClick={onBackToDashboard}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.5rem', padding: '0.35rem 0.6rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            Account & Officer Settings
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.35rem 0 0' }}>
            Manage your personal profile details, ministry, promotion cadre, and security credentials.
          </p>
        </div>

        {/* Live Avatar Badge Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'var(--bg-card)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-medium)' }}>
          <CandidateAvatar name={previewFullName} size={48} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Live Avatar Preview
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {previewFullName}
            </div>
          </div>
        </div>
      </div>

      {/* Success & Error Banner Alerts */}
      {successMessage && (
        <div className="animate-fade-in" style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: 'var(--brand-emerald)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.9rem',
          textAlign: 'left'
        }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="animate-fade-in" style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: 'var(--brand-rose)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.9rem',
          textAlign: 'left'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. EDIT PROFILE & CADRE FORM */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '2rem',
        textAlign: 'left',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <User size={20} color="var(--brand-primary)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Officer Personal & Cadre Details
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
              Changes to your name will update your candidate examination slips and initial-avatar.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile}>
          {/* First Name & Surname */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="settings-firstname" className="form-label">First Name:</label>
              <input
                type="text"
                id="settings-firstname"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Babatunde"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="settings-surname" className="form-label">Surname:</label>
              <input
                type="text"
                id="settings-surname"
                className="form-input"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="e.g. Olatunji"
                required
              />
            </div>
          </div>

          {/* Ministry / Department / Agency (MDA) */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="settings-ministry" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={15} color="var(--brand-gold)" />
              <span>Ministry / Department / Agency (MDA):</span>
            </label>
            <select
              id="settings-ministry"
              className="form-select"
              value={ministry}
              onChange={(e) => setMinistry(e.target.value)}
              required
            >
              {MINISTRIES_DEPARTMENTS.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Cadre & Target Grade Level */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label htmlFor="settings-cadre" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Briefcase size={15} color="#a78bfa" />
                <span>Cadre / Professional Track:</span>
              </label>
              <input
                type="text"
                id="settings-cadre"
                className="form-input"
                value={cadre}
                onChange={(e) => setCadre(e.target.value)}
                placeholder="e.g. Administrative Officer I"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="settings-target-grade" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={15} color="var(--brand-emerald)" />
                <span>Target Promotion Grade:</span>
              </label>
              <select
                id="settings-target-grade"
                className="form-select"
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                required
                disabled
                title="Your target grade was fixed at registration. Contact the Commission to change it."
              >
                {gradeCategories.flatMap(c => c.gradeLevels).map((gl, idx) => (
                  <option key={idx} value={gl}>{gl}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              id="save-profile-btn"
              className="btn btn-primary"
              disabled={isSaving}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.4rem', fontWeight: 700 }}
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. CHANGE PASSWORD & SECURITY FORM */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        textAlign: 'left',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <Lock size={20} color="var(--brand-gold)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Change Security Password
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
              Minimum 4 characters required. Your browser will prompt you to save your updated password.
            </p>
          </div>
        </div>

        <form method="post" action="#" onSubmit={handleChangePassword} autoComplete="on">
          {/* Invisible username field for browser credential managers */}
          <input 
            type="text" 
            name="username" 
            value={candidate?.username || ''} 
            autoComplete="username" 
            readOnly 
            style={{ display: 'none' }} 
            tabIndex="-1"
          />

          {/* Current Password */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="settings-current-password" className="form-label">
              Current Password:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPass ? 'text' : 'password'}
                id="settings-current-password"
                name="current-password"
                className="form-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
                aria-label="Toggle password visibility"
              >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password & Confirmation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label htmlFor="settings-new-password" className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>New Password:</span>
                <span style={{ fontSize: '0.75rem', color: newPassword.length >= 4 ? 'var(--brand-emerald)' : 'var(--text-muted)' }}>
                  {newPassword.length >= 4 ? "✓ Valid (Min 4 chars)" : "Min 4 characters"}
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  id="settings-new-password"
                  name="password"
                  className="form-input"
                  placeholder="Enter new password (min 4 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="settings-confirm-password" className="form-label">
                Confirm New Password:
              </label>
              <input
                type={showNewPass ? 'text' : 'password'}
                id="settings-confirm-password"
                className="form-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              id="change-password-btn"
              className="btn btn-gold"
              disabled={isSaving}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.4rem', fontWeight: 700 }}
            >
              <Lock size={16} />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}