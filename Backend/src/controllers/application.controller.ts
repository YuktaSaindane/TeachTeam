// This file contains the application controller for the backend.
// It handles tutor application management, including creating, reading,
// updating, and deleting applications, as well as retrieving the application statistics

import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { TutorApplication } from "../entities/TutorApplication";
import { User } from "../entities/User";
import { Course } from "../entities/Course";
import { CourseLecturer } from "../entities/CourseLecturer";
import { In, Like, ILike, Not } from "typeorm";
import { SelectedCandidate } from "../entities/SelectedCandidate";

// mapping of course codes to their names
const COURSE_NAMES: { [key: string]: string } = {
  "COSC1111": "Python Development",
  "COSC2222": "Web Programming",
  "COSC3333": "Data Structures and Algorithms",
  "COSC4444": "Blockchain Development",
  "COSC5555": "Mobile Programming and development",
  "COSC6666": "Database and Backend development"
};

// Creates a new tutor application
// Validates input fields, checks for existing applications,
// and creates a new application record
export const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, course, courseName, role, previousRoles, availability, skills, credentials } = req.body;

    // Validating required fields
    if (!name || !email || !course || !availability) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (!credentials?.trim() || !previousRoles?.trim()) {
        res.status(400).json({ message: "Credentials and previous roles are required." });
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        res.status(400).json({ message: "Invalid email format." });
        return;
      }

      if (skills && !Array.isArray(skills)) {
        res.status(400).json({ message: "Skills must be an array." });
        return;
      }


    const userRepo = AppDataSource.getRepository(User);
    const courseRepo = AppDataSource.getRepository(Course);
    const applicationRepo = AppDataSource.getRepository(TutorApplication);

    // Find the user
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Find or create the course with proper name
    let courseEntity = await courseRepo.findOne({ where: { code: course } });
    if (!courseEntity) {
      courseEntity = courseRepo.create({
        code: course,
        name: courseName || course,
        semester: "2024-1"
      });
      await courseRepo.save(courseEntity);
    } else {
      // Update the course name if it's different
      if (courseEntity.name !== courseName) {
        courseEntity.name = courseName;
        await courseRepo.save(courseEntity);
      }
    }

    // Check for duplicate application
    const existingApplication = await applicationRepo.findOne({
      where: {
        user: { id: user.id },
        course: { id: courseEntity.id },
        session_type: role === 'lab' ? 'lab' : 'tutorial'
      }
    });
    if (existingApplication) {
      res.status(400).json({ message: `You have already applied for ${role} role in this course.` });
      return;
    }

    // Create the application
    const application = applicationRepo.create({
      user,
      course: courseEntity,
      session_type: role === 'lab' ? 'lab' : 'tutorial',
      availability,
      role_applied: role,
      previous_roles: previousRoles,
      skills: Array.isArray(skills) ? skills.join(", ") : skills,
      credentials
    });

    await applicationRepo.save(application);
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    next(err);
  }
};

// Retrieving all tutor applications
// Returns applications with related user and course information
export const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const applicationRepo = AppDataSource.getRepository(TutorApplication);
    const applications = await applicationRepo.find({
      relations: ["user", "course"]
    });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// Retrieving application statistics for a specific lecturer
// Returns data about applications and selections for courses assigned to the lecturer
export const getApplicationStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lecturerId } = req.query;

    if (!lecturerId) {
      res.status(400).json({ message: "Missing lecturerId" });
      return;
    }

    // Get course IDs for this lecturer
    const assignedCourses = await AppDataSource.getRepository(CourseLecturer)
      .createQueryBuilder("cl")
      .leftJoinAndSelect("cl.course", "course")
      .where("cl.lecturer.id = :lecturerId", { lecturerId })
      .getMany();

    const courseIds = assignedCourses.map((cl) => cl.course.id);
    if (!courseIds.length) {
      res.json([]);
      return;
    }

    // Get all applications for the lecturer's courses
    const applications = await AppDataSource.getRepository(TutorApplication)
      .createQueryBuilder("ta")
      .innerJoin("ta.user", "user")
      .where("ta.courseId IN (:...courseIds)", { courseIds })
      .select("user.id", "userId")
      .addSelect("user.name", "name")
      .addSelect("user.email", "email")
      .addSelect("ta.is_selected", "is_selected")
      .getRawMany();

    // Group by user ID and track both selected and total applications
    const userStats: Record<number, { 
      name: string; 
      times_selected: number;
      total_applications: number;
      unselected_applications: number;
    }> = {};
    
    applications.forEach((app) => {
      const userId = parseInt(app.userId);
      if (!userStats[userId]) {
        userStats[userId] = {
          name: app.name,
          times_selected: 0,
          total_applications: 0,
          unselected_applications: 0
        };
      }
      
      userStats[userId].total_applications++;
      
      if (app.is_selected) {
        userStats[userId].times_selected++;
      } else {
        userStats[userId].unselected_applications++;
      }
    });

    // For the existing API compatibility, we return the original format
    // But now each user entry represents all their applications grouped correctly
    const stats = Object.values(userStats).map(user => ({
      name: user.name,
      times_selected: user.times_selected,
      total_applications: user.total_applications,
      unselected_applications: user.unselected_applications
    }));

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

