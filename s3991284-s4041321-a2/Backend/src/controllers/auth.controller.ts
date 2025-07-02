// This file contains the authentication controller for the backend.
// It handles user registration i.e (signup) and login functionality,
// including input validation, password hashing, and user verification.

import { Request, Response, NextFunction,RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

// Validates email format using regex pattern
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validates password strength requirements:
// - At least 8 characters long
// - Contains uppercase letter
// - Contains lowercase letter
// - Contains number
// - Contains special character (@, #, $, %, ^, &, *, !, etc.)
// - No more than 128 characters (prevent DoS attacks)
const validatePassword = (password: string) => {
  if (!password || password.length < 8 || password.length > 128) {
    return false;
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

// Handles user registration (signup)
// Validates input fields and checks for existing users,
// hashes password, and creates new user account
export const signupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, avatar_url } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ message: "Invalid email format." });
      return;
    }

    const userRepo = AppDataSource.getRepository(User);
    const existing = await userRepo.findOne({ where: { email } });

    if (existing) {
      res.status(409).json({ message: "Email already exists." });
      return;
    }

    if (!validatePassword(password)) {
      res.status(400).json({
        message:
          "Password must be 8-128 characters long and include uppercase, lowercase, number, and special character (!@#$%^&* etc.).",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      name,
      email,
      password: hashedPassword,
      role,
      avatar_url,
    });

    await userRepo.save(user);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    next(err); 
  }
};

// Handles user login
// Validates credentials, checks for blocked accounts,
// verifies password, and returns user information
export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ message: "Invalid email format." });
      return;
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

   
    if (user.is_blocked) {
      res.status(403).json({ message: "Your account has been blocked. Please contact admin." });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        joined_at: user.joined_at,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    next(err);
  }
};
