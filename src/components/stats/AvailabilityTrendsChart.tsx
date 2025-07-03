/*
 * Availability Trends Chart - Presentational Component
 * 
 * This component implements the "Presenter" part of the Container-Presenter pattern.
 * It is responsible ONLY for the visual rendering of availability trends data.
 * 
 * SEPARATION OF CONCERNS:
 * - This component receives processed availability data as props
 * - It does NOT fetch data, perform calculations, or manage application state
 * - It focuses purely on UI rendering and visual data representation
 * - Business logic and data processing are handled by the container component
 * 
 * This architectural approach ensures:
 * 1. Reusability: Can be used with different data sources or contexts
 * 2. Testability: Visual rendering can be tested in isolation
 * 3. Maintainability: Changes to data logic don't affect visual presentation
 * 4. Single Responsibility: Component has one clear purpose - data visualization
 */

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Interface for availability data structure
interface AvailabilityData {
  availability: string;
  total: number;
  selected: number;
  unselected: number;
  selectionRate: number;
}

// Props interface for the presentational component
interface AvailabilityTrendsChartProps {
  availabilityData: AvailabilityData[];
  loading: boolean;
  totalApplications: number;
}

/**
 * Presentational component for displaying availability trends
 * Uses bar chart to show distribution of full-time vs part-time applicants
 * and their selection rates - purely handles visual presentation
 */
const AvailabilityTrendsChart: React.FC<AvailabilityTrendsChartProps> = ({
  availabilityData,
  loading,
  totalApplications
}) => {
  // Color scheme for different availability types
  const COLORS = {
    'Full Time': '#4ade80',
    'Part Time': '#f59e0b',
    default: '#6b7280'
  };

  // Custom tooltip for better data presentation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">Total Applications: {data.total}</p>
          <p className="text-sm text-green-600">Selected: {data.selected}</p>
          <p className="text-sm text-red-600">Unselected: {data.unselected}</p>
          <p className="text-sm text-blue-600">Selection Rate: {data.selectionRate.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        Availability Trends & Selection Rates
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading availability trends...</p>
        </div>
      ) : availabilityData.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No availability data available</p>
        </div>
      ) : (
        <>
          {/* Bar chart visualization */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={availabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="availability" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" fill="#e5e7eb" name="Total Applications" />
              <Bar dataKey="selected" fill="#10b981" name="Selected" />
              <Bar dataKey="unselected" fill="#ef4444" name="Unselected" />
            </BarChart>
          </ResponsiveContainer>

          {/* Summary statistics grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {availabilityData.map((data, index) => (
              <div 
                key={data.availability}
                className="bg-gray-50 p-4 rounded-lg border"
              >
                <h4 className="font-medium text-gray-800 mb-2">{data.availability}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{data.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Selected:</span>
                    <span className="font-medium text-green-600">{data.selected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Unselected:</span>
                    <span className="font-medium text-red-600">{data.unselected}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-blue-600">Success Rate:</span>
                    <span className="font-bold text-blue-600">{data.selectionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key insights section */}
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Key Insights:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              {availabilityData.length > 0 && (
                <>
                  <p>
                    • Most popular availability: {availabilityData.reduce((max, item) => 
                      item.total > max.total ? item : max
                    ).availability} ({availabilityData.reduce((max, item) => 
                      item.total > max.total ? item : max
                    ).total} applications)
                  </p>
                  <p>
                    • Highest selection rate: {availabilityData.reduce((max, item) => 
                      item.selectionRate > max.selectionRate ? item : max
                    ).availability} ({availabilityData.reduce((max, item) => 
                      item.selectionRate > max.selectionRate ? item : max
                    ).selectionRate.toFixed(1)}% success rate)
                  </p>
                  <p>
                    • Total applications processed: {totalApplications}
                  </p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AvailabilityTrendsChart; 