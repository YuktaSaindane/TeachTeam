// This file contains all the GraphQL queries used in the admin frontend.
// Each query is used to fetch specific data from the backend for different admin features.

// GraphQL queries for retrieving backend data
// Provides data access for various admin features

import { gql } from "@apollo/client";

export const GET_ALL_LECTURERS = gql`
  query GetAllLecturers {
    getAllLecturers {
      id
      name
      email
    }
  }
`;

export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    getAllCourses {
      id
      name
      code
      semester
    }
  }
`;

export const GET_COURSES = gql`
  query {
    getAllCourses {
      id
      name
      code
      semester
    }
  }
`;

export const GET_ALL_CANDIDATES = gql`
  query {
    getAllCandidates {
      id
      name
      email
      is_blocked
    }
  }
`;

export const GET_OVERLOADED_CANDIDATES = gql`
  query {
    getOverloadedCandidates {
      id
      name
      email
      totalCourses
    }
  }
`;

export const GET_UNSELECTED_CANDIDATES = gql`
  query {
    getUnselectedCandidates {
      id
      name
      email
    }
  }
`;
