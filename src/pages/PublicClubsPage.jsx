import React, { useState, useEffect } from 'react';
import { Building, Users, ExternalLink, Calendar, Sparkles } from 'lucide-react';

export function PublicClubsPage({ navigate }) {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetch('/api/clubs')
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem', minHeight: 'calc(100vh - 72px)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="badge badge-club" style={{ marginBottom: '0.75rem' }}>
          OFFICIAL CAMPUS ORGANIZATIONS
        </span>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.75rem' }}>
          DYPCOEI Campus Clubs & Councils 🏛️
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 650, margin: '0 auto' }}>
          Explore vibrant student-driven technical, cultural, robotic, and athletic communities driving innovation at DYPCOEI.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem'
      }}>
        {clubs.map(club => (
          <div key={club.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <img 
                  src={club.logo} 
                  alt={club.name} 
                  style={{ width: 68, height: 68, borderRadius: 18, objectFit: 'cover', border: '2px solid rgba(245, 158, 11, 0.4)' }}
                />
                <div>
                  <span className="badge badge-club" style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                    {club.category}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                    {club.name}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {club.description}
              </p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: 12,
                fontSize: '0.82rem',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                marginBottom: '1.5rem'
              }}>
                <div>Faculty Coordinator: <strong style={{ color: '#f1f5f9' }}>{club.facultyCoordinator}</strong></div>
                <div>Student Lead: <strong style={{ color: '#fbbf24' }}>{club.studentCoordinator}</strong></div>
                <div>Active Members: <strong style={{ color: '#fff' }}>{club.members || 100}+ Students</strong></div>
              </div>
            </div>

            <button
              onClick={() => navigate('/student/events')}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Browse Club Events →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
