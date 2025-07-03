/*The TutorForm component allows users to submit tutor applications by filling out their name, email, course selection, role, previous roles, availability, skills, and academic credentials. It validates required fields and stores the submitted data in localStorage, 
displaying a success message after submission. 
*/

import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface CourseApplication {
  courseCode: string;
  role: 'tutorial' | 'lab';
  availability: string;
  skills: string[];
  credentials: string;
  previousRoles: string;
}

// List of available courses to choose from
const availableCourses = [
  { code: "COSC1111", name: "Python Development" },
  { code: "COSC2222", name: "Web Programming" },
  { code: "COSC3333", name: "Data Structures and Algorithms" },
  { code: "COSC4444", name: "Blockchain Development" },
  { code: "COSC5555", name: "Mobile Programming and development" },
  { code: "COSC6666", name: "Database and Backend development" },
];
// Predefined skill set options
const availableSkills = [
  "Programming",
  "Databases",
  "Web Development",
  "Mobile Development",
  "AI",
  "Algorithms",
  "Networking",
  "Security",
  "Cloud Computing",
  "Blockchain",
  "Web3"
];
// TutorForm component for tutor application submissions
const TutorForm: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    courseApplications: [] as CourseApplication[]
  });

  // Success message shown after form submission
  const [successMessage, setSuccessMessage] = useState("");

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseToggle = (courseCode: string) => {
    setFormData(prev => {
      const exists = prev.courseApplications.find(app => app.courseCode === courseCode);
      if (exists) {
        return {
          ...prev,
          courseApplications: prev.courseApplications.filter(app => app.courseCode !== courseCode)
        };
      } else {
        return {
          ...prev,
          courseApplications: [
            ...prev.courseApplications,
            {
              courseCode,
              role: 'tutorial',
              availability: '',
              skills: [],
              credentials: '',
              previousRoles: ''
            }
          ]
        };
      }
    });
  };

  const handleRoleToggle = (courseCode: string, role: 'tutorial' | 'lab') => {
    setFormData(prev => {
      const existingApp = prev.courseApplications.find(app => app.courseCode === courseCode);
      if (existingApp) {
        // If the same role is selected then remove the application
        if (existingApp.role === role) {
          return {
            ...prev,
            courseApplications: prev.courseApplications.filter(app => app.courseCode !== courseCode)
          };
        }
        // If different role is selected, update the role
        return {
          ...prev,
          courseApplications: prev.courseApplications.map(app =>
            app.courseCode === courseCode ? { ...app, role } : app
          )
        };
      } else {
        // Create new application with selected role
        return {
          ...prev,
          courseApplications: [
            ...prev.courseApplications,
            {
              courseCode,
              role,
              availability: '',
              skills: [],
              credentials: '',
              previousRoles: ''
            }
          ]
        };
      }
    });
  };

  const updateCourseApplication = (courseCode: string, field: keyof CourseApplication, value: any) => {
    setFormData(prev => ({
      ...prev,
      courseApplications: prev.courseApplications.map(app =>
        app.courseCode === courseCode ? { ...app, [field]: value } : app
      )
    }));
  };

  const handleSkillToggle = (courseCode: string, skill: string) => {
    setFormData(prev => ({
      ...prev,
      courseApplications: prev.courseApplications.map(app => {
        if (app.courseCode === courseCode) {
          const skills = app.skills.includes(skill)
            ? app.skills.filter(s => s !== skill)
            : [...app.skills, skill];
          return { ...app, skills };
        }
        return app;
      })
    }));
  };

  // form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate each application
    for (const app of formData.courseApplications) {
      if (!app.role) {
        toast.error(`Please select a role (Tutorial or Lab) for ${app.courseCode}`);
        return;
      }
      if (!app.availability || !app.skills.length || !app.credentials || !app.previousRoles) {
        toast.error(`Please fill in all required fields for ${app.courseCode}`);
        return;
      }
      if (app.credentials.trim().length < 10) {
        toast.error(`Academic credentials for ${app.courseCode} must be at least 10 characters`);
        return;
      }
      if (app.previousRoles.trim().length < 10) {
        toast.error(`Previous roles for ${app.courseCode} must be at least 10 characters`);
        return;
      }
    }

    try {
      const applications = formData.courseApplications.map(app => {
        const courseDetails = availableCourses.find(c => c.code === app.courseCode);
        return {
          name: formData.name,
          email: formData.email,
          course: app.courseCode,
          courseName: courseDetails?.name,
          role: app.role,
          previousRoles: app.previousRoles,
          availability: app.availability,
          skills: app.skills,
          credentials: app.credentials,
        };
      });

      // Get current user for authentication headers
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      const results = await Promise.allSettled(
        applications.map(application =>
          axios.post("http://localhost:3001/api/applications", application, {
            headers: {
              'user-role': currentUser.role,
              'user-id': currentUser.id?.toString(),
              'user-email': currentUser.email
            }
          })
        )
      );

      let anySuccess = false;
      results.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          anySuccess = true;
        } else {
          const message =
            result.reason?.response?.data?.message ||
            `Failed to submit application for ${applications[idx].courseName}`;
          toast.error(message);
        }
      });

      if (anySuccess) {
        toast.success("Applications submitted successfully!");
        setFormData({
          name: "",
          email: "",
          courseApplications: []
        });
      }
    } catch (err: any) {
      toast.error("Unexpected error submitting applications.");
      console.error("Error submitting applications:", err);
    }
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-indigo-900">Tutor Application Form</h2>
        <p className="text-indigo-700">Apply for multiple courses with specific details for each</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleBasicInfoChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleBasicInfoChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                required
                disabled
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Course Selection</h3>
          <div className="space-y-4">
            {availableCourses.map((course) => {
              const application = formData.courseApplications.find(
                app => app.courseCode === course.code
              );
              return (
                <div key={course.code} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={!!application}
                        onChange={() => handleCourseToggle(course.code)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div>
                        <h4 className="font-medium">{course.code} - {course.name}</h4>
                      </div>
                    </div>
                  </div>

                  {application && (
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role <span className="text-red-600">*</span>
                          </label>
                          <div className="space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={application.role === 'tutorial'}
                                onChange={() => handleRoleToggle(course.code, 'tutorial')}
                                className="mr-2"
                              />
                              Tutorial
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={application.role === 'lab'}
                                onChange={() => handleRoleToggle(course.code, 'lab')}
                                className="mr-2"
                              />
                              Lab
                            </label>
                          </div>
                          {!application.role && (
                            <p className="text-red-500 text-xs mt-1">Please select a role</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Availability <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={application.availability}
                            onChange={(e) => updateCourseApplication(course.code, 'availability', e.target.value)}
                            className={`w-full p-2 border rounded ${!application.availability ? 'border-red-300' : 'border-gray-300'}`}
                            required
                          >
                            <option value="">-- Select availability --</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                          </select>
                          {!application.availability && (
                            <p className="text-red-500 text-xs mt-1">Please select availability</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Skills <span className="text-red-600">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {availableSkills.map((skill) => (
                            <label key={skill} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={application.skills.includes(skill)}
                                onChange={() => handleSkillToggle(course.code, skill)}
                                className="mr-2"
                              />
                              <span className="text-sm">{skill}</span>
                            </label>
                          ))}
                        </div>
                        {application.skills.length === 0 && (
                          <p className="text-red-500 text-xs mt-1">Please select at least one skill</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Previous Roles <span className="text-red-600">*</span>
                          </label>
                          <textarea
                            value={application.previousRoles}
                            onChange={(e) => updateCourseApplication(course.code, 'previousRoles', e.target.value)}
                            placeholder="List your previous teaching or tutoring roles (minimum 10 characters)"
                            className={`w-full p-2 border rounded ${application.previousRoles.trim().length < 10 ? 'border-red-300' : 'border-gray-300'}`}
                            rows={3}
                            required
                          />
                          {application.previousRoles.trim().length < 10 && (
                            <p className="text-red-500 text-xs mt-1">Minimum 10 characters required</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Academic Credentials <span className="text-red-600">*</span>
                          </label>
                          <textarea
                            value={application.credentials}
                            onChange={(e) => updateCourseApplication(course.code, 'credentials', e.target.value)}
                            placeholder="List your degrees, certifications, or academic achievements (minimum 10 characters)"
                            className={`w-full p-2 border rounded ${application.credentials.trim().length < 10 ? 'border-red-300' : 'border-gray-300'}`}
                            rows={3}
                            required
                          />
                          {application.credentials.trim().length < 10 && (
                            <p className="text-red-500 text-xs mt-1">Minimum 10 characters required</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Applications
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorForm;
