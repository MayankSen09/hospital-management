// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Vercel serverless functions
  : 'http://localhost:5000/api';  // Local development

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  
  // Patients
  PATIENTS: `${API_BASE_URL}/patients`,
  
  // Appointments
  APPOINTMENTS: `${API_BASE_URL}/appointments`,
  
  // Doctors
  DOCTORS: `${API_BASE_URL}/doctors`,
  
  // Pharmacy
  MEDICINES: `${API_BASE_URL}/medicines`,
  
  // Laboratory
  LAB_TESTS: `${API_BASE_URL}/lab-tests`,
  
  // Wards
  WARDS: `${API_BASE_URL}/wards`,
  
  // Dashboard
  DASHBOARD_STATS: `${API_BASE_URL}/dashboard/stats`,
};

export default API_BASE_URL;