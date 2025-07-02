import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_LECTURERS, GET_ALL_COURSES } from "../graphql/queries";
import { ASSIGN_LECTURER_MUTATION } from "../graphql/mutations";
import { toast } from "sonner";

// This page allows admins to assign lecturers to courses.
// It fetches all lecturers and courses, and lets the admin link a lecturer to a course.
// The UI provides feedback for each action and resets the form after assignment.
export default function AssignLecturer() {
  // State for selected lecturer and course
  const [lecturerId, setLecturerId] = useState("");
  const [courseId, setCourseId] = useState("");
  // Fetch all lecturers and courses
  const { data: lecturersData } = useQuery(GET_ALL_LECTURERS);
  const { data: coursesData } = useQuery(GET_ALL_COURSES);
  // Mutation to assign a lecturer to a course
  const [assignLecturer] = useMutation(ASSIGN_LECTURER_MUTATION);

  // Reset the form fields
  const resetForm = () => {
    setLecturerId("");
    setCourseId("");
  };

  // Handle the assignment of a lecturer to a course
  const handleAssign = async () => {
    if (!lecturerId || !courseId) {
      toast.error("Please select both lecturer and course");
      return;
    }
    try {
      await assignLecturer({
        variables: {
          lecturerId: parseInt(lecturerId),
          courseId: parseInt(courseId),
        },
      });
      toast.success("Lecturer assigned successfully");
      resetForm();
    } catch (err: any) {
      toast.error("Failed to assign lecturer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Lecturer Assignment Management
          </h1>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
            <h2 className="text-lg font-semibold text-purple-800 mb-2">Course Assignment Control</h2>
            <p className="text-purple-700">
              Assign lecturers to courses - only assigned lecturers can review applications for their courses.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Lecturer
              </label>
              <select
                value={lecturerId}
                onChange={(e) => setLecturerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Choose Lecturer</option>
                {lecturersData?.getAllLecturers.map((lec: any) => (
                  <option key={lec.id} value={lec.id}>
                    {lec.name} ({lec.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Choose Course</option>
                {coursesData?.getAllCourses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssign}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Assign Lecturer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
