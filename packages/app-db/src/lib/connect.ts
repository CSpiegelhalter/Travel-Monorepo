import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "../models"; // Replace with your actual entity

// Define your data source options
const AppDataSource = new DataSource({
  type: "postgres", // or 'mysql', etc.
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mydb",
  entities, 
  synchronize: true, // In production, be careful with auto-sync
  logging: true, // Enable for debugging, disable in production
});

// Define the connect function
export const connect = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
    throw new Error("Failed to connect to the database");
  }
};
