import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, User, Mail, Lock, Phone, GraduationCap, CheckCircle2 } from 'lucide-react';

export function StudentRegisterPage({ navigate }) {
  const { registerStudent, triggerGoogleSignIn } = useAuth();
  const [formData, setFormData] = useState({
    name: 'Kunal Khyade',
    studentId: 'DYP2026CS099',
    email: 'kunal.new@dypcoei.ac.in',
    mobile: '+91 9822001122',
    department: 'Computer Engineering',
    year: 'TE',
    division: 'A',
    password: 'password123',
    confirmPassword: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const departments = [
    'Computer Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const years = ['FE', 'SE', 'TE', 'BE'];
  const divisions = ['A', 'B', 'C', 'D'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerStudent(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem'
    }}>
      <div style={{
        maxWidth: 780,
        width: '100%',
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 24,
        padding: '2.5rem',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/student/login')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              borderRadius: 10,
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} /> Back to Login
          </button>

          <span className="badge badge-student">DYPCOEI STUDENT PORTAL</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.4rem' }}>
          Create Student Account
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
          Join DYPCOEI Campus Connect to unlock automatic event participation and QR attendance passes.
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: 10,
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22c55e',
            color: '#86efac',
            padding: '1rem',
            borderRadius: 12,
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={20} /> Welcome to DYPCOEI Campus Connect! Redirecting to Dashboard...
          </div>
        )}

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={() => triggerGoogleSignIn('STUDENT')}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            fontWeight: 600,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            marginBottom: '1.25rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.79l7.98-6.2z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>Quick Sign up with Google</span>
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '0 0 1.5rem',
          color: '#64748b',
          fontSize: '0.78rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
          <span>or register manually below</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Name & Student ID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                className="form-input" 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kunal Khyade" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Student ID (PRN / Roll No) *</label>
              <input 
                className="form-input" 
                required 
                value={formData.studentId} 
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="e.g. DYP2026CS042" 
              />
            </div>
          </div>

          {/* Row 2: College Email & Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">College Email *</label>
              <input 
                className="form-input" 
                type="email" 
                required 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@dypcoei.ac.in" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input 
                className="form-input" 
                type="tel" 
                required 
                value={formData.mobile} 
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 9876543210" 
              />
            </div>
          </div>

          {/* Row 3: Department, Year, Division */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select 
                className="form-select"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map((d) => <option key={d} value={d} style={{ background: '#0f172a' }}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year *</label>
              <select 
                className="form-select"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                {years.map((y) => <option key={y} value={y} style={{ background: '#0f172a' }}>{y}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Division *</label>
              <select 
                className="form-select"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              >
                {divisions.map((div) => <option key={div} value={div} style={{ background: '#0f172a' }}>{div}</option>)}
              </select>
            </div>
          </div>

          {/* Row 4: Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input 
                className="form-input" 
                type="password" 
                required 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Choose secure password" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input 
                className="form-input" 
                type="password" 
                required 
                value={formData.confirmPassword} 
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Repeat password" 
              />
            </div>
          </div>

          {/* Profile Photo URL */}
          <div className="form-group">
            <label className="form-label">Profile Photo (URL or Dicebear Avatar)</label>
            <input 
              className="form-input" 
              value={formData.profileImage} 
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              placeholder="https://... image link" 
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="btn btn-student"
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', borderRadius: 14, marginTop: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'CREATE STUDENT ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
}
