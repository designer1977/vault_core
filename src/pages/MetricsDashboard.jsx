import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const SLUGS = [
  '/', '/security-logic',
  '/jwt-secret-generator', '/api-key-generator',
  '/encryption-key-generator', '/uuid-generator', '/password-generator',
];

export default function MetricsDashboard() {
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString();
      const all = await base44.entities.PageView.list('-created_date', 5000);
      const filtered = all.filter(v => v.created_date >= since);
      setViews(filtered);
      setLoading(false);
    };
    load();
  }, [range]);

  const totalViews = views.length;

  const bySlug = SLUGS.map(slug => ({
    slug,
    count: views.filter(v => v.slug === slug).length,
  })).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...bySlug.map(s => s.count), 1);

  // Daily breakdown for last 14 days
  const dailyMap = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = 0;
  }
  views.forEach(v => {
    const key = v.created_date?.slice(0, 10);
    if (key && dailyMap[key] !== undefined) dailyMap[key]++;
  });
  const daily = Object.entries(dailyMap);
  const maxDaily = Math.max(...daily.map(([, c]) => c), 1);

  // Top referrers
  const refMap = {};
  views.forEach(v => { if (v.referrer) refMap[v.referrer] = (refMap[v.referrer] || 0) + 1; });
  const topRefs = Object.entries(refMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#050505' }}>
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-5 h-5 relative">
              <div className="absolute inset-0 border rotate-45" style={{ borderColor: 'rgba(0,255,209,0.6)' }}></div>
              <div className="absolute inset-1 border rotate-45" style={{ borderColor: 'rgba(0,255,209,0.3)' }}></div>
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#00FFD1' }}>VAULT_CORE</span>
          </a>
          <span className="text-xs tracking-widest uppercase text-zinc-600">METRICS</span>
        </div>
      </nav>

      <main className="pt-14 max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 pt-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-zinc-600 mb-3">Analytics</p>
            <h1 className="text-4xl font-bold text-zinc-100 tracking-tight">Visitor Metrics</h1>
          </div>
          <div className="flex gap-2">
            {[7, 30, 90].map(d => (
              <button key={d} onClick={() => setRange(d)}
                className="px-3 py-1.5 text-xs tracking-widest uppercase transition-all"
                style={{
                  border: `0.5px solid ${range === d ? 'rgba(0,255,209,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: range === d ? '#00FFD1' : '#52525b',
                  background: range === d ? 'rgba(0,255,209,0.05)' : 'transparent',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,255,209,0.2)', borderTopColor: '#00FFD1' }}></div>
          </div>
        ) : (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {[
                { label: 'Total Views', value: totalViews.toLocaleString() },
                { label: 'Unique Pages', value: bySlug.filter(s => s.count > 0).length },
                { label: 'Top Page', value: bySlug[0]?.slug?.replace('/', '') || '—' },
                { label: 'Referrers', value: topRefs.length },
              ].map(k => (
                <div key={k.label} className="p-4" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
                  <p className="text-xs text-zinc-600 tracking-widest uppercase mb-1">{k.label}</p>
                  <p className="text-xl font-bold" style={{ color: '#00FFD1', fontFamily: 'JetBrains Mono, monospace' }}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* Daily chart */}
            <div className="mb-10 p-6" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
              <p className="text-xs tracking-widest uppercase text-zinc-600 mb-6">Daily Views — Last 14 Days</p>
              <div className="flex items-end gap-1 h-32">
                {daily.map(([date, count]) => (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className="w-full transition-all"
                      style={{
                        height: `${Math.max((count / maxDaily) * 100, 2)}%`,
                        background: count > 0 ? 'rgba(0,255,209,0.4)' : 'rgba(255,255,255,0.04)',
                        minHeight: '2px',
                      }}
                    />
                    <span className="text-xs text-zinc-700 hidden md:block" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px' }}>
                      {date.slice(5)}
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block text-xs px-2 py-1 pointer-events-none z-10"
                      style={{ background: '#111113', border: '0.5px solid rgba(0,255,209,0.3)', color: '#00FFD1', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
                      {count} views
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Per-page breakdown */}
              <div className="p-6" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
                <p className="text-xs tracking-widest uppercase text-zinc-600 mb-6">Views by Page</p>
                <div className="space-y-3">
                  {bySlug.map(({ slug, count }) => (
                    <div key={slug}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-zinc-400 truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{slug}</span>
                        <span className="text-xs ml-4 shrink-0" style={{ color: '#00FFD1', fontFamily: 'JetBrains Mono, monospace' }}>{count}</span>
                      </div>
                      <div className="h-0.5 w-full rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="h-full rounded transition-all" style={{ width: `${(count / maxCount) * 100}%`, background: 'rgba(0,255,209,0.5)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top referrers */}
              <div className="p-6" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
                <p className="text-xs tracking-widest uppercase text-zinc-600 mb-6">Top Referrers</p>
                {topRefs.length === 0 ? (
                  <p className="text-xs text-zinc-700">No referrer data yet</p>
                ) : (
                  <div className="space-y-3">
                    {topRefs.map(([ref, count]) => (
                      <div key={ref} className="flex justify-between">
                        <span className="text-xs text-zinc-400 truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{ref || 'direct'}</span>
                        <span className="text-xs ml-4" style={{ color: '#00FFD1', fontFamily: 'JetBrains Mono, monospace' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-8 pt-6" style={{ borderTop: '0.5px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-xs text-zinc-700 leading-relaxed">
                    Use this data when pitching sponsors — total views, top pages, and traffic sources are what companies like Infisical and Doppler will ask for.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}