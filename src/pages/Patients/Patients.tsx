import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { Search, Add, Edit, Visibility, Phone, Email, Delete } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setPatients, updatePatient, deletePatient } from '../../store/slices/patientsSlice';
import AddPatientDialog from '../../components/common/AddPatientDialog';

const Patients: React.FC = () => {
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [viewPatientOpen, setViewPatientOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    // Initialize with sample data if empty
    if (patients.length === 0) {
      const samplePatients = [
        {
          id: '1',
          patientId: 'HMS-2024-001234',
          name: 'John Smith',
          age: 45,
          gender: 'Male' as const,
          phone: '+91-9876543210',
          email: 'john.smith@email.com',
          address: '123 Main Street, Mumbai, Maharashtra',
          emergencyContact: '+91-9876543211',
          bloodGroup: 'O+',
          status: 'Active' as const,
        },
        {
          id: '2',
          patientId: 'HMS-2024-001235',
          name: 'Emma Johnson',
          age: 32,
          gender: 'Female' as const,
          phone: '+91-9876543212',
          email: 'emma.johnson@email.com',
          address: '456 Park Avenue, Delhi, Delhi',
          emergencyContact: '+91-9876543213',
          bloodGroup: 'A+',
          status: 'Admitted' as const,
        },
        {
          id: '3',
          patientId: 'HMS-2024-001236',
          name: 'Robert Davis',
          age: 67,
          gender: 'Male' as const,
          phone: '+91-9876543214',
          email: 'robert.davis@email.com',
          address: '789 Oak Street, Bangalore, Karnataka',
          emergencyContact: '+91-9876543215',
          bloodGroup: 'B+',
          status: 'Discharged' as const,
        },
      ];
      dispatch(setPatients(samplePatients));
    }
  }, [dispatch, patients.length]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setViewPatientOpen(true);
  };

  const handleDeletePatient = (patient: any) => {
    setSelectedPatient(patient);
    setDeleteConfirmOpen(true);
  };

  const confirmDeletePatient = () => {
    if (selectedPatient) {
      dispatch(deletePatient(selectedPatient.id));
    }
    setDeleteConfirmOpen(false);
    setSelectedPatient(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Admitted':
        return 'warning';
      case 'Discharged':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Patient Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          size="large"
          onClick={() => setAddPatientOpen(true)}
        >
          Add New Patient
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search patients by name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Patient ID</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Visit</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {patient.name.charAt(0)}
                        </Avatar>
                        {patient.name}
                      </Box>
                    </TableCell>
                    <TableCell>{patient.patientId}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={patient.status}
                        size="small"
                        color={getStatusColor(patient.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date().toISOString().split('T')[0]}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewPatient(patient)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeletePatient(patient)}
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
        onClick={() => setAddPatientOpen(true)}
      >
        <Add />
      </Fab>

      <AddPatientDialog 
        open={addPatientOpen} 
        onClose={() => setAddPatientOpen(false)} 
      />

      <Dialog 
        open={viewPatientOpen} 
        onClose={() => setViewPatientOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Patient ID
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPatient.patientId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPatient.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Age
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPatient.age} years
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Gender
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPatient.gender}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Blood Group
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPatient.bloodGroup}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedPatient.status}
                  size="small"
                  color={getStatusColor(selectedPatient.status) as any}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Phone fontSize="small" />
                  <Typography variant="body1">{selectedPatient.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Email fontSize="small" />
                  <Typography variant="body1">{selectedPatient.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPatient.address}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Emergency Contact
                </Typography>
                <Typography variant="body1">
                  {selectedPatient.emergencyContact}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPatientOpen(false)}>Close</Button>
          <Button variant="contained">Edit Patient</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete patient "{selectedPatient?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeletePatient} variant="contained" color="error">
            Delete Patient
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Patients;