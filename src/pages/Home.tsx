//The home component serves as the main landing page for users,providing role-based navigation options for tutor applicants and lecturers with a simple and informative layout on how the system works

import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { toast } from "sonner";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");


  //handling navigation with role-based access control
  const handleRedirect = (path: string, requiredRole: string) => {
    if (!currentUser.email) {
      navigate("/signin");
      return;
    }

    // If user is already logged in with the correct role, redirect them directly
    if (requiredRole === "tutor" && currentUser.role === "candidate") {
      navigate("/apply");
      return;
    }

    if (requiredRole === "lecturer" && currentUser.role === "lecturer") {
      navigate("/review");
      return;
    }

    // Show toast notification if user is logged in with wrong role
    toast.error(
      `Access restricted to ${requiredRole} accounts only`,
      {
        duration: 3000,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to TeachTeam</h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Streamlining the process of selecting and hiring casual tutors for the School of Computer Science.
          </p>
        </div>
      </section>

     
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tutor Applicant Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 hover:border-indigo-300 transition">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-900">For Tutor Applicants</h2>
              <p className="text-indigo-600 mb-6">Apply for tutoring positions and showcase your skills</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Submit your academic credentials and teaching experience
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Apply for multiple courses based on your expertise
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Specify your availability and preferences
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Track your application status
                </li>
              </ul>
              <button
                onClick={() => handleRedirect("/apply", "tutor")}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Apply as a Tutor
              </button>
            </div>
          </div>

          {/* Lecturer Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 hover:border-indigo-300 transition">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-900">For Lecturers</h2>
              <p className="text-indigo-600 mb-6">Find and select the best tutors for your courses</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Browse qualified applicants for your courses
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Review detailed profiles and academic backgrounds
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Select and rank candidates based on your requirements
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Leave comments and feedback on applications
                </li>
              </ul>
              <button
                onClick={() => handleRedirect("/review", "lecturer")}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Sign in as a Lecturer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-indigo-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Apply",
                desc:
                  "Tutors submit their qualifications, experience, and course preferences through our easy-to-use application form.",
              },
              {
                step: "2",
                title: "Review",
                desc:
                  "Lecturers review applications, examining credentials and experience to find the best fit for their courses.",
              },
              {
                step: "3",
                title: "Select",
                desc:
                  "Lecturers select and rank candidates, providing comments to support the hiring process.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="bg-white rounded-xl p-8 shadow-md border border-indigo-100 relative"
              >
                <div className="absolute -top-4 left-8 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                  {step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-indigo-900 mt-4">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
