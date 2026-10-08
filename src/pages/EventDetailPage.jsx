import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { RegisterModal } from '../components/RegisterModal';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  FileText, 
  Building, 
  Share2, 
  Ticket,
  CheckCircle2,
  Phone,
  Mail
} from 'lucide-react';

export function EventDetailPage({ eventId = 'evt-1', navigate }) {
  const { user, role, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(console.error);
  }, [eventId]);

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <p style={{ color: '#94a3b8' }}>Loading DYPCOEI event details...</p>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Top Back Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(role === 'STUDENT' ? '/student/dashboard' : '/')}
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
          <ArrowLeft size={14} /> Back
        </button>

        <button
          onClick={handleShare}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
        >
          <Share2 size={14} /> {copied ? 'Link Copied!' : 'Share Event'}
        </button>
      </div>

      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        height: 380,
        marginBottom: '2.5rem',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7)'
      }}>
        <img 
          src={event.banner} 
          alt={event.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(8, 12, 20, 0.95) 0%, rgba(8, 12, 20, 0.4) 60%, transparent 100%)'
        }} />

        <div style={{ position: 'absolute', bottom: 30, left: 30, right: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
            {event.status === 'LIVE NOW' ? (
              <span className="badge badge-live" style={{ padding: '0.4rem 0.85rem' }}>
                <span className="radar-dot" /> LIVE NOW
              </span>
            ) : (
              <span className="badge badge-student">
                {event.category}
              </span>
            )}
            <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem' }}>
              Organized by {event.clubName}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.15 }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Main Grid: Details & Register Side Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* Left Column: Description, Rules, Prizes */}
        <div>
          {/* Description */}
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' }}>
              About This Event
            </h3>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>

          {/* Rules & Guidelines */}
          {event.rules && (
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="#38bdf8" /> Rules & Guidelines
              </h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
                {event.rules}
              </p>
            </div>
          )}

          {/* Prizes & Awards */}
          {event.prizes && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} color="#fbbf24" /> Prizes & Recognition
              </h3>
              <p style={{ color: '#fcd34d', lineHeight: 1.7, fontSize: '0.9rem', whiteSpace: 'pre-line', fontWeight: 600 }}>
                {event.prizes}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Event Info Widget & Registration Button */}
        <div>
          <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: 90, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Registration & Venue Details
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.4rem 0 1.25rem' }}>
              {event.participationFee || 'Free Entry'}
            </div>

            {/* Metadata list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={18} color="#38bdf8" />
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Date</div>
                  <strong style={{ color: '#f8fafc' }}>{event.displayDate || event.date}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={18} color="#38bdf8" />
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Time</div>
                  <strong style={{ color: '#f8fafc' }}>{event.startTime} {event.endTime ? `– ${event.endTime}` : ''}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={18} color="#ef4444" />
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Campus Venue</div>
                  <strong style={{ color: '#38bdf8' }}>{event.venue}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={18} color="#a855f7" />
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Confirmed Participants</div>
                  <strong style={{ color: '#f8fafc' }}>{event.participantsCount || 87} / {event.capacity || 100} slots</strong>
                </div>
              </div>
            </div>

            {/* Registration Button */}
            {role === 'STUDENT' ? (
              <button
                onClick={() => setShowRegisterModal(true)}
                className="btn btn-student"
                style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', borderRadius: 14 }}
              >
                <Ticket size={18} /> Register Now & Get Pass
              </button>
            ) : !isAuthenticated ? (
              <button
                onClick={() => navigate('/student/login')}
                className="btn btn-student"
                style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', borderRadius: 14 }}
              >
                Login as Student to Register
              </button>
            ) : (
              <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#fbbf24', padding: '0.5rem' }}>
                Logged in as Club Coordinator / Admin
              </div>
            )}
          </div>
        </div>
      </div>

      {showRegisterModal && (
        <RegisterModal 
          event={event}
          user={user}
          navigate={navigate}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false);
            navigate('/student/registrations');
          }}
        />
      )}
    </div>
  );
}
