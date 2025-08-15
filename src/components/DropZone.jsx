import { useState } from 'react';

export default function DropZone({ onFiles }) {
  const [hover, setHover] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setHover(false);
    const files = Array.from(e.dataTransfer.files || []);
    onFiles?.(files);
  }
  function handleChange(e) {
    const files = Array.from(e.target.files || []);
    onFiles?.(files);
  }
  return (
    <div
      className={`drop ${hover ? 'hover' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={handleDrop}
    >
      <p>Drag & drop your <b>.mp3</b>/<b>.wav</b> and matching <b>.lrc</b> here</p>
      <p>or</p>
      <label className="btn">
        Choose Files
        <input type="file" accept=".mp3,.wav,.lrc" multiple hidden onChange={handleChange} />
      </label>
    </div>
  );
}
