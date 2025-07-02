// Input validation middleware for the TeachTeam backend
// Provides validation functions for application data and user inputs
// Ensures data integrity and security before processing requests

import { Request, Response, NextFunction } from "express";

// Validates tutor application creation data
export const validateApplicationData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, course, availability, skills, credentials, previousRoles } = req.body;

  // Check required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ message: "Name is required and must be a non-empty string" });
    return;
  }

  if (!email || typeof email !== 'string') {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  // Email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  if (!course || typeof course !== 'string' || course.trim().length === 0) {
    res.status(400).json({ message: "Course is required" });
    return;
  }

  if (!availability || typeof availability !== 'string' || !['Full Time', 'Part Time'].includes(availability)) {
    res.status(400).json({ message: "Availability must be either 'Full Time' or 'Part Time'" });
    return;
  }

  if (!credentials || typeof credentials !== 'string' || credentials.trim().length === 0) {
    res.status(400).json({ message: "Academic credentials are required" });
    return;
  }

  if (!previousRoles || typeof previousRoles !== 'string' || previousRoles.trim().length === 0) {
    res.status(400).json({ message: "Previous roles information is required" });
    return;
  }

  // Skills validation
  if (skills && !Array.isArray(skills) && typeof skills !== 'string') {
    res.status(400).json({ message: "Skills must be an array or string" });
    return;
  }

  next();
};

// Validates application update data (for lecturer actions)
export const validateApplicationUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { is_selected, rank, comment } = req.body;

  // Validate selection status
  if (is_selected !== undefined && typeof is_selected !== 'boolean') {
    res.status(400).json({ message: "is_selected must be a boolean value" });
    return;
  }

  // Validate rank
  if (rank !== undefined) {
    if (typeof rank !== 'number' || rank < 1 || rank > 100 || !Number.isInteger(rank)) {
      res.status(400).json({ message: "Rank must be a positive integer between 1 and 100" });
      return;
    }
  }

  // Validate comment
  if (comment !== undefined) {
    if (typeof comment !== 'string') {
      res.status(400).json({ message: "Comment must be a string" });
      return;
    }
    if (comment.length > 1000) {
      res.status(400).json({ message: "Comment cannot exceed 1000 characters" });
      return;
    }
  }

  next();
};

// Validates lecturer ID parameter
export const validateLecturerId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { lecturerId } = req.params;

  if (!lecturerId || isNaN(Number(lecturerId))) {
    res.status(400).json({ message: "Invalid lecturer ID" });
    return;
  }

  next();
};

// Validates application ID parameter
export const validateApplicationId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ message: "Invalid application ID" });
    return;
  }

  next();
};

// Enhanced password validation function
export const validatePasswordStrength = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: "Password cannot exceed 128 characters" };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasUpperCase) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }
  
  if (!hasLowerCase) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  }
  
  if (!hasNumber) {
    return { isValid: false, message: "Password must contain at least one number" };
  }
  
  if (!hasSpecialChar) {
    return { isValid: false, message: "Password must contain at least one special character (!@#$%^&* etc.)" };
  }
  
  return { isValid: true };
};

// Validates user registration data
export const validateUserRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, password, role } = req.body;

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ message: "Name is required and must be a non-empty string" });
    return;
  }

  if (name.trim().length < 2 || name.trim().length > 100) {
    res.status(400).json({ message: "Name must be between 2 and 100 characters" });
    return;
  }

  // Email validation
  if (!email || typeof email !== 'string') {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  // Password validation
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    res.status(400).json({ message: passwordValidation.message });
    return;
  }

  // Role validation
  if (!role || !['candidate', 'lecturer', 'admin'].includes(role)) {
    res.status(400).json({ message: "Role must be either 'candidate', 'lecturer', or 'admin'" });
    return;
  }

  next();
};

// Validates user login data
export const validateUserLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  // Email validation
  if (!email || typeof email !== 'string') {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  // Password presence validation
  if (!password || typeof password !== 'string') {
    res.status(400).json({ message: "Password is required" });
    return;
  }

  if (password.length === 0) {
    res.status(400).json({ message: "Password cannot be empty" });
    return;
  }

  next();
}; 