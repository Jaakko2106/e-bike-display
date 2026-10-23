export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  url?: string;
  coverUrl?: string;
  genre?: string;
  bpm?: number;
}

export type RepeatMode = 'none' | 'all' | 'one';

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 - 100
  isMuted: boolean;
  currentTrack: Track;
  trackIndex: number;
  playlist: Track[];
  isBuffering: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  isBluetoothConnected: boolean;
}

export interface IAudioService {
  play(): Promise<void>;
  pause(): void;
  togglePlay(): Promise<void>;
  next(): void;
  prev(): void;
  seek(seconds: number): void;
  setVolume(volume: number): void;
  toggleMute(): void;
  toggleShuffle(): void;
  toggleRepeat(): void;
  setTrack(index: number): void;
  setBluetoothConnected(connected: boolean): void;
  getState(): PlaybackState;
  subscribe(callback: (state: PlaybackState) => void): () => void;
  getFrequencyData?(): Uint8Array;
}
