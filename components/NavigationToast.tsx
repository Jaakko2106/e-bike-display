import React, { useEffect, useState } from 'react';
import { CornerUpLeft, CornerUpRight, ArrowUp, AlertTriangle, CheckCircle, XIcon } from './icons';
import { TurnType } from '../types/navigation';

export interface NavigationToastProps {
  distanceMeters: number;
  instruction: string;
  turnType?: TurnType;
  subText?: string;
  onDismiss?: () => void;
  onTurnAction?: () => void;
}

export const NavigationToast: React.FC<NavigationToastProps> = ({
  distanceMeters,
  instruction,
  turnType = 'left',
  subText,
  onDismiss,
  onTurnAction,
}) => {
  const [hasEnteredAlertZone, setHasEnteredAlertZone] = useState(false);

  // Trigger alert effect when crossing into the 100m threshold
  useEffect(() => {
    if (distanceMeters <= 100 && distanceMeters > 0) {
      setHasEnteredAlertZone(true);
    }
  }, [distanceMeters]);

  const renderTurnIcon = () => {
    switch (turnType) {
      case 'left':
        return <CornerUpLeft className="w-7 h-7 text-yellow-400 animate-pulse" />;
      case 'right':
        return <CornerUpRight className="w-7 h-7 text-yellow-400 animate-pulse" />;
      case 'straight':
        return <ArrowUp className="w-7 h-7 text-cyan-400 animate-pulse" />;
      case 'arrive':
        return <CheckCircle className="w-7 h-7 text-emerald-400" />;
      case 'merge':
      default:
        return <CornerUpLeft className="w-7 h-7 text-yellow-400 animate-pulse" />;
    }
  };

  const roundedDistance = Math.max(0, Math.round(distanceMeters));
  // Progress ratio towards 0m (starts at 100m)
  const progressPercent = Math.min(100, Math.max(0, ((100 - roundedDistance) / 100) * 100));

  const isImmediate = roundedDistance <= 25;

  return (
    <div className="w-full max-w-md mx-auto px-2 pointer-events-auto transition-all duration-300 ease-out animate-in slide-in-from-top-4">
      <div
        className={`relative overflow-hidden rounded-2xl p-3 sm:p-4 shadow-2xl border-2 backdrop-blur-xl transition-all duration-300 ${
          isImmediate
            ? 'bg-amber-950/95 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/50'
            : 'bg-gray-950/95 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
        }`}
      >
        {/* Animated Warning Glow Bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 animate-[pulse_1s_infinite]" />

        <div className="flex items-center space-x-3">
          {/* Turn Icon Container */}
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 flex items-center justify-center border shadow-inner ${
              isImmediate
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-gray-900 border-gray-700 text-yellow-400'
            }`}
          >
            {renderTurnIcon()}
          </div>

          {/* Turn Text & Distance Readout */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold tracking-wider uppercase">
              <span className="flex items-center text-amber-400 space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>INTERSECTION AHEAD</span>
              </span>
              <span className="text-gray-500">•</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${
                isImmediate ? 'bg-amber-500 text-gray-950 animate-bounce' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {roundedDistance}m
              </span>
            </div>

            <div className="text-sm sm:text-base font-black text-white truncate mt-0.5 drop-shadow">
              {instruction}
            </div>

            {subText && (
              <div className="text-xs text-gray-400 truncate font-medium">
                {subText}
              </div>
            )}
          </div>

          {/* Action / Dismiss Buttons */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {onTurnAction && (
              <button
                onClick={onTurnAction}
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold rounded-lg shadow transition active:scale-95"
                title="Complete Turn"
              >
                Turn
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg transition"
                aria-label="Dismiss turn notification"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Distance Progress Bar counting down to the intersection */}
        <div className="mt-2.5 w-full bg-gray-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isImmediate ? 'bg-amber-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
