import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar } from '../../components/AdminSidebar';
import { 
  Building, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Radio, 
  ExternalLink 
} from 'lucide-react';

export function AdminDashboard({ navigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [clubRequests, setClubRequests] = useState([]);
  const [actionMessage, setActionMessage] = useState('');

  const refreshAdminData = async () => {
    try {
      const [statsRes, reqsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` } }),
        fetch('/api/admin/clubs/requests', { headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` } })
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (reqsRes.ok) setClubRequests(await reqsRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  const handleApproveClub = async (clubId, clubName) => {
    try {
      const res = await fetch(`/api/admin/clubs/${clubId}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      const data = await res.json();
      setActionMessage(data.message);
      refreshAdminData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRejectClub = async (clubId) => {
    if (!confirm('Reject this club registration request?')) return;
    try {
      const res = await fetch(`/api/admin/clubs/${clubId}/reject`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      refreshAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <AdminSidebar activeRoute="/admin/dashboard" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              CENTRAL ADMINISTRATION & GOVERNANCE
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Dean of Student Affairs Console 🔐
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
            Overseeing registered clubs, event verifications, and student participation across DYPCOEI.
          </p>
        </div>

        {actionMessage && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22c55e',
            color: '#86efac',
            padding: '1rem',
            borderRadius: 14,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700
          }}>
            <CheckCircle2 size={20} /> {actionMessage}
          </div>
        )}

        {/* 4 Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.4rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Registered Students</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0' }}>{stats?.totalStudents || 2}</div>
            <div style={{ fontSize: '0.78rem', color: '#34d399' }}>Verified DYPCOEI IDs</div>
          </div>

          <div className="glass-card" style={{ padding: '1.4rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Campus Clubs</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0' }}>{stats?.totalClubs || 4}</div>
            <div style={{ fontSize: '0.78rem', color: '#fbbf24' }}>Active and Pending</div>
          </div>

          <div className="glass-card" style={{ padding: '1.4rem', borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Pending Club Requests</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0' }}>{clubRequests.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#f87171' }}>Awaiting Dean Authorization</div>
          </div>

          <div className="glass-card" style={{ padding: '1.4rem', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Campus Events</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0' }}>{stats?.totalEvents || 5}</div>
            <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Live & Published</div>
          </div>
        </div>

        {/* Club Approval Queue (Requirement 26) */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={20} color="#fbbf24" /> Club Accreditations & Access Requests
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Review submitted requests before enabling event publication credentials.
              </p>
            </div>
            <span className="badge badge-club">{clubRequests.length} Pending Approval</span>
          </div>

          {clubRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
              ✓ All club requests have been reviewed and approved.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {clubRequests.map((club) => (
                <div key={club.id} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 16,
                  padding: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <img 
                      src={club.logo} 
                      alt={club.name} 
                      style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="badge badge-today">PENDING DEAN REVIEW</span>
                        <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{club.category}</span>
                      </div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                        {club.name}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                        Faculty: <strong>{club.facultyCoordinator}</strong> • Student Lead: <strong>{club.studentCoordinator}</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                        Email: {club.email} • Mobile: {club.contactNumber || 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#fbbf24', marginTop: '0.4rem', fontStyle: 'italic' }}>
                        Reason: "{club.reason}"
                      </div>
                    </div>
                  </div>

                  {/* Approve / Reject buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleApproveClub(club.id, club.name)}
                      className="btn btn-admin"
                      style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
                    >
                      <CheckCircle2 size={16} /> Approve & Activate Club
                    </button>

                    <button
                      onClick={() => handleRejectClub(club.id)}
                      className="btn btn-danger"
                      style={{ padding: '0.65rem 1rem', fontSize: '0.88rem' }}
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
