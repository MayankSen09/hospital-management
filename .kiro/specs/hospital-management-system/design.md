# Hospital Management System - Design Document

## Overview

The Hospital Management System will be built using Java with a layered MVC architecture to ensure maintainability, scalability, and clear separation of concerns. The system will use Java Swing for the desktop GUI, MySQL/PostgreSQL for data persistence, and implement comprehensive security measures for healthcare data protection.

## Architecture

### System Architecture Pattern
- **Pattern**: Model-View-Controller (MVC) with layered architecture
- **Language**: Java (JDK 8 or higher)
- **GUI Framework**: Java Swing with custom UI components
- **Database**: MySQL (primary) with SQLite fallback for lightweight deployment
- **Build Tool**: Maven for dependency management and build automation

### Layer Structure
```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│     (Swing Views & Controllers)     │
├─────────────────────────────────────┤
│           Business Layer            │
│        (Service Classes)            │
├─────────────────────────────────────┤
│         Data Access Layer           │
│    (Repository Pattern & DAOs)      │
├─────────────────────────────────────┤
│           Database Layer            │
│      (MySQL/PostgreSQL/SQLite)      │
└─────────────────────────────────────┘
```

### Security Architecture
- **Authentication**: Session-based authentication with encrypted passwords (BCrypt)
- **Authorization**: Role-based access control (RBAC) with permission matrices
- **Data Protection**: AES encryption for sensitive medical data
- **Session Management**: Automatic timeout and secure session handling
- **Audit Logging**: Comprehensive logging of all critical operations

## Components and Interfaces

### Core Model Classes

#### User Management
```java
public class User {
    private Long userId;
    private String username;
    private String hashedPassword;
    private UserRole role;
    private String email;
    private String phone;
    private LocalDateTime lastLogin;
    private boolean isActive;
}

public enum UserRole {
    ADMIN, DOCTOR, NURSE, RECEPTIONIST, PHARMACIST
}
```

#### Patient Management
```java
public class Patient {
    private Long patientId;
    private String name;
    private int age;
    private Gender gender;
    private String contact;
    private Address address;
    private String bloodGroup;
    private String medicalHistory;
    private LocalDateTime registrationDate;
    private List<Appointment> appointments;
    private List<MedicalRecord> medicalRecords;
}
```

#### Appointment System
```java
public class Appointment {
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
    private String notes;
    private Duration estimatedDuration;
}
```

### Service Layer Interfaces

#### Core Services
```java
public interface UserService {
    User authenticate(String username, String password);
    boolean hasPermission(User user, String resource, String action);
    void updateLastLogin(Long userId);
}

public interface PatientService {
    Patient registerPatient(PatientRegistrationRequest request);
    List<Patient> searchPatients(String searchTerm);
    Patient getPatientById(Long patientId);
    void updatePatient(Patient patient);
}

public interface AppointmentService {
    Appointment scheduleAppointment(AppointmentRequest request);
    List<Appointment> getDoctorAppointments(Long doctorId, LocalDate date);
    boolean isTimeSlotAvailable(Long doctorId, LocalDateTime dateTime);
    void updateAppointmentStatus(Long appointmentId, AppointmentStatus status);
}
```

### Repository Layer

#### Data Access Pattern
```java
public interface Repository<T, ID> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
    boolean existsById(ID id);
}

public interface PatientRepository extends Repository<Patient, Long> {
    List<Patient> findByNameContaining(String name);
    Optional<Patient> findByPhone(String phone);
    List<Patient> findByRegistrationDateBetween(LocalDate start, LocalDate end);
}
```

### View Layer Architecture

#### Main Application Structure
```java
public class HospitalManagementApp {
    private LoginView loginView;
    private DashboardView dashboardView;
    private User currentUser;
    private SessionManager sessionManager;
}

public abstract class BaseView extends JFrame {
    protected User currentUser;
    protected ViewNavigator navigator;
    protected ValidationHelper validator;
}
```

#### Key View Components
- **LoginView**: Authentication interface with role-based redirection
- **DashboardView**: Role-specific dashboard with quick access widgets
- **PatientManagementView**: Patient registration, search, and management
- **AppointmentView**: Calendar-based appointment scheduling interface
- **BillingView**: Invoice generation and payment processing
- **ReportsView**: Analytics dashboard with export capabilities

## Data Models

### Database Schema Design

#### Core Tables Structure
```sql
-- Users and Authentication
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST') NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Patient Information
CREATE TABLE patients (
    patient_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    contact VARCHAR(20) NOT NULL,
    address TEXT,
    blood_group VARCHAR(5),
    medical_history TEXT,
    emergency_contact VARCHAR(20),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Doctor Information
CREATE TABLE doctors (
    doctor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    contact VARCHAR(20),
    availability_schedule JSON,
    consultation_fee DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Appointments
CREATE TABLE appointments (
    appointment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);
```

