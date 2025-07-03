import "reflect-metadata";
import { AppDataSource } from "../data-source";

// Mock the database connection for tests
jest.mock("../data-source", () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(undefined),
    getRepository: jest.fn(),
    isInitialized: true,
  },
}));

// Global test setup
beforeAll(async () => {
  // Any global setup can go here
});

afterAll(async () => {
  // Cleanup after all tests
});

// Silence console outputs during testing unless explicitly needed
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 