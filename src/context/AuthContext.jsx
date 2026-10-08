import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  syncUserToFirestore,
  isLiveFirebaseConfigured
} from '../firebase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dypcoei_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dypcoei_token') || null);
  const [loading, setLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleModalRole, setGoogleModalRole] = useState('STUDENT');

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('dypcoei_user', JSON.stringify(user));
      localStorage.setItem('dypcoei_token', token);
    } else {
      localStorage.removeItem('dypcoei_user');
      localStorage.removeItem('dypcoei_token');
    }
  }, [user, token]);

  // Listen to Firebase auth state if live credentials are configured
  useEffect(() => {
    if (isLiveFirebaseConfigured()) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser && !user) {
          const profile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'DYPCOEI Student',
            email: firebaseUser.email,
            profileImage: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firebaseUser.displayName || 'User')}`,
            role: 'STUDENT',
            department: 'Computer Engineering',
            year: 'TE',
            studentId: 'DYP2026' + firebaseUser.uid.substring(0, 5).toUpperCase()
          };
          setUser(profile);
          setToken('firebase-token-' + firebaseUser.uid);
          await syncUserToFirestore(profile);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Student Email / ID Login
  const loginStudent = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      setUser(data.user);
      setToken(data.token);
      // Sync to Firestore
      syncUserToFirestore(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Student Registration
  const registerStudent = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setUser(data.user);
      setToken(data.token);
      // Sync to Firestore
      syncUserToFirestore(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Club Login
  const loginClub = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/club/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Club login failed');

      setUser(data.user);
      setToken(data.token);
      syncUserToFirestore(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Request Club Access
  const requestClubAccess = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/club/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Club access request failed');
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Admin Login
  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Admin login failed');

      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Email OTP System Handlers
  const sendEmailOtp = async (email, purpose = 'LOGIN') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP code');
      return data;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOtp = async (email, otp, purpose = 'LOGIN') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, purpose })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        syncUserToFirestore(data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordOtp = async (email, otp, newPassword) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset failed');
      return data;
    } finally {
      setLoading(false);
    }
  };

  // "Continue with Google" Firebase Auth Trigger
  const triggerGoogleSignIn = async (role = 'STUDENT') => {
    // If live Firebase credentials configured, try real Firebase popup
    if (isLiveFirebaseConfigured()) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const profile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google Student',
          email: fbUser.email,
          profileImage: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.displayName || 'Google')}`,
          role: role === 'CLUB' ? 'CLUB_COORDINATOR' : 'STUDENT',
          department: 'Computer Engineering',
          year: 'TE',
          division: 'A',
          studentId: 'DYP2026' + fbUser.uid.substring(0, 5).toUpperCase(),
          googleAuth: true
        };
        setUser(profile);
        setToken('firebase-jwt-' + fbUser.uid);
        await syncUserToFirestore(profile);
        return profile;
      } catch (err) {
        console.warn('Firebase popup notice:', err.message);
        // Fallback to Google Account Chooser modal
      }
    }

    // Open Google Account Chooser
    setGoogleModalRole(role);
    setGoogleModalOpen(true);
  };

  // Completes Google Sign-in with the chosen account
  const completeGoogleSignIn = async (account) => {
    const profile = {
      id: 'google-' + Date.now(),
      name: account.name,
      email: account.email,
      profileImage: account.photo,
      role: account.role || (googleModalRole === 'CLUB' ? 'CLUB_COORDINATOR' : 'STUDENT'),
      studentId: account.studentId || 'DYP2026CS042',
      department: account.department || 'Computer Engineering',
      year: account.year || 'TE',
      division: 'A',
      googleAuth: true,
      clubId: account.clubId || (googleModalRole === 'CLUB' ? 'club-1' : undefined)
    };

    setUser(profile);
    setToken('firebase-token-google-' + Date.now());
    await syncUserToFirestore(profile);
    setGoogleModalOpen(false);
    return profile;
  };

  const logout = async () => {
    try {
      if (auth.currentUser) await auth.signOut();
    } catch (e) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('dypcoei_user');
    localStorage.removeItem('dypcoei_token');
  };

  // Quick Demo Fast-Login Helper
  const switchDemoRole = async (targetRole) => {
    if (targetRole === 'STUDENT') {
      return await loginStudent('kunal.student@dypcoei.ac.in', 'password123');
    } else if (targetRole === 'CLUB') {
      return await loginClub('codingclub@dypcoei.ac.in', 'password123');
    } else if (targetRole === 'ADMIN') {
      return await loginAdmin('admin@dypcoei.ac.in', 'admin123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        loginStudent,
        registerStudent,
        loginClub,
        requestClubAccess,
        loginAdmin,
        logout,
        switchDemoRole,
        triggerGoogleSignIn,
        completeGoogleSignIn,
        sendEmailOtp,
        verifyEmailOtp,
        resetPasswordOtp,
        googleModalOpen,
        setGoogleModalOpen,
        googleModalRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
