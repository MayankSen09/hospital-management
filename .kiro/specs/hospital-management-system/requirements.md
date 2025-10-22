# Requirements Document

## Introduction

The Hospital Management System is a comprehensive Java-based application designed to streamline hospital operations, patient care, and administrative tasks. The system will provide role-based access control for different hospital staff members (Admin, Doctor, Nurse, Receptionist, Pharmacist) and manage core hospital functions including patient management, appointments, billing, pharmacy operations, and reporting.

## Requirements

### Requirement 1: User Authentication and Authorization

**User Story:** As a hospital staff member, I want to securely log into the system with role-based access, so that I can access only the features relevant to my job responsibilities.

#### Acceptance Criteria

1. WHEN a user enters valid credentials THEN the system SHALL authenticate the user and grant access based on their role
2. WHEN a user enters invalid credentials THEN the system SHALL deny access and display an error message
3. WHEN a user session is inactive for 30 minutes THEN the system SHALL automatically log out the user
4. WHEN a user logs in THEN the system SHALL encrypt their password using secure hashing
5. IF a user has Admin role THEN the system SHALL provide access to all system modules
6. IF a user has Doctor role THEN the system SHALL provide access to patient records, appointments, and medical history
7. IF a user has Nurse role THEN the system SHALL provide access to patient care modules and ward management
8. IF a user has Receptionist role THEN the system SHALL provide access to patient registration and appointment scheduling
9. IF a user has Pharmacist role THEN the system SHALL provide access to pharmacy and medicine inventory modules

### Requirement 2: Patient Management

**User Story:** As a hospital receptionist, I want to register and manage patient information, so that I can maintain accurate patient records and facilitate proper patient care.

#### Acceptance Criteria

1. WHEN registering a new patient THEN the system SHALL generate a unique Patient ID automatically
2. WHEN entering patient details THEN the system SHALL validate all required fields (name, age, gender, contact, address)
3. WHEN searching for a patient THEN the system SHALL allow search by Patient ID, name, or phone number
4. WHEN updating patient information THEN the system SHALL maintain a history of changes with timestamps
5. WHEN a patient is admitted THEN the system SHALL record admission details and link to available bed
6. WHEN a patient is discharged THEN the system SHALL update bed availability and generate discharge summary
7. IF duplicate patient information is entered THEN the system SHALL prevent creation and suggest existing records

### Requirement 3: Appointment Management

**User Story:** As a hospital receptionist, I want to schedule and manage patient appointments, so that I can optimize doctor schedules and ensure efficient patient flow.

#### Acceptance Criteria

1. WHEN scheduling an appointment THEN the system SHALL check doctor availability for the requested time slot
2. WHEN creating an appointment THEN the system SHALL assign a unique appointment ID and confirm booking
3. WHEN viewing appointments THEN the system SHALL display daily and weekly calendar views
4. WHEN an appointment time conflicts THEN the system SHALL prevent double-booking and suggest alternative times
5. WHEN appointment status changes THEN the system SHALL update status to Scheduled, Completed, or Cancelled
6. WHEN an appointment is cancelled THEN the system SHALL free up the time slot for other bookings
7. IF appointment is within 24 hours THEN the system SHALL send reminder notifications

### Requirement 4: Doctor Management

**User Story:** As a hospital administrator, I want to manage doctor profiles and schedules, so that I can efficiently allocate medical resources and track doctor performance.

#### Acceptance Criteria

1. WHEN registering a doctor THEN the system SHALL capture specialization, contact details, and availability schedule
2. WHEN updating doctor availability THEN the system SHALL reflect changes in appointment scheduling system
3. WHEN viewing doctor information THEN the system SHALL display consultation history and patient feedback
4. WHEN generating reports THEN the system SHALL provide doctor performance metrics and patient load statistics
5. IF a doctor is unavailable THEN the system SHALL prevent new appointment bookings for that time period

### Requirement 5: Ward and Bed Management

**User Story:** As a hospital nurse, I want to manage ward occupancy and bed allocation, so that I can efficiently utilize hospital resources and ensure proper patient accommodation.

#### Acceptance Criteria

