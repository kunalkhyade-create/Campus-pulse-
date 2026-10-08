import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentSidebar } from '../../components/StudentSidebar';
import { EventCard } from '../../components/EventCard';
import { RegisterModal } from '../../components/RegisterModal';
import { Search, Filter, Calendar, Sparkles } from 'lucide-react';

export function StudentEventsPage({ navigate }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventForRegister, setSelectedEventForRegister] = useState(null);

  const categories = ['All', 'Technical', 'Workshop', 'Cultural', 'Sports', 'Competition', 'Social'];

  const refreshData = async () => {
    try {
      const [eRes, rRes, sRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/student/registrations', { headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` } }),
        fetch('/api/student/saved', { headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` } })
      ]);
      if (eRes.ok) setEvents(await eRes.json());
      if (rRes.ok) setMyRegistrations(await rRes.json());
      if (sRes.ok) {
        const saved = await sRes.json();
        setSavedEventIds(saved.map(s => s.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleToggleSave = async (id) => {
    try {
      const res = await fetch(`/api/student/saved/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      const data = await res.json();
      setSavedEventIds(data.savedEvents || []);
    } catch (e) {
      console.error(e);
    }
  };

  let filtered = events;
  if (selectedCategory !== 'All') {
    filtered = filtered.filter(e => e.category?.toLowerCase().includes(selectedCategory.toLowerCase()));
  }
  if (selectedStatus !== 'All') {
    filtered = filtered.filter(e => e.status?.toUpperCase() === selectedStatus.toUpperCase());
  }
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.clubName.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  }

  const registeredEventIds = myRegistrations.map(r => r.eventId);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <StudentSidebar activeRoute="/student/events" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-student" style={{ marginBottom: '0.4rem' }}>
            CAMPUS DISCOVERY
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Explore DYPCOEI Events
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Browse hackathons, technical symposia, sports meets, and cultural festivals hosted by campus clubs.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 10,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedCategory === c ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: selectedCategory === c ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedCategory === c ? '#38bdf8' : '#94a3b8'
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input 
              className="form-input" 
              style={{ paddingLeft: 36, padding: '0.6rem 0.6rem 0.6rem 2.2rem' }}
              placeholder="Search by name, club, lab..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {filtered.map(evt => (
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

      {selectedEventForRegister && (
        <RegisterModal 
          event={selectedEventForRegister}
          user={user}
          navigate={navigate}
          onClose={() => setSelectedEventForRegister(null)}
          onSuccess={() => refreshData()}
        />
      )}
    </div>
  );
}
