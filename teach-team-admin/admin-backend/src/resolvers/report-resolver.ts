// This file defines the reporting resolver for the admin backend.
// It provides GraphQL queries for generating various reports about candidates and courses,
// including selected candidates by course, overloaded candidates, and unselected candidates.

import { Resolver, Query, ObjectType, Field } from "type-graphql";
import { AppDataSource } from "../utils/db";
import { SelectedCandidate } from "../entities/SelectedCandidate";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import { TutorApplication } from "../entities/TutorApplication";

// Represents information about a candidate
@ObjectType()
class CandidateInfo {
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;
}

// Represents a course along with its selected candidates
@ObjectType()
class CourseWithCandidates {
  @Field(() => Course)
  course!: Course;

  @Field(() => [CandidateInfo])
  candidates!: CandidateInfo[];
}

// Represents a candidate who has been selected for more than 3 courses
@ObjectType()
class OverloadedCandidate {
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  totalCourses!: number;
}

// Represents information about an unselected candidate
@ObjectType()
class UnselectedCandidate {
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;
}

// Represents information about a course
@ObjectType()
class UnselectedCourseInfo {
  @Field() code!: string;
  @Field() name!: string;
  @Field() semester!: string;
}

// Represents detailed information about an unselected candidate and their unselected courses
@ObjectType()
class UnselectedCandidateDetail {
  @Field() id!: number;
  @Field() name!: string;
  @Field() email!: string;

  @Field(() => [UnselectedCourseInfo])
  unselectedCourses!: UnselectedCourseInfo[];
}

// Represents a course with its unselected candidates
@ObjectType()
class CourseWithUnselectedCandidates {
  @Field(() => Course)
  course!: Course;

  @Field(() => [CandidateInfo])
  unselectedCandidates!: CandidateInfo[];
}

@Resolver()
export class ReportResolver {
  // Retrieves all courses with their selected candidates
  // Returns an array of courses, each containing a list of selected candidates
  @Query(() => [CourseWithCandidates])
  async getSelectedCandidatesByCourse(): Promise<CourseWithCandidates[]> {
    const courseRepo = AppDataSource.getRepository(Course);
    const selectedRepo = AppDataSource.getRepository(SelectedCandidate);

    const courses = await courseRepo.find();
    const selected = await selectedRepo.find({
      relations: ["application", "application.user", "application.course"],
    });

    const courseMap: Record<number, CandidateInfo[]> = {};

    for (const sel of selected) {
      const app = sel.application;
      if (!app || !app.course || !app.user) continue;

      if (!courseMap[app.course.id]) {
        courseMap[app.course.id] = [];
      }

      // Check if candidate is already added to avoid duplicates
      const existingCandidate = courseMap[app.course.id].find(
        candidate => candidate.id === app.user.id
      );

      if (!existingCandidate) {
        courseMap[app.course.id].push({
          id: app.user.id,
          name: app.user.name,
          email: app.user.email,
        });
      }
    }

    return courses.map((course) => ({
      course,
      candidates: courseMap[course.id] || [],
    }));
  }

  // Retrieves candidates who have been selected for more than 3 courses
  // Returns an array of candidates with their total course count
  @Query(() => [OverloadedCandidate])
  async getOverloadedCandidates(): Promise<OverloadedCandidate[]> {
    const repo = AppDataSource.getRepository(SelectedCandidate);

    const raw = await repo
      .createQueryBuilder("sc")
      .innerJoin("sc.application", "app")
      .innerJoin("app.user", "user")
      .select("user.id", "id")
      .addSelect("user.name", "name")
      .addSelect("user.email", "email")
      .addSelect("COUNT(*)", "totalCourses")
      .groupBy("user.id")
      .having("COUNT(*) > 3")
      .getRawMany();

    return raw.map((r) => ({
      id: parseInt(r.id),
      name: r.name,
      email: r.email,
      totalCourses: parseInt(r.totalCourses),
    }));
  }

  // Retrieves all courses with their unselected candidates
  // Returns an array of courses, each containing a list of unselected candidates
  @Query(() => [CourseWithUnselectedCandidates])
  async getUnselectedCandidatesByCourse(): Promise<CourseWithUnselectedCandidates[]> {
    const courseRepo = AppDataSource.getRepository(Course);
    const appRepo = AppDataSource.getRepository(TutorApplication);

    const courses = await courseRepo.find();
    const applications = await appRepo.find({
      relations: ["course", "user"],
      where: { is_selected: false }
    });

    const courseMap: Record<number, CandidateInfo[]> = {};

    for (const app of applications) {
      if (!app.course || !app.user || app.user.role !== 'candidate') continue;

      if (!courseMap[app.course.id]) {
        courseMap[app.course.id] = [];
      }

      // Check if candidate is already added to avoid duplicates
      const existingCandidate = courseMap[app.course.id].find(
        candidate => candidate.id === app.user.id
      );

      if (!existingCandidate) {
        courseMap[app.course.id].push({
          id: app.user.id,
          name: app.user.name,
          email: app.user.email,
        });
      }
    }

    return courses.map((course) => ({
      course,
      unselectedCandidates: courseMap[course.id] || [],
    }));
  }

  // Retrieves candidates who have unselected applications
  // Returns detailed information about each candidate and their unselected courses
  @Query(() => [UnselectedCandidateDetail])
  async getUnselectedCandidates(): Promise<UnselectedCandidateDetail[]> {
    const userRepo = AppDataSource.getRepository(User);
    const appRepo = AppDataSource.getRepository(TutorApplication);

    const candidates = await userRepo.find({ where: { role: 'candidate' } });

    const apps = await appRepo.find({
      relations: ["course", "user"],
    });

    const unselectedByUser = new Map<number, UnselectedCandidateDetail>();

    for (const app of apps) {
      if (!app.is_selected && app.user.role === 'candidate') {
        if (!unselectedByUser.has(app.user.id)) {
          unselectedByUser.set(app.user.id, {
            id: app.user.id,
            name: app.user.name,
            email: app.user.email,
            unselectedCourses: [],
          });
        }

        unselectedByUser.get(app.user.id)!.unselectedCourses.push({
          code: app.course.code,
          name: app.course.name,
          semester: app.course.semester,
        });
      }
    }

    return Array.from(unselectedByUser.values());
  }
}
