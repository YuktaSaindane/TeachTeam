import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, beforeEach, test, vi, expect } from "vitest";
import Navbar from "../components/Navbar";

describe("Navbar Component", () => {
  beforeEach(() => {
    // simulating tutor user login
    localStorage.setItem("user", JSON.stringify({ email: "tutor@gmail.com", role: "tutor" }));
  });

  test("shows correct links for tutor", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Tutor role-specific links
    
    expect(screen.getAllByText(/tutor dashboard/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/my applications/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeDefined();

    //common links
    expect(screen.getByText(/home/i)).toBeDefined();
  });

  test("toggles mobile menu", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    //click mobile toggle menu
    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(toggleButton);

    // should show tutor dashboard in mobile nav
    expect(screen.getAllByText(/tutor dashboard/i).length).toBeGreaterThan(0);
  });
});
