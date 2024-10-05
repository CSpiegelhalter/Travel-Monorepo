import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Place } from "./Place";

@Entity()
export class EditRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Place)
  place: Place;

  @ManyToOne(() => User)
  user: User;

  @Column("jsonb")
  requestedChanges: Record<string, any>; // JSON object to store changes

  @Column({ default: "pending" })
  status: string; // 'pending', 'approved', 'declined'

  @Column({ nullable: true })
  adminComments: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
