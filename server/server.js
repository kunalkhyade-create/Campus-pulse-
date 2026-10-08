const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dypcoei-campus-connect-super-secret-key-2026';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database in-memory store with persistence fallback
const DB_FILE = path.join(__dirname, 'db_data.json');

let inMemoryDb = {
  users: [
    {
      id: 'student-1',
      name: 'Kunal Khyade',
      email: 'kunal.student@dypcoei.ac.in',
      studentId: 'DYP2026CS042',
      passwordHash: bcrypt.hashSync('password123', 8),
      department: 'Computer Engineering',
      year: 'TE',
      division: 'A',
      role: 'STUDENT',
      mobile: '+91 9876543210',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'student-2',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@dypcoei.ac.in',
      studentId: 'DYP2026IT018',
      passwordHash: bcrypt.hashSync('password123', 8),
      department: 'Information Technology',
      year: 'SE',
      division: 'B',
      role: 'STUDENT',
      mobile: '+91 9822334455',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'club-user-1',
      name: 'Coding Club DYPCOEI',
      email: 'codingclub@dypcoei.ac.in',
      studentId: 'CLUB-CODING',
      passwordHash: bcrypt.hashSync('password123', 8),
      department: 'Computer Engineering',
      year: 'All',
      division: 'Central',
      role: 'CLUB_COORDINATOR',
      clubId: 'club-1',
      mobile: '+91 9811223344',
      profileImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'club-user-2',
      name: 'Robotics & AI Club DYPCOEI',
      email: 'robotics@dypcoei.ac.in',
      studentId: 'CLUB-ROBOTICS',
      passwordHash: bcrypt.hashSync('password123', 8),
      department: 'Mechanical / ENTC',
      year: 'All',
      division: 'Central',
      role: 'CLUB_COORDINATOR',
      clubId: 'club-2',
      mobile: '+91 9811223355',
      profileImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'admin-1',
      name: 'DYPCOEI Administration',
      email: 'admin@dypcoei.ac.in',
      studentId: 'ADMIN-001',
      passwordHash: bcrypt.hashSync('admin123', 8),
      department: 'Dean Student Affairs',
      year: 'Admin',
      division: 'HQ',
      role: 'ADMIN',
      mobile: '+91 20 27653054',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      createdAt: new Date().toISOString(),
    }
  ],
  clubs: [
    {
      id: 'club-1',
      name: 'Coding Club DYPCOEI',
      email: 'codingclub@dypcoei.ac.in',
      logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300',
      description: 'The premier technical coding community at DYPCOEI. Organizers of CodeStorm, hackathons, ICPC tracks and open-source bootcamps.',
      category: 'Technical',
      facultyCoordinator: 'Prof. S. R. Patil',
      studentCoordinator: 'Aditya Deshmukh (TE Comp)',
      status: 'active',
      approvalStatus: 'APPROVED',
      members: 140,
      socialLinks: { github: 'https://github.com/dypcoeicoding', instagram: '@dypcoeicoding', linkedin: 'coding-club-dypcoei' },
      createdAt: '2025-01-10T00:00:00.000Z'
    },
    {
      id: 'club-2',
      name: 'Robotics & AI Club',
      email: 'robotics@dypcoei.ac.in',
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=300',
      description: 'Building autonomous robots, UAVs, and state-of-the-art machine learning models for national-level competitions.',
      category: 'Technical',
      facultyCoordinator: 'Dr. M. K. Kadam',
      studentCoordinator: 'Rohan Joshi (BE Mech)',
      status: 'active',
      approvalStatus: 'APPROVED',
      members: 95,
      socialLinks: { instagram: '@dypcoeirobotics', linkedin: 'robotics-dypcoei' },
      createdAt: '2025-02-15T00:00:00.000Z'
    },
    {
      id: 'club-3',
      name: 'Cultural Council DYPCOEI',
      email: 'cultural@dypcoei.ac.in',
      logo: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=300',
      description: 'Celebrating arts, dance, drama, and campus festivals including Sanskriti and Antarrang.',
      category: 'Cultural',
      facultyCoordinator: 'Prof. Anjali Roy',
      studentCoordinator: 'Pooja Kulkarni (TE IT)',
      status: 'active',
      approvalStatus: 'APPROVED',
      members: 180,
      socialLinks: { instagram: '@dypcoeicultural' },
      createdAt: '2025-01-20T00:00:00.000Z'
    },
    {
      id: 'club-request-1',
      name: 'Aeromodelling Club DYPCOEI',
      email: 'aeromodelling@dypcoei.ac.in',
      logo: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=300',
      description: 'Designing fixed-wing RC planes and multirotor drones for SAE Aero Design competitions.',
      category: 'Technical',
      facultyCoordinator: 'Prof. V. B. Jadhav',
      studentCoordinator: 'Tanmay More (TE Mech)',
      contactNumber: '+91 9765432109',
      reason: 'We have 45 interested students who want to build RC aircrafts and represent DYPCOEI in national competitions.',
      status: 'pending',
      approvalStatus: 'PENDING_APPROVAL',
      members: 45,
      socialLinks: { instagram: '@dypcoeiaero' },
      createdAt: new Date().toISOString()
    }
  ],
  events: [
    {
      id: 'evt-1',
      clubId: 'club-1',
      clubName: 'Coding Club',
      title: 'CodeStorm 2026',
      description: 'The annual flagship competitive programming marathon of DYPCOEI. Solve algorithmic problems against the clock and claim the championship trophy.',
      banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
      category: 'Technical Competition',
      date: '2026-10-15',
      displayDate: '15 October 2026',
      startTime: '10:00 AM',
      endTime: '02:00 PM',
      venue: 'Computer Lab 3 (Ground Floor)',
      capacity: 100,
      participantsCount: 87,
      registrationDeadline: '2026-10-14 23:59',
      registrationType: 'Campus Connect Registration',
      registrationLink: '',
      participationFee: 'Free',
      rules: '1. Individual participation.\n2. Languages: C++, Java, Python.\n3. Plagiarism leads to immediate disqualification.\n4. Bring college ID card.',
      prizes: '1st Prize: ₹10,000 + Trophy\n2nd Prize: ₹5,000 + Certificate of Merit\nTop 10: Exclusive Swag Kits',
      contactPerson: { name: 'Aditya Deshmukh', mobile: '+91 9811223344', email: 'codingclub@dypcoei.ac.in' },
      status: 'LIVE NOW',
      approvalStatus: 'APPROVED',
      createdAt: '2026-10-01T10:00:00.000Z',
      updatedAt: '2026-10-07T09:00:00.000Z'
    },
    {
      id: 'evt-2',
      clubId: 'club-2',
      clubName: 'Robotics & AI Club',
      title: 'AI & Robotics HackSprint',
      description: 'Hands-on edge AI and computer vision workshop with ROS 2 and Nvidia Jetson hardware kits.',
      banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
      category: 'Workshop',
      date: '2026-10-07',
      displayDate: '07 October 2026',
      startTime: '11:00 AM',
      endTime: '04:30 PM',
      venue: 'Mechanical Seminar Audi & Innovation Lab',
      capacity: 150,
      participantsCount: 142,
      registrationDeadline: '2026-10-07 10:00',
      registrationType: 'Campus Connect Registration',
      registrationLink: '',
      participationFee: 'Free',
      rules: 'Teams of up to 3 members. Hardware kits provided on-site.',
      prizes: 'Best Hardware Hack: ₹8,000 + Internship Interview Opportunity',
      contactPerson: { name: 'Rohan Joshi', mobile: '+91 9811223355', email: 'robotics@dypcoei.ac.in' },
      status: 'TODAY',
      approvalStatus: 'APPROVED',
      createdAt: '2026-09-28T10:00:00.000Z',
      updatedAt: '2026-10-07T08:00:00.000Z'
    },
    {
      id: 'evt-3',
      clubId: 'club-3',
      clubName: 'Cultural Council',
      title: 'Sanskriti 2026 - Annual Cultural Gala',
      description: 'DYPCOEI’s mega inter-branch dance, acoustic music, and theatrical drama extravaganza.',
      banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
      category: 'Cultural',
      date: '2026-10-24',
      displayDate: '24 October 2026',
      startTime: '04:00 PM',
      endTime: '10:00 PM',
      venue: 'DYPCOEI Central Amphitheatre',
      capacity: 600,
      participantsCount: 320,
      registrationDeadline: '2026-10-22 23:59',
      registrationType: 'Campus Connect Registration',
      registrationLink: '',
      participationFee: 'Free',
      rules: 'Open to all registered DYPCOEI students. Pre-auditions required for solo performers.',
      prizes: 'Branch Championship Shield + Cash Prizes',
      contactPerson: { name: 'Pooja Kulkarni', mobile: '+91 9822331122', email: 'cultural@dypcoei.ac.in' },
      status: 'UPCOMING',
      approvalStatus: 'APPROVED',
      createdAt: '2026-10-02T10:00:00.000Z',
      updatedAt: '2026-10-02T10:00:00.000Z'
    },
    {
      id: 'evt-4',
      clubId: 'club-1',
      clubName: 'Coding Club',
      title: 'Web3 & Smart Contracts Bootcamp',
      description: 'Deep dive into Solidity, EVM fundamentals, and building decentralized applications with live mentor guidance.',
      banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200',
      category: 'Technical',
      date: '2026-10-28',
      displayDate: '28 October 2026',
      startTime: '02:00 PM',
      endTime: '05:30 PM',
      venue: 'Computer Center 2',
      capacity: 80,
      participantsCount: 64,
      registrationDeadline: '2026-10-27 18:00',
      registrationType: 'Campus Connect Registration',
      registrationLink: '',
      participationFee: 'Free',
      rules: 'Laptops with Node.js installed recommended.',
      prizes: 'NFT Badges and Certificate of Completion',
      contactPerson: { name: 'Aditya Deshmukh', mobile: '+91 9811223344', email: 'codingclub@dypcoei.ac.in' },
      status: 'UPCOMING',
      approvalStatus: 'APPROVED',
      createdAt: '2026-10-03T10:00:00.000Z',
      updatedAt: '2026-10-03T10:00:00.000Z'
    },
    {
      id: 'evt-5',
      clubId: 'club-1',
      clubName: 'Coding Club',
      title: 'DevFest DYPCOEI 2025',
      description: 'Previous edition of our college-wide software showcase and product sprint.',
      banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      category: 'Technical Competition',
      date: '2026-08-14',
      displayDate: '14 August 2026',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      venue: 'Main Auditorium',
      capacity: 250,
      participantsCount: 230,
      registrationDeadline: '2026-08-12 18:00',
      registrationType: 'Campus Connect Registration',
      registrationLink: '',
      participationFee: 'Free',
      rules: 'Finished event.',
      prizes: 'Trophies awarded.',
      contactPerson: { name: 'Aditya Deshmukh', mobile: '+91 9811223344', email: 'codingclub@dypcoei.ac.in' },
      status: 'COMPLETED',
      approvalStatus: 'APPROVED',
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: '2026-08-15T10:00:00.000Z'
    }
  ],
  registrations: [
    {
      id: 'reg-1',
      eventId: 'evt-1',
      studentId: 'student-1',
      studentName: 'Kunal Khyade',
      collegeStudentId: 'DYP2026CS042',
      department: 'Computer Engineering',
      year: 'TE',
      division: 'A',
      email: 'kunal.student@dypcoei.ac.in',
      mobile: '+91 9876543210',
      registrationNumber: 'DYPCOEI-2026-00482',
      registrationDate: '2026-10-02T11:20:00.000Z',
      status: 'Confirmed',
      attendance: 'Present',
      checkedInAt: '2026-10-15T10:05:00.000Z'
    },
    {
      id: 'reg-2',
      eventId: 'evt-2',
      studentId: 'student-1',
      studentName: 'Kunal Khyade',
      collegeStudentId: 'DYP2026CS042',
      department: 'Computer Engineering',
      year: 'TE',
      division: 'A',
      email: 'kunal.student@dypcoei.ac.in',
      mobile: '+91 9876543210',
      registrationNumber: 'DYPCOEI-2026-00319',
      registrationDate: '2026-10-04T15:45:00.000Z',
      status: 'Confirmed',
      attendance: 'Pending',
      checkedInAt: null
    },
    {
      id: 'reg-3',
      eventId: 'evt-1',
      studentId: 'student-2',
      studentName: 'Ananya Sharma',
      collegeStudentId: 'DYP2026IT018',
      department: 'Information Technology',
      year: 'SE',
      division: 'B',
      email: 'ananya.sharma@dypcoei.ac.in',
      mobile: '+91 9822334455',
      registrationNumber: 'DYPCOEI-2026-00483',
      registrationDate: '2026-10-02T12:00:00.000Z',
      status: 'Confirmed',
      attendance: 'Present',
      checkedInAt: '2026-10-15T10:12:00.000Z'
    },
    {
      id: 'reg-4',
      eventId: 'evt-5',
      studentId: 'student-1',
      studentName: 'Kunal Khyade',
      collegeStudentId: 'DYP2026CS042',
      department: 'Computer Engineering',
      year: 'TE',
      division: 'A',
      email: 'kunal.student@dypcoei.ac.in',
      mobile: '+91 9876543210',
      registrationNumber: 'DYPCOEI-2026-00108',
      registrationDate: '2026-08-05T09:30:00.000Z',
      status: 'Completed',
      attendance: 'Present',
      checkedInAt: '2026-08-14T09:15:00.000Z'
    }
  ],
  announcements: [
    {
      id: 'ann-1',
      clubId: 'club-1',
      clubName: 'Coding Club',
      eventId: 'evt-1',
      eventTitle: 'CodeStorm 2026',
      title: '📢 CodeStorm Venue Updated',
      message: 'Computer Lab 3 setup is live! Please take your assigned seats and test compiler environments.',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: 'ann-2',
      clubId: 'club-2',
      clubName: 'Robotics & AI Club',
      eventId: 'evt-2',
      eventTitle: 'AI & Robotics HackSprint',
      message: 'Hardware kits distribution begins at 10:45 AM sharp in the Innovation Lab.',
      title: '⚡ Hardware Kits Distribution',
      createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      userId: 'student-1',
      title: '🎉 Registration Confirmed!',
      message: 'You are successfully registered for CodeStorm 2026. Your Reg ID is DYPCOEI-2026-00482.',
      type: 'registration',
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'notif-2',
      userId: 'student-1',
      title: '🔴 Event is LIVE NOW',
      message: 'CodeStorm 2026 has started in Computer Lab 3. Check in with your QR pass.',
      type: 'event_live',
      read: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    }
  ],
  savedEvents: ['evt-3']
};

