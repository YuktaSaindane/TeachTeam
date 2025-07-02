import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Course } from "../entities/Course";
import { CourseLecturer } from "../entities/CourseLecturer";
import bcrypt from "bcrypt";

const assignLecturers = async () => {
  try {
    await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(User);
    const courseRepo = AppDataSource.getRepository(Course);
    const courseLecturerRepo = AppDataSource.getRepository(CourseLecturer);

    // Create courses if they don't exist
    const courses = [
      { code: "COSC1111", name: "Python Development" },
      { code: "COSC2222", name: "Web Programming" },
      { code: "COSC3333", name: "Data Structures and Algorithms" },
      { code: "COSC4444", name: "Blockchain Development" },
      { code: "COSC5555", name: "Mobile Programming and development" },
      { code: "COSC6666", name: "Database and Backend development" }
    ];

    for (const courseData of courses) {
      let course = await courseRepo.findOne({ where: { code: courseData.code } });
      if (!course) {
        course = courseRepo.create({
          ...courseData,
          semester: "2024-1"
        });
        await courseRepo.save(course);
      }
    }

    // Create some lecturer accounts if they don't exist
    const lecturers = [
      { name: "Dr. Smith", email: "smith@rmit.edu.au", password: "Lecturer@123" },
      { name: "Dr. Johnson", email: "johnson@rmit.edu.au", password: "Lecturer@123" },
      { name: "Prof. Williams", email: "williams@rmit.edu.au", password: "Lecturer@123" }
    ];

    for (const lecturerData of lecturers) {
      let lecturer = await userRepo.findOne({ where: { email: lecturerData.email } });
      if (!lecturer) {
        const hashedPassword = await bcrypt.hash(lecturerData.password, 10); // ✅ HASH HERE

        lecturer = userRepo.create({
          ...lecturerData,
          password: hashedPassword,
          role: "lecturer"
        });

        await userRepo.save(lecturer);
      }
    }

    // Assign courses to lecturers
    const assignments = [
      { email: "smith@rmit.edu.au", courses: ["COSC1111", "COSC2222"] },
      { email: "johnson@rmit.edu.au", courses: ["COSC3333", "COSC4444"] },
      { email: "williams@rmit.edu.au", courses: ["COSC5555", "COSC6666"] }
    ];

    for (const assignment of assignments) {
      const lecturer = await userRepo.findOne({ where: { email: assignment.email } });
      if (!lecturer) continue;

      for (const courseCode of assignment.courses) {
        const course = await courseRepo.findOne({ where: { code: courseCode } });
        if (!course) continue;

        // Check if assignment already exists
        const exists = await courseLecturerRepo.findOne({
          where: { lecturer: { id: lecturer.id }, course: { id: course.id } }
        });

        if (!exists) {
          const courseLecturer = courseLecturerRepo.create({
            lecturer,
            course
          });
          await courseLecturerRepo.save(courseLecturer);
          console.log(`Assigned ${course.code} to ${lecturer.name}`);
        }
      }
    }

    console.log("Successfully assigned lecturers to courses");
    process.exit(0);
  } catch (error) {
    console.error("Error assigning lecturers:", error);
    process.exit(1);
  }
};

assignLecturers(); 