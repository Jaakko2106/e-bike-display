import { IAudioService, PlaybackState, Track, RepeatMode } from '../types/audio';

export const DEFAULT_PLAYLIST: Track[] = [
  {
    id: 'track-1',
    title: 'Riding Rhythms',
    artist: 'CyberCruise',
    album: 'E-Boost Velocity Vol. 1',
    duration: 215, // 3:35
    bpm: 118,
    genre: 'Synthwave / Chillstep',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'track-2',
    title: 'Motor Melodies',
    artist: 'Volt Runner',
    album: 'High Torque Soundscapes',
    duration: 184, // 3:04
    bpm: 124,
    genre: 'Electronic Pulse',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'track-3',
    title: 'Trail Tunes',
    artist: 'Pedal Dynamics',
    album: 'Alpine Ascents',
    duration: 242, // 4:02
    bpm: 110,
    genre: 'Organic Ambient',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'track-4',
    title: 'E-Boost Bass',
    artist: 'Regen Grid',
    album: 'Kinetic Drive',
    duration: 198, // 3:18
    bpm: 130,
    genre: 'Future Bass',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
  },
];

export class WebAudioService implements IAudioService {
  private state: PlaybackState;
  private listeners: Set<(state: PlaybackState) => void> = new Set();
  private audioCtx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private timerId: number | null = null;
  private synthIntervalId: number | null = null;
  private synthStep = 0;

  constructor(initialPlaylist: Track[] = DEFAULT_PLAYLIST) {
    this.state = {
      isPlaying: false,
      currentTime: 0,
      duration: initialPlaylist[0]?.duration || 215,
      volume: 75,
      isMuted: false,
      currentTrack: initialPlaylist[0],
      trackIndex: 0,
      playlist: initialPlaylist,
      isBuffering: false,
      shuffle: false,
      repeat: 'all',
      isBluetoothConnected: true,
    };
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.gainNode = this.audioCtx.createGain();
        this.analyserNode = this.audioCtx.createAnalyser();
        this.analyserNode.fftSize = 64;
        this.gainNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioCtx.destination);
        this.updateGain();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private updateGain() {
    if (this.gainNode && this.audioCtx) {
      const targetGain = this.state.isMuted || !this.state.isBluetoothConnected ? 0 : (this.state.volume / 100) * 0.15;
      this.gainNode.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);
    }
  }

  // Generates rhythmic, harmonious synth audio tones in real time
  private playSynthChime(step: number) {
    if (!this.audioCtx || !this.gainNode || !this.state.isPlaying || this.state.isMuted || !this.state.isBluetoothConnected) return;

    try {
      const bpm = this.state.currentTrack.bpm || 120;
      const keyFreqs = [
        [220, 277.18, 329.63, 440], // A minor
        [196, 246.94, 293.66, 392], // G major
        [174.61, 220, 261.63, 349.23], // F major
        [164.81, 207.65, 246.94, 329.63], // E minor
      ];

      const barIndex = Math.floor(step / 16) % keyFreqs.length;
      const chord = keyFreqs[barIndex];
      const noteFreq = chord[step % chord.length];

      // Bass note on downbeats
      if (step % 4 === 0) {
        const bassOsc = this.audioCtx.createOscillator();
        const bassGain = this.audioCtx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(chord[0] / 2, this.audioCtx.currentTime);

        bassGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

        bassOsc.connect(bassGain);
        bassGain.connect(this.gainNode);
        bassOsc.start();
        bassOsc.stop(this.audioCtx.currentTime + 0.35);
      }

      // Arpeggiated melody tone
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, this.audioCtx.currentTime);

      noteGain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch {
      // AudioContext could be in a temporary state
    }
  }

  private startTick() {
    this.stopTick();
    this.timerId = window.setInterval(() => {
      if (!this.state.isPlaying) return;

      this.setState({
        currentTime: this.state.currentTime + 1,
      });

      if (this.state.currentTime >= this.state.duration) {
        if (this.state.repeat === 'one') {
          this.seek(0);
        } else {
          this.next();
        }
      }
    }, 1000);

    // Run synth rhythmic generator at 16th notes based on BPM
    const bpm = this.state.currentTrack.bpm || 120;
    const intervalMs = (60000 / bpm) / 4;
    this.synthIntervalId = window.setInterval(() => {
      if (this.state.isPlaying) {
        this.synthStep = (this.synthStep + 1) % 64;
        this.playSynthChime(this.synthStep);
      }
    }, intervalMs);
  }

  private stopTick() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.synthIntervalId !== null) {
      clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
  }

  private setState(partial: Partial<PlaybackState>) {
    this.state = { ...this.state, ...partial };
    this.updateGain();
    this.listeners.forEach((listener) => listener(this.state));
  }

  public async play(): Promise<void> {
    if (!this.state.isBluetoothConnected) return;
    this.initAudio();
    this.setState({ isPlaying: true });
    this.startTick();
  }

  public pause(): void {
    this.setState({ isPlaying: false });
    this.stopTick();
  }

  public async togglePlay(): Promise<void> {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }

  public next(): void {
    const { playlist, trackIndex, shuffle } = this.state;
    let nextIndex: number;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
      if (nextIndex === trackIndex && playlist.length > 1) {
        nextIndex = (trackIndex + 1) % playlist.length;
      }
    } else {
      nextIndex = (trackIndex + 1) % playlist.length;
    }

    this.setTrack(nextIndex);
  }

  public prev(): void {
    const { playlist, trackIndex, currentTime } = this.state;
    // If track has been playing for more than 3 seconds, restart current track
    if (currentTime > 3) {
      this.seek(0);
      return;
    }
    const prevIndex = (trackIndex - 1 + playlist.length) % playlist.length;
    this.setTrack(prevIndex);
  }

  public seek(seconds: number): void {
    const clamped = Math.max(0, Math.min(seconds, this.state.duration));
    this.setState({ currentTime: clamped });
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(100, Math.round(volume)));
    this.setState({ volume: clamped, isMuted: false });
  }

  public toggleMute(): void {
    this.setState({ isMuted: !this.state.isMuted });
  }

  public toggleShuffle(): void {
    this.setState({ shuffle: !this.state.shuffle });
  }

  public toggleRepeat(): void {
    const order: RepeatMode[] = ['none', 'all', 'one'];
    const current = order.indexOf(this.state.repeat);
    const nextRepeat = order[(current + 1) % order.length];
    this.setState({ repeat: nextRepeat });
  }

  public setTrack(index: number): void {
    const track = this.state.playlist[index];
    if (!track) return;
    const wasPlaying = this.state.isPlaying;
    this.synthStep = 0;
    this.setState({
      trackIndex: index,
      currentTrack: track,
      currentTime: 0,
      duration: track.duration,
    });
    if (wasPlaying && this.state.isBluetoothConnected) {
      this.startTick();
    }
  }

  public setBluetoothConnected(connected: boolean): void {
    this.setState({ isBluetoothConnected: connected });
    if (!connected && this.state.isPlaying) {
      this.pause();
    }
  }

  public getState(): PlaybackState {
    return this.state;
  }

  public subscribe(callback: (state: PlaybackState) => void): () => void {
    this.listeners.add(callback);
    callback(this.state);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyserNode || !this.state.isPlaying || this.state.isMuted || !this.state.isBluetoothConnected) {
      return new Uint8Array(32);
    }
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);
    return data;
  }
}

// Global singleton instance for easy cross-component binding
export const globalAudioService = new WebAudioService();
