// src/entities/User.ts
// This file defines the User entity for the admin backend.
// It represents users in the system, including admins, lecturers, and candidates.
// The entity includes fields for user details, role, and relationships to applications and selections.
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany
} from 'typeorm';
import { TutorApplication } from './TutorApplication';
import { SelectedCandidate } from './SelectedCandidate';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType() 
@Entity('users')
export class User {
  // Unique identifier for the user
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  // The users full name
  @Field()
  @Column()
  name!: string;

  // The users email address (this must be unique)
  @Field()
  @Column({ unique: true })
  email!: string;

  // The users hashed password
  @Column()
  password!: string;

  // The users role in the system (candidate, lecturer, or admin)
  @Field()
  @Column({ type: 'enum', enum: ['candidate', 'lecturer', 'admin'] })
  role!: 'candidate' | 'lecturer' | 'admin';

  // optional URL for the users avatar image
  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar_url!: string;

  // field indicating Whether the user is blocked from accessing the system
  @Field()
  @Column({ default: false })
  is_blocked!: boolean;

  // The date and time the user joined
  @Field()
  @CreateDateColumn()
  joined_at!: Date;

  // All tutor applications submitted by this user
  @OneToMany(() => TutorApplication, (app) => app.user)
  applications!: TutorApplication[];

  // All candidates selected by this user (if they are a lecturer)
  @OneToMany(() => SelectedCandidate, (sc) => sc.selected_by)
  selectedCandidates!: SelectedCandidate[];

  
}
