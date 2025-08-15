import { useEffect, useState } from 'react';
import { parseLRC } from '../utils/parseLRC';

export default function useLRC(src) {
  const [status, setStatus] = useState('idle'); // idle|loading|ready|error
  const [meta, setMeta] = useState({});
  const [lines, setLines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) {
      setStatus('idle');
      setMeta({});
      setLines([]);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setStatus('loading');
        const text = await (await fetch(src)).text();
        if (cancelled) return;
        const { meta, lines } = parseLRC(text);
        setMeta(meta);
        setLines(lines);
        setStatus('ready');
      } catch (e) {
        setError(e?.message || 'Failed to load LRC');
        setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [src]);

  return { status, meta, lines, error };
}
