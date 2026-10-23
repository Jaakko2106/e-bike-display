import React from 'react';
import { Search, MapPin } from './icons';
import { UserLocationMap } from './UserLocationMap';

interface MapInputViewProps {
  destination: string;
  setDestination: (dest: string) => void;
  startRoute: () => void;
}

const POPULAR_DESTINATIONS = [
  'Marina Green Path',
  'Golden Gate Viewpoint',
  'Ocean Beach Trail',
  'Presidio Heights',
];

export const MapInputView: React.FC<MapInputViewProps> = ({
  destination,
  setDestination,
  startRoute,
}) => {
  return (
    <div className="flex flex-col h-full p-2 sm:p-4 space-y-3">
      {/* Search Input Bar */}
      <div className="relative flex items-center bg-gray-900 rounded-2xl p-2.5 sm:p-3 shadow-xl border border-gray-800">
        <Search className="w-5 h-5 text-indigo-400 mr-2.5 flex-shrink-0" />
        <input
          type="text"
          placeholder="Enter destination or cycle point..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && destination.trim()) {
              startRoute();
            }
          }}
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base font-medium"
        />
        {destination && (
          <button
            onClick={() => setDestination('')}
            className="text-xs text-gray-500 hover:text-white px-2 py-1 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Bike Route Suggestions */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-gray-500 text-[11px] font-semibold whitespace-nowrap pl-1">Trails:</span>
        {POPULAR_DESTINATIONS.map((dest) => (
          <button
            key={dest}
            onClick={() => setDestination(dest)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium transition border ${
              destination === dest
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                : 'bg-gray-800/90 text-gray-300 hover:text-white hover:bg-gray-700 border-gray-700'
            }`}
          >
            {dest}
          </button>
        ))}
      </div>

      {/* Real Interactive Map Component */}
      <div className="relative flex-grow rounded-2xl overflow-hidden shadow-inner flex flex-col min-h-0">
        <UserLocationMap
          destination={destination}
          showMarker={true}
          className="w-full h-full flex-grow"
        />

        {!destination.trim() && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-700 shadow-xl pointer-events-none text-center">
            <p className="text-xs text-gray-300 font-medium flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select or search a destination above to plot route</span>
            </p>
          </div>
        )}
      </div>

      {/* Start Route Button */}
      <button
        onClick={startRoute}
        disabled={!destination.trim()}
        className={`w-full py-3 sm:py-3.5 font-bold rounded-xl active:scale-[0.98] shadow-lg transition duration-150 touch-action-manipulation text-sm sm:text-base flex items-center justify-center space-x-2 ${
          destination.trim()
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/60'
        }`}
      >
        <span>Start Route {destination ? `to ${destination}` : ''}</span>
      </button>
    </div>
  );
};
