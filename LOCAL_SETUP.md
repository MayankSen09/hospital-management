# Hospital Management System - Local Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Quick Start (2 Steps)

### Step 1: Start Backend Server
Open a terminal and run:
```bash
cd backend
npm start
```
Backend will run on: http://localhost:5000

### Step 2: Start Frontend (Open NEW terminal)
```bash
npm start
```
Frontend will run on: http://localhost:3000

## Login Credentials
- **Email**: admin@hospital.com
- **Password**: admin123

## What You Can Do
✅ Manage Patients
✅ Schedule Appointments
✅ Track Doctors
✅ Manage Pharmacy Inventory
✅ Laboratory Tests
✅ Billing & Invoices
✅ Ward Management
✅ Staff Management
✅ Generate Reports

## Troubleshooting

### Backend won't start?
```bash
cd backend
npm install
npm start
```

### Frontend won't start?
```bash
npm install
npm start
```

### Port already in use?
- Backend: Change PORT in backend/server.js (line 8)
- Frontend: It will ask to use different port automatically

## Project Structure
```
hospital-management-system/
├── backend/              # Node.js Express API
│   ├── server.js        # Main backend file
│   └── package.json
├── src/                 # React Frontend
│   ├── pages/          # All pages
│   ├── components/     # Reusable components
│   └── store/          # Redux state management
└── package.json        # Frontend dependencies
```

## Features
- 🔐 JWT Authentication
- 📊 Dashboard with Statistics
- 👥 Patient Management
- 📅 Appointment Scheduling
- 💊 Pharmacy Inventory
- 🧪 Laboratory Tests
- 💰 Billing System (INR)
- 🏥 Ward & Bed Management
- 👨‍⚕️ Staff Management
- 📈 Reports & Analytics

## Need Help?
Check the full documentation in the `docs/` folder.
