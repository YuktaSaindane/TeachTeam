import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CANDIDATES } from "../graphql/queries";
import { TOGGLE_BLOCK_CANDIDATE } from "../graphql/mutations";
import { toast } from "sonner";

// This page lets admins block or unblock candidates (students) in the system.
// It fetches all candidates and allows toggling their active/blocked status.
// The UI provides feedback for each action and updates the list after changes.
export default function Candidates() {
  // Fetch all candidates and set up the mutation for toggling block status
  const { data, refetch } = useQuery(GET_ALL_CANDIDATES);
  const [toggleBlock] = useMutation(TOGGLE_BLOCK_CANDIDATE);

  // Handle block or unblock action for a candidate
  const handleToggle = async (id: number, name: string, isBlocked: boolean) => {
    try {
      await toggleBlock({ variables: { userId: id } });
      toast.success(`Candidate ${name} ${isBlocked ? "unblocked" : "blocked"} successfully`);
      refetch();
    } catch (err: any) {
      toast.error("Failed to update candidate status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Candidate Access Management
          </h1>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Access Control</h2>
            <p className="text-yellow-700">
              Block or unblock candidate access to the platform - blocked users cannot log in or apply.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {data?.getAllCandidates?.map((candidate: any) => (
            <div
              key={candidate.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{candidate.email}</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm mt-2 ${
                    candidate.is_blocked 
                      ? "bg-red-100 text-red-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {candidate.is_blocked ? "Blocked" : "Active"}
                  </span>
                </div>
                <button
                  onClick={() => handleToggle(candidate.id, candidate.name, candidate.is_blocked)}
                  className={`px-4 py-2 rounded-md text-white font-medium hover:opacity-90 ${
                    candidate.is_blocked ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {candidate.is_blocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
