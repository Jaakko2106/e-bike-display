import React, { useState } from 'react';
import { Music, Bluetooth, Radio } from './icons';
import { MusicPlaybackControls } from './MusicPlaybackControls';
import { AudioVisualizer } from './AudioVisualizer';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { globalAudioService } from '../services/audioService';

interface MusicViewProps {
  isPlaying?: boolean;
  setIsPlaying?: (playing: boolean) => void;
  currentTrack?: string;
  nextTrack?: () => void;
  prevTrack?: () => void;
  isBluetoothConnected?: boolean;
  toggleBluetooth?: () => void;
  volume?: number;
  setVolume?: (volume: number) => void;
  trackProgress?: number;
  trackDuration?: number;
}

export const MusicView: React.FC<MusicViewProps> = ({
  isPlaying: propIsPlaying,
  setIsPlaying: propSetIsPlaying,
  currentTrack: propCurrentTrack,
  nextTrack: propNextTrack,
  prevTrack: propPrevTrack,
  isBluetoothConnected: propIsBluetoothConnected,
  toggleBluetooth: propToggleBluetooth,
  volume: propVolume,
  setVolume: propSetVolume,
  trackProgress: propTrackProgress,
  trackDuration: propTrackDuration,
}) => {
  // Use our reactive audio hook connected to the audio service
  const player = useAudioPlayer(globalAudioService);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Sync props if parent still manages state externally
  const isBluetoothConnected = propIsBluetoothConnected !== undefined ? propIsBluetoothConnected : player.isBluetoothConnected;
  const isPlaying = propIsPlaying !== undefined ? propIsPlaying : player.isPlaying;
  const currentTitle = propCurrentTrack || player.currentTrack.title;
  const currentArtist = player.currentTrack.artist || 'E-Bike Audio Engine';
  const currentAlbum = player.currentTrack.album || 'Kinetic Drive';
  const currentTime = propTrackProgress !== undefined ? propTrackProgress : player.currentTime;
  const duration = propTrackDuration !== undefined ? propTrackDuration : player.duration;
  const volume = propVolume !== undefined ? propVolume : player.volume;

  const handleToggleBluetooth = () => {
    if (propToggleBluetooth) {
      propToggleBluetooth();
    }
    player.setBluetoothConnected(!isBluetoothConnected);
  };

  const handleTogglePlay = () => {
    if (propSetIsPlaying) {
      propSetIsPlaying(!isPlaying);
    }
    player.togglePlay();
  };

  const handleNext = () => {
    if (propNextTrack) propNextTrack();
    player.next();
  };

  const handlePrev = () => {
    if (propPrevTrack) propPrevTrack();
    player.prev();
  };

  const handleSeek = (seconds: number) => {
    player.seek(seconds);
  };

  const handleVolumeChange = (vol: number) => {
    if (propSetVolume) propSetVolume(vol);
    player.setVolume(vol);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-3 sm:p-5 overflow-y-auto">
      {/* Top Track & Album Card */}
      <div className="bg-gray-900/80 p-5 sm:p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl border border-gray-800 relative overflow-hidden backdrop-blur-md">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-28 bg-indigo-600/15 blur-2xl pointer-events-none rounded-full" />

        {/* Album Artwork / Disc Art */}
        <div className="relative mx-auto mb-4 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/30 group">
          {player.currentTrack.coverUrl && isBluetoothConnected ? (
            <img
              src={player.currentTrack.coverUrl}
              alt={currentTitle}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100 grayscale'
              }`}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Music className={`w-12 h-12 ${isBluetoothConnected ? 'text-indigo-400' : 'text-gray-600'}`} />
            </div>
          )}

          {/* Audio Visualizer Pill when playing */}
          {isPlaying && isBluetoothConnected && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/90 to-transparent p-1.5 flex justify-center">
              <div className="flex space-x-1 items-end h-4">
                <span className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.4s_infinite] h-3" />
                <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_0.6s_infinite] h-4" />
                <span className="w-1 bg-cyan-300 rounded-full animate-[pulse_0.3s_infinite] h-2.5" />
                <span className="w-1 bg-indigo-300 rounded-full animate-[pulse_0.5s_infinite] h-3.5" />
              </div>
            </div>
          )}
        </div>

        {/* Track Title & Artist */}
        <div className="space-y-1">
          <h2
            className={`text-xl sm:text-2xl font-black tracking-tight truncate transition-colors duration-200 ${
              isBluetoothConnected ? 'text-white' : 'text-gray-500'
            }`}
          >
            {isBluetoothConnected ? currentTitle : 'Audio Disconnected'}
          </h2>
          <p
            className={`text-xs sm:text-sm font-medium transition-colors duration-200 ${
              isBluetoothConnected ? 'text-indigo-400' : 'text-gray-600'
            }`}
          >
            {isBluetoothConnected ? `${currentArtist} • ${currentAlbum}` : 'Connect Bluetooth helmet / headset'}
          </p>
        </div>

        {/* Real-time Web Audio Visualizer */}
        <div className="mt-3">
          <AudioVisualizer
            service={globalAudioService}
            isPlaying={isPlaying && isBluetoothConnected}
            barCount={20}
            className="h-8 w-full"
          />
        </div>

        {/* Bluetooth & Playlist Toggle Buttons */}
        <div className="flex items-center justify-center space-x-2 mt-2">
          <button
            onClick={handleToggleBluetooth}
            className={`flex items-center space-x-1.5 text-xs py-1.5 px-3.5 rounded-full transition font-semibold ${
              isBluetoothConnected
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5" />
            <span>{isBluetoothConnected ? 'BT Audio Connected' : 'BT Disconnected'}</span>
          </button>

          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`text-xs py-1.5 px-3 rounded-full transition font-semibold flex items-center space-x-1 ${
              showPlaylist
                ? 'bg-gray-700 text-white border border-gray-600'
                : 'bg-gray-800/80 text-gray-400 hover:text-white border border-gray-700/60'
            }`}
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>Playlist ({player.playlist.length})</span>
          </button>
        </div>
      </div>

      {/* Playlist Selector Dropdown / Drawer */}
      {showPlaylist && (
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-2.5 my-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1 flex justify-between">
            <span>Ride Playlist</span>
            <span>BPM</span>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {player.playlist.map((track, idx) => {
              const active = idx === player.trackIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    player.setTrack(idx);
                    if (!player.isPlaying && isBluetoothConnected) {
                      player.play();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition ${
                    active
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/40 font-semibold'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-mono text-gray-500 text-[10px] w-3">{idx + 1}</span>
                    <span className="truncate">{track.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-500">{track.bpm}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reusable Playback Controls Component interfacing with the Audio Service */}
      <div className="w-full max-w-sm mt-2">
        <MusicPlaybackControls
          service={globalAudioService}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onNext={handleNext}
          onPrevious={handlePrev}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          disabled={!isBluetoothConnected}
          showExtraControls={true}
          showScrubber={true}
          showVolume={true}
          buttonSize="lg"
        />
      </div>
    </div>
  );
};