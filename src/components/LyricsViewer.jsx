import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

export default function LyricsViewer({ lines = [], currentTime = 0, onSeek }) {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  // determine active line
  const index = useMemo(() => {
    if (!lines.length) return -1;
    // binary search since lines are sorted
    let lo = 0, hi = lines.length - 1, ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (lines[mid].time <= currentTime) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
  }, [lines, currentTime]);

  // smooth auto-scroll when active line changes
  useEffect(() => {
    if (index === -1 || index === activeIdx) return;
    setActiveIdx(index);
    const el = containerRef.current?.querySelector(`[data-i="${index}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [index, activeIdx]);

  return (
    <div ref={containerRef} className="lyrics">
      {!lines.length && <div className="muted">No lyrics</div>}
      {lines.map((l, i) => (
        <div
          key={`${i}-${l.time}`}
          data-i={i}
          className={clsx('line', i === index && 'active')}
          onClick={() => onSeek?.(l.time)}
          title="Click to seek"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSeek?.(l.time)}
        >
          {l.text || '…'}
        </div>
      ))}
    </div>
  );
}
