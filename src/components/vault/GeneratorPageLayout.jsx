import React, { useState, useEffect, useRef } from 'react';
import { useTrackEvent } from '../../hooks/useTrackEvent';

const SCRAMBLE = '0123456789ABCDEFabcdef!@#$%^&*_+-';

function scramble(target, progress) {
  return target.split('').map((c, i) =>
    i < Math.floor(target.length * progress) ? c : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
  ).join('');
}

export default function GeneratorPageLayout({ title, subtitle, bits, score, usage, generate, extraControls, faq, eventName }) {
  const track = useTrackEvent();
  const [key, setKey] = useState('');
  const [display, setDisplay] = useState('');
  const [copied, setCopied] = useState(false);
  const frameRef = useRef(null);

  const eventLabel = eventName || 'generator_key';

  const runGenerate = () => {
    const k = generate();
    setKey(k);
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 500, 1);
      setDisplay(scramble(k, p));
      if (p < 1) frameRef.current = requestAnimationFrame(animate);
      else setDisplay(k);
    };
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => { runGenerate(); return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }; }, []);

  const handleCopy = () => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    track(`${eventLabel}_copied`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#050505' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-5 h-5 relative">
              <div className="absolute inset-0 border rotate-45" style={{ borderColor: 'rgba(0,255,209,0.6)' }}></div>
              <div className="absolute inset-1 border rotate-45" style={{ borderColor: 'rgba(0,255,209,0.3)' }}></div>
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#00FFD1' }}>VAULT_CORE</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs tracking-widest uppercase text-zinc-600 hover:text-zinc-300 transition-colors">← All Tools</a>
          </div>
        </div>
      </nav>

      <main className="pt-14 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 pt-8">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-600 mb-3">Cryptographic Utility</p>
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight mb-4">{title}</h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">{subtitle}</p>
          <div className="mt-6 h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(0,255,209,0.2), transparent)' }}></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Entropy', value: `${bits} bits` },
            { label: 'Score', value: score },
            { label: 'Use Case', value: usage },
          ].map(s => (
            <div key={s.label} className="p-4" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
              <p className="text-xs text-zinc-600 tracking-widest uppercase mb-1">{s.label}</p>
              <p className="text-sm font-bold" style={{ color: '#00FFD1', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Generator box */}
        <div className="mb-12" style={{ border: '0.5px solid rgba(0,255,209,0.2)', background: 'rgba(17,17,19,0.8)' }}>
          {/* Corner accents */}
          {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c, i) => (
            <div key={i} className={`absolute w-3 h-3 ${c}`} style={{ borderColor: '#00FFD1' }}></div>
          ))}
          <div className="p-6 md:p-8 relative">
            {extraControls}
            <div
              className="text-sm md:text-base break-all leading-relaxed mb-6 select-all min-h-[3rem]"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: '#a1a1aa', lineHeight: '1.8' }}
            >
              {display || '—'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { track(`${eventLabel}_regenerated`); runGenerate(); }}
                className="px-5 py-2.5 text-xs tracking-widest uppercase transition-all"
                style={{ border: '0.5px solid rgba(255,255,255,0.1)', color: '#71717a', background: 'rgba(255,255,255,0.02)', fontFamily: 'JetBrains Mono, monospace' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#e4e4e7'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                REGENERATE
              </button>
              <button
                onClick={handleCopy}
                className="px-8 py-2.5 text-xs tracking-widest uppercase font-bold transition-all"
                style={{
                  background: copied ? 'rgba(0,255,209,0.15)' : '#00FFD1',
                  color: copied ? '#00FFD1' : '#050505',
                  border: copied ? '0.5px solid #00FFD1' : '0.5px solid transparent',
                  fontFamily: 'JetBrains Mono, monospace',
                  boxShadow: '0 0 20px rgba(0,255,209,0.15)',
                }}
              >
                {copied ? '✓ COPIED' : 'COPY KEY'}
              </button>
            </div>
            <p className="mt-4 text-xs text-zinc-700">Generated via <span className="text-zinc-500">window.crypto.getRandomValues()</span> — never transmitted</p>
          </div>
        </div>

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-zinc-600 mb-2">FAQ</p>
            <h2 className="text-xl font-bold text-zinc-100 mb-6">Common Questions</h2>
            <div className="space-y-3">
              {faq.map((item, i) => (
                <div key={i} className="p-5" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
                  <p className="text-sm font-semibold text-zinc-200 mb-2">{item.q}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8" style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          <a href="/" className="text-xs tracking-widest uppercase transition-colors" style={{ color: 'rgba(0,255,209,0.5)' }}
            onMouseEnter={e => e.target.style.color = '#00FFD1'}
            onMouseLeave={e => e.target.style.color = 'rgba(0,255,209,0.5)'}
          >
            ← Back to all generators
          </a>
        </div>
      </main>
    </div>
  );
}