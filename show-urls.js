#!/usr/bin/env node

// ANSI color codes for colorful output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

function displayInfo() {
  console.log('\n');
  console.log('ALL SERVICES ARE RUNNING');
  console.log('========================');
  console.log('');
  
  console.log('MAIN APPLICATION:');
  console.log('Frontend: http://localhost:5174');
  console.log('Backend: http://localhost:3001');
  console.log('');
  
  console.log('ADMIN PANEL:');
  console.log('Frontend: http://localhost:5175');
  console.log('Backend: http://localhost:4001/graphql');
  console.log('');
  
  console.log('LOGIN CREDENTIALS:');
  console.log('');
  
  console.log('Lecturers (Main App):');
  console.log('Dr. Smith: smith@rmit.edu.au / Lecturer@123');
  console.log('Dr. Johnson: johnson@rmit.edu.au / Lecturer@123');
  console.log('Prof. Williams: williams@rmit.edu.au / Lecturer@123');
  console.log('');
  
  console.log('Pre-created Tutors (Main App):');
  console.log('Alice Johnson: alice.johnson@student.rmit.edu.au / Tutor@123');
  console.log('Bob Smith: bob.smith@student.rmit.edu.au / Tutor@123');
  console.log('Charlie Brown: charlie.brown@student.rmit.edu.au / Tutor@123');
  console.log('Diana Prince: diana.prince@student.rmit.edu.au / Tutor@123');
  console.log('Ethan Hunt: ethan.hunt@student.rmit.edu.au / Tutor@123');
  console.log('Note: All tutors use the same password Tutor@123 for simplicity');
  console.log('');
  
  console.log('Admin (Admin Panel):');
  console.log('admin@gmail.com / Admin@1234');
  console.log('');
  
  console.log('Ready to use. Press Ctrl+C to stop all services.');
  console.log('========================');
  console.log('');
}

displayInfo(); 