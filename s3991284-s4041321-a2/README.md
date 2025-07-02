# TeachTeam Full-Stack Application

A comprehensive teaching assistant management system with both candidate application portal and admin management panel.

**GitHub Repository:** https://github.com/rmit-fsd-2025-s1/s3991284-s4041321-a2.git

## Quick Setup Instructions

### 1. Clone and Navigate
```bash
git clone https://github.com/rmit-fsd-2025-s1/s3991284-s4041321-a2.git
cd s3991284-s4041321-a2
```

### 2. Start the Application
```bash
npm start
```

### 3. Build for Production
```bash
npm run build-all
```

## Commands Overview

| Command | Description |
|---------|-------------|
| `npm start` | Start development servers with auto-setup |
| `npm run build-all` | Build all components for production |

The `npm start` command will automatically:
- Install all dependencies in all project folders
- Seed the database with sample data (lecturers, tutors, admin)
- Start both the main application and admin panel concurrently
- Display the URLs and login credentials when ready

## What Gets Started

After running `npm start`, the following services will be running:

| Service | URL | Description |
|---------|-----|-------------|
| **Main Application** | http://localhost:5174 | Portal for tutor applications |
| **Admin Panel** | http://localhost:5175 | Admin dashboard for managing applications |
| **Main Backend** | http://localhost:3001 | REST API for main application |
| **Admin Backend** | http://localhost:4001/graphql | GraphQL API for admin panel |

## Pre-seeded Login Credentials

The system automatically creates accounts for testing:

### Lecturers (Main Application)
- **Dr. Smith:** smith@rmit.edu.au / Lecturer@123
- **Dr. Johnson:** johnson@rmit.edu.au / Lecturer@123  
- **Prof. Williams:** williams@rmit.edu.au / Lecturer@123

### Pre-created Tutors (Main Application)
- **Alice Johnson:** alice.johnson@student.rmit.edu.au / Tutor@123
- **Bob Smith:** bob.smith@student.rmit.edu.au / Tutor@123
- **Charlie Brown:** charlie.brown@student.rmit.edu.au / Tutor@123
- **Diana Prince:** diana.prince@student.rmit.edu.au / Tutor@123
- **Ethan Hunt:** ethan.hunt@student.rmit.edu.au / Tutor@123

### Admin (Admin Panel)
- **Admin:** admin@gmail.com / Admin@1234

## Testing the Application

### Running Test Cases
Test cases have been implemented and can be run using:

```bash
cd s3991284-s4041321-a2/Backend
npm test
```

**Note:** We have attempted to implement comprehensive test cases covering the main functionality of the application.

## Application Features

### Main Application (Port 5174)
- Candidate registration and login
- Tutor application submission
- Course browsing and selection
- Profile management

### Admin Panel (Port 5175)
- View and manage tutor applications
- Lecturer management
- Course administration
- Application approval/rejection system

## Technical Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeORM, MySQL, Jest
- **Admin:** GraphQL, Apollo Server, React
- **Database:** MySQL with TypeORM migrations
- **Testing:** Jest, Vitest, React Testing Library

## Production Build

The `npm run build-all` command creates optimized production builds for all components:

| Component | Build Output | Technology |
|-----------|--------------|------------|
| **Main Frontend** | `./build/` | React + Vite (optimized) |
| **Main Backend** | `./Backend/dist/` | TypeScript → JavaScript |
| **Admin Backend** | `./teach-team-admin/admin-backend/dist/` | TypeScript → JavaScript |
| **Admin Frontend** | `./teach-team-admin/admin-frontend/dist/` | React + Vite (optimized) |

All TypeScript code is compiled to JavaScript and React applications are bundled and minified for production deployment.

## Troubleshooting

If you encounter any issues:

1. Make sure all ports (3001, 4001, 5174, 5175) are available
2. Ensure MySQL is running and accessible
3. Check that Node.js version is compatible
4. If services don't start, try stopping any existing Node processes and run `npm start` again

## 📚 References and Resources

### Course Materials Used
- **Week 3 Lectures:** React component architecture and state management patterns
- **Week 5 Lab:** TypeScript integration with React components
- **Week 7 Tutorial:** Express.js REST API development and routing
- **Week 9 Lab:** Database design and TypeORM entity relationships
- **Week 11 Material:** Authentication and authorization implementation
- **Assignment 1 Codebase:** Base project structure and initial component designs

### External Resources
- **React Documentation:** https://reactjs.org/docs/ - Component lifecycle and hooks
- **TypeORM Documentation:** https://typeorm.io/ - Database entity relationships and migrations
- **Express.js Guide:** https://expressjs.com/ - API routing and middleware implementation
- **MySQL Documentation:** https://dev.mysql.com/doc/ - Database schema design
- **Vite Documentation:** https://vitejs.dev/ - Build tool configuration and optimization
- **Tailwind CSS:** https://tailwindcss.com/ - Styling and responsive design patterns
- **React Router:** https://reactrouter.com/ - Client-side routing implementation
- **Apollo GraphQL:** https://www.apollographql.com/docs/ - GraphQL server setup and resolvers

### Third-Party Libraries
- **bcrypt:** Password hashing and security
- **cors:** Cross-origin resource sharing configuration
- **concurrently:** Running multiple development servers
- **lucide-react:** Icon library for UI components
- **chart.js & recharts:** Data visualization components

##  Generative AI Usage Disclosure

This project was developed independently with strategic assistance from AI tools for specific development challenges:

### AI Assistance Areas:

**Debugging and Error Resolution**
- **Files:** Backend/src/controllers/*.ts, src/components/*.tsx
- **Usage:** Troubleshooting TypeScript compilation errors, database connection issues, and React component rendering problems
- **Scope:** Error diagnosis and solution suggestions for technical obstacles

**UI/UX Enhancement and Styling**
- **Files:** src/components/ui/*.tsx, src/styles/*.css, Tailwind configurations
- **Usage:** Improving component layouts, responsive design patterns, and visual consistency
- **Scope:** CSS styling suggestions, component structure improvements, and accessibility enhancements

**Source Control and Git Management**
- **Files:** .gitignore, commit message formatting
- **Usage:** Git workflow optimization, branch management strategies, and repository organization
- **Scope:** Version control best practices and conflict resolution guidance

**Code Documentation and Comments**
- **Files:** Throughout codebase in JSDoc comments and inline documentation
- **Usage:** Generating clear, descriptive comments for complex functions and API endpoints
- **Scope:** Code documentation standards and explanation of business logic

### Independent Development Areas:
- **Core Business Logic:** All application-specific algorithms and data processing logic were developed independently
- **Database Schema Design:** Entity relationships and database structure designed based on requirements analysis
- **API Architecture:** REST and GraphQL endpoint design and implementation approach
- **Security Implementation:** Authentication flows and authorization logic
- **Testing Strategy:** Test case design and implementation methodology
- **Project Architecture:** Overall system design and component organization

### Development Approach:
The AI assistance was used as a debugging companion and code review tool rather than a primary development resource. All core functionality, business logic, and architectural decisions were made independently. AI suggestions were evaluated, understood, and adapted to fit the specific project requirements rather than being directly implemented.

## Development

To stop all services, press `Ctrl+C` in the terminal where `npm start` is running.

For individual service management, refer to the package.json scripts in each respective folder.

## 📄 License

This project is part of an academic assignment for RMIT University FSD course 2025 S1.

**Note:** This application includes auto-seeding functionality. All databases are automatically populated with sample data when the seeder scripts are run. 