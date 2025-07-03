// Database seeding script for TeachTeam backend
// Creates initial data for testing lecturer functionality
// Includes lecturer users, courses, and course assignments

import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { Course } from "./entities/Course";
import { CourseLecturer } from "./entities/CourseLecturer";
import bcrypt from "bcrypt";

// Sample data for seeding
const lecturers = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    password: "Password@1234",
    role: "lecturer" as const,
    avatar_url: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=SJ"
  },
  {
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu", 
    password: "Password@1234",
    role: "lecturer" as const,
    avatar_url: "https://via.placeholder.com/150/2196F3/FFFFFF?text=MC"
  },
  {
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    password: "Password@1234", 
    role: "lecturer" as const,
    avatar_url: "https://via.placeholder.com/150/FF9800/FFFFFF?text=ER"
  }
];

const courses = [
  { code: "COSC1111", name: "Python Development", semester: "2024-1" },
  { code: "COSC2222", name: "Web Programming", semester: "2024-1" },
  { code: "COSC3333", name: "Data Structures and Algorithms", semester: "2024-1" },
  { code: "COSC4444", name: "Blockchain Development", semester: "2024-1" },
  { code: "COSC5555", name: "Mobile Programming and development", semester: "2024-1" },
  { code: "COSC6666", name: "Database and Backend development", semester: "2024-1" }
];

// Course assignments for lecturers
const courseAssignments = [
  { lecturerEmail: "sarah.johnson@university.edu", courseCodes: ["COSC1111", "COSC2222"] },
  { lecturerEmail: "michael.chen@university.edu", courseCodes: ["COSC3333", "COSC4444"] },
  { lecturerEmail: "emily.rodriguez@university.edu", courseCodes: ["COSC5555", "COSC6666"] }
];

// Main seeding function
export const seedDatabase = async (): Promise<void> => {
  try {
    console.log("Starting database seeding...");

    // Initialize data source
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepo = AppDataSource.getRepository(User);
    const courseRepo = AppDataSource.getRepository(Course);
    const courseLecturerRepo = AppDataSource.getRepository(CourseLecturer);

    // Create courses
    console.log("Creating courses...");
    for (const courseData of courses) {
      const existingCourse = await courseRepo.findOne({ where: { code: courseData.code } });
      if (!existingCourse) {
        const course = courseRepo.create(courseData);
        await courseRepo.save(course);
        console.log(`Created course: ${courseData.code}`);
      } else {
        console.log(`Course ${courseData.code} already exists`);
      }
    }

    // Create lecturers
    console.log("Creating lecturers...");
    for (const lecturerData of lecturers) {
      const existingUser = await userRepo.findOne({ where: { email: lecturerData.email } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(lecturerData.password, 10);
        const lecturer = userRepo.create({
          ...lecturerData,
          password: hashedPassword
        });
        await userRepo.save(lecturer);
        console.log(`Created lecturer: ${lecturerData.name}`);
      } else {
        console.log(`Lecturer ${lecturerData.name} already exists`);
      }
    }

    // Create course assignments
    console.log("Creating course assignments...");
    for (const assignment of courseAssignments) {
      const lecturer = await userRepo.findOne({ where: { email: assignment.lecturerEmail } });
      if (!lecturer) {
        console.log(`Lecturer not found: ${assignment.lecturerEmail}`);
        continue;
      }

      for (const courseCode of assignment.courseCodes) {
        const course = await courseRepo.findOne({ where: { code: courseCode } });
        if (!course) {
          console.log(`Course not found: ${courseCode}`);
          continue;
        }

        const existingAssignment = await courseLecturerRepo.findOne({
          where: { lecturer: { id: lecturer.id }, course: { id: course.id } }
        });

        if (!existingAssignment) {
          const courseLecturer = courseLecturerRepo.create({
            lecturer,
            course
          });
          await courseLecturerRepo.save(courseLecturer);
          console.log(`Assigned ${lecturer.name} to ${course.code}`);
        } else {
          console.log(`Assignment already exists: ${lecturer.name} -> ${course.code}`);
        }
      }
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seeding finished. Closing connection...");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
} 