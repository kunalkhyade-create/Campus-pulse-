import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  Radio, 
  Calendar, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

export function LandingPage({ navigate }) {
  const { switchDemoRole } = useAuth();
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        const live = data.filter(e => e.status === 'LIVE NOW' || e.status === 'TODAY');
        setLiveEvents(live.length ? live : data.slice(0, 2));
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column' }}>
      {/* Realtime Live Campus Ticker */}
      {liveEvents.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
          borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '0.6rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="radar-dot" />
            <strong style={{ color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CAMPUS PULSE LIVE:
            </strong>
          </div>
          <span style={{ color: '#f8fafc' }}>
            🔴 <strong>{liveEvents[0].title}</strong> is happening right now at {liveEvents[0].venue}!
          </span>
          <button
            onClick={() => navigate('/events/' + liveEvents[0].id)}
            style={{
              background: 'rgba(239, 68, 68, 0.25)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '0.2rem 0.6rem',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            View Live Status →
          </button>
        </div>
      )}

      {/* Main Hero Section */}
      <section style={{ padding: '3.5rem 1.5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 9999,
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.84rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={14} /> Official DYPCOEI Campus Hub
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1rem'
          }}>
            Welcome to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              DYPCOEI Campus Connect
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            color: '#94a3b8',
            maxWidth: 680,
            margin: '0 auto 2.5rem',
            lineHeight: 1.5
          }}>
            One platform for every event, club and opportunity at DYPCOEI.
          </p>

          <div style={{
            display: 'inline-block',
            fontSize: '0.95rem',
            color: '#cbd5e1',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.3rem 1rem',
            borderRadius: 20
          }}>
            Who are you? Choose Your Portal:
          </div>
        </div>
      </section>

      {/* Two Large Premium 3D Cards */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 3.5rem', width: '100%' }}>
        <div className="portal-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem'
        }}>
          {/* 🎓 STUDENT PORTAL CARD */}
          <div className="portal-card-3d portal-card-student">
            {/* Visual Header */}
            <div style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
              <img 
                src="/assets/student-portal-3d.jpg" 
                alt="Student 3D Campus Experience"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13, 19, 33, 1) 0%, rgba(13, 19, 33, 0.3) 60%, transparent 100%)'
              }} />
              <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'rgba(2, 132, 199, 0.85)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.35rem 0.8rem',
                borderRadius: 9999,
                letterSpacing: '0.04em'
              }}>
                STUDENT EXPERIENCE
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>🎓</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
                    STUDENT PORTAL
                  </h2>
                </div>

                <p style={{ fontSize: '1.05rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.8rem' }}>
                  Discover events. Register. Participate.
                </p>

                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  Explore technical hackathons, cultural festivals, sports cups, and workshops happening across DYPCOEI departments. Get instant QR passes and track participation history.
                </p>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#38bdf8" /> Real-time Live Event Updates & Announcements
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#38bdf8" /> Instant One-Click Registration & Digital QR Pass
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#38bdf8" /> Personalized Student Attendance & Activity Dashboard
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate('/student/login')}
                  className="btn btn-student"
                  style={{ width: '100%', padding: '0.95rem 1.5rem', fontSize: '1.05rem', borderRadius: 16 }}
                >
                  Student Login <ArrowRight size={18} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                  New to Campus Connect?{' '}
                  <span 
                    onClick={() => navigate('/student/register')} 
                    style={{ color: '#38bdf8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Create Student Account
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🏛️ CLUB PORTAL CARD */}
          <div className="portal-card-3d portal-card-club">
            {/* Visual Header */}
            <div style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
              <img 
                src="/assets/club-portal-3d.jpg" 
                alt="Club Leadership 3D Visual"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13, 19, 33, 1) 0%, rgba(13, 19, 33, 0.3) 60%, transparent 100%)'
              }} />
              <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'linear-gradient(135deg, #d97706, #ec4899)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.35rem 0.8rem',
                borderRadius: 9999,
                letterSpacing: '0.04em'
              }}>
                COORDINATOR PORTAL
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>🏛️</span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
                    CLUB PORTAL
                  </h2>
                </div>

                <p style={{ fontSize: '1.05rem', color: '#fbbf24', fontWeight: 600, marginBottom: '0.8rem' }}>
                  Publish events. Manage participation. Connect with students.
                </p>

                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  Official portal for registered DYPCOEI clubs and councils. Publish campus activities, control ongoing live events, scan attendance QR codes, and view registration analytics.
                </p>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#fbbf24" /> Prominent "+ Add Ongoing Event" Quick Creator
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#fbbf24" /> Live Event Control: Venue Updates & Student Broadcasts
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#fbbf24" /> QR Code Attendance Scanner & Participant CSV Export
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate('/club/login')}
                  className="btn btn-club"
                  style={{ width: '100%', padding: '0.95rem 1.5rem', fontSize: '1.05rem', borderRadius: 16 }}
                >
                  Club Login <ArrowRight size={18} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.82rem', color: '#94a3b8' }}>
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
        </div>

        {/* Small Admin Link at bottom */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={() => navigate('/admin/login')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            <ShieldCheck size={16} /> Administration Login
          </button>
        </div>

        {/* Instant 1-Click Interactive Demo Sandbox Bar */}
        <div style={{
          marginTop: '2.5rem',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 18,
          padding: '1.25rem 1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ⚡ Instant 1-Click Test Access:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Switch instantly to pre-configured accounts without manual typing:
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            <button
              onClick={async () => {
                await switchDemoRole('STUDENT');
                navigate('/student/dashboard');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', borderColor: 'rgba(56, 189, 248, 0.4)' }}
            >
              🎓 Test as Student (Kunal)
            </button>

            <button
              onClick={async () => {
                await switchDemoRole('CLUB');
                navigate('/club/dashboard');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              🏛️ Test as Club (Coding Club)
            </button>

            <button
              onClick={async () => {
                await switchDemoRole('ADMIN');
                navigate('/admin/dashboard');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', borderColor: 'rgba(16, 185, 129, 0.4)' }}
            >
              🔐 Test as Admin
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
