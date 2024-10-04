import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Place } from "./Place";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Place, (place) => place.categories)
  places: Place[];
}
