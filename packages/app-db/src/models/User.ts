import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Place } from "./Place";
import { AddRequest } from "./AddRequest";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ default: "user" })
  role: string; // 'user' or 'admin'

  @Column({ nullable: true })
  profilePicture: string;

  @ManyToMany(() => Place, (place) => place.editedByUsers)
  editedPlaces: Place[];

  @ManyToMany(() => Place, (place) => place.savedByUsers)
  @JoinTable({
    name: "SavedPlace",
    joinColumn: {
      name: "userId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "placeId",
      referencedColumnName: "id",
    },
  })
  savedPlaces: Place[];

  @OneToMany(() => AddRequest, (addRequest) => addRequest.user)
  addRequests: AddRequest[];
}
