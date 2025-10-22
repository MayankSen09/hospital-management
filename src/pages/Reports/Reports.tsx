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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  Download,
  Print,
  FilterList,
  DateRange,
  PieChart,
  BarChart,
  TableChart,
  People,
  LocalHospital,
  Receipt,
  Hotel,
  Science,
  LocalPharmacy,
  Visibility,
  GetApp,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/redux';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Financial' | 'Clinical' | 'Operational' | 'Administrative';
  icon: React.ReactNode;
  fields: string[];
  filters: string[];
}

interface ReportData {
  id: string;
  title: string;
  data: any[];
  summary: {
    totalRecords: number;
    totalValue?: number;
    averageValue?: number;
    trends?: {
      label: string;
      value: number;
      change: number;
    }[];
  };
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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Reports: React.FC = () => {
  const { patients } = useAppSelector((state) => state.patients);
  const { appointments } = useAppSelector((state) => state.appointments);
  const { medicines, prescriptions } = useAppSelector((state) => state.pharmacy);

  const [tabValue, setTabValue] = useState(0);
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [generateReportOpen, setGenerateReportOpen] = useState(false);
  const [viewReportOpen, setViewReportOpen] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    dateFrom: '',
    dateTo: '',
    department: '',
    status: '',
    category: '',
  });
  const [recentReports, setRecentReports] = useState([
    { name: 'Patient Summary Report', category: 'Clinical', date: '2024-01-22', records: 156, status: 'Completed' },
    { name: 'Financial Summary', category: 'Financial', date: '2024-01-21', records: 89, status: 'Completed' },
    { name: 'Appointment Analytics', category: 'Operational', date: '2024-01-20', records: 234, status: 'Completed' },
  ]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'patient-summary',
      name: 'Patient Summary Report',
      description: 'Comprehensive overview of patient demographics and statistics',
      category: 'Clinical',
      icon: <People />,
      fields: ['Patient ID', 'Name', 'Age', 'Gender', 'Status', 'Last Visit'],
      filters: ['Date Range', 'Status', 'Age Group'],
    },
    {
      id: 'appointment-analytics',
      name: 'Appointment Analytics',
      description: 'Analysis of appointment trends, completion rates, and scheduling patterns',
      category: 'Operational',
      icon: <Assessment />,
      fields: ['Date', 'Patient', 'Doctor', 'Type', 'Status', 'Duration'],
      filters: ['Date Range', 'Doctor', 'Status', 'Type'],
    },
    {
      id: 'financial-summary',
      name: 'Financial Summary',
      description: 'Revenue analysis, payment tracking, and financial performance metrics',
      category: 'Financial',
      icon: <Receipt />,
      fields: ['Invoice #', 'Patient', 'Amount', 'Payment Method', 'Status', 'Date'],
      filters: ['Date Range', 'Payment Method', 'Status'],
    },
    {
      id: 'bed-occupancy',
      name: 'Bed Occupancy Report',
      description: 'Ward utilization, bed turnover rates, and occupancy trends',
      category: 'Operational',
      icon: <Hotel />,
      fields: ['Ward', 'Total Beds', 'Occupied', 'Available', 'Occupancy Rate'],
      filters: ['Date Range', 'Ward Type'],
    },
    {
      id: 'pharmacy-inventory',
      name: 'Pharmacy Inventory Report',
      description: 'Medicine stock levels, expiry tracking, and usage patterns',
      category: 'Operational',
      icon: <LocalPharmacy />,
      fields: ['Medicine', 'Category', 'Stock', 'Expiry Date', 'Status'],
      filters: ['Category', 'Status', 'Expiry Range'],
    },
    {
      id: 'lab-test-summary',
      name: 'Laboratory Test Summary',
      description: 'Test volume, completion rates, and turnaround time analysis',
      category: 'Clinical',
      icon: <Science />,
      fields: ['Test Name', 'Orders', 'Completed', 'Pending', 'Avg. TAT'],
      filters: ['Date Range', 'Test Category', 'Status'],
    },
    {
      id: 'doctor-performance',
      name: 'Doctor Performance Report',
      description: 'Doctor productivity, patient load, and performance metrics',
      category: 'Administrative',
      icon: <LocalHospital />,
      fields: ['Doctor', 'Specialization', 'Patients Seen', 'Avg. Rating', 'Revenue'],
      filters: ['Date Range', 'Specialization', 'Department'],
    },
    {
      id: 'staff-attendance',
      name: 'Staff Attendance Report',
      description: 'Employee attendance patterns, overtime, and productivity metrics',
      category: 'Administrative',
      icon: <People />,
      fields: ['Employee', 'Department', 'Present Days', 'Absent Days', 'Overtime'],
      filters: ['Date Range', 'Department', 'Role'],
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial':
        return 'success';
      case 'Clinical':
        return 'primary';
      case 'Operational':
        return 'warning';
      case 'Administrative':
        return 'info';
      default:
        return 'default';
    }
  };

  const generateReport = (template: ReportTemplate) => {
    let data: any[] = [];
    let summary: any = {};

    switch (template.id) {
      case 'patient-summary':
        data = patients.map(patient => ({
          'Patient ID': patient.patientId,
          'Name': patient.name,
          'Age': patient.age,
          'Gender': patient.gender,
          'Status': patient.status,
          'Last Visit': new Date().toISOString().split('T')[0],
        }));
        summary = {
          totalRecords: patients.length,
          trends: [
            { label: 'Active Patients', value: patients.filter(p => p.status === 'Active').length, change: 12 },
            { label: 'Admitted Patients', value: patients.filter(p => p.status === 'Admitted').length, change: -5 },
            { label: 'Average Age', value: Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length), change: 2 },
          ],
        };
        break;

      case 'appointment-analytics':
        data = appointments.map(apt => ({
          'Date': apt.date,
          'Patient': apt.patientName,
          'Doctor': apt.doctorName,
          'Type': apt.type,
          'Status': apt.status,
          'Duration': '30 min',
        }));
        summary = {
          totalRecords: appointments.length,
          trends: [
            { label: 'Completed', value: appointments.filter(a => a.status === 'Completed').length, change: 8 },
            { label: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length, change: 15 },
            { label: 'Pending', value: appointments.filter(a => a.status === 'Scheduled').length, change: -3 },
          ],
        };
        break;

      case 'pharmacy-inventory':
        data = medicines.map(med => ({
          'Medicine': med.name,
          'Category': med.category,
          'Stock': med.quantity,
          'Expiry Date': med.expiryDate,
          'Status': med.status,
        }));
        summary = {
          totalRecords: medicines.length,
          totalValue: medicines.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0),
          trends: [
            { label: 'Available', value: medicines.filter(m => m.status === 'Available').length, change: 5 },
            { label: 'Low Stock', value: medicines.filter(m => m.status === 'Low Stock').length, change: -2 },
            { label: 'Out of Stock', value: medicines.filter(m => m.status === 'Out of Stock').length, change: -1 },
          ],
        };
        break;

      case 'financial-summary':
        // Sample financial data
        data = [
          { 'Invoice #': 'INV-2024-001', 'Patient': 'John Smith', 'Amount': 1121, 'Payment Method': 'Cash', 'Status': 'Paid', 'Date': '2024-01-20' },
          { 'Invoice #': 'INV-2024-002', 'Patient': 'Emma Johnson', 'Amount': 21948, 'Payment Method': 'Credit Card', 'Status': 'Paid', 'Date': '2024-01-18' },
          { 'Invoice #': 'INV-2024-003', 'Patient': 'Robert Davis', 'Amount': 3894, 'Payment Method': 'UPI', 'Status': 'Pending', 'Date': '2024-01-15' },
        ];
        summary = {
          totalRecords: data.length,
          totalValue: data.reduce((sum, d) => sum + d.Amount, 0),
          averageValue: data.reduce((sum, d) => sum + d.Amount, 0) / data.length,
          trends: [
            { label: 'Total Revenue', value: 26963, change: 18 },
            { label: 'Paid Invoices', value: 2, change: 12 },
            { label: 'Pending Amount', value: 3894, change: -5 },
          ],
        };
        break;

      default:
        data = [];
        summary = { totalRecords: 0 };
    }

    const reportData: ReportData = {
      id: template.id,
      title: template.name,
      data,
      summary,
    };

    setReportData(reportData);
    setViewReportOpen(true);

    // Add to recent reports
    const newRecentReport = {
      name: template.name,
      category: template.category,
      date: new Date().toISOString().split('T')[0],
      records: data.length,
      status: 'Completed',
    };
    setRecentReports(prev => [newRecentReport, ...prev.slice(0, 9)]); // Keep only last 10 reports
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (!reportData) return;

    const fileName = `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      downloadCSV(reportData, fileName);
    } else if (format === 'excel') {
      downloadExcel(reportData, fileName);
    } else if (format === 'pdf') {
      downloadPDF(reportData, fileName);
    }
  };

  const downloadCSV = (data: ReportData, fileName: string) => {
    if (data.data.length === 0) return;

    const headers = Object.keys(data.data[0]);
    const csvContent = [
      headers.join(','),
      ...data.data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification({ open: true, message: `CSV report "${fileName}.csv" downloaded successfully!`, severity: 'success' });
  };

  const downloadExcel = (data: ReportData, fileName: string) => {
    if (data.data.length === 0) return;

    // Create a simple HTML table for Excel
    const headers = Object.keys(data.data[0]);
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${data.title}</title>
        </head>
        <body>
          <h1>${data.title}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Total Records: ${data.summary.totalRecords}</p>
          ${data.summary.totalValue ? `<p>Total Value: ₹${data.summary.totalValue.toLocaleString()}</p>` : ''}
          <table border="1" style="border-collapse: collapse;">
            <thead>
              <tr>
                ${headers.map(header => `<th style="background-color: #f0f0f0; padding: 8px;">${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.data.map(row =>
      `<tr>
                  ${headers.map(header => `<td style="padding: 8px;">${row[header]}</td>`).join('')}
                </tr>`
    ).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification({ open: true, message: `Excel report "${fileName}.xls" downloaded successfully!`, severity: 'success' });
  };

  const downloadPDF = (data: ReportData, fileName: string) => {
    // Create a printable HTML version for PDF
    const headers = Object.keys(data.data[0] || {});
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${data.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
            .summary-item { text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.title}</h1>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <h3>${data.summary.totalRecords}</h3>
              <p>Total Records</p>
            </div>
            ${data.summary.totalValue ? `
              <div class="summary-item">
                <h3>₹${data.summary.totalValue.toLocaleString()}</h3>
                <p>Total Value</p>
              </div>
            ` : ''}
            ${data.summary.averageValue ? `
              <div class="summary-item">
                <h3>₹${Math.round(data.summary.averageValue).toLocaleString()}</h3>
                <p>Average Value</p>
              </div>
            ` : ''}
          </div>

          ${data.summary.trends ? `
            <div style="margin-bottom: 30px;">
              <h3>Key Metrics</h3>
              <div style="display: flex; justify-content: space-around;">
                ${data.summary.trends.map(trend => `
                  <div class="summary-item">
                    <h4>${trend.value}</h4>
                    <p>${trend.label}</p>
                    <small style="color: ${trend.change > 0 ? 'green' : 'red'};">
                      ${trend.change > 0 ? '+' : ''}${trend.change}%
                    </small>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.data.map(row =>
      `<tr>
                  ${headers.map(header => `<td>${row[header]}</td>`).join('')}
                </tr>`
    ).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Hospital Management System - Report Generated</p>
            <p>This report contains ${data.summary.totalRecords} records as of ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      // Auto-trigger print dialog
      setTimeout(() => {
        printWindow.print();
        setNotification({ open: true, message: `PDF report opened for printing/saving!`, severity: 'success' });
      }, 250);
    }
  };

  const printReport = () => {
    if (!reportData) return;
    downloadPDF(reportData, `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`);
  };

  const quickStats = [
    {
      title: 'Total Reports Generated',
      value: '156',
      change: '+12%',
      icon: <Assessment />,
      color: 'primary',
    },
    {
      title: 'Scheduled Reports',
      value: '8',
      change: '+2',
      icon: <DateRange />,
      color: 'info',
    },
    {
      title: 'Data Sources',
      value: '12',
      change: 'Active',
      icon: <TableChart />,
      color: 'success',
    },
    {
      title: 'Export Downloads',
      value: '89',
      change: '+25%',
      icon: <Download />,
      color: 'warning',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Reports & Analytics
        </Typography>
        <Button
          variant="contained"
          startIcon={<Assessment />}
          size="large"
          onClick={() => setGenerateReportOpen(true)}
        >
          Generate Report
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color={stat.change.startsWith('+') ? 'success.main' : 'text.secondary'}>
                      {stat.change}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.main` }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Report Templates" />
            <Tab label="Recent Reports" />
            <Tab label="Scheduled Reports" />
            <Tab label="Analytics Dashboard" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {reportTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: `${getCategoryColor(template.category)}.light`, color: `${getCategoryColor(template.category)}.main`, mr: 2 }}>
                        {template.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                          {template.name}
                        </Typography>
                        <Chip
                          label={template.category}
                          size="small"
                          color={getCategoryColor(template.category) as any}
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {template.description}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Available Fields:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {template.fields.slice(0, 3).map((field, index) => (
                        <Chip key={index} label={field} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                      {template.fields.length > 3 && (
                        <Chip label={`+${template.fields.length - 3} more`} size="small" variant="outlined" />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => generateReport(template)}
                        startIcon={<Assessment />}
                        fullWidth
                      >
                        Generate
                      </Button>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedReport(template);
                            setGenerateReportOpen(true);
                          }}
                          startIcon={<FilterList />}
                          sx={{ flex: 1 }}
                        >
                          Customize
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            alert(`Report Template: ${template.name}\n\nDescription: ${template.description}\n\nFields: ${template.fields.join(', ')}\n\nFilters: ${template.filters.join(', ')}`);
                          }}
                          startIcon={<Visibility />}
                          sx={{ flex: 1 }}
                        >
                          Preview
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Generated Date</TableCell>
                  <TableCell>Records</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentReports.map((report, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.category}
                        size="small"
                        color={getCategoryColor(report.category) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.records}</TableCell>
                    <TableCell>
                      <Chip label={report.status} size="small" color="success" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            // Generate and view the report based on the report name
                            const template = reportTemplates.find(t => t.name === report.name);
                            if (template) {
                              generateReport(template);
                            }
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            const template = reportTemplates.find(t => t.name === report.name);
                            if (template) {
                              generateReport(template);
                              setTimeout(() => exportReport('pdf'), 500);
                            }
                          }}
                        >
                          <Download />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            const template = reportTemplates.find(t => t.name === report.name);
                            if (template) {
                              generateReport(template);
                              setTimeout(() => printReport(), 500);
                            }
                          }}
                        >
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

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Scheduled Reports
          </Typography>
          <List>
            {[
              { name: 'Daily Patient Summary', frequency: 'Daily at 9:00 AM', nextRun: '2024-01-23 09:00' },
              { name: 'Weekly Financial Report', frequency: 'Weekly on Monday', nextRun: '2024-01-29 08:00' },
              { name: 'Monthly Inventory Report', frequency: 'Monthly on 1st', nextRun: '2024-02-01 10:00' },
            ].map((schedule, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <DateRange />
                  </ListItemIcon>
                  <ListItemText
                    primary={schedule.name}
                    secondary={`${schedule.frequency} • Next run: ${schedule.nextRun}`}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      alert(`Editing schedule for: ${schedule.name}\nCurrent: ${schedule.frequency}\nNext run: ${schedule.nextRun}`);
                    }}
                  >
                    Edit Schedule
                  </Button>
                </ListItem>
                {index < 2 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Report Generation Trends
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Financial Reports
                    </Typography>
                    <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Clinical Reports
                    </Typography>
                    <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Operational Reports
                    </Typography>
                    <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Export Formats Usage
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="PDF" secondary="45% of exports" />
                      <Typography variant="body2">156 files</Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Excel" secondary="35% of exports" />
                      <Typography variant="body2">89 files</Typography>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="CSV" secondary="20% of exports" />
                      <Typography variant="body2">67 files</Typography>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={generateReportOpen} onClose={() => setGenerateReportOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedReport ? `Generate ${selectedReport.name}` : 'Generate Custom Report'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date From"
                  type="date"
                  value={reportFilters.dateFrom}
                  onChange={(e) => setReportFilters({ ...reportFilters, dateFrom: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date To"
                  type="date"
                  value={reportFilters.dateTo}
                  onChange={(e) => setReportFilters({ ...reportFilters, dateTo: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  value={reportFilters.department}
                  onChange={(e) => setReportFilters({ ...reportFilters, department: e.target.value })}
                >
                  <MenuItem value="">All Departments</MenuItem>
                  <MenuItem value="General Ward">General Ward</MenuItem>
                  <MenuItem value="ICU">ICU</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                  <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                  <MenuItem value="Laboratory">Laboratory</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status Filter"
                  value={reportFilters.status}
                  onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateReportOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedReport) {
                generateReport(selectedReport);
              }
              setGenerateReportOpen(false);
            }}
            variant="contained"
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={viewReportOpen} onClose={() => setViewReportOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {reportData?.title}
            <Box>
              <Button onClick={() => exportReport('pdf')} startIcon={<GetApp />} sx={{ mr: 1 }}>
                PDF
              </Button>
              <Button onClick={() => exportReport('excel')} startIcon={<GetApp />} sx={{ mr: 1 }}>
                Excel
              </Button>
              <Button onClick={() => exportReport('csv')} startIcon={<GetApp />}>
                CSV
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {reportData && (
            <Box>
              {/* Report Summary */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {reportData.summary.totalRecords}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Records
                    </Typography>
                  </Paper>
                </Grid>
                {reportData.summary.totalValue && (
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        ₹{reportData.summary.totalValue.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Value
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                {reportData.summary.averageValue && (
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main">
                        ₹{Math.round(reportData.summary.averageValue).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Value
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* Trends */}
              {reportData.summary.trends && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Key Metrics</Typography>
                  <Grid container spacing={2}>
                    {reportData.summary.trends.map((trend, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {trend.label}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h5">
                              {trend.value}
                            </Typography>
                            <Chip
                              label={`${trend.change > 0 ? '+' : ''}${trend.change}%`}
                              size="small"
                              color={trend.change > 0 ? 'success' : 'error'}
                              variant="outlined"
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Data Table */}
              <Typography variant="h6" sx={{ mb: 2 }}>Report Data</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {reportData.data.length > 0 && Object.keys(reportData.data[0]).map((key) => (
                        <TableCell key={key}>{key}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.data.map((row, index) => (
                      <TableRow key={index} hover>
                        {Object.values(row).map((value: any, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {typeof value === 'number' && value > 1000 ?
                              `₹${value.toLocaleString()}` :
                              String(value)
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewReportOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Print />} onClick={printReport}>
            Print Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reports;