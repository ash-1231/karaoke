import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils/time';
import clsx from 'clsx';

export default function AudioPlayer({
  src,
  onRefReady,
  onLoaded,
  onTogglePlay,
}) {
  const audioRef = useRef(null);
  const [dur, setDur] = useState(0);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (onRefReady) onRefReady(audioRef);
  }, [onRefReady]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onLoadedMeta = () => {
      setDur(a.duration || 0);
      if (onLoaded) onLoaded();
    };
    const onTime = () => setCur(a.currentTime || 0);
    const onPlay = () => { setPlaying(true); onTogglePlay?.(true); };
    const onPause = () => { setPlaying(false); onTogglePlay?.(false); };

    a.addEventListener('loadedmetadata', onLoadedMeta);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    return () => {
      a.removeEventListener('loadedmetadata', onLoadedMeta);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
    };
  }, [onLoaded, onTogglePlay]);

  function handleSeek(e) {
    const val = Number(e.target.value);
    audioRef.current.currentTime = val;
    setCur(val);
  }
  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  }
  function changeVolume(e) {
    const v = Number(e.target.value);
    audioRef.current.volume = v;
    setVolume(v);
  }

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const a = audioRef.current;
      if (!a) return;
      if (e.code === 'Space') { e.preventDefault(); toggle(); }
      if (e.code === 'ArrowRight') a.currentTime = Math.min(a.currentTime + 5, a.duration || a.currentTime + 5);
      if (e.code === 'ArrowLeft') a.currentTime = Math.max(a.currentTime - 5, 0);
      if (e.code === 'ArrowUp') a.volume = Math.min(1, (a.volume || 0) + 0.05);
      if (e.code === 'ArrowDown') a.volume = Math.max(0, (a.volume || 0) - 0.05);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="audio">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="audio-row">
        <button className={clsx('btn', playing && 'btn-on')} onClick={toggle}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <div className="time">
          <span>{formatTime(cur)}</span>
          <input
            type="range"
            min={0}
            max={dur || 0}
            step="0.01"
            value={cur}
            onChange={handleSeek}
          />
          <span>{formatTime(dur)}</span>
        </div>
        <div className="volume">
          <span>🔊</span>
          <input
            type="range"
            min={0}
            max={1}
            step="0.01"
            value={volume}
            onChange={changeVolume}
          />
        </div>
      </div>
    </div>
  );
}
