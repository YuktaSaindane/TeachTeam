# 📋 TeachTeam Presentation Cheat Sheet

## Quick Start
```bash
npm start
```
**URLs:** Main: 5174 | Admin: 5175

## Login Credentials
- **Lecturer:** `smith@rmit.edu.au` / `Lecturer@123`
- **Candidate:** `alice.johnson@student.rmit.edu.au` / `Tutor@123`  
- **Admin:** `admin@gmail.com` / `Admin@1234`

## Key Features to Highlight

### 🎯 Main Application
- **Multi-course applications** - Candidates apply to 6 courses simultaneously
- **Real-time filtering** - 400ms debounced search for smooth UX
- **Ranking system** - Prevents duplicates, validates 1-100 range
- **Analytics dashboard** - Container-Presenter architecture pattern
- **Role-based access** - Only assigned lecturers review their courses

### ⚙️ Admin Panel  
- **Course management** - CRUD with format validation (COSCxxxx, YYYY-S)
- **Lecturer assignment** - Controls review access
- **User management** - Block/unblock candidates
- **Reporting suite** - Selected, overloaded, unselected candidates

### 🏗️ Technical Excellence
- **Dual APIs** - REST (main) + GraphQL (admin)
- **Testing** - Jest, Vitest, React Testing Library
- **Database** - MySQL + TypeORM with entity relationships
- **Modern stack** - React, TypeScript, Tailwind CSS

## Demo Flow Sequence
1. **Home → Sign in as lecturer → Review applications**
2. **Filter/search → Select candidates → Add ranks/comments**  
3. **Analytics dashboard → Charts and insights**
4. **Switch to candidate → Apply for courses → Skills selection**
5. **Admin panel → Course management → Reports**

## Strong Closing Points
✅ **Production-ready** enterprise solution  
✅ **Scalable architecture** for university systems  
✅ **Professional workflow** mirrors real recruitment  
✅ **Full-stack expertise** with modern technologies  

## Emergency Backup
- Show README.md if demo fails
- Discuss 6 courses and 3 user roles
- Highlight Container-Presenter pattern docs
- Walk through project structure

## One-Line Summary
*"TeachTeam is a production-ready, full-stack tutor recruitment system demonstrating enterprise-grade development practices."* 