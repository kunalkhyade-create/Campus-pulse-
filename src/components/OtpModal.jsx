import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, ShieldCheck, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export function OtpModal({
  isOpen,
  onClose,
  email,
  purpose = 'LOGIN',
  onVerified,
  previewOtp = ''
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePreviewOtp, setActivePreviewOtp] = useState(previewOtp);
  const inputRefs = useRef([]);

  useEffect(() => {
    setActivePreviewOtp(previewOtp);
  }, [previewOtp]);

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setTimer(60);
      setError('');
      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const arr = pasted.split('');
      setDigits(arr);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullOtp = digits.join('');
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: fullOtp,
          purpose
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      if (onVerified) onVerified(data);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend code');

      setActivePreviewOtp(data.previewOtp);
      setTimer(60);
      setDigits(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err) {
      setError(err.message || 'Resend failed');
    } finally {
      setLoading(false);
    }
  };

  const autoFillOtp = () => {
    if (activePreviewOtp && activePreviewOtp.length === 6) {
      setDigits(activePreviewOtp.split(''));
      setError('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 480,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          borderRadius: 24,
          background: 'linear-gradient(155deg, rgba(23, 33, 54, 0.95) 0%, rgba(13, 19, 33, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.2)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(255, 255, 255, 0.08)',
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

        {/* Top Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: '#38bdf8'
          }}
        >
          <Mail size={32} />
        </div>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.4rem' }}>
          {purpose === 'LOGIN' ? 'Login with Email OTP' : 'Verify College Email'}
        </h3>

        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          We have dispatched a 6-digit verification code to:<br />
          <strong style={{ color: '#38bdf8' }}>{email}</strong>
        </p>

        {/* Live Simulator Banner */}
        {activePreviewOtp && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(99, 102, 241, 0.2))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 14,
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: '#e0f2fe'
            }}
          >
            <div>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>📧 Code Received: </span>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', letterSpacing: '0.1em', color: '#ffffff' }}>
                {activePreviewOtp}
              </strong>
            </div>

            <button
              type="button"
              onClick={autoFillOtp}
              style={{
                background: 'rgba(56, 189, 248, 0.3)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                color: '#38bdf8',
                borderRadius: 8,
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Auto-fill Code
            </button>
          </div>
        )}

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '0.65rem 1rem',
              borderRadius: 10,
              fontSize: '0.82rem',
              marginBottom: '1.25rem'
            }}
          >
            {error}
          </div>
        )}

        {/* 6 Digit Input Boxes */}
        <form onSubmit={handleVerify}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.65rem',
              marginBottom: '1.75rem'
            }}
            onPaste={handlePaste}
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 48,
                  height: 56,
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  borderRadius: 12,
                  border: digit ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  outline: 'none',
                  boxShadow: digit ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || digits.join('').length < 6}
            className="btn btn-student"
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '1rem',
              borderRadius: 14,
              marginBottom: '1.25rem'
            }}
          >
            {loading ? 'Verifying OTP...' : 'VERIFY & CONTINUE'}
          </button>
        </form>

        {/* Resend Timer / Action */}
        <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          {timer > 0 ? (
            <span>
              Resend verification code in <strong style={{ color: '#38bdf8' }}>0:{timer < 10 ? `0${timer}` : timer}</strong>
            </span>
          ) : (
            <button
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.86rem'
              }}
            >
              <RotateCcw size={14} /> Resend OTP Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
