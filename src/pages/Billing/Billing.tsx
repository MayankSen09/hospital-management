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
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Receipt,
  Payment,
  AccountBalance,
  TrendingUp,
  Print,
  Download,
  Visibility,
} from '@mui/icons-material';

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentMethod?: string;
  paidDate?: string;
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
      id={`billing-tabpanel-${index}`}
      aria-labelledby={`billing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [addInvoiceOpen, setAddInvoiceOpen] = useState(false);
  const [viewInvoiceOpen, setViewInvoiceOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    // Initialize with sample data
    const sampleInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        patientId: '1',
        patientName: 'John Smith',
        date: '2024-01-20',
        dueDate: '2024-02-20',
        items: [
          { description: 'Consultation Fee', quantity: 1, unitPrice: 500, total: 500 },
          { description: 'Blood Test', quantity: 1, unitPrice: 300, total: 300 },
          { description: 'Medicines', quantity: 1, unitPrice: 150, total: 150 },
        ],
        subtotal: 950,
        tax: 171,
        total: 1121,
        status: 'Pending',
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        patientId: '2',
        patientName: 'Emma Johnson',
        date: '2024-01-18',
        dueDate: '2024-02-18',
        items: [
          { description: 'Surgery Fee', quantity: 1, unitPrice: 15000, total: 15000 },
          { description: 'Room Charges (3 days)', quantity: 3, unitPrice: 1200, total: 3600 },
        ],
        subtotal: 18600,
        tax: 3348,
        total: 21948,
        status: 'Paid',
        paymentMethod: 'Credit Card',
        paidDate: '2024-01-22',
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        patientId: '3',
        patientName: 'Robert Davis',
        date: '2024-01-15',
        dueDate: '2024-02-15',
        items: [
          { description: 'Emergency Treatment', quantity: 1, unitPrice: 2500, total: 2500 },
          { description: 'X-Ray', quantity: 2, unitPrice: 400, total: 800 },
        ],
        subtotal: 3300,
        tax: 594,
        total: 3894,
        status: 'Overdue',
      },
    ];
    setInvoices(sampleInvoices);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'error';
      case 'Cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.total, 0);
  const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.total, 0);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewInvoiceOpen(true);
  };

  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const processPayment = () => {
    if (selectedInvoice && paymentMethod) {
      const updatedInvoices = invoices.map(inv =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              status: 'Paid' as const,
              paymentMethod,
              paidDate: new Date().toISOString().split('T')[0],
            }
          : inv
      );
      setInvoices(updatedInvoices);
      setPaymentDialogOpen(false);
      setPaymentMethod('');
      setSelectedInvoice(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Billing & Payment Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          size="large"
          onClick={() => setAddInvoiceOpen(true)}
        >
          Create Invoice
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
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    ₹{totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <TrendingUp />
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
                    Pending Amount
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    ₹{pendingAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <Payment />
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
                    Overdue Amount
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    ₹{overdueAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                  <AccountBalance />
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
                    Total Invoices
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {invoices.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Receipt />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All Invoices" />
            <Tab label="Pending Payments" />
            <Tab label="Payment History" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search invoices by patient name or invoice number..."
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
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {invoice.invoiceNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{invoice.patientName}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>₹{invoice.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.status}
                        size="small"
                        color={getStatusColor(invoice.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Visibility />
                        </IconButton>
                        {invoice.status !== 'Paid' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handlePayment(invoice)}
                          >
                            Pay
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Days Overdue</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.patientName}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>₹{invoice.total.toLocaleString()}</TableCell>
                    <TableCell>
                      {invoice.status === 'Overdue' ? 
                        Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handlePayment(invoice)}
                      >
                        Process Payment
                      </Button>
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
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Paid Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.filter(i => i.status === 'Paid').map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.patientName}</TableCell>
                    <TableCell>₹{invoice.total.toLocaleString()}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell>{invoice.paidDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* View Invoice Dialog */}
      <Dialog open={viewInvoiceOpen} onClose={() => setViewInvoiceOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Details</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="h6">Invoice: {selectedInvoice.invoiceNumber}</Typography>
                  <Typography>Date: {selectedInvoice.date}</Typography>
                  <Typography>Due Date: {selectedInvoice.dueDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Patient: {selectedInvoice.patientName}</Typography>
                  <Chip
                    label={selectedInvoice.status}
                    color={getStatusColor(selectedInvoice.status) as any}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ mb: 2 }}>Items</Typography>
              <List>
                {selectedInvoice.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.description}
                      secondary={`Qty: ${item.quantity} × ₹${item.unitPrice}`}
                    />
                    <Typography variant="body1">₹{item.total}</Typography>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography>Subtotal: ₹{selectedInvoice.subtotal}</Typography>
                <Typography>Tax (18%): ₹{selectedInvoice.tax}</Typography>
                <Typography variant="h6">Total: ₹{selectedInvoice.total}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewInvoiceOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<Print />}>Print</Button>
          <Button variant="outlined" startIcon={<Download />}>Download</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
        <DialogTitle>Process Payment</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Invoice: {selectedInvoice.invoiceNumber}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Patient: {selectedInvoice.patientName}
              </Typography>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Amount: ₹{selectedInvoice.total.toLocaleString()}
              </Typography>
              <TextField
                fullWidth
                select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Debit Card">Debit Card</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Net Banking">Net Banking</MenuItem>
                <MenuItem value="Insurance">Insurance</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button onClick={processPayment} variant="contained" color="success">
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddInvoiceOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Billing;