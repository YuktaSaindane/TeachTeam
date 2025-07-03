
import { useQuery, useMutation } from "@apollo/client";
import { GET_COURSES } from "../graphql/queries";
import { ADD_COURSE, EDIT_COURSE, DELETE_COURSE } from "../graphql/mutations";
import { useState } from "react";
import { toast } from "sonner";

// This page allows admins to view, add, edit, and delete courses.
// It handles form input, validation, and communicates with the backend using GraphQL.
// The UI provides feedback for each action and lists all current courses.
export default function ManageCourses() {
  // Fetch all courses and set up mutations for add, edit, and delete
  const { data, refetch } = useQuery(GET_COURSES);
  const [addCourse] = useMutation(ADD_COURSE);
  const [editCourse] = useMutation(EDIT_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE);

  // State for the course form and edit mode
  const [form, setForm] = useState({ name: "", code: "", semester: "" });
  const [editId, setEditId] = useState<number | null>(null);

  // Reset the form and exit edit mode
  const resetForm = () => {
    setForm({ name: "", code: "", semester: "" });
    setEditId(null);
  };

  // Check if the semester input matches the required format
  const validateSemester = (semester: string) => {
    return /^\d{4}-[1-2]$/.test(semester);
  };

  // Check if the course code matches the required format
  const validateCourseCode = (code: string) => {
    return /^COSC\d{4}$/.test(code);
  };

  // Check for duplicate course names (ignoring case and current edit)
  const isDuplicateName = (name: string, currentId: number | null) => {
    return data?.getAllCourses?.some(
      (course: any) => 
        course.name.toLowerCase() === name.toLowerCase() && 
        course.id !== currentId
    );
  };

  // Handle form submission for adding or editing a course
  const handleSubmit = async () => {
    try {
      // Validate all fields before submitting
      if (!form.name || !form.code || !form.semester) {
        toast.error("Please fill in all fields");
        return;
      }

      if (!validateCourseCode(form.code)) {
        toast.error("Course code must be in format COSCxxxx (e.g., COSC2222)");
        return;
      }

      if (!validateSemester(form.semester)) {
        toast.error("Semester must be in format YYYY-S (e.g., 2024-1)");
        return;
      }

      if (isDuplicateName(form.name, editId)) {
        toast.error(`A course with name "${form.name}" already exists`);
        return;
      }

      // If editing, update the course; otherwise, add a new one
      if (editId) {
        await editCourse({ variables: { id: editId, ...form } });
        toast.success("Course updated successfully");
      } else {
        await addCourse({ variables: form });
        toast.success("Course added successfully");
      }
      resetForm();
      refetch();
    } catch (err: any) {
      if (err.message?.includes("Duplicate entry")) {
        toast.error(`A course with code "${form.code}" already exists`);
      } else {
        toast.error("Failed to save course");
      }
    }
  };

  // Populate the form for editing a course
  const handleEdit = (course: any) => {
    setForm({ name: course.name, code: course.code, semester: course.semester });
    setEditId(course.id);
    toast.info(`Editing course: ${course.name}`);
  };

  // Delete a course by its ID
  const handleDelete = async (id: number, courseName: string) => {
    try {
      await deleteCourse({ variables: { id } });
      toast.success(`Course "${courseName}" deleted successfully`);
      refetch();
    } catch (err: any) {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Course Management System
          </h1>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Course Administration</h2>
            <p className="text-green-700">
              Add, edit, or remove courses - use COSCxxxx format for codes and YYYY-S for semesters.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
              </label>
              <input
                type="text"
                placeholder="Enter course name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value.trim() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code
              </label>
              <input
                type="text"
                placeholder="e.g. COSC2222"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.trim() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">Format: COSCxxxx</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <input
                type="text"
                placeholder="e.g. 2024-1"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value.trim() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">Format: YYYY-S</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editId ? "Update Course" : "Add Course"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {data?.getAllCourses?.map((course: any) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.code}
                  </h3>
                  <p className="text-gray-600">
                    {course.name} ({course.semester})
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id, course.name)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
