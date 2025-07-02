import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn
} from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Entity('tutor_applications')
export class TutorApplication {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.applications)
  user!: User;

  @ManyToOne(() => Course, (course) => course.applications)
  course!: Course;

  @Column({ type: 'enum', enum: ['tutorial', 'lab'] })
  session_type!: 'tutorial' | 'lab';

  @Column({ type: 'enum', enum: ['Full Time', 'Part Time'], nullable: true })
  availability!: 'Full Time' | 'Part Time';

  @Column()
  role_applied!: string;

  @Column('text', { nullable: true })
  previous_roles!: string;

  @Column('text', { nullable: true })
  skills!: string;

  @Column('text', { nullable: true })
  credentials!: string;

  @Column({ default: false })
  is_selected!: boolean;

  @Column({ nullable: true })
  rank!: number;

  @Column('text', { nullable: true })
  comment!: string;

  @CreateDateColumn()
  created_at!: Date;
}
