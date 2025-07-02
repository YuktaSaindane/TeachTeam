#!/usr/bin/env node

// Simple color codes for readability
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

function colorLog(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

async function checkPortInUse(port) {
  const { exec } = require('child_process');
  return new Promise((resolve) => {
    exec(`netstat -an | findstr :${port}`, (error, stdout) => {
      resolve(stdout.includes('LISTENING'));
    });
  });
}

async function showAllServicesInfo() {
  // Check which services are running
  const mainBackend = await checkPortInUse(3001);
  const adminBackend = await checkPortInUse(4001);
  const adminFrontend = await checkPortInUse(5175);
  
  colorLog('\nSERVICE STATUS:', colors.bright + colors.cyan);
  colorLog('===============================================', colors.cyan);
  
  if (mainBackend) {
    colorLog('Main Backend (API):        http://localhost:3001 [RUNNING]', colors.green);
  } else {
    colorLog('Main Backend (API):        Not Running', colors.red);
  }
  
  colorLog('Main Frontend (App):       Check terminal output above [RUNNING]', colors.green);
  
  if (adminBackend) {
    colorLog('Admin Backend (GraphQL):   http://localhost:4001/graphql [RUNNING]', colors.green);
  } else {
    colorLog('Admin Backend (GraphQL):   Not Running', colors.red);
  }
  
  if (adminFrontend) {
    colorLog('Admin Frontend (Panel):    http://localhost:5175 [RUNNING]', colors.green);
  } else {
    colorLog('Admin Frontend (Panel):    Not Running', colors.red);
  }
  
  colorLog('\nLOGIN CREDENTIALS:', colors.bright + colors.yellow);
  colorLog('===============================================', colors.yellow);
  
  if (adminBackend) {
    colorLog('Admin Panel:    admin@gmail.com / Admin@1234', colors.magenta);
  }
  colorLog('Lecturer 1:     smith@rmit.edu.au / Lecturer@123', colors.blue);
  colorLog('Lecturer 2:     johnson@rmit.edu.au / Lecturer@123', colors.blue);
  colorLog('Lecturer 3:     williams@rmit.edu.au / Lecturer@123', colors.blue);
  
  colorLog('\nQUICK ACCESS:', colors.bright + colors.white);
  colorLog('===============================================', colors.white);
  colorLog('Student App:    Check frontend URL above', colors.green);
  
  if (adminFrontend) {
    colorLog('Admin Panel:    http://localhost:5175', colors.magenta);
  }
  
  if (adminBackend) {
    colorLog('GraphQL API:    http://localhost:4001/graphql', colors.blue);
  }
  
  if (mainBackend) {
    colorLog('Health Check:   http://localhost:3001/health', colors.cyan);
  }
  
  if (!adminBackend || !adminFrontend) {
    colorLog('\nMISSING SERVICES:', colors.bright + colors.yellow);
    colorLog('To start ALL services: Go to root directory and run "npm start"', colors.white);
    colorLog('To start just main app: Stay here and run "npm start"', colors.white);
  }
  
  colorLog('\nTIPS:', colors.bright + colors.cyan);
  colorLog('- Press Ctrl+C to stop all services', colors.white);
  colorLog('- Frontend auto-reloads on file changes', colors.white);
  colorLog('- Backend auto-restarts with nodemon', colors.white);
  colorLog('- All databases are auto-seeded with sample data', colors.white);
  
  console.log();
}

// Wait for services to start, then show info
setTimeout(async () => {
  await showAllServicesInfo();
}, 8000); // Wait 8 seconds for services to start 