import React, { useState } from 'react';
import { Video, Settings, Sun, Sliders } from './icons';

interface CameraViewProps {
  handleCameraToggle: () => void;
  onNavigateToSettings: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ handleCameraToggle, onNavigateToSettings }) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full bg-gray-950 overflow-hidden">
        <div className="w-full h-full bg-black flex items-center justify-center relative">
            <img
                src="https://picsum.photos/800/480"
                alt="Rear View Camera Feed"
                className="w-full h-full object-cover transform scale-x-[-1] transition-all duration-200"
                style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
            />
             {/* Guide Lines Simulation */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-gray-950/80 to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-1/2 w-full h-[1px] bg-red-500/80 pointer-events-none"></div>
            <div className="absolute inset-y-[65%] w-full h-[1px] bg-yellow-500/80 pointer-events-none"></div>
            <div className="absolute inset-y-[80%] w-full h-[1px] bg-green-500/80 pointer-events-none"></div>

             {/* Title */}
            <div className="absolute top-4 left-4 text-white text-base sm:text-xl font-bold flex items-center p-2 rounded-lg bg-gray-900/50 backdrop-blur-sm z-30">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
                REVERSE CAMERA
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 flex space-x-2 z-50">
                 <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className={`p-3 text-white rounded-full shadow-lg transition duration-150 active:scale-95 touch-action-manipulation ${showOverlay ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                    onClick={handleCameraToggle}
                    className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transition duration-150 active:scale-95 touch-action-manipulation text-sm sm:text-base font-bold px-4"
                >
                    CLOSE
                </button>
            </div>

            {/* Settings Overlay */}
            {showOverlay && (
                <div className="absolute top-20 right-4 w-64 bg-gray-900/90 backdrop-blur-md p-4 rounded-2xl border border-gray-700 shadow-2xl z-40 animate-fade-in-up">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider border-b border-gray-700 pb-2">Camera Adjustments</h3>
                    
                    <div className="mb-4">
                        <div className="flex justify-between text-gray-400 text-xs mb-1">
                            <span className="flex items-center"><Sun className="w-3 h-3 mr-1"/> Brightness</span>
                            <span>{brightness}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="50" 
                            max="150" 
                            value={brightness} 
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-gray-400 text-xs mb-1">
                            <span className="flex items-center"><Sliders className="w-3 h-3 mr-1"/> Contrast</span>
                            <span>{contrast}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="50" 
                            max="150" 
                            value={contrast} 
                            onChange={(e) => setContrast(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>

                    <button 
                        onClick={onNavigateToSettings}
                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-indigo-400 text-xs sm:text-sm font-bold rounded-lg transition border border-gray-600 flex items-center justify-center"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Go to Main Settings
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};
