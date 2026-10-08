import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentSidebar } from '../../components/StudentSidebar';
import { EventCard } from '../../components/EventCard';
import { RegisterModal } from '../../components/RegisterModal';
import { QRModal } from '../../components/QRModal';
import { 
  Sparkles, 
  Radio, 
  Calendar, 
  Flame, 
  Ticket, 
  Search, 
  Filter, 
  Bell, 
  ArrowRight,
  Clock,
  MapPin
} from 'lucide-react';

export function StudentDashboard({ navigate }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState(null);
  const [viewingQRRegistration, setViewingQRRegistration] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load events & user registrations
  const refreshData = async () => {
    try {
      const [eventsRes, regsRes, savedRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/student/registrations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
        }),
        fetch('/api/student/saved', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
        })
      ]);

      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (regsRes.ok) setMyRegistrations(await regsRes.json());
      if (savedRes.ok) {
        const savedList = await savedRes.json();
        setSavedEventIds(savedList.map(e => e.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleToggleSave = async (eventId) => {
    try {
      const res = await fetch(`/api/student/saved/${eventId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      const data = await res.json();
      setSavedEventIds(data.savedEvents || []);
    } catch (e) {
      console.error(e);
    }
  };

  const liveEvents = events.filter(e => e.status === 'LIVE NOW');
  const todayEvents = events.filter(e => e.status === 'TODAY');
  const upcomingEvents = events.filter(e => e.status === 'UPCOMING');

  // Filtered list according to tab & search
  let displayedEvents = events;
  if (activeTab === 'LIVE') displayedEvents = liveEvents;
  else if (activeTab === 'TODAY') displayedEvents = todayEvents;
  else if (activeTab === 'UPCOMING') displayedEvents = upcomingEvents;

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    displayedEvents = displayedEvents.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.clubName.toLowerCase().includes(q)
    );
  }

  const registeredEventIds = myRegistrations.map(r => r.eventId);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      {/* Student Sidebar */}
      <StudentSidebar activeRoute="/student/dashboard" navigate={navigate} />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {/* Top Greeting Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-student">DYPCOEI STUDENT CONNECT</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>• Semester 2026</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Good Morning, {user?.name?.split(' ')[0] || 'Kunal'} 👋
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8' }}>
            Here's what's happening at DYPCOEI today.
          </p>
        </div>

        {/* 4 Dashboard Metric / Section Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1: 🔴 LIVE NOW */}
          <div 
            onClick={() => setActiveTab('LIVE')}
            className="glass-card" 
            style={{
              padding: '1.4rem',
              cursor: 'pointer',
              border: activeTab === 'LIVE' ? '1px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.25)',
              background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.8))'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="radar-dot" />
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#f87171', letterSpacing: '0.05em' }}>
                  LIVE NOW
                </span>
              </div>
              <Radio size={20} color="#f87171" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.2rem' }}>
              {liveEvents.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Events currently happening
            </div>
          </div>

          {/* Card 2: 📅 TODAY */}
          <div 
            onClick={() => setActiveTab('TODAY')}
            className="glass-card" 
            style={{
              padding: '1.4rem',
              cursor: 'pointer',
              border: activeTab === 'TODAY' ? '1px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.25)',
              background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.8))'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fbbf24', letterSpacing: '0.05em' }}>
                📅 TODAY
              </span>
              <Calendar size={20} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.2rem' }}>
              {todayEvents.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Scheduled for today
            </div>
          </div>

          {/* Card 3: 🔥 UPCOMING */}
          <div 
            onClick={() => setActiveTab('UPCOMING')}
            className="glass-card" 
            style={{
              padding: '1.4rem',
              cursor: 'pointer',
              border: activeTab === 'UPCOMING' ? '1px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.25)',
              background: 'linear-gradient(145deg, rgba(56, 189, 248, 0.12), rgba(15, 23, 42, 0.8))'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#38bdf8', letterSpacing: '0.05em' }}>
                🔥 UPCOMING
              </span>
              <Flame size={20} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.2rem' }}>
              {upcomingEvents.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Upcoming campus activities
            </div>
          </div>

          {/* Card 4: 🎫 MY REGISTRATIONS */}
          <div 
            onClick={() => navigate('/student/registrations')}
            className="glass-card" 
            style={{
              padding: '1.4rem',
              cursor: 'pointer',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.12), rgba(15, 23, 42, 0.8))'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#818cf8', letterSpacing: '0.05em' }}>
                🎫 MY REGISTRATIONS
              </span>
              <Ticket size={20} color="#818cf8" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.2rem' }}>
              {myRegistrations.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Events you are registered for
            </div>
          </div>
        </div>

        {/* Highlight Banner: 🔴 LIVE NOW ONGOING EVENT HIGHLIGHT */}
        {liveEvents.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.95) 70%)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 20,
            padding: '1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <img 
                src={liveEvents[0].banner} 
                alt="Live Event" 
                style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', border: '2px solid #ef4444' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className="badge badge-live">🔴 LIVE NOW</span>
                  <span style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>{liveEvents[0].clubName}</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                  {liveEvents[0].title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <span>📍 {liveEvents[0].venue}</span>
                  <span>⏰ {liveEvents[0].startTime} – {liveEvents[0].endTime}</span>
                  <span>👥 {liveEvents[0].participantsCount} attending</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {registeredEventIds.includes(liveEvents[0].id) ? (
                <button
                  onClick={() => {
                    const reg = myRegistrations.find(r => r.eventId === liveEvents[0].id);
                    setViewingQRRegistration(reg);
                  }}
                  className="btn btn-student"
                >
                  <Ticket size={16} /> Show My Entry Pass
                </button>
              ) : (
                <button
                  onClick={() => setSelectedEventForRegister(liveEvents[0])}
                  className="btn btn-student"
                >
                  Instant Register
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'LIVE', label: '🔴 Live Now' },
              { id: 'TODAY', label: '📅 Today' },
              { id: 'UPCOMING', label: '🔥 Upcoming' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 12,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: activeTab === tab.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: activeTab === tab.id ? '#38bdf8' : '#94a3b8'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: 300 }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 13 }} />
            <input 
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search events, clubs, venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Events Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {displayedEvents.map(evt => (
            <EventCard 
              key={evt.id}
              event={evt}
              isRegistered={registeredEventIds.includes(evt.id)}
              isSaved={savedEventIds.includes(evt.id)}
              onToggleSave={handleToggleSave}
              onRegister={(e) => setSelectedEventForRegister(e)}
              onViewDetails={(e) => navigate('/events/' + e.id)}
            />
          ))}
        </div>
      </main>

      {/* Registration Modal */}
      {selectedEventForRegister && (
        <RegisterModal 
          event={selectedEventForRegister}
          user={user}
          navigate={navigate}
          onClose={() => setSelectedEventForRegister(null)}
          onSuccess={() => {
            refreshData();
          }}
        />
      )}

      {/* QR Ticket Modal */}
      {viewingQRRegistration && (
        <QRModal 
          registration={viewingQRRegistration}
          onClose={() => setViewingQRRegistration(null)}
        />
      )}
    </div>
  );
}
