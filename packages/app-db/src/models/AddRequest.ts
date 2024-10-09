import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Place } from "./Place";

@Entity()
export class AddRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.addRequests, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "jsonb" })
  placeData: object;

  @ManyToOne(() => Place, { nullable: true, onDelete: "SET NULL" })
  place: Place | null;

  @Column({
    type: "enum",
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  })
  status: "pending" | "accepted" | "declined";

  @Column({ type: "text", nullable: true })
  additionalComments: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
