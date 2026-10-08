import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Calendar, 
  Users, 
  Sparkles, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export function Navbar({ activeRoute, navigate }) {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '0.85rem 1.5rem',
      background: 'rgba(8, 12, 20, 0.88)'
    }}>
      <div style={{
        maxWidth: 1380,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 50%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#fff'
          }}>
            ⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 40%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                DYPCOEI
              </span>
              <span style={{
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)'
              }}>
                Campus Connect
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Discover • Participate • Connect
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hidden-mobile">
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: activeRoute === '/' ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.92rem'
            }}
          >
            <Compass size={16} /> Home
          </button>

          <button 
            onClick={() => navigate(role === 'STUDENT' ? '/student/events' : '/events')}
            style={{
              background: 'none',
              border: 'none',
              color: activeRoute?.includes('events') ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.92rem'
            }}
          >
            <Calendar size={16} /> Events
          </button>

          <button 
            onClick={() => navigate('/clubs')}
            style={{
              background: 'none',
              border: 'none',
              color: activeRoute === '/clubs' ? '#fbbf24' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.92rem'
            }}
          >
            <Users size={16} /> Campus Clubs
          </button>
        </nav>

        {/* User Session / Login Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Role Indicator & Dashboard Button */}
              {role === 'STUDENT' && (
                <button 
                  onClick={() => navigate('/student/dashboard')}
                  className="btn btn-student"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                >
                  🎓 Student Dashboard
                </button>
              )}

              {role === 'CLUB_COORDINATOR' && (
                <button 
                  onClick={() => navigate('/club/dashboard')}
                  className="btn btn-club"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                >
                  🏛️ Club Portal
                </button>
              )}

              {role === 'ADMIN' && (
                <button 
                  onClick={() => navigate('/admin/dashboard')}
                  className="btn btn-admin"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                >
                  🔐 Admin Control
                </button>
              )}

              {/* User Avatar & Logout */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.35rem 0.6rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <img 
                  src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                  alt={user.name}
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  title="Logout"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button 
                onClick={() => navigate('/student/login')}
                className="btn btn-student"
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
              >
                🎓 Student Login
              </button>

              <button 
                onClick={() => navigate('/club/login')}
                className="btn btn-club"
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
              >
                🏛️ Club Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
