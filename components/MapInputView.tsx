
import React from 'react';
import { Search, Target } from './icons';

interface MapInputViewProps {
  destination: string;
  setDestination: (dest: string) => void;
  startRoute: () => void;
}

export const MapInputView: React.FC<MapInputViewProps> = ({ destination, setDestination, startRoute }) => (
  <div className="flex flex-col h-full p-4 space-y-4">
    <div className="text-center text-gray-400 text-sm">GOOGLE MAPS API SIMULATION</div>

    <div className="relative flex items-center bg-gray-800 rounded-xl p-3 shadow-xl">
      <Search className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
      <input
        type="text"
        placeholder="Enter Destination (e.g., Central Park)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-base sm:text-lg"
      />
    </div>

    <div className="relative flex-grow rounded-2xl border-4 border-indigo-500 overflow-hidden shadow-inner">
      <img
        src="https://picsum.photos/seed/map/600/400"
        alt="Map Preview"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60">
        <div className="text-center text-white p-4 rounded-xl">
          <Target className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
          <p className="text-lg font-semibold">Search for a route.</p>
        </div>
      </div>
    </div>

    <button
      onClick={startRoute}
      disabled={!destination.trim()}
      className={`w-full p-3 sm:p-4 font-bold rounded-xl active:scale-[0.98] shadow-lg transition duration-150 touch-action-manipulation text-base sm:text-lg
        ${destination.trim() ? 'bg-indigo-700 hover:bg-indigo-600 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
      `}
    >
      Start Route to {destination || '...'}
    </button>
  </div>
);
