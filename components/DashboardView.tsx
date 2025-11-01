
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
}

export const DashboardView: React.FC<DashboardViewProps> = ({ speed, gear, batteryPercent, batteryVoltage }) => (
  <div className="grid grid-cols-2 gap-4 h-full p-4">
    <div className="col-span-2 flex flex-col items-center justify-center bg-gray-900 rounded-2xl shadow-2xl border-2 border-indigo-600">
      <div className="text-7xl sm:text-8xl lg:text-9xl font-black text-white font-mono leading-none">
        {speed.toFixed(1)}
      </div>
      <div className="text-3xl sm:text-4xl font-medium text-indigo-400 mt-1">{SPEED_UNIT}</div>
    </div>

    <BatteryIndicator percent={batteryPercent} voltage={batteryVoltage} />
    <DisplayMetric icon={Zap} label="Assist Level" value={gear} unit="" />
  </div>
);
