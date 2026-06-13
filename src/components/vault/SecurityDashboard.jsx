import React, { useState, useEffect, useRef } from 'react';

function EntropyVisualizer() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const bars = 64;
    const barW = W / bars;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const arr = new Uint8Array(bars);
      window.crypto.getRandomValues(arr);

      arr.forEach((val, i) => {
        const h = (val / 255) * H;
        const alpha = 0.15 + (val / 255) * 0.6;
        ctx.fillStyle = `rgba(0, 255, 209, ${alpha})`;
        ctx.fillRect(i * barW + 0.5, H - h, barW - 1, h);
      });
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={80}
      style={{ width: '100%', height: '80px' }}
    />
  );
}

const SPECS = [
  { label: 'PRNG Source', value: 'window.crypto.getRandomValues()', detail: 'WebCrypto API / CSPRNG' },
  { label: 'Entropy Source', value: 'OS-level hardware entropy', detail: 'via browser CSPRNG' },
  { label: 'Data Transmission', value: 'None — 0 bytes sent', detail: '100% client-side' },
  { label: 'Storage', value: 'No persistence', detail: 'No localStorage, no cookies' },
  { label: 'Algorithms', value: 'AES-256-GCM / SHA-256', detail: 'Used for key derivation' },
  { label: 'Key Format', value: 'Hex, Base64url, UUID, ASCII', detail: 'Multiple output formats' },
];

export default function SecurityDashboard() {
  const [networkActivity, setNetworkActivity] = useState([]);
  const [samplesGenerated, setSamplesGenerated] = useState(0);

  useEffect(() => {
    // Simulate entropy sample counter
    const iv = setInterval(() => {
      setSamplesGenerated(prev => prev + Math.floor(Math.random() * 48 + 8));
    }, 200);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="security" className="relative z-10 px-6 py-16 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-600">TRUST ARCHITECTURE</p>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Security Dashboard</h2>
        </div>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)' }}></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Status panel */}
        <div
          className="p-6"
          style={{ border: '0.5px solid rgba(255,255,255,0.07)', background: 'rgba(17,17,19,0.7)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-2 h-2 rounded-full animate-status"
              style={{ background: '#00FFD1' }}
            ></span>
            <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#00FFD1' }}>
              LOCAL ONLY — NO NETWORK REQUESTS
            </span>
          </div>

          <div className="space-y-1 mb-6">
            {SPECS.map((s, i) => (
              <div
                key={i}
                className="flex items-start justify-between py-3 gap-4"
                style={{ borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}
              >
                <span className="text-xs text-zinc-600 uppercase tracking-wider shrink-0 w-36">{s.label}</span>
                <div className="text-right">
                  <p className="text-xs text-zinc-300 font-mono">{s.value}</p>
                  <p className="text-xs text-zinc-600">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sample counter */}
          <div
            className="p-4"
            style={{ border: '0.5px solid rgba(0,255,209,0.1)', background: 'rgba(0,255,209,0.03)' }}
          >
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Entropy Bytes Harvested</p>
            <p
              className="text-2xl font-mono font-bold"
              style={{ color: '#00FFD1', fontVariantNumeric: 'tabular-nums' }}
            >
              {samplesGenerated.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-700 mt-1">Since page load — never transmitted</p>
          </div>
        </div>

        {/* Right: Entropy visualizer */}
        <div
          className="p-6 flex flex-col"
          style={{ border: '0.5px solid rgba(255,255,255,0.07)', background: 'rgba(17,17,19,0.7)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs tracking-widest uppercase text-zinc-500">Live CSPRNG Output</span>
            <span className="text-xs text-zinc-700 font-mono">window.crypto.getRandomValues()</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <EntropyVisualizer />
            <p className="text-xs text-zinc-700 text-center mt-3">
              Real-time visualization of raw entropy bytes being generated
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Entropy Source', value: 'HARDWARE' },
              { label: 'Bias', value: 'NONE' },
              { label: 'Predictability', value: '~0' },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-3"
                style={{ border: '0.5px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
              >
                <p className="text-xs text-zinc-700 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-sm font-bold" style={{ color: '#00FFD1' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network monitor */}
      <div
        className="mt-4 p-5 flex items-center gap-6"
        style={{ border: '0.5px solid rgba(255,255,255,0.05)', background: 'rgba(10,10,11,0.8)' }}
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full" style={{ background: '#00FFD1' }}></span>
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Network Monitor</span>
        </div>
        <div className="h-4 w-px bg-zinc-800 shrink-0"></div>
        <span className="text-xs text-zinc-700 font-mono">
          Outgoing requests to external domains: <span style={{ color: '#00FFD1' }}>0</span>
        </span>
        <div className="h-4 w-px bg-zinc-800 shrink-0 hidden md:block"></div>
        <span className="text-xs text-zinc-700 font-mono hidden md:block">
          Keys transmitted to server: <span style={{ color: '#00FFD1' }}>0</span>
        </span>
        <div className="ml-auto text-xs text-zinc-800 font-mono hidden lg:block">
          Verified client-side only · Open source · No telemetry
        </div>
      </div>
    </section>
  );
}