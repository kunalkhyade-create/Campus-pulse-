import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentSidebar } from '../../components/StudentSidebar';
import { User, Mail, GraduationCap, Phone, Award, ShieldCheck, Calendar } from 'lucide-react';

export function StudentProfilePage({ navigate }) {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <StudentSidebar activeRoute="/student/profile" navigate={navigate} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-student" style={{ marginBottom: '0.4rem' }}>
            ACADEMIC IDENTITY
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Student Profile 👤
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Official student credentials verified by DYPCOEI Academic Administration.
          </p>
        </div>

        <div style={{ maxWidth: 800 }}>
          {/* Main ID Card */}
          <div className="glass-card" style={{
            padding: '2.5rem',
            borderRadius: 24,
            border: '1px solid rgba(56, 189, 248, 0.3)',
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(9, 19, 38, 0.85))',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            <div style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
              <img 
                src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Student'}`} 
                alt="Profile" 
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #38bdf8' }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
                    {user?.name || 'Kunal Khyade'}
                  </h2>
                  <span className="badge badge-present">● Active Student</span>
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
                  {user?.studentId || 'DYP2026CS042'}
                </div>

                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                  Dr. D. Y. Patil College of Engineering and Innovation, Pune
                </div>
              </div>
            </div>

            {/* Profile Attributes */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1.5rem',
              borderRadius: 16,
              border: '1px solid rgba(255, 255, 255, 0.07)'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Department</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {user?.department || 'Computer Engineering'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Class & Division</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  Year {user?.year || 'TE'} • Div {user?.division || 'A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>College Webmail</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {user?.email || 'kunal.student@dypcoei.ac.in'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Mobile Contact</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {user?.mobile || '+91 9876543210'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
