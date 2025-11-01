
import React from 'react';

interface DisplayMetricProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit: string;
  large?: boolean;
}

export const DisplayMetric: React.FC<DisplayMetricProps> = ({ icon: Icon, label, value, unit, large = false }) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-xl bg-gray-800/70 border border-gray-700 shadow-lg ${large ? 'col-span-2' : ''}`}>
    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 mb-1" />
    <div className={`font-mono text-gray-200 ${large ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'} font-extrabold leading-none`}>
      {value}
      <span className={`ml-1 ${large ? 'text-lg sm:text-xl' : 'text-sm sm:text-lg'} font-normal text-gray-400`}>{unit}</span>
    </div>
    <div className="text-xs uppercase text-gray-500 tracking-wider mt-0.5">{label}</div>
  </div>
);