#### Relationship Mappings
- **One-to-Many**: Patient → Appointments, Doctor → Appointments
- **Many-to-One**: Appointment → Patient, Appointment → Doctor
- **One-to-One**: User → Doctor (for doctor users)
- **Many-to-Many**: Patient → Lab Tests (through junction table)

### Data Validation Rules
- **Patient ID**: Auto-generated, format: HMS-YYYY-NNNNNN
- **Phone Numbers**: Regex validation for format consistency
- **Email**: RFC 5322 compliant validation
- **Dates**: Business rule validation (no past appointment dates)
- **Medical Data**: Encrypted storage for sensitive information

## Error Handling

### Exception Hierarchy
```java
public class HMSException extends Exception {
    private final ErrorCode errorCode;
    private final String userMessage;
}

public enum ErrorCode {
    AUTHENTICATION_FAILED("AUTH001", "Invalid credentials"),
    INSUFFICIENT_PERMISSIONS("AUTH002", "Access denied"),
    PATIENT_NOT_FOUND("PAT001", "Patient record not found"),
    APPOINTMENT_CONFLICT("APT001", "Time slot not available"),
    DATABASE_ERROR("DB001", "Database operation failed");
}
```

### Error Handling Strategy
- **User-Friendly Messages**: Technical errors translated to user-understandable messages
- **Logging**: Comprehensive error logging with stack traces for debugging
- **Graceful Degradation**: System continues operation when non-critical components fail
- **Validation Feedback**: Real-time form validation with clear error indicators
- **Recovery Mechanisms**: Automatic retry for transient failures

### Critical Error Scenarios
1. **Database Connection Loss**: Automatic reconnection with user notification
2. **Session Timeout**: Graceful logout with data preservation options
3. **Concurrent Access**: Optimistic locking to prevent data conflicts
4. **Invalid Data Entry**: Comprehensive validation with specific error messages

## Testing Strategy

### Testing Pyramid Approach

#### Unit Testing (70%)
- **Model Classes**: Validation logic, business rules, data integrity
- **Service Layer**: Business logic, calculations, data transformations
- **Utility Classes**: Date handling, validation helpers, encryption utilities
- **Repository Layer**: Data access operations, query logic

#### Integration Testing (20%)
- **Database Integration**: Repository operations with actual database
- **Service Integration**: End-to-end service workflows
- **External Dependencies**: Database connections, file operations
- **Security Integration**: Authentication and authorization flows

#### UI Testing (10%)
- **Form Validation**: Input validation and error display
- **Navigation Flow**: User journey through different modules
- **Role-Based Access**: UI elements visibility based on user roles
- **Data Display**: Correct data rendering in tables and forms

### Test Data Management
- **Test Database**: Separate database instance for testing
- **Sample Data**: Realistic test data covering various scenarios
- **Data Cleanup**: Automated cleanup after test execution
- **Mock Objects**: Mocking external dependencies for isolated testing

### Performance Testing
- **Load Testing**: Concurrent user simulation (100+ users)
- **Database Performance**: Query optimization and indexing validation
- **Memory Usage**: Memory leak detection and optimization
- **Response Time**: Sub-2-second response time validation

### Security Testing
- **Authentication Testing**: Login security, session management
- **Authorization Testing**: Role-based access control validation
- **Data Protection**: Encryption and data masking verification
- **SQL Injection**: Input sanitization and prepared statement validation

## Implementation Considerations

### Development Environment Setup
- **IDE**: Kiro IDE with Java development plugins
- **Version Control**: Git with feature branch workflow
- **Database**: MySQL for development, SQLite for testing
- **Build Automation**: Maven with automated testing pipeline

### Code Quality Standards
- **Coding Standards**: Google Java Style Guide compliance
- **Documentation**: Javadoc for all public APIs
- **Code Coverage**: Minimum 80% test coverage requirement
- **Static Analysis**: SonarQube integration for code quality metrics

### Deployment Strategy
- **Packaging**: Executable JAR with embedded dependencies
- **Database Migration**: Flyway for database schema versioning
- **Configuration**: External configuration files for environment-specific settings
- **Installation**: Automated installer with database setup wizard

### Scalability Considerations
- **Connection Pooling**: HikariCP for efficient database connections
- **Caching**: In-memory caching for frequently accessed data
- **Modular Design**: Plugin architecture for future feature additions
- **Performance Monitoring**: Built-in performance metrics and logging