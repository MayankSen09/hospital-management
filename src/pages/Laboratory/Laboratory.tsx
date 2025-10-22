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
  Science,
  Assignment,
  CheckCircle,
  Pending,
  Print,
  Visibility,
} from '@mui/icons-material';

interface LabTest {
  id: string;
  testCode: string;
  testName: string;
  category: string;
  price: number;
  normalRange: string;
  unit: string;
  description: string;
}

interface TestOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  tests: {
    testId: string;
    testName: string;
    result?: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }[];
  orderDate: string;
  sampleCollected: boolean;
  status: 'Ordered' | 'Sample Collected' | 'In Progress' | 'Completed' | 'Reported';
  priority: 'Normal' | 'Urgent' | 'STAT';
  totalAmount: number;
}

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
      id={`lab-tabpanel-${index}`}
      aria-labelledby={`lab-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Laboratory: React.FC = () => {
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [addTestOpen, setAddTestOpen] = useState(false);
  const [addOrderOpen, setAddOrderOpen] = useState(false);
  const [viewOrderOpen, setViewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);

  useEffect(() => {
    // Initialize with sample lab tests
    const sampleTests: LabTest[] = [
      {
        id: '1',
        testCode: 'CBC',
        testName: 'Complete Blood Count',
        category: 'Hematology',
        price: 300,
        normalRange: 'Various parameters',
        unit: 'Various',
        description: 'Complete blood count with differential',
      },
      {
        id: '2',
        testCode: 'FBS',
        testName: 'Fasting Blood Sugar',
        category: 'Biochemistry',
        price: 150,
        normalRange: '70-100 mg/dL',
        unit: 'mg/dL',
        description: 'Fasting glucose level',
      },
      {
        id: '3',
        testCode: 'LFT',
        testName: 'Liver Function Test',
        category: 'Biochemistry',
        price: 500,
        normalRange: 'Various parameters',
        unit: 'Various',
        description: 'Complete liver function panel',
      },
      {
        id: '4',
        testCode: 'XRAY',
        testName: 'Chest X-Ray',
        category: 'Radiology',
        price: 400,
        normalRange: 'Normal anatomy',
        unit: 'Image',
        description: 'Chest radiograph',
      },
    ];
    setLabTests(sampleTests);

    // Initialize with sample orders
    const sampleOrders: TestOrder[] = [
      {
        id: '1',
        orderNumber: 'LAB-2024-001',
        patientId: '1',
        patientName: 'John Smith',
        doctorId: '1',
        doctorName: 'Dr. Sarah Wilson',
        tests: [
          { testId: '1', testName: 'Complete Blood Count', status: 'Completed', result: 'Normal' },
          { testId: '2', testName: 'Fasting Blood Sugar', status: 'Completed', result: '95 mg/dL' },
        ],
        orderDate: '2024-01-22',
        sampleCollected: true,
        status: 'Completed',
        priority: 'Normal',
        totalAmount: 450,
      },
      {
        id: '2',
        orderNumber: 'LAB-2024-002',
        patientId: '2',
        patientName: 'Emma Johnson',
        doctorId: '2',
        doctorName: 'Dr. Michael Brown',
        tests: [
          { testId: '3', testName: 'Liver Function Test', status: 'In Progress' },
        ],
        orderDate: '2024-01-22',
        sampleCollected: true,
        status: 'In Progress',
        priority: 'Urgent',
        totalAmount: 500,
      },
      {
        id: '3',
        orderNumber: 'LAB-2024-003',
        patientId: '3',
        patientName: 'Robert Davis',
        doctorId: '3',
        doctorName: 'Dr. Lisa Anderson',
        tests: [
          { testId: '4', testName: 'Chest X-Ray', status: 'Pending' },
        ],
        orderDate: '2024-01-22',
        sampleCollected: false,
        status: 'Ordered',
        priority: 'STAT',
        totalAmount: 400,
      },
    ];
    setTestOrders(sampleOrders);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Reported':
        return 'success';
      case 'In Progress':
      case 'Sample Collected':
        return 'info';
      case 'Ordered':
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'STAT':
        return 'error';
      case 'Urgent':
        return 'warning';
      case 'Normal':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredTests = labTests.filter(test =>
    test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = testOrders.filter(order =>
    order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOrder = (order: TestOrder) => {
    setSelectedOrder(order);
    setViewOrderOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: TestOrder['status']) => {
    setTestOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const completedTests = testOrders.filter(o => o.status === 'Completed').length;
  const pendingTests = testOrders.filter(o => o.status !== 'Completed').length;
  const totalRevenue = testOrders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Laboratory Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          size="large"
          onClick={() => setAddOrderOpen(true)}
        >
          New Test Order
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
                    Total Tests
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {labTests.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Science />
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
                    Completed Today
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {completedTests}
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
                    Pending Tests
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {pendingTests}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <Pending />
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
                    Revenue Today
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    ₹{totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <Assignment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* STAT Priority Alert */}
      {testOrders.some(o => o.priority === 'STAT' && o.status !== 'Completed') && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>STAT Orders Pending!</strong> There are urgent test orders that require immediate attention.
        </Alert>
      )}

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Test Orders" />
            <Tab label="Available Tests" />
            <Tab label="Results" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search orders by patient name or order number..."
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
                  <TableCell>Order #</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Tests</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.patientName}</TableCell>
                    <TableCell>{order.doctorName}</TableCell>
                    <TableCell>
                      {order.tests.map((test, index) => (
                        <Typography key={index} variant="body2">
                          {test.testName}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.priority}
                        size="small"
                        color={getPriorityColor(order.priority) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        color={getStatusColor(order.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Visibility />
                        </IconButton>
                        {order.status !== 'Completed' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                          >
                            Complete
                          </Button>
                        )}
                        <IconButton size="small" color="primary">
                          <Print />
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
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search tests by name, code, or category..."
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
                  <TableCell>Test Code</TableCell>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Normal Range</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow key={test.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {test.testCode}
                      </Typography>
                    </TableCell>
                    <TableCell>{test.testName}</TableCell>
                    <TableCell>
                      <Chip
                        label={test.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>₹{test.price}</TableCell>
                    <TableCell>{test.normalRange}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
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

        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Test</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testOrders.filter(o => o.status === 'Completed').map((order) =>
                  order.tests.map((test, index) => (
                    <TableRow key={`${order.id}-${index}`} hover>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.patientName}</TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.result || 'Pending'}</TableCell>
                      <TableCell>
                        <Chip
                          label={test.status}
                          size="small"
                          color={getStatusColor(test.status) as any}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <Print />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={viewOrderOpen} onClose={() => setViewOrderOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Test Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="h6">Order: {selectedOrder.orderNumber}</Typography>
                  <Typography>Date: {selectedOrder.orderDate}</Typography>
                  <Typography>Patient: {selectedOrder.patientName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Doctor: {selectedOrder.doctorName}</Typography>
                  <Chip
                    label={selectedOrder.priority}
                    color={getPriorityColor(selectedOrder.priority) as any}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={selectedOrder.status}
                    color={getStatusColor(selectedOrder.status) as any}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              
              <Typography variant="h6" sx={{ mb: 2 }}>Tests Ordered</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Test Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.tests.map((test, index) => (
                      <TableRow key={index}>
                        <TableCell>{test.testName}</TableCell>
                        <TableCell>
                          <Chip
                            label={test.status}
                            size="small"
                            color={getStatusColor(test.status) as any}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{test.result || 'Pending'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ textAlign: 'right', mt: 2 }}>
                <Typography variant="h6">Total Amount: ₹{selectedOrder.totalAmount}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOrderOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<Print />}>Print Report</Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddOrderOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Laboratory;