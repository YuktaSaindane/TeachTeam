import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/privateRoutes";

const Protected = () => <div>Protected Content</div>;
const SignIn = () => <div>Redirected to Sign In</div>;
const ErrorPage = () => <div>Unauthorized Access</div>;

describe("PrivateRoute testing", () => {
  beforeEach(() => {
    localStorage.clear(); // clearing localStorage before each test to ensure test isolation
  });

  it("redirects to /signin when no user is in localStorage", () => {
    render(
      <MemoryRouter initialEntries={["/apply"]}>
        <Routes>
          <Route
            path="/apply"
            element={
              <PrivateRoute allowedRoles={["tutor"]}>
                <Protected />
              </PrivateRoute>
            }
          />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </MemoryRouter>
    );

    // verifying that that unauthenticated users are redirected to sign-in
    const signInText = screen.queryByText("Redirected to Sign In");
    const protectedText = screen.queryByText("Protected Content");

    expect(signInText).toBeTruthy();
    expect(protectedText).toBeFalsy();
  });

  it("renders protected content when user role matches", () => {
    // simulate a valid tutor user in localStorage
    localStorage.setItem("user", JSON.stringify({ email: "tutor@tt.com", role: "tutor" }));

    render(
      <MemoryRouter initialEntries={["/apply"]}>
        <Routes>
          <Route
            path="/apply"
            element={
              <PrivateRoute allowedRoles={["tutor"]}>
                <Protected />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    // here content is shown because role matches
    const protectedText = screen.queryByText("Protected Content");
    expect(protectedText).toBeTruthy();
  });

  it("redirects to /error if role is not allowed", () => {
    // User role not permitted for this route
    localStorage.setItem("user", JSON.stringify({ email: "student@tt.com", role: "student" }));

    render(
      <MemoryRouter initialEntries={["/apply"]}>
        <Routes>
          <Route
            path="/apply"
            element={
              <PrivateRoute allowedRoles={["tutor", "lecturer"]}>
                <Protected />
              </PrivateRoute>
            }
          />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>
    );
    // So we willl redirect unauthorized role to /error
    const errorText = screen.queryByText("Unauthorized Access");
    const protectedText = screen.queryByText("Protected Content");

    expect(errorText).toBeTruthy();
    expect(protectedText).toBeFalsy();
  });

  it("handles invalid localStorage user data gracefully", () => {
    // testing with incorrect garbage/malformed user data
    localStorage.setItem("user", "{notJson:");

    render(
      <MemoryRouter initialEntries={["/apply"]}>
        <Routes>
          <Route
            path="/apply"
            element={
              <PrivateRoute allowedRoles={["tutor"]}>
                <Protected />
              </PrivateRoute>
            }
          />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </MemoryRouter>
    );
    // should redirect to sign-in when JSON parse fails
    const signInText = screen.queryByText("Redirected to Sign In");
    const protectedText = screen.queryByText("Protected Content");

    expect(signInText).toBeTruthy();
    expect(protectedText).toBeFalsy();
  });

  it("renders /review protected content when user is lecturer", () => {
    // valid "lecturer" role accessing a protected review page
    localStorage.setItem("user", JSON.stringify({ email: "lecturer@tt.com", role: "lecturer" }));

    render(
      <MemoryRouter initialEntries={["/review"]}>
        <Routes>
          <Route
            path="/review"
            element={
              <PrivateRoute allowedRoles={["lecturer"]}>
                <Protected />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    // content is accessible for allowed lecturer role
    const protectedText = screen.queryByText("Protected Content");
    expect(protectedText).toBeTruthy();
  });

});
