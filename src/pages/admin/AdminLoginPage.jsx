import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, ShieldCheck, Lock, Mail } from 'lucide-react';

export function AdminLoginPage({ navigate }) {
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('admin@dypcoei.ac.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Admin authentication failed');
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
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        maxWidth: 480,
        width: '100%',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: 24,
        padding: '2.5rem',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/')}
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
            <ArrowLeft size={14} /> Back
          </button>

          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            CENTRAL ADMINISTRATION
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #10b981, #0d9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#fff'
          }}>
            <ShieldCheck size={30} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Administration Login
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Approve registered clubs, manage published events, and oversee campus activities.
          </p>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email / Staff ID</label>
            <input 
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dypcoei.ac.in"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              className="form-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter master password"
            />
          </div>

          <div style={{
            padding: '0.75rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 10,
            fontSize: '0.8rem',
            color: '#a7f3d0',
            marginBottom: '1.5rem'
          }}>
            💡 <strong>Master Demo Admin:</strong> <code>admin@dypcoei.ac.in</code> / <code>admin123</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-admin"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: 14 }}
          >
            {loading ? 'Authenticating...' : 'ACCESS ADMIN DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  );
}
