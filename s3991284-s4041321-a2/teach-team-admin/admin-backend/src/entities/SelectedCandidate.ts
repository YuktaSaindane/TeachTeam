import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { TutorApplication } from "./TutorApplication";
import { User } from "./User";

// This file defines selectedCandidate entity for the admin backend.
// It represents a record of a candidate being selected for a tutor position by a lecturer.
// the entity connects a tutor application to the user (lecturer) who made the selection and records when it happened.
@ObjectType()
@Entity("selected_candidates")
export class SelectedCandidate {
  // Unique identifier for the selected candidate record
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  // The tutor application that was selected
  @Field(() => TutorApplication)
  @ManyToOne(() => TutorApplication)
  application!: TutorApplication;

  // The user i.e lecturer who selected the candidate
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.selectedCandidates)
  selected_by!: User;

  // The date and time when the candidate was selected
  @Field()
  @CreateDateColumn()
  selected_at!: Date;
}
