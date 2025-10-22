import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Fab,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Edit, Delete, CalendarToday } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setAppointments, updateAppointment, deleteAppointment } from '../../store/slices/appointmentsSlice';
import AddAppointmentDialog from '../../components/common/AddAppointmentDialog';

const Appointments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { appointments } = useAppSelector((state) => state.appointments);
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    // Initialize with sample data if empty
    if (appointments.length === 0) {
      const sampleAppointments = [
        {
          id: '1',
          patientId: '1',
          patientName: 'John Smith',
          doctorId: '1',
          doctorName: 'Dr. Sarah Wilson',
          date: '2024-01-22',
          time: '09:00 AM',
          type: 'Consultation' as const,
          status: 'Confirmed' as const,
          notes: 'Regular checkup',
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Emma Johnson',
          doctorId: '2',
          doctorName: 'Dr. Michael Brown',
          date: '2024-01-22',
          time: '10:30 AM',
          type: 'Follow-up' as const,
          status: 'Scheduled' as const,
          notes: 'Post-surgery follow-up',
        },
        {
          id: '3',
          patientId: '3',
          patientName: 'Robert Davis',
          doctorId: '3',
          doctorName: 'Dr. Lisa Anderson',
          date: '2024-01-22',
          time: '02:00 PM',
          type: 'Emergency' as const,
          status: 'Urgent' as const,
          notes: 'Chest pain complaint',
        },
      ];
      dispatch(setAppointments(sampleAppointments));
    }
  }, [dispatch, appointments.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Scheduled':
        return 'info';
      case 'Urgent':
        return 'error';
      case 'Completed':
        return 'default';
      case 'Cancelled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Emergency':
        return 'error';
      case 'Surgery':
        return 'warning';
      case 'Follow-up':
        return 'info';
      default:
        return 'primary';
    }
  };

  const handleDeleteAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteAppointment = () => {
    if (selectedAppointment) {
      dispatch(deleteAppointment(selectedAppointment.id));
    }
    setDeleteConfirmOpen(false);
    setSelectedAppointment(null);
  };

  const handleCompleteAppointment = (appointment: any) => {
    const updatedAppointment = {
      ...appointment,
      status: 'Completed' as const,
    };
    dispatch(updateAppointment(updatedAppointment));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Appointment Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          size="large"
          onClick={() => setAddAppointmentOpen(true)}
        >
          Schedule Appointment
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Today's Appointments
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {appointments.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <CalendarToday />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Confirmed
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {appointments.filter(a => a.status === 'Confirmed').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <CalendarToday />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Pending
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {appointments.filter(a => a.status === 'Scheduled').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <CalendarToday />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Emergency
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {appointments.filter(a => a.status === 'Urgent').length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                  <CalendarToday />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {appointment.patientName.charAt(0)}
                        </Avatar>
                        {appointment.patientName}
                      </Box>
                    </TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.type}
                        size="small"
                        color={getTypeColor(appointment.type) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        size="small"
                        color={getStatusColor(appointment.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          color="success"
                          disabled={appointment.status === 'Completed'}
                          onClick={() => handleCompleteAppointment(appointment)}
                        >
                          {appointment.status === 'Completed' ? 'Done' : 'Complete'}
                        </Button>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteAppointment(appointment)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddAppointmentOpen(true)}
      >
        <Add />
      </Fab>

      <AddAppointmentDialog 
        open={addAppointmentOpen} 
        onClose={() => setAddAppointmentOpen(false)} 
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the appointment for "{selectedAppointment?.patientName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteAppointment} variant="contained" color="error">
            Delete Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointments;