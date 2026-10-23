import React, { useEffect, useRef } from 'react';
import { IAudioService } from '../types/audio';

interface AudioVisualizerProps {
  service?: IAudioService;
  isPlaying: boolean;
  barCount?: number;
  className?: string;
  color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  service,
  isPlaying,
  barCount = 16,
  className = 'h-10 w-full',
  color = 'from-indigo-500 to-cyan-400',
}) => {
  const [bars, setBars] = React.useState<number[]>(Array(barCount).fill(10));
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(barCount).fill(8));
      return;
    }

    const updateBars = () => {
      if (service?.getFrequencyData) {
        const freqData = service.getFrequencyData();
        const step = Math.max(1, Math.floor(freqData.length / barCount));
        const newBars = Array.from({ length: barCount }, (_, i) => {
          const val = freqData[i * step] || 0;
          return Math.max(8, Math.min(100, Math.round((val / 255) * 100)));
        });
        setBars(newBars);
      } else {
        // Fallback animated wave pattern
        const time = Date.now() / 200;
        const newBars = Array.from({ length: barCount }, (_, i) => {
          const wave = Math.sin(time + i * 0.5) * 0.5 + 0.5;
          const noise = Math.random() * 0.3;
          return Math.max(12, Math.min(100, Math.round((wave + noise) * 75)));
        });
        setBars(newBars);
      }
      animationFrameRef.current = requestAnimationFrame(updateBars);
    };

    animationFrameRef.current = requestAnimationFrame(updateBars);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, service, barCount]);

  return (
    <div className={`flex items-end justify-center space-x-1 px-4 py-2 ${className}`}>
      {bars.map((height, idx) => (
        <div
          key={idx}
          className={`flex-1 rounded-t-sm transition-all duration-75 bg-gradient-to-t ${color} ${
            isPlaying ? 'opacity-90 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'opacity-25'
          }`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
};
