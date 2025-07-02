// AvatarSelector Component
// A reusable component that allows users to select and manage their profile avatar
// Provides a grid of avatar options and handles avatar selection/removal

import React from "react";

// Props interface for the AvatarSelector component
interface AvatarSelectorProps {
  selected: string;  // Currently selected avatar URL
  onSelect: (url: string) => void;  // Callback function when avatar is selected
}

// Available avatar options for selection
const AVATAR_OPTIONS = [
  "/avatars/avatar1.jpg",
  "/avatars/avatar2.jpg",
  "/avatars/avatar3.jpg",
  "/avatars/avatar4.jpg",
  "/avatars/avatar5.jpg",
  "/avatars/avatar6.jpg",
  "/avatars/avatar7.jpg",
  "/avatars/avatar8.jpg",
  "/avatars/avatar9.jpg",
  "/avatars/avatar10.jpg",
  "/avatars/avatar11.jpg",
  "/avatars/avatar12.jpg",
  "/avatars/avatar13.jpg",
  "/avatars/avatar14.jpg",
  "/avatars/avatar15.jpg",
  "/avatars/avatar16.jpg",
];

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="mb-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 mb-2">Selected Avatar</p>
        <div className="relative inline-block group">
          <img
            src={selected}
            alt="Selected avatar"
            className="w-20 h-20 rounded-full mx-auto border border-gray-300"
          />
          <button
            type="button"
            onClick={() => onSelect("/avatars/avatar17.jpg")}
            className="absolute inset-0 w-full h-full rounded-full bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
            title="Remove avatar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 italic">Hover over avatar to remove</p>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        Choose Your Avatar
      </label>
      <div className="grid grid-cols-4 gap-3">
        {AVATAR_OPTIONS.map((url, index) => (
          <img
            key={url}
            src={url}
            alt={`Avatar ${index + 1}`}
            title={`Avatar ${index + 1}`}
            onClick={() => onSelect(url)}
            className={`w-16 h-16 rounded-full cursor-pointer border-2 transition hover:scale-105 ${
              selected === url ? "border-blue-600" : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
