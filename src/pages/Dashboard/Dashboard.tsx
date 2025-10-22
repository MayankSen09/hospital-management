import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  People,
  CalendarToday,
  LocalHospital,
  TrendingUp,
  Hotel,
  LocalPharmacy,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddPatientDialog from '../../components/common/AddPatientDialog';
import AddAppointmentDialog from '../../components/common/AddAppointmentDialog';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);
  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      change: '+12%',
      icon: <People />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      title: 'Today\'s Appointments',
      value: '45',
      change: '+8%',
      icon: <CalendarToday />,
      color: '#388e3c',
      bgColor: '#e8f5e8',
    },
    {
      title: 'Available Beds',
      value: '23/50',
      change: '-5%',
      icon: <Hotel />,
      color: '#f57c00',
      bgColor: '#fff3e0',
    },
    {
      title: 'Revenue (Month)',
      value: '₹4,56,780',
      change: '+15%',
      icon: <TrendingUp />,
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
    },
  ];

  const recentAppointments = [
    {
      id: 1,
      patient: 'John Smith',
      doctor: 'Dr. Sarah Wilson',
      time: '09:00 AM',
      type: 'Consultation',
      status: 'Confirmed',
    },
    {
      id: 2,
      patient: 'Emma Johnson',
      doctor: 'Dr. Michael Brown',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'Scheduled',
    },
    {
      id: 3,
      patient: 'Robert Davis',
      doctor: 'Dr. Lisa Anderson',
      time: '02:00 PM',
      type: 'Emergency',
      status: 'Urgent',
    },
    {
      id: 4,
      patient: 'Maria Garcia',
      doctor: 'Dr. James Miller',
      time: '03:30 PM',
      type: 'Surgery',
      status: 'Confirmed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Scheduled':
        return 'info';
      case 'Urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Chip
                      label={stat.change}
                      size="small"
                      color={stat.change.startsWith('+') ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Appointments */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Today's Appointments
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAppointments.map((appointment) => (
                      <TableRow key={appointment.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              {appointment.patient.charAt(0)}
                            </Avatar>
                            {appointment.patient}
                          </Box>
                        </TableCell>
                        <TableCell>{appointment.doctor}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            size="small"
                            color={getStatusColor(appointment.status) as any}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    Bed Occupancy
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">ICU</Typography>
                      <Typography variant="body2">8/10</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={80} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">General Ward</Typography>
                      <Typography variant="body2">15/25</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Emergency</Typography>
                      <Typography variant="body2">4/15</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={27} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip
                      icon={<People />}
                      label="Register New Patient"
                      clickable
                      color="primary"
                      variant="outlined"
                      onClick={() => setAddPatientOpen(true)}
                    />
                    <Chip
                      icon={<CalendarToday />}
                      label="Schedule Appointment"
                      clickable
                      color="primary"
                      variant="outlined"
                      onClick={() => setAddAppointmentOpen(true)}
                    />
                    <Chip
                      icon={<LocalHospital />}
                      label="Emergency Admission"
                      clickable
                      color="error"
                      variant="outlined"
                      onClick={() => navigate('/patients')}
                    />
                    <Chip
                      icon={<LocalPharmacy />}
                      label="Pharmacy Orders"
                      clickable
                      color="primary"
                      variant="outlined"
                      onClick={() => navigate('/pharmacy')}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <AddPatientDialog 
        open={addPatientOpen} 
        onClose={() => setAddPatientOpen(false)} 
      />
      <AddAppointmentDialog 
        open={addAppointmentOpen} 
        onClose={() => setAddAppointmentOpen(false)} 
      />
    </Box>
  );
};

export default Dashboard;