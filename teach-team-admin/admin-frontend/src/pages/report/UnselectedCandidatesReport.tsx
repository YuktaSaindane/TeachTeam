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

interface CourseWithUnselectedCandidates {
  course: Course;
  unselectedCandidates: Candidate[];
}

// This page shows a report of candidates who have not been selected for each course.
// It fetches the list of unselected candidates from the backend and displays them grouped by course.
// The UI provides feedback while loading and if there are no unselected candidates for a course.
export default function UnselectedCandidatesReport() {
  // State for the report data and loading status
  const [report, setReport] = useState<CourseWithUnselectedCandidates[]>([]);
  const [loading, setLoading] = useState(true);
  const toastShown = useRef(false);

  // Fetch the report data when the component mounts
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.post("http://localhost:4001/graphql", {
          query: `
            query {
              getUnselectedCandidatesByCourse {
                course {
                  id
                  name
                  code
                  semester
                }
                unselectedCandidates {
                  id
                  name
                  email
                }
              }
            }
          `,
        });
        setReport(res.data.data.getUnselectedCandidatesByCourse);
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
            Unselected Candidates Report
          </h1>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
            <h2 className="text-lg font-semibold text-orange-800 mb-2">Talent Pool Analysis</h2>
            <p className="text-orange-700">
              View unselected candidates - potential talent pool for future opportunities.
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

                {entry.unselectedCandidates.length === 0 ? (
                  <p className="text-gray-500 italic">No unselected candidates for this course.</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Unselected Candidates:</p>
                    <div className="bg-gray-50 rounded p-3">
                      {entry.unselectedCandidates.map((cand) => (
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
