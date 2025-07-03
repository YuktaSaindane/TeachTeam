// This file is the entry point for rendering the React app in the browser.
// It mounts the App component to the root HTML element
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import client from "./lib/apollo"; 
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "sonner";
import "./index.css";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
        <Toaster richColors position="top-center" duration={2000} />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);


