import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { useApplicantStats } from "../hooks/useApplicantStats";

// helper component to run the hook
const HookTester = ({ applications }: { applications: any[] }) => {
  const { mostChosen, leastChosen, unselected } = useApplicantStats(applications);
  return (
    <div>
      <div data-testid="most">{mostChosen?.name ?? ""}</div>
      <div data-testid="least">{leastChosen?.name ?? ""}</div>
      <div data-testid="unselected">{unselected.join(",")}</div>
    </div>
  );
};


describe("useApplicantStats hook", () => {
  test("calculates most/least chosen and unselected applicants", () => {
    const mockData = [
      { name: "Modi", isSelected: true },
      { name: "Yukta", isSelected: true },
      { name: "Modi", isSelected: true },
      { name: "Akshay", isSelected: false },
    ];

    render(<HookTester applications={mockData} />);
    expect(screen.getByTestId("most").textContent).toBe("Modi");
    expect(screen.getByTestId("least").textContent).toBe("Yukta");
    expect(screen.getByTestId("unselected").textContent).toContain("Akshay");
  });

  test("returns empty values when all applicants are unselected", () => {
    const data = [
      { name: "Dipanshu", isSelected: false },
      { name: "Saindane", isSelected: false },
    ];
    render(<HookTester applications={data} />);
    expect(screen.getByTestId("most").textContent).toBe("");
    expect(screen.getByTestId("least").textContent).toBe("");
    expect(screen.getByTestId("unselected").textContent).toBe("Dipanshu,Saindane");
  });
  // either name can be the most or least chosen due to equal counts
  test("handles all selected applicants with equal counts", () => {
    const data = [
      { name: "Kumar", isSelected: true },
      { name: "Vishawas", isSelected: true },
    ];
    render(<HookTester applications={data} />);

    // since both are same, whichever comes first in the loop will be both most and least
    const most = screen.getByTestId("most").textContent;
    const least = screen.getByTestId("least").textContent;
    expect(["Kumar", "Vishawas"]).toContain(most);
    expect(["Kumar", "Vishawas"]).toContain(least);
  });
// single applicant selected and one unselected applicant case
  test("returns correct values for single selected applicant", () => {
    const data = [
      { name: "Rohan", isSelected: true },
      { name: "Rohit", isSelected: false },
    ];
    render(<HookTester applications={data} />);
    expect(screen.getByTestId("most").textContent).toBe("Rohan");
    expect(screen.getByTestId("least").textContent).toBe("Rohan");
    expect(screen.getByTestId("unselected").textContent).toBe("Rohit");
  });
// what if theres empty application list
  test("returns empty strings for empty input", () => {
    render(<HookTester applications={[]} />);
    expect(screen.getByTestId("most").textContent).toBe("");
    expect(screen.getByTestId("least").textContent).toBe("");
    expect(screen.getByTestId("unselected").textContent).toBe("");
  });
  // what if theres mixed selection states with duplicate names included
  test("handles duplicate names with different selection status", () => {
    const data = [
      { name: "Rakesh", isSelected: true },
      { name: "Rakesh", isSelected: false },
      { name: "Rakesh", isSelected: true },
      { name: "Ram", isSelected: true },
    ];
    render(<HookTester applications={data} />);
    expect(screen.getByTestId("most").textContent).toBe("Rakesh");
    expect(screen.getByTestId("least").textContent).toBe("Ram");
    expect(screen.getByTestId("unselected").textContent).toContain("Rakesh"); // one Rakesh was unselected
  });
});
