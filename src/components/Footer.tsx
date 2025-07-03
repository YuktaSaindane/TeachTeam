import React from "react";
import { Link } from "react-router-dom";
/*The Footer is a styled container displayed at the bottom of the web page. 
It provides basic information on the TeachTeam platform, along with navigation links and contact details. */

//footer component that appears at the bottom of that page
const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-900 text-white py-12">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About section*/}
          <div>
            <h3 className="font-bold text-lg mb-4 text-indigo-200">TeachTeam</h3>
            <p className="text-sm text-indigo-100">
              A web solution dedicated to the selection and hiring of casual tutors for courses offered at the School of
              Computer Science.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-indigo-200">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-indigo-100 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/signin" className="text-indigo-100 hover:text-white transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-indigo-100 hover:text-white transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-indigo-200">Contact</h3>
            <address className="not-italic text-sm text-indigo-100">
              School of Computer Science
              <br />
              University Campus
              <br />
              Email: <a href="mailto:teachteam@university.edu" className="hover:text-white">teachteam@university.edu</a>
              <br />
              Phone: <a href="tel:+61046-456-7890" className="hover:text-white">+61 046-456-7890</a>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-indigo-800 text-center text-sm text-indigo-300">
          <p>&copy; {new Date().getFullYear()} TeachTeam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
