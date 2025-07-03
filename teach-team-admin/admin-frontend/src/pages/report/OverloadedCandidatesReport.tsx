import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Candidate {
  id: number;
  name: string;
  email: string;
  totalCourses: number;
}

// This page shows a report of candidates who are assigned to more than three courses.
// It fetches the overloaded candidates from the backend and displays their details.
// The UI provides feedback while loading and if there are no overloaded candidates.
export default function OverloadedCandidatesReport() {
  // States for the report data, loading status
  const [report, setReport] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toastShown = useRef(false);

  // fetching the report data when the component mounts
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.post("http://localhost:4001/graphql", {
          query: `
            query {
              getOverloadedCandidates {
                id
                name
                email
                totalCourses
              }
            }
          `,
        });
        const candidates = res.data.data.getOverloadedCandidates;
        setReport(candidates);
        if (!toastShown.current) {
          if (Array.isArray(candidates) && candidates.length > 0) {
            toast.success("Report loaded successfully");
          }
          toastShown.current = true;
        }
        setError("");
      } catch (err) {
        setError("Failed to load report. Please try again later.");
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
            Overloaded Candidates Report
          </h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h2 className="text-lg font-semibold text-red-800 mb-2">⚠️ Workload Alert System</h2>
            <p className="text-red-700">
              <strong>Critical:</strong> Candidates selected for MORE THAN 3 COURSES - review workload concerns.
            </p>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading report...</p>
          </div>
        ) : (
          <>
            {/* Statistics Summary */}
            {report.length > 0 && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-700">{report.length}</div>
                  <div className="text-sm text-red-600">Overloaded Candidates</div>
                </div>
                <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-700">
                    {Math.max(...report.map(c => c.totalCourses))}
                  </div>
                  <div className="text-sm text-orange-600">Maximum Courses Assigned</div>
                </div>
                <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-700">
                    {(report.reduce((sum, c) => sum + c.totalCourses, 0) / report.length).toFixed(1)}
                  </div>
                  <div className="text-sm text-yellow-600">Average Courses per Candidate</div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {report.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-green-600 text-6xl mb-4">✅</div>
                  <p className="text-gray-500 italic text-lg">Great! No overloaded candidates found.</p>
                  <p className="text-sm text-gray-400 mt-2">All candidates are assigned to 3 or fewer courses.</p>
                </div>
              ) : (
              <div className="divide-y divide-gray-200">
                {report.map((candidate) => (
                  <div key={candidate.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {candidate.totalCourses} Courses
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  );
}


