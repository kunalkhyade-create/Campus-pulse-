import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentSidebar } from '../../components/StudentSidebar';
import { EventCard } from '../../components/EventCard';
import { RegisterModal } from '../../components/RegisterModal';
import { Heart, Calendar } from 'lucide-react';

export function StudentSavedPage({ navigate }) {
  const { user } = useAuth();
  const [savedEvents, setSavedEvents] = useState([]);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState(null);

  const fetchSaved = async () => {
    try {
      const res = await fetch('/api/student/saved', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      if (res.ok) setSavedEvents(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleToggleSave = async (id) => {
    try {
      await fetch(`/api/student/saved/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      fetchSaved();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <StudentSidebar activeRoute="/student/saved" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-student" style={{ marginBottom: '0.4rem' }}>
            BOOKMARKS & WISHLIST
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Saved Events ❤️
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Events you have bookmarked to follow or register for later.
          </p>
        </div>

        {savedEvents.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Heart size={48} color="#f43f5e" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
              No saved events yet
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Click the ♡ icon on any event card to save it for quick access.
            </p>
            <button onClick={() => navigate('/student/events')} className="btn btn-student">
              Browse Events
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {savedEvents.map(evt => (
              <EventCard 
                key={evt.id}
                event={evt}
                isSaved={true}
                onToggleSave={handleToggleSave}
                onRegister={(e) => setSelectedEventForRegister(e)}
                onViewDetails={(e) => navigate('/events/' + e.id)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedEventForRegister && (
        <RegisterModal 
          event={selectedEventForRegister}
          user={user}
          navigate={navigate}
          onClose={() => setSelectedEventForRegister(null)}
          onSuccess={() => fetchSaved()}
        />
      )}
    </div>
  );
}
