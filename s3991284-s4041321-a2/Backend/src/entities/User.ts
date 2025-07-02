// src/entities/User.ts
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany
} from 'typeorm';
import { TutorApplication } from './TutorApplication';
import { SelectedCandidate } from './SelectedCandidate';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: ['candidate', 'lecturer', 'admin'] })
  role!: 'candidate' | 'lecturer' | 'admin';

  @Column({ nullable: true })
  avatar_url!: string;

  @Column({ default: false })
  is_blocked!: boolean;

  @CreateDateColumn()
  joined_at!: Date;

  @OneToMany(() => TutorApplication, (app) => app.user)
  applications!: TutorApplication[];

  @OneToMany(() => SelectedCandidate, (sc) => sc.selected_by)
  selectedCandidates!: SelectedCandidate[];
}
