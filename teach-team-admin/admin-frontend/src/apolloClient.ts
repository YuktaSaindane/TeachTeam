// This file sets up the Apollo Client for making GraphQL requests in the admin frontend.
// It configures the client to connect to the backend GraphQL endpoint for queries and mutations.
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

// HTTP link for all GraphQL operations (queries and mutations)
const httpLink = new HttpLink({
  uri: "http://localhost:4001/graphql",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
