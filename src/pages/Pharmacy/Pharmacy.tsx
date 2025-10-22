import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  LocalPharmacy,
  Warning,
  CheckCircle,
  Error,
  Inventory,
  Receipt,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setMedicines, addMedicine, updateMedicine, deleteMedicine, setPrescriptions, addPrescription, updatePrescription, deletePrescription } from '../../store/slices/pharmacySlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pharmacy-tabpanel-${index}`}
      aria-labelledby={`pharmacy-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Pharmacy: React.FC = () => {
  const dispatch = useAppDispatch();
  const { medicines, prescriptions } = useAppSelector((state) => state.pharmacy);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [addMedicineOpen, setAddMedicineOpen] = useState(false);
  const [addPrescriptionOpen, setAddPrescriptionOpen] = useState(false);
  const [editMedicineOpen, setEditMedicineOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    category: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    quantity: '',
    unitPrice: '',
    minStockLevel: '',
    description: '',
  });

  useEffect(() => {
    // Initialize with sample data
    if (medicines.length === 0) {
      const sampleMedicines = [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          category: 'Analgesic',
          manufacturer: 'Cipla Ltd',
          batchNumber: 'PCM001',
          expiryDate: '2025-12-31',
          quantity: 500,
          unitPrice: 2.50,
          minStockLevel: 100,
          description: 'Pain relief and fever reducer',
          status: 'Available' as const,
        },
        {
          id: '2',
          name: 'Amoxicillin 250mg',
          category: 'Antibiotic',
          manufacturer: 'Sun Pharma',
          batchNumber: 'AMX002',
          expiryDate: '2025-06-30',
          quantity: 50,
          unitPrice: 15.00,
          minStockLevel: 100,
          description: 'Broad-spectrum antibiotic',
          status: 'Low Stock' as const,
        },
        {
          id: '3',
          name: 'Insulin Glargine',
          category: 'Antidiabetic',
          manufacturer: 'Novo Nordisk',
          batchNumber: 'INS003',
          expiryDate: '2024-03-15',
          quantity: 0,
          unitPrice: 450.00,
          minStockLevel: 20,
          description: 'Long-acting insulin',
          status: 'Out of Stock' as const,
        },
      ];
      dispatch(setMedicines(sampleMedicines));
    }

    if (prescriptions.length === 0) {
      const samplePrescriptions = [
        {
          id: '1',
          patientId: '1',
          patientName: 'John Smith',
          doctorId: '1',
          doctorName: 'Dr. Sarah Wilson',
          medicines: [
            {
              medicineId: '1',
              medicineName: 'Paracetamol 500mg',
              dosage: '500mg',
              frequency: 'Twice daily',
              duration: '5 days',
              quantity: 10,
            },
          ],
          status: 'Pending' as const,
          prescriptionDate: '2024-01-22',
          totalAmount: 25.00,
        },
      ];
      dispatch(setPrescriptions(samplePrescriptions));
    }
  }, [dispatch, medicines.length, prescriptions.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      case 'Expired':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle />;
      case 'Low Stock':
        return <Warning />;
      case 'Out of Stock':
        return <Error />;
      case 'Expired':
        return <Error />;
      default:
        return <CheckCircle />;
    }
  };

  const handleMedicineFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setMedicineForm({ ...medicineForm, [field]: event.target.value });
  };

  const handleAddMedicine = () => {
    const quantity = parseInt(medicineForm.quantity);
    const minStock = parseInt(medicineForm.minStockLevel);
    
    let status: 'Available' | 'Low Stock' | 'Out of Stock' | 'Expired' = 'Available';
    if (quantity === 0) {
      status = 'Out of Stock';
    } else if (quantity <= minStock) {
      status = 'Low Stock';
    }

    const newMedicine = {
      id: Date.now().toString(),
      name: medicineForm.name,
      category: medicineForm.category,
      manufacturer: medicineForm.manufacturer,
      batchNumber: medicineForm.batchNumber,
      expiryDate: medicineForm.expiryDate,
      quantity: quantity,
      unitPrice: parseFloat(medicineForm.unitPrice),
      minStockLevel: minStock,
      description: medicineForm.description,
      status: status,
    };

    dispatch(addMedicine(newMedicine));
    resetMedicineForm();
    setAddMedicineOpen(false);
  };

  const resetMedicineForm = () => {
    setMedicineForm({
      name: '',
      category: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: '',
      quantity: '',
      unitPrice: '',
      minStockLevel: '',
      description: '',
    });
  };

  const handleEditMedicine = (medicine: any) => {
    setSelectedMedicine(medicine);
    setMedicineForm({
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      batchNumber: medicine.batchNumber,
      expiryDate: medicine.expiryDate,
      quantity: medicine.quantity.toString(),
      unitPrice: medicine.unitPrice.toString(),
      minStockLevel: medicine.minStockLevel.toString(),
      description: medicine.description,
    });
    setEditMedicineOpen(true);
  };

  const handleUpdateMedicine = () => {
    const quantity = parseInt(medicineForm.quantity);
    const minStock = parseInt(medicineForm.minStockLevel);
    
    let status: 'Available' | 'Low Stock' | 'Out of Stock' | 'Expired' = 'Available';
    if (quantity === 0) {
      status = 'Out of Stock';
    } else if (quantity <= minStock) {
      status = 'Low Stock';
    }

    const updatedMedicine = {
      ...selectedMedicine,
      name: medicineForm.name,
      category: medicineForm.category,
      manufacturer: medicineForm.manufacturer,
      batchNumber: medicineForm.batchNumber,
      expiryDate: medicineForm.expiryDate,
      quantity: quantity,
      unitPrice: parseFloat(medicineForm.unitPrice),
      minStockLevel: minStock,
      description: medicineForm.description,
      status: status,
    };

    dispatch(updateMedicine(updatedMedicine));
    resetMedicineForm();
    setEditMedicineOpen(false);
    setSelectedMedicine(null);
  };

  const handleDeleteMedicine = (medicine: any) => {
    setSelectedMedicine(medicine);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMedicine) {
      dispatch(deleteMedicine(selectedMedicine.id));
    }
    setDeleteConfirmOpen(false);
    setSelectedMedicine(null);
  };

  const handleDispensePrescription = (prescription: any) => {
    const updatedPrescription = {
      ...prescription,
      status: 'Dispensed' as const,
      dispensedDate: new Date().toISOString().split('T')[0],
    };
    dispatch(updatePrescription(updatedPrescription));
  };

  const handleDeletePrescription = (prescriptionId: string) => {
    dispatch(deletePrescription(prescriptionId));
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = medicines.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock').length;
  const totalValue = medicines.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Pharmacy Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => setAddMedicineOpen(true)}
        >
          Add Medicine
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Medicines
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {medicines.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <LocalPharmacy />
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
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {lowStockCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <Warning />
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
                    Inventory Value
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    ₹{totalValue.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <Inventory />
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
                    Prescriptions
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {prescriptions.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <Receipt />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>{lowStockCount}</strong> medicine(s) are running low on stock. Please reorder soon.
        </Alert>
      )}

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Medicine Inventory" />
            <Tab label="Prescriptions" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search medicines by name or category..."
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
                  <TableCell>Medicine</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Batch No.</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <LocalPharmacy />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {medicine.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {medicine.manufacturer}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>{medicine.batchNumber}</TableCell>
                    <TableCell>{medicine.expiryDate}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>₹{medicine.unitPrice}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(medicine.status)}
                        label={medicine.status}
                        size="small"
                        color={getStatusColor(medicine.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditMedicine(medicine)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteMedicine(medicine)}
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Medicines</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id} hover>
                    <TableCell>{prescription.patientName}</TableCell>
                    <TableCell>{prescription.doctorName}</TableCell>
                    <TableCell>
                      {prescription.medicines.map((med, index) => (
                        <Typography key={index} variant="body2">
                          {med.medicineName} ({med.quantity})
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>{prescription.prescriptionDate}</TableCell>
                    <TableCell>₹{prescription.totalAmount}</TableCell>
                    <TableCell>
                      <Chip
                        label={prescription.status}
                        size="small"
                        color={prescription.status === 'Dispensed' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="contained"
                          disabled={prescription.status === 'Dispensed'}
                          onClick={() => handleDispensePrescription(prescription)}
                        >
                          {prescription.status === 'Dispensed' ? 'Dispensed' : 'Dispense'}
                        </Button>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeletePrescription(prescription.id)}
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
        </TabPanel>
      </Card>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddMedicineOpen(true)}
      >
        <Add />
      </Fab>

      {/* Add Medicine Dialog */}
      <Dialog open={addMedicineOpen} onClose={() => setAddMedicineOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Medicine</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Medicine Name"
                  value={medicineForm.name}
                  onChange={handleMedicineFormChange('name')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={medicineForm.category}
                  onChange={handleMedicineFormChange('category')}
                  required
                >
                  <MenuItem value="Analgesic">Analgesic</MenuItem>
                  <MenuItem value="Antibiotic">Antibiotic</MenuItem>
                  <MenuItem value="Antidiabetic">Antidiabetic</MenuItem>
                  <MenuItem value="Cardiovascular">Cardiovascular</MenuItem>
                  <MenuItem value="Respiratory">Respiratory</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  value={medicineForm.manufacturer}
                  onChange={handleMedicineFormChange('manufacturer')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Batch Number"
                  value={medicineForm.batchNumber}
                  onChange={handleMedicineFormChange('batchNumber')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  type="date"
                  value={medicineForm.expiryDate}
                  onChange={handleMedicineFormChange('expiryDate')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={medicineForm.quantity}
                  onChange={handleMedicineFormChange('quantity')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit Price (₹)"
                  type="number"
                  value={medicineForm.unitPrice}
                  onChange={handleMedicineFormChange('unitPrice')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Stock Level"
                  type="number"
                  value={medicineForm.minStockLevel}
                  onChange={handleMedicineFormChange('minStockLevel')}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={medicineForm.description}
                  onChange={handleMedicineFormChange('description')}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMedicineOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMedicine} variant="contained">
            Add Medicine
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Medicine Dialog */}
      <Dialog open={editMedicineOpen} onClose={() => setEditMedicineOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Medicine</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Medicine Name"
                  value={medicineForm.name}
                  onChange={handleMedicineFormChange('name')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={medicineForm.category}
                  onChange={handleMedicineFormChange('category')}
                  required
                >
                  <MenuItem value="Analgesic">Analgesic</MenuItem>
                  <MenuItem value="Antibiotic">Antibiotic</MenuItem>
                  <MenuItem value="Antidiabetic">Antidiabetic</MenuItem>
                  <MenuItem value="Cardiovascular">Cardiovascular</MenuItem>
                  <MenuItem value="Respiratory">Respiratory</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  value={medicineForm.manufacturer}
                  onChange={handleMedicineFormChange('manufacturer')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Batch Number"
                  value={medicineForm.batchNumber}
                  onChange={handleMedicineFormChange('batchNumber')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  type="date"
                  value={medicineForm.expiryDate}
                  onChange={handleMedicineFormChange('expiryDate')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={medicineForm.quantity}
                  onChange={handleMedicineFormChange('quantity')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit Price (₹)"
                  type="number"
                  value={medicineForm.unitPrice}
                  onChange={handleMedicineFormChange('unitPrice')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Stock Level"
                  type="number"
                  value={medicineForm.minStockLevel}
                  onChange={handleMedicineFormChange('minStockLevel')}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={medicineForm.description}
                  onChange={handleMedicineFormChange('description')}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMedicineOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateMedicine} variant="contained">
            Update Medicine
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedMedicine?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pharmacy;