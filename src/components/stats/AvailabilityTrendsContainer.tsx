/*
 * Availability Trends Container - Container Component
 * 
 * This component implements the "Container" part of the Container-Presenter pattern.
 * It is responsible for ALL business logic, data fetching, and state management.
 * 
 * SEPARATION OF CONCERNS:
 * - Handles data fetching from the REST API endpoints
 * - Processes raw application data to calculate availability trends
 * - Manages loading states, error handling, and data transformations
 * - Calculates selection rates and availability statistics
 * - Passes fully processed data to the presentational component
 * 
 * This architectural design ensures:
 * 1. Business logic is completely isolated from UI presentation
 * 2. Data processing algorithms can be modified without affecting visual components
 * 3. API interactions and error handling are centralized
 * 4. Easy to unit test business logic independently from UI rendering
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import AvailabilityTrendsChart from "./AvailabilityTrendsChart";

// Interface for availability data structure
interface AvailabilityData {
  availability: string;
  total: number;
  selected: number;
  unselected: number;
  selectionRate: number;
}

// Interface for raw application data from API
interface Application {
  id: number;
  availability: string;
  is_selected: boolean;
  user: {
    name: string;
  };
}

// Props for the container component
interface AvailabilityTrendsContainerProps {
  lecturerId: number;
  refreshTrigger?: number;
}

/**
 * Container component for availability trends visualization
 * Handles all data fetching, processing, and state management
 * Implements Container-Presenter pattern for clear separation of concerns
 */
const AvailabilityTrendsContainer: React.FC<AvailabilityTrendsContainerProps> = ({
  lecturerId,
  refreshTrigger
}) => {
  // State management for availability data and loading status
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalApplications, setTotalApplications] = useState(0);

  /**
   * Processes raw application data to calculate availability trends and selection rates
   * This is pure business logic separated from UI concerns
   */
  const processAvailabilityData = (applications: Application[]): AvailabilityData[] => {
    // Initialize counters for different availability types
    const availabilityStats: { [key: string]: { total: number; selected: number } } = {};

    // Process each application to build statistics
    applications.forEach((app) => {
      const availability = app.availability || 'Not Specified';
      
      // Initialize if not exists
      if (!availabilityStats[availability]) {
        availabilityStats[availability] = { total: 0, selected: 0 };
      }

      // Count totals and selections
      availabilityStats[availability].total++;
      if (app.is_selected) {
        availabilityStats[availability].selected++;
      }
    });

    // Convert to array format with calculated rates
    const availabilityArray = Object.entries(availabilityStats)
      .map(([availability, stats]) => ({
        availability,
        total: stats.total,
        selected: stats.selected,
        unselected: stats.total - stats.selected,
        selectionRate: stats.total > 0 ? (stats.selected / stats.total) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total); // Sort by total applications

    return availabilityArray;
  };

  /**
   * Fetches application data from the REST API
   * Handles authentication headers and comprehensive error management
   */
  const fetchAvailabilityData = async () => {
    try {
      setLoading(true);
      
      // Get current user for authentication
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Fetch applications data from REST API
      const response = await axios.get(
        `http://localhost:3001/api/applications/lecturer/${lecturerId}`,
        {
          headers: {
            'user-role': currentUser.role,
            'user-id': currentUser.id?.toString(),
            'user-email': currentUser.email
          }
        }
      );

      const applications = response.data || [];
      setTotalApplications(applications.length);
      
      // Process raw data into availability statistics
      const processedAvailabilityData = processAvailabilityData(applications);
      setAvailabilityData(processedAvailabilityData);

    } catch (error) {
      console.error("Error fetching availability data:", error);
      // Reset to empty state on error
      setAvailabilityData([]);
      setTotalApplications(0);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch data when component mounts or when refresh is triggered
  useEffect(() => {
    fetchAvailabilityData();
  }, [lecturerId, refreshTrigger]);

  // Render the presentational component with processed data
  // This maintains clear separation between data logic and UI presentation
  return (
    <AvailabilityTrendsChart
      availabilityData={availabilityData}
      loading={loading}
      totalApplications={totalApplications}
    />
  );
};

export default AvailabilityTrendsContainer; 