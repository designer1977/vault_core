import React from 'react';

export default function DailyChart({ daily, maxDaily }) {
  return (
    <div className="p-6 mb-8" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
      <p className="text-xs tracking-widest uppercase text-zinc-600 mb-6">Daily Page Views — Last 14 Days</p>
      <div className="flex items-end gap-1 h-32">
        {daily.map(([date, count]) => (
          <div key={date} className="flex-1 flex flex-col items-center gap-1 relative group">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs px-2 py-1 pointer-events-none z-10 whitespace-nowrap"
              style={{ background: '#111113', border: '0.5px solid rgba(0,255,209,0.3)', color: '#00FFD1', fontFamily: 'JetBrains Mono, monospace' }}>
              {count} views
            </div>
            <div
              className="w-full transition-all rounded-sm"
              style={{
                height: `${Math.max((count / maxDaily) * 100, 2)}%`,
                background: count > 0 ? 'rgba(0,255,209,0.4)' : 'rgba(255,255,255,0.04)',
                minHeight: '2px',
              }}
            />
            <span className="text-xs text-zinc-700 hidden md:block" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px' }}>
              {date.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}