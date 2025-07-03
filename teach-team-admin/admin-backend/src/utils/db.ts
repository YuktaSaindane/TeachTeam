// This file handles database configuration and connection for the admin backend.
// It sets up the TypeORM DataSource with MySQL configuration and provides
// a function to establish the database connection.

import * as dotenv from "dotenv";
dotenv.config();

// Import required TypeORM classes and entities (tables)
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Course } from "../entities/Course";
import { TutorApplication } from "../entities/TutorApplication";
import { SelectedCandidate } from "../entities/SelectedCandidate";
import { CourseLecturer } from "../entities/CourseLecturer";

// Database connection configuration using TypeORM DataSource
// Uses environment variables for sensitive information
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, 
  logging: true,
  entities: [
    User,
    Course,
    TutorApplication,
    SelectedCandidate,
    CourseLecturer,
  ],
});

// Establishingn connection to the MySQL database

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Connected to Cloud MySQL");
  } catch (err) {
    console.error(" Error connecting to DB:", err);
  }
};
