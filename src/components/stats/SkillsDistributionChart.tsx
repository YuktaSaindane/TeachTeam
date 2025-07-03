/*
 * Skills Distribution Chart - Presentational Component
 * 
 * This component implements the "Presenter" part of the Container-Presenter pattern.
 * It is responsible ONLY for the visual rendering of skills distribution data.
 * 
 * SEPARATION OF CONCERNS:
 * - This component receives processed data as props
 * - It does NOT fetch data, perform calculations, or manage state
 * - It focuses purely on UI rendering and visual presentation
 * - Business logic and data fetching are handled by the container component
 * 
 * This design ensures:
 * 1. Reusability: Can be used with different data sources
 * 2. Testability: Easy to test visual rendering in isolation
 * 3. Maintainability: Changes to data logic don't affect UI rendering
 * 4. Clear responsibilities: UI concerns separated from business logic
 */

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Interface for skills data structure
interface SkillData {
  skill: string;
  count: number;
  percentage: number;
}

// Props interface for the presentational component
interface SkillsDistributionChartProps {
  skillsData: SkillData[];
  loading: boolean;
  totalApplicants: number;
}

/**
 * Presentational component for displaying skills distribution
 * Uses pie chart visualization to show skill popularity among applicants
 * Follows separation of concerns principle - only handles visual presentation
 */
const SkillsDistributionChart: React.FC<SkillsDistributionChartProps> = ({
  skillsData,
  loading,
  totalApplicants
}) => {
  // Color palette for different skills
  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', 
    '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'
  ];

  // Custom tooltip component for better data presentation
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{data.skill}</p>
          <p className="text-sm text-gray-600">
            {data.count} applicants ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        Skills Distribution Among Applicants
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading skills distribution...</p>
        </div>
      ) : skillsData.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No skills data available</p>
        </div>
      ) : (
        <>
          {/* Pie chart visualization */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ skill, percentage }) => `${skill}: ${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {skillsData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Summary statistics */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-medium text-blue-800">Total Applicants</p>
              <p className="text-2xl font-bold text-blue-600">{totalApplicants}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="font-medium text-green-800">Unique Skills</p>
              <p className="text-2xl font-bold text-green-600">{skillsData.length}</p>
            </div>
          </div>

          {/* Top skills list */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Most Popular Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {skillsData.slice(0, 5).map((skill, index) => (
                <span
                  key={skill.skill}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
                  style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}
                >
                  {skill.skill} ({skill.count})
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SkillsDistributionChart; 