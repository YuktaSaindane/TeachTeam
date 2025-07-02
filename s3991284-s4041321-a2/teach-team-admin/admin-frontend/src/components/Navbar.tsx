import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

// This component renders the navigation bar for the admin panel.
// It provides navigation links, a reports dropdown, and handles sign out.

export default function Navbar() {
  // Used for navigation and to get the current route
  const navigate = useNavigate();
  const location = useLocation();
  // State for showing or hiding the reports dropdown
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  const reportsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showReportsDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        reportsDropdownRef.current &&
        !reportsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowReportsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReportsDropdown]);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠", description: "System overview and quick access" },
    { name: "Assign Lecturer", path: "/assign", icon: "👨‍🏫", description: "Link lecturers to courses" },
    { name: "Manage Courses", path: "/courses", icon: "📚", description: "Add, edit, delete courses" },
    { name: "Candidates", path: "/candidates", icon: "👥", description: "Block/unblock student access" },
  ];

  const reportItems = [
    { name: "Selected Candidates", path: "/report/selected", description: "View successful selections by course" },
    { name: "Overloaded Candidates", path: "/report/overload", description: "⚠️ Students with 3+ course assignments" },
    { name: "Unselected Candidates", path: "/report/unselected", description: "Talent pool for future opportunities" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isReportsActive = () => {
    return location.pathname.startsWith("/report");
  };

  const handleSignOut = () => {
    navigate("/admin");
  };


  if (location.pathname === "/admin" || location.pathname === "/") {
    return null;
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold flex items-center space-x-2">
              <span>🎓</span>
              <span>TeachTeam Admin</span>
            </div>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
              
              {/* Reports Dropdown */}
              <div className="relative" ref={reportsDropdownRef}>
                <button
                  onClick={() => setShowReportsDropdown(!showReportsDropdown)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isReportsActive()
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  <span>📊</span>
                  <span>Reports</span>
                  <span className="text-xs">▼</span>
                </button>
                
                {showReportsDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg py-1 z-50 min-w-48">
                    {reportItems.map((report) => (
                      <button
                        key={report.path}
                        onClick={() => {
                          navigate(report.path);
                          setShowReportsDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          isActive(report.path)
                            ? "bg-blue-100 text-blue-800"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {report.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                  isActive(item.path)
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-500"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
            {reportItems.map((report) => (
              <button
                key={report.path}
                onClick={() => navigate(report.path)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                  isActive(report.path)
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-500"
                }`}
              >
                <span>📊</span>
                <span>{report.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 