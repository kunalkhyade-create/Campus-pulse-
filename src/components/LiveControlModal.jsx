import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Radio, 
  Megaphone, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BellRing
} from 'lucide-react';

export function LiveControlModal({ event, onClose, onUpdated }) {
  const [venue, setVenue] = useState(event.venue || '');
  const [status, setStatus] = useState(event.status || 'LIVE NOW');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleQuickUpdate = async (newStatus = status) => {
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/club/events/${event.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          venue,
          announcementMessage: announcementMessage.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setSuccessMsg('Live Event updated and notification broadcasted to all registered students!');
      if (onUpdated) onUpdated(data.event);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-live" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="radar-dot" /> LIVE EVENT CONTROL
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
          {event.title}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          Update venue or broadcast live notifications directly to all {event.participantsCount || 87} registered participants.
        </p>

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

        {/* Change Venue */}
        <div className="form-group">
          <label className="form-label">Update Live Venue</label>
          <div style={{ position: 'relative' }}>
            <input 
              className="form-input" 
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Seminar Hall (Relocated from Lab 3)"
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Current: {event.venue}
          </span>
        </div>

        {/* Status Toggle */}
        <div className="form-group">
          <label className="form-label">Current Event Status</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {['LIVE NOW', 'UPCOMING', 'COMPLETED'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                style={{
                  padding: '0.6rem',
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: status === s ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: status === s ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: status === s ? '#fbbf24' : '#94a3b8'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Broadcast Announcement */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Megaphone size={14} color="#f59e0b" /> Broadcast Live Announcement to Students
          </label>
          <textarea 
            className="form-textarea" 
            rows={3}
            value={announcementMessage}
            onChange={(e) => setAnnouncementMessage(e.target.value)}
            placeholder="e.g. Computer Lab 3 setup is live! Please take your seats and connect to the DYPCOEI guest WiFi."
          />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Registered students will receive instant in-app alerts with sound!
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.25rem' }}>
          <button
            onClick={() => handleQuickUpdate(status)}
            disabled={loading}
            className="btn btn-club"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            <Radio size={16} /> {loading ? 'Broadcasting...' : 'Save & Broadcast Live Updates'}
          </button>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => handleQuickUpdate('COMPLETED')}
              disabled={loading}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.65rem' }}
            >
              <CheckCircle2 size={15} color="#22c55e" /> Mark Completed
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.65rem' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
