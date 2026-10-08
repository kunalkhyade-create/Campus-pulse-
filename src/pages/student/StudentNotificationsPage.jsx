import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentSidebar } from '../../components/StudentSidebar';
import { Bell, Sparkles, Radio, Megaphone, CheckCircle2 } from 'lucide-react';

export function StudentNotificationsPage({ navigate }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/student/notifications', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
    })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <StudentSidebar activeRoute="/student/notifications" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-student" style={{ marginBottom: '0.4rem' }}>
            CAMPUS ALERTS
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Notifications & Broadcasts 🔔
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Real-time event updates, venue changes, and registration confirmations.
          </p>
        </div>

        <div style={{ maxWidth: 840, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className="glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                borderLeft: notif.type === 'live_update' ? '4px solid #ef4444' : '4px solid #38bdf8'
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: notif.type === 'live_update' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: notif.type === 'live_update' ? '#f87171' : '#38bdf8'
              }}>
                {notif.type === 'live_update' ? <Radio size={20} /> : <Bell size={20} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                    {notif.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
