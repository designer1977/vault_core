import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { RefreshCw } from 'lucide-react';
import StatsGrid from '@/components/analytics/StatsGrid';
import DailyChart from '@/components/analytics/DailyChart';
import EventCard from '@/components/analytics/EventCard';

const SLUGS = [
  '/', '/security-logic',
  '/jwt-secret-generator', '/api-key-generator',
  '/encryption-key-generator', '/uuid-generator', '/password-generator',
];

export default function MetricsDashboard() {
  const { user } = useAuth();
  const [views, setViews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString();

    const allViews = await base44.entities.PageView.list('-created_date', 5000);
    const allEvents = await base44.entities.AnalyticsEvent.list('-created_date', 5000);

    setViews(allViews.filter(v => v.created_date >= since));
    setEvents(allEvents.filter(e => e.created_date >= since));
    setLoading(false);
  };

  useEffect(() => { load(); }, [range]);

  // ---- Compute ----

  const totalViews = views.length;
  const liveVisitors = views.filter(v => {
    const ts = new Date(v.created_date).getTime();
    return Date.now() - ts < 5 * 60 * 1000;
  }).length;

  const bySlug = SLUGS.map(slug => ({
    slug,
    count: views.filter(v => v.slug === slug).length,
  })).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...bySlug.map(s => s.count), 1);

  // Daily breakdown for last 14 days
  const dailyMap = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dailyMap[d.toISOString().slice(0, 10)] = 0;
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

  // Group events by name
  const eventMap = {};
  const eventNames = [...new Set(events.map(e => e.name))];
  eventNames.forEach(name => { eventMap[name] = []; });
  events.forEach(e => { eventMap[e.name]?.push(e); });

  // Build per-event daily series
  const eventSeries = useMemo(() => {
    const days = [];
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      days.push(d.toISOString().slice(0, 10));
    }
    return eventNames.map(name => {
      const data = days.map(day => ({
        date: day,
        count: events.filter(e => e.name === name && e.created_date?.slice(0, 10) === day).length,
      }));
      return { name, data, total: events.filter(e => e.name === name).length };
    }).sort((a, b) => b.total - a.total);
  }, [events, range]);

  const eventMaxVal = Math.max(...eventSeries.flatMap(s => s.data.map(d => d.count)), 1);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050505' }}>
        <div className="text-center p-8" style={{ border: '0.5px solid rgba(255,62,62,0.3)', background: 'rgba(255,62,62,0.04)' }}>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#FF3E3E' }}>Access Denied</p>
          <p className="text-sm text-zinc-500">Admin access required.</p>
          <a href="/" className="text-xs mt-4 inline-block tracking-widest uppercase" style={{ color: 'rgba(0,255,209,0.5)' }}>← Back to VaultCore</a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#050505' }}>
      {/* Nav */}
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

      <main className="pt-14 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 pt-4 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-zinc-600 mb-2">Analytics</p>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-zinc-100 tracking-tight">Visitor Metrics</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Live visitors */}
            <div className="flex items-center gap-2 mr-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }}></span>
              <span className="text-xs text-zinc-500">{liveVisitors} · Live visitors</span>
            </div>
            {/* Range buttons */}
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
            {/* Refresh */}
            <button onClick={load}
              className="px-2 py-1.5 transition-colors"
              style={{ border: '0.5px solid rgba(255,255,255,0.08)', color: '#52525b' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,255,209,0.2)', borderTopColor: '#00FFD1' }}></div>
          </div>
        ) : (
          <>
            {/* KPI row */}
            <StatsGrid stats={[
              { label: 'Total Views', value: totalViews.toLocaleString() },
              { label: 'Unique Pages', value: bySlug.filter(s => s.count > 0).length },
              { label: 'Events Tracked', value: eventNames.length },
              { label: 'Referrers', value: topRefs.length },
            ]} />

            {/* Daily chart */}
            <DailyChart daily={daily} maxDaily={maxDaily} />

            {/* Traffic Overview Section */}
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#00FFD1' }}>Traffic Overview</p>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
              <span className="text-xs text-zinc-700 tracking-widest uppercase">Sales Overview</span>
            </div>

            {/* Event cards grid */}
            {eventSeries.length === 0 ? (
              <div className="p-8 text-center" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
                <p className="text-sm text-zinc-500">No events tracked yet. Events appear automatically as users interact with VaultCore — copy keys, switch modes, download keys, and more.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {eventSeries.map(es => (
                  <EventCard key={es.name} name={es.name} data={es.data} maxVal={eventMaxVal} />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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