#!/usr/bin/env node

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.green}
╔══════════════════════════════════════════════════════════════════════╗
║                     TEACHTEAM COMMAND REFERENCE                    ║
╚══════════════════════════════════════════════════════════════════════╝${colors.reset}

${colors.bright} QUICK START COMMANDS:${colors.reset}

${colors.yellow}npm run setup${colors.reset}      - Install all dependencies for all services
${colors.yellow}npm start${colors.reset}          - Start all services concurrently
${colors.yellow}node start-all.js${colors.reset}  - Alternative launcher with beautiful output

${colors.bright} SERVER LINKS (after starting):${colors.reset}

${colors.blue}Main Application:${colors.reset}
  Frontend: ${colors.cyan}http://localhost:3000${colors.reset}  (Student/Lecturer interface)
  Backend:  ${colors.cyan}http://localhost:3001${colors.reset}  (REST API)

${colors.magenta}Admin Panel:${colors.reset}
  Frontend: ${colors.cyan}http://localhost:5173${colors.reset}  (Admin management)
  Backend:  ${colors.cyan}http://localhost:4001/graphql${colors.reset}  (GraphQL API)

${colors.bright}🛠 INDIVIDUAL SERVICE COMMANDS:${colors.reset}

${colors.yellow}npm run start:main-backend${colors.reset}     - Main Express server (port 3001)
${colors.yellow}npm run start:main-frontend${colors.reset}    - Main React app (port 3000)
${colors.yellow}npm run start:admin-backend${colors.reset}    - GraphQL admin server (port 4000)
${colors.yellow}npm run start:admin-frontend${colors.reset}   - Admin React app (port 5173)

${colors.bright} TESTING COMMANDS:${colors.reset}

${colors.yellow}npm test${colors.reset}                       - Run all backend tests (45 tests)
${colors.yellow}node test-setup.js${colors.reset}            - Verify project configuration

${colors.bright}🔧 MAINTENANCE COMMANDS:${colors.reset}

${colors.yellow}npm run install-all${colors.reset}           - Install dependencies for all services

${colors.bright} FEATURES AVAILABLE:${colors.reset}

${colors.green}Main App:${colors.reset} Student registration, tutor applications, lecturer reviews
${colors.green}Admin Panel:${colors.reset} User management, course management, system analytics
${colors.green}Testing:${colors.reset} 45 comprehensive backend unit tests
${colors.green}Real-time:${colors.reset} Live statistics and data visualization

${colors.bright} TIPS:${colors.reset}

• Use ${colors.cyan}Ctrl+C${colors.reset} to stop all services when running concurrently
• All services support hot-reload for development
• Check individual service logs for debugging
• Database setup is automatic on first run

${colors.bright} Ready to go! Start with:${colors.reset} ${colors.yellow}npm start${colors.reset}
`); 