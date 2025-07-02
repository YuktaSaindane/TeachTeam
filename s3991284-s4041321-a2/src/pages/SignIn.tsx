// Sign In Page Component
// Handles user authentication and login functionality
// Includes form validation, reCAPTCHA verification, and role-based redirection
// Provides user feedback for form errors and successful login

import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const SignIn = () => {
  // Form state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);

  // Error state management
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Validation functions for email and password
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber;
  };

  // Handle form submission and authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");

    // Validate form inputs
    let isValid = true;
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must include 8+ chars, uppercase, lowercase & number.");
      isValid = false;
    }
    if (!captchaValid) {
      setErrorMessage("Please verify you're not a robot.");
      isValid = false;
    }
    if (!isValid) return;

    try {
      // attempt user authentication
      const res = await fetch("http://localhost:3001/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
          setErrorMessage(data.message || "Login failed");
          return;
        }

      // storing user data and handle successful login
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(`Welcome ${data.user.name}!`);

      // Redirect based on user role
      const userRole = data.user.role;
      if (userRole === "candidate") {
        navigate("/apply");
      }
      else if (userRole === "lecturer") {
        navigate("/review");
      }
      else if (userRole === "admin") {
        navigate("/admin"); 
      }
      else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // handling reCAPTCHA verification
  const onCaptchaChange = (val: string | null) => {
    if (val) setCaptchaValid(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        {errorMessage && (
          <div className="mb-4 p-3 text-red-800 bg-red-100 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                emailError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              autoComplete="email"
            />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                passwordError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              autoComplete="current-password"
            />
            {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
          </div>

          <div className="mb-6">
            <ReCAPTCHA
              sitekey="6LfYZgArAAAAAH5LiPS4bnMxBYjBW8Gf6RruQ-GX"
              onChange={onCaptchaChange}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
