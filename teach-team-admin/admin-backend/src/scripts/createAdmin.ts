// This script creates the initial admin user for the admin backend.
// It checks if an admin already exists before creating a new one.
// The default admin credentials are:
// Email: admin@gmail.com
// Password: Admin@1234

import { AppDataSource } from "../utils/db";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

// Creating the initial admin user if one doesn't exist

const createAdmin = async () => {
  try {
    // Initializing database connection
    await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(User);

    // Checking if admin already exists
    const existingAdmin = await userRepo.findOne({ 
      where: { email: "admin@gmail.com" } 
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Creating admin user with hashed password
    const hashedPassword = await bcrypt.hash("Admin@1234", 10);
    
    const admin = userRepo.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      is_blocked: false
    });

    await userRepo.save(admin);
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

// Executing the admin creation script
createAdmin(); 