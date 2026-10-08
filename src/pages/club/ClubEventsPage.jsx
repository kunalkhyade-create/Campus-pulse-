import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClubSidebar } from '../../components/ClubSidebar';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  UserCheck, 
  Copy, 
  Radio, 
  Eye, 
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

export function ClubEventsPage({ navigate }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/club/events', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      if (res.ok) setEvents(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCancelEvent = async (id) => {
    if (!confirm('Are you sure you want to cancel this event?')) return;
    try {
      await fetch(`/api/club/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      fetchEvents();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDuplicate = async (evt) => {
    const { id, _id, createdAt, updatedAt, ...cloneData } = evt;
    cloneData.title = `${evt.title} (Copy)`;
    try {
      const res = await fetch('/api/club/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}`
        },
        body: JSON.stringify(cloneData)
      });
      if (res.ok) fetchEvents();
    } catch (e) {
      alert(e.message);
    }
  };

  const upcomingList = events.filter(e => e.status === 'UPCOMING');
  const liveList = events.filter(e => e.status === 'LIVE NOW');
  const completedList = events.filter(e => e.status === 'COMPLETED');
  const cancelledList = events.filter(e => e.status === 'CANCELLED');

  let filtered = events;
  if (activeTab === 'UPCOMING') filtered = upcomingList;
  else if (activeTab === 'LIVE') filtered = liveList;
  else if (activeTab === 'COMPLETED') filtered = completedList;
  else if (activeTab === 'CANCELLED') filtered = cancelledList;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <ClubSidebar activeRoute="/club/events" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <span className="badge badge-club" style={{ marginBottom: '0.4rem' }}>
              CLUB EVENT MANAGEMENT
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Manage Club Events
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Organize, update, take attendance, and track student sign-ups.
            </p>
          </div>

          <button
            onClick={() => navigate('/club/events/create')}
            className="btn btn-club"
            style={{ padding: '0.85rem 1.4rem' }}
          >
            <PlusCircle size={18} /> + Create New Event
          </button>
        </div>

        {/* Status Tabs (Requirement 18: Upcoming, Live Now, Completed, Cancelled) */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
          {[
            { id: 'ALL', label: `All (${events.length})` },
            { id: 'LIVE', label: `🔴 Live Now (${liveList.length})` },
            { id: 'UPCOMING', label: `Upcoming (${upcomingList.length})` },
            { id: 'COMPLETED', label: `Completed (${completedList.length})` },
            { id: 'CANCELLED', label: `Cancelled (${cancelledList.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: 12,
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: activeTab === tab.id ? '1px solid #fbbf24' : '1px solid transparent',
                background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                color: activeTab === tab.id ? '#fbbf24' : '#94a3b8'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map((evt) => (
            <div 
              key={evt.id} 
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                borderLeft: evt.status === 'LIVE NOW' ? '4px solid #ef4444' : evt.status === 'CANCELLED' ? '4px solid #64748b' : '4px solid #fbbf24'
              }}
            >
              {/* Left Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img 
                  src={evt.banner} 
                  alt={evt.title} 
                  style={{ width: 90, height: 90, borderRadius: 16, objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className={`badge ${evt.status === 'LIVE NOW' ? 'badge-live' : evt.status === 'COMPLETED' ? 'badge-completed' : 'badge-upcoming'}`}>
                      {evt.status}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>{evt.category}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                    {evt.title}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                    <span>📅 {evt.displayDate || evt.date} ({evt.startTime})</span>
                    <span>📍 {evt.venue}</span>
                    <span>
                      👥 Registrations: <strong style={{ color: '#fff' }}>{evt.participantsCount || 0}</strong> / Capacity: {evt.capacity || 100}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit, View, Manage Participants, Duplicate, Cancel */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                <button
                  onClick={() => navigate(`/club/events/${evt.id}/participants`)}
                  className="btn btn-student"
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <UserCheck size={14} /> Participants & QR Attendance
                </button>

                <button
                  onClick={() => navigate(`/events/${evt.id}`)}
                  className="btn btn-secondary"
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <Eye size={14} /> View
                </button>

                <button
                  onClick={() => handleDuplicate(evt)}
                  className="btn btn-secondary"
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem' }}
                  title="Duplicate Event"
                >
                  <Copy size={14} /> Duplicate
                </button>

                {evt.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancelEvent(evt.id)}
                    className="btn btn-danger"
                    style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    <Trash2 size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
