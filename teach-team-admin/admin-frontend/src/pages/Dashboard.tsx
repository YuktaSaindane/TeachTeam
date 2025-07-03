
// This file displays the main dashboard for the admin panel.
// It provides quick navigation to all major admin features like assigning lecturers, managing courses, and viewing reports.
// Each card on the dashboard links to a different admin function for easy access.

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  // Used to navigate to different pages when a card is clicked
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="mb-8">
        <h1 className="dashboard-title">TeachTeam Admin Dashboard</h1>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4 rounded-r-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">System Overview</h2>
          <p className="text-blue-700">
            Manage course assignments, monitor candidate selections, and oversee the tutor recruitment process.
          </p>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/assign")}>
          <h2>Assign Lecturer</h2>
          <p>Assign lecturers to courses for the semester</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/courses")}>
          <h2>Manage Courses</h2>
          <p>Add, edit, or delete course offerings</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/candidates")}>
          <h2>Block/Unblock Candidates</h2>
          <p>Control access for student accounts</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/report/selected")}>
          <h2>Selected Candidates</h2>
          <p>See who's been selected for each course</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/report/overload")}>
          <h2>Overloaded Candidates</h2>
          <p>Candidates chosen for more than 3 courses</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/report/unselected")}>
          <h2>Unselected Candidates</h2>
          <p>List of candidates not selected for any course</p>
        </div>
      </div>
    </div>
  );
}
