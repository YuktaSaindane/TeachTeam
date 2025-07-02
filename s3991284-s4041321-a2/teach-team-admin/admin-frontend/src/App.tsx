import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import AssignLecturer from "./pages/AssignLecturer";
import ManageCourses from "./pages/ManageCourses";
import Candidates from "./pages/Candidates";
import SelectedCandidatesReport from "./pages/report/SelectedCandidatesReport";
import OverloadedCandidate from "./pages/report/OverloadedCandidatesReport";
import UnselectedCandidatesReport from "./pages/report/UnselectedCandidatesReport";

// This is the main entry point for the admin frontend React app.
// It sets up routing for all admin pages and wraps them with the layout and Apollo provider.
// The app uses React Router for navigation and Apollo Client for GraphQL data.
export default function App() {
  // Defines all the routes for the admin panel
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" />} />
      <Route path="/admin" element={<SignIn />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/assign" element={<Layout><AssignLecturer /></Layout>} />
      <Route path="/courses" element={<Layout><ManageCourses /></Layout>} />
      <Route path="/candidates" element={<Layout><Candidates /></Layout>} />
      <Route path="/report/selected" element={<Layout><SelectedCandidatesReport /></Layout>} />
      <Route path="/report/overload" element={<Layout><OverloadedCandidate /></Layout>} />
      <Route path="/report/unselected" element={<Layout><UnselectedCandidatesReport /></Layout>} />
    </Routes>
  );
}
