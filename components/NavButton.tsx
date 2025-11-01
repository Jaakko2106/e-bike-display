
import React from 'react';
import { DisplayMode } from '../types';

interface NavButtonProps {
    mode: DisplayMode;
    currentMode: DisplayMode;
    onClick: (mode: DisplayMode) => void;
    icon: React.ElementType;
    label: string;
}

export const NavButton: React.FC<NavButtonProps> = ({ mode, currentMode, onClick, icon: Icon, label }) => (
    <button
      onClick={() => onClick(mode)}
      className={`flex flex-col items-center justify-center p-2 sm:p-3 mx-1 transition duration-200 rounded-lg active:scale-95 touch-action-manipulation ${
        currentMode === mode
          ? 'text-indigo-400 bg-indigo-900/50'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      <span className="text-xs sm:text-sm mt-0.5">{label}</span>
    </button>
  );
