export default function MetaBar({ meta }) {
    const items = [
      meta?.ti && { label: 'Title', value: meta.ti },
      meta?.ar && { label: 'Artist', value: meta.ar },
      meta?.al && { label: 'Album', value: meta.al },
    ].filter(Boolean);
  
    if (!items.length) return null;
  
    return (
      <div className="meta">
        {items.map((it, i) => (
          <div key={i} className="chip">
            <span className="k">{it.label}:</span> <span className="v">{it.value}</span>
          </div>
        ))}
      </div>
    );
  }
  
