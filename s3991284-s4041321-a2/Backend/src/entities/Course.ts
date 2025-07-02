import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TutorApplication } from './TutorApplication';
import { CourseLecturer } from './CourseLecturer';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column()
  semester!: string;

  @OneToMany(() => TutorApplication, (app) => app.course)
  applications!: TutorApplication[];

  @OneToMany(() => CourseLecturer, (cl) => cl.course)
  lecturerAssignments!: CourseLecturer[];
}
