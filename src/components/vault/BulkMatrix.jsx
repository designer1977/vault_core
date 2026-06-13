import React, { useState, useRef, useEffect } from 'react';
import { generateBulk } from '../../lib/cryptoEngine';

const BULK_TYPES = [
  { id: 'password', label: 'Passwords' },
  { id: 'hex256', label: '256-bit Hex' },
  { id: 'hex128', label: '128-bit Hex' },
  { id: 'uuid', label: 'UUIDs' },
  { id: 'apikey', label: 'API Keys' },
  { id: 'jwt', label: 'JWT Secrets' },
  { id: 'alphanumeric', label: 'Alphanumeric' },
  { id: 'mnemonic', label: 'Mnemonics' },
];

export default function BulkMatrix({ onCopy }) {
  const [type, setType] = useState('password');
  const [count, setCount] = useState(20);
  const [keys, setKeys] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const intervalRef = useRef(null);

  const runGenerate = () => {
    setGenerating(true);
    setVisibleCount(0);
    const newKeys = generateBulk(type, count);
    setKeys(newKeys);

    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= newKeys.length) {
        clearInterval(intervalRef.current);
        setGenerating(false);
      }
    }, 30);
  };

  useEffect(() => {
    runGenerate();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const copyAll = () => {
    navigator.clipboard.writeText(keys.join('\n'));
    setCopiedAll(true);
    onCopy && onCopy();
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyOne = (idx) => {
    navigator.clipboard.writeText(keys[idx]);
    setCopiedIndex(idx);
    onCopy && onCopy();
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  const downloadEnv = () => {
    const content = keys.map((k, i) => `KEY_${String(i + 1).padStart(3, '0')}=${k}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault_core_${type}_${Date.now()}.env`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const content = ['type,key,index', ...keys.map((k, i) => `${type},${k},${i + 1}`)].join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault_core_${type}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="bulk" className="relative z-10 px-6 py-16 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-600">BULK GENERATION</p>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Batch Key Matrix</h2>
        </div>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)' }}></div>
      </div>

      {/* Controls bar */}
      <div
        className="p-5 mb-4 flex flex-wrap gap-4 items-center"
        style={{ border: '0.5px solid rgba(255,255,255,0.07)', background: 'rgba(17,17,19,0.8)' }}
      >
        {/* Type select */}
        <div className="flex flex-wrap gap-1">
          {BULK_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className="px-3 py-1.5 text-xs tracking-wide transition-all"
              style={{
                border: `0.5px solid ${type === t.id ? 'rgba(0,255,209,0.5)' : 'rgba(255,255,255,0.06)'}`,
                color: type === t.id ? '#00FFD1' : '#52525b',
                background: type === t.id ? 'rgba(0,255,209,0.05)' : 'transparent',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-zinc-600 uppercase tracking-widest">Count</span>
          {[10, 20, 50, 100].map(n => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className="text-xs px-2 py-1 transition-all"
              style={{
                color: count === n ? '#00FFD1' : '#52525b',
                border: `0.5px solid ${count === n ? 'rgba(0,255,209,0.4)' : 'rgba(255,255,255,0.05)'}`,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Generate button */}
        <button
          onClick={runGenerate}
          disabled={generating}
          className="px-5 py-2 text-xs tracking-widest uppercase font-bold transition-all"
          style={{
            background: '#00FFD1',
            color: '#050505',
            opacity: generating ? 0.6 : 1,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {generating ? 'GENERATING...' : 'GENERATE'}
        </button>
      </div>

      {/* Keys list */}
      <div
        className="relative"
        style={{ border: '0.5px solid rgba(255,255,255,0.07)', background: 'rgba(17,17,19,0.6)' }}
      >
        {/* Terminal header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#FF3E3E' }}></div>
            <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }}></div>
            <div className="w-2 h-2 rounded-full" style={{ background: '#00FFD1' }}></div>
            <span className="text-xs text-zinc-600 ml-3 font-mono">vault_core — batch output — {count} keys</span>
          </div>
          <div className="flex items-center gap-2">
            {generating && (
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-status"
                  style={{ background: '#00FFD1' }}
                />
                <span className="text-xs text-zinc-600 font-mono">streaming {visibleCount}/{keys.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="max-h-96 overflow-y-auto">
          {keys.slice(0, visibleCount).map((k, i) => (
            <div
              key={i}
              className="flex items-center px-5 py-2.5 group cursor-pointer animate-slide-up"
              style={{
                borderBottom: '0.5px solid rgba(255,255,255,0.03)',
                background: copiedIndex === i ? 'rgba(0,255,209,0.04)' : 'transparent',
                transition: 'background 0.2s',
              }}
              onClick={() => copyOne(i)}
            >
              <span className="text-xs text-zinc-700 w-10 shrink-0 font-mono select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="text-xs font-mono flex-1 break-all mr-4"
                style={{
                  color: copiedIndex === i ? '#00FFD1' : '#71717a',
                  transition: 'color 0.2s',
                }}
              >
                {k}
              </span>
              <span
                className="text-xs font-mono shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: '#00FFD1' }}
              >
                {copiedIndex === i ? '✓' : 'COPY'}
              </span>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div
          className="flex flex-wrap items-center gap-3 px-5 py-4"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)', background: 'rgba(10,10,11,0.5)' }}
        >
          <button
            onClick={copyAll}
            className="px-5 py-2 text-xs tracking-widest uppercase font-semibold transition-all"
            style={{
              border: `0.5px solid ${copiedAll ? '#00FFD1' : 'rgba(0,255,209,0.3)'}`,
              color: copiedAll ? '#00FFD1' : '#52525b',
              background: copiedAll ? 'rgba(0,255,209,0.06)' : 'transparent',
              fontFamily: 'JetBrains Mono, monospace',
              boxShadow: copiedAll ? '0 0 12px rgba(0,255,209,0.15)' : 'none',
            }}
          >
            {copiedAll ? '✓ ALL COPIED' : 'COPY ALL'}
          </button>
          <button
            onClick={downloadEnv}
            className="px-5 py-2 text-xs tracking-widest uppercase transition-all"
            style={{
              border: '0.5px solid rgba(255,255,255,0.07)',
              color: '#52525b',
              fontFamily: 'JetBrains Mono, monospace',
            }}
            onMouseEnter={e => { e.target.style.color = '#d4d4d8'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.target.style.color = '#52525b'; e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
          >
            DOWNLOAD .ENV
          </button>
          <button
            onClick={downloadCSV}
            className="px-5 py-2 text-xs tracking-widest uppercase transition-all"
            style={{
              border: '0.5px solid rgba(255,255,255,0.07)',
              color: '#52525b',
              fontFamily: 'JetBrains Mono, monospace',
            }}
            onMouseEnter={e => { e.target.style.color = '#d4d4d8'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.target.style.color = '#52525b'; e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
          >
            DOWNLOAD .CSV
          </button>
          <span className="ml-auto text-xs text-zinc-700 font-mono">{keys.length} keys · {(keys.join('').length / 1024).toFixed(1)}KB</span>
        </div>
      </div>
    </section>
  );
}