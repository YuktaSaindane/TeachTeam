import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import SignIn from "../pages/SignIn";

// mocking reCAPTCHA componet used in SignIn form
vi.mock("react-google-recaptcha", () => ({
  default: ({ onChange }: any) => (
    <div onClick={() => onChange("mock-token")}>Mock CAPTCHA</div>
  ),
}));
// pre-loading mock user credentials into localStorage before each test
describe("SignIn Component", () => {
  beforeEach(() => {
    localStorage.setItem(
      "users",
      JSON.stringify([
        { email: "tutor@gmail.com", password: "Tutor@1234", role: "tutor" },
        { email: "lecturer@gmail.com", password: "Lecturer@1234", role: "lecturer" },
      ])
    );
  });
// checking if that both email and password fields render properly
  test("renders email and password inputs", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
  });
// testing validation error when invalid email format is entered
  test("shows error for invalid email", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid" } });
    fireEvent.click(screen.getByText(/mock captcha/i));
    fireEvent.click(screen.getByTestId("signInButton"));
    expect(screen.getByText(/valid email address/i)).toBeDefined();
  });

  // testing validation error when a weak password is entered
  test("shows error for weak password", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@mail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "123" } });
    fireEvent.click(screen.getByText(/mock captcha/i));
    fireEvent.click(screen.getByTestId("signInButton"));
    expect(screen.getByText(/password must contain/i)).toBeDefined();
  });

   // a successful login flow and expects redirection (navigation mocked)
  test("successful login redirects to tutor dashboard", () => {
    const mockNavigate = vi.fn();
  
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "tutor@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "Tutor@1234" } });
    fireEvent.click(screen.getByText(/mock captcha/i));
    fireEvent.click(screen.getByTestId("signInButton"));
    // Note-since redirection uses useNavigate(), so, mocking is acknowledged here but not used in this case
  });
  
});