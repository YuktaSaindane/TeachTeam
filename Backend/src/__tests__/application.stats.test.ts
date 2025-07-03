import { Request, Response, NextFunction } from "express";
import { getApplicationStats, getLecturerApplications, updateApplication } from "../controllers/application.controller";
import { AppDataSource } from "../data-source";

// Mock database for statistics and lecturer functionality testing
jest.mock("../data-source");

describe("Application Statistics and Lecturer Management Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockCourseLecturerRepo: any;
  let mockApplicationRepo: any;
  let mockSelectedCandidateRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    // Setup mock environment for statistics and management testing
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Mock repositories for complex queries and relationships
    mockCourseLecturerRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      find: jest.fn(),
    };

    mockApplicationRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    mockSelectedCandidateRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockUserRepo = {
      findOne: jest.fn(),
    };

    // Configure repository mocking based on entity type
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity.name === 'CourseLecturer') return mockCourseLecturerRepo;
      if (entity.name === 'TutorApplication') return mockApplicationRepo;
      if (entity.name === 'SelectedCandidate') return mockSelectedCandidateRepo;
      if (entity.name === 'User') return mockUserRepo;
      return {};
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Application Statistics Generation", () => {
    test("should require lecturer ID for statistics access", async () => {
      // Statistics should be restricted to specific lecturers for privacy
      mockRequest.query = {}; // Missing lecturerId

      await getApplicationStats(mockRequest as Request, mockResponse as Response, mockNext);

      // Missing lecturer ID should trigger validation error
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Missing lecturerId"
      });
    });

    test("should return empty stats for lecturer with no assigned courses", async () => {
      // Lecturers without course assignments should see empty statistics
      mockRequest.query = { lecturerId: "5" };

      // Mock no assigned courses for this lecturer
      mockCourseLecturerRepo.getMany.mockResolvedValue([]);

      await getApplicationStats(mockRequest as Request, mockResponse as Response, mockNext);

      // No courses should result in empty statistics array
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    test("should calculate selection statistics correctly for assigned courses", async () => {
      // Statistics should accurately reflect selection patterns for decision making
      mockRequest.query = { lecturerId: "3" };

      const assignedCourses = [
        { course: { id: 1, code: "COSC2222" } },
        { course: { id: 2, code: "COSC3333" } }
      ];

      const applications = [
        { userId: "1", name: "Alice Johnson", email: "alice@example.com", is_selected: true },
        { userId: "1", name: "Alice Johnson", email: "alice@example.com", is_selected: true },
        { userId: "2", name: "Bob Smith", email: "bob@example.com", is_selected: true },
        { userId: "2", name: "Bob Smith", email: "bob@example.com", is_selected: false },
        { userId: "3", name: "Carol Davis", email: "carol@example.com", is_selected: false }
      ];

      // Mock the complex query chain for statistics
      mockCourseLecturerRepo.createQueryBuilder.mockReturnValue(mockCourseLecturerRepo);
      mockCourseLecturerRepo.getMany.mockResolvedValue(assignedCourses);
      mockApplicationRepo.createQueryBuilder.mockReturnValue(mockApplicationRepo);
      mockApplicationRepo.getRawMany.mockResolvedValue(applications);

      await getApplicationStats(mockRequest as Request, mockResponse as Response, mockNext);

      // Statistics should merge applicant data with selection counts and application totals
      expect(mockResponse.json).toHaveBeenCalledWith([
        { name: "Alice Johnson", times_selected: 2, total_applications: 2, unselected_applications: 0 },
        { name: "Bob Smith", times_selected: 1, total_applications: 2, unselected_applications: 1 },
        { name: "Carol Davis", times_selected: 0, total_applications: 1, unselected_applications: 1 }
      ]);
    });
  });

  describe("Application Selection Management", () => {
    test("should handle application selection with proper candidate tracking", async () => {
      // Selection process should maintain accurate records for administrative purposes
      mockRequest.params = { id: "10" };
      mockRequest.body = {
        is_selected: true,
        lecturerId: 2
      };

      const mockApplication = {
        id: 10,
        user: { id: 5, name: "David Wilson" },
        course: { id: 1, code: "COSC4444" },
        is_selected: false,
        rank: undefined,
        comment: undefined
      };

      const mockLecturer = { id: 2, name: "Prof. Anderson" };

      // Mock successful application and lecturer lookup
      mockApplicationRepo.findOne.mockResolvedValue(mockApplication);
      mockUserRepo.findOne.mockResolvedValue(mockLecturer);
      mockSelectedCandidateRepo.findOne.mockResolvedValue(null); // No existing selection
      mockSelectedCandidateRepo.create.mockReturnValue({
        application: mockApplication,
        selected_by: mockLecturer
      });

      await updateApplication(mockRequest as Request, mockResponse as Response, mockNext);

      // Selection should update application status and create selection record
      expect(mockApplication.is_selected).toBe(true);
      expect(mockSelectedCandidateRepo.save).toHaveBeenCalled();
      expect(mockApplicationRepo.save).toHaveBeenCalledWith(mockApplication);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    test("should handle application deselection properly", async () => {
      // Deselection should clean up selection records while preserving application data
      mockRequest.params = { id: "15" };
      mockRequest.body = {
        is_selected: false,
        lecturerId: 3
      };

      const mockApplication = {
        id: 15,
        user: { id: 8, name: "Emma Thompson" },
        course: { id: 2, code: "COSC5555" },
        is_selected: true,
        rank: 2,
        comment: undefined
      };

      mockApplicationRepo.findOne.mockResolvedValue(mockApplication);

      await updateApplication(mockRequest as Request, mockResponse as Response, mockNext);

      // Deselection should update status and remove from selected candidates
      expect(mockApplication.is_selected).toBe(false);
      expect(mockSelectedCandidateRepo.delete).toHaveBeenCalledWith({
        application: { id: 15 },
        selected_by: { id: 3 }
      });
      expect(mockApplicationRepo.save).toHaveBeenCalledWith(mockApplication);
    });

    test("should reject selection for non-existent application", async () => {
      // System should validate application existence before processing selection
      mockRequest.params = { id: "999" };
      mockRequest.body = { is_selected: true, lecturerId: 1 };

      mockApplicationRepo.findOne.mockResolvedValue(null);

      await updateApplication(mockRequest as Request, mockResponse as Response, mockNext);

      // Non-existent application should trigger appropriate error
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Application not found"
      });
      expect(mockSelectedCandidateRepo.save).not.toHaveBeenCalled();
    });
  });
}); 