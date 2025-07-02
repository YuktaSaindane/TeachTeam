import { Repository } from "typeorm";
import { Course } from "../entities/Course";

// This file contains the application controller logic for managing courses.
// It handles finding or creating courses with proper names and semesters.

/**
 * Finds or creates a course with the given code and name
 * @param courseRepo - TypeORM repository for Course entity
 * @param course - Course code
 * @param courseName - Course name (optional)
 * @returns Promise<Course> - The found or created course entity
 */
export async function findOrCreateCourse(
  courseRepo: Repository<Course>,
  course: string,
  courseName?: string
): Promise<Course> {
  // Find or create the course with proper name
  let courseEntity = await courseRepo.findOne({ where: { code: course } });
  
  if (!courseEntity) {
    // Get current year and semester
    // Semester 1: January to June
    // Semester 2: July to December
    const now = new Date();
    const year = now.getFullYear();
    const semester = now.getMonth() < 6 ? 1 : 2;
    const currentSemester = `${year}-${semester}`;

    // Create new course if it doesn't exist
    courseEntity = courseRepo.create({
      code: course,
      name: courseName || course,
      semester: currentSemester
    });
    await courseRepo.save(courseEntity);
  } else {
    // Update the course name if it's different from the existing one
    if (courseName && courseEntity.name !== courseName) {
      courseEntity.name = courseName;
      await courseRepo.save(courseEntity);
    }
  }
  
  return courseEntity;
} 