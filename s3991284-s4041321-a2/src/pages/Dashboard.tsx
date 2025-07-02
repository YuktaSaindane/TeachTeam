import React from "react";
//The dashboard component is displayed after a successfull login.
// It provides a simple and welcoming message indicating that the login was successful
const Dashboard: React.FC = () => {
  return (

    
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h2>
        <p className="text-xl">You are successfully logged in.</p>
      </div>
    </div>
  );
};

export default Dashboard;
