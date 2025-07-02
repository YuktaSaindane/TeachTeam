import {
  Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn
} from 'typeorm';
import { TutorApplication } from './TutorApplication';
import { User } from './User';

@Entity('selected_candidates')
export class SelectedCandidate {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => TutorApplication)
  application!: TutorApplication;

  @ManyToOne(() => User, (user) => user.selectedCandidates)
  selected_by!: User;

  @CreateDateColumn()
  selected_at!: Date;
}
