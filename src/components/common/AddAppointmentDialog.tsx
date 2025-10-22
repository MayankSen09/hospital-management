import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
} from '@mui/material';
// Temporarily using regular text fields for date/time
import { useAppDispatch } from '../../hooks/redux';
import { addAppointment } from '../../store/slices/appointmentsSlice';

interface AddAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    type: '',
    notes: '',
  });

  const doctors = [
    'Dr. Sarah Wilson',
    'Dr. Michael Brown',
    'Dr. Lisa Anderson',
    'Dr. James Miller',
    'Dr. Emily Davis',
  ];

  const appointmentTypes = [
    'Consultation',
    'Follow-up',
    'Emergency',
    'Surgery',
    'Check-up',
  ];

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  // Removed date/time change handlers

  const handleSubmit = () => {
    const newAppointment = {
      id: Date.now().toString(),
      patientId: Date.now().toString(),
      patientName: formData.patientName,
      doctorId: Date.now().toString(),
      doctorName: formData.doctorName,
      date: formData.date,
      time: formData.time,
      type: formData.type as 'Consultation' | 'Follow-up' | 'Emergency' | 'Surgery',
      status: 'Scheduled' as const,
      notes: formData.notes,
    };

    dispatch(addAppointment(newAppointment));
    setFormData({
      patientName: '',
      doctorName: '',
      date: '',
      time: '',
      type: '',
      notes: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Schedule New Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Patient Name"
                  value={formData.patientName}
                  onChange={handleChange('patientName')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Doctor"
                  value={formData.doctorName}
                  onChange={handleChange('doctorName')}
                  required
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor} value={doctor}>
                      {doctor}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange('date')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange('time')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Appointment Type"
                  value={formData.type}
                  onChange={handleChange('type')}
                  required
                >
                  {appointmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange('notes')}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Schedule Appointment
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default AddAppointmentDialog;