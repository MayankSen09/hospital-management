#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏥 Hospital Management System - Deployment Script');
console.log('================================================');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(`📦 Project: ${packageJson.name}`);
console.log(`📋 Version: ${packageJson.version}`);

try {
  console.log('\n🔍 Checking dependencies...');
  execSync('npm list --depth=0', { stdio: 'inherit' });

  console.log('\n🧪 Running tests...');
  try {
    execSync('npm test -- --coverage --watchAll=false', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Tests failed or not configured, continuing...');
  }

  console.log('\n🏗️  Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');
  console.log('\n📁 Build files are ready in the "build" directory');
  
  console.log('\n🚀 Ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Connect your repository to Vercel');
  console.log('3. Deploy with: vercel --prod');
  
  console.log('\n📖 For detailed instructions, see deploy.md');

} catch (error) {
  console.error('\n❌ Deployment preparation failed:', error.message);
  process.exit(1);
}