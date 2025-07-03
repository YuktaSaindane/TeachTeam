#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying TeachTeam project setup...\n');

const services = [
  {
    name: 'Main Frontend',
    path: 's3991284-s4041321-a2/package.json',
    requiredScript: 'dev'
  },
  {
    name: 'Main Backend',
    path: 's3991284-s4041321-a2/Backend/package.json',
    requiredScript: 'dev'
  },
  {
    name: 'Admin Frontend',
    path: 's3991284-s4041321-a2/teach-team-admin/admin-frontend/package.json',
    requiredScript: 'dev'
  },
  {
    name: 'Admin Backend',
    path: 's3991284-s4041321-a2/teach-team-admin/admin-backend/package.json',
    requiredScript: 'dev'
  }
];

let allGood = true;

services.forEach(service => {
  const fullPath = path.join(__dirname, service.path);
  
  if (fs.existsSync(fullPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      if (pkg.scripts && pkg.scripts[service.requiredScript]) {
        console.log(`✅ ${service.name}: Found package.json with '${service.requiredScript}' script`);
      } else {
        console.log(`❌ ${service.name}: Missing '${service.requiredScript}' script`);
        allGood = false;
      }
    } catch (e) {
      console.log(`❌ ${service.name}: Invalid package.json`);
      allGood = false;
    }
  } else {
    console.log(`❌ ${service.name}: Missing package.json at ${service.path}`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 All services are properly configured!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run setup      (install all dependencies)');
  console.log('2. Run: npm start          (start all services)');
  console.log('3. Open: http://localhost:3000  (main app)');
  console.log('4. Open: http://localhost:5173  (admin panel)');
} else {
  console.log('⚠️  Some services have configuration issues.');
  console.log('Please check the missing files/scripts above.');
}

console.log(''); 