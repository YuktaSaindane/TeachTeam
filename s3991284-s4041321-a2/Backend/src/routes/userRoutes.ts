// This file defines the user management routes for the TeachTeam backend.
// It provides endpoints for managing user profiles, including
// updating user avatars and other profile information.

import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRouter = express.Router();
const userRepo = AppDataSource.getRepository(User);

// PUT /api/users/:email - Update a user's avatar URL
// Updating the avatar url for the user with the specified email
userRouter.put("/users/:email", (req: Request, res: Response): void => {
  const { email } = req.params;
  const { avatar_url } = req.body;

  const updateAvatar = async () => {
    try {
      // Find user by email
      const user = await userRepo.findOneBy({ email });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Update avatar URL and save changes
      user.avatar_url = avatar_url;
      await userRepo.save(user);

      res.status(200).json({ message: "Avatar updated", avatar_url });
    } catch (error) {
      console.error("Error updating avatar:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  void updateAvatar();
});

export default userRouter;
