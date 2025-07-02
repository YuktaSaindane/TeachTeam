// Main App component for TeachTeam
// Sets up the app's routing and layout
// Handles protected routes for different user roles
// Includes navigation, main content area, and footer

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn"; 
import Dashboard from "./pages/Dashboard"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TutorForm from "./pages/TutorForm";
import LecturerReview from "./pages/LecturerReview";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/privateRoutes"; 
import MyApplications from "./pages/MyApplications";
import { Toaster } from "sonner"; 
import Profile from "./pages/Profile";

const App: React.FC = () => {
  return (
    
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Allow both candidate and lecturer roles to access profile */}
            <Route
              path="/profile"
              element={
                <PrivateRoute allowedRoles={['candidate', 'lecturer']}>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/apply"
              element={
                <PrivateRoute allowedRoles={['candidate']}>
                  <TutorForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/review"
              element={
                <PrivateRoute allowedRoles={['lecturer']}>
                  <LecturerReview />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <PrivateRoute allowedRoles={['candidate']}>
                  <MyApplications />
                </PrivateRoute>
              }
            />

          </Routes>
        </main>
        <Footer />
        {/*Sonner Toaster */}
        <Toaster richColors position="top-center" />
      </div>
    </Router>
  );
};

export default App;
