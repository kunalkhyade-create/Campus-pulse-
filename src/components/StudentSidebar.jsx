import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Calendar, 
  Users, 
  Ticket, 
  Heart, 
  Bell, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';

export function StudentSidebar({ activeRoute, navigate, unreadCount = 2 }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Home', icon: Home, route: '/student/dashboard' },
    { label: 'Events', icon: Calendar, route: '/student/events' },
    { label: 'Clubs', icon: Users, route: '/clubs' },
    { label: 'My Registrations', icon: Ticket, route: '/student/registrations' },
    { label: 'Saved Events', icon: Heart, route: '/student/saved' },
    { label: 'Notifications', icon: Bell, route: '/student/notifications', badge: unreadCount },
    { label: 'Profile', icon: User, route: '/student/profile' },
  ];

  return (
    <aside style={{
      width: 260,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem',
      height: 'calc(100vh - 72px)',
      position: 'sticky',
      top: 72
    }}>
      {/* Top Student Profile Card */}
      <div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(99, 102, 241, 0.12))',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 16,
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <img 
            src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Student'}`} 
            alt="Profile" 
            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Kunal Khyade'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {user?.studentId || 'DYP2026CS042'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              {user?.department || 'Computer Engg'}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 1rem',
                  borderRadius: 12,
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={isActive ? '#38bdf8' : '#94a3b8'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '9999px',
                    padding: '0.1rem 0.45rem',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout button */}
      <div>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 12,
            border: '1px solid rgba(239, 68, 68, 0.2)',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#f87171',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
