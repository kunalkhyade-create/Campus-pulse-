import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClubSidebar } from '../../components/ClubSidebar';
import { Building, User, Mail, Globe, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ClubProfilePage({ navigate }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [studentCoordinator, setStudentCoordinator] = useState('');
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [github, setGithub] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/club/profile', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setStudentCoordinator(data.studentCoordinator || '');
        setDescription(data.description || '');
        setInstagram(data.socialLinks?.instagram || '');
        setGithub(data.socialLinks?.github || '');
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedMsg('');

    try {
      const res = await fetch('/api/club/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dypcoei_token')}`
        },
        body: JSON.stringify({
          studentCoordinator,
          description,
          socialLinks: { instagram, github }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');

      setProfile(data.club);
      setSavedMsg('Club profile updated successfully!');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <ClubSidebar activeRoute="/club/profile" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-club" style={{ marginBottom: '0.4rem' }}>
            ORGANIZATION SETTINGS
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Club Profile & Accreditations ⚙️
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Public club identity visible to all DYPCOEI students. Sensitive changes require college dean approval.
          </p>
        </div>

        {savedMsg && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22c55e',
            color: '#86efac',
            padding: '0.85rem 1.25rem',
            borderRadius: 12,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} /> {savedMsg}
          </div>
        )}

        <div style={{ maxWidth: 840 }}>
          {/* Main Info Card */}
          <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
              <img 
                src={profile?.logo || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300'} 
                alt="Club Logo" 
                style={{ width: 90, height: 90, borderRadius: 20, objectFit: 'cover', border: '3px solid #f59e0b' }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
                    {profile?.name || 'Coding Club DYPCOEI'}
                  </h2>
                  <span className="badge badge-club">● Official Club</span>
                </div>
                <div style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 700 }}>
                  Category: {profile?.category || 'Technical'} • {profile?.members || 140} Active Members
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  Faculty Coordinator: <strong style={{ color: '#f1f5f9' }}>{profile?.facultyCoordinator || 'Prof. S. R. Patil'}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Club Description / Mission</label>
                <textarea 
                  className="form-textarea form-club"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Lead Student Coordinator</label>
                  <input 
                    className="form-input form-club"
                    value={studentCoordinator}
                    onChange={(e) => setStudentCoordinator(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Email (Read-Only)</label>
                  <input 
                    className="form-input"
                    disabled
                    value={profile?.email || 'codingclub@dypcoei.ac.in'}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Instagram Handle</label>
                  <input 
                    className="form-input form-club"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@dypcoeicoding"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub / Website / LinkedIn</label>
                  <input 
                    className="form-input form-club"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-club"
                style={{ padding: '0.85rem 1.75rem', marginTop: '1rem' }}
              >
                <Save size={16} /> {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
