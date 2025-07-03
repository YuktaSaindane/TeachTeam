import { ObjectType, Field, Int } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TutorApplication } from "./TutorApplication";
import { CourseLecturer } from "./CourseLecturer";

// This file defines the Course entity for the admin backend.
// It represents a course offered in the system, including its code, name, and semester.
// The entity also tracks which tutor applications and lecturers are linked to the course.

@ObjectType() 
@Entity("courses")
export class Course {
  // unique identifier for the course
  @Field(() => Int) 
  @PrimaryGeneratedColumn()
  id!: number;

  // The unique code for the course (example COSC2222)
  @Field() 
  @Column({ unique: true })
  code!: string;

  //  name of the course
  @Field()
  @Column()
  name!: string;

  // semester in which the course is offered
  @Field()
  @Column()
  semester!: string;

  
  @OneToMany(() => TutorApplication, (app) => app.course)
  applications!: TutorApplication[];

  @OneToMany(() => CourseLecturer, (cl) => cl.course)
  lecturerAssignments!: CourseLecturer[];
}
