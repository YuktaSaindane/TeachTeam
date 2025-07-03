// Main server file for TeachTeam backend
// Sets up Express server with routes and database connection
// Server runs on port 3001

import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/userRoutes";
import applicationRoutes from "./routes/application.routes";

// Create Express application
const app = express();


app.use(cors());
app.use(express.json());

// Set up API routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", applicationRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("TeachTeam backend is live!");
});

// Initialize database connection and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to Cloud MySQL");
    app.listen(3001, () => {
      console.log("Server running on http://localhost:3001");
    });
  })
  .catch((err:unknown) => {
    console.error("Failed to connect to DB", err);
  });
