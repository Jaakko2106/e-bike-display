import React from 'react';
import { SPEED_UNIT } from '../constants';
import { BatteryIndicator } from './BatteryIndicator';
import { DisplayMetric } from './DisplayMetric';
import { Zap } from './icons';

interface DashboardViewProps {
  speed: number;
  gear: string;
  batteryPercent: number;
  batteryVoltage: number;
  isCharging?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ speed, gear, batteryPercent, batteryVoltage, isCharging = false }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full p-2 sm:p-4 grid-rows-[1fr_auto]">
    <div className="col-span-2 flex flex-col items-center justify-center bg-gray-900 rounded-3xl shadow-2xl border-2 sm:border-4 border-indigo-600/50 relative overflow-hidden min-h-0">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-900/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-[5.5rem] sm:text-[9rem] md:text-[11rem] lg:text-[13rem] font-black text-white font-mono leading-none tracking-tighter drop-shadow-2xl">
          {speed.toFixed(1)}
        </div>
        <div className="text-xl sm:text-3xl md:text-4xl font-bold text-indigo-400 mt-2 tracking-[0.2em] uppercase opacity-90">
            {SPEED_UNIT}
        </div>
      </div>
    </div>

    <BatteryIndicator percent={batteryPercent} voltage={batteryVoltage} isCharging={isCharging} />
    <DisplayMetric icon={Zap} label="Assist Level" value={gear} unit="" />
  </div>
);