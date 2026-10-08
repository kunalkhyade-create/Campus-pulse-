import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentSidebar } from '../../components/StudentSidebar';
import { QRModal } from '../../components/QRModal';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  XCircle, 
  AlertCircle,
  Building
} from 'lucide-react';

export function StudentRegistrationsPage({ navigate }) {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('UPCOMING');
  const [selectedReg, setSelectedReg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/student/registrations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      if (res.ok) setRegistrations(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (regId) => {
    if (!confirm('Are you sure you want to cancel this event registration?')) return;
    try {
      const res = await fetch(`/api/student/registrations/${regId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      if (res.ok) {
        fetchRegistrations();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const upcomingList = registrations.filter(r => r.status !== 'Cancelled' && r.event?.status !== 'COMPLETED');
  const completedList = registrations.filter(r => r.status === 'Completed' || r.event?.status === 'COMPLETED');
  const cancelledList = registrations.filter(r => r.status === 'Cancelled');

  let currentList = upcomingList;
  if (activeTab === 'COMPLETED') currentList = completedList;
  if (activeTab === 'CANCELLED') currentList = cancelledList;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <StudentSidebar activeRoute="/student/registrations" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-student" style={{ marginBottom: '0.4rem' }}>
            MY PARTICIPATION PASSES
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            My Registrations & Tickets
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Access all your official DYPCOEI passes, QR attendance barcodes, and participation records.
          </p>
        </div>

        {/* 3 Tabs: Upcoming, Completed, Cancelled */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
          {[
            { id: 'UPCOMING', label: `Upcoming (${upcomingList.length})` },
            { id: 'COMPLETED', label: `Completed (${completedList.length})` },
            { id: 'CANCELLED', label: `Cancelled (${cancelledList.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 12,
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: activeTab === tab.id ? '1px solid #38bdf8' : '1px solid transparent',
                background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                color: activeTab === tab.id ? '#38bdf8' : '#94a3b8'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Registrations List */}
        {currentList.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Ticket size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
              No {activeTab.toLowerCase()} registrations found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Discover exciting upcoming competitions, hackathons, and cultural events happening across campus.
            </p>
            <button onClick={() => navigate('/student/events')} className="btn btn-student">
              Explore DYPCOEI Events
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {currentList.map(reg => (
              <div 
                key={reg.id} 
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  borderLeft: reg.status === 'Cancelled' ? '4px solid #ef4444' : '4px solid #38bdf8'
                }}
              >
                {/* Left: Event Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <img 
                    src={reg.event?.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400'} 
                    alt={reg.event?.title}
                    style={{ width: 85, height: 85, borderRadius: 16, objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span className="badge badge-student" style={{ fontFamily: 'var(--font-mono)' }}>
                        {reg.registrationNumber}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>
                        {reg.event?.clubName || 'DYPCOEI'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
                      {reg.event?.title}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} color="#38bdf8" /> {reg.event?.displayDate || reg.event?.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} color="#f43f5e" /> {reg.event?.venue}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        Attendance: <strong style={{ color: reg.attendance === 'Present' ? '#4ade80' : '#fbbf24' }}>● {reg.attendance || 'Pending'}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions (QR Code Ticket, Cancel) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {reg.status !== 'Cancelled' && (
                    <button
                      onClick={() => setSelectedReg(reg)}
                      className="btn btn-student"
                      style={{ padding: '0.65rem 1.1rem', fontSize: '0.88rem' }}
                    >
                      <QrCode size={16} /> View Digital QR Ticket
                    </button>
                  )}

                  {reg.status !== 'Cancelled' && reg.event?.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleCancelRegistration(reg.id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.65rem 0.9rem', fontSize: '0.85rem', color: '#f87171' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Pass Modal */}
      {selectedReg && (
        <QRModal 
          registration={selectedReg} 
          onClose={() => setSelectedReg(null)} 
        />
      )}
    </div>
  );
}
