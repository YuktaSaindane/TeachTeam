// This file defines the application routes for the TeachTeam backend.
// It provides endpoints for managing tutor applications, including
// creating, reading, updating, and deleting applications, as well as
// retrieving application statistics.

import { Router } from "express";
import * as ApplicationController from "../controllers/application.controller";
import { 
  validateApplicationData, 
  validateApplicationUpdate, 
  validateLecturerId, 
  validateApplicationId 
} from "../middleware/validation";
import { 
  requireLecturerRole, 
  requireCandidateRole 
} from "../middleware/auth";

const router = Router();

// POST /api/applications - Create a new tutor application (candidates only)
router.post("/applications", requireCandidateRole, validateApplicationData, ApplicationController.createApplication);

// GET /api/applications - Get all tutor applications
router.get("/applications", ApplicationController.getApplications);

// GET /api/applications/user/:userId - Get applications for a specific user
router.get("/applications/user/:userId", ApplicationController.getUserApplications);

// GET /api/applications/lecturer/:lecturerId - Get applications for a lecturer's courses (lecturers only)
router.get("/applications/lecturer/:lecturerId", requireLecturerRole, validateLecturerId, ApplicationController.getLecturerApplications);

// DELETE /api/applications/:id - Delete a specific application
router.delete("/applications/:id", validateApplicationId, ApplicationController.deleteApplication);

// PATCH /api/applications/:id - Update a specific application (lecturers only)
router.patch("/applications/:id", requireLecturerRole, validateApplicationId, validateApplicationUpdate, ApplicationController.updateApplication);

// GET /api/stats - Get application statistics (lecturers only)
router.get("/stats", requireLecturerRole, ApplicationController.getApplicationStats);

export default router;
