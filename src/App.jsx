import { useCallback, useMemo, useRef, useState } from 'react';
import useLRC from './hooks/useLRC';
import useAudioClock from './hooks/useAudioClock';
import AudioPlayer from './components/AudioPlayer';
import LyricsViewer from './components/LyricsViewer';
import DropZone from './components/DropZone';
import MetaBar from './components/MetaBar';
import './styles.css';

export default function App() {
  // default demo
  const [audioSrc, setAudioSrc] = useState('/demo.mp3');
  const [lrcSrc, setLrcSrc] = useState('/demo.lrc');

  const audioRef = useRef(null);
  const time = useAudioClock(audioRef);

  const { status, meta, lines, error } = useLRC(lrcSrc);

  // handle external files dropped/selected
  const handleFiles = useCallback((files) => {
    // pick first audio and first lrc
    const audioFile = files.find(f => /\.(mp3|wav)$/i.test(f.name));
    const lrcFile = files.find(f => /\.lrc$/i.test(f.name));
    if (audioFile) setAudioSrc(URL.createObjectURL(audioFile));
    if (lrcFile) setLrcSrc(URL.createObjectURL(lrcFile));
  }, []);

  const onRefReady = useCallback((ref) => {
    audioRef.current = ref.current;
  }, []);

  const onSeek = useCallback((t) => {
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const headerTitle = useMemo(() => meta?.ti || 'Karaoke Lyrics', [meta]);

  return (
    <div className="app">
      <header className="top">
        <h1>{headerTitle}</h1>
        <ThemeToggle />
      </header>

      <MetaBar meta={meta} />

      <div className="panel">
        <AudioPlayer
          src={audioSrc}
          onRefReady={onRefReady}
          onLoaded={() => {}}
          onTogglePlay={() => {}}
        />
        <div className="status">
          {status === 'loading' && <span className="muted">Loading lyrics…</span>}
          {status === 'error' && <span className="error">Lyrics error: {error}</span>}
        </div>
        <LyricsViewer lines={lines} currentTime={time} onSeek={onSeek} />
      </div>

      <DropZone onFiles={handleFiles} />

      <footer className="foot">
        <small>Tip: Space play/pause • ←/→ seek 5s • ↑/↓ volume • Click a line to jump</small>
      </footer>
    </div>
  );
}

function ThemeToggle() {
  const [mode, setMode] = useState(() => localStorage.getItem('mode') || 'dark');
  const next = () => {
    const m = mode === 'dark' ? 'light' : 'dark';
    setMode(m);
    document.documentElement.dataset.theme = m;
    localStorage.setItem('mode', m);
  };

  // init once
  useMemo(() => {
    document.documentElement.dataset.theme = mode;
  }, []); // eslint-disable-line

  return (
    <button className="btn" onClick={next}>
      {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
