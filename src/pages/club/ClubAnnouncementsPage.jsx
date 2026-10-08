import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClubSidebar } from '../../components/ClubSidebar';
import { Megaphone, Send, Clock, CheckCircle2, Calendar } from 'lucide-react';

export function ClubAnnouncementsPage({ navigate }) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const refreshAnnouncements = async () => {
    try {
      const [annRes, evtRes] = await Promise.all([
        fetch('/api/club/announcements', { headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` } }),
        fetch('/api/club/events', { headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` } })
      ]);
      if (annRes.ok) setAnnouncements(await annRes.json());
      if (evtRes.ok) {
        const evts = await evtRes.json();
        setEvents(evts);
        if (evts.length > 0) setSelectedEventId(evts[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshAnnouncements();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/club/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}`
        },
        body: JSON.stringify({
          eventId: selectedEventId || undefined,
          title,
          message
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Announcement failed');

      setSuccessMsg('Announcement published and sent to registered students!');
      setTitle('');
      setMessage('');
      refreshAnnouncements();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <ClubSidebar activeRoute="/club/announcements" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-club" style={{ marginBottom: '0.4rem' }}>
            STUDENT BROADCAST CHANNEL
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Club Announcements 📢
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Broadcast emergency venue notices, timeline updates, or general club alerts to participants.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {/* Post Form */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
              Create New Broadcast
            </h3>

            {successMsg && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                color: '#86efac',
                padding: '0.75rem 1rem',
                borderRadius: 12,
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            <form onSubmit={handlePost}>
              <div className="form-group">
                <label className="form-label">Related Event (Optional)</label>
                <select 
                  className="form-select form-club"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  <option value="" style={{ background: '#0f172a' }}>General Announcement (All Students)</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id} style={{ background: '#0f172a' }}>
                      {ev.title} ({ev.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Announcement Title *</label>
                <input 
                  className="form-input form-club"
                  required
                  placeholder='e.g. "📢 CodeStorm Venue Updated: Lab 3 → Seminar Hall"'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Notice *</label>
                <textarea 
                  className="form-textarea form-club"
                  rows={4}
                  required
                  placeholder="Provide precise details, time instructions, or contact info..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-club"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <Send size={16} /> {loading ? 'Broadcasting...' : 'Broadcast to Registered Students'}
              </button>
            </form>
          </div>

          {/* Previous Announcements List */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
              Past Announcements
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {announcements.map((a) => (
                <div key={a.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>
                      {a.eventTitle || 'General Notice'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                    {a.title}
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {a.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
