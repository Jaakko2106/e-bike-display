
import React from 'react';
import { BatteryCharging } from './icons';

interface BatteryIndicatorProps {
  percent: number;
  voltage: number;
  isCharging?: boolean;
}

export const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({ percent, voltage, isCharging = false }) => {
  let color = 'bg-green-500';
  if (percent < 30) color = 'bg-yellow-500';
  if (percent < 15) color = 'bg-red-500';

  const estRange = (percent / 100) * 30; // max range 30km at 100%

  return (
    <div className={`flex flex-col items-center p-2 rounded-xl bg-gray-900/50 transition-all duration-500 ${isCharging ? 'shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-green-500/30' : 'border border-transparent'}`}>
      <div className="flex items-center space-x-2">
        <BatteryCharging className={`w-6 h-6 sm:w-7 sm:h-7 ${color.replace('bg-', 'text-')} ${isCharging ? 'animate-pulse' : ''}`} />
        <span className="text-2xl sm:text-3xl font-bold text-white">{voltage.toFixed(1)}V</span>
      </div>
      <div className="w-full h-2 sm:h-3 mt-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} ${isCharging ? 'animate-pulse' : ''}`}
          style={{ width: `${percent}%`, transition: 'width 0.5s ease-out' }}
        ></div>
      </div>
      <div className={`text-xs mt-0.5 font-medium ${isCharging ? 'text-green-400 animate-pulse' : 'text-gray-400'}`}>
        {isCharging ? 'CHARGING...' : `EST. ${estRange.toFixed(0)} KM REMAINING`}
      </div>
    </div>
  );
};
