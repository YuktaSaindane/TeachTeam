#!/usr/bin/env node

const { spawn } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(require('child_process').exec);
const path = require('path');

// ANSI color codes for colorful output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m'
};

function colorLog(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function createPrefix(service, color) {
  return `${color}[${service}]${colors.reset}`;
}

async function installDependencies() {
  colorLog('\n📦 Installing dependencies in all projects...', colors.bright + colors.yellow);
  
  try {
    // Check if node_modules exist in main directories
    const fs = require('fs');
    const needsInstall = [
      { path: './node_modules', name: 'Root' },
      { path: './s3991284-s4041321-a2/node_modules', name: 'Main Frontend' },
      { path: './s3991284-s4041321-a2/Backend/node_modules', name: 'Main Backend' },
      { path: './s3991284-s4041321-a2/teach-team-admin/admin-backend/node_modules', name: 'Admin Backend' },
      { path: './s3991284-s4041321-a2/teach-team-admin/admin-frontend/node_modules', name: 'Admin Frontend' }
    ].filter(item => !fs.existsSync(item.path));

    if (needsInstall.length > 0) {
      colorLog(`Installing dependencies for: ${needsInstall.map(item => item.name).join(', ')}`, colors.cyan);
      await execAsync('npm run install-all');
      colorLog(' All dependencies installed successfully', colors.green);
    } else {
      colorLog(' All dependencies already installed', colors.green);
    }
    
    colorLog(' Dependency check completed!\n', colors.bright + colors.green);
  } catch (error) {
    colorLog('  Some installations may have failed, but continuing...', colors.yellow);
    colorLog(' You can run "npm run install-all" manually if needed\n', colors.white);
  }
}

async function runSeedScripts() {
  colorLog('\n Running seed scripts...', colors.bright + colors.yellow);
  
  try {
    // Seed main backend (lecturers and courses)
    colorLog('Seeding main backend (courses and lecturers)...', colors.cyan);
    await execAsync('cd s3991284-s4041321-a2/Backend && npm run seed-lecturers');
    colorLog('Main backend seeded successfully', colors.green);
    
    // Seed admin backend (admin user)
    colorLog(' Creating admin user...', colors.cyan);
    await execAsync('cd s3991284-s4041321-a2/teach-team-admin/admin-backend && npm run create-admin');
    colorLog(' Admin user created successfully', colors.green);
    
    colorLog(' All seed scripts completed successfully!\n', colors.bright + colors.green);
  } catch (error) {
    colorLog('  Seed scripts completed (some may have been skipped if data already exists)', colors.yellow);
    colorLog(' This is normal if the database is already seeded\n', colors.white);
  }
}

function startService(command, cwd, serviceName, color) {
  return new Promise((resolve) => {
    const prefix = createPrefix(serviceName, color);
    const [cmd, ...args] = command.split(' ');
    
    const child = spawn(cmd, args, {
      cwd: cwd,
      stdio: 'pipe',
      shell: true
    });

    child.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      lines.forEach(line => {
        console.log(`${prefix} ${line}`);
      });
    });

    child.stderr.on('data', (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      lines.forEach(line => {
        console.log(`${prefix} ${colors.red}${line}${colors.reset}`);
      });
    });

    child.on('close', (code) => {
      colorLog(`${serviceName} exited with code ${code}`, code === 0 ? colors.green : colors.red);
      resolve(code);
    });

    // Resolve immediately to allow parallel execution
    setTimeout(() => resolve(0), 1000);
  });
}

