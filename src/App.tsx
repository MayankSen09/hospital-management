import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Patients from './pages/Patients/Patients';
import Appointments from './pages/Appointments/Appointments';
import Doctors from './pages/Doctors/Doctors';
import Wards from './pages/Wards/Wards';
import Pharmacy from './pages/Pharmacy/Pharmacy';
import Laboratory from './pages/Laboratory/Laboratory';
import Billing from './pages/Billing/Billing';
import Staff from './pages/Staff/Staff';
import Reports from './pages/Reports/Reports';
import Login from './pages/Auth/Login';
import { useAppSelector } from './hooks/redux';

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/wards" element={<Wards />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/laboratory" element={<Laboratory />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;