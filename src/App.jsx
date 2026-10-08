import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GoogleSignInModal } from './components/GoogleSignInModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PublicClubsPage } from './pages/PublicClubsPage';
import { EventDetailPage } from './pages/EventDetailPage';

// Student Pages
import { StudentLoginPage } from './pages/student/StudentLoginPage';
import { StudentRegisterPage } from './pages/student/StudentRegisterPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentEventsPage } from './pages/student/StudentEventsPage';
import { StudentRegistrationsPage } from './pages/student/StudentRegistrationsPage';
import { StudentSavedPage } from './pages/student/StudentSavedPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';

// Club Pages
import { ClubLoginPage } from './pages/club/ClubLoginPage';
import { ClubRequestAccessPage } from './pages/club/ClubRequestAccessPage';
import { ClubDashboard } from './pages/club/ClubDashboard';
import { ClubEventsPage } from './pages/club/ClubEventsPage';
import { ClubCreateEventPage } from './pages/club/ClubCreateEventPage';
import { ClubParticipantsPage } from './pages/club/ClubParticipantsPage';
import { ClubAnnouncementsPage } from './pages/club/ClubAnnouncementsPage';
import { ClubGalleryPage } from './pages/club/ClubGalleryPage';
import { ClubAnalyticsPage } from './pages/club/ClubAnalyticsPage';
import { ClubProfilePage } from './pages/club/ClubProfilePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname || '/';
  });

  // Keep browser history in sync
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine current component based on route
  const renderCurrentPage = () => {
    const path = currentRoute.split('?')[0];

    // Single event detail route: e.g. /events/:id
    if (path.startsWith('/events/') && path !== '/events/') {
      const eventId = path.replace('/events/', '');
      return <EventDetailPage eventId={eventId} navigate={navigate} />;
    }

    // Club event participants route: e.g. /club/events/:id/participants
    if (path.includes('/participants')) {
      const parts = path.split('/');
      const evtId = parts[3] || 'evt-1';
      return <ClubParticipantsPage eventId={evtId} navigate={navigate} />;
    }

    switch (path) {
      // Landing & Public
      case '/':
        return <LandingPage navigate={navigate} />;
      case '/clubs':
        return <PublicClubsPage navigate={navigate} />;
      case '/events':
        return <StudentEventsPage navigate={navigate} />;

      // Student Portal
      case '/student/login':
        return <StudentLoginPage navigate={navigate} />;
      case '/student/register':
        return <StudentRegisterPage navigate={navigate} />;
      case '/student/dashboard':
        return <StudentDashboard navigate={navigate} />;
      case '/student/events':
        return <StudentEventsPage navigate={navigate} />;
      case '/student/registrations':
        return <StudentRegistrationsPage navigate={navigate} />;
      case '/student/saved':
        return <StudentSavedPage navigate={navigate} />;
      case '/student/profile':
        return <StudentProfilePage navigate={navigate} />;
      case '/student/notifications':
        return <StudentNotificationsPage navigate={navigate} />;

      // Club Portal
      case '/club/login':
        return <ClubLoginPage navigate={navigate} />;
      case '/club/request-access':
        return <ClubRequestAccessPage navigate={navigate} />;
      case '/club/dashboard':
        return <ClubDashboard navigate={navigate} />;
      case '/club/events':
        return <ClubEventsPage navigate={navigate} />;
      case '/club/events/create':
        return <ClubCreateEventPage navigate={navigate} />;
      case '/club/announcements':
        return <ClubAnnouncementsPage navigate={navigate} />;
      case '/club/gallery':
        return <ClubGalleryPage navigate={navigate} />;
      case '/club/analytics':
        return <ClubAnalyticsPage navigate={navigate} />;
      case '/club/profile':
        return <ClubProfilePage navigate={navigate} />;

      // Admin Portal
      case '/admin/login':
        return <AdminLoginPage navigate={navigate} />;
      case '/admin/dashboard':
      case '/admin/clubs':
      case '/admin/events':
      case '/admin/users':
        return <AdminDashboard navigate={navigate} />;

      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  const { 
    user, 
    role, 
    isAuthenticated,
    googleModalOpen, 
    setGoogleModalOpen, 
    googleModalRole, 
    completeGoogleSignIn 
  } = useAuth();

  const handleGoogleSuccess = async (account) => {
    const profile = await completeGoogleSignIn(account);
    if (profile.role === 'CLUB_COORDINATOR') {
      navigate('/club/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const isAuthPage = currentRoute.includes('/login') || currentRoute.includes('/register') || currentRoute.includes('/request-access');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeRoute={currentRoute} navigate={navigate} />
      <div style={{ flex: 1 }}>
        {renderCurrentPage()}
      </div>
      {!isAuthPage && <Footer navigate={navigate} />}

      {/* Firebase Google Sign-In Chooser Modal */}
      <GoogleSignInModal 
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        targetRole={googleModalRole}
        onSelectAccount={handleGoogleSuccess}
      />
    </div>
  );
}

export default App;
