import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClubSidebar } from '../../components/ClubSidebar';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export function ClubCreateEventPage({ navigate }) {
  const { user } = useAuth();

  // Check URL query parameters for ?status=LIVE NOW
  const searchParams = new URLSearchParams(window.location.search);
  const isOngoingPreset = searchParams.get('status') === 'LIVE NOW';

  const [formData, setFormData] = useState({
    title: isOngoingPreset ? 'Campus HackSprint Live' : '',
    description: '',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
    category: 'Technical',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: 'Computer Lab 3 (Ground Floor)',
    capacity: 100,
    registrationDeadline: `${new Date().toISOString().split('T')[0]} 23:59`,
    registrationType: 'Campus Connect Registration',
    registrationLink: '',
    participationFee: 'Free',
    rules: '1. DYPCOEI students only.\n2. Carry valid college ID card.\n3. Maintain laboratory decorum.',
    prizes: '1st Prize: ₹10,000 + Winner Trophy\n2nd Prize: ₹5,000 + Certificate',
    contactPerson: {
      name: user?.name || 'Club Coordinator',
      mobile: '+91 9811223344',
      email: user?.email || 'coordinator@dypcoei.ac.in'
    },
    status: isOngoingPreset ? 'LIVE NOW' : 'UPCOMING'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    'Technical',
    'Technical Competition',
    'Cultural',
    'Sports',
    'Workshop',
    'Competition',
    'Social',
    'Other'
  ];

  const venues = [
    'Computer Lab 3 (Ground Floor)',
    'Mechanical Seminar Audi & Innovation Lab',
    'Main College Auditorium',
    'Computer Center 2',
    'DYPCOEI Central Amphitheatre',
    'Sports Complex / Ground',
    'Seminar Hall 1',
    'Robotics & AI Center of Excellence'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/club/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Event creation failed');

      setSuccess(true);
      setTimeout(() => {
        navigate('/club/events');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to publish event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <ClubSidebar activeRoute="/club/events/create" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={() => navigate('/club/dashboard')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                borderRadius: 10,
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>

            {formData.status === 'LIVE NOW' ? (
              <span className="badge badge-live">
                <span className="radar-dot" /> PUBLISHING ONGOING / LIVE EVENT
              </span>
            ) : (
              <span className="badge badge-club">NEW EVENT PUBLICATION</span>
            )}
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            {formData.status === 'LIVE NOW' ? 'Publish Ongoing Event 🔴' : 'Create New Event'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Fill in event details to publish directly to DYPCOEI students.
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '0.85rem 1rem',
              borderRadius: 12,
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22c55e',
              color: '#86efac',
              padding: '1rem',
              borderRadius: 12,
              marginBottom: '1.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={20} /> Event successfully published to DYPCOEI Campus Connect!
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
            {/* Status Selector (Requirement 16) */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ fontWeight: 800 }}>Event Launch Status (Requirement 16)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
                {[
                  { id: 'UPCOMING', label: 'UPCOMING (Not started)', color: '#38bdf8' },
                  { id: 'LIVE NOW', label: '🔴 LIVE NOW (Happening)', color: '#ef4444' },
                  { id: 'COMPLETED', label: 'COMPLETED (Ended)', color: '#94a3b8' },
                  { id: 'CANCELLED', label: 'CANCELLED', color: '#f43f5e' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s.id })}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: 12,
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: formData.status === s.id ? `2px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                      background: formData.status === s.id ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      color: formData.status === s.id ? '#ffffff' : '#94a3b8',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Name */}
            <div className="form-group">
              <label className="form-label">Event Name *</label>
              <input 
                className="form-input form-club" 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder='e.g. "CodeStorm 2026"' 
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Event Description (Rich Text Overview) *</label>
              <textarea 
                className="form-textarea form-club" 
                rows={3} 
                required 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive overview, eligibility, agenda, tools needed..." 
              />
            </div>

            {/* Banner URL & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Event Poster / Banner Image URL</label>
                <input 
                  className="form-input form-club" 
                  value={formData.banner} 
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  placeholder="https://... poster image link" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Event Category *</label>
                <select 
                  className="form-select form-club"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((c) => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Date, Start Time, End Time */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input 
                  className="form-input form-club" 
                  type="date" 
                  required 
                  value={formData.date} 
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Start Time *</label>
                <input 
                  className="form-input form-club" 
                  type="text" 
                  required 
                  value={formData.startTime} 
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  placeholder="10:00 AM" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input 
                  className="form-input form-club" 
                  type="text" 
                  value={formData.endTime} 
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  placeholder="04:00 PM" 
                />
              </div>
            </div>

            {/* Venue & Capacity */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Campus Venue *</label>
                <input 
                  list="venue-options"
                  className="form-input form-club" 
                  required 
                  value={formData.venue} 
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Select or enter custom venue" 
                />
                <datalist id="venue-options">
                  {venues.map(v => <option key={v} value={v} />)}
                </datalist>
              </div>

              <div className="form-group">
                <label className="form-label">Max Participants Capacity</label>
                <input 
                  className="form-input form-club" 
                  type="number" 
                  value={formData.capacity} 
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="100" 
                />
              </div>
            </div>

            {/* Registration Deadline & Type */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Registration Deadline</label>
                <input 
                  className="form-input form-club" 
                  value={formData.registrationDeadline} 
                  onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                  placeholder="YYYY-MM-DD HH:MM" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Gateway</label>
                <select 
                  className="form-select form-club"
                  value={formData.registrationType}
                  onChange={(e) => setFormData({ ...formData, registrationType: e.target.value })}
                >
                  <option value="Campus Connect Registration" style={{ background: '#0f172a' }}>Campus Connect Registration (Direct QR Pass)</option>
                  <option value="External Registration Link" style={{ background: '#0f172a' }}>External Registration URL</option>
                </select>
              </div>
            </div>

            {formData.registrationType === 'External Registration Link' && (
              <div className="form-group">
                <label className="form-label">External Registration URL *</label>
                <input 
                  className="form-input form-club" 
                  type="url"
                  value={formData.registrationLink} 
                  onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                  placeholder="https://forms.gle/... or unstop link" 
                />
              </div>
            )}

            {/* Rules & Guidelines */}
            <div className="form-group">
              <label className="form-label">Rules & Guidelines</label>
              <textarea 
                className="form-textarea form-club" 
                rows={3} 
                value={formData.rules} 
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              />
            </div>

            {/* Prizes */}
            <div className="form-group">
              <label className="form-label">Prizes & Certificates (Optional)</label>
              <textarea 
                className="form-textarea form-club" 
                rows={2} 
                value={formData.prizes} 
                onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                placeholder="1st Prize: ₹10,000 + Trophy..." 
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={formData.status === 'LIVE NOW' ? 'btn' : 'btn btn-club'}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                borderRadius: 16,
                marginTop: '1rem',
                ...(formData.status === 'LIVE NOW' ? {
                  background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                  color: '#fff',
                  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.6)'
                } : {})
              }}
            >
              {loading ? 'Publishing Event...' : formData.status === 'LIVE NOW' ? '🔴 BROADCAST & LAUNCH EVENT LIVE NOW' : 'PUBLISH EVENT TO DYPCOEI'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
