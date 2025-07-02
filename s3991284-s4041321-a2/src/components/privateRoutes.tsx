import React from "react";
import { Navigate } from "react-router-dom";

/*The PrivateRoute component is a route guard that restricts access to specific routes based on the role and login status of the user. 
It gives a promise that only users of the appropriate role can see specific pages and redirects unauthorized users to either the sign-in page or an error page. */
interface Props {
  children: React.ReactNode;
  allowedRoles: string[]; 
}

const PrivateRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  //getting the list of users from localStorage
  const rawUsers = localStorage.getItem("users");
  const rawUser = localStorage.getItem("user"); 

  let isAuthorized = false;
  let redirectPath = "/signin"; 

  try {
    const users = rawUsers ? JSON.parse(rawUsers) : [];
    const user = rawUser ? JSON.parse(rawUser) : null;

    //   checking if the user is logged in
    if (user) {
      //   checking if the users role is matching the allowed roles for this route
      if (allowedRoles.includes(user.role)) {
        isAuthorized = true;
      } else {
        // if the role does not match, set the redirect path to an error page
        redirectPath = "/error"; 
      }
    }
  } catch (err) {
    console.error("Error parsing user data from localStorage:", err);
  }

  // if the user is authorized, then only render the children (route component)
  // If not then we, redirect to sign-in or an error page
  if (isAuthorized) {
    return <>{children}</>;
  } else {
    return <Navigate to={redirectPath} replace />;
  }
};

export default PrivateRoute;
