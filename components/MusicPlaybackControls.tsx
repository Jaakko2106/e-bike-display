import React from 'react';
import { Play, Pause, FastForward, Rewind, Volume1, Volume2, VolumeX, Shuffle, Repeat } from './icons';
import { IAudioService, RepeatMode } from '../types/audio';

// Helper for mm:ss formatting
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 1. Play / Pause Button
export interface PlayPauseButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onToggle,
  disabled = false,
  size = 'lg',
  className = '',
  ariaLabel,
}) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-7',
  }[size];

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-10 sm:h-10',
  }[size];

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-label={ariaLabel || (isPlaying ? 'Pause music' : 'Play music')}
      className={`rounded-full transition-all duration-200 select-none touch-action-manipulation flex items-center justify-center relative overflow-hidden group ${
        disabled
          ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
          : isPlaying
          ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-[0_0_25px_rgba(99,102,241,0.6)] active:scale-95'
          : 'bg-gradient-to-tr from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white shadow-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95'
      } ${sizeClasses} ${className}`}
    >
      {isPlaying ? (
        <Pause className={`${iconSizes} text-white drop-shadow-md`} />
      ) : (
        <Play className={`${iconSizes} text-white translate-x-0.5 drop-shadow-md`} />
      )}
    </button>
  );
};

// 2. Next Track Button
export interface NextTrackButtonProps {
  onNext: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export const NextTrackButton: React.FC<NextTrackButtonProps> = ({
  onNext,
  disabled = false,
  size = 'md',
  className = '',
  ariaLabel = 'Next track',
}) => {
  const sizeClasses = {
    sm: 'p-2.5',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  }[size];

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-9 sm:h-9',
  }[size];

  return (
    <button
      onClick={onNext}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`rounded-full transition-all duration-150 select-none touch-action-manipulation flex items-center justify-center ${
        disabled
          ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-40'
          : 'bg-gray-800/90 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 hover:border-gray-600 shadow-lg active:scale-90 hover:shadow-indigo-500/10'
      } ${sizeClasses} ${className}`}
    >
      <FastForward className={`${iconSizes}`} />
    </button>
  );
};

// 3. Previous Track Button
export interface PrevTrackButtonProps {
  onPrev: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export const PrevTrackButton: React.FC<PrevTrackButtonProps> = ({
  onPrev,
  disabled = false,
  size = 'md',
  className = '',
  ariaLabel = 'Previous track',
}) => {
  const sizeClasses = {
    sm: 'p-2.5',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  }[size];

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-9 sm:h-9',
  }[size];

  return (
    <button
      onClick={onPrev}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`rounded-full transition-all duration-150 select-none touch-action-manipulation flex items-center justify-center ${
        disabled
          ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-40'
          : 'bg-gray-800/90 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 hover:border-gray-600 shadow-lg active:scale-90 hover:shadow-indigo-500/10'
      } ${sizeClasses} ${className}`}
    >
      <Rewind className={`${iconSizes}`} />
    </button>
  );
};

// 4. Interactive Scrubber / Progress Bar
export interface TrackScrubberProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  disabled?: boolean;
  className?: string;
}

export const TrackScrubber: React.FC<TrackScrubberProps> = ({
  currentTime,
  duration,
  onSeek,
  disabled = false,
  className = '',
}) => {
  const percent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = parseFloat(e.target.value);
    onSeek((nextVal / 100) * duration);
  };

  return (
    <div className={`w-full space-y-1.5 ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}>
      <div className="flex justify-between text-xs text-gray-400 font-mono tracking-wider px-0.5">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="relative group flex items-center">
        {/* Custom Track Background */}
        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700/60 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Real HTML input slider overlay */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={isNaN(percent) ? 0 : percent}
          onChange={handleSliderChange}
          disabled={disabled}
          aria-label="Track progress slider"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

// 5. Volume Slider and Controls
export interface VolumeControlsProps {
  volume: number; // 0 - 100
  isMuted?: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleMute?: () => void;
  disabled?: boolean;
  className?: string;
}

export const VolumeControl: React.FC<VolumeControlsProps> = ({
  volume,
  isMuted = false,
  onVolumeChange,
  onToggleMute,
  disabled = false,
  className = '',
}) => {
  const effectiveVolume = isMuted ? 0 : volume;

  const handleStepDown = () => onVolumeChange(Math.max(0, volume - 10));
  const handleStepUp = () => onVolumeChange(Math.min(100, volume + 10));

  return (
    <div
      className={`flex items-center space-x-3 w-full bg-gray-900/70 px-4 py-2.5 rounded-2xl border border-gray-800 ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      } ${className}`}
    >
      <button
        onClick={onToggleMute || handleStepDown}
        disabled={disabled}
        aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
        className="p-1.5 text-gray-400 hover:text-white transition active:scale-90"
      >
        {isMuted || effectiveVolume === 0 ? (
          <VolumeX className="w-5 h-5 text-red-400" />
        ) : effectiveVolume < 50 ? (
          <Volume1 className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      <div className="relative flex-grow flex items-center">
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
          <div
            className={`h-full transition-all duration-100 ${
              isMuted ? 'bg-gray-600' : 'bg-gradient-to-r from-gray-300 to-indigo-400'
            }`}
            style={{ width: `${effectiveVolume}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={effectiveVolume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          disabled={disabled}
          aria-label="Volume level slider"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <button
        onClick={handleStepUp}
        disabled={disabled}
        aria-label="Increase volume"
        className="p-1.5 text-gray-400 hover:text-white transition active:scale-90"
      >
        <Volume2 className="w-5 h-5" />
      </button>

      <span className="text-xs font-mono text-gray-400 w-8 text-right select-none">{effectiveVolume}%</span>
    </div>
  );
};

