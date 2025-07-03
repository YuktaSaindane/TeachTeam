import { ApolloClient, InMemoryCache } from "@apollo/client";

// this file provides a helper for creating an Apollo Client instance.

const client = new ApolloClient({
  uri: "http://localhost:4001/graphql",
  cache: new InMemoryCache(),
});

export default client;
