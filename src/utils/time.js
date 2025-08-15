export function toSeconds(minStr, secStr) {
    const m = parseInt(minStr, 10) || 0;
    const s = parseFloat(secStr) || 0;
    return m * 60 + s;
  }
  
  export function formatTime(t = 0) {
    const minutes = Math.floor(t / 60).toString().padStart(2, '0');
    const seconds = Math.floor(t % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  