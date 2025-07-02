// Navigation Component
// Provides the main navigation bar for the application
// Handles user authentication state and role-based navigation
// Includes responsive design for mobile and desktop views

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const Navbar: React.FC = () => {
  // State management for mobile menu and user authentication
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Check user authentication status on component mount and route changes
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setIsLoggedIn(!!storedUser);
    setUserRole(storedUser?.role || null);
  }, [location.pathname]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  // Helper function to determine active navigation link
  const isActive = (path: string) =>
    location.pathname === path ? "font-bold text-gray-900" : "text-gray-600 hover:text-gray-900";

  return (
    <nav className="bg-indigo-900 text-white sticky top-0 z-50">
      <div className="w-full px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-3xl font-bold tracking-tight text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-indigo-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
            <path d="M11 12.86L3.26 9.26 2 10l9 4.09 9-4.09-1.26-.74L13 12.86v5.61l-2 .53v-6.14z" />
          </svg>
          <span>TT Web System</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className={location.pathname === "/" ? "text-indigo-200 font-bold" : "text-indigo-100 hover:text-white"}>
            Home
          </Link>

          {isLoggedIn && userRole === "candidate" && (
            <>
              <Link to="/apply" className={location.pathname === "/apply" ? "text-indigo-200 font-bold" : "text-indigo-100 hover:text-white"}>
                Tutor Dashboard
              </Link>
              <Link to="/my-applications" className={location.pathname === "/my-applications" ? "text-indigo-200 font-bold" : "text-indigo-100 hover:text-white"}>
                My Applications
              </Link>
            </>
          )}

          {isLoggedIn && userRole === "lecturer" && (
            <Link to="/review" className={location.pathname === "/review" ? "text-indigo-200 font-bold" : "text-indigo-100 hover:text-white"}>
              Lecturer Dashboard
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="text-indigo-100 hover:text-white transition">
                Sign Up
              </Link>
              <Link to="/signin" className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 transition">
                Sign In
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                aria-label="Profile"
                className="p-2 rounded-full hover:bg-indigo-800 transition"
              >
                <User className="h-5 w-5 text-indigo-100" />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4 text-sm text-indigo-100 bg-indigo-800 p-4">
          <Link to="/" className={location.pathname === "/" ? "text-white font-bold" : "hover:text-white"} onClick={() => setIsOpen(false)}>
            Home
          </Link>

          {isLoggedIn && userRole === "candidate" && (
            <Link to="/apply" className={location.pathname === "/apply" ? "text-white font-bold" : "hover:text-white"} onClick={() => setIsOpen(false)}>
              Tutor Dashboard
            </Link>
          )}

          {isLoggedIn && userRole === "lecturer" && (
            <Link to="/review" className={location.pathname === "/review" ? "text-white font-bold" : "hover:text-white"} onClick={() => setIsOpen(false)}>
              Lecturer Dashboard
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="hover:text-white">
                Sign Up
              </Link>
              <Link to="/signin" onClick={() => setIsOpen(false)} className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700">
                Sign In
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 hover:text-white"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-100 transition"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
