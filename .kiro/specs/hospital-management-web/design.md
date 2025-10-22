# Hospital Management System Web Application - Design Document

## Overview

The Hospital Management System Web Application will be built using a modern full-stack architecture with React.js frontend, Node.js/Express backend, and PostgreSQL database. The system will provide a responsive, secure, and scalable web platform accessible from any device with internet connectivity.

## Architecture

### System Architecture Pattern
- **Frontend**: React.js with TypeScript and Material-UI components
- **Backend**: Node.js with Express.js framework and TypeScript
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Authentication**: JWT tokens with refresh token rotation
- **Real-time Communication**: Socket.io for live updates and notifications
- **File Storage**: AWS S3 or local storage for documents and images
- **Deployment**: Docker containers with nginx reverse proxy

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
│  React.js + TypeScript + Material-UI + PWA Support         │
├─────────────────────────────────────────────────────────────┤
│                    API Gateway                              │
│           nginx + Rate Limiting + CORS                      │
├─────────────────────────────────────────────────────────────┤
│                  Application Layer                          │
│     Node.js + Express.js + TypeScript + Socket.io          │
├─────────────────────────────────────────────────────────────┤
│                  Business Logic Layer                       │
│        Services + Controllers + Middleware                  │
├─────────────────────────────────────────────────────────────┤
│                  Data Access Layer                          │
│              Prisma ORM + Repository Pattern               │
├─────────────────────────────────────────────────────────────┤
│                   Database Layer                            │
│                    PostgreSQL                               │
└─────────────────────────────────────────────────────────────┘
```

### Security Architecture
- **Authentication**: JWT access tokens (15 min) + refresh tokens (7 days)
- **Authorization**: Role-based access control with permission middleware
- **Data Protection**: AES-256 encryption for sensitive medical data
- **API Security**: Rate limiting, CORS, helmet.js security headers
- **Session Management**: Secure HTTP-only cookies with CSRF protection
- **Audit Logging**: Comprehensive logging of all user actions and data changes

## Components and Interfaces

### Frontend Architecture (React.js)

#### Component Structure
```typescript
// Core Types
interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  lastLogin: Date;
  isActive: boolean;
}

interface Patient {
  id: string;
  patientId: string; // HMS-YYYY-NNNNNN
  name: string;
  age: number;
  gender: Gender;
  contact: string;
  address: Address;
  bloodGroup: string;
  medicalHistory: string;
  emergencyContact: string;
  registrationDate: Date;
  isActive: boolean;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  status: AppointmentStatus;
  notes: string;
  estimatedDuration: number;
  createdAt: Date;
}
```

#### Key React Components
```typescript
// Authentication Components
const LoginForm: React.FC = () => { /* JWT login with role-based redirect */ };
const ProtectedRoute: React.FC<{roles: UserRole[]}> = ({ children, roles }) => { /* Role-based route protection */ };

// Dashboard Components
const Dashboard: React.FC = () => { /* Role-specific dashboard with widgets */ };
const StatsWidget: React.FC<{title: string, value: number, trend: number}> = ({ title, value, trend }) => { /* KPI display widget */ };

// Patient Management
const PatientRegistration: React.FC = () => { /* Patient registration form with validation */ };
const PatientSearch: React.FC = () => { /* Advanced search with filters */ };
const PatientDetails: React.FC<{patientId: string}> = ({ patientId }) => { /* Patient profile with medical history */ };

// Appointment Management
const AppointmentCalendar: React.FC = () => { /* Interactive calendar with drag-drop */ };
const AppointmentForm: React.FC = () => { /* Appointment booking with availability check */ };
```

#### State Management (Redux Toolkit)
```typescript
// Redux Store Structure
interface RootState {
  auth: AuthState;
  patients: PatientsState;
  appointments: AppointmentsState;
  doctors: DoctorsState;
  notifications: NotificationsState;
  ui: UIState;
}

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  },
  reducers: {
    loginStart: (state) => { state.loading = true; },
    loginSuccess: (state, action) => { 
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => { 
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  }
});
```

### Backend Architecture (Node.js/Express)

#### API Structure
```typescript
// Express App Configuration
const app = express();

