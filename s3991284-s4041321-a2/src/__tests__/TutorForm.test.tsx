import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TutorForm from "../pages/TutorForm";

const getElementByPlaceholder = (placeholder: string) => {
  return screen.getByPlaceholderText(placeholder) as HTMLInputElement;
};

describe("TutorForm Workflow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("submits valid tutor application and resets fields", () => {
    render(
      <MemoryRouter>
        <TutorForm />
      </MemoryRouter>
    );

    // to fill required fields
    fireEvent.change(getElementByPlaceholder("Enter your full name"), {
      target: { value: "Dipanshu Modi" },
    });

    fireEvent.change(getElementByPlaceholder("example@email.com"), {
      target: { value: "dipanshu@example.com" },
    });

    const courseSelect = screen.getByRole("combobox", { name: /Select Course/i });
    fireEvent.change(courseSelect, { target: { value: "COSC1111" } });

    const availabilitySelect = screen.getByRole("combobox", { name: /Availability/i });
    fireEvent.change(availabilitySelect, { target: { value: "Full Time" } });

    // seelecting some skills
    const programmingSkill = screen.getByText("Programming").closest("label")!.querySelector("input")!;
    const aiSkill = screen.getByText("AI").closest("label")!.querySelector("input")!;
    fireEvent.click(programmingSkill);
    fireEvent.click(aiSkill);

    // enteri previous roles and credentials
    fireEvent.change(getElementByPlaceholder("E.g., Tutor, Lab Assistant"), {
      target: { value: "Tutor" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("List your degrees, certifications, or academic achievements"),
      { target: { value: "BSc Computer Science" } }
    );

    // Submiting the form
    const submitBtn = screen.getByRole("button", { name: /Submit Application/i });
    fireEvent.click(submitBtn);

    // to expect success message
    const message = screen.getByText("Application submitted successfully!");
    expect(message.textContent).toMatch(/successfully/i);

    // checking if localStorage is updated with correct structure
    const stored = JSON.parse(localStorage.getItem("tutorApplications") || "[]");
    expect(stored.length).toBe(1);
    expect(stored[0].name).toBe("Dipanshu Modi");
    expect(stored[0].skills).toEqual(expect.arrayContaining(["Programming", "AI"]));
  });

  test("prevents submission if required fields are missing", () => {
    render(
      <MemoryRouter>
        <TutorForm />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /Submit Application/i });
    fireEvent.click(submitBtn);

    const stored = JSON.parse(localStorage.getItem("tutorApplications") || "[]");
    expect(stored.length).toBe(0);
  });
});