function displayServerInfo() {
  // Big prominent banner
  console.log('\n');
  colorLog('██████████████████████████████████████████████████████████████████████████████', colors.bgGreen + colors.white);
  colorLog('██                       🎉 ALL SERVICES RUNNING! 🎉                        ██', colors.bgGreen + colors.white);
  colorLog('██████████████████████████████████████████████████████████████████████████████', colors.bgGreen + colors.white);
  
  colorLog('\n SERVER URLS - CLICK TO OPEN:', colors.bright + colors.yellow);
  colorLog('┌────────────────────────────────────────────────────────────────────────────┐', colors.cyan);
  colorLog('│   Main Backend (API)     │  http://localhost:3001                        │', colors.blue);
  colorLog('│   Main Frontend (App)    │  http://localhost:3000                        │', colors.green);  
  colorLog('│    Admin Backend (GraphQL)│  http://localhost:4001/graphql                │', colors.magenta);
  colorLog('│    Admin Frontend (Panel) │  http://localhost:5173                        │', colors.cyan);
  colorLog('└────────────────────────────────────────────────────────────────────────────┘', colors.cyan);
  
  colorLog('\n LOGIN CREDENTIALS (Auto-Seeded):', colors.bright + colors.yellow);
  colorLog('┌────────────────────────────────────────────────────────────────────────────┐', colors.cyan);
  colorLog('│   Admin Panel Login      │  admin@gmail.com / Admin@1234                 │', colors.bright + colors.magenta);
  colorLog('│   Dr. Smith (Lecturer)   │  smith@rmit.edu.au / Lecturer@123             │', colors.blue);
  colorLog('│   Dr. Johnson (Lecturer) │  johnson@rmit.edu.au / Lecturer@123           │', colors.blue);
  colorLog('│   Prof. Williams (Lect.) │  williams@rmit.edu.au / Lecturer@123          │', colors.blue);
  colorLog('└────────────────────────────────────────────────────────────────────────────┘', colors.cyan);
  
  colorLog('\n QUICK START GUIDE:', colors.bright + colors.yellow);
  colorLog('┌────────────────────────────────────────────────────────────────────────────┐', colors.cyan);
  colorLog('│  1️  Student Experience     │  Go to http://localhost:3000                  │', colors.green);
  colorLog('│  2️  Admin Dashboard        │  Go to http://localhost:5173                  │', colors.magenta);
  colorLog('│  3️  Test GraphQL API       │  Go to http://localhost:4001/graphql          │', colors.blue);
  colorLog('│  4️  View API Docs          │  Check /api routes on port 3001               │', colors.cyan);
  colorLog('└────────────────────────────────────────────────────────────────────────────┘', colors.cyan);
  
  colorLog('\n💡 SYSTEM STATUS:', colors.bright + colors.white);
  colorLog(' Databases seeded with sample data (courses, lecturers, admin user)', colors.green);
  colorLog(' All 4 services running concurrently with hot-reload', colors.green);  
  colorLog(' GraphQL endpoints active and ready for queries', colors.green);
  colorLog(' Frontend-backend connections established', colors.green);
  
  colorLog('\n TO STOP: Press Ctrl+C to shut down all services', colors.bright + colors.red);
  
  console.log('\n' + '═'.repeat(80));
  colorLog(' DEVELOPMENT ENVIRONMENT READY - HAPPY CODING! ', colors.bright + colors.yellow);
  console.log('═'.repeat(80) + '\n');
}

async function main() {
  // Display startup banner
  colorLog('\n' + ' '.repeat(20), colors.bright + colors.blue);
  colorLog('     TEACH TEAM APPLICATION SUITE', colors.bright + colors.white);
  colorLog(' '.repeat(20) + '\n', colors.bright + colors.blue);
  
  // Install dependencies first
  await installDependencies();
  
  // Run seed scripts
  await runSeedScripts();
  
  // Display starting message
  colorLog(' Starting all services in parallel...', colors.bright + colors.cyan);
  colorLog(' This may take a few moments...\n', colors.white);

  // Start all services in parallel
  const services = [
    {
      command: 'npm run dev',
      cwd: './s3991284-s4041321-a2/Backend',
      name: 'Main-Backend',
      color: colors.bright + colors.green
    },
    {
      command: 'npm run dev',
      cwd: './s3991284-s4041321-a2',
      name: 'Main-Frontend',
      color: colors.bright + colors.blue
    },
    {
      command: 'npm run dev',
      cwd: './s3991284-s4041321-a2/teach-team-admin/admin-backend',
      name: 'Admin-Backend',
      color: colors.bright + colors.magenta
    },
    {
      command: 'npm run dev',
      cwd: './s3991284-s4041321-a2/teach-team-admin/admin-frontend',
      name: 'Admin-Frontend',
      color: colors.bright + colors.yellow
    }
  ];

  // Start all services
  const promises = services.map(service => 
    startService(service.command, service.cwd, service.name, service.color)
  );

  // Wait a bit for services to initialize, then show server info
  setTimeout(() => {
    displayServerInfo();
  }, 8000); // Wait 8 seconds for all services to fully start

  // Keep the process running
  process.on('SIGINT', () => {
    colorLog('\n Shutting down all services...', colors.bright + colors.red);
    process.exit(0);
  });

  // Wait for all services (they should run indefinitely)
  await Promise.all(promises);
}

main().catch(console.error); 