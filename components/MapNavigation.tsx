import React from 'react';
import { ArrowRight, CornerUpLeft, CornerUpRight, ArrowUp, AlertTriangle } from './icons';
import { UserLocationMap } from './UserLocationMap';
import { RouteStep } from '../types/navigation';

interface MapNavigationProps {
  currentDirection: string;
  nextDirection?: string;
  cycleDirection: () => void;
  endRoute: () => void;
  destination: string;
  distanceToNextTurn: number;
  setDistanceToNextTurn?: (d: number) => void;
  currentStep?: RouteStep;
  nextStep?: RouteStep;
}

export const MapNavigation: React.FC<MapNavigationProps> = ({
  currentDirection,
  nextDirection,
  cycleDirection,
  endRoute,
  destination,
  distanceToNextTurn,
  setDistanceToNextTurn,
  currentStep,
  nextStep,
}) => {
  const isWithin100m = distanceToNextTurn <= 100 && distanceToNextTurn > 0;
  const roundedDist = Math.round(distanceToNextTurn);

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} M`;
    }
    return `${(meters / 1000).toFixed(1)} KM`;
  };

  const renderTurnIcon = () => {
    const type = currentStep?.turnType;
    if (type === 'left') return <CornerUpLeft className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-2 shrink-0 animate-pulse" />;
    if (type === 'right') return <CornerUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-2 shrink-0 animate-pulse" />;
    if (type === 'straight') return <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mr-2 shrink-0" />;
    return <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-2 shrink-0 animate-pulse" />;
  };

  return (
    <div className="flex flex-col h-full p-2 sm:p-4 space-y-3">
      <div className="relative flex-grow rounded-2xl overflow-hidden shadow-inner flex flex-col min-h-0">
        {/* Real Interactive Map Component with User Location & Destination Routing */}
        <UserLocationMap
          destination={destination}
          showMarker={true}
          className="w-full h-full flex-grow"
        />

        {/* Top HUD Directions Banner */}
        <div className={`absolute top-0 left-0 right-0 p-3 sm:p-4 backdrop-blur-md rounded-b-2xl border-b shadow-xl z-20 transition-all duration-300 ${
          isWithin100m
            ? 'bg-amber-950/90 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
            : 'bg-gray-900/95 border-indigo-600'
        }`}>
          <div className="text-[11px] sm:text-xs text-gray-400 uppercase tracking-widest flex justify-between font-mono items-center">
            <span className="truncate pr-2">DESTINATION: <strong className="text-white">{destination || 'Active Route'}</strong></span>
            <span className={`px-2 py-0.5 rounded-full font-bold flex items-center space-x-1 shrink-0 ${
              isWithin100m
                ? 'bg-amber-500 text-gray-950 animate-pulse'
                : 'text-cyan-400 bg-cyan-950/60 border border-cyan-800'
            }`}>
              {isWithin100m && <AlertTriangle className="w-3 h-3 mr-0.5" />}
              <span>NEXT TURN IN {formatDistance(distanceToNextTurn)}</span>
            </span>
          </div>

          <div className="text-base sm:text-xl font-bold text-white mt-1.5 flex items-center drop-shadow-md">
            {renderTurnIcon()}
            <span className="truncate">{currentDirection}</span>
          </div>

          {currentStep?.subText && (
            <div className="text-xs text-gray-400 ml-7 sm:ml-8 truncate">
              {currentStep.subText}
            </div>
          )}
        </div>

        {/* Bottom Route Summary, Distance Quick-Tester, & Action Buttons */}
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-gray-900/95 backdrop-blur-md p-3 rounded-2xl border border-gray-700/80 shadow-2xl">
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-300 font-mono mb-2 px-1">
            <div className="flex items-center space-x-2">
              <span>Next Intersection:</span>
              <span className={`font-bold ${isWithin100m ? 'text-amber-400 font-black' : 'text-cyan-300'}`}>
                {roundedDist}m
              </span>
            </div>

            {/* Quick Test Button for within 100m */}
            {setDistanceToNextTurn && (
              <button
                onClick={() => setDistanceToNextTurn(85)}
                className="text-[11px] px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-md transition font-sans font-medium"
                title="Simulate within 100m of intersection"
              >
                Test 85m Alert
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={endRoute}
              className="w-1/3 py-2.5 sm:py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl active:scale-[0.98] shadow-lg transition duration-150 touch-action-manipulation text-sm sm:text-base"
            >
              End
            </button>
            <button
              onClick={cycleDirection}
              className={`w-2/3 py-2.5 sm:py-3 text-white font-bold rounded-xl active:scale-[0.98] shadow-lg transition duration-150 touch-action-manipulation text-sm sm:text-base flex items-center justify-center space-x-1.5 ${
                isWithin100m
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/30'
                  : 'bg-indigo-700 hover:bg-indigo-600'
              }`}
            >
              <span>{nextDirection ? `Next: ${nextDirection}` : 'Arrived!'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