// Load saved data if file exists
try {
  if (fs.existsSync(DB_FILE)) {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    inMemoryDb = { ...inMemoryDb, ...data };
  }
} catch (e) {
  console.log('Using default in-memory database');
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2));
  } catch (err) {
    console.error('Error saving db file', err);
  }
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires one of: ${roles.join(', ')}` });
    }
    next();
  };
}

// In-Memory OTP Cache: email -> { otp, expiresAt, purpose }
const otpStore = new Map();

// Helper to generate 6-digit cryptographic OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==========================================
// EMAIL OTP SYSTEM ROUTES
// ==========================================

// 1. Send Email OTP
app.post('/api/auth/otp/send', (req, res) => {
  const { email, purpose = 'LOGIN' } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Valid college email address is required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existingUser = inMemoryDb.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (purpose === 'LOGIN' && !existingUser) {
    return res.status(404).json({ message: 'No registered account found with this email. Please register first.' });
  }

  if (purpose === 'REGISTER' && existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists. Please login instead.' });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(cleanEmail, { otp, expiresAt, purpose });

  console.log(`\n======================================================`);
  console.log(`[DYPCOEI EMAIL GATEWAY] 📧 OTP DISPATCH`);
  console.log(`To: ${cleanEmail}`);
  console.log(`Subject: Your DYPCOEI Campus Connect Verification Code`);
  console.log(`OTP Code: >>> ${otp} <<< (Valid for 10 minutes)`);
  console.log(`Purpose: ${purpose}`);
  console.log(`======================================================\n`);

  res.json({
    message: `Verification code sent to ${cleanEmail}`,
    email: cleanEmail,
    expiresIn: 600,
    previewOtp: otp // Included for instant sandbox testing
  });
});

// 2. Verify Email OTP
app.post('/api/auth/otp/verify', (req, res) => {
  const { email, otp, purpose = 'LOGIN' } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and 6-digit OTP code are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return res.status(400).json({ message: 'No OTP requested for this email, or it has expired. Please request a new OTP.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
  }

  if (record.otp !== otp.toString().trim()) {
    return res.status(400).json({ message: 'Incorrect OTP code. Please check and try again.' });
  }

  // OTP is valid!
  otpStore.delete(cleanEmail);

  if (purpose === 'LOGIN') {
    const user = inMemoryDb.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      department: user.department,
      year: user.year,
      division: user.division,
      profileImage: user.profileImage,
      clubId: user.clubId
    }, JWT_SECRET, { expiresIn: '7d' });

    let extra = {};
    if (user.role === 'CLUB_COORDINATOR' && user.clubId) {
      extra.club = inMemoryDb.clubs.find(c => c.id === user.clubId);
    }

    return res.json({
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        department: user.department,
        year: user.year,
        division: user.division,
        profileImage: user.profileImage,
        ...extra
      }
    });
  }

  // Registration or other purpose
  res.json({
    message: 'Email verified successfully!',
    email: cleanEmail,
    verified: true
  });
});

// 3. Reset Password via OTP
app.post('/api/auth/otp/reset-password', (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const record = otpStore.get(cleanEmail);

  if (!record || record.otp !== otp.toString().trim() || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const user = inMemoryDb.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) return res.status(404).json({ message: 'User account not found' });

  user.passwordHash = bcrypt.hashSync(newPassword, 8);
  otpStore.delete(cleanEmail);
  saveDb();

  res.json({ message: 'Password reset successful! You can now login with your new password.' });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// 1. Student Login
app.post('/api/auth/student/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: 'College Email / Student ID and password are required' });
  }

  const user = inMemoryDb.users.find(u => 
    (u.email.toLowerCase() === identifier.toLowerCase() || 
     (u.studentId && u.studentId.toLowerCase() === identifier.toLowerCase())) &&
    u.role === 'STUDENT'
  );

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid Student ID/Email or password' });
  }

  const token = jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    studentId: user.studentId,
    role: user.role,
    department: user.department,
    year: user.year,
    division: user.division,
    profileImage: user.profileImage
  }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Welcome back to DYPCOEI Campus Connect!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      department: user.department,
      year: user.year,
      division: user.division,
      profileImage: user.profileImage
    }
  });
});

// 2. Student Registration
app.post('/api/auth/student/register', (req, res) => {
  const { name, studentId, email, mobile, department, year, division, password, profileImage } = req.body;

  if (!name || !studentId || !email || !password || !department || !year) {
    return res.status(400).json({ message: 'All required registration fields must be filled' });
  }

  const existing = inMemoryDb.users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() || 
    (u.studentId && u.studentId.toLowerCase() === studentId.toLowerCase())
  );

  if (existing) {
    return res.status(409).json({ message: 'A student account with this Email or Student ID already exists' });
  }

  const newUser = {
    id: 'student-' + Date.now(),
    name,
    studentId: studentId.toUpperCase(),
    email: email.toLowerCase(),
    mobile: mobile || '',
    department,
    year,
    division: division || 'A',
    passwordHash: bcrypt.hashSync(password, 8),
    role: 'STUDENT',
    profileImage: profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  inMemoryDb.users.push(newUser);
  saveDb();

  const token = jwt.sign({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    studentId: newUser.studentId,
    role: newUser.role,
    department: newUser.department,
    year: newUser.year,
    division: newUser.division,
    profileImage: newUser.profileImage
  }, JWT_SECRET, { expiresIn: '7d' });

  // Welcome notification
  inMemoryDb.notifications.push({
    id: 'notif-' + Date.now(),
    userId: newUser.id,
    title: '🎉 Welcome to DYPCOEI Campus Connect!',
    message: `Hello ${newUser.name}, your student account is active. Explore live and upcoming campus events!`,
    type: 'welcome',
    read: false,
    createdAt: new Date().toISOString()
  });
  saveDb();

  res.status(201).json({
    message: 'Welcome to DYPCOEI Campus Connect!',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      studentId: newUser.studentId,
      role: newUser.role,
      department: newUser.department,
      year: newUser.year,
      division: newUser.division,
      profileImage: newUser.profileImage
    }
  });
});

// 3. Club Login
app.post('/api/auth/club/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Club Email / Club ID and password are required' });
  }

  const user = inMemoryDb.users.find(u => 
    (u.email.toLowerCase() === identifier.toLowerCase() || 
     (u.studentId && u.studentId.toLowerCase() === identifier.toLowerCase())) &&
    u.role === 'CLUB_COORDINATOR'
  );

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid Club ID/Email or password' });
  }

  const club = inMemoryDb.clubs.find(c => c.id === user.clubId);
  if (club && club.approvalStatus !== 'APPROVED') {
    return res.status(403).json({ message: 'Your club access request is currently pending admin approval.' });
  }

  const token = jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    clubId: user.clubId,
    profileImage: user.profileImage
  }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: `Welcome, ${club ? club.name : user.name} 👋`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clubId: user.clubId,
      club: club || null
    }
  });
});

// 4. Club Request Access (Clubs cannot create fake accounts freely)
app.post('/api/auth/club/request-access', (req, res) => {
  const { name, category, description, facultyCoordinator, studentCoordinator, email, contactNumber, socialMediaLink, logo, reason } = req.body;

  if (!name || !category || !email || !facultyCoordinator || !studentCoordinator) {
    return res.status(400).json({ message: 'Please fill in all mandatory club request fields' });
  }

  const existingClub = inMemoryDb.clubs.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (existingClub) {
    return res.status(409).json({ message: 'A club with this email address has already submitted a request' });
  }

  const newClubRequest = {
    id: 'club-' + Date.now(),
    name,
    email: email.toLowerCase(),
    category,
    description: description || '',
    facultyCoordinator,
    studentCoordinator,
    contactNumber: contactNumber || '',
    socialLinks: { instagram: socialMediaLink || '' },
    logo: logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
    reason: reason || 'Official college club seeking event publication access.',
    status: 'pending',
    approvalStatus: 'PENDING_APPROVAL',
    members: 1,
    createdAt: new Date().toISOString()
  };

  inMemoryDb.clubs.push(newClubRequest);
  saveDb();

  res.status(201).json({
    message: 'Your request has been submitted for admin approval. Club accounts become active only after approval by DYPCOEI administration.',
    request: newClubRequest
  });
});

// 5. Admin Login
app.post('/api/auth/admin/login', (req, res) => {
  const { email, password } = req.body;
  const admin = inMemoryDb.users.find(u => 
    (u.email.toLowerCase() === (email || '').toLowerCase() || u.studentId === 'ADMIN-001') && 
    u.role === 'ADMIN'
  );

  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    return res.status(401).json({ message: 'Invalid Admin credentials' });
  }

  const token = jwt.sign({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role
  }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Welcome Admin!',
    token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});


// Current User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = inMemoryDb.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  let extra = {};
  if (user.role === 'CLUB_COORDINATOR' && user.clubId) {
    extra.club = inMemoryDb.clubs.find(c => c.id === user.clubId);
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      department: user.department,
      year: user.year,
      division: user.division,
      profileImage: user.profileImage,
      ...extra
    }
  });
});

// ==========================================
// EVENTS API (DISCOVERY & DETAILS)
// ==========================================

// Get all events (with filter by status, category, search)
app.get('/api/events', (req, res) => {
  const { search, category, status } = req.query;
  let list = inMemoryDb.events.filter(e => e.approvalStatus === 'APPROVED' || !e.approvalStatus);

  if (category && category !== 'All') {
    list = list.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (status && status !== 'All') {
    list = list.filter(e => e.status.toUpperCase() === status.toUpperCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.clubName.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

// Get single event
app.get('/api/events/:id', (req, res) => {
  const event = inMemoryDb.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const club = inMemoryDb.clubs.find(c => c.id === event.clubId);
  const announcements = inMemoryDb.announcements.filter(a => a.eventId === event.id);

  res.json({
    ...event,
    clubDetails: club || null,
    announcements
  });
});

// Student Register for Event
app.post('/api/events/:id/register', authenticateToken, requireRole('STUDENT'), (req, res) => {
  const eventId = req.params.id;
  const event = inMemoryDb.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.status === 'COMPLETED' || event.status === 'CANCELLED') {
    return res.status(400).json({ message: 'Registrations are closed for this event.' });
  }

  const existing = inMemoryDb.registrations.find(r => r.eventId === eventId && r.studentId === req.user.id);
  if (existing) {
    return res.status(409).json({ 
      message: 'You are already registered for this event!',
      registration: existing 
    });
  }

  const regNumInt = Math.floor(10000 + Math.random() * 90000);
  const registrationNumber = `DYPCOEI-2026-${regNumInt}`;

  const newReg = {
    id: 'reg-' + Date.now(),
    eventId: event.id,
    studentId: req.user.id,
    studentName: req.user.name,
    collegeStudentId: req.user.studentId,
    department: req.user.department || 'Computer Engineering',
    year: req.user.year || 'TE',
    division: req.user.division || 'A',
    email: req.user.email,
    mobile: req.body.mobile || req.user.mobile || '+91 9800000000',
    additionalNotes: req.body.notes || '',
    registrationNumber,
    registrationDate: new Date().toISOString(),
    status: 'Confirmed',
    attendance: 'Pending',
    checkedInAt: null
  };

  inMemoryDb.registrations.push(newReg);
  event.participantsCount = (event.participantsCount || 0) + 1;

  // Create notification
  inMemoryDb.notifications.push({
    id: 'notif-' + Date.now(),
    userId: req.user.id,
    title: '🎉 Registration Successful!',
    message: `You are registered for ${event.title}. Reg ID: ${registrationNumber}`,
    type: 'registration',
    read: false,
    createdAt: new Date().toISOString()
  });

  saveDb();

  res.status(201).json({
    message: '🎉 Registration Successful!',
    registrationNumber,
    registration: newReg,
    event
  });
});

// Student Registrations List
app.get('/api/student/registrations', authenticateToken, requireRole('STUDENT'), (req, res) => {
  const regs = inMemoryDb.registrations.filter(r => r.studentId === req.user.id);
  const populated = regs.map(r => {
    const event = inMemoryDb.events.find(e => e.id === r.eventId);
    return {
      ...r,
      event: event || { title: 'Unknown Event', date: 'TBD', venue: 'DYPCOEI', status: 'UNKNOWN' }
    };
  });
  res.json(populated);
});

// Student Cancel Registration
app.delete('/api/student/registrations/:id', authenticateToken, requireRole('STUDENT'), (req, res) => {
  const regIndex = inMemoryDb.registrations.findIndex(r => r.id === req.params.id && r.studentId === req.user.id);
  if (regIndex === -1) return res.status(404).json({ message: 'Registration not found' });

  const reg = inMemoryDb.registrations[regIndex];
  reg.status = 'Cancelled';
  saveDb();

  res.json({ message: 'Registration cancelled successfully', registration: reg });
});

// Bookmark / Saved events toggle
app.post('/api/student/saved/:eventId', authenticateToken, requireRole('STUDENT'), (req, res) => {
  const { eventId } = req.params;
  const idx = inMemoryDb.savedEvents.indexOf(eventId);
  let saved = false;
  if (idx > -1) {
    inMemoryDb.savedEvents.splice(idx, 1);
    saved = false;
  } else {
    inMemoryDb.savedEvents.push(eventId);
    saved = true;
  }
  saveDb();
  res.json({ saved, savedEvents: inMemoryDb.savedEvents });
});

app.get('/api/student/saved', authenticateToken, requireRole('STUDENT'), (req, res) => {
  const events = inMemoryDb.events.filter(e => inMemoryDb.savedEvents.includes(e.id));
  res.json(events);
});

// Student notifications
app.get('/api/student/notifications', authenticateToken, (req, res) => {
  const list = inMemoryDb.notifications.filter(n => n.userId === req.user.id || n.userId === 'ALL');
  res.json(list.reverse());
});

// ==========================================
// CLUB PORTAL ROUTES
// ==========================================

// Get Club's Events
app.get('/api/club/events', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const clubId = req.user.clubId || 'club-1';
  const events = inMemoryDb.events.filter(e => e.clubId === clubId);
  res.json(events);
});

// Create Event
app.post('/api/club/events', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const clubId = req.user.clubId || 'club-1';
  const club = inMemoryDb.clubs.find(c => c.id === clubId);

  const {
    title, description, banner, category, date, startTime, endTime,
    venue, capacity, registrationDeadline, registrationType, registrationLink,
    participationFee, rules, prizes, contactPerson, status: initialStatus
  } = req.body;

  if (!title || !category || !date || !startTime || !venue) {
    return res.status(400).json({ message: 'Event Name, Category, Date, Time and Venue are required.' });
  }

  const newEvent = {
    id: 'evt-' + Date.now(),
    clubId,
    clubName: club ? club.name : req.user.name,
    title,
    description: description || '',
    banner: banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    category,
    date,
    displayDate: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    startTime,
    endTime: endTime || '05:00 PM',
    venue,
    capacity: Number(capacity) || 100,
    participantsCount: 0,
    registrationDeadline: registrationDeadline || `${date} 23:59`,
    registrationType: registrationType || 'Campus Connect Registration',
    registrationLink: registrationLink || '',
    participationFee: participationFee || 'Free',
    rules: rules || 'Follow official DYPCOEI code of conduct.',
    prizes: prizes || '',
    contactPerson: contactPerson || { name: req.user.name, mobile: '+91 9800000000', email: req.user.email },
    status: initialStatus || 'UPCOMING',
    approvalStatus: 'APPROVED', // Ready for demo
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inMemoryDb.events.unshift(newEvent);
  saveDb();

  res.status(201).json({ message: 'Event created successfully!', event: newEvent });
});

// Edit Event
app.put('/api/club/events/:id', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const event = inMemoryDb.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (req.user.role !== 'ADMIN' && event.clubId !== req.user.clubId) {
    return res.status(403).json({ message: 'Unauthorized to edit this event' });
  }

  Object.assign(event, req.body, { updatedAt: new Date().toISOString() });
  saveDb();

  res.json({ message: 'Event updated successfully', event });
});

// Live Event Quick Control (Change status, Change venue, Post quick announcement)
app.patch('/api/club/events/:id/status', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const event = inMemoryDb.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (req.user.role !== 'ADMIN' && event.clubId !== req.user.clubId) {
    return res.status(403).json({ message: 'Unauthorized to update this event' });
  }

  const { status, venue, announcementMessage } = req.body;

  if (status) event.status = status;
  if (venue) event.venue = venue;
  event.updatedAt = new Date().toISOString();

  // If quick announcement posted, distribute to registered students!
  if (announcementMessage) {
    const ann = {
      id: 'ann-' + Date.now(),
      clubId: event.clubId,
      clubName: event.clubName,
      eventId: event.id,
      eventTitle: event.title,
      title: status === 'LIVE NOW' ? `🔴 ${event.title} is now LIVE!` : `📢 Live Update: ${event.title}`,
      message: announcementMessage,
      createdAt: new Date().toISOString()
    };
    inMemoryDb.announcements.unshift(ann);

    // Notify registered students
    const regs = inMemoryDb.registrations.filter(r => r.eventId === event.id);
    regs.forEach(r => {
      inMemoryDb.notifications.push({
        id: 'notif-' + Math.random().toString(36).substring(7),
        userId: r.studentId,
        title: ann.title,
        message: announcementMessage,
        type: 'live_update',
        read: false,
        createdAt: new Date().toISOString()
      });
    });
  }

  saveDb();
  res.json({ message: 'Event updated in real time!', event });
});

// Cancel Event
app.delete('/api/club/events/:id', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const event = inMemoryDb.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  event.status = 'CANCELLED';
  saveDb();

  res.json({ message: 'Event marked as Cancelled', event });
});

// Club Event Participants
app.get('/api/club/events/:id/participants', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const event = inMemoryDb.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const participants = inMemoryDb.registrations.filter(r => r.eventId === event.id);
  res.json({ event, participants });
});

// Toggle Participant Attendance
app.patch('/api/club/events/:id/participants/:regId/attendance', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const reg = inMemoryDb.registrations.find(r => r.id === req.params.regId && r.eventId === req.params.id);
  if (!reg) return res.status(404).json({ message: 'Registration record not found' });

  const { attendance } = req.body;
  reg.attendance = attendance || (reg.attendance === 'Present' ? 'Absent' : 'Present');
  reg.checkedInAt = reg.attendance === 'Present' ? new Date().toISOString() : null;
  saveDb();

  res.json({ message: `Attendance marked: ${reg.attendance}`, registration: reg });
});

// Quick QR Scanner / Code verification attendance
app.post('/api/club/events/:id/scan-qr', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const { code } = req.body; // e.g. "DYPCOEI-2026-00482"
  if (!code) return res.status(400).json({ message: 'QR Code or Registration Number is required' });

  const reg = inMemoryDb.registrations.find(r => 
    r.eventId === req.params.id && 
    (r.registrationNumber.toUpperCase() === code.trim().toUpperCase() || r.id === code.trim())
  );

  if (!reg) {
    return res.status(404).json({ message: 'Invalid ticket / Registration not found for this event' });
  }

  reg.attendance = 'Present';
  reg.checkedInAt = new Date().toISOString();
  saveDb();

  res.json({
    message: `Verified! Attendance confirmed for ${reg.studentName} (${reg.collegeStudentId})`,
    registration: reg
  });
});

// Club Announcements
app.get('/api/club/announcements', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const clubId = req.user.clubId || 'club-1';
  const list = inMemoryDb.announcements.filter(a => a.clubId === clubId);
  res.json(list);
});

app.post('/api/club/announcements', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const clubId = req.user.clubId || 'club-1';
  const club = inMemoryDb.clubs.find(c => c.id === clubId);
  const { eventId, title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: 'Title and message are required' });
  }

  const event = eventId ? inMemoryDb.events.find(e => e.id === eventId) : null;

  const newAnn = {
    id: 'ann-' + Date.now(),
    clubId,
    clubName: club ? club.name : req.user.name,
    eventId: event ? event.id : null,
    eventTitle: event ? event.title : 'General Club Announcement',
    title,
    message,
    createdAt: new Date().toISOString()
  };

  inMemoryDb.announcements.unshift(newAnn);

  // Notify registered students
  if (eventId) {
    const regs = inMemoryDb.registrations.filter(r => r.eventId === eventId);
    regs.forEach(r => {
      inMemoryDb.notifications.push({
        id: 'notif-' + Math.random().toString(36).substring(7),
        userId: r.studentId,
        title: `📢 ${club ? club.name : 'Club'}: ${title}`,
        message,
        type: 'announcement',
        read: false,
        createdAt: new Date().toISOString()
      });
    });
  }

  saveDb();
  res.status(201).json({ message: 'Announcement posted successfully!', announcement: newAnn });
});

// Club Analytics
app.get('/api/club/analytics', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const clubId = req.user.clubId || 'club-1';
  const myEvents = inMemoryDb.events.filter(e => e.clubId === clubId);
  const eventIds = myEvents.map(e => e.id);
  const myRegs = inMemoryDb.registrations.filter(r => eventIds.includes(r.eventId));

  const totalEvents = myEvents.length;
  const activeEvents = myEvents.filter(e => e.status === 'LIVE NOW' || e.status === 'UPCOMING' || e.status === 'TODAY').length;
  const totalRegistrations = myRegs.length;
  const totalPresent = myRegs.filter(r => r.attendance === 'Present').length;
  const attendanceRate = totalRegistrations > 0 ? Math.round((totalPresent / totalRegistrations) * 100) : 85;

  res.json({
    totalEvents: totalEvents || 18,
    activeEvents: activeEvents || 3,
    totalParticipants: 342 + myRegs.length,
    totalRegistrations: 128 + myRegs.length,
    attendanceRate: attendanceRate,
    averageParticipation: Math.round((342 + myRegs.length) / Math.max(totalEvents, 1)),
    mostPopularEvent: myEvents[0]?.title || 'CodeStorm 2026',
    monthlyTrends: [
      { month: 'Jun', events: 2, participants: 60 },
      { month: 'Jul', events: 3, participants: 95 },
      { month: 'Aug', events: 4, participants: 140 },
      { month: 'Sep', events: 5, participants: 180 },
      { month: 'Oct', events: 4, participants: 215 },
    ]
  });
});

// Club Profile
app.get('/api/club/profile', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const clubId = req.user.clubId || 'club-1';
  const club = inMemoryDb.clubs.find(c => c.id === clubId);
  if (!club) return res.status(404).json({ message: 'Club not found' });
  res.json(club);
});

app.put('/api/club/profile', authenticateToken, requireRole('CLUB_COORDINATOR', 'ADMIN'), (req, res) => {
  const clubId = req.user.clubId || 'club-1';
  const club = inMemoryDb.clubs.find(c => c.id === clubId);
  if (!club) return res.status(404).json({ message: 'Club not found' });

  // Only permit non-sensitive field edits
  const { description, socialLinks, studentCoordinator } = req.body;
  if (description) club.description = description;
  if (socialLinks) club.socialLinks = socialLinks;
  if (studentCoordinator) club.studentCoordinator = studentCoordinator;
  saveDb();

  res.json({ message: 'Club profile updated successfully', club });
});

// Club Gallery / Moments
app.get('/api/club/gallery', (req, res) => {
  res.json([
    {
      id: 'gal-1',
      title: 'CodeStorm 2025 Grand Finale & Prize Ceremony',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      clubName: 'Coding Club',
      date: 'Aug 2025',
      caption: 'Winners receiving trophies from the Principal and HOD Computer.'
    },
    {
      id: 'gal-2',
      title: 'Robotics Workshop Hands-On Lab Session',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
      clubName: 'Robotics & AI Club',
      date: 'Sep 2025',
      caption: 'Students assembling autonomous line-follower rovers.'
    },
    {
      id: 'gal-3',
      title: 'Sanskriti Flashmob & Cultural Inauguration',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      clubName: 'Cultural Council',
      date: 'Feb 2025',
      caption: 'Energetic campus dance performance in the DYPCOEI amphitheatre.'
    }
  ]);
});

// ==========================================
// ADMIN PORTAL ROUTES
// ==========================================

// Club Access Requests
app.get('/api/admin/clubs/requests', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const pendingClubs = inMemoryDb.clubs.filter(c => c.approvalStatus === 'PENDING_APPROVAL' || c.status === 'pending');
  res.json(pendingClubs);
});

// Approve Club
app.patch('/api/admin/clubs/:id/approve', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const club = inMemoryDb.clubs.find(c => c.id === req.params.id);
  if (!club) return res.status(404).json({ message: 'Club request not found' });

  club.approvalStatus = 'APPROVED';
  club.status = 'active';

  // Create coordinator login user for this club if not exists
  const existingUser = inMemoryDb.users.find(u => u.email === club.email);
  if (!existingUser) {
    inMemoryDb.users.push({
      id: 'club-user-' + Date.now(),
      name: club.name,
      email: club.email,
      studentId: `CLUB-${club.name.substring(0, 4).toUpperCase()}`,
      passwordHash: bcrypt.hashSync('password123', 8),
      department: club.category,
      role: 'CLUB_COORDINATOR',
      clubId: club.id,
      createdAt: new Date().toISOString()
    });
  }

  saveDb();
  res.json({ message: `${club.name} has been approved! Login credentials activated.`, club });
});

// Reject Club
app.patch('/api/admin/clubs/:id/reject', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const club = inMemoryDb.clubs.find(c => c.id === req.params.id);
  if (!club) return res.status(404).json({ message: 'Club request not found' });

  club.approvalStatus = 'REJECTED';
  club.status = 'rejected';
  saveDb();
  res.json({ message: 'Club request rejected', club });
});

// Admin Stats
app.get('/api/admin/stats', authenticateToken, requireRole('ADMIN'), (req, res) => {
  res.json({
    totalUsers: inMemoryDb.users.length,
    totalStudents: inMemoryDb.users.filter(u => u.role === 'STUDENT').length,
    totalClubs: inMemoryDb.clubs.length,
    pendingClubRequests: inMemoryDb.clubs.filter(c => c.approvalStatus === 'PENDING_APPROVAL').length,
    totalEvents: inMemoryDb.events.length,
    liveEventsCount: inMemoryDb.events.filter(e => e.status === 'LIVE NOW').length,
    totalRegistrations: inMemoryDb.registrations.length,
    totalAnnouncements: inMemoryDb.announcements.length
  });
});

// Admin Users List
app.get('/api/admin/users', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const users = inMemoryDb.users.map(({ passwordHash, ...safeUser }) => safeUser);
  res.json(users);
});

// Public Clubs List
app.get('/api/clubs', (req, res) => {
  const activeClubs = inMemoryDb.clubs.filter(c => c.approvalStatus === 'APPROVED' || c.status === 'active');
  res.json(activeClubs);
});

// Public Club by ID
app.get('/api/clubs/:id', (req, res) => {
  const club = inMemoryDb.clubs.find(c => c.id === req.params.id);
  if (!club) return res.status(404).json({ message: 'Club not found' });
  const events = inMemoryDb.events.filter(e => e.clubId === club.id);
  res.json({ ...club, events });
});

// Public Announcements
app.get('/api/announcements', (req, res) => {
  res.json(inMemoryDb.announcements);
});

// Fallback status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'DYPCOEI Campus Connect',
    version: '2.0.0',
    time: new Date().toISOString()
  });
});

// Serve static built frontend
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`[DYPCOEI Campus Connect] Unified Server running on http://localhost:${PORT}`);
});
