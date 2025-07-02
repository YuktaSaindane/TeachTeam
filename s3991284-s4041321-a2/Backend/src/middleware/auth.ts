// Authentication and authorization middleware for TeachTeam backend
// Ensures role-based access control and prevents unauthorized access
// Validates user roles before allowing access to protected routes

import { Request, Response, NextFunction } from "express";

// Extended Request interface to include user information
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    email: string;
  };
}

// Middleware to verify lecturer role access
export const requireLecturerRole = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // In a real application, you would verify the JWT token here
  // For this implementation, we'll check the user role from the request body or headers
  const userRole = req.headers['user-role'] as string;
  const userId = req.headers['user-id'] as string;

  if (!userRole || !userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  if (userRole !== 'lecturer') {
    res.status(403).json({ 
      message: "Access denied. Lecturer role required." 
    });
    return;
  }

  // Add user info to request for later use
  req.user = {
    id: parseInt(userId),
    role: userRole,
    email: req.headers['user-email'] as string || ""
  };

  next();
};

// Middleware to verify candidate role access
export const requireCandidateRole = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userRole = req.headers['user-role'] as string;
  const userId = req.headers['user-id'] as string;

  if (!userRole || !userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  if (userRole !== 'candidate') {
    res.status(403).json({ 
      message: "Access denied. Candidate role required." 
    });
    return;
  }

  req.user = {
    id: parseInt(userId),
    role: userRole,
    email: req.headers['user-email'] as string || ""
  };

  next();
};

// Middleware to verify user owns the resource
export const requireResourceOwnership = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user?.id;
  const resourceUserId = parseInt(req.params.userId);

  if (!userId || userId !== resourceUserId) {
    res.status(403).json({ 
      message: "Access denied. You can only access your own resources." 
    });
    return;
  }

  next();
}; 