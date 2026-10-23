import { useEffect, useState, useCallback } from 'react';
import { IAudioService, PlaybackState } from '../types/audio';
import { globalAudioService } from '../services/audioService';

export function useAudioPlayer(service: IAudioService = globalAudioService) {
  const [state, setState] = useState<PlaybackState>(service.getState());

  useEffect(() => {
    const unsubscribe = service.subscribe((nextState) => {
      setState({ ...nextState });
    });
    return unsubscribe;
  }, [service]);

  const play = useCallback(() => service.play(), [service]);
  const pause = useCallback(() => service.pause(), [service]);
  const togglePlay = useCallback(() => service.togglePlay(), [service]);
  const next = useCallback(() => service.next(), [service]);
  const prev = useCallback(() => service.prev(), [service]);
  const seek = useCallback((seconds: number) => service.seek(seconds), [service]);
  const setVolume = useCallback((volume: number) => service.setVolume(volume), [service]);
  const toggleMute = useCallback(() => service.toggleMute(), [service]);
  const toggleShuffle = useCallback(() => service.toggleShuffle(), [service]);
  const toggleRepeat = useCallback(() => service.toggleRepeat(), [service]);
  const setTrack = useCallback((index: number) => service.setTrack(index), [service]);
  const setBluetoothConnected = useCallback((connected: boolean) => service.setBluetoothConnected(connected), [service]);

  return {
    ...state,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setTrack,
    setBluetoothConnected,
    service,
  };
}
