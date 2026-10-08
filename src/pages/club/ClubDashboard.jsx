import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClubSidebar } from '../../components/ClubSidebar';
import { LiveControlModal } from '../../components/LiveControlModal';
import { 
  PlusCircle, 
  Radio, 
  Calendar, 
  Users, 
  Ticket, 
  Activity, 
  MapPin, 
  Clock, 
  Megaphone, 
  CheckCircle2, 
  Edit3, 
  UserCheck, 
  QrCode,
  ArrowRight,
  TrendingUp,
  Share2
} from 'lucide-react';

export function ClubDashboard({ navigate }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [liveEventToControl, setLiveEventToControl] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshClubData = async () => {
    try {
      const [eventsRes, analyticsRes] = await Promise.all([
        fetch('/api/club/events', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
        }),
        fetch('/api/club/analytics', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
        })
      ]);

      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshClubData();
  }, []);

  const liveEvent = events.find(e => e.status === 'LIVE NOW') || events[0];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      {/* Club Sidebar */}
      <ClubSidebar 
        activeRoute="/club/dashboard" 
        navigate={navigate} 
        onAddOngoingEvent={() => navigate('/club/events/create?status=LIVE%20NOW')}
      />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {/* Top Header & Prominent "+ ADD ONGOING EVENT" Button */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-club">CLUB COORDINATOR CONSOLE</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>DYPCOEI Registered Organization</span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              Welcome, {user?.club?.name || user?.name || 'Coding Club'} 👋
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8' }}>
              Manage your club's activities and reach DYPCOEI students.
            </p>
          </div>

          {/* LARGE PROMINENT "+ ADD ONGOING EVENT" BUTTON (Requirement 14) */}
          <button
            onClick={() => navigate('/club/events/create?status=LIVE%20NOW')}
            style={{
              padding: '1rem 1.8rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 16,
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              boxShadow: '0 10px 30px -6px rgba(239, 68, 68, 0.7)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 14px 36px -4px rgba(239, 68, 68, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px -6px rgba(239, 68, 68, 0.7)';
            }}
          >
            <Radio size={22} className="radar-ping" />
            <span>+ ADD ONGOING EVENT</span>
          </button>
        </div>

        {/* 4 Statistics Cards (Requirement 12) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {/* 📅 EVENTS */}
          <div className="glass-card" style={{ padding: '1.4rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#fbbf24', letterSpacing: '0.05em' }}>
                📅 EVENTS
              </span>
              <Calendar size={20} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff' }}>
              {analytics?.totalEvents || 18}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Total published events
            </div>
          </div>

          {/* 👥 PARTICIPANTS */}
          <div className="glass-card" style={{ padding: '1.4rem', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#38bdf8', letterSpacing: '0.05em' }}>
                👥 PARTICIPANTS
              </span>
              <Users size={20} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff' }}>
              {analytics?.totalParticipants || 342}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Student attendees reached
            </div>
          </div>

          {/* 🟢 ACTIVE EVENTS */}
          <div className="glass-card" style={{ padding: '1.4rem', borderLeft: '4px solid #22c55e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#4ade80', letterSpacing: '0.05em' }}>
                🟢 ACTIVE EVENTS
              </span>
              <Activity size={20} color="#4ade80" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff' }}>
              {analytics?.activeEvents || 3}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Live & scheduled events
            </div>
          </div>

          {/* 🎫 REGISTRATIONS */}
          <div className="glass-card" style={{ padding: '1.4rem', borderLeft: '4px solid #ec4899' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f472b6', letterSpacing: '0.05em' }}>
                🎫 REGISTRATIONS
              </span>
              <Ticket size={20} color="#f472b6" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff' }}>
              {analytics?.totalRegistrations || 128}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Active student registrations
            </div>
          </div>
        </div>

        {/* 🔴 LIVE EVENT CONTROL (Requirement 17) */}
        {liveEvent && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.22) 0%, rgba(15, 23, 42, 0.95) 75%)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: 24,
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 20px 45px -10px rgba(239, 68, 68, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-live" style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>
                  <span className="radar-dot" /> 🔴 LIVE EVENT CONTROL
                </span>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  Real-time broadcast station
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {liveEvent.title}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={16} color="#ef4444" /> <strong>{liveEvent.venue}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} color="#38bdf8" /> {liveEvent.startTime} – {liveEvent.endTime}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={16} color="#a855f7" /> {liveEvent.participantsCount} Registered Students
                  </span>
                </div>
              </div>

              {/* 4 Quick Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                <button
                  onClick={() => setLiveEventToControl(liveEvent)}
                  className="btn btn-club"
                  style={{ padding: '0.65rem 1.1rem' }}
                >
                  <Edit3 size={15} /> Update Event
                </button>

                <button
                  onClick={() => setLiveEventToControl(liveEvent)}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.1rem' }}
                >
                  <MapPin size={15} /> Change Venue
                </button>

                <button
                  onClick={() => setLiveEventToControl(liveEvent)}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.1rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                >
                  <Megaphone size={15} color="#fbbf24" /> Post Announcement
                </button>

                <button
                  onClick={() => {
                    if (confirm('Mark this ongoing event as COMPLETED?')) {
                      fetch(`/api/club/events/${liveEvent.id}/status`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}`
                        },
                        body: JSON.stringify({ status: 'COMPLETED' })
                      }).then(() => refreshClubData());
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.1rem' }}
                >
                  <CheckCircle2 size={15} color="#4ade80" /> Mark Completed
                </button>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: 14,
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: '#94a3b8'
            }}>
              <span>
                💡 All updates broadcast instantly to registered students' phones and dashboard alerts.
              </span>
              <button
                onClick={() => navigate(`/club/events/${liveEvent.id}/participants`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fbbf24',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                Scan Attendance & Participants →
              </button>
            </div>
          </div>
        )}

        {/* Club Events Management Overview */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              Your Club Events
            </h3>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/club/events/create')}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                + Regular Event
              </button>
              <button
                onClick={() => navigate('/club/events')}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                View All Events →
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.map((evt) => (
              <div 
                key={evt.id} 
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <img 
                    src={evt.banner} 
                    alt={evt.title} 
                    style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className={`badge ${evt.status === 'LIVE NOW' ? 'badge-live' : evt.status === 'COMPLETED' ? 'badge-completed' : 'badge-upcoming'}`}>
                        {evt.status}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{evt.category}</span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                      {evt.title}
                    </h4>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', gap: '0.85rem' }}>
                      <span>📅 {evt.displayDate || evt.date}</span>
                      <span>📍 {evt.venue}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <button
                    onClick={() => navigate(`/club/events/${evt.id}/participants`)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '0.55rem 0.85rem' }}
                  >
                    <UserCheck size={14} color="#38bdf8" /> Manage Attendance ({evt.participantsCount})
                  </button>

                  <button
                    onClick={() => setLiveEventToControl(evt)}
                    className="btn btn-club"
                    style={{ fontSize: '0.82rem', padding: '0.55rem 0.85rem' }}
                  >
                    Live Controls
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Live Control Modal */}
      {liveEventToControl && (
        <LiveControlModal 
          event={liveEventToControl}
          onClose={() => setLiveEventToControl(null)}
          onUpdated={() => {
            refreshClubData();
          }}
        />
      )}
    </div>
  );
}
