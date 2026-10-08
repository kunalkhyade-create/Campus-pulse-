import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  CalendarDays, 
  Users2, 
  Megaphone, 
  Image, 
  BarChart3, 
  Settings, 
  Bell, 
  LogOut,
  Radio
} from 'lucide-react';

export function ClubSidebar({ activeRoute, navigate, onAddOngoingEvent }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, route: '/club/dashboard' },
    { label: 'Create Event', icon: PlusCircle, route: '/club/events/create' },
    { label: 'My Events', icon: CalendarDays, route: '/club/events' },
    { label: 'Participants', icon: Users2, route: '/club/participants' },
    { label: 'Announcements', icon: Megaphone, route: '/club/announcements' },
    { label: 'Event Gallery', icon: Image, route: '/club/gallery' },
    { label: 'Analytics', icon: BarChart3, route: '/club/analytics' },
    { label: 'Club Profile', icon: Settings, route: '/club/profile' },
  ];

  return (
    <aside style={{
      width: 270,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(245, 158, 11, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem',
      height: 'calc(100vh - 72px)',
      position: 'sticky',
      top: 72
    }}>
      <div>
        {/* Club Coordinator Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(236, 72, 153, 0.12))',
          border: '1px solid rgba(245, 158, 11, 0.28)',
          borderRadius: 16,
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #d97706, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            🏛️
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.club?.name || user?.name || 'Coding Club'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
              Club Coordinator Portal
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              Status: <span style={{ color: '#4ade80' }}>● Active & Verified</span>
            </div>
          </div>
        </div>

        {/* MOST IMPORTANT CLUB FEATURE: Large + ADD ONGOING EVENT button */}
        <button
          onClick={() => onAddOngoingEvent ? onAddOngoingEvent() : navigate('/club/events/create?type=live')}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 14,
            fontWeight: 800,
            fontSize: '0.92rem',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 8px 24px -6px rgba(239, 68, 68, 0.6)',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(239, 68, 68, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(239, 68, 68, 0.6)';
          }}
        >
          <Radio size={18} className="radar-ping" />
          <span>+ ADD ONGOING EVENT</span>
        </button>

        {/* Navigation Items */}
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
                  gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: 12,
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid transparent',
                  background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: isActive ? '#fbbf24' : '#94a3b8',
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
                <Icon size={18} color={isActive ? '#fbbf24' : '#94a3b8'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
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
          <span>Exit Club Portal</span>
        </button>
      </div>
    </aside>
  );
}
