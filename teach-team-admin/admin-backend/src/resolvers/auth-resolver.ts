// This file defines the authentication and user management resolver for the admin backend.
// It handles admin login, lecturer assignments, and candidate management.
// The resolver provides GraphQL mutations and queries for user authentication and role-based operations.

import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { Course } from "../entities/Course";
import { CourseLecturer } from "../entities/CourseLecturer";
import { AppDataSource } from "../utils/db";
import bcrypt from "bcrypt";

@Resolver()
export class AuthResolver {
  // Test query to just to verify  that the backend is live and accessible
  @Query(() => String)
  hello(): string {
    return "Admin backend is working!";
  }

  // Authenticates an admin user and returns their user object if successful
  // Throws errors for invalid credentials, non-admin users, or blocked accounts
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) throw new Error("No user found with that email.");
    if (user.role !== "admin") throw new Error("Access denied: not an admin user.");
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("Incorrect password.");
    
    if (user.is_blocked) throw new Error("Your account has been blocked.");

    return user;
  }

  // Creates a new assignment between a lecturer and a course
  // Verifies that the user is a lecturer and also that the course exists before creating the assignment
  @Mutation(() => Boolean)
  async assignLecturerToCourse(
    @Arg("lecturerId") lecturerId: number,
    @Arg("courseId") courseId: number
  ): Promise<boolean> {
    const userRepo = AppDataSource.getRepository(User);
    const courseRepo = AppDataSource.getRepository(Course);
    const courseLecturerRepo = AppDataSource.getRepository(CourseLecturer);

    const lecturer = await userRepo.findOne({ where: { id: lecturerId } });
    if (!lecturer || lecturer.role !== "lecturer") {
      throw new Error("User is not a lecturer");
    }

    const course = await courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new Error("Course not found");

    const assignment = courseLecturerRepo.create({ course, lecturer });
    await courseLecturerRepo.save(assignment);
    return true;
  }

  // Retrieves all users with the lecturer role from the database
  @Query(() => [User])
  async getAllLecturers(): Promise<User[]> {
    const userRepo = AppDataSource.getRepository(User);
    return await userRepo.find({ where: { role: "lecturer" } });
  }

  // Retrieves all courses from the database
  @Query(() => [Course])
  async getAllCourses(): Promise<Course[]> {
    const courseRepo = AppDataSource.getRepository(Course);
    return await courseRepo.find();
  }

  // Toggles the blocked status of a candidate user
  // will Throw an error if the user is not found or is not a candidate
  @Mutation(() => Boolean)
  async toggleBlockCandidate(@Arg("userId") userId: number): Promise<boolean> {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user || user.role !== "candidate") {
      throw new Error("Candidate not found");
    }

    user.is_blocked = !user.is_blocked;
    await userRepo.save(user);

    return true;
  }

  // retrieves all users with the candidate role from the database
  @Query(() => [User])
  async getAllCandidates(): Promise<User[]> {
    const userRepo = AppDataSource.getRepository(User);
    return userRepo.find({ where: { role: 'candidate' } });
  }
}

