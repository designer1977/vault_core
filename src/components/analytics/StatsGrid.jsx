import React from 'react';

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="p-4" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
          <p className="text-xs text-zinc-600 tracking-widest uppercase mb-1">{stat.label}</p>
          <p className="text-xl font-bold" style={{ color: '#00FFD1', fontFamily: 'JetBrains Mono, monospace' }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}