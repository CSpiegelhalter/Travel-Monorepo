import {
  Entity,
  PrimaryGeneratedColumn,
  Point,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Image } from "./Image";

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  website: string;

  @ManyToMany(() => Category, { cascade: true }) 
  @JoinTable()
  categories: Category[];

  @Column()
  short_description: string;

  @Column()
  long_description: string;

  @OneToMany(() => Image, (image) => image.place, { cascade: true })
  images: Image[];

  @Column("float", { nullable: true })
  rating: number;

  @Column({ nullable: true })
  reviews: number;

  @Column("float")
  latitude: number;

  @Column("float")
  longitude: number;

  // Use PostGIS geography column for geospatial queries
  @Column({
    type: "geography",
    spatialFeatureType: "Point", // Defines this as a Point geometry
    srid: 4326, // SRID for WGS84, the standard for GPS coordinates
  })
  location: Point;

  @ManyToMany(() => User, (user) => user.savedPlaces)
  savedByUsers: User[];

  @ManyToMany(() => User, (user) => user.userHasBeen)
  usersHaveBeen: User[];

  @ManyToOne(() => User, { nullable: true })
  addedByUser: User | null;

  @ManyToMany(() => User, (user) => user.editedPlaces)
  @JoinTable()
  editedByUsers: User[];
}