1. WHEN viewing ward status THEN the system SHALL display real-time bed availability for all ward types (General, ICU, Private, Semi-private)
2. WHEN allocating a bed THEN the system SHALL update bed status to occupied and link to patient record
3. WHEN deallocating a bed THEN the system SHALL update bed status to available and clear patient linkage
4. WHEN generating occupancy reports THEN the system SHALL provide ward-wise and bed-wise utilization statistics
5. IF all beds in a ward type are occupied THEN the system SHALL alert staff and suggest alternative accommodations

### Requirement 6: Billing and Payment System

**User Story:** As a hospital billing clerk, I want to generate accurate patient bills and process payments, so that I can ensure proper revenue collection and maintain financial records.

#### Acceptance Criteria

1. WHEN generating a bill THEN the system SHALL itemize all charges (consultation, tests, medicines, room charges)
2. WHEN processing payment THEN the system SHALL accept multiple payment methods (cash, card, insurance)
3. WHEN payment is completed THEN the system SHALL generate receipt and update payment status
4. WHEN viewing billing history THEN the system SHALL display all transactions with dates and amounts
5. WHEN printing invoices THEN the system SHALL format bills with hospital letterhead and itemized details
6. IF payment is overdue THEN the system SHALL flag the account and send payment reminders

### Requirement 7: Pharmacy Management

**User Story:** As a hospital pharmacist, I want to manage medicine inventory and dispensing, so that I can ensure adequate stock levels and proper medication distribution.

#### Acceptance Criteria

1. WHEN adding medicine to inventory THEN the system SHALL record medicine details, quantity, price, and expiry date
2. WHEN dispensing medicine THEN the system SHALL update stock quantity and record dispensing details
3. WHEN stock falls below minimum level THEN the system SHALL generate low stock alerts
4. WHEN medicine expires THEN the system SHALL flag expired items and prevent dispensing
5. WHEN processing prescriptions THEN the system SHALL verify medicine availability and dosage instructions
6. IF prescription medicine is out of stock THEN the system SHALL suggest alternative medicines or notify for restocking

### Requirement 8: Laboratory Management

**User Story:** As a laboratory technician, I want to manage test orders and results, so that I can provide timely and accurate diagnostic information to doctors.

#### Acceptance Criteria

1. WHEN registering a lab test THEN the system SHALL assign unique test ID and link to patient record
2. WHEN entering test results THEN the system SHALL validate data format and store results securely
3. WHEN generating reports THEN the system SHALL format results according to test type (Blood, X-Ray, MRI, CT Scan)
4. WHEN test is completed THEN the system SHALL notify the requesting doctor and update patient records
5. WHEN viewing test history THEN the system SHALL display chronological test results for patient analysis
6. IF test results are abnormal THEN the system SHALL flag critical values for immediate attention

### Requirement 9: Staff Management

**User Story:** As a hospital HR administrator, I want to manage staff information and attendance, so that I can maintain proper staffing levels and payroll management.

#### Acceptance Criteria

1. WHEN registering staff THEN the system SHALL capture personal details, role, contact information, and salary details
2. WHEN recording attendance THEN the system SHALL track check-in/check-out times and calculate working hours
3. WHEN managing shifts THEN the system SHALL assign staff to different shifts and track shift patterns
4. WHEN processing payroll THEN the system SHALL calculate salaries based on attendance and working hours
5. WHEN evaluating performance THEN the system SHALL maintain performance records and feedback history

### Requirement 10: Reporting and Analytics

**User Story:** As a hospital administrator, I want to generate comprehensive reports and analytics, so that I can make informed decisions about hospital operations and resource allocation.

#### Acceptance Criteria

1. WHEN generating patient statistics THEN the system SHALL provide reports on patient demographics, admission trends, and treatment outcomes
2. WHEN creating revenue reports THEN the system SHALL display income by department, payment methods, and time periods
3. WHEN analyzing occupancy THEN the system SHALL show bed utilization rates and ward efficiency metrics
4. WHEN exporting reports THEN the system SHALL support PDF and Excel formats for external sharing
5. WHEN viewing daily operations THEN the system SHALL provide real-time dashboard with key performance indicators
6. IF report generation takes longer than expected THEN the system SHALL provide progress indicators and estimated completion time