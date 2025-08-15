import { toSeconds } from './time';

/**
 * Parses LRC text into:
 * - meta: { ti, ar, al, offset }
 * - lines: [{ time: seconds, text }]
 * Supports multiple timestamps per line: [00:10.00][00:12.00] chorus
 */
export function parseLRC(lrcText = '') {
  const meta = {};
  const lines = [];

  const metaRe = /^\[(ti|ar|al|by|offset):\s*(.*?)\s*\]$/i;
  const timeRe = /\[(\d{1,2}):(\d{2}(?:\.\d{1,2})?)\]/g;

  for (const raw of lrcText.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    const metaMatch = line.match(metaRe);
    if (metaMatch) {
      const key = metaMatch[1].toLowerCase();
      const val = metaMatch[2];
      if (key === 'offset') meta.offset = parseInt(val, 10) || 0;
      else meta[key] = val;
      continue;
    }

    // collect all timestamps in the line
    const stamps = [...line.matchAll(timeRe)];
    if (stamps.length === 0) continue;

    // remove timestamps to get the lyric text
    const text = line.replace(timeRe, '').trim();

    for (const s of stamps) {
      const time = toSeconds(s[1], s[2]);
      lines.push({ time, text });
    }
  }

  // sort by time and apply offset (ms => s)
  lines.sort((a, b) => a.time - b.time);
  if (meta.offset) {
    const delta = meta.offset / 1000;
    for (const l of lines) l.time = Math.max(0, l.time + delta);
  }

  return { meta, lines };
}
