// This is the main entry point for the admin backend server.
// It sets up an Express application with Apollo Server for GraphQL,
// connects to the database, and starts the server on port 4000.

import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { connectDatabase } from "./utils/db";
import { AuthResolver } from "./resolvers/auth-resolver";
import { CourseResolver } from "./resolvers/course-resolver";
import { ReportResolver } from "./resolvers/report-resolver";

// Initializing and starting the Express server with Apollo GraphQL
async function startServer() {
  // Creating Express application
  const app = express();

  // Building GraphQL schema with all resolvers
  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      CourseResolver,
      ReportResolver,
    ],
    validate: false,
  });

  // create and configure Apollo Server
  const apolloServer = new ApolloServer({
    schema,
  });

  // Starting the Apollo Server and apply middleware to Express app
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app as any });

  // Connecting to the database
  await connectDatabase();

  // Starting the server on port 4001 to avoid conflicts
  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
    console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
}

// Starting the server and handle any errors
startServer().catch(console.error);
