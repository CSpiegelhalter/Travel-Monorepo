import { Entity, PrimaryGeneratedColumn, Point, Column } from "typeorm";

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

  @Column()
  categories: string;

  @Column()
  short_description: string;

  @Column()
  long_description: string;

  @Column()
  images: string;

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
}
