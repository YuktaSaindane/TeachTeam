/*
 * Skills Distribution Container - Container Component
 * 
 * This component implements the "Container" part of the Container-Presenter pattern.
 * It is responsible for ALL business logic, data fetching, and state management.
 * 
 * SEPARATION OF CONCERNS:
 * - Handles data fetching from the REST API
 * - Processes raw application data to extract skills statistics
 * - Manages loading states and error handling
 * - Calculates percentages and aggregates skills data
 * - Passes processed data to the presentational component
 * 
 * This design ensures:
 * 1. Business logic is isolated from UI presentation
 * 2. Data processing logic can be modified without affecting UI
 * 3. API interactions are centralized in one place
 * 4. Easy to test business logic independently from UI
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import SkillsDistributionChart from "./SkillsDistributionChart";

// Interface for skills data structure
interface SkillData {
  skill: string;
  count: number;
  percentage: number;
}

// Interface for raw application data from API
interface Application {
  id: number;
  skills: string;
  user: {
    name: string;
  };
}

// Props for the container component
interface SkillsDistributionContainerProps {
  lecturerId: number;
  refreshTrigger?: number;
}

/**
 * Container component for skills distribution visualization
 * Handles all data fetching, processing, and state management
 * Follows the Container-Presenter pattern for clear separation of concerns
 */
const SkillsDistributionContainer: React.FC<SkillsDistributionContainerProps> = ({
  lecturerId,
  refreshTrigger
}) => {
  // State management for skills data and loading status
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState(0);

  /**
   * Processes raw application data to extract and aggregate skills
   * This is pure business logic separated from UI concerns
   */
  const processSkillsData = (applications: Application[]): SkillData[] => {
    const skillCount: { [skill: string]: number } = {};
    let totalCount = 0;

    // Extract and count skills from all applications
    applications.forEach((app) => {
      if (app.skills) {
        // Parse skills (assuming comma-separated format)
        const skills = app.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0);

        skills.forEach((skill) => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
          totalCount++;
        });
      }
    });

    // Convert to array format with percentages
    const skillsArray = Object.entries(skillCount)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: (count / applications.length) * 100
      }))
      .sort((a, b) => b.count - a.count); // Sort by popularity

    return skillsArray;
  };

  /**
   * Fetches application data from the REST API
   * Handles authentication headers and error management
   */
  const fetchSkillsData = async () => {
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
      setTotalApplicants(applications.length);
      
      // Process raw data into skills statistics
      const processedSkillsData = processSkillsData(applications);
      setSkillsData(processedSkillsData);

    } catch (error) {
      console.error("Error fetching skills data:", error);
      // Reset to empty state on error
      setSkillsData([]);
      setTotalApplicants(0);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch data when component mounts or when refresh is triggered
  useEffect(() => {
    fetchSkillsData();
  }, [lecturerId, refreshTrigger]);

  // Render the presentational component with processed data
  // This maintains clear separation between data logic and UI presentation
  return (
    <SkillsDistributionChart
      skillsData={skillsData}
      loading={loading}
      totalApplicants={totalApplicants}
    />
  );
};

export default SkillsDistributionContainer; 