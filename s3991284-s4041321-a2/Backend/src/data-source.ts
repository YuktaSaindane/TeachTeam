// Database configuration for TeachTeam backend
// Sets up MySQL connection and entity mappings

import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "./entities/User";
import { Course } from "./entities/Course";
import { CourseLecturer } from "./entities/CourseLecturer";
import { TutorApplication } from "./entities/TutorApplication";
import { SelectedCandidate } from "./entities/SelectedCandidate";
import * as dotenv from "dotenv";
dotenv.config();

// Database connection configuration
// Uses environment variables for sensitive information

export const AppDataSource = new DataSource({
   type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
  entities: [
    User,
    Course,
    CourseLecturer,
    TutorApplication,
    SelectedCandidate
  ],
});
