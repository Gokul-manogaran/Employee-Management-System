# 🚀 Deployment Guide - Employee Management System

This guide covers deployment options for the Employee Management System on various platforms.

## 📋 Prerequisites

- Node.js (v14 or higher)
- Git
- Database (SQLite for development, PostgreSQL/MySQL for production)

## 🎯 Deployment Options

### **Option 1: Heroku (Recommended for Demo)**

#### **Backend Deployment**
```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create Heroku app
cd backend
heroku create your-employee-api

# 4. Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# 5. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key-change-in-production
heroku config:set PORT=4000

# 6. Deploy
git add .
git commit -m "Deploy employee management API"
git push heroku main

# 7. Open the app
heroku open
```

#### **Frontend Deployment**
```bash
# 1. Build the frontend
cd frontend
npm run build

# 2. Deploy to Netlify/Vercel
# Option A: Netlify
netlify deploy --prod --dir=dist

# Option B: Vercel
vercel --prod
```

### **Option 2: Railway (Modern Alternative)**

#### **Backend Deployment**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
cd backend
railway init

# 4. Add PostgreSQL
railway add

# 5. Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 6. Deploy
railway up
```

### **Option 3: DigitalOcean App Platform**

#### **Backend Deployment**
```bash
# 1. Create app in DigitalOcean dashboard
# 2. Connect GitHub repository
# 3. Set build command: npm install && npm start
# 4. Set run command: npm start
# 5. Add environment variables in dashboard
```

### **Option 4: AWS (Production Ready)**

#### **Backend Deployment with AWS**
```bash
# 1. Install AWS CLI
# 2. Configure AWS credentials
aws configure

# 3. Create Elastic Beanstalk application
eb init employee-management-api
eb create employee-api-prod

# 4. Set environment variables
eb setenv NODE_ENV=production
eb setenv JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 5. Deploy
eb deploy
```

## 🔧 Environment Configuration

### **Production Environment Variables**
```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DB_PATH=./database.sqlite
# For PostgreSQL:
DATABASE_URL=postgresql://username:password@host:port/database
```

### **Frontend Environment Variables**
```env
VITE_API_URL=https://your-api-domain.com/graphql
VITE_APP_NAME=Employee Management System
```

## 📊 Database Migration

### **SQLite to PostgreSQL Migration**
```javascript
// In backend/src/database/schema.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Update database queries to use pool instead of sqlite3
```

## 🔒 Security Checklist

### **Production Security**
- [ ] **HTTPS** enabled
- [ ] **CORS** properly configured
- [ ] **Rate limiting** active
- [ ] **Security headers** implemented
- [ ] **Environment variables** secured
- [ ] **Database** properly configured
- [ ] **Logging** enabled
- [ ] **Monitoring** set up

### **SSL/HTTPS Setup**
```bash
# For Heroku (automatic)
# SSL is automatically provisioned

# For custom domains
# Add SSL certificate in hosting platform dashboard
```

## 📈 Performance Optimization

### **Backend Optimizations**
```javascript
// Enable compression
app.use(compression());

// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// Database connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### **Frontend Optimizations**
```javascript
// Vite build optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          graphql: ['@apollo/client', 'graphql']
        }
      }
    }
  }
});
```

## 🔍 Monitoring & Logging

### **Health Check Endpoint**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

### **Error Monitoring**
```javascript
// Add error tracking service
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

## 🚀 Quick Deploy Script

### **Automated Deployment**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment..."

# Backend deployment
cd backend
npm install
npm run build

# Frontend deployment
cd ../frontend
npm install
npm run build

echo "✅ Deployment completed!"
echo "🌐 Backend: https://your-api-domain.com"
echo "🌐 Frontend: https://your-app-domain.com"
```

## 📱 Mobile Deployment

### **PWA Configuration**
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});
```

## 🔄 CI/CD Pipeline

### **GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Deploy Backend
        run: |
          cd backend
          npm install
          npm run build
          # Deploy to your platform
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy to your platform
```

## 📞 Support

### **Deployment Issues**
1. **Check logs:** `heroku logs --tail` or platform equivalent
2. **Verify environment variables**
3. **Test database connection**
4. **Check CORS configuration**

### **Performance Issues**
1. **Monitor response times**
2. **Check database query performance**
3. **Verify caching is working**
4. **Review bundle sizes**

---

## 🎯 **Demo Deployment URLs**

Once deployed, you can share these URLs with the hiring team:

- **Live Demo:** `https://your-app-domain.com`
- **API Documentation:** `https://your-api-domain.com/graphql`
- **Health Check:** `https://your-api-domain.com/health`

### **Demo Credentials**
- **Admin:** `admin` / `admin123`
- **Employee:** Create via admin panel

This deployment guide ensures your application is **production-ready** and **professionally presented** to the hiring team! 🚀 