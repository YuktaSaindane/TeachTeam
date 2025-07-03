//The lecturer review component allows a lecturer to review tutor applications,including searching,filtering,selecting,
// ranking,commenting on applicants.
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import StatsChartContainer from "../components/stats/ApplicantStatsContainer";
import SkillsDistributionContainer from "../components/stats/SkillsDistributionContainer";
import AvailabilityTrendsContainer from "../components/stats/AvailabilityTrendsContainer";
interface Application {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  course: {
    code: string;
    name: string;
  };
  session_type: 'tutorial' | 'lab';
  availability: string;
  skills: string;
  credentials: string;
  previous_roles: string;
  is_selected: boolean;
  rank?: number;
  comment?: string;
}

interface FilterState {
  name: string;
  sessionType: string;
  availability: string;
  skills: string;
  courseCode: string;
}

const LecturerReview: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    sessionType: "",
    availability: "",
    skills: "",
    courseCode: ""
  });
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState<number>(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch applications with filters
  const fetchApplications = async (filterParams: Partial<FilterState> = {}) => {
    try {
      setLoading(true);
      if (!currentUser.id) return;

      const params = new URLSearchParams();
      if (filterParams.name) params.append('name', filterParams.name);
      if (filterParams.sessionType) params.append('sessionType', filterParams.sessionType);
      if (filterParams.availability) params.append('availability', filterParams.availability);
      if (filterParams.skills) params.append('skills', filterParams.skills);

      const response = await axios.get(
        `http://localhost:3001/api/applications/lecturer/${currentUser.id}?${params.toString()}`,
        {
          headers: {
            'user-role': currentUser.role,
            'user-id': currentUser.id.toString(),
            'user-email': currentUser.email
          }
        }
      );
      
      let filteredApps = response.data;
      
      // Client-side filtering for course code (since it's already in the response)
      if (filterParams.courseCode) {
        filteredApps = filteredApps.filter(
          (app: Application) => app.course.code === filterParams.courseCode
        );
      }

      setApplications(filteredApps);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchApplications();
  }, [currentUser.id]);

  // Handle filter changes
  const handleFilterChange = (field: keyof FilterState, value: string) => {
  const newFilters = { ...filters, [field]: value };
  setFilters(newFilters);

  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  debounceRef.current = setTimeout(() => {
    fetchApplications(newFilters);
  }, 400); 
};

  // Handle selection/deselection of candidates
  const handleSelection = async (applicationId: number, isSelected: boolean) => {
    try {
      await axios.patch(`http://localhost:3001/api/applications/${applicationId}`, {
        is_selected: isSelected,
        lecturerId: currentUser.id
      }, {
        headers: {
          'user-role': currentUser.role,
          'user-id': currentUser.id.toString(),
          'user-email': currentUser.email
        }
      });
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, is_selected: isSelected } : app
      ));
      
      // Trigger stats refresh
      setStatsRefreshTrigger(prev => prev + 1);
      
      toast.success(isSelected ? "Candidate selected" : "Candidate deselected");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update selection");
    }
  };

  // Handle rank change with validation
  const handleRankChange = async (applicationId: number, rank: number) => {
    // Frontend validation for rank
    if (rank < 1 || rank > 100 || !Number.isInteger(rank)) {
      toast.error("Rank must be a positive integer between 1 and 100");
      return;
    }

    // Check for duplicate ranks in current lecturer's applications
    const existingRank = applications.find(app => 
      app.id !== applicationId && 
      app.rank === rank && 
      app.is_selected
    );
    
    if (existingRank) {
      toast.error(`Rank ${rank} is already assigned to ${existingRank.user.name}. Please choose a different rank.`);
      return;
    }

    try {
      await axios.patch(`http://localhost:3001/api/applications/${applicationId}`, {
        rank
      }, {
        headers: {
          'user-role': currentUser.role,
          'user-id': currentUser.id.toString(),
          'user-email': currentUser.email
        }
      });
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, rank } : app
      ));
      
      toast.success("Rank updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update rank");
    }
  };

  // Handle comment change with validation
  const handleCommentChange = async (applicationId: number, comment: string) => {
    // Frontend validation for comment length
    if (comment.length > 1000) {
      toast.error("Comment cannot exceed 1000 characters");
      return;
    }

    try {
      await axios.patch(`http://localhost:3001/api/applications/${applicationId}`, {
        comment
      }, {
        headers: {
          'user-role': currentUser.role,
          'user-id': currentUser.id.toString(),
          'user-email': currentUser.email
        }
      });
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, comment } : app
      ));
      
      toast.success("Comment updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update comment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Review Tutor Applications</h2>

      {/* Comprehensive Visual Analytics Dashboard */}
      <div className="mb-8 space-y-6">
        {/* Primary Selection Statistics */}
        <StatsChartContainer lecturerId={currentUser.id} refreshTrigger={statsRefreshTrigger} />
        
        {/* Enhanced Visual Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Distribution Analysis */}
          <SkillsDistributionContainer lecturerId={currentUser.id} refreshTrigger={statsRefreshTrigger} />
          
          {/* Availability Trends Analysis */}
          <AvailabilityTrendsContainer lecturerId={currentUser.id} refreshTrigger={statsRefreshTrigger} />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Candidate Name
            </label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              placeholder="Search by name..."
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Type
            </label>
            <select
              value={filters.sessionType}
              onChange={(e) => handleFilterChange('sessionType', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Sessions</option>
              <option value="tutorial">Tutorial</option>
              <option value="lab">Lab</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Availability</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <input
              type="text"
              value={filters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
              placeholder="Search by skills..."
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              value={filters.courseCode}
              onChange={(e) => handleFilterChange('courseCode', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Courses</option>
              {[...new Set(applications.map(a => a.course.code))].map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No applications found matching your criteria.</p>
        </div>
      ) : (
                <div className="grid gap-6">
          {applications.map((app) => (
              <div
                key={app.id}
                className="p-6 bg-white rounded-lg shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {app.user.name}
                    </h3>
                    <p className="text-gray-600">{app.user.email}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={app.is_selected}
                        onChange={() => handleSelection(app.id, !app.is_selected)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span>Select</span>
                    </label>
                  </div>
                </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="font-medium">Course:</p>
          <p>{app.course.code} - {app.course.name}</p>
        </div>
        <div>
          <p className="font-medium">Session Type:</p>
          <p>{app.session_type === 'lab' ? 'Lab Assistant' : 'Tutor'}</p>
        </div>
        <div>
          <p className="font-medium">Availability:</p>
          <p>{app.availability}</p>
        </div>
        <div>
          <p className="font-medium">Skills:</p>
          <p>{app.skills}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="font-medium">Academic Credentials:</p>
        <p className="whitespace-pre-wrap">{app.credentials}</p>
      </div>

      <div className="mb-4">
        <p className="font-medium">Previous Roles:</p>
        <p className="whitespace-pre-wrap">{app.previous_roles}</p>
      </div>

                      {app.is_selected && (
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rank (1 = highest preference)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                step={1}
                value={app.rank || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (e.target.value === "" || (value >= 1 && Number.isInteger(value))) {
                    handleRankChange(app.id, value);
                  }
                }}
                className="w-24 p-2 border rounded-md"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments ({(app.comment || "").length}/1000)
              </label>
              <textarea
                value={app.comment || ""}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    handleCommentChange(app.id, e.target.value);
                  }
                }}
                className="w-full p-2 border rounded-md"
                rows={3}
                maxLength={1000}
                placeholder="Add comments about this candidate..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  ))}
        </div>
      )}
    </div>
  );
};

export default LecturerReview;
