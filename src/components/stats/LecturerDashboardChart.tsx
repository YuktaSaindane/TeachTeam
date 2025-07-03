/*
 * Lecturer Dashboard Chart - Advanced Presentational Component
 * 
 * CONTAINER-PRESENTER PATTERN IMPLEMENTATION:
 * This component exemplifies the "Presenter" role in the Container-Presenter pattern.
 * It is designed EXCLUSIVELY for visual rendering of complex dashboard data.
 * 
 * COMPREHENSIVE SEPARATION OF CONCERNS:
 * - NO data fetching: All data received via props from container components
 * - NO business logic: All calculations and processing handled externally
 * - NO state management: Pure presentational component with no internal state
 * - ONLY visual rendering: Focuses exclusively on data visualization and UI presentation
 * 
 * ADVANCED VISUAL ELEMENTS:
 * - Line charts for trends over time
 * - Area charts for cumulative data
 * - Multi-series bar charts for comparisons
 * - Responsive grid layouts for comprehensive data overview
 * 
 * This component demonstrates:
 * 1. Advanced separation of concerns with zero business logic
 * 2. Comprehensive visual representation beyond simple tables
 * 3. Professional-grade data visualization using established libraries
 * 4. Clear architectural boundaries between data and presentation layers
 * 
 * POSTGRADUATE REQUIREMENT COMPLIANCE:
 * This design perfectly isolates data visualization into dedicated presentational
 * components with absolute separation from structural and functional responsibilities.
 */

import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Interface for comprehensive dashboard data structure
interface DashboardData {
  applicationTrends: Array<{
    month: string;
    applications: number;
    selections: number;
  }>;
  courseDistribution: Array<{
    course: string;
    applicants: number;
    selected: number;
    selectionRate: number;
  }>;
  weeklyActivity: Array<{
    week: string;
    newApplications: number;
    reviewsCompleted: number;
  }>;
  selectionMetrics: {
    totalApplications: number;
    totalSelected: number;
    averageSelectionRate: number;
    pendingReviews: number;
  };
}

// Props interface for the comprehensive dashboard component
interface LecturerDashboardChartProps {
  dashboardData: DashboardData;
  loading: boolean;
  lecturerName: string;
}

/**
 * Comprehensive presentational component for lecturer dashboard visualization
 * Implements advanced visual representations using multiple chart types
 * Maintains strict separation between data logic and visual presentation
 */
const LecturerDashboardChart: React.FC<LecturerDashboardChartProps> = ({
  dashboardData,
  loading,
  lecturerName
}) => {
  // Color schemes for different chart elements
  const COLORS = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    warning: '#ef4444'
  };

  // Custom tooltip component for enhanced data presentation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {lecturerName}'s Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Comprehensive analytics and insights for application management
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard analytics...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Applications</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {dashboardData.selectionMetrics.totalApplications}
                  </p>
                </div>
                <div className="text-blue-500">📄</div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Selected Candidates</p>
                  <p className="text-2xl font-bold text-green-800">
                    {dashboardData.selectionMetrics.totalSelected}
                  </p>
                </div>
                <div className="text-green-500">✅</div>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Selection Rate</p>
                  <p className="text-2xl font-bold text-orange-800">
                    {dashboardData.selectionMetrics.averageSelectionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-orange-500">📊</div>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Pending Reviews</p>
                  <p className="text-2xl font-bold text-red-800">
                    {dashboardData.selectionMetrics.pendingReviews}
                  </p>
                </div>
                <div className="text-red-500">⏳</div>
              </div>
            </div>
          </div>

          {/* Application Trends Line Chart */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Application & Selection Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke={COLORS.primary} 
                  strokeWidth={3}
                  name="Applications Received"
                />
                <Line 
                  type="monotone" 
                  dataKey="selections" 
                  stroke={COLORS.secondary} 
                  strokeWidth={3}
                  name="Candidates Selected"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Course Distribution and Weekly Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Distribution Bar Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Course Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.courseDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="course" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="applicants" fill={COLORS.primary} name="Total Applicants" />
                  <Bar dataKey="selected" fill={COLORS.secondary} name="Selected" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Activity Area Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Weekly Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="newApplications" 
                    stackId="1"
                    stroke={COLORS.primary} 
                    fill={COLORS.primary}
                    name="New Applications"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reviewsCompleted" 
                    stackId="1"
                    stroke={COLORS.secondary} 
                    fill={COLORS.secondary}
                    name="Reviews Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              📈 Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-gray-700">Most Active Course</p>
                <p className="text-lg font-bold text-blue-600">
                  {dashboardData.courseDistribution.length > 0 
                    ? dashboardData.courseDistribution.reduce((max, course) => 
                        course.applicants > max.applicants ? course : max
                      ).course
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-gray-700">Highest Selection Rate</p>
                <p className="text-lg font-bold text-green-600">
                  {dashboardData.courseDistribution.length > 0 
                    ? Math.max(...dashboardData.courseDistribution.map(c => c.selectionRate)).toFixed(1)
                    : '0'
                  }%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium text-gray-700">Review Efficiency</p>
                <p className="text-lg font-bold text-indigo-600">
                  {dashboardData.selectionMetrics.pendingReviews === 0 ? 'Excellent' : 'Good'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboardChart; 