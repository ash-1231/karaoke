import { useEffect, useRef, useState } from 'react';

export default function useAudioClock(audioRef) {
  const [time, setTime] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tick = () => {
      setTime(audio.currentTime || 0);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [audioRef]);

  return time;
}
