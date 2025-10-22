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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Group,
  Schedule,
  Payment,
  CheckCircle,
  AccessTime,
  Person,
  Work,
} from '@mui/icons-material';

interface Staff {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  joinDate: string;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  shift: 'Morning' | 'Evening' | 'Night';
}

interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  hoursWorked?: number;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
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
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [viewStaffOpen, setViewStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    department: '',
    phone: '',
    email: '',
    salary: '',
    shift: '',
  });

  const roles = [
    'Nurse',
    'Technician',
    'Pharmacist',
    'Receptionist',
    'Security Guard',
    'Cleaner',
    'Administrator',
    'Lab Technician',
    'Radiologist',
    'Physiotherapist',
  ];

  const departments = [
    'General Ward',
    'ICU',
    'Emergency',
    'Pharmacy',
    'Laboratory',
    'Radiology',
    'Administration',
    'Security',
    'Housekeeping',
    'Reception',
  ];

  useEffect(() => {
    // Initialize with sample staff data
    const sampleStaff: Staff[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        name: 'Alice Johnson',
        role: 'Nurse',
        department: 'ICU',
        phone: '+91-9876543230',
        email: 'alice.johnson@hospital.com',
        joinDate: '2023-01-15',
        salary: 45000,
        status: 'Active',
        shift: 'Morning',
      },
      {
        id: '2',
        employeeId: 'EMP002',
        name: 'Bob Smith',
        role: 'Technician',
        department: 'Laboratory',
        phone: '+91-9876543231',
        email: 'bob.smith@hospital.com',
        joinDate: '2023-03-20',
        salary: 35000,
        status: 'Active',
        shift: 'Evening',
      },
      {
        id: '3',
        employeeId: 'EMP003',
        name: 'Carol Davis',
        role: 'Pharmacist',
        department: 'Pharmacy',
        phone: '+91-9876543232',
        email: 'carol.davis@hospital.com',
        joinDate: '2022-11-10',
        salary: 50000,
        status: 'Active',
        shift: 'Morning',
      },
      {
        id: '4',
        employeeId: 'EMP004',
        name: 'David Wilson',
        role: 'Security Guard',
        department: 'Security',
        phone: '+91-9876543233',
        email: 'david.wilson@hospital.com',
        joinDate: '2023-05-01',
        salary: 25000,
        status: 'On Leave',
        shift: 'Night',
      },
    ];
    setStaff(sampleStaff);

    // Initialize with sample attendance data
    const sampleAttendance: Attendance[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'Alice Johnson',
        date: '2024-01-22',
        checkIn: '08:00',
        checkOut: '16:00',
        hoursWorked: 8,
        status: 'Present',
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Bob Smith',
        date: '2024-01-22',
        checkIn: '14:00',
        checkOut: '22:00',
        hoursWorked: 8,
        status: 'Present',
      },
      {
        id: '3',
        employeeId: 'EMP003',
        employeeName: 'Carol Davis',
        date: '2024-01-22',
        checkIn: '08:30',
        checkOut: '16:30',
        hoursWorked: 8,
        status: 'Late',
      },
      {
        id: '4',
        employeeId: 'EMP004',
        employeeName: 'David Wilson',
        date: '2024-01-22',
        checkIn: '',
        status: 'Absent',
      },
    ];
    setAttendance(sampleAttendance);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Present':
        return 'success';
      case 'Inactive':
      case 'Absent':
        return 'error';
      case 'On Leave':
      case 'Late':
        return 'warning';
      case 'Half Day':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStaffFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaffForm({ ...staffForm, [field]: event.target.value });
  };

  const handleAddStaff = () => {
    const newStaff: Staff = {
      id: Date.now().toString(),
      employeeId: `EMP${String(staff.length + 1).padStart(3, '0')}`,
      name: staffForm.name,
      role: staffForm.role,
      department: staffForm.department,
      phone: staffForm.phone,
      email: staffForm.email,
      joinDate: new Date().toISOString().split('T')[0],
      salary: parseFloat(staffForm.salary),
      status: 'Active',
      shift: staffForm.shift as 'Morning' | 'Evening' | 'Night',
    };

    setStaff([...staff, newStaff]);
    setStaffForm({
      name: '',
      role: '',
      department: '',
      phone: '',
      email: '',
      salary: '',
      shift: '',
    });
    setAddStaffOpen(false);
  };

  const handleViewStaff = (member: Staff) => {
    setSelectedStaff(member);
    setViewStaffOpen(true);
  };

  const markAttendance = (employeeId: string, status: 'Present' | 'Absent' | 'Late') => {
    const employee = staff.find(s => s.id === employeeId);
    if (employee) {
      const newAttendance: Attendance = {
        id: Date.now().toString(),
        employeeId: employee.employeeId,
        employeeName: employee.name,
        date: new Date().toISOString().split('T')[0],
        checkIn: status === 'Present' ? '08:00' : status === 'Late' ? '08:30' : '',
        checkOut: status !== 'Absent' ? '16:00' : undefined,
        hoursWorked: status !== 'Absent' ? 8 : undefined,
        status,
      };
      setAttendance([...attendance, newAttendance]);
    }
  };

  const activeStaff = staff.filter(s => s.status === 'Active').length;
  const presentToday = attendance.filter(a => a.status === 'Present').length;
  const totalSalary = staff.reduce((sum, s) => sum + s.salary, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => setAddStaffOpen(true)}
        >
          Add Staff Member
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
                    Total Staff
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {staff.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Group />
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
                    Active Staff
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {activeStaff}
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
                    Present Today
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {presentToday}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <AccessTime />
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
                    Monthly Payroll
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    ₹{totalSalary.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <Payment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Staff Directory" />
            <Tab label="Attendance" />
            <Tab label="Schedules" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search staff by name, role, department, or employee ID..."
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
                  <TableCell>Employee</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {member.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.employeeId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.role}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{member.shift}</TableCell>
                    <TableCell>₹{member.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={member.status}
                        size="small"
                        color={getStatusColor(member.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewStaff(member)}
                        >
                          <Person />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => markAttendance(member.id, 'Present')}
                        >
                          Mark Present
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Today's Attendance - {new Date().toLocaleDateString()}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Hours Worked</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{record.checkIn || '-'}</TableCell>
                    <TableCell>{record.checkOut || '-'}</TableCell>
                    <TableCell>{record.hoursWorked || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        size="small"
                        color={getStatusColor(record.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shift Schedules
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Morning Shift (8:00 - 16:00)
                  </Typography>
                  <List>
                    {staff.filter(s => s.shift === 'Morning').map((member) => (
                      <ListItem key={member.id}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {member.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.name}
                          secondary={`${member.role} - ${member.department}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Evening Shift (14:00 - 22:00)
                  </Typography>
                  <List>
                    {staff.filter(s => s.shift === 'Evening').map((member) => (
                      <ListItem key={member.id}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'warning.main' }}>
                            {member.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.name}
                          secondary={`${member.role} - ${member.department}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Night Shift (22:00 - 06:00)
                  </Typography>
                  <List>
                    {staff.filter(s => s.shift === 'Night').map((member) => (
                      <ListItem key={member.id}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'info.main' }}>
                            {member.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.name}
                          secondary={`${member.role} - ${member.department}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={addStaffOpen} onClose={() => setAddStaffOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Staff Member</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={staffForm.name}
                  onChange={handleStaffFormChange('name')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  value={staffForm.role}
                  onChange={handleStaffFormChange('role')}
                  required
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  value={staffForm.department}
                  onChange={handleStaffFormChange('department')}
                  required
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Shift"
                  value={staffForm.shift}
                  onChange={handleStaffFormChange('shift')}
                  required
                >
                  <MenuItem value="Morning">Morning (8:00 - 16:00)</MenuItem>
                  <MenuItem value="Evening">Evening (14:00 - 22:00)</MenuItem>
                  <MenuItem value="Night">Night (22:00 - 06:00)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={staffForm.phone}
                  onChange={handleStaffFormChange('phone')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={staffForm.email}
                  onChange={handleStaffFormChange('email')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Salary (₹)"
                  type="number"
                  value={staffForm.salary}
                  onChange={handleStaffFormChange('salary')}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddStaffOpen(false)}>Cancel</Button>
          <Button onClick={handleAddStaff} variant="contained">
            Add Staff Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Staff Dialog */}
      <Dialog open={viewStaffOpen} onClose={() => setViewStaffOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Staff Member Details</DialogTitle>
        <DialogContent>
          {selectedStaff && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedStaff.employeeId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedStaff.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedStaff.role}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedStaff.department}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Shift
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedStaff.shift}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Join Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedStaff.joinDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Monthly Salary
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  ₹{selectedStaff.salary.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedStaff.status}
                  size="small"
                  color={getStatusColor(selectedStaff.status) as any}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Information
                </Typography>
                <Typography variant="body1">Phone: {selectedStaff.phone}</Typography>
                <Typography variant="body1">Email: {selectedStaff.email}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewStaffOpen(false)}>Close</Button>
          <Button variant="contained">Edit Staff</Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddStaffOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Staff;