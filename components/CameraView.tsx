
import React from 'react';
import { Video } from './icons';

interface CameraViewProps {
  handleCameraToggle: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ handleCameraToggle }) => (
  <div className="relative flex flex-col items-center justify-center h-full w-full bg-gray-950 overflow-hidden">
    <div className="w-full h-full bg-black flex items-center justify-center">
      <img
        src="https://picsum.photos/800/480"
        alt="Rear View Camera Feed"
        className="w-full h-full object-cover transform scale-x-[-1]" // mirror effect
      />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-gray-950/80 to-transparent"></div>
      <div className="absolute top-4 left-4 text-white text-base sm:text-xl font-bold flex items-center p-2 rounded-lg bg-gray-900/50">
        <Video className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
        REVERSE CAMERA
      </div>
      {/* Guide Lines Simulation */}
      <div className="absolute inset-y-1/2 w-full h-[1px] bg-red-500/80"></div>
      <div className="absolute inset-y-[65%] w-full h-[1px] bg-yellow-500/80"></div>
      <div className="absolute inset-y-[80%] w-full h-[1px] bg-green-500/80"></div>

      <button
        onClick={handleCameraToggle}
        className="absolute top-4 right-4 p-3 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transition duration-150 active:scale-95 touch-action-manipulation text-sm sm:text-base z-50"
      >
        CLOSE
      </button>
    </div>
  </div>
);
