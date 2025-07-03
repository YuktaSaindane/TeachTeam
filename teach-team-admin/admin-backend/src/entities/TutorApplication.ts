import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Course } from "./Course";

// This file defines the TutorApplication entity for the admin backend.
// It represents an application by a user (candidate) to become a tutor for a course.
// The entity tracks details about the application, including session type, skills, and selection status.
@ObjectType()
@Entity("tutor_applications")
export class TutorApplication {
  // Unique identifier for the tutor application
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  // The user i.e the candidate who submitted the application
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.applications)
  user!: User;

  // The course the application is for
  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.applications)
  course!: Course;

  // The type of session (tutorial or lab)
  @Field()
  @Column({ type: "enum", enum: ["tutorial", "lab"] })
  session_type!: "tutorial" | "lab";

  // Availability of the candidate (full time or part time)
  @Field({ nullable: true })
  @Column({ type: "enum", enum: ["Full Time", "Part Time"], nullable: true })
  availability!: "Full Time" | "Part Time";

  // The role the candidate applied for
  @Field()
  @Column()
  role_applied!: string;

  // Previous roles held by the candidate 
  @Field({ nullable: true })
  @Column("text", { nullable: true })
  previous_roles!: string;

  // Skills listed by the candidate
  @Field({ nullable: true })
  @Column("text", { nullable: true })
  skills!: string;

  // Credentials provided by the candidate
  @Field({ nullable: true })
  @Column("text", { nullable: true })
  credentials!: string;

  // Whether the candidate was selected for the role
  @Field()
  @Column({ default: false })
  is_selected!: boolean;

  // The candidates rank for the application
  @Field({ nullable: true })
  @Column({ nullable: true })
  rank!: number;

  // any comments about the application
  @Field({ nullable: true })
  @Column("text", { nullable: true })
  comment!: string;

  // The date and time the application was created
  @Field()
  @CreateDateColumn()
  created_at!: Date;
}
