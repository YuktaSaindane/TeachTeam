import { ObjectType, Field, Int } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Course } from "./Course";
import { User } from "./User";

// This file defines the CourseLecturer entity for the admin backend.
// It represents the assignment of a lecturer to a specific course.
// Each record links a user (lecturer) to a course for teaching purposes.
@ObjectType()
@Entity("course_lecturers")
export class CourseLecturer {
  // unique identifier for the course-lecturer assignment
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  // The course that the lecturer is assigned to
  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.lecturerAssignments)
  course!: Course;

  // lecturer assigned to the course
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id) 
  lecturer!: User;
}