// Retrieves all applications for a specific user
// Returns applications with related user and course information
export const getUserApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const applicationRepo = AppDataSource.getRepository(TutorApplication);
    const applications = await applicationRepo.find({
      where: { user: { id: parseInt(userId) } },
      relations: ["user", "course"]
    });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// Deletes a specific application
// Verifies application exists and removes it from the database
export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const applicationRepo = AppDataSource.getRepository(TutorApplication);
    
    const application = await applicationRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["user"]
    });

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

   

    await applicationRepo.remove(application);
    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (err) {
    next(err);
  }
};

// Updates an existing application
// Validates input and updates the application record
export const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { is_selected, rank, comment, lecturerId } = req.body;

    const applicationRepo = AppDataSource.getRepository(TutorApplication);
    const userRepo = AppDataSource.getRepository(User);
    const selectedCandidateRepo = AppDataSource.getRepository(SelectedCandidate);

    const application = await applicationRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["user", "course"]
    });

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    if (typeof is_selected === 'boolean') {
      application.is_selected = is_selected;

      if (is_selected) {
        // Only add to selected_candidates if not already added
        const existing = await selectedCandidateRepo.findOne({
          where: { application: { id: application.id }, selected_by: { id: lecturerId } },
        });

        if (!existing) {
          const lecturer = await userRepo.findOne({ where: { id: lecturerId } });
          if (!lecturer) {
            res.status(404).json({ message: "Lecturer not found" });
            return;
          }

          const selectedEntry = selectedCandidateRepo.create({
            application,
            selected_by: lecturer,
          });

          await selectedCandidateRepo.save(selectedEntry);
        }
      } else {
        // Deselect: remove from selected_candidates
        await selectedCandidateRepo.delete({
          application: { id: application.id },
          selected_by: { id: lecturerId }
        });
      }
    }

    if (rank !== undefined) {
      // Check for duplicate ranks by the same lecturer for selected candidates
      if (lecturerId) {
        const courseLecturerRepo = AppDataSource.getRepository(CourseLecturer);
        const assignedCourses = await courseLecturerRepo.find({
          where: { lecturer: { id: lecturerId } },
          relations: ["course"]
        });
        const courseIds = assignedCourses.map(cl => cl.course.id);

        const duplicateRank = await applicationRepo.findOne({
          where: {
            id: Not(parseInt(id)),
            course: { id: In(courseIds) },
            rank: rank,
            is_selected: true
          },
          relations: ["user"]
        });

        if (duplicateRank) {
          res.status(400).json({ 
            message: `Rank ${rank} is already assigned to ${duplicateRank.user.name}. Please choose a different rank.` 
          });
          return;
        }
      }
      application.rank = rank;
    }

    if (comment !== undefined) {
      application.comment = comment;
    }

    await applicationRepo.save(application);
    res.status(200).json({ message: "Application updated" });
  } catch (err) {
    next(err);
  }
};

// Retrieves applications for courses assigned to a specific lecturer
// Returns applications with related user and course information
export const getLecturerApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lecturerId } = req.params;
    const { name, sessionType, availability, skills } = req.query;
    
    // Get lecturer's assigned courses
    const courseLecturerRepo = AppDataSource.getRepository(CourseLecturer);
    const assignedCourses = await courseLecturerRepo.find({
      where: { lecturer: { id: parseInt(lecturerId) } },
      relations: ["course"]
    });

    const courseIds = assignedCourses.map(cl => cl.course.id);

    // Build where clause for filtering
    const whereClause: any = {
      course: { id: In(courseIds) }
    };

    if (name) {
      whereClause.user = {
        name: ILike(`%${name}%`)
      };
    }

    if (sessionType) {
      whereClause.session_type = sessionType;
    }

    if (availability) {
      whereClause.availability = availability;
    }

    if (skills) {
      whereClause.skills = ILike(`%${skills}%`);
    }

    // Get applications for assigned courses with filters
    const applicationRepo = AppDataSource.getRepository(TutorApplication);
    const applications = await applicationRepo.find({
      where: whereClause,
      relations: ["user", "course"],
      order: {
        created_at: "DESC"
      }
    });

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

