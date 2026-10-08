import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';

// Firebase configuration from environment or fallback defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDYPCOEI-CampusConnect-2026-DemoKey",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dypcoei-campus-connect.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dypcoei-campus-connect",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dypcoei-campus-connect.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102938475610",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:102938475610:web:9f8e7d6c5b4a3"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: 'dypcoei.ac.in' // Recommended hosted domain for college
});

// Firestore Database
export const db = getFirestore(app);

// Check if Firebase has active live credentials
export const isLiveFirebaseConfigured = () => {
  return (
    import.meta.env.VITE_FIREBASE_API_KEY &&
    !import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoKey')
  );
};

// Firestore Collection References
export const usersCollection = collection(db, 'users');
export const eventsCollection = collection(db, 'events');
export const registrationsCollection = collection(db, 'registrations');
export const clubsCollection = collection(db, 'clubs');
export const announcementsCollection = collection(db, 'announcements');

// Helper to save/update user in Firestore
export async function syncUserToFirestore(user) {
  try {
    if (!user || !user.id) return;
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] User ${user.email} synced to Firestore database`);
  } catch (err) {
    console.warn('[Firestore] Sync user notice (using resilient local store):', err.message);
  }
}

// Helper to save/update event in Firestore
export async function syncEventToFirestore(event) {
  try {
    if (!event || !event.id) return;
    const eventRef = doc(db, 'events', event.id);
    await setDoc(eventRef, {
      ...event,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] Event ${event.title} synced to Firestore`);
  } catch (err) {
    console.warn('[Firestore] Sync event notice:', err.message);
  }
}

// Helper to save registration in Firestore
export async function syncRegistrationToFirestore(registration) {
  try {
    if (!registration || !registration.id) return;
    const regRef = doc(db, 'registrations', registration.id);
    await setDoc(regRef, {
      ...registration,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] Registration ${registration.registrationNumber} synced to Firestore`);
  } catch (err) {
    console.warn('[Firestore] Sync registration notice:', err.message);
  }
}

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot
};

export default app;
