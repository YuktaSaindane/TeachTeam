// This file defines the authentication routes for the TeachTeam backend.
// It provides endpoints for user registration (signup) and login (signin).

import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { validateUserRegistration, validateUserLogin } from "../middleware/validation";

const router = Router();

// POST /api/signup - Register a new user with validation
router.post("/signup", validateUserRegistration, AuthController.signupHandler);

// POST /api/signin - Authenticate and login a user with validation
router.post("/signin", validateUserLogin, AuthController.loginHandler);

export default router;