// Middleware Stack
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // CORS configuration
app.use(rateLimit(rateLimitOptions)); // Rate limiting
app.use(express.json({ limit: '10mb' })); // JSON parsing
app.use(authMiddleware); // JWT authentication
app.use(auditMiddleware); // Audit logging

// Route Structure
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/reports', reportRoutes);
```

#### Service Layer
```typescript
// Patient Service
class PatientService {
  async registerPatient(patientData: CreatePatientDTO): Promise<Patient> {
    // Generate unique patient ID
    const patientId = await this.generatePatientId();
    
    // Validate patient data
    await this.validatePatientData(patientData);
    
    // Create patient record
    const patient = await this.patientRepository.create({
      ...patientData,
      patientId,
      registrationDate: new Date()
    });
    
    // Log audit trail
    await this.auditService.log('PATIENT_CREATED', patient.id);
    
    return patient;
  }

  async searchPatients(searchTerm: string, filters: PatientFilters): Promise<Patient[]> {
    return await this.patientRepository.search(searchTerm, filters);
  }
}

// Appointment Service
class AppointmentService {
  async scheduleAppointment(appointmentData: CreateAppointmentDTO): Promise<Appointment> {
    // Check doctor availability
    const isAvailable = await this.checkDoctorAvailability(
      appointmentData.doctorId, 
      appointmentData.appointmentDate
    );
    
    if (!isAvailable) {
      throw new ConflictError('Doctor not available at requested time');
    }
    
    // Create appointment
    const appointment = await this.appointmentRepository.create(appointmentData);
    
    // Send notifications
    await this.notificationService.sendAppointmentConfirmation(appointment);
    
    return appointment;
  }
}
```

#### Authentication & Authorization
```typescript
// JWT Middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await userService.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Permission Middleware
const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

## Data Models

### Database Schema (PostgreSQL with Prisma)

```prisma
// Prisma Schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  username    String   @unique
  email       String   @unique
  passwordHash String
  role        UserRole
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastLogin   DateTime?
  
  // Relations
  doctor      Doctor?
  auditLogs   AuditLog[]
  
  @@map("users")
}

model Patient {
  id               String   @id @default(cuid())
  patientId        String   @unique // HMS-YYYY-NNNNNN
  name             String
  age              Int
  gender           Gender
  contact          String
  address          Json
  bloodGroup       String?
  medicalHistory   String?
  emergencyContact String?
  registrationDate DateTime @default(now())
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  // Relations
  appointments     Appointment[]
  medicalRecords   MedicalRecord[]
  bills           Bill[]
  labTests        LabTest[]
  
  @@map("patients")
}

model Doctor {
  id                String   @id @default(cuid())
  userId            String   @unique
  name              String
  specialization    String
  contact           String
  consultationFee   Decimal
  availabilitySchedule Json
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  user              User     @relation(fields: [userId], references: [id])
  appointments      Appointment[]
  
  @@map("doctors")
}

model Appointment {
  id              String            @id @default(cuid())
  patientId       String
  doctorId        String
  appointmentDate DateTime
  status          AppointmentStatus @default(SCHEDULED)
  notes           String?
  estimatedDuration Int             @default(30) // minutes
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  // Relations
  patient         Patient           @relation(fields: [patientId], references: [id])
  doctor          Doctor            @relation(fields: [doctorId], references: [id])
  
  @@map("appointments")
}

enum UserRole {
  ADMIN
  DOCTOR
  NURSE
  RECEPTIONIST
  PHARMACIST
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum AppointmentStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

### API Response Formats
```typescript
// Standard API Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Patient API Responses
interface PatientListResponse extends ApiResponse<Patient[]> {
  pagination: PaginationInfo;
}

