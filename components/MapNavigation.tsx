
import React from 'react';
import { Compass, ArrowRight } from './icons';

interface MapNavigationProps {
  currentDirection: string;
  nextDirection?: string;
  cycleDirection: () => void;
  endRoute: () => void;
  destination: string;
}

export const MapNavigation: React.FC<MapNavigationProps> = ({ currentDirection, nextDirection, cycleDirection, endRoute, destination }) => (
  <div className="flex flex-col h-full p-4 space-y-3">
    <div className="relative flex-grow bg-gray-700 rounded-2xl border-4 border-indigo-500 overflow-hidden shadow-inner">
      <img src="https://picsum.photos/600/400?grayscale" alt="Active Route Map" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gray-900/30"></div>
      <Compass className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 text-white/80 rotate-45" />

      <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 bg-gray-900/90 rounded-b-xl border-b border-indigo-600">
        <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-widest flex justify-between">
          <span>DESTINATION: {destination || 'N/A'}</span>
          <span>Next Turn in 0.8 km</span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center">
          <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mr-2" />
          {currentDirection}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-sm sm:text-base text-gray-300">Route: 12.5 KM remaining | ETA 25 min</div>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={endRoute}
            className="w-1/3 p-3 sm:p-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl active:scale-[0.98] shadow-lg transition duration-150 touch-action-manipulation text-base sm:text-lg"
          >
            End
          </button>
          <button
            onClick={cycleDirection}
            className="w-2/3 p-3 sm:p-4 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-xl active:scale-[0.98] shadow-lg transition duration-150 touch-action-manipulation text-base sm:text-lg"
          >
            {nextDirection ? `Next: ${nextDirection}` : 'Arrived!'}
          </button>
        </div>
      </div>
    </div>
  </div>
);
