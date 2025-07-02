// This page shows a report of candidates who have been selected for each course.
// It fetches the data from the backend and displays candidates grouped by course.
// The UI provides feedback while loading and if there are no candidates for a course.

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Candidate {
  id: number;
  name: string;
  email: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
  semester: string;
}

interface CourseWithCandidates {
  course: Course;
  candidates: Candidate[];
}

export default function ChosenCandidatesReport() {
  // State for the report data and loading status
  const [report, setReport] = useState<CourseWithCandidates[]>([]);
  const [loading, setLoading] = useState(true);
  const toastShown = useRef(false);

  // Fetch the report data when the component mounts
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.post("http://localhost:4001/graphql", {
          query: `
            query {
              getSelectedCandidatesByCourse {
                course {
                  id
                  name
                  code
                  semester
                }
                candidates {
                  id
                  name
                  email
                }
              }
            }
          `,
        });
        setReport(res.data.data.getSelectedCandidatesByCourse);
        if (!toastShown.current) {
          toast.success("Report loaded successfully");
          toastShown.current = true;
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        if (!toastShown.current) {
          toast.error("Failed to load report");
          toastShown.current = true;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Selected Candidates Report
          </h1>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Recruitment Overview</h2>
            <p className="text-blue-700">
              View candidates selected by lecturers for tutor positions, organized by course.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading report...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {report.map((entry) => (
              <div key={entry.course.id} className="bg-white rounded-lg shadow p-4">
                <div className="border-b pb-2 mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {entry.course.code} - {entry.course.name}
                  </h3>
                  <p className="text-gray-600">{entry.course.semester}</p>
                </div>

                {entry.candidates.length === 0 ? (
                  <p className="text-gray-500 italic">No candidates selected for this course.</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Candidates:</p>
                    <div className="bg-gray-50 rounded p-3">
                      {entry.candidates.map((cand) => (
                        <div key={cand.id} className="py-1 border-b last:border-b-0">
                          <p className="text-gray-800">{cand.name}</p>
                          <p className="text-sm text-gray-600">{cand.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
