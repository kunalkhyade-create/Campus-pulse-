import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  Share2, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export function EventCard({ 
  event, 
  onRegister, 
  onViewDetails, 
  onToggleSave, 
  isSaved = false,
  isRegistered = false 
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + '/events/' + event.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLive = event.status === 'LIVE NOW';
  const isToday = event.status === 'TODAY';
  const isUpcoming = event.status === 'UPCOMING';
  const isCompleted = event.status === 'COMPLETED';

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Event Banner */}
      <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
        <img 
          src={event.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'} 
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 60%, rgba(0,0,0,0.5) 100%)'
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Status Badge */}
          {isLive && (
            <span className="badge badge-live" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="radar-dot" />
              <span>LIVE NOW</span>
            </span>
          )}
          {isToday && (
            <span className="badge badge-today">
              📅 TODAY
            </span>
          )}
          {isUpcoming && (
            <span className="badge badge-upcoming">
              🔥 UPCOMING
            </span>
          )}
          {isCompleted && (
            <span className="badge badge-completed">
              ✓ COMPLETED
            </span>
          )}

          {/* Quick Actions (Share + Save) */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={handleShare}
              title="Share Event"
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Share2 size={15} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave && onToggleSave(event.id);
              }}
              title="Save Event"
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: isSaved ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.15)',
                color: isSaved ? '#f43f5e' : '#fff',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Heart size={15} fill={isSaved ? '#f43f5e' : 'transparent'} />
            </button>
          </div>
        </div>

        {/* Category Pill on banner */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          background: 'rgba(2, 132, 199, 0.35)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          color: '#38bdf8',
          fontSize: '0.72rem',
          fontWeight: 700,
          borderRadius: 8,
          padding: '0.2rem 0.6rem',
          backdropFilter: 'blur(8px)'
        }}>
          💻 {event.category}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Organizing Club */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Building size={14} />
            <span>{event.clubName || 'DYPCOEI Club'}</span>
          </div>

          {/* Event Title */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.6rem', lineHeight: 1.3 }}>
            {event.title}
          </h3>

          {/* Event Metadata List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={14} color="#38bdf8" />
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{event.displayDate || event.date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} color="#38bdf8" />
              <span>{event.startTime} {event.endTime ? `– ${event.endTime}` : ''}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} color="#f43f5e" />
              <span style={{ color: '#cbd5e1' }}>{event.venue}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={14} color="#a855f7" />
              <span>
                <strong style={{ color: '#fff' }}>{event.participantsCount || 0}</strong> Participants registered
                {event.capacity ? ` (Cap: ${event.capacity})` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Status & Buttons */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '0.85rem'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              ● Registration Open
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Deadline: {event.registrationDeadline ? event.registrationDeadline.split(' ')[0] : 'Upcoming'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => onViewDetails && onViewDetails(event)}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
            >
              View Details
            </button>

            {isRegistered ? (
              <button
                disabled
                style={{
                  flex: 1,
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.85rem',
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  borderRadius: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                ✓ Registered
              </button>
            ) : (
              <button
                onClick={() => onRegister && onRegister(event)}
                className="btn btn-student"
                style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
