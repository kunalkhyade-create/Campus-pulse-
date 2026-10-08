import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClubSidebar } from '../../components/ClubSidebar';
import { Image, Upload, PlusCircle, Sparkles, Award } from 'lucide-react';

export function ClubGalleryPage({ navigate }) {
  const { user } = useAuth();
  const [gallery, setGallery] = useState([]);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetch('/api/club/gallery')
      .then(res => res.json())
      .then(data => setGallery(data))
      .catch(console.error);
  }, []);

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!uploadUrl) return;

    const newPhoto = {
      id: 'gal-' + Date.now(),
      title: uploadTitle || 'Event Highlight',
      image: uploadUrl,
      clubName: user?.club?.name || 'Coding Club',
      date: 'October 2026',
      caption: uploadCaption || 'Celebration and winners felicitated by DYPCOEI faculty.'
    };

    setGallery([newPhoto, ...gallery]);
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadUrl('');
    setUploadCaption('');
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <ClubSidebar activeRoute="/club/gallery" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <span className="badge badge-club" style={{ marginBottom: '0.4rem' }}>
              CAMPUS MOMENTS & ARCHIVE
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Event Gallery & Highlights 📸
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Upload event photos, winning teams, and ceremony highlights to feature in DYPCOEI Campus Moments.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-club"
            style={{ padding: '0.8rem 1.4rem' }}
          >
            <PlusCircle size={18} /> + Add Event Photos
          </button>
        </div>

        {/* Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {gallery.map(item => (
            <div key={item.id} className="glass-card" style={{ borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: 8
                }}>
                  {item.clubName}
                </div>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  📅 {item.date}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
                Upload Event Highlight to Campus Moments
              </h3>

              <form onSubmit={handleAddPhoto}>
                <div className="form-group">
                  <label className="form-label">Moment Title *</label>
                  <input 
                    className="form-input form-club" 
                    required 
                    placeholder="e.g. CodeStorm 2026 Winner Felicitation"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL *</label>
                  <input 
                    className="form-input form-club" 
                    required 
                    placeholder="https://... photo link"
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Caption & Winners Description</label>
                  <textarea 
                    className="form-textarea form-club" 
                    rows={3} 
                    placeholder="Describe highlights, winning students, or ceremony details..."
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-club" style={{ flex: 1 }}>
                    Upload to Gallery
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
