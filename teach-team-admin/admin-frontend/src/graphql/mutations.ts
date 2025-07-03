// This file contains all the GraphQL mutations used in the admin frontend.
// Each mutation is used to modify data in the backend, like adding or updating records.
import { gql } from "@apollo/client";

// GraphQL mutations for modifying backend data
// Handles operations such as adding, updating, and deleting records

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      role
    }
  }
`;

export const ASSIGN_LECTURER_MUTATION = gql`
  mutation AssignLecturerToCourse($lecturerId: Float!, $courseId: Float!) {
    assignLecturerToCourse(lecturerId: $lecturerId, courseId: $courseId)
  }
`;
export const ADD_COURSE = gql`
  mutation AddCourse($name: String!, $code: String!, $semester: String!) {
    addCourse(name: $name, code: $code, semester: $semester) {
      id
    }
  }
`;

export const EDIT_COURSE = gql`
  mutation EditCourse(
    $id: Float!
    $name: String
    $code: String
    $semester: String
  ) {
    editCourse(id: $id, name: $name, code: $code, semester: $semester) {
      id
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: Float!) {
    deleteCourse(id: $id)
  }
`;

export const TOGGLE_BLOCK_CANDIDATE = gql`
  mutation ToggleBlock($userId: Float!) {
    toggleBlockCandidate(userId: $userId)
  }
`;