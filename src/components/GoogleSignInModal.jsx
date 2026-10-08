import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';

export function GoogleSignInModal({ isOpen, onClose, onSelectAccount, targetRole = 'STUDENT' }) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const defaultAccounts = targetRole === 'CLUB' ? [
    {
      name: 'Coding Club DYPCOEI',
      email: 'codingclub@dypcoei.ac.in',
      photo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=200',
      role: 'CLUB_COORDINATOR',
      clubId: 'club-1'
    },
    {
      name: 'Robotics & AI Club',
      email: 'robotics@dypcoei.ac.in',
      photo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=200',
      role: 'CLUB_COORDINATOR',
      clubId: 'club-2'
    }
  ] : [
    {
      name: 'Kunal Khyade',
      email: 'kunal.student@dypcoei.ac.in',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'STUDENT',
      studentId: 'DYP2026CS042',
      department: 'Computer Engineering',
      year: 'TE'
    },
    {
      name: 'Ananya Sharma',
      email: 'ananya.sharma@dypcoei.ac.in',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      role: 'STUDENT',
      studentId: 'DYP2026IT018',
      department: 'Information Technology',
      year: 'SE'
    }
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const name = customName || customEmail.split('@')[0];
    onSelectAccount({
      name,
      email: customEmail,
      photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      role: targetRole === 'CLUB' ? 'CLUB_COORDINATOR' : 'STUDENT',
      studentId: 'DYP2026' + Math.floor(1000 + Math.random() * 9000),
      department: 'Computer Engineering',
      year: 'TE'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          maxWidth: 440,
          background: '#ffffff',
          color: '#1f2937',
          borderRadius: 20,
          padding: '2rem 1.75rem',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: 4
          }}
        >
          <X size={20} />
        </button>

        {/* Google Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          {/* Official Google G SVG */}
          <div style={{ display: 'inline-flex', marginBottom: '0.85rem' }}>
            <svg width="40" height="40" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.79l7.98-6.2z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Sign in with Google
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
            to continue to <strong>DYPCOEI Campus Connect</strong>
          </p>
        </div>

        {/* Account List */}
        {!showCustomInput ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {defaultAccounts.map((acc) => (
              <div
                key={acc.email}
                onClick={() => onSelectAccount(acc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <img 
                  src={acc.photo} 
                  alt={acc.name} 
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#111827' }}>
                    {acc.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {acc.email}
                  </div>
                </div>
              </div>
            ))}

            {/* Use another account */}
            <div
              onClick={() => setShowCustomInput(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: 12,
                border: '1px dashed #d1d5db',
                cursor: 'pointer',
                color: '#4b5563'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4b5563'
              }}>
                <UserPlus size={18} />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>
                Use another college account
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} style={{ marginBottom: '1.25rem' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>
                Full Name
              </label>
              <input
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: '0.9rem',
                  color: '#111827'
                }}
                placeholder="e.g. Rahul Patil"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>
                Google Email / DYPCOEI Webmail
              </label>
              <input
                type="email"
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: '0.9rem',
                  color: '#111827'
                }}
                placeholder="name@dypcoei.ac.in"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  border: '1px solid #d1d5db',
                  background: '#f9fafb',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: '0.65rem',
                  border: 'none',
                  background: '#1a73e8',
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Continue as Google User
              </button>
            </div>
          </form>
        )}

        <div style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', lineHeight: 1.4 }}>
          To continue, Google will share your name, email address, language preference, and profile picture with DYPCOEI Campus Connect.
        </div>
      </div>
    </div>
  );
}
