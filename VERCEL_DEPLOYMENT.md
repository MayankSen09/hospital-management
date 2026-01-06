# Deploy Hospital Management System to Vercel

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub repository with your code

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your hospital-management repository

3. **Configure Build Settings**
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## Environment Variables (Optional)

If you want to add environment variables:

1. In Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - `JWT_SECRET`: `your_jwt_secret_key`
   - `NODE_ENV`: `production`

## Important Notes

✅ **Frontend**: Deployed as static React app
✅ **Backend**: Deployed as Vercel serverless functions
✅ **API Routes**: Available at `/api/*`
✅ **Database**: Currently in-memory (resets on each deployment)

## Login Credentials
- **Email**: admin@hospital.com
- **Password**: admin123

## Features Available
- Patient Management
- Appointment Scheduling
- Doctor Management
- Pharmacy Inventory
- Laboratory Tests
- Billing System (INR)
- Ward Management
- Staff Management
- Reports & Analytics

## Limitations
- Data is stored in memory (not persistent)
- For production, consider adding a database (Supabase, MongoDB, etc.)

## Troubleshooting

### Build Fails?
- Check that all dependencies are in package.json
- Ensure no TypeScript errors
- Run `npm run build` locally first

### API Not Working?
- Check that backend routes start with `/api/`
- Verify vercel.json configuration
- Check Vercel function logs

### Need Persistent Database?
Consider integrating:
- Supabase (PostgreSQL)
- MongoDB Atlas
- PlanetScale (MySQL)
- Vercel Postgres

## Support
Check the deployment logs in Vercel dashboard for any errors.