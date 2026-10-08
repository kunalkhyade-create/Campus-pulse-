import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Sparkles, Building, Lock } from 'lucide-react';

export function ClubLoginPage({ navigate }) {
  const { loginClub, switchDemoRole, triggerGoogleSignIn } = useAuth();
  const [identifier, setIdentifier] = useState('codingclub@dypcoei.ac.in');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginClub(identifier, password);
      navigate('/club/dashboard');
    } catch (err) {
      setError(err.message || 'Club login failed');
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
        maxWidth: 1040,
        width: '100%',
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px rgba(245, 158, 11, 0.15)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))'
      }}>
        {/* Left Side: Premium 3D Event/Club Illustration */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1f1406 0%, #030712 100%)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.55,
            backgroundImage: `url('/assets/club-portal-3d.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(23, 15, 5, 0.95) 10%, rgba(23, 15, 5, 0.4) 60%, rgba(23, 15, 5, 0.8) 100%)'
          }} />

          {/* Back button */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
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
              <ArrowLeft size={14} /> Back to Campus Connect
            </button>
          </div>

          {/* Text Overlay */}
          <div style={{ position: 'relative', zIndex: 2, marginTop: '7rem' }}>
            <span className="badge badge-club" style={{ marginBottom: '0.75rem' }}>
              🏛️ CLUB PORTAL
            </span>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '0.6rem'
            }}>
              Empower Your Club 🚀
            </h1>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.5, maxWidth: 360 }}>
              Create events. Reach students. Build memorable campus experiences.
            </p>

            <div style={{
              marginTop: '2rem',
              padding: '0.9rem',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 14,
              fontSize: '0.8rem',
              color: '#fcd34d'
            }}>
              💡 <strong>Pre-filled Demo Club Account:</strong>
              <div>Club ID / Email: <code>codingclub@dypcoei.ac.in</code></div>
              <div>Password: <code>password123</code></div>
            </div>
          </div>
        </div>

        {/* Right Side: Club Login Form */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Club Coordinator Login
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
              Publish events and manage student attendance at DYPCOEI.
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

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={() => triggerGoogleSignIn('CLUB')}
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
            <span>Continue with Google (Club Account)</span>
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '0 0 1.25rem',
            color: '#64748b',
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
            <span>or login with Club ID / email</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Club Email / Club ID</label>
              <input 
                className="form-input form-club"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter club email or club ID"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                className="form-input form-club"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter club password"
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              fontSize: '0.84rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#cbd5e1' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                Remember me
              </label>

              <span 
                onClick={() => alert('Contact admin@dypcoei.ac.in to reset club coordinator credentials')}
                style={{ color: '#fbbf24', cursor: 'pointer', fontWeight: 600 }}
              >
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-club"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: 14 }}
            >
              {loading ? 'Logging in...' : 'LOGIN AS CLUB'}
            </button>
          </form>

          {/* Request Club Access Link */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: '#94a3b8' }}>
            Is your club not registered?{' '}
            <span 
              onClick={() => navigate('/club/request-access')}
              style={{ color: '#fbbf24', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Request Club Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
