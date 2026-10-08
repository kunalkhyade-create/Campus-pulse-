import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Building, 
  CalendarCheck, 
  Users, 
  BarChart2, 
  LogOut,
  CheckCircle2
} from 'lucide-react';

export function AdminSidebar({ activeRoute, navigate }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Admin Dashboard', icon: ShieldCheck, route: '/admin/dashboard' },
    { label: 'Club Accreditations', icon: Building, route: '/admin/clubs' },
    { label: 'Event Approvals', icon: CalendarCheck, route: '/admin/events' },
    { label: 'Campus Users', icon: Users, route: '/admin/users' },
  ];

  return (
    <aside style={{
      width: 260,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(16, 185, 129, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem',
      height: 'calc(100vh - 72px)',
      position: 'sticky',
      top: 72
    }}>
      <div>
        {/* Admin Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 16,
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #10b981, #0d9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f8fafc' }}>
              DYPCOEI Central HQ
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              Dean Student Affairs
            </div>
          </div>
        </div>

        {/* Menu Items */}
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
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid transparent',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: isActive ? '#34d399' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={isActive ? '#34d399' : '#94a3b8'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

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
          cursor: 'pointer'
        }}
      >
        <LogOut size={16} /> Exit Admin Portal
      </button>
    </aside>
  );
}
