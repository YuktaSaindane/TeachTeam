//The MyApplications module allows displaying tutor applications submitted. 
// It retrieves the current user's information from localStorage, filters the list of tutor applications to show only the applications submitted by the current user, and lists the details such as course, availability, skills, credentials, and previous positions. If the user has not submitted any applications, a message is displayed. If the user is not logged in, 
// they are asked to log in to view their applications.

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Application {
  id: number;
  course: {
    code: string;
    name: string;
  };
  availability: string;
  skills: string;
  credentials: string;
  previous_roles: string;
  session_type: 'tutorial' | 'lab';
  created_at: string;
}

// this component will help to display the current user's submitted tutor applications
const MyApplications: React.FC = () => {
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  //to get thecurrent logged in user
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchApplications = async () => {
    try {
      if (!currentUser.id) return;
      const response = await axios.get(`http://localhost:3001/api/applications/user/${currentUser.id}`);
      setMyApps(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [currentUser.id]);

  const handleWithdraw = async (applicationId: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/applications/${applicationId}`);
      toast.success("Application withdrawn successfully");
      fetchApplications(); // Refresh the list
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to withdraw application");
    }
  };

  const formatSkills = (skills: string | string[]) => {
    if (Array.isArray(skills)) {
      return skills;
    } else if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) return parsed;
        return skills.split(", ");
      } catch {
        return skills.split(", ");
      }
    }
    return [];
  };

  if (!currentUser.email) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-600">Please sign in to view your applications.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-indigo-900">My Applications</h2>
        <p className="text-indigo-700">View and manage your submitted applications</p>
      </div>

      {myApps.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-gray-400"
            >
              <path d="M14 4h6v6h-6z" />
              <path d="M4 14h6v6H4z" />
              <path d="M17 17h3v3h-3z" />
              <path d="M4 4h6v6H4z" />
            </svg>
          </div>
          <p className="text-gray-600">You haven't submitted any applications yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myApps.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 overflow-hidden">
              <div className="bg-gray-50 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {app.course.code} - {app.course.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {app.session_type === 'lab' ? 'Lab Assistant' : 'Tutor'}
                      </span>
                      <span className="text-sm text-gray-600">
                        Applied {new Date(app.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {app.availability}
                    </span>
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {formatSkills(app.skills).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Previous Roles</h4>
                  <p className="text-sm text-gray-700">{app.previous_roles || "None"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Academic Credentials</h4>
                  <p className="text-sm text-gray-700">{app.credentials}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
