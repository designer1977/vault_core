import React from 'react';

export default function EventCard({ name, data, maxVal }) {
  const points = data.length > 0 ? data : [{ date: '—', count: 0 }];
  const chartMax = Math.max(maxVal, 1);

  const svgWidth = 280;
  const svgHeight = 80;
  const padding = { top: 8, bottom: 16, left: 0, right: 0 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const pathPoints = points.map((p, i) => {
    const x = points.length === 1 ? chartW / 2 : (i / (points.length - 1)) * chartW;
    const y = chartH - (p.count / chartMax) * chartH;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-4" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-400 truncate pr-2" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
          {name}
        </span>
        <button className="text-zinc-700 hover:text-zinc-400 transition-colors" style={{ fontSize: '14px' }}>
          ···
        </button>
      </div>

      {/* Chart */}
      <div className="mb-1">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ height: '80px' }}>
          {/* Grid lines */}
          <line x1="0" y1={padding.top} x2={svgWidth} y2={padding.top} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="0" y1={padding.top + chartH / 2} x2={svgWidth} y2={padding.top + chartH / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="0" y1={padding.top + chartH} x2={svgWidth} y2={padding.top + chartH} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

          {/* Area fill */}
          {points.length > 1 && (
            <polygon
              points={`${points.length === 1 ? chartW / 2 : 0},${padding.top + chartH} ${pathPoints} ${chartW},${padding.top + chartH}`}
              fill="rgba(0,255,209,0.06)"
            />
          )}

          {/* Line */}
          <polyline
            fill="none"
            stroke="#00FFD1"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pathPoints}
          />
        </svg>
      </div>

      {/* Date range */}
      <div className="flex justify-between">
        <span className="text-xs" style={{ color: '#3f3f46', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px' }}>
          {points[0]?.date || '—'}
        </span>
        <span className="text-xs" style={{ color: '#3f3f46', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px' }}>
          {points[points.length - 1]?.date || '—'}
        </span>
      </div>
    </div>
  );
}