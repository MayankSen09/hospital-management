const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// For Vercel deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../build', 'index.html'));
    }
  });
}
const JWT_SECRET = 'hospital_management_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace with real database in production)
let patients = [
  {
    id: '1',
    patientId: 'HMS-2024-001234',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    phone: '+91-9876543210',
    email: 'john.smith@email.com',
    address: '123 Main Street, Mumbai, Maharashtra',
    emergencyContact: '+91-9876543211',
    bloodGroup: 'O+',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    patientId: 'HMS-2024-001235',
    name: 'Emma Johnson',
    age: 32,
    gender: 'Female',
    phone: '+91-9876543212',
    email: 'emma.johnson@email.com',
    address: '456 Park Avenue, Delhi, Delhi',
    emergencyContact: '+91-9876543213',
    bloodGroup: 'A+',
    status: 'Admitted',
    createdAt: new Date().toISOString(),
  }
];

let appointments = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '1',
    doctorName: 'Dr. Sarah Wilson',
    date: '2024-01-22',
    time: '09:00',
    type: 'Consultation',
    status: 'Confirmed',
    notes: 'Regular checkup',
    createdAt: new Date().toISOString(),
  }
];

let doctors = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiology',
    phone: '+91-9876543220',
    email: 'sarah.wilson@hospital.com',
    experience: 15,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Dr. Michael Brown',
    specialization: 'Neurology',
    phone: '+91-9876543221',
    email: 'michael.brown@hospital.com',
    experience: 12,
    status: 'Active',
  }
];

let medicines = [
  {
    id: '1',
    name: 'Paracetamol',
    category: 'Pain Relief',
    stock: 500,
    price: 25,
    expiryDate: '2025-12-31',
    manufacturer: 'ABC Pharma',
  },
  {
    id: '2',
    name: 'Amoxicillin',
    category: 'Antibiotic',
    stock: 200,
    price: 150,
    expiryDate: '2025-06-30',
    manufacturer: 'XYZ Pharma',
  }
];

let labTests = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    testName: 'Blood Test',
    testType: 'Blood',
    status: 'Completed',
    result: 'Normal',
    orderedBy: 'Dr. Sarah Wilson',
    date: '2024-01-20',
  }
];

let wards = [
  {
    id: '1',
    name: 'ICU',
    totalBeds: 10,
    occupiedBeds: 8,
    availableBeds: 2,
  },
  {
    id: '2',
    name: 'General Ward',
    totalBeds: 25,
    occupiedBeds: 15,
    availableBeds: 10,
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Demo login
  if (email === 'admin@hospital.com' && password === 'admin123') {
    const user = {
      id: '1',
      name: 'Dr. Admin',
      email: 'admin@hospital.com',
      role: 'admin',
    };
    
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Patient Routes
app.get('/api/patients', authenticateToken, (req, res) => {
  res.json(patients);
});

app.post('/api/patients', authenticateToken, (req, res) => {
  const newPatient = {
    id: uuidv4(),
    patientId: `HMS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    ...req.body,
    status: 'Active',
    createdAt: new Date().toISOString(),
  };
  
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

app.put('/api/patients/:id', authenticateToken, (req, res) => {
  const patientIndex = patients.findIndex(p => p.id === req.params.id);
  if (patientIndex === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  
  patients[patientIndex] = { ...patients[patientIndex], ...req.body };
  res.json(patients[patientIndex]);
});

// Appointment Routes
app.get('/api/appointments', authenticateToken, (req, res) => {
  res.json(appointments);
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  const newAppointment = {
    id: uuidv4(),
    ...req.body,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  };
  
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

// Doctor Routes
app.get('/api/doctors', authenticateToken, (req, res) => {
  res.json(doctors);
});

app.post('/api/doctors', authenticateToken, (req, res) => {
  const newDoctor = {
    id: uuidv4(),
    ...req.body,
    status: 'Active',
    createdAt: new Date().toISOString(),
  };
  
  doctors.push(newDoctor);
  res.status(201).json(newDoctor);
});

// Pharmacy Routes
app.get('/api/medicines', authenticateToken, (req, res) => {
  res.json(medicines);
});

app.post('/api/medicines', authenticateToken, (req, res) => {
  const newMedicine = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  
  medicines.push(newMedicine);
  res.status(201).json(newMedicine);
});

// Lab Routes
app.get('/api/lab-tests', authenticateToken, (req, res) => {
  res.json(labTests);
});

app.post('/api/lab-tests', authenticateToken, (req, res) => {
  const newTest = {
    id: uuidv4(),
    ...req.body,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  
  labTests.push(newTest);
  res.status(201).json(newTest);
});

// Ward Routes
app.get('/api/wards', authenticateToken, (req, res) => {
  res.json(wards);
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {
    totalPatients: patients.length,
    todayAppointments: appointments.length,
    availableBeds: wards.reduce((sum, ward) => sum + ward.availableBeds, 0),
    totalBeds: wards.reduce((sum, ward) => sum + ward.totalBeds, 0),
    revenue: 2000, // Mock revenue
  };
  
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Hospital Management System Backend running on port ${PORT}`);
});
