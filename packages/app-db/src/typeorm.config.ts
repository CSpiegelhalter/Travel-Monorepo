import { DataSource } from "typeorm";
import {
  User,
  Place,
  EditRequest,
  Category,
  Image,
  AddRequest,
  ProfilePicture,
} from "./models"; // Adjust the path to your entities

export const entities = [
  User,
  Place,
  EditRequest,
  Category,
  Image,
  AddRequest,
  ProfilePicture,
];
// Create and export a DataSource instance
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "0.0.0.0",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "travel",
  synchronize: true,
  logging: true,
  entities: entities, // Your entity files
  migrations: ["dist/migrations/**/*.js"], // Path to compiled JS migrations
});
