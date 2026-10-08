import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Building, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export function ClubRequestAccessPage({ navigate }) {
  const { requestClubAccess } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Technical',
    description: '',
    facultyCoordinator: '',
    studentCoordinator: '',
    email: '',
    contactNumber: '',
    socialMediaLink: '',
    logo: '',
    reason: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = ['Technical', 'Cultural', 'Sports', 'Social', 'Literary', 'Entrepreneurship', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await requestClubAccess(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Request submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem'
    }}>
      <div style={{
        maxWidth: 820,
        width: '100%',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 24,
        padding: '2.5rem',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/club/login')}
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
            <ArrowLeft size={14} /> Back to Club Login
          </button>

          <span className="badge badge-club">CONTROLLED CLUB ONBOARDING</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.4rem' }}>
          Request Club Access 🏛️
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
          To ensure platform integrity and verify official college representation, all DYPCOEI clubs must submit an accreditation request.
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: 10,
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid #f59e0b',
            borderRadius: 18,
            padding: '2.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '2px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#fbbf24'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              Your request has been submitted for admin approval.
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: 540, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Club accounts become active only after approval by DYPCOEI administration. Once approved, coordinator credentials will be sent to your official club email.
            </p>

            <button
              onClick={() => navigate('/')}
              className="btn btn-club"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Return to Campus Connect
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Row 1: Club Name & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Official Club Name *</label>
                <input 
                  className="form-input form-club" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aeromodelling Club DYPCOEI" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Club Category *</label>
                <select 
                  className="form-select form-club"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((c) => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Club Description */}
            <div className="form-group">
              <label className="form-label">Club Description / Mission *</label>
              <textarea 
                className="form-textarea form-club" 
                rows={2}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief mission statement, activities, and target department students..."
              />
            </div>

            {/* Coordinators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Faculty Coordinator Name *</label>
                <input 
                  className="form-input form-club" 
                  required 
                  value={formData.facultyCoordinator} 
                  onChange={(e) => setFormData({ ...formData, facultyCoordinator: e.target.value })}
                  placeholder="e.g. Prof. V. B. Jadhav" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lead Student Coordinator *</label>
                <input 
                  className="form-input form-club" 
                  required 
                  value={formData.studentCoordinator} 
                  onChange={(e) => setFormData({ ...formData, studentCoordinator: e.target.value })}
                  placeholder="e.g. Tanmay More (TE Mech)" 
                />
              </div>
            </div>

            {/* Contact details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Official Club Email *</label>
                <input 
                  className="form-input form-club" 
                  type="email"
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="club@dypcoei.ac.in" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Mobile Number *</label>
                <input 
                  className="form-input form-club" 
                  required 
                  value={formData.contactNumber} 
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+91 9765432109" 
                />
              </div>
            </div>

            {/* Social & Logo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Social Media Link / Handle</label>
                <input 
                  className="form-input form-club" 
                  value={formData.socialMediaLink} 
                  onChange={(e) => setFormData({ ...formData, socialMediaLink: e.target.value })}
                  placeholder="e.g. @dypcoeiaero or LinkedIn URL" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Club Logo Image URL</label>
                <input 
                  className="form-input form-club" 
                  value={formData.logo} 
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://... logo image" 
                />
              </div>
            </div>

            {/* Reason */}
            <div className="form-group">
              <label className="form-label">Reason for Requesting Campus Connect Access *</label>
              <textarea 
                className="form-textarea form-club" 
                rows={2}
                required
                value={formData.reason} 
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain why your club requires publishing privileges..." 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-club"
              style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', borderRadius: 14, marginTop: '1rem' }}
            >
              {loading ? 'Submitting Request...' : 'REQUEST CLUB ACCESS'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
