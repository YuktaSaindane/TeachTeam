import { Request, Response, NextFunction } from "express";
import { createApplication, getUserApplications, deleteApplication } from "../controllers/application.controller";
import { AppDataSource } from "../data-source";

// Mock the database module for isolated testing
jest.mock("../data-source");

describe("Application Controller Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockUserRepo: any;
  let mockCourseRepo: any;
  let mockApplicationRepo: any;

  beforeEach(() => {
    // Setup fresh mock environment for each test
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Mock repository objects with typical database operations
    mockUserRepo = {
      findOne: jest.fn(),
    };
    mockCourseRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    mockApplicationRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    // Configure the mocked AppDataSource to return appropriate repositories
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity.name === 'User') return mockUserRepo;
      if (entity.name === 'Course') return mockCourseRepo;
      if (entity.name === 'TutorApplication') return mockApplicationRepo;
      return {};
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Tutor Application Submission", () => {
    test("should reject application with missing required fields", async () => {
      // Input validation is crucial - incomplete applications should be rejected immediately
      mockRequest.body = {
        name: "John Smith",
        email: "john@university.edu",
        course: "COSC2222",
        // availability field missing - this should trigger validation error
        role: "tutorial",
        credentials: "Master's in Computer Science"
      };

      await createApplication(mockRequest as Request, mockResponse as Response, mockNext);

      // System should catch incomplete data before any database operations
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Missing required fields"
      });
    });

    test("should validate email format before processing application", async () => {
      // Email validation prevents invalid contact information in the system
      mockRequest.body = {
        name: "Sarah Connor",
        email: "not-an-email", // Invalid email format
        course: "COSC3333",
        availability: "Part Time",
        role: "lab",
        credentials: "PhD in Data Science",
        previousRoles: "Teaching Assistant for 2 years"
      };

      await createApplication(mockRequest as Request, mockResponse as Response, mockNext);

      // Invalid email should be caught before any database lookup
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Invalid email format."
      });
    });

    test("should prevent duplicate applications for same course and role", async () => {
      // Business rule: users can't submit multiple applications for identical positions
      mockRequest.body = {
        name: "Mike Johnson",
        email: "mike@university.edu",
        course: "COSC4444",
        courseName: "Blockchain Development",
        availability: "Full Time",
        role: "tutorial",
        credentials: "Blockchain certification",
        previousRoles: "Industry developer"
      };

      const mockUser = { id: 1, email: "mike@university.edu" };
      const mockCourse = { id: 1, code: "COSC4444", name: "Blockchain Development" };
      const existingApplication = { id: 1, user: mockUser, course: mockCourse };

      // Mock finding user and existing application
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockCourseRepo.findOne.mockResolvedValue(mockCourse);
      mockApplicationRepo.findOne.mockResolvedValue(existingApplication);

      await createApplication(mockRequest as Request, mockResponse as Response, mockNext);

      // System should detect and reject duplicate applications
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "You have already applied for tutorial role in this course."
      });
    });

    test("should successfully create application with complete valid data", async () => {
      // Happy path - valid application should be processed and stored
      mockRequest.body = {
        name: "Dr. Lisa Anderson",
        email: "lisa@university.edu",
        course: "COSC5555",
        courseName: "Mobile Programming and development",
        availability: "Full Time",
        role: "lab",
        credentials: "PhD in Mobile Computing, 5 years teaching experience",
        previousRoles: "Senior lecturer at previous institution",
        skills: ["React Native", "iOS Development", "Android Development"]
      };

      const mockUser = { id: 2, email: "lisa@university.edu" };
      const mockCourse = { id: 2, code: "COSC5555", name: "Mobile Programming and development" };
      const newApplication = { id: 1, ...mockRequest.body };

      // Mock successful database operations
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockCourseRepo.findOne.mockResolvedValue(mockCourse);
      mockApplicationRepo.findOne.mockResolvedValue(null); // No existing application
      mockApplicationRepo.create.mockReturnValue(newApplication);
      mockApplicationRepo.save.mockResolvedValue(newApplication);

      await createApplication(mockRequest as Request, mockResponse as Response, mockNext);

      // Successful application should trigger confirmation response
      expect(mockApplicationRepo.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Application submitted successfully"
      });
    });
  });

  describe("Application Management", () => {
    test("should retrieve user-specific applications correctly", async () => {
      // Users should only see their own applications for privacy and organization
      mockRequest.params = { userId: "5" };
      
      const userApplications = [
        { id: 1, course: { code: "COSC1111" }, session_type: "tutorial", created_at: new Date() },
        { id: 2, course: { code: "COSC2222" }, session_type: "lab", created_at: new Date() }
      ];

      mockApplicationRepo.find.mockResolvedValue(userApplications);

      await getUserApplications(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify correct user ID filtering and data retrieval
      expect(mockApplicationRepo.find).toHaveBeenCalledWith({
        where: { user: { id: 5 } },
        relations: ["user", "course"]
      });
      expect(mockResponse.json).toHaveBeenCalledWith(userApplications);
    });

    test("should handle application withdrawal gracefully", async () => {
      // Users should be able to withdraw applications before selection deadline
      mockRequest.params = { id: "3" };
      
      const applicationToDelete = {
        id: 3,
        user: { id: 1, name: "Tom Wilson" },
        course: { code: "COSC6666" },
        session_type: "tutorial"
      };

      mockApplicationRepo.findOne.mockResolvedValue(applicationToDelete);
      mockApplicationRepo.remove.mockResolvedValue(applicationToDelete);

      await deleteApplication(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify proper application removal and confirmation
      expect(mockApplicationRepo.remove).toHaveBeenCalledWith(applicationToDelete);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Application withdrawn successfully"
      });
    });
  });
}); 