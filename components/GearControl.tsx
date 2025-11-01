
import React from 'react';
import { ArrowRight, Zap } from './icons';

interface GearControlProps {
  gear: string;
  onCycle: () => void;
}

export const GearControl: React.FC<GearControlProps> = ({ gear, onCycle }) => {
  return (
    <div className="flex items-center justify-center p-2 rounded-xl bg-gray-900/50">
      <button
        onClick={onCycle}
        className="p-3 sm:p-4 mr-2 bg-indigo-700 hover:bg-indigo-600 transition duration-150 rounded-full active:scale-95 touch-action-manipulation"
      >
        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
      <div className="text-center">
        <div className="text-lg sm:text-xl font-bold text-white uppercase tracking-widest">{gear}</div>
        <div className="text-xs text-gray-400">ASSIST LEVEL</div>
      </div>
      <div className="p-3 sm:p-4 ml-2 invisible">
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-transparent" />
      </div>
    </div>
  );
};
