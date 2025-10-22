# Hospital Management System - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Application Deployment](#application-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Production Configuration](#production-configuration)
7. [SSL/TLS Setup](#ssltls-setup)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup Configuration](#backup-configuration)
10. [Security Hardening](#security-hardening)

## Prerequisites

### System Requirements

#### Minimum Requirements
- **CPU**: 4 cores, 2.4 GHz
- **RAM**: 8 GB
- **Storage**: 100 GB SSD
- **Network**: 100 Mbps internet connection
- **OS**: Ubuntu 20.04 LTS, CentOS 8, or Windows Server 2019

#### Recommended Requirements
- **CPU**: 8 cores, 3.0 GHz
- **RAM**: 16 GB
- **Storage**: 500 GB SSD with RAID 1
- **Network**: 1 Gbps internet connection
- **Load Balancer**: For high availability setup

#### Software Dependencies
- **Node.js**: Version 18.x or higher
- **PostgreSQL**: Version 15.x or higher
- **Redis**: Version 7.x or higher
- **nginx**: Version 1.20 or higher
- **Docker**: Version 20.10 or higher (for containerized deployment)
- **Docker Compose**: Version 2.0 or higher

### Network Requirements
- **Ports**: 80 (HTTP), 443 (HTTPS), 3000 (Backend API), 5432 (PostgreSQL), 6379 (Redis)
- **Firewall**: Configure to allow necessary ports
- **DNS**: Proper domain configuration for production

## Environment Setup

### 1. Server Preparation

#### Ubuntu/Debian Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git build-essential

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### CentOS/RHEL Setup
```bash
# Update system packages
sudo yum update -y

# Install EPEL repository
sudo yum install -y epel-release

# Install required packages
sudo yum install -y curl wget git gcc-c++ make

# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Database Installation

#### PostgreSQL Installation
```bash
# Ubuntu/Debian
sudo apt install -y postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE hospital_management;
CREATE USER hospital_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE hospital_management TO hospital_user;
\q
```

#### Redis Installation
```bash
# Ubuntu/Debian
sudo apt install -y redis-server

# CentOS/RHEL
sudo yum install -y redis
sudo systemctl enable redis
sudo systemctl start redis

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: requirepass your_redis_password
sudo systemctl restart redis
```

### 3. nginx Installation and Configuration
```bash
# Install nginx
sudo apt install -y nginx  # Ubuntu/Debian
sudo yum install -y nginx   # CentOS/RHEL

# Enable and start nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Database Configuration

### 1. Database Schema Setup

#### Clone Repository
```bash
git clone https://github.com/your-org/hospital-management-system.git
cd hospital-management-system
```

#### Backend Database Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
nano .env
```

#### Environment Configuration (.env)
```env
# Database Configuration
DATABASE_URL="postgresql://hospital_user:secure_password@localhost:5432/hospital_management"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD="your_redis_password"

# JWT Configuration
JWT_SECRET="your-super-secure-jwt-secret-key-here"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="production"
PORT=3000
API_BASE_URL="https://your-domain.com/api"

# File Upload Configuration
UPLOAD_PATH="/var/uploads/hospital"
MAX_FILE_SIZE="10485760"  # 10MB

# Email Configuration
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"

# Security Configuration
CORS_ORIGIN="https://your-domain.com"
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
LOG_LEVEL="info"
ENABLE_AUDIT_LOGGING=true
```

#### Run Database Migrations
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

### 2. Database Optimization

#### PostgreSQL Configuration
```bash
sudo nano /etc/postgresql/15/main/postgresql.conf
```

```conf
# Memory Configuration
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Connection Configuration
max_connections = 200
listen_addresses = 'localhost'

# Performance Configuration
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# Logging Configuration
log_statement = 'mod'
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

## Application Deployment

### 1. Backend Deployment

#### Build Application
```bash
cd backend

# Install production dependencies
npm ci --only=production

# Build TypeScript
npm run build

# Create systemd service
sudo nano /etc/systemd/system/hospital-backend.service
```

#### Systemd Service Configuration
```ini
[Unit]
Description=Hospital Management System Backend
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hospital-management/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=hospital-backend

[Install]
WantedBy=multi-user.target
```

#### Start Backend Service
```bash
# Enable and start service
sudo systemctl enable hospital-backend
sudo systemctl start hospital-backend

# Check status
sudo systemctl status hospital-backend
```

### 2. Frontend Deployment

#### Build Frontend
```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build
```

#### nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/hospital-management
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/your-domain.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Frontend Static Files
    location / {
        root /var/www/hospital-management/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Socket.io WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # File Uploads
    location /uploads/ {
        alias /var/uploads/hospital/;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/ {
        limit_req zone=api burst=20 nodelay;
    }
}
```

#### Enable Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hospital-management /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Docker Deployment

### 1. Docker Compose Configuration

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: hospital-postgres
    environment:
      POSTGRES_DB: hospital_management
      POSTGRES_USER: hospital_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - hospital-network

  redis:
    image: redis:7-alpine
    container_name: hospital-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - hospital-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: hospital-backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://hospital_user:${POSTGRES_PASSWORD}@postgres:5432/hospital_management
      REDIS_URL: redis://redis:6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    volumes:
      - uploads:/var/uploads/hospital
      - logs:/var/logs/hospital
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - hospital-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: hospital-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl/certs
      - uploads:/var/uploads/hospital
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - hospital-network

  nginx:
    image: nginx:alpine
    container_name: hospital-nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
      - uploads:/var/uploads/hospital
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - hospital-network

volumes:
  postgres_data:
  redis_data:
  uploads:
  logs:

networks:
  hospital-network:
    driver: bridge
```

#### Environment Variables (.env)
```env
POSTGRES_PASSWORD=secure_postgres_password
REDIS_PASSWORD=secure_redis_password
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here
```

### 2. Docker Deployment Commands

#### Build and Deploy
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Update and restart
docker-compose pull
docker-compose up -d --force-recreate
```

## Production Configuration

### 1. Performance Optimization

#### Node.js Optimization
```bash
# Set Node.js production environment
export NODE_ENV=production

# Optimize memory usage
export NODE_OPTIONS="--max-old-space-size=4096"

# Enable cluster mode (PM2)
npm install -g pm2

# PM2 Configuration
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'hospital-backend',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/logs/hospital/err.log',
    out_file: '/var/logs/hospital/out.log',
    log_file: '/var/logs/hospital/combined.log',
    time: true
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 2. Database Performance Tuning

#### PostgreSQL Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_patients_patient_id ON patients(patient_id);
CREATE INDEX CONCURRENTLY idx_appointments_date ON appointments(appointment_date);
CREATE INDEX CONCURRENTLY idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX CONCURRENTLY idx_appointments_patient ON appointments(patient_id);
CREATE INDEX CONCURRENTLY idx_users_username ON users(username);
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Analyze tables for query optimization
ANALYZE patients;
ANALYZE appointments;
ANALYZE doctors;
ANALYZE users;
```

## SSL/TLS Setup

### 1. Let's Encrypt SSL Certificate

#### Install Certbot
```bash
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx
```

#### Obtain SSL Certificate
```bash
# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run

# Set up automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 2. Custom SSL Certificate

#### Generate Private Key and CSR
```bash
# Generate private key
sudo openssl genrsa -out /etc/ssl/private/your-domain.key 2048

# Generate certificate signing request
sudo openssl req -new -key /etc/ssl/private/your-domain.key -out /etc/ssl/certs/your-domain.csr

# Install certificate (provided by CA)
sudo cp your-domain.crt /etc/ssl/certs/
sudo cp intermediate.crt /etc/ssl/certs/

# Set proper permissions
sudo chmod 600 /etc/ssl/private/your-domain.key
sudo chmod 644 /etc/ssl/certs/your-domain.crt
```

## Monitoring and Logging

### 1. Application Monitoring

#### Install Monitoring Tools
```bash
# Install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.40.0/prometheus-2.40.0.linux-amd64.tar.gz
tar xvfz prometheus-*.tar.gz
sudo mv prometheus-2.40.0.linux-amd64 /opt/prometheus

# Install Grafana
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install grafana
```

#### Configure Monitoring
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'hospital-backend'
    static_configs:
      - targets: ['localhost:3000']
  
  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']
  
  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']
```

### 2. Log Management

#### Configure Log Rotation
```bash
sudo nano /etc/logrotate.d/hospital-management
```

```conf
/var/logs/hospital/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload hospital-backend
    endscript
}
```

#### Centralized Logging (ELK Stack)
```bash
# Install Elasticsearch
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt update
sudo apt install elasticsearch

# Install Logstash
sudo apt install logstash

# Install Kibana
sudo apt install kibana

# Configure and start services
sudo systemctl enable elasticsearch logstash kibana
sudo systemctl start elasticsearch logstash kibana
```

## Backup Configuration

### 1. Database Backup

#### Automated PostgreSQL Backup
```bash
#!/bin/bash
# /usr/local/bin/backup-hospital-db.sh

BACKUP_DIR="/var/backups/hospital"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="hospital_management"
DB_USER="hospital_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/hospital_db_$DATE.sql.gz

# Remove backups older than 30 days
find $BACKUP_DIR -name "hospital_db_*.sql.gz" -mtime +30 -delete

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR/hospital_db_$DATE.sql.gz s3://your-backup-bucket/
```

#### Schedule Backup
```bash
# Add to crontab
echo "0 2 * * * /usr/local/bin/backup-hospital-db.sh" | sudo crontab -
```

### 2. File System Backup

#### Application Files Backup
```bash
#!/bin/bash
# /usr/local/bin/backup-hospital-files.sh

BACKUP_DIR="/var/backups/hospital"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/hospital-management"
UPLOAD_DIR="/var/uploads/hospital"

# Create backup
tar -czf $BACKUP_DIR/hospital_files_$DATE.tar.gz $APP_DIR $UPLOAD_DIR

# Remove old backups
find $BACKUP_DIR -name "hospital_files_*.tar.gz" -mtime +7 -delete
```

## Security Hardening

### 1. System Security

#### Firewall Configuration
```bash
# Install and configure UFW
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Allow from specific IPs only (optional)
sudo ufw allow from 192.168.1.0/24 to any port 22
```

#### Fail2Ban Configuration
```bash
# Install Fail2Ban
sudo apt install fail2ban

# Configure Fail2Ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
```

### 2. Application Security

#### Security Headers
```nginx
# Add to nginx configuration
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' wss: https:;";
```

#### Database Security
```sql
-- Revoke unnecessary permissions
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO hospital_user;

-- Enable row level security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY patient_access_policy ON patients
    FOR ALL TO hospital_user
    USING (true);  -- Customize based on your access requirements
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Server requirements met
- [ ] Dependencies installed
- [ ] Database configured
- [ ] SSL certificates obtained
- [ ] Environment variables set
- [ ] Security measures implemented

### Deployment
- [ ] Application built successfully
- [ ] Database migrations completed
- [ ] Services started and running
- [ ] nginx configuration tested
- [ ] SSL/TLS working correctly
- [ ] API endpoints responding

### Post-Deployment
- [ ] Monitoring configured
- [ ] Backup systems active
- [ ] Log rotation configured
- [ ] Performance optimized
- [ ] Security hardening completed
- [ ] Documentation updated

### Testing
- [ ] Application functionality tested
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Backup and restore tested
- [ ] Disaster recovery plan verified

---

*For additional support or questions about deployment, contact the technical team or refer to the troubleshooting guide.*