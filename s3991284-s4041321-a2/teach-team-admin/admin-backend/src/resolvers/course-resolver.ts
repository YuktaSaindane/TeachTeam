// This file defines the course management resolver for the admin backend.
// It provides GraphQL mutations and queries for managing courses, including
// creating, reading, updating, and deleting course records.

import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Course } from "../entities/Course";
import { AppDataSource } from "../utils/db";

@Resolver()
export class CourseResolver {
  private courseRepo = AppDataSource.getRepository(Course);

  // Retrieves all courses from the database
  @Query(() => [Course])
  async getAllCourses(): Promise<Course[]> {
    return await this.courseRepo.find();
  }

  // Creates a new course with the specified name, code, and semester
  // Validates the semester format (YYYY-S) and course code format (COSCxxxx)
  @Mutation(() => Course)
  async addCourse(
    @Arg("name") name: string,
    @Arg("code") code: string,
    @Arg("semester") semester: string
  ): Promise<Course> {
    // Validate semester format
    if (!/^\d{4}-[1-2]$/.test(semester)) {
      throw new Error("Semester must be in format YYYY-S (e.g., 2024-1 or 2024-2)");
    }

    // Validate course code format
    if (!/^COSC\d{4}$/.test(code)) {
      throw new Error("Course code must be in format COSCxxxx (e.g., COSC2222)");
    }

    const course = this.courseRepo.create({ name, code, semester });
    return await this.courseRepo.save(course);
  }

  // Updates an existing course's details
  // All parameters are optional - only provided fields will be updated
  // Validates the format of semester and course code if provided
  @Mutation(() => Course)
  async editCourse(
    @Arg("id") id: number,
    @Arg("name", { nullable: true }) name: string,
    @Arg("code", { nullable: true }) code: string,
    @Arg("semester", { nullable: true }) semester: string
  ): Promise<Course> {
    const course = await this.courseRepo.findOneBy({ id });
    if (!course) throw new Error("Course not found");

    if (name) course.name = name;
    if (code) {
      if (!/^COSC\d{4}$/.test(code)) {
        throw new Error("Course code must be in format COSCxxxx (e.g., COSC2222)");
      }
      course.code = code;
    }
    if (semester) {
      if (!/^\d{4}-[1-2]$/.test(semester)) {
        throw new Error("Semester must be in format YYYY-S (e.g., 2024-1 or 2024-2)");
      }
      course.semester = semester;
    }

    return await this.courseRepo.save(course);
  }

  // Deletes a course from the database
  // Throws an error if the course is not found
  @Mutation(() => Boolean)
  async deleteCourse(@Arg("id") id: number): Promise<boolean> {
    const course = await this.courseRepo.findOneBy({ id });
    if (!course) throw new Error("Course not found");

    await this.courseRepo.remove(course);
    return true;
  }
}
