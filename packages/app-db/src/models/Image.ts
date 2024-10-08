import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Place } from "./Place";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string;

  @ManyToOne(() => Place, (place) => place.images, { onDelete: "CASCADE" })
  place: Place;
}
