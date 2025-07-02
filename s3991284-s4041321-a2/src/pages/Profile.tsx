// Profile Page Component
// Displays and manages user profile information
// Allows users to update their avatar and view their account details
// Handles authentication state and profile updates

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import AvatarSelector from "../components/AvatarSelector"; // <- reuse component

// Interface defining the structure of user profile data
interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  joined_at: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  // State management for user profile and UI feedback
  const [user, setUser] = useState<UserProfile | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // Load user profile data on component mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/signin");
      return;
    }

    const parsedUser: UserProfile = JSON.parse(stored);
    setUser(parsedUser);
    setAvatar(parsedUser.avatar_url || "/avatars/avatar1.jpg");
  }, [navigate]);

  // Handle avatar selection
  const handleAvatarSelect = (url: string) => {
    setAvatar(url);
  };

  // Handle profile update submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await axios.put(`http://localhost:3001/api/users/${user.email}`, {
        avatar_url: avatar,
      });

      // updating local storage and state with new avatar
      const updated = { ...user, avatar_url: avatar };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700">My Profile</h1>

        <div className="bg-white border rounded-lg shadow-md p-6">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            <p className="text-sm text-gray-500">View and update your avatar</p>
          </div>

          {success && (
            <div className="flex items-center text-green-600 text-sm bg-green-100 border border-green-300 rounded p-2 mb-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <AvatarSelector selected={avatar} onSelect={handleAvatarSelect} />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                value={user.name}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                value={user.email}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <input
                id="role"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="joined" className="block text-sm font-medium text-gray-700">Joined</label>
              <input
                id="joined"
                value={new Date(user.joined_at).toLocaleDateString()}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
