import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClubSidebar } from '../../components/ClubSidebar';
import { BarChart3, TrendingUp, Users, Calendar, Award, CheckCircle2 } from 'lucide-react';

export function ClubAnalyticsPage({ navigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/club/analytics', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <ClubSidebar activeRoute="/club/analytics" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-club" style={{ marginBottom: '0.4rem' }}>
            PERFORMANCE METRICS
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Club Analytics & Insights 📊
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Track participation numbers, registration trends, and attendance engagement.
          </p>
        </div>

        {/* Top KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Events Organized</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0.3rem 0' }}>{stats?.totalEvents || 18}</div>
            <div style={{ fontSize: '0.78rem', color: '#4ade80' }}>↑ +2 this semester</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Student Reach</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0.3rem 0' }}>{stats?.totalParticipants || 342}</div>
            <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Average {stats?.averageParticipation || 28} per event</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #22c55e' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Attendance Rate</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '0.3rem 0' }}>{stats?.attendanceRate || 85}%</div>
            <div style={{ fontSize: '0.78rem', color: '#4ade80' }}>High campus engagement</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #ec4899' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Most Popular Event</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', margin: '0.3rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {stats?.mostPopularEvent || 'CodeStorm 2026'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>87 Registrations</div>
          </div>
        </div>

        {/* Visual Trend Bars */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#fbbf24" /> Monthly Participation Growth
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', alignItems: 'flex-end', height: 220, padding: '1rem 0' }}>
            {[
              { month: 'Jun', count: 60, height: '35%' },
              { month: 'Jul', count: 95, height: '50%' },
              { month: 'Aug', count: 140, height: '70%' },
              { month: 'Sep', count: 180, height: '85%' },
              { month: 'Oct', count: 215, height: '100%' },
            ].map(m => (
              <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>{m.count}</span>
                <div style={{
                  width: '100%',
                  maxWidth: 60,
                  height: m.height,
                  background: 'linear-gradient(to top, #d97706, #fbbf24)',
                  borderRadius: '8px 8px 0 0',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                }} />
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
