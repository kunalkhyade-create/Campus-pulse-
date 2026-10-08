import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Download, Calendar, MapPin, CheckCircle2, User } from 'lucide-react';

export function QRModal({ registration, onClose }) {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (registration) {
      const payload = JSON.stringify({
        regId: registration.registrationNumber,
        event: registration.event?.title,
        student: registration.studentName,
        id: registration.collegeStudentId
      });
      QRCode.toDataURL(payload, { width: 260, margin: 1, color: { dark: '#0284c7', light: '#ffffff' } }, (err, url) => {
        if (!err) setQrUrl(url);
      });
    }
  }, [registration]);

  if (!registration) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', textAlign: 'center' }}>
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

        <span className="badge badge-student" style={{ marginBottom: '0.75rem' }}>
          OFFICIAL ENTRY PASS
        </span>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
          {registration.event?.title || 'DYPCOEI Event'}
        </h3>

        <div style={{
          fontSize: '1.4rem',
          fontWeight: 900,
          color: '#38bdf8',
          letterSpacing: '0.08em',
          fontFamily: 'var(--font-mono)',
          margin: '0.5rem 0 1rem'
        }}>
          {registration.registrationNumber}
        </div>

        {/* QR Code Canvas */}
        <div style={{
          background: '#ffffff',
          display: 'inline-block',
          padding: '16px',
          borderRadius: 20,
          boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
          marginBottom: '1.25rem'
        }}>
          {qrUrl ? (
            <img src={qrUrl} alt="QR Code" style={{ display: 'block', width: 200, height: 200 }} />
          ) : (
            <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              Generating QR...
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 14,
          padding: '1rem',
          textAlign: 'left',
          fontSize: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Student:</span>
            <strong style={{ color: '#f8fafc' }}>{registration.studentName} ({registration.collegeStudentId})</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Venue:</span>
            <strong style={{ color: '#38bdf8' }}>{registration.event?.venue}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Date:</span>
            <strong style={{ color: '#cbd5e1' }}>{registration.event?.displayDate || registration.event?.date}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Attendance:</span>
            <strong style={{ color: registration.attendance === 'Present' ? '#4ade80' : '#fbbf24' }}>
              ● {registration.attendance || 'Pending Scan'}
            </strong>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-student"
          style={{ width: '100%' }}
        >
          <Download size={16} /> Print / Save Pass
        </button>
      </div>
    </div>
  );
}
