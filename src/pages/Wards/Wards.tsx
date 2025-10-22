import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Hotel,
  Person,
  PersonAdd,
  PersonRemove,
  LocalHospital,
  Bed,
  Assignment,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';

interface Bed {
  id: string;
  bedNumber: string;
  wardId: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
  bedType: 'General' | 'ICU' | 'Private' | 'Semi-Private';
}

interface Ward {
  id: string;
  name: string;
  type: 'General' | 'ICU' | 'Emergency' | 'Maternity' | 'Pediatric' | 'Surgery';
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  maintenanceBeds: number;
  beds: Bed[];
}

const Wards: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [admitPatientOpen, setAdmitPatientOpen] = useState(false);
  const [dischargePatientOpen, setDischargePatientOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [patientForm, setPatientForm] = useState({
    patientName: '',
    patientId: '',
    admissionReason: '',
    doctorName: '',
  });

  useEffect(() => {
    // Initialize with sample ward data
    const sampleWards: Ward[] = [
      {
        id: '1',
        name: 'General Ward A',
        type: 'General',
        totalBeds: 20,
        occupiedBeds: 15,
        availableBeds: 4,
        maintenanceBeds: 1,
        beds: Array.from({ length: 20 }, (_, i) => ({
          id: `bed-1-${i + 1}`,
          bedNumber: `A${i + 1}`,
          wardId: '1',
          status: i < 15 ? 'Occupied' : i === 19 ? 'Maintenance' : 'Available',
          patientId: i < 15 ? `patient-${i + 1}` : undefined,
          patientName: i < 15 ? `Patient ${i + 1}` : undefined,
          admissionDate: i < 15 ? '2024-01-20' : undefined,
          bedType: 'General',
        })),
      },
      {
        id: '2',
        name: 'ICU',
        type: 'ICU',
        totalBeds: 10,
        occupiedBeds: 8,
        availableBeds: 2,
        maintenanceBeds: 0,
        beds: Array.from({ length: 10 }, (_, i) => ({
          id: `bed-2-${i + 1}`,
          bedNumber: `ICU${i + 1}`,
          wardId: '2',
          status: i < 8 ? 'Occupied' : 'Available',
          patientId: i < 8 ? `icu-patient-${i + 1}` : undefined,
          patientName: i < 8 ? `ICU Patient ${i + 1}` : undefined,
          admissionDate: i < 8 ? '2024-01-21' : undefined,
          bedType: 'ICU',
        })),
      },
      {
        id: '3',
        name: 'Emergency Ward',
        type: 'Emergency',
        totalBeds: 15,
        occupiedBeds: 4,
        availableBeds: 11,
        maintenanceBeds: 0,
        beds: Array.from({ length: 15 }, (_, i) => ({
          id: `bed-3-${i + 1}`,
          bedNumber: `ER${i + 1}`,
          wardId: '3',
          status: i < 4 ? 'Occupied' : 'Available',
          patientId: i < 4 ? `er-patient-${i + 1}` : undefined,
          patientName: i < 4 ? `Emergency Patient ${i + 1}` : undefined,
          admissionDate: i < 4 ? '2024-01-22' : undefined,
          bedType: 'General',
        })),
      },
      {
        id: '4',
        name: 'Private Rooms',
        type: 'General',
        totalBeds: 8,
        occupiedBeds: 6,
        availableBeds: 2,
        maintenanceBeds: 0,
        beds: Array.from({ length: 8 }, (_, i) => ({
          id: `bed-4-${i + 1}`,
          bedNumber: `PVT${i + 1}`,
          wardId: '4',
          status: i < 6 ? 'Occupied' : 'Available',
          patientId: i < 6 ? `pvt-patient-${i + 1}` : undefined,
          patientName: i < 6 ? `Private Patient ${i + 1}` : undefined,
          admissionDate: i < 6 ? '2024-01-19' : undefined,
          bedType: 'Private',
        })),
      },
    ];
    setWards(sampleWards);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Occupied':
        return 'error';
      case 'Maintenance':
        return 'warning';
      case 'Reserved':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle />;
      case 'Occupied':
        return <Person />;
      case 'Maintenance':
        return <Warning />;
      case 'Reserved':
        return <Assignment />;
      default:
        return <Bed />;
    }
  };

  const getWardTypeColor = (type: string) => {
    switch (type) {
      case 'ICU':
        return 'error';
      case 'Emergency':
        return 'warning';
      case 'General':
        return 'primary';
      case 'Maternity':
        return 'secondary';
      case 'Pediatric':
        return 'info';
      case 'Surgery':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleAdmitPatient = (bed: Bed) => {
    setSelectedBed(bed);
    setAdmitPatientOpen(true);
  };

  const handleDischargePatient = (bed: Bed) => {
    setSelectedBed(bed);
    setDischargePatientOpen(true);
  };

  const confirmAdmission = () => {
    if (selectedBed && patientForm.patientName) {
      setWards(prevWards =>
        prevWards.map(ward =>
          ward.id === selectedBed.wardId
            ? {
                ...ward,
                occupiedBeds: ward.occupiedBeds + 1,
                availableBeds: ward.availableBeds - 1,
                beds: ward.beds.map(bed =>
                  bed.id === selectedBed.id
                    ? {
                        ...bed,
                        status: 'Occupied' as const,
                        patientId: Date.now().toString(),
                        patientName: patientForm.patientName,
                        admissionDate: new Date().toISOString().split('T')[0],
                      }
                    : bed
                ),
              }
            : ward
        )
      );
      setAdmitPatientOpen(false);
      setPatientForm({ patientName: '', patientId: '', admissionReason: '', doctorName: '' });
      setSelectedBed(null);
    }
  };

  const confirmDischarge = () => {
    if (selectedBed) {
      setWards(prevWards =>
        prevWards.map(ward =>
          ward.id === selectedBed.wardId
            ? {
                ...ward,
                occupiedBeds: ward.occupiedBeds - 1,
                availableBeds: ward.availableBeds + 1,
                beds: ward.beds.map(bed =>
                  bed.id === selectedBed.id
                    ? {
                        ...bed,
                        status: 'Available' as const,
                        patientId: undefined,
                        patientName: undefined,
                        admissionDate: undefined,
                      }
                    : bed
                ),
              }
            : ward
        )
      );
      setDischargePatientOpen(false);
      setSelectedBed(null);
    }
  };

  const totalBeds = wards.reduce((sum, ward) => sum + ward.totalBeds, 0);
  const totalOccupied = wards.reduce((sum, ward) => sum + ward.occupiedBeds, 0);
  const totalAvailable = wards.reduce((sum, ward) => sum + ward.availableBeds, 0);
  const occupancyRate = totalBeds > 0 ? (totalOccupied / totalBeds) * 100 : 0;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Ward & Bed Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Beds
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {totalBeds}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Hotel />
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
                    Occupied Beds
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {totalOccupied}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                  <Person />
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
                    Available Beds
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {totalAvailable}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <CheckCircle />
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
                    Occupancy Rate
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {occupancyRate.toFixed(1)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <LocalHospital />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ward Cards */}
      <Grid container spacing={3}>
        {wards.map((ward) => (
          <Grid item xs={12} md={6} key={ward.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    {ward.name}
                  </Typography>
                  <Chip
                    label={ward.type}
                    color={getWardTypeColor(ward.type) as any}
                    variant="outlined"
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h6">{ward.totalBeds}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Occupied
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {ward.occupiedBeds}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Available
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {ward.availableBeds}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Maintenance
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {ward.maintenanceBeds}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Occupancy: {((ward.occupiedBeds / ward.totalBeds) * 100).toFixed(1)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(ward.occupiedBeds / ward.totalBeds) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                    color={ward.occupiedBeds / ward.totalBeds > 0.8 ? 'error' : 'primary'}
                  />
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setSelectedWard(ward)}
                >
                  View Bed Layout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ward Detail Dialog */}
      <Dialog open={!!selectedWard} onClose={() => setSelectedWard(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedWard?.name} - Bed Layout
        </DialogTitle>
        <DialogContent>
          {selectedWard && (
            <Box>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {selectedWard.beds.map((bed) => (
                  <Grid item xs={6} sm={4} md={3} key={bed.id}>
                    <Card
                      sx={{
                        minHeight: 120,
                        cursor: 'pointer',
                        border: 2,
                        borderColor: bed.status === 'Available' ? 'success.main' : 
                                   bed.status === 'Occupied' ? 'error.main' : 
                                   bed.status === 'Maintenance' ? 'warning.main' : 'info.main',
                        '&:hover': { boxShadow: 3 },
                      }}
                      onClick={() => {
                        if (bed.status === 'Available') {
                          handleAdmitPatient(bed);
                        } else if (bed.status === 'Occupied') {
                          handleDischargePatient(bed);
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${getStatusColor(bed.status)}.light`,
                            color: `${getStatusColor(bed.status)}.main`,
                            mx: 'auto',
                            mb: 1,
                          }}
                        >
                          {getStatusIcon(bed.status)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {bed.bedNumber}
                        </Typography>
                        <Chip
                          label={bed.status}
                          size="small"
                          color={getStatusColor(bed.status) as any}
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                        {bed.patientName && (
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            {bed.patientName}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedWard(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Admit Patient Dialog */}
      <Dialog open={admitPatientOpen} onClose={() => setAdmitPatientOpen(false)}>
        <DialogTitle>Admit Patient to {selectedBed?.bedNumber}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Patient Name"
              value={patientForm.patientName}
              onChange={(e) => setPatientForm({ ...patientForm, patientName: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Patient ID"
              value={patientForm.patientId}
              onChange={(e) => setPatientForm({ ...patientForm, patientId: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Admission Reason"
              value={patientForm.admissionReason}
              onChange={(e) => setPatientForm({ ...patientForm, admissionReason: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Attending Doctor"
              value={patientForm.doctorName}
              onChange={(e) => setPatientForm({ ...patientForm, doctorName: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdmitPatientOpen(false)}>Cancel</Button>
          <Button onClick={confirmAdmission} variant="contained">
            Admit Patient
          </Button>
        </DialogActions>
      </Dialog>

      {/* Discharge Patient Dialog */}
      <Dialog open={dischargePatientOpen} onClose={() => setDischargePatientOpen(false)}>
        <DialogTitle>Discharge Patient</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to discharge {selectedBed?.patientName} from bed {selectedBed?.bedNumber}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDischargePatientOpen(false)}>Cancel</Button>
          <Button onClick={confirmDischarge} variant="contained" color="error">
            Discharge Patient
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wards;