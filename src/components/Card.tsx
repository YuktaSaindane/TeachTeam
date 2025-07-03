import React from "react";
/*The Card component is a shared UI element used to display a styled card containing a title, description, and optional content along with an optional footer. It helps display content in a standardized 
way throughout the app. */

//defining the type for props that the card component accepts
interface CardProps {
  title: string; //title of the card
  description: string; //short description below the title
  children?: React.ReactNode; //optional content to display inside the card
  footer?: React.ReactNode; //optional footer content
}


//functional components for a reusable card layout
const Card: React.FC<CardProps> = ({ title, description, children, footer }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col justify-between">
      {/* Main content area containing title, description and child components */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        {children}
      </div>

     
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
};

export default Card;
