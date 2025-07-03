import { Request, Response, NextFunction } from "express";
import { signupHandler, loginHandler } from "../controllers/auth.controller";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";

// Mock external dependencies 
jest.mock("../data-source");
jest.mock("bcrypt");

describe("Auth Controller Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockRepository: any;

  beforeEach(() => {
    // Fresh mock setup for each test to avoid interference
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    
    // Mock the repository with common database operations
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("User Registration Process", () => {
    test("should reject signup when required fields are missing", async () => {
      // Test case covering validation of mandatory user input
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        // password missing - should trigger validation error
        role: "candidate"
      };

      await signupHandler(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify the system properly handles incomplete data
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "All fields are required."
      });
    });

    test("should enforce strong password requirements during signup", async () => {
      // Testing password security validation - critical for user account protection
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "weak123", // Fails uppercase requirement
        role: "candidate"
      };

      await signupHandler(mockRequest as Request, mockResponse as Response, mockNext);

      // System should block weak passwords to maintain security standards
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Password must be 8-128 characters long and include uppercase, lowercase, number, and special character (!@#$%^&* etc.)."
      });
    });

    test("should prevent duplicate email registration", async () => {
      // Duplicate email prevention is crucial for user identity management
      mockRequest.body = {
        name: "John Doe",
        email: "existing@example.com",
        password: "SecurePass123",
        role: "candidate"
      };

      // Simulate existing user in database
      mockRepository.findOne.mockResolvedValue({ id: 1, email: "existing@example.com" });

      await signupHandler(mockRequest as Request, mockResponse as Response, mockNext);

      // System should detect and prevent duplicate registrations
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Email already exists."
      });
    });

    test("should successfully create user with valid data", async () => {
      // Happy path test - system should work correctly with proper input
      mockRequest.body = {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "StrongPass123!",
        role: "lecturer",
        avatar_url: "https://example.com/avatar.jpg"
      };

      // Mock successful database operations
      mockRepository.findOne.mockResolvedValue(null); // No existing user
      mockRepository.create.mockReturnValue({ id: 1, ...mockRequest.body });
      mockRepository.save.mockResolvedValue({ id: 1 });
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");

      await signupHandler(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify successful account creation flow
      expect(bcrypt.hash).toHaveBeenCalledWith("StrongPass123!", 10);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User registered successfully!"
      });
    });
  });

  describe("User Authentication Process", () => {
    test("should block login attempts for blocked users", async () => {
      // Security test - blocked users should not be able to access the system
      mockRequest.body = {
        email: "blocked@example.com",
        password: "ValidPass123"
      };

      // Mock a blocked user account
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        email: "blocked@example.com",
        password: "hashedPassword",
        is_blocked: true
      });

      await loginHandler(mockRequest as Request, mockResponse as Response, mockNext);

      // System should prevent access for blocked accounts
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Your account has been blocked. Please contact admin."
      });
    });

    test("should return user data on successful login", async () => {
      // Successful login should provide necessary user information to frontend
      mockRequest.body = {
        email: "active@example.com",
        password: "CorrectPass123"
      };

      const mockUser = {
        id: 1,
        name: "Active User",
        email: "active@example.com",
        password: "hashedPassword",
        role: "candidate",
        is_blocked: false,
        joined_at: new Date(),
        avatar_url: "https://example.com/avatar.jpg"
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await loginHandler(mockRequest as Request, mockResponse as Response, mockNext);

      // Successful login should return user profile data (excluding password)
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Login successful",
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          joined_at: mockUser.joined_at,
          avatar_url: mockUser.avatar_url,
        },
      });
    });
  });
}); 