// 6. Master MusicPlaybackControls Component
export interface MusicPlaybackControlsProps {
  // Option A: Interface with an IAudioService instance
  service?: IAudioService;

  // Option B: Direct callback and state props (works with any API or external state)
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek?: (seconds: number) => void;
  onVolumeChange?: (vol: number) => void;
  onToggleMute?: () => void;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;

  currentTime?: number;
  duration?: number;
  volume?: number;
  isMuted?: boolean;
  shuffle?: boolean;
  repeat?: RepeatMode;
  disabled?: boolean;
  showExtraControls?: boolean;
  showScrubber?: boolean;
  showVolume?: boolean;
  buttonSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MusicPlaybackControls: React.FC<MusicPlaybackControlsProps> = ({
  service,
  isPlaying: propIsPlaying,
  onPlay,
  onPause,
  onTogglePlay,
  onNext: propOnNext,
  onPrevious: propOnPrevious,
  onSeek: propOnSeek,
  onVolumeChange: propOnVolumeChange,
  onToggleMute: propOnToggleMute,
  onToggleShuffle: propOnToggleShuffle,
  onToggleRepeat: propOnToggleRepeat,
  currentTime: propCurrentTime = 0,
  duration: propDuration = 200,
  volume: propVolume = 75,
  isMuted: propIsMuted = false,
  shuffle: propShuffle = false,
  repeat: propRepeat = 'none',
  disabled = false,
  showExtraControls = true,
  showScrubber = true,
  showVolume = true,
  buttonSize = 'lg',
  className = '',
}) => {
  // Compute effective handlers and values based on whether service or props are provided
  const isPlaying = service ? service.getState().isPlaying : !!propIsPlaying;
  const currentTime = service ? service.getState().currentTime : propCurrentTime;
  const duration = service ? service.getState().duration : propDuration;
  const volume = service ? service.getState().volume : propVolume;
  const isMuted = service ? service.getState().isMuted : propIsMuted;
  const shuffle = service ? service.getState().shuffle : propShuffle;
  const repeat = service ? service.getState().repeat : propRepeat;

  const handleTogglePlay = () => {
    if (disabled) return;
    if (service) {
      service.togglePlay();
    } else if (onTogglePlay) {
      onTogglePlay();
    } else if (isPlaying && onPause) {
      onPause();
    } else if (!isPlaying && onPlay) {
      onPlay();
    }
  };

  const handleNext = () => {
    if (disabled) return;
    if (service) service.next();
    else if (propOnNext) propOnNext();
  };

  const handlePrevious = () => {
    if (disabled) return;
    if (service) service.prev();
    else if (propOnPrevious) propOnPrevious();
  };

  const handleSeek = (sec: number) => {
    if (disabled) return;
    if (service) service.seek(sec);
    else if (propOnSeek) propOnSeek(sec);
  };

  const handleVolumeChange = (vol: number) => {
    if (disabled) return;
    if (service) service.setVolume(vol);
    else if (propOnVolumeChange) propOnVolumeChange(vol);
  };

  const handleToggleMute = () => {
    if (disabled) return;
    if (service) service.toggleMute();
    else if (propOnToggleMute) propOnToggleMute();
  };

  const handleToggleShuffle = () => {
    if (disabled) return;
    if (service) service.toggleShuffle();
    else if (propOnToggleShuffle) propOnToggleShuffle();
  };

  const handleToggleRepeat = () => {
    if (disabled) return;
    if (service) service.toggleRepeat();
    else if (propOnToggleRepeat) propOnToggleRepeat();
  };

  return (
    <div className={`flex flex-col items-center w-full max-w-sm space-y-4 ${className}`}>
      {/* 1. Track Progress Scrubber */}
      {showScrubber && (
        <TrackScrubber
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          disabled={disabled}
        />
      )}

      {/* 2. Main Playback Buttons (Shuffle, Prev, Play/Pause, Next, Repeat) */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-6 w-full">
        {showExtraControls && (
          <button
            onClick={handleToggleShuffle}
            disabled={disabled}
            aria-label="Toggle shuffle"
            className={`p-2.5 rounded-full transition active:scale-90 ${
              shuffle ? 'text-indigo-400 bg-indigo-500/20 shadow-sm' : 'text-gray-500 hover:text-gray-300'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
        )}

        <PrevTrackButton
          onPrev={handlePrevious}
          disabled={disabled}
          size={buttonSize === 'lg' ? 'md' : 'sm'}
        />

        <PlayPauseButton
          isPlaying={isPlaying}
          onToggle={handleTogglePlay}
          disabled={disabled}
          size={buttonSize}
        />

        <NextTrackButton
          onNext={handleNext}
          disabled={disabled}
          size={buttonSize === 'lg' ? 'md' : 'sm'}
        />

        {showExtraControls && (
          <button
            onClick={handleToggleRepeat}
            disabled={disabled}
            aria-label={`Toggle repeat (currently ${repeat})`}
            className={`p-2.5 rounded-full transition relative active:scale-90 ${
              repeat !== 'none'
                ? 'text-indigo-400 bg-indigo-500/20 shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Repeat className="w-5 h-5" />
            {repeat === 'one' && (
              <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                1
              </span>
            )}
          </button>
        )}
      </div>

      {/* 3. Volume Control */}
      {showVolume && (
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          disabled={disabled}
        />
      )}
    </div>
  );
};
