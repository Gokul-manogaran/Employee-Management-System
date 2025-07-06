const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String
    subjects: [String!]
    attendance: Float!
    userId: String
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedEmployees {
    employees: [Employee!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type EmployeeResponse {
    success: Boolean!
    message: String!
    employee: Employee
  }

  input EmployeeInput {
    name: String!
    age: Int!
    class: String
    subjects: [String!]
    attendance: Float
  }

  input EmployeeUpdateInput {
    name: String
    age: Int
    class: String
    subjects: [String!]
    attendance: Float
  }

  input EmployeeFilters {
    name: String
    class: String
    minAge: Int
    maxAge: Int
    minAttendance: Float
    maxAttendance: Float
  }

  input PaginationInput {
    offset: Int = 0
    limit: Int = 10
    sortBy: String = "name"
    sortOrder: String = "ASC"
  }

  type Query {
    # Authentication
    me: User

    # Employee queries
    employees(
      filters: EmployeeFilters
      pagination: PaginationInput
    ): PaginatedEmployees!
    
    employee(id: ID!): Employee
    
    # Admin only queries
    allEmployees(
      pagination: PaginationInput
    ): PaginatedEmployees!
    
    employeeStats: EmployeeStats!
  }

  type EmployeeStats {
    totalEmployees: Int!
    averageAge: Float!
    averageAttendance: Float!
    classDistribution: [ClassCount!]!
  }

  type ClassCount {
    class: String!
    count: Int!
  }

  type Mutation {
    # Authentication
    login(username: String!, password: String!): AuthResponse!
    register(
      username: String!
      email: String!
      password: String!
      role: String = "employee"
    ): AuthResponse!

    # Employee mutations
    createEmployee(input: EmployeeInput!): EmployeeResponse!
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): EmployeeResponse!
    deleteEmployee(id: ID!): EmployeeResponse!
    
    # Employee self-update (limited fields)
    updateMyProfile(input: EmployeeUpdateInput!): EmployeeResponse!
  }
`;

module.exports = typeDefs; 