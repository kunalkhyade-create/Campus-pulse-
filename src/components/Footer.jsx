import React from 'react';
import { ShieldCheck, Heart, Sparkles, Building, Globe } from 'lucide-react';

export function Footer({ navigate }) {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(8, 12, 20, 0.95)',
      padding: '3rem 1.5rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Col 1: Brand & College */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0284c7, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800
              }}>
                ⚡
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                DYPCOEI Campus Connect
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
              Dr. D. Y. Patil College of Engineering and Innovation (DYPCOEI), Varale, Talegaon Dabhade, Pune.
            </p>
            <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>
              Discover • Participate • Connect
            </div>
          </div>

          {/* Col 2: Student Experience */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎓 Student Portal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#94a3b8' }}>
              <span onClick={() => navigate('/student/login')} style={{ cursor: 'pointer', hover: { color: '#38bdf8' } }}>Student Login</span>
              <span onClick={() => navigate('/student/register')} style={{ cursor: 'pointer' }}>Create Student Account</span>
              <span onClick={() => navigate('/student/dashboard')} style={{ cursor: 'pointer' }}>Student Dashboard</span>
              <span onClick={() => navigate('/student/registrations')} style={{ cursor: 'pointer' }}>My Registrations & Tickets</span>
            </div>
          </div>

          {/* Col 3: Club Coordinator Experience */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🏛️ Club Portal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#94a3b8' }}>
              <span onClick={() => navigate('/club/login')} style={{ cursor: 'pointer' }}>Club Coordinator Login</span>
              <span onClick={() => navigate('/club/request-access')} style={{ cursor: 'pointer' }}>Request Club Access</span>
              <span onClick={() => navigate('/club/dashboard')} style={{ cursor: 'pointer' }}>Club Dashboard</span>
              <span onClick={() => navigate('/club/events/create')} style={{ cursor: 'pointer' }}>+ Add Ongoing Event</span>
            </div>
          </div>

          {/* Col 4: Administration & Verification */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🔐 Central Authority
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
              All club accreditations and event publications are regulated by DYPCOEI Academic & Student Affairs council.
            </p>
            <button
              onClick={() => navigate('/admin/login')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                padding: '0.5rem 0.85rem',
                borderRadius: 8,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <ShieldCheck size={14} color="#10b981" /> Administration Login
            </button>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            © 2026 DYPCOEI Campus Connect. Everything happening at DYPCOEI — in one place.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Dr. D. Y. Patil Pratishthan's College of Engineering & Innovation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
