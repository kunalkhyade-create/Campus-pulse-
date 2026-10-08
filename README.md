# 🎓 DYPCOEI Campus Pulse

A comprehensive, modern campus event and club engagement platform for Dr. D. Y. Patil College of Engineering and Innovation (DYPCOEI). Campus Pulse connects students, club coordinators, and college administration with event management, registrations, QR ticketing, announcements, and leaderboards.

---

## 🚀 Features

- **Event Discovery & Registrations**: Real-time listing of technical workshops, cultural fests, hackathons, and sports tournaments.
- **Club Management**: Club profiles, coordinator tools, event proposal creation, and attendance tracking.
- **QR Code Ticketing**: Dynamic QR code generation for event passes and check-ins.
- **Role-Based Access**:
  - 🎓 **Students**: Explore events, register, view tickets, and participate in clubs.
  - ⚡ **Club Coordinators**: Create and manage events, view registered attendees, and post updates.
  - 🛡️ **College Admin**: Approve club requests, manage users, and post official notices.
- **Unified REST API & Persistence**: Express-based backend with in-memory store and JSON persistence fallback.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, JWT Authentication, Bcrypt
- **Database**: In-memory JSON store with MongoDB / Firebase integration support

---

## 🏁 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/kunalkhyade-create/Campus-pulse-.git
cd Campus-pulse-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development servers
In terminal 1 (Backend API):
```bash
npm run server
```
*Backend runs on: `http://localhost:5000`*

In terminal 2 (Frontend UI):
```bash
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `kunal.student@dypcoei.ac.in` | `password123` |
| **Club Coordinator** | `codingclub@dypcoei.ac.in` | `password123` |
| **Admin** | `admin@dypcoei.ac.in` | `admin123` |

---

## 📄 License
ISC License