# Hospital Management System - Troubleshooting Guide

## Table of Contents
1. [Common Issues](#common-issues)
2. [Authentication Problems](#authentication-problems)
3. [Database Issues](#database-issues)
4. [Performance Problems](#performance-problems)
5. [Network and Connectivity](#network-and-connectivity)
6. [Application Errors](#application-errors)
7. [Deployment Issues](#deployment-issues)
8. [Browser Compatibility](#browser-compatibility)
9. [Mobile App Issues](#mobile-app-issues)
10. [System Monitoring](#system-monitoring)

## Common Issues

### Issue: System Running Slowly

#### Symptoms
- Pages take long time to load
- API responses are delayed
- Database queries timeout
- Users experience lag in interactions

#### Diagnosis Steps
1. **Check System Resources**
   ```bash
   # Check CPU usage
   top -p $(pgrep -f "hospital")
   
   # Check memory usage
   free -h
   
   # Check disk usage
   df -h
   
   # Check disk I/O
   iostat -x 1
   ```

2. **Check Database Performance**
   ```sql
   -- Check active connections
   SELECT count(*) FROM pg_stat_activity;
   
   -- Check slow queries
   SELECT query, mean_exec_time, calls 
   FROM pg_stat_statements 
   ORDER BY mean_exec_time DESC 
   LIMIT 10;
   
   -- Check table sizes
   SELECT schemaname, tablename, 
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
   FROM pg_tables 
   WHERE schemaname = 'public' 
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

3. **Check Application Logs**
   ```bash
   # Backend logs
   tail -f /var/logs/hospital/combined.log
   
   # nginx access logs
   tail -f /var/log/nginx/access.log
   
   # nginx error logs
   tail -f /var/log/nginx/error.log
   ```

#### Solutions
1. **Optimize Database**
   ```sql
   -- Analyze tables
   ANALYZE;
   
   -- Reindex if needed
   REINDEX DATABASE hospital_management;
   
   -- Update statistics
   VACUUM ANALYZE;
   ```

2. **Scale Resources**
   ```bash
   # Increase PM2 instances
   pm2 scale hospital-backend +2
   
   # Restart services
   pm2 restart hospital-backend
   sudo systemctl restart nginx
   ```

3. **Clear Caches**
   ```bash
   # Clear Redis cache
   redis-cli FLUSHALL
   
   # Clear browser cache (instruct users)
   # Ctrl+Shift+R (Chrome/Firefox)
   ```

### Issue: Application Won't Start

#### Symptoms
- Service fails to start
- Error messages in logs
- Port binding failures
- Database connection errors

#### Diagnosis Steps
1. **Check Service Status**
   ```bash
   sudo systemctl status hospital-backend
   sudo systemctl status postgresql
   sudo systemctl status redis
   sudo systemctl status nginx
   ```

2. **Check Port Availability**
   ```bash
   # Check if ports are in use
   sudo netstat -tlnp | grep :3000
   sudo netstat -tlnp | grep :5432
   sudo netstat -tlnp | grep :6379
   ```

3. **Check Configuration Files**
   ```bash
   # Validate nginx configuration
   sudo nginx -t
   
   # Check environment variables
   cat /var/www/hospital-management/backend/.env
   ```

#### Solutions
1. **Fix Port Conflicts**
   ```bash
   # Kill process using port
   sudo kill -9 $(lsof -t -i:3000)
   
   # Or change port in configuration
   nano /var/www/hospital-management/backend/.env
   # PORT=3001
   ```

2. **Fix Database Connection**
   ```bash
   # Restart PostgreSQL
   sudo systemctl restart postgresql
   
   # Check database connectivity
   psql -h localhost -U hospital_user -d hospital_management
   ```

3. **Fix Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R www-data:www-data /var/www/hospital-management
   sudo chmod -R 755 /var/www/hospital-management
   ```

## Authentication Problems

### Issue: Users Cannot Log In

#### Symptoms
- "Invalid credentials" error with correct password
- Login page redirects to itself
- Session expires immediately
- JWT token errors

#### Diagnosis Steps
1. **Check User Account Status**
   ```sql
   SELECT id, username, email, is_active, last_login 
   FROM users 
   WHERE username = 'problematic_user';
   ```

2. **Check JWT Configuration**
   ```bash
   # Verify JWT secret is set
   grep JWT_SECRET /var/www/hospital-management/backend/.env
   
   # Check token expiration settings
   grep JWT_EXPIRES_IN /var/www/hospital-management/backend/.env
   ```

3. **Check Authentication Logs**
   ```bash
   # Filter authentication attempts
   grep "AUTH" /var/logs/hospital/combined.log | tail -20
   ```

#### Solutions
1. **Reset User Password**
   ```sql
   -- Generate new password hash (use bcrypt)
   UPDATE users 
   SET password_hash = '$2b$10$newhashedpassword' 
   WHERE username = 'username';
   ```

2. **Fix JWT Configuration**
   ```bash
   # Generate new JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   
   # Update .env file
   nano /var/www/hospital-management/backend/.env
   JWT_SECRET=new_generated_secret
   ```

3. **Clear Sessions**
   ```bash
   # Clear Redis sessions
   redis-cli DEL "sess:*"
   
   # Restart backend service
   pm2 restart hospital-backend
   ```

### Issue: Session Expires Too Quickly

#### Symptoms
- Users logged out after few minutes
- Frequent re-authentication required
- "Session expired" messages

#### Solutions
1. **Adjust Session Timeout**
   ```bash
   # Update environment variables
   nano /var/www/hospital-management/backend/.env
   JWT_EXPIRES_IN=60m  # Increase from 15m to 60m
   SESSION_TIMEOUT=3600000  # 1 hour in milliseconds
   ```

2. **Implement Token Refresh**
   ```javascript
   // Frontend: Automatic token refresh
   setInterval(() => {
     if (isTokenExpiringSoon()) {
       refreshAuthToken();
     }
   }, 300000); // Check every 5 minutes
   ```

## Database Issues

### Issue: Database Connection Failures

#### Symptoms
- "Connection refused" errors
- "Too many connections" errors
- Slow database responses
- Connection timeouts

#### Diagnosis Steps
1. **Check PostgreSQL Status**
   ```bash
   sudo systemctl status postgresql
   
   # Check PostgreSQL logs
   sudo tail -f /var/log/postgresql/postgresql-15-main.log
   ```

2. **Check Connection Limits**
   ```sql
   -- Check current connections
   SELECT count(*) as current_connections FROM pg_stat_activity;
   
   -- Check connection limit
   SHOW max_connections;
   
   -- Check connection by database
   SELECT datname, count(*) 
   FROM pg_stat_activity 
   GROUP BY datname;
   ```

3. **Check Database Performance**
   ```sql
   -- Check for long-running queries
   SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
   FROM pg_stat_activity 
   WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
   ```

#### Solutions
1. **Increase Connection Limit**
   ```bash
   sudo nano /etc/postgresql/15/main/postgresql.conf
   # max_connections = 200  # Increase from default 100
   
   sudo systemctl restart postgresql
   ```

2. **Optimize Connection Pooling**
   ```javascript
   // Backend: Prisma connection pooling
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL + "?connection_limit=20&pool_timeout=20"
       }
     }
   });
   ```

3. **Kill Long-Running Queries**
   ```sql
   -- Terminate specific query
   SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE pid = 12345;
   
   -- Terminate all idle connections
   SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE state = 'idle' 
   AND state_change < current_timestamp - INTERVAL '1 hour';
   ```

### Issue: Database Corruption or Data Loss

#### Symptoms
- Missing patient records
- Corrupted data in tables
- Foreign key constraint errors
- Inconsistent data states

#### Diagnosis Steps
1. **Check Database Integrity**
   ```sql
   -- Check for constraint violations
   SELECT conname, conrelid::regclass 
   FROM pg_constraint 
   WHERE NOT convalidated;
   
   -- Check table statistics
   SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
   FROM pg_stat_user_tables;
   ```

2. **Verify Backup Integrity**
   ```bash
   # Test backup restoration
   pg_restore --list /var/backups/hospital/latest_backup.sql.gz
   ```

#### Solutions
1. **Restore from Backup**
   ```bash
   # Stop application
   pm2 stop hospital-backend
   
   # Create backup of current state
   pg_dump -U hospital_user hospital_management > /tmp/current_state.sql
   
   # Restore from backup
   dropdb -U hospital_user hospital_management
   createdb -U hospital_user hospital_management
   gunzip -c /var/backups/hospital/hospital_db_20231201_020000.sql.gz | psql -U hospital_user hospital_management
   
   # Restart application
   pm2 start hospital-backend
   ```

2. **Fix Data Consistency**
   ```sql
   -- Fix orphaned records
   DELETE FROM appointments 
   WHERE patient_id NOT IN (SELECT id FROM patients);
   
   -- Update sequences
   SELECT setval('patients_id_seq', (SELECT MAX(id) FROM patients));
   ```

## Performance Problems

### Issue: Slow Page Loading

#### Symptoms
- Frontend pages load slowly
- API responses take too long
- Images and assets load slowly
- Poor user experience

#### Diagnosis Steps
1. **Check Network Performance**
   ```bash
   # Test API response times
   curl -w "@curl-format.txt" -o /dev/null -s "https://your-domain.com/api/patients"
   
   # Check nginx access logs for response times
   tail -f /var/log/nginx/access.log | grep "GET /api"
   ```

2. **Analyze Frontend Performance**
   ```javascript
   // Browser DevTools: Network tab
   // Check for:
   // - Large bundle sizes
   // - Unoptimized images
   // - Too many HTTP requests
   // - Slow API calls
   ```

3. **Check Database Query Performance**
   ```sql
   -- Enable query logging
   ALTER SYSTEM SET log_statement = 'all';
   ALTER SYSTEM SET log_min_duration_statement = 1000;
   SELECT pg_reload_conf();
   ```

#### Solutions
1. **Optimize Frontend**
   ```bash
   # Enable gzip compression in nginx
   sudo nano /etc/nginx/sites-available/hospital-management
   
   # Add to server block:
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
   ```

2. **Implement Caching**
   ```javascript
   // Backend: Add Redis caching
   const redis = require('redis');
   const client = redis.createClient();
   
   // Cache frequently accessed data
   app.get('/api/patients', async (req, res) => {
     const cacheKey = `patients:${JSON.stringify(req.query)}`;
     const cached = await client.get(cacheKey);
     
     if (cached) {
       return res.json(JSON.parse(cached));
     }
     
     const patients = await getPatients(req.query);
     await client.setex(cacheKey, 300, JSON.stringify(patients)); // 5 min cache
     res.json(patients);
   });
   ```

3. **Optimize Database Queries**
   ```sql
   -- Add missing indexes
   CREATE INDEX CONCURRENTLY idx_appointments_date_doctor 
   ON appointments(appointment_date, doctor_id);
   
   -- Optimize queries
   EXPLAIN ANALYZE SELECT * FROM patients WHERE name ILIKE '%john%';
   ```

### Issue: High Memory Usage

#### Symptoms
- Server running out of memory
- Application crashes with OOM errors
- Slow system performance
- Swap usage high

#### Diagnosis Steps
1. **Check Memory Usage**
   ```bash
   # Overall memory usage
   free -h
   
   # Process-specific memory usage
   ps aux --sort=-%mem | head -10
   
   # Node.js heap usage
   node -e "console.log(process.memoryUsage())"
   ```

2. **Check for Memory Leaks**
   ```bash
   # Monitor memory over time
   while true; do
     ps -p $(pgrep -f hospital-backend) -o pid,vsz,rss,pmem,comm
     sleep 60
   done
   ```

#### Solutions
1. **Optimize Node.js Memory**
   ```bash
   # Increase heap size
   export NODE_OPTIONS="--max-old-space-size=4096"
   
   # Enable garbage collection logging
   export NODE_OPTIONS="--max-old-space-size=4096 --trace-gc"
   
   pm2 restart hospital-backend
   ```

2. **Optimize Database Memory**
   ```bash
   sudo nano /etc/postgresql/15/main/postgresql.conf
   
   # Adjust memory settings
   shared_buffers = 256MB
   effective_cache_size = 1GB
   work_mem = 4MB
   maintenance_work_mem = 64MB
   
   sudo systemctl restart postgresql
   ```

## Network and Connectivity

### Issue: API Endpoints Not Responding

#### Symptoms
- 502 Bad Gateway errors
- Connection refused errors
- Timeout errors
- CORS errors

#### Diagnosis Steps
1. **Check Service Status**
   ```bash
   # Check if backend is running
   curl -I http://localhost:3000/api/health
   
   # Check nginx status
   sudo systemctl status nginx
   
   # Check nginx configuration
   sudo nginx -t
   ```

2. **Check Network Connectivity**
   ```bash
   # Test internal connectivity
   telnet localhost 3000
   
   # Check firewall rules
   sudo ufw status
   
   # Check iptables
   sudo iptables -L
   ```

#### Solutions
1. **Fix nginx Proxy Configuration**
   ```nginx
   # Update nginx configuration
   location /api/ {
     proxy_pass http://localhost:3000/;
     proxy_set_header Host $host;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header X-Forwarded-Proto $scheme;
     
     # Add timeout settings
     proxy_connect_timeout 60s;
     proxy_send_timeout 60s;
     proxy_read_timeout 60s;
   }
   ```

2. **Fix CORS Issues**
   ```javascript
   // Backend: Update CORS configuration
   const cors = require('cors');
   
   app.use(cors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

### Issue: SSL/TLS Certificate Problems

#### Symptoms
- "Certificate not trusted" warnings
- SSL handshake failures
- Mixed content warnings
- Certificate expired errors

#### Diagnosis Steps
1. **Check Certificate Status**
   ```bash
   # Check certificate expiration
   openssl x509 -in /etc/ssl/certs/your-domain.crt -text -noout | grep "Not After"
   
   # Test SSL connection
   openssl s_client -connect your-domain.com:443 -servername your-domain.com
   
   # Check certificate chain
   curl -I https://your-domain.com
   ```

#### Solutions
1. **Renew SSL Certificate**
   ```bash
   # Let's Encrypt renewal
   sudo certbot renew
   
   # Test renewal
   sudo certbot renew --dry-run
   
   # Reload nginx
   sudo systemctl reload nginx
   ```

2. **Fix Certificate Chain**
   ```bash
   # Combine certificates
   cat your-domain.crt intermediate.crt > /etc/ssl/certs/your-domain-chain.crt
   
   # Update nginx configuration
   ssl_certificate /etc/ssl/certs/your-domain-chain.crt;
   ```

## Application Errors

### Issue: 500 Internal Server Error

#### Symptoms
- Generic server error messages
- API endpoints returning 500 status
- Application crashes
- Error pages displayed

#### Diagnosis Steps
1. **Check Application Logs**
   ```bash
   # Backend error logs
   tail -f /var/logs/hospital/err.log
   
   # PM2 logs
   pm2 logs hospital-backend --lines 50
   
   # System logs
   journalctl -u hospital-backend -f
   ```

2. **Check Error Details**
   ```javascript
   // Enable detailed error logging
   app.use((err, req, res, next) => {
     console.error('Error details:', {
       message: err.message,
       stack: err.stack,
       url: req.url,
       method: req.method,
       body: req.body,
       user: req.user?.id
     });
     
     res.status(500).json({
       success: false,
       error: process.env.NODE_ENV === 'production' 
         ? 'Internal server error' 
         : err.message
     });
   });
   ```

#### Solutions
1. **Fix Common Errors**
   ```javascript
   // Handle database connection errors
   prisma.$connect().catch(err => {
     console.error('Database connection failed:', err);
     process.exit(1);
   });
   
   // Handle unhandled promise rejections
   process.on('unhandledRejection', (reason, promise) => {
     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
   });
   
   // Handle uncaught exceptions
   process.on('uncaughtException', (error) => {
     console.error('Uncaught Exception:', error);
     process.exit(1);
   });
   ```

### Issue: Data Validation Errors

#### Symptoms
- Form submission failures
- "Invalid data" error messages
- API validation errors
- Data not saving correctly

#### Diagnosis Steps
1. **Check Validation Rules**
   ```javascript
   // Review validation schemas
   const patientSchema = {
     name: { required: true, minLength: 2, maxLength: 100 },
     age: { required: true, min: 0, max: 150 },
     contact: { required: true, pattern: /^\+?[1-9]\d{1,14}$/ }
   };
   ```

2. **Test API Endpoints**
   ```bash
   # Test with invalid data
   curl -X POST https://your-domain.com/api/patients \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"name": "", "age": -1}'
   ```

#### Solutions
1. **Fix Frontend Validation**
   ```javascript
   // Add client-side validation
   const validatePatient = (data) => {
     const errors = {};
     
     if (!data.name || data.name.trim().length < 2) {
       errors.name = 'Name must be at least 2 characters';
     }
     
     if (!data.age || data.age < 0 || data.age > 150) {
       errors.age = 'Age must be between 0 and 150';
     }
     
     return errors;
   };
   ```

2. **Improve Error Messages**
   ```javascript
   // Backend: Better error responses
   app.use((err, req, res, next) => {
     if (err.name === 'ValidationError') {
       return res.status(400).json({
         success: false,
         error: 'Validation failed',
         details: err.details.map(detail => ({
           field: detail.path[0],
           message: detail.message
         }))
       });
     }
     next(err);
   });
   ```

## Deployment Issues

### Issue: Docker Container Failures

#### Symptoms
- Containers won't start
- Container exits immediately
- Port binding failures
- Volume mount issues

#### Diagnosis Steps
1. **Check Container Status**
   ```bash
   # List all containers
   docker ps -a
   
   # Check container logs
   docker logs hospital-backend
   docker logs hospital-frontend
   
   # Inspect container
   docker inspect hospital-backend
   ```

2. **Check Docker Compose**
   ```bash
   # Validate compose file
   docker-compose config
   
   # Check service status
   docker-compose ps
   
   # View service logs
   docker-compose logs backend
   ```

#### Solutions
1. **Fix Container Issues**
   ```bash
   # Rebuild containers
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   
   # Fix permission issues
   docker exec -it hospital-backend chown -R node:node /app
   ```

2. **Fix Volume Issues**
   ```yaml
   # Update docker-compose.yml
   volumes:
     - ./uploads:/var/uploads/hospital:rw
     - ./logs:/var/logs/hospital:rw
   ```

### Issue: Environment Variable Problems

#### Symptoms
- Configuration not loading
- Database connection failures
- Missing API keys
- Default values being used

#### Solutions
1. **Verify Environment Variables**
   ```bash
   # Check loaded variables
   docker exec hospital-backend env | grep -E "(DATABASE|JWT|REDIS)"
   
   # Check .env file
   cat .env
   
   # Validate required variables
   node -e "
   const required = ['DATABASE_URL', 'JWT_SECRET', 'REDIS_URL'];
   required.forEach(key => {
     if (!process.env[key]) console.error(\`Missing: \${key}\`);
   });
   "
   ```

## Browser Compatibility

### Issue: Application Not Working in Specific Browsers

#### Symptoms
- JavaScript errors in older browsers
- CSS layout issues
- Features not working
- Performance problems

#### Solutions
1. **Add Browser Polyfills**
   ```javascript
   // Add to frontend build
   import 'core-js/stable';
   import 'regenerator-runtime/runtime';
   ```

2. **Update Browser Support**
   ```json
   // package.json browserslist
   "browserslist": [
     "> 1%",
     "last 2 versions",
     "not dead",
     "not ie 11"
   ]
   ```

## System Monitoring

### Monitoring Commands

#### System Health Check
```bash
#!/bin/bash
# health-check.sh

echo "=== System Health Check ==="
echo "Date: $(date)"
echo

echo "=== System Resources ==="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1

echo "Memory Usage:"
free -h

echo "Disk Usage:"
df -h /

echo

echo "=== Service Status ==="
services=("hospital-backend" "postgresql" "redis" "nginx")
for service in "${services[@]}"; do
    if systemctl is-active --quiet $service; then
        echo "$service: ✓ Running"
    else
        echo "$service: ✗ Not running"
    fi
done

echo

echo "=== Database Connections ==="
sudo -u postgres psql -d hospital_management -c "SELECT count(*) as active_connections FROM pg_stat_activity;"

echo

echo "=== Recent Errors ==="
echo "Backend errors (last 10):"
tail -10 /var/logs/hospital/err.log

echo "nginx errors (last 5):"
tail -5 /var/log/nginx/error.log
```

#### Performance Monitoring
```bash
#!/bin/bash
# performance-monitor.sh

echo "=== Performance Metrics ==="
echo "Timestamp: $(date)"

echo "Load Average:"
uptime

echo "Top Processes by CPU:"
ps aux --sort=-%cpu | head -5

echo "Top Processes by Memory:"
ps aux --sort=-%mem | head -5

echo "Network Connections:"
netstat -an | grep :3000 | wc -l

echo "Database Performance:"
sudo -u postgres psql -d hospital_management -c "
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch
FROM pg_stat_user_tables 
ORDER BY seq_scan DESC 
LIMIT 5;
"
```

---

## Emergency Contacts

### Technical Support
- **Primary**: support@hospital-system.com
- **Emergency Hotline**: +1-800-HOSPITAL (24/7)
- **Escalation**: senior-support@hospital-system.com

### System Administration
- **Database Admin**: dba@hospital-system.com
- **Network Admin**: network@hospital-system.com
- **Security Team**: security@hospital-system.com

### Vendor Support
- **Hosting Provider**: Contact through support portal
- **SSL Certificate**: Contact certificate authority
- **Third-party Services**: Check individual service documentation

---

*This troubleshooting guide is regularly updated based on common issues and solutions. For the latest version, visit the documentation portal.*