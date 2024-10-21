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

  @ManyToMany(() => Place, (place) => place.editedByUsers, {
    cascade: true,
  })
  editedPlaces: Place[];

  @ManyToMany(() => Place, (place) => place.savedByUsers, {
    cascade: true,
  })
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

  @ManyToMany(() => Place, (place) => place.usersHaveBeen, {
    cascade: true,
  })
  @JoinTable({
    name: "UserHasBeen",
    joinColumn: {
      name: "userId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "placeId",
      referencedColumnName: "id",
    },
  })
  userHasBeen: Place[];

  @OneToMany(() => AddRequest, (addRequest) => addRequest.user, {
    cascade: true,
  })
  addRequests: AddRequest[];
}
