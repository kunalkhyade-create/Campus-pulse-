import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClubSidebar } from '../../components/ClubSidebar';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  QrCode, 
  Users, 
  Filter, 
  Sparkles,
  Camera
} from 'lucide-react';

export function ClubParticipantsPage({ eventId = 'evt-1', navigate }) {
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttendance, setFilterAttendance] = useState('ALL');
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [scanMessage, setScanMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`/api/club/events/${eventId}/participants`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        setParticipants(data.participants);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const toggleAttendance = async (regId, currentStatus) => {
    const nextStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    try {
      const res = await fetch(`/api/club/events/${eventId}/participants/${regId}/attendance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}`
        },
        body: JSON.stringify({ attendance: nextStatus })
      });
      if (res.ok) {
        fetchParticipants();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!scanCodeInput.trim()) return;

    try {
      const res = await fetch(`/api/club/events/${eventId}/scan-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}`
        },
        body: JSON.stringify({ code: scanCodeInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Scan verification failed');

      setScanMessage(data.message);
      setScanCodeInput('');
      fetchParticipants();
      setTimeout(() => setScanMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const exportCSV = () => {
    if (participants.length === 0) return alert('No participants to export');
    const headers = ['Registration ID,Student Name,Student ID,Department,Year,Email,Mobile,Registration Date,Attendance'];
    const rows = participants.map(p => 
      `"${p.registrationNumber}","${p.studentName}","${p.collegeStudentId || p.studentId}","${p.department}","${p.year}","${p.email}","${p.mobile}","${p.registrationDate}","${p.attendance}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DYPCOEI_Participants_${event?.title || 'Event'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let filtered = participants;
  if (filterAttendance !== 'ALL') {
    filtered = filtered.filter(p => p.attendance === filterAttendance);
  }
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(p => 
      p.studentName.toLowerCase().includes(q) ||
      (p.collegeStudentId && p.collegeStudentId.toLowerCase().includes(q)) ||
      p.registrationNumber.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  }

  const presentCount = participants.filter(p => p.attendance === 'Present').length;
  const attendanceRate = participants.length > 0 ? Math.round((presentCount / participants.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <ClubSidebar activeRoute="/club/participants" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/club/events')}
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
            <ArrowLeft size={14} /> Back to Events
          </button>

          <span className="badge badge-club">ATTENDANCE VERIFICATION TERMINAL</span>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Participant Management & Attendance 👥
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Event: <strong style={{ color: '#38bdf8' }}>{event?.title || 'CodeStorm 2026'}</strong> • Venue: {event?.venue}
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={16} /> Export CSV List
          </button>
        </div>

        {/* Live Attendance Stats & QR Scanner Bar (Requirement 20) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Attendance KPI Card */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '3px solid #22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.4rem',
              color: '#4ade80'
            }}>
              {attendanceRate}%
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase' }}>Attendance Rate</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>
                {presentCount} / {participants.length} <span style={{ fontSize: '0.9rem', color: '#4ade80' }}>Checked In</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Toggle status below or scan student QR codes
              </div>
            </div>
          </div>

          {/* Quick QR / Ticket Scan Form */}
          <div className="glass-card" style={{ padding: '1.5rem', borderColor: 'rgba(56, 189, 248, 0.4)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <QrCode size={18} color="#38bdf8" /> Instant Ticket / QR Verification
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Scan student pass or enter Registration ID:
            </p>

            <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '0.6rem' }}>
              <input 
                className="form-input" 
                style={{ padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
                placeholder="e.g. DYPCOEI-2026-00482"
                value={scanCodeInput}
                onChange={(e) => setScanCodeInput(e.target.value)}
              />
              <button type="submit" className="btn btn-student" style={{ padding: '0.6rem 1rem' }}>
                Verify & Check-In
              </button>
            </form>

            {scanMessage && (
              <div style={{ color: '#4ade80', fontSize: '0.82rem', marginTop: '0.5rem', fontWeight: 700 }}>
                ✓ {scanMessage}
              </div>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'ALL', label: 'All Students' },
              { id: 'Present', label: '🟢 Present' },
              { id: 'Pending', label: '⏳ Pending' },
              { id: 'Absent', label: '🔴 Absent' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterAttendance(f.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 10,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filterAttendance === f.id ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: filterAttendance === f.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: filterAttendance === f.id ? '#fbbf24' : '#94a3b8'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input 
              className="form-input" 
              style={{ paddingLeft: 36, padding: '0.55rem 0.55rem 0.55rem 2.2rem' }}
              placeholder="Search name, ID, or Reg No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Participant Table */}
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Registration ID</th>
                <th style={{ padding: '1rem 1.25rem' }}>Student Name</th>
                <th style={{ padding: '1rem 1.25rem' }}>College ID</th>
                <th style={{ padding: '1rem 1.25rem' }}>Dept / Year</th>
                <th style={{ padding: '1rem 1.25rem' }}>Email / Mobile</th>
                <th style={{ padding: '1rem 1.25rem' }}>Attendance</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                    {p.registrationNumber}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                    {p.studentName}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>
                    {p.collegeStudentId || 'DYP2026'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#94a3b8' }}>
                    {p.department} ({p.year})
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                    <div>{p.email}</div>
                    <div>{p.mobile}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span 
                      className={`badge ${p.attendance === 'Present' ? 'badge-present' : 'badge-today'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleAttendance(p.id, p.attendance)}
                    >
                      ● {p.attendance || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                    <button
                      onClick={() => toggleAttendance(p.id, p.attendance)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: 8,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: p.attendance === 'Present' ? '1px solid #ef4444' : '1px solid #22c55e',
                        background: p.attendance === 'Present' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                        color: p.attendance === 'Present' ? '#f87171' : '#4ade80'
                      }}
                    >
                      {p.attendance === 'Present' ? 'Mark Absent' : 'Mark Present'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
