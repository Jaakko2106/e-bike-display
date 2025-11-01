import React from 'react';
import { Music, Rewind, Play, Pause, FastForward, Bluetooth } from './icons';

interface MusicViewProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTrack: string;
  nextTrack: () => void;
  prevTrack: () => void;
  isBluetoothConnected: boolean;
  toggleBluetooth: () => void;
}

export const MusicView: React.FC<MusicViewProps> = ({ isPlaying, setIsPlaying, currentTrack, nextTrack, prevTrack, isBluetoothConnected, toggleBluetooth }) => (
  <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
    <div className="bg-gray-800 p-8 sm:p-10 rounded-3xl w-full max-w-sm text-center shadow-2xl border border-gray-700">
      <Music className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-400 mx-auto mb-4" />
      <div className="text-lg sm:text-xl font-bold text-white">{currentTrack}</div>
      <div className="text-sm sm:text-base text-gray-400">E-Bike Jams Vol. 1</div>
      <button
        onClick={toggleBluetooth}
        className={`mt-4 flex items-center justify-center mx-auto space-x-2 text-xs py-1 px-3 rounded-full transition ${
          isBluetoothConnected
            ? 'bg-blue-500/20 text-blue-300'
            : 'bg-gray-700 text-gray-400'
        }`}
      >
        <Bluetooth className="w-4 h-4" />
        <span>Bluetooth: {isBluetoothConnected ? 'Connected' : 'Disconnected'}</span>
      </button>
    </div>

    <div className="flex space-x-6">
      <button
        onClick={prevTrack}
        className="p-5 sm:p-6 bg-gray-700 hover:bg-gray-600 transition rounded-full active:scale-90 touch-action-manipulation shadow-xl"
      >
        <Rewind className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
      </button>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="p-6 sm:p-8 bg-indigo-700 hover:bg-indigo-600 transition rounded-full active:scale-90 touch-action-manipulation shadow-2xl"
      >
        {isPlaying ? <Pause className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> : <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white" />}
      </button>

      <button
        onClick={nextTrack}
        className="p-5 sm:p-6 bg-gray-700 hover:bg-gray-600 transition rounded-full active:scale-90 touch-action-manipulation shadow-xl"
      >
        <FastForward className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
      </button>
    </div>
  </div>
);