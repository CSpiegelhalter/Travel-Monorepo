import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  website: string;

  @Column()
  categories: string;

  @Column()
  short_description: string;

  @Column()
  long_description: string;

  @Column()
  images: string;

  @Column("float")
  rating: number;

  @Column()
  reviews: number;

  @Column("float")
  latitude: number;

  @Column("float")
  longitude: number;

  // Use PostGIS geometry column for geospatial queries
  @Column({
    type: "geometry",
    spatialFeatureType: "Point", // Defines this as a Point geometry
    srid: 4326, // SRID for WGS84, the standard for GPS coordinates
  })
  location: string;
}
