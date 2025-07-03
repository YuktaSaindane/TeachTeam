import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity('course_lecturers')
export class CourseLecturer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Course, (course) => course.lecturerAssignments)
  course!: Course;

  @ManyToOne(() => User, (user) => user.id)
  lecturer!: User;
}
