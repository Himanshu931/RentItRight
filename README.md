# RentItRight - Modern Rental Marketplace

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![BullMQ](https://img.shields.io/badge/BullMQ-E7104F?style=for-the-badge&logo=redis&logoColor=white)](https://docs.bullmq.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)

**RentItRight** is a full-stack rental platform that connects owners with renters. Whether you're looking to rent out your underutilized assets or searching for something to borrow, RentItRight provides a secure, seamless, and intuitive experience.

---

## 🚀 Key Features

### 🔐 Secure Authentication & Security
- **OAuth Integration:** Seamless sign-in with Google OAuth.
- **OTP Verification:** Enhanced security for user registration and identity verification.
- **CSRF Protection:** Secure frontend-backend communication with CSRF tokens.
- **Session Management:** Robust auth flows with JWT and cookie-based sessions.
- **Security Best Practices:** Implemented using Helmet, XSS protection, and Rate Limiting.

### 💳 Payments & Transactions
- **Razorpay Integration:** Secure and reliable payment processing for rentals.

### 👤 User Dashboards
- **Admin Dashboard:** Comprehensive platform management, including user moderation, listing oversight, and booking management.
- **Owner Dashboard:** Manage your listings, track earnings, and view rental statistics.
- **Renter Dashboard:** Easily browse available items, manage bookings, and view rental history.

### 🔎 Exploration & Search
- **Advanced Search:** Powered by **Elasticsearch** for lightning-fast and relevant results.
- **Filters:** Narrow down items by category, price range, and availability.
- **Dynamic Explore Page:** Browse all available listings in a beautiful, responsive grid layout.

### 📦 Item Management
- **Image Uploads:** Seamlessly upload item photos via Cloudinary.
- **Dynamic Forms:** Easy-to-use interface for owners to list new items with detailed specifications.

### 🛠️ Background Processing & Notifications
- **Email Notifications:** Automated emails for bookings and updates using Nodemailer.
- **Job Queues:** Reliable background task processing (like sending emails) using BullMQ and Redis.
- **Scheduled Tasks:** Cron jobs via `node-cron` for periodic maintenance and updates.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS & Material UI (MUI)
- **Icons:** Lucide React & React Icons
- **Date Handling:** `date-fns`, `dayjs`, `react-date-range`
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Cache & Queues:** Redis (via ioredis) & BullMQ (with Bull Board UI)
- **Search Engine:** Elasticsearch
- **Payments:** Razorpay
- **Emails:** Nodemailer
- **Monitoring:** Sentry
- **API Documentation:** Swagger UI

---

## 📁 Project Structure

```text
RentItRight/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components for different pages
│   │   ├── pages/          # Application views (Owner/Renter Dashboards, Home)
│   │   ├── hooks/          # Custom React hooks for logic reuse
│   │   ├── layouts/        # Common layouts
│   │   └── assets/         # Static assets like images and global styles
│   └── package.json        # Frontend dependencies
├── backend/                # Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/    # API request handlers
│   │   ├── models/         # MongoDB schemas & models
│   │   ├── routes/         # Route definitions
│   │   ├── middleware/     # Auth, security, and rate limiting
│   │   ├── services/       # External services (Elasticsearch, Sentry, Booking)
│   │   ├── utils/          # Utility functions (e.g., SendEmails)
│   │   └── workers/        # Background task processing (BullMQ Email Workers)
│   ├── types/              # Global TypeScript types
│   ├── docker-compose.yml  # Containerized infrastructure (DBs, Redis)
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis (required for BullMQ background tasks)
- Elasticsearch (optional for local search features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Himanshu931/RentItRight.git
   cd RentItRight
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file based on example.env and add necessary keys (Razorpay, Google OAuth, etc.)
   npm run dev
   ```

---

## 📝 API Documentation
Once the backend is running, you can access the interactive API documentation at:
`http://localhost:3000/swagger`

## 📊 Queue Management
Bull Board UI is available for monitoring background tasks (e.g., email queues).
