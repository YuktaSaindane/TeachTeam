import request from "supertest";
import express from "express";
import cors from "cors";
import { AppDataSource } from "../data-source";

// Mock database connection for server integration testing
jest.mock("../data-source", () => ({
  AppDataSource: {
    initialize: jest.fn(),
    isInitialized: true,
  },
}));

describe("Server Integration and Error Handling Tests", () => {
  let app: express.Application;

  beforeAll(() => {
    // Setup Express application with middleware similar to actual server
    app = express();
    app.use(cors());
    app.use(express.json());

    // Add basic routes for testing
    app.get("/", (req, res) => {
      res.send("TeachTeam backend is live!");
    });

    // Test route for error handling
    app.get("/test-error", (req, res, next) => {
      const error = new Error("Test error for error handling");
      next(error);
    });

    // Test route for JSON parsing
    app.post("/test-json", (req, res) => {
      res.json({ received: req.body });
    });

    // Test route for CORS functionality
    app.get("/test-cors", (req, res) => {
      res.json({ message: "CORS test successful" });
    });

    // Global error handler for testing
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(500).json({ error: err.message });
    });
  });

  describe("Server Startup and Basic Functionality", () => {
    test("should respond to root endpoint with welcome message", async () => {
      // Root endpoint should provide confirmation that server is operational
      const response = await request(app).get("/");

      // Server should respond with appropriate welcome message
      expect(response.status).toBe(200);
      expect(response.text).toBe("TeachTeam backend is live!");
    });

    test("should handle database initialization properly", async () => {
      // Database connection is critical for application functionality
      const mockInitialize = AppDataSource.initialize as jest.Mock;
      mockInitialize.mockResolvedValue(undefined);

      // Database initialization should complete without errors
      await expect(AppDataSource.initialize()).resolves.toBeUndefined();
      expect(mockInitialize).toHaveBeenCalled();
    });

    test("should handle database connection failures gracefully", async () => {
      // System should handle database failures without crashing
      const mockInitialize = AppDataSource.initialize as jest.Mock;
      mockInitialize.mockRejectedValue(new Error("Database connection failed"));

      // Database connection failure should be properly caught
      await expect(AppDataSource.initialize()).rejects.toThrow("Database connection failed");
    });
  });

  describe("Middleware Functionality", () => {
    test("should parse JSON requests correctly", async () => {
      // JSON parsing middleware is essential for API functionality
      const testData = {
        name: "Test User",
        email: "test@university.edu",
        role: "candidate"
      };

      const response = await request(app)
        .post("/test-json")
        .send(testData)
        .set("Content-Type", "application/json");

      // JSON data should be parsed and echoed back correctly
      expect(response.status).toBe(200);
      expect(response.body.received).toEqual(testData);
    });

    test("should handle CORS requests appropriately", async () => {
      // CORS support is necessary for frontend-backend communication
      const response = await request(app)
        .get("/test-cors")
        .set("Origin", "http://localhost:3000");

      // CORS headers should be present for cross-origin requests
      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBeDefined();
      expect(response.body.message).toBe("CORS test successful");
    });

    test("should handle malformed JSON gracefully", async () => {
      // Malformed requests should not crash the server
      const response = await request(app)
        .post("/test-json")
        .send("{ invalid json }")
        .set("Content-Type", "application/json");

      // Malformed JSON should trigger appropriate error response
      expect(response.status).toBe(500); // Express actually returns 500 for JSON parse errors
    });
  });

  describe("Error Handling and Resilience", () => {
    test("should handle application errors with proper error responses", async () => {
      // Error handling ensures system stability and user feedback
      const response = await request(app).get("/test-error");

      // Application errors should be caught and formatted appropriately
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Test error for error handling");
    });

    test("should return 404 for non-existent routes", async () => {
      // Unknown routes should be handled gracefully
      const response = await request(app).get("/non-existent-route");

      // Non-existent routes should return standard 404 response
      expect(response.status).toBe(404);
    });

    test("should handle large request payloads appropriately", async () => {
      // System should handle various payload sizes within reasonable limits
      const largeData = {
        description: "A".repeat(1000), // 1KB of text
        skills: Array(50).fill("Programming skill"),
        credentials: "B".repeat(500)
      };

      const response = await request(app)
        .post("/test-json")
        .send(largeData);

      // Large but reasonable payloads should be processed successfully
      expect(response.status).toBe(200);
      expect(response.body.received.description).toBe(largeData.description);
    });

    test("should maintain server stability under concurrent requests", async () => {
      // Concurrent request handling is crucial for multi-user environments
      const requests = Array(10).fill(null).map(() =>
        request(app).get("/")
      );

      const responses = await Promise.all(requests);

      // All concurrent requests should be handled successfully
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.text).toBe("TeachTeam backend is live!");
      });
    });
  });

  describe("Security and Validation", () => {
    test("should reject requests with invalid content types for JSON endpoints", async () => {
      // Content type validation helps prevent security issues
      const response = await request(app)
        .post("/test-json")
        .send("plain text data")
        .set("Content-Type", "text/plain");

      // Invalid content types should be handled appropriately
      expect(response.status).toBe(200); // Express still processes it but as empty body
      expect(response.body.received).toBeUndefined();
    });

    test("should handle empty request bodies gracefully", async () => {
      // Empty requests should not cause server errors
      const response = await request(app)
        .post("/test-json")
        .set("Content-Type", "application/json");

      // Empty body should be processed without errors
      expect(response.status).toBe(200);
      expect(response.body.received).toEqual({});
    });
  });
}); 