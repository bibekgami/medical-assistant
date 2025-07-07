// chatheader.tsx
// Removed Settings and Button imports as they are no longer used in this component
// import { Settings } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { Bot } from "lucide-react"; // Keep Bot icon
import logo from "/logo.png";

// Removed props as they are no longer used in this component
interface ChatHeaderProps {
  // isConfigured?: boolean;
  // onSettingsClick?: () => void;
}

// Updated function signature
export const ChatHeader =
  (/* { isConfigured, onSettingsClick }: ChatHeaderProps */) => {
    return (
      // Updated background and text colors for dark theme
      <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-zinc-900 p-4 rounded-t-lg shadow-lg border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo image with a soft shadow and rounded shape */}
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-blue-200">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900 drop-shadow-sm">
                Health Assistant
              </h1>
              <p className="text-sm text-blue-700">
                AI-powered Health Consultor - Gami
              </p>
            </div>
          </div>
          {/* Removed the settings button entirely */}
        </div>
      </div>
    );
  };
