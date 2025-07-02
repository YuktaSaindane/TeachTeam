import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LecturerReview from "../pages/LecturerReview";

// Mock ResizeObserver for Recharts compatibility
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// tutor application data with ranks
const mockTutorApplications = [
  {
    name: "Dipanshu Modi",
    email: "dipanshu.modi@example.com",
    course: "COSC1111",
    role: "Tutor",
    previousRoles: "TA - Intro to Programming",
    availability: "Full Time",
    skills: ["Programming", "Databases"],
    credentials: "Bachelor of IT, RMIT University",
    isSelected: false,
  },
  {
    name: "Yukta Saindane",
    email: "yukta.saindane@example.com",
    course: "COSC2222",
    role: "Tutor",
    previousRoles: "Project Mentor",
    availability: "Part Time",
    skills: "Web Development",
    credentials: "Masters in CS, Monash University",
    isSelected: true,
    rank: 1,
    comment: "Great mentoring skills",
  },
  {
    name: "Akshay Singh",
    email: "akshay.singh@example.com",
    course: "COSC3333",
    role: "Tutor",
    previousRoles: "Data Structures TA",
    availability: "Full Time",
    skills: ["Algorithms", "Programming"],
    credentials: "PhD Candidate, Data Science",
    isSelected: true,
    rank: 2,
    comment: "Strong theoretical foundation",
  },
];

describe("LecturerReview Page", () => {
  beforeEach(() => {
    localStorage.setItem("tutorApplications", JSON.stringify(mockTutorApplications));
    localStorage.setItem("selectedCandidates", JSON.stringify([mockTutorApplications[1], mockTutorApplications[2]]));
  });

  // to ensure all applicants render correctly from localStorage
  test("renders all applicants from localStorage", () => {
    render(<MemoryRouter><LecturerReview /></MemoryRouter>);
    const dipanshu = screen.getAllByText("Dipanshu Modi").find((el) => el.closest(".border-b"));
    const yukta = screen.getAllByText("Yukta Saindane").find((el) => el.closest(".border-b"));
    const akshay = screen.getAllByText("Akshay Singh").find((el) => el.closest(".border-b"));
    expect(dipanshu).toBeTruthy();
    expect(yukta).toBeTruthy();
    expect(akshay).toBeTruthy();
  });

  // This 'Full Time' filter ensures dipanshu n akshay match the criteria
  test("filters by availability", () => {
    render(<MemoryRouter><LecturerReview /></MemoryRouter>);

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "Full Time" } });

    const dipanshuVisible = screen.getAllByText("Dipanshu Modi").filter((el) => el.closest(".border-b"));
    const akshayVisible = screen.getAllByText("Akshay Singh").filter((el) => el.closest(".border-b"));
    expect(dipanshuVisible.length).toBeGreaterThan(0);
    expect(akshayVisible.length).toBeGreaterThan(0);

    // Yukta is part-time, should not be visible
    const yukta = screen.queryAllByText("Yukta Saindane").find((el) => el.closest(".border-b"));
    expect(yukta).toBeUndefined();
  });

  // selecting and ranking an applicant, then verifies updates in localStorage
  test("selects and ranks an applicant", async () => {
    render(<MemoryRouter><LecturerReview /></MemoryRouter>);

    const dipanshuContainer = screen.getAllByText("Dipanshu Modi").find((el) => el.closest(".border-b"))!.closest(".border-b")!;
    const checkbox = within(dipanshuContainer as HTMLElement).getByRole("checkbox");
    fireEvent.click(checkbox);

    const rankInput = within(dipanshuContainer as HTMLElement).getByLabelText(/Rank/i);
    fireEvent.change(rankInput, { target: { value: "3" } });

    const commentBox = within(dipanshuContainer as HTMLElement).getByLabelText(/Comment/i);
    fireEvent.change(commentBox, { target: { value: "Shows strong teaching skills" } });

    await waitFor(() => {
      const updated = JSON.parse(localStorage.getItem("tutorApplications") || "[]");
      expect(updated[0].isSelected).toBe(true);
      expect(updated[0].rank).toBe(3);
      expect(updated[0].comment).toBe("Shows strong teaching skills");
    });
  });

  // ensuring that theres fallback UI renders when no tutor data is present
  test("shows fallback when no applicants", () => {
    localStorage.setItem("tutorApplications", JSON.stringify([]));
    render(<MemoryRouter><LecturerReview /></MemoryRouter>);
    expect(screen.getByText(/No applicants found/i)).toBeTruthy();
  });

  // it makes sure dynamic filtering of applicants based on typed skill input, looking like real-time search
  test("filters by skills", () => {
    render(<MemoryRouter><LecturerReview /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/Search by Skills/i), {
      target: { value: "Programming" },
    });

    const dipanshu = screen.getAllByText("Dipanshu Modi").find((el) => el.closest(".border-b"));
    const akshay = screen.getAllByText("Akshay Singh").find((el) => el.closest(".border-b"));
    expect(dipanshu).toBeTruthy();
    expect(akshay).toBeTruthy();

    // Yukta doesn't have "Programming" as skill, should be filtered out
    const yukta = screen.queryAllByText("Yukta Saindane").find((el) => el.closest(".border-b"));
    expect(yukta).toBeUndefined();
  });

  // it validates course dropdown filter matches only the selected applicant
  test("filters by course dropdown", () => {
    render(<MemoryRouter><LecturerReview /></MemoryRouter>);

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "COSC3333" } });

    const akshay = screen.getAllByText("Akshay Singh").find((el) => el.closest(".border-b"));
    expect(akshay).toBeTruthy();

    // Only Akshay has this course; others should be filtered
    const dipanshu = screen.queryAllByText("Dipanshu Modi").find((el) => el.closest(".border-b"));
    const yukta = screen.queryAllByText("Yukta Saindane").find((el) => el.closest(".border-b"));
    expect(dipanshu).toBeUndefined();
    expect(yukta).toBeUndefined();
  });
});