interface PatientDetailResponse extends ApiResponse<Patient> {
  data: Patient & {
    appointments: Appointment[];
    medicalRecords: MedicalRecord[];
  };
}
```

## Error Handling

### Frontend Error Handling
```typescript
// Error Boundary Component
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send error to logging service
    errorReportingService.reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// API Error Handling
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle authentication errors
      store.dispatch(logout());
      window.location.href = '/login';
    }
    
    // Show user-friendly error messages
    const message = error.response?.data?.message || 'An unexpected error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);
```

### Backend Error Handling
```typescript
// Global Error Handler
const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  // Log error for monitoring
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id
  });

  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
  }

  if (error instanceof ConflictError) {
    return res.status(409).json({
      success: false,
      error: error.message
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};
```

## Testing Strategy

### Frontend Testing (React)
```typescript
// Component Testing with React Testing Library
describe('PatientRegistration', () => {
  test('should validate required fields', async () => {
    render(<PatientRegistration />);
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/contact is required/i)).toBeInTheDocument();
  });

  test('should submit form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<PatientRegistration onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/contact/i), { target: { value: '1234567890' } });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        contact: '1234567890'
      });
    });
  });
});

// Redux Testing
describe('authSlice', () => {
  test('should handle login success', () => {
    const initialState = { user: null, isAuthenticated: false };
    const action = loginSuccess({ user: mockUser, token: 'mock-token' });
    
    const newState = authReducer(initialState, action);
    
    expect(newState.user).toEqual(mockUser);
    expect(newState.isAuthenticated).toBe(true);
  });
});
```

### Backend Testing (Node.js)
```typescript
// API Testing with Jest and Supertest
describe('Patient API', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  test('POST /api/patients should create new patient', async () => {
    const patientData = {
      name: 'John Doe',
      age: 30,
      gender: 'MALE',
      contact: '1234567890'
    };

    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send(patientData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('John Doe');
    expect(response.body.data.patientId).toMatch(/^HMS-\d{4}-\d{6}$/);
  });

  test('GET /api/patients should return paginated results', async () => {
    await createTestPatients(25);

    const response = await request(app)
      .get('/api/patients?page=1&limit=10')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.data).toHaveLength(10);
    expect(response.body.pagination.total).toBe(25);
    expect(response.body.pagination.totalPages).toBe(3);
  });
});

// Service Testing
describe('AppointmentService', () => {
  test('should prevent double booking', async () => {
    const appointmentData = {
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      appointmentDate: new Date('2024-01-15T10:00:00Z')
    };

    // Create first appointment
    await appointmentService.scheduleAppointment(appointmentData);

    // Try to create conflicting appointment
    await expect(
      appointmentService.scheduleAppointment(appointmentData)
    ).rejects.toThrow('Doctor not available at requested time');
  });
});
```

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Lazy loading of routes and components
- **Memoization**: React.memo and useMemo for expensive calculations
- **Virtual Scrolling**: For large data lists (patient records, appointments)
- **Image Optimization**: WebP format with fallbacks, lazy loading
- **Bundle Optimization**: Tree shaking, compression, CDN delivery

### Backend Performance
- **Database Optimization**: Proper indexing, query optimization
- **Caching**: Redis for session storage and frequently accessed data
- **Connection Pooling**: Efficient database connection management
- **API Rate Limiting**: Prevent abuse and ensure fair usage
- **Compression**: Gzip compression for API responses

### Real-time Features
```typescript
// Socket.io Implementation
// Server-side
io.on('connection', (socket) => {
  socket.on('join-ward', (wardId) => {
    socket.join(`ward-${wardId}`);
  });

  socket.on('bed-status-update', (data) => {
    socket.to(`ward-${data.wardId}`).emit('bed-updated', data);
  });
});

// Client-side
const socket = io(process.env.REACT_APP_SOCKET_URL);

useEffect(() => {
  socket.emit('join-ward', wardId);
  
  socket.on('bed-updated', (data) => {
    dispatch(updateBedStatus(data));
  });

  return () => {
    socket.off('bed-updated');
  };
}, [wardId]);
```

## Deployment Architecture

### Docker Configuration
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/hospital_db
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=hospital_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

This design provides a comprehensive, modern web-based hospital management system with scalability, security, and user experience as primary considerations.