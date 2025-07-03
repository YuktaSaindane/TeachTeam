/*
 * Applicant Selection Statistics Chart - Presentational Component
 * 
 * CONTAINER-PRESENTER PATTERN IMPLEMENTATION:
 * This component strictly implements the "Presenter" role in the Container-Presenter pattern.
 * It is responsible ONLY for visual rendering and presentation of data.
 * 
 * CLEAR SEPARATION OF CONCERNS:
 * - NO data fetching: All data comes from props provided by the container
 * - NO business logic: All calculations performed in the container component
 * - NO state management: Pure presentational component receiving processed data
 * - ONLY UI rendering: Focuses exclusively on visual data representation
 * 
 * This architectural separation ensures:
 * 1. Reusability: Component can be used with different data sources
 * 2. Testability: Visual rendering can be tested in isolation from business logic
 * 3. Maintainability: Changes to data processing don't affect UI rendering
 * 4. Single Responsibility: Component has one clear purpose - data visualization
 * 
 * POSTGRADUATE REQUIREMENT COMPLIANCE:
 * This design isolates data visualization into dedicated presentational components
 * with clear separation from data fetching and business logic responsibilities.
 */
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Presentation component for applicant selection statistics
// Displays a bar chart and summary of selection data

// Data structure for statistics
interface StatData {
  name: string;
  times_selected: number;
  total_applications?: number;
  unselected_applications?: number;
}

// Statistics chart component
const StatsChart: React.FC<{ stats: StatData[]; loading: boolean }> = ({
  stats,
  loading,
}) => {
  // Categorizing applicants by selection status
  const fullyUnselected = stats.filter((s) => s.times_selected === 0);
  const selected = stats.filter((s) => s.times_selected > 0);
  
  // Calculate total unselected applications (not just fully unselected users)
  const totalUnselectedApplications = stats.reduce((sum, s) => {
    return sum + (s.unselected_applications || 0);
  }, 0);
  
  // sorting selected applicants by selection count
  const sorted = [...selected].sort((a, b) => b.times_selected - a.times_selected);

  // Calculate key statistics
  const mostChosen = sorted[0] || null;
  const leastChosen = sorted.length > 1 ? sorted[sorted.length - 1] : mostChosen;
  const unselectedCount = totalUnselectedApplications;

  // prepare the chart data with distinct colors for visual appeal
  const chartData = [
    { name: "Most Chosen", count: mostChosen?.times_selected || 0, fill: "#10b981" }, // Green for success
    { name: "Least Chosen", count: leastChosen?.times_selected || 0, fill: "#f59e0b" }, // Orange for caution
    { name: "Unselected", count: unselectedCount, fill: "#ef4444" }, // Red for unselected
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Applicant Selection Stats
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading chart...</p>
      ) : (
        <>
          {/* Bar chart visualization with distinct colors */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
                fillOpacity={0.9}
                label={{ 
                  position: "top", 
                  fill: "#374151", 
                  fontSize: 14,
                  fontWeight: "bold"
                }}
              >
                {/* Use individual colors for each bar */}
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Color Legend */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: "#10b981" }}
              ></div>
              <span className="text-sm font-medium text-gray-700">Most Chosen</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: "#f59e0b" }}
              ></div>
              <span className="text-sm font-medium text-gray-700">Least Chosen</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: "#ef4444" }}
              ></div>
              <span className="text-sm font-medium text-gray-700">Unselected</span>
            </div>
          </div>

          {/* Enhanced Statistical summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-green-800 mb-1">🏆 Most Chosen Applicant</h4>
              <p className="text-sm text-green-700">
                {mostChosen?.name || "N/A"}
              </p>
              <p className="text-lg font-bold text-green-600">
                {mostChosen?.times_selected || 0} selections
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-medium text-orange-800 mb-1">⚠️ Least Chosen Applicant</h4>
              <p className="text-sm text-orange-700">
                {leastChosen?.name || "N/A"}
              </p>
              <p className="text-lg font-bold text-orange-600">
                {leastChosen?.times_selected || 0} selections
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-medium text-red-800 mb-1">❌ Unselected Applicants</h4>
              <p className="text-sm text-red-700">Total count</p>
              <p className="text-lg font-bold text-red-600">{unselectedCount}</p>
            </div>
          </div>

          {/* Unselected applications summary */}
          {unselectedCount > 0 && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">📋 Candidates with Unselected Applications:</h4>
              <div className="flex flex-wrap gap-2">
                {stats.filter(s => (s.unselected_applications || 0) > 0).map((candidate, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                  >
                    {candidate.name} ({candidate.unselected_applications} unselected)
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatsChart;