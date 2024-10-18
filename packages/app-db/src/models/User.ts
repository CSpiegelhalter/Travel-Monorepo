import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Place } from "./Place";
import { AddRequest } from "./AddRequest";
import { Image } from "./Image";
import { ProfilePicture } from "./ProfilePicture";

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

  @OneToOne(() => ProfilePicture, { nullable: true, cascade: true })
  @JoinColumn()
  profilePicture: ProfilePicture;

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
