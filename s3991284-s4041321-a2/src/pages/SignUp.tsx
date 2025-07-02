// Sign Up Page Component
// Handles new user registration with form validation
// Includes avatar selection and role-based registration
// Provides user feedback for form errors and successful registration

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AvatarSelector from "../components/AvatarSelector"

const SignUp: React.FC = () => {
  // Form state management with default values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    avatar_url: "/avatars/avatar17.jpg", 
  });

  // Error and loading state management
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation functions for email and password
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    if (!password || password.length < 8 || password.length > 128) {
      return false;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  // Password strength checking
  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8 && password.length <= 128,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    const passedChecks = Object.values(checks).filter(Boolean).length;
    return { checks, passedChecks, total: 5 };
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear password error when user starts typing
    if (e.target.name === "password" && passwordError) {
      setPasswordError("");
    }
    
    // Clear email error when user starts typing
    if (e.target.name === "email" && emailError) {
      setEmailError("");
    }
  };

  // Handle avatar selection
  const handleAvatarSelect = (url: string) => {
    setFormData({ ...formData, avatar_url: url });
  };

  // Handle form submission and registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    // Validate form inputs
    let isValid = true;

    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!validatePassword(formData.password)) {
      setPasswordError(
        "Password must be 8-128 characters long and include uppercase, lowercase, number, and special character (!@#$%^&* etc.)."
      );
      isValid = false;
    }

    if (!isValid) return;

    // attempting user registration
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/signup", formData);
      toast.success(res.data.message || "Registered!");
      navigate("/signin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            className="w-full mb-4 p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className={`w-full mb-2 p-2 border rounded ${
              emailError ? "border-red-500" : ""
            }`}
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          {emailError && <p className="text-red-600 text-sm mb-2">{emailError}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            className={`w-full mb-2 p-2 border rounded ${
              passwordError ? "border-red-500" : ""
            }`}
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mb-2">
              <div className="text-xs font-medium mb-1">Password Requirements:</div>
              {(() => {
                const strength = getPasswordStrength(formData.password);
                return (
                  <div className="space-y-1">
                    <div className={`text-xs flex items-center ${strength.checks.length ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{strength.checks.length ? '✓' : '✗'}</span>
                      8-128 characters
                    </div>
                    <div className={`text-xs flex items-center ${strength.checks.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{strength.checks.uppercase ? '✓' : '✗'}</span>
                      Uppercase letter (A-Z)
                    </div>
                    <div className={`text-xs flex items-center ${strength.checks.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{strength.checks.lowercase ? '✓' : '✗'}</span>
                      Lowercase letter (a-z)
                    </div>
                    <div className={`text-xs flex items-center ${strength.checks.number ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{strength.checks.number ? '✓' : '✗'}</span>
                      Number (0-9)
                    </div>
                    <div className={`text-xs flex items-center ${strength.checks.special ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{strength.checks.special ? '✓' : '✗'}</span>
                      Special character (!@#$%^&* etc.)
                    </div>
                    
                    {/* Strength Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          strength.passedChecks <= 2 ? 'bg-red-500' : 
                          strength.passedChecks <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(strength.passedChecks / strength.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">
                      Strength: {strength.passedChecks}/{strength.total} requirements met
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          
          {passwordError && <p className="text-red-600 text-sm mb-2">{passwordError}</p>}

          <select
            name="role"
            className="w-full mb-4 p-2 border rounded"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="candidate">Candidate</option>
            <option value="lecturer">Lecturer</option>
          </select>

          {/* Avatar Selector */}
          <AvatarSelector selected={formData.avatar_url} onSelect={handleAvatarSelect} />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
