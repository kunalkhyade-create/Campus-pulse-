import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  QrCode, 
  Download, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function RegisterModal({ event, user, onClose, onSuccess, navigate }) {
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState(user?.mobile || '+91 9876543210');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const qrCanvasRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}`
        },
        body: JSON.stringify({ mobile, notes })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setResult(data);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti fallback
      }

      // Generate QR Code pass
      const qrPayload = JSON.stringify({
        regId: data.registrationNumber,
        event: event.title,
        student: user.name,
        studentId: user.studentId
      });

      QRCode.toDataURL(qrPayload, { width: 220, margin: 1, color: { dark: '#0284c7', light: '#ffffff' } }, (err, url) => {
        if (!err) setQrDataUrl(url);
      });

      if (onSuccess) onSuccess(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    const printableWindow = window.open('', '_blank');
    printableWindow.document.write(`
      <html>
        <head>
          <title>DYPCOEI Event Pass - ${result?.registrationNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; text-align: center; background: #f8fafc; }
            .card { border: 2px dashed #0284c7; padding: 25px; border-radius: 12px; max-width: 480px; margin: 0 auto; background: white; }
            h2 { color: #0f172a; margin-bottom: 4px; }
            .reg-id { font-size: 20px; font-weight: bold; color: #0284c7; letter-spacing: 2px; margin: 15px 0; }
            .qr { margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>DYPCOEI CAMPUS CONNECT</h2>
            <p>Official Event Entry Pass</p>
            <div class="reg-id">${result?.registrationNumber}</div>
            <h3>${event.title}</h3>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Date & Time:</strong> ${event.displayDate || event.date} at ${event.startTime}</p>
            <hr />
            <p><strong>Student:</strong> ${user?.name} (${user?.studentId})</p>
            <p><strong>Department:</strong> ${user?.department} - Year ${user?.year}</p>
            <img class="qr" src="${qrDataUrl}" width="180" />
            <p style="font-size: 12px; color: #64748b;">Please present this QR code at the event entrance for automatic verification.</p>
          </div>
        </body>
      </html>
    `);
    printableWindow.document.close();
    printableWindow.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
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

        {!result ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-student">DYPCOEI REGISTRATION</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Register for {event.title}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Confirm your registration details below. Your official entry pass and QR code will be generated immediately.
            </p>

            {/* Event Summary Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 14,
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                📍 {event.venue}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                📅 {event.displayDate || event.date} • ⏰ {event.startTime}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                Organized by: <strong style={{ color: '#fbbf24' }}>{event.clubName}</strong>
              </div>
            </div>

            {/* Student Info (Read-Only Prefilled) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Full Name</label>
                <input className="form-input" disabled value={user?.name || ''} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Student ID</label>
                <input className="form-input" disabled value={user?.studentId || ''} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Department & Year</label>
                <input className="form-input" disabled value={`${user?.department || 'Engg'} (${user?.year || 'TE'})`} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">College Email</label>
                <input className="form-input" disabled value={user?.email || ''} />
              </div>
            </div>

            {/* Additional fields */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Contact Mobile Number *</label>
                <input 
                  className="form-input" 
                  required
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 9876543210" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Dietary / Team / Laptop Notes (Optional)</label>
                <textarea 
                  className="form-textarea" 
                  rows={2}
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Bringing personal laptop with Ubuntu / ROS installed..." 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn btn-student" 
                  style={{ flex: 2, fontSize: '1rem' }}
                >
                  {loading ? 'Registering...' : 'CONFIRM REGISTRATION'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Animated Success Screen */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '2px solid #22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#4ade80'
            }}>
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
              🎉 Registration Successful!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You are confirmed for <strong>{event.title}</strong>
            </p>

            {/* Generated Registration ID Box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(99, 102, 241, 0.2))',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              borderRadius: 16,
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Official Registration ID
              </div>
              <div style={{
                fontSize: '1.7rem',
                fontWeight: 900,
                color: '#38bdf8',
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-mono)',
                margin: '0.35rem 0'
              }}>
                {result.registrationNumber}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Status: <span style={{ color: '#4ade80', fontWeight: 700 }}>● Confirmed Entry</span>
              </div>
            </div>

            {/* QR Code Pass */}
            {qrDataUrl && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ background: '#ffffff', display: 'inline-block', padding: '12px', borderRadius: '16px' }}>
                  <img src={qrDataUrl} alt="QR Pass" style={{ display: 'block', width: 140, height: 140 }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  Scan at venue entrance for attendance
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  onClick={handleDownloadTicket}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.7rem' }}
                >
                  <Download size={16} /> Download Confirmation
                </button>
                <button
                  onClick={() => {
                    alert(`Added "${event.title}" on ${event.displayDate} to your Google/Outlook calendar!`);
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.7rem' }}
                >
                  <Calendar size={16} /> Add to Calendar
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate('/student/registrations');
                }}
                className="btn btn-student"
                style={{ padding: '0.8rem', fontSize: '0.95rem' }}
              >
                View in My Registrations <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
