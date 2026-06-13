import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generatePassword, generateHex, generateBase64, generateUUID, generateAPIKey, generateJWTSecret } from '../../lib/cryptoEngine';

const MODES = [
  { id: 'password', label: 'STRONG PASSWORD', bits: null },
  { id: 'hex256', label: '256-BIT HEX', bits: 256 },
  { id: 'hex128', label: '128-BIT HEX', bits: 128 },
  { id: 'jwt', label: 'JWT SECRET', bits: 256 },
  { id: 'apikey', label: 'API KEY', bits: null },
  { id: 'uuid', label: 'UUID v4', bits: 122 },
];

const SCRAMBLE_CHARS = '0123456789ABCDEFabcdef!@#$%^&*_+-';

function scrambleText(target, progress) {
  return target.split('').map((char, i) => {
    if (i < Math.floor(target.length * progress)) return char;
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }).join('');
}

function generateForMode(mode, length) {
  switch (mode) {
    case 'password': return generatePassword(length, true);
    case 'hex256': return generateHex(256);
    case 'hex128': return generateHex(128);
    case 'jwt': return generateJWTSecret();
    case 'apikey': return generateAPIKey();
    case 'uuid': return generateUUID();
    default: return generatePassword(length, true);
  }
}

export default function HeroGenerator({ onCopy }) {
  const [mode, setMode] = useState('password');
  const [length, setLength] = useState(32);
  const [key, setKey] = useState('');
  const [displayKey, setDisplayKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [entropyLevel, setEntropyLevel] = useState(85);
  const [isEditing, setIsEditing] = useState(false);
  const [editedKey, setEditedKey] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const animFrameRef = useRef(null);
  const keyRef = useRef('');
  const editRef = useRef(null);

  const generate = useCallback((m = mode, l = length) => {
    const newKey = generateForMode(m, l);
    keyRef.current = newKey;
    setKey(newKey);
    setIsEdited(false);
    setIsEditing(false);
    setEditedKey('');
    // Score based on actual cryptographic bit-strength
    // Password: charset ~94 symbols → log2(94^l) bits, map to scale where 32 chars ≈ 85%, 64 chars ≈ 99%
    const passwordBits = l * Math.log2(94);
    const passwordScore = Math.min(99, Math.round(40 + (passwordBits / 210) * 45));
    const bitStrengths = {
      password: passwordScore,
      hex256: 99,
      hex128: 87,
      jwt: 99,
      apikey: 92,
      uuid: 78,
    };
    setEntropyLevel(bitStrengths[m] ?? passwordScore);
    animateDecrypt(newKey);
  }, [mode, length]);

  const animateDecrypt = (target) => {
    setIsAnimating(true);
    let start = null;
    const duration = 600;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayKey(scrambleText(target, progress));
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayKey(target);
        setIsAnimating(false);
      }
    };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    generate(mode, length);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  const handleCopy = () => {
    const val = isEdited ? editedKey : key;
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopied(true);
    onCopy && onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditStart = () => {
    if (isAnimating) return;
    setEditedKey(key);
    setIsEditing(true);
    setTimeout(() => editRef.current?.focus(), 50);
  };

  const handleEditChange = (e) => {
    setEditedKey(e.target.value);
    setIsEdited(e.target.value !== key);
  };

  const handleEditBlur = () => {
    setIsEditing(false);
    if (editedKey === key) setIsEdited(false);
  };

  // Keyboard shortcuts: Space = regenerate, Escape = cancel edit
  useEffect(() => {
    const handler = (e) => {
      if (isEditing) {
        if (e.key === 'Escape') { setIsEditing(false); setIsEdited(false); setEditedKey(''); }
        return;
      }
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        generate(mode, length);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEditing, mode, length, generate]);

  const handleModeChange = (m) => {
    setMode(m);
    generate(m, length);
  };

  const handleLengthChange = (e) => {
    const l = parseInt(e.target.value);
    setLength(l);
    generate(mode, l);
  };

  const getEntropyColor = () => {
    if (entropyLevel >= 80) return '#00FFD1';
    if (entropyLevel >= 60) return '#f59e0b';
    return '#FF3E3E';
  };

  const glowIntensity = Math.floor((key.length / 128) * 100);

  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24">
      {/* Ambient glow behind hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,255,209,${0.02 + (glowIntensity / 5000)}) 0%, transparent 70%)`,
          transition: 'background 0.5s ease',
        }}
      />

      {/* Title */}
      <div className="text-center mb-12 relative z-10">
        <p className="text-xs tracking-[0.4em] uppercase text-zinc-600 mb-4">Cryptographic Utility Engine</p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
          <span className="text-zinc-100">VAULT</span>
          <span style={{ color: '#00FFD1' }}>_</span>
          <span className="text-zinc-100">CORE</span>
        </h1>
        <p className="text-sm text-zinc-600 tracking-widest uppercase">Zero-latency cryptographic key generation</p>
      </div>

      {/* Mode selector */}
      <div className="flex flex-wrap gap-1 mb-8 justify-center relative z-10">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className="px-3 py-1.5 text-xs tracking-widest uppercase transition-all"
            style={{
              border: `0.5px solid ${mode === m.id ? 'rgba(0,255,209,0.6)' : 'rgba(255,255,255,0.06)'}`,
              color: mode === m.id ? '#00FFD1' : '#52525b',
              background: mode === m.id ? 'rgba(0,255,209,0.05)' : 'transparent',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Main key display */}
      <div
        className="relative w-full max-w-5xl mb-8 z-10"
        style={{
          border: `0.5px solid rgba(0,255,209,${0.1 + glowIntensity / 2000})`,
          background: 'rgba(17,17,19,0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: `0 0 ${20 + glowIntensity / 5}px rgba(0,255,209,${0.03 + glowIntensity / 8000})`,
          transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: '#00FFD1' }}></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: '#00FFD1' }}></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: '#00FFD1' }}></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: '#00FFD1' }}></div>

        <div className="p-6 md:p-10">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-600 tracking-widest uppercase">OUTPUT</span>
              <div className="h-px w-12 bg-zinc-800"></div>
              <span className="text-xs tracking-widest" style={{ color: '#00FFD1' }}>
                {MODES.find(m => m.id === mode)?.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-600">{key.length} chars</span>
              <div className="w-px h-3 bg-zinc-800"></div>
              <span className="text-xs text-zinc-600">~{MODES.find(m => m.id === mode)?.bits || length * 6} bits</span>
            </div>
          </div>

          {/* Key output */}
          <div className="relative mb-6 group/edit">
            {isEditing ? (
              <textarea
                ref={editRef}
                value={editedKey}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
                rows={3}
                className="w-full bg-transparent resize-none outline-none break-all leading-relaxed"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: key.length > 48 ? '14px' : key.length > 32 ? '16px' : '20px',
                  color: '#00FFD1',
                  border: '0.5px solid rgba(0,255,209,0.3)',
                  padding: '8px',
                  lineHeight: '1.6',
                  caretColor: '#00FFD1',
                }}
              />
            ) : (
              <div
                className="key-display text-lg md:text-2xl min-h-[3rem] leading-relaxed break-all select-all cursor-text"
                onClick={handleEditStart}
                title="Click to edit"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: key.length > 48 ? '14px' : key.length > 32 ? '16px' : '20px',
                  textShadow: isAnimating ? '0 0 8px rgba(0,255,209,0.3)' : 'none',
                  transition: 'text-shadow 0.3s ease',
                  lineHeight: '1.6',
                  color: isEdited ? '#00FFD1' : undefined,
                }}
              >
                {isEdited ? editedKey : (displayKey || '—')}
              </div>
            )}
            {/* Edit hint */}
            {!isAnimating && !isEditing && (
              <span className="absolute top-0 right-0 text-xs text-zinc-700 opacity-0 group-hover/edit:opacity-100 transition-opacity select-none"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {isEdited ? '● EDITED' : 'CLICK TO EDIT'}
              </span>
            )}
            {isEdited && !isEditing && (
              <button
                onClick={() => { setIsEdited(false); setEditedKey(''); }}
                className="absolute top-0 right-0 text-xs transition-colors"
                style={{ color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}
                onMouseEnter={e => e.target.style.color = '#FF3E3E'}
                onMouseLeave={e => e.target.style.color = '#52525b'}
              >
                ✕ RESET
              </button>
            )}
          </div>

          {/* Entropy bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-600 tracking-widest uppercase">Entropy Quality</span>
              <span className="text-xs font-mono" style={{ color: getEntropyColor() }}>{entropyLevel}%</span>
            </div>
            <div className="h-0.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${entropyLevel}%`,
                  background: `linear-gradient(90deg, #00FFD1, ${getEntropyColor()})`,
                  boxShadow: `0 0 6px ${getEntropyColor()}`,
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            {/* Length slider — only for password mode */}
            {mode === 'password' && (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-zinc-600 tracking-widest uppercase">Entropy Scale</span>
                  <span className="text-xs text-zinc-400 font-mono">{length} chars</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={128}
                  value={length}
                  onChange={handleLengthChange}
                  className="range-slider w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-zinc-700">8</span>
                  <span className="text-xs" style={{ color: 'rgba(0,255,209,0.4)' }}>MAXIMUM ENTROPY</span>
                  <span className="text-xs text-zinc-700">128</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => generate(mode, length)}
                className="px-6 py-3 text-xs tracking-widest uppercase font-semibold transition-all"
                style={{
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  color: '#71717a',
                  background: 'rgba(255,255,255,0.02)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
                onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.color = '#e4e4e7'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = '#71717a'; }}
              >
                REGENERATE
              </button>
              <button
                onClick={handleCopy}
                className="px-8 py-3 text-xs tracking-widest uppercase font-bold transition-all relative overflow-hidden"
                style={{
                  background: copied ? 'rgba(0,255,209,0.15)' : '#00FFD1',
                  color: copied ? '#00FFD1' : '#050505',
                  border: copied ? '0.5px solid #00FFD1' : '0.5px solid transparent',
                  fontFamily: 'JetBrains Mono, monospace',
                  boxShadow: copied ? '0 0 20px rgba(0,255,209,0.3)' : '0 0 20px rgba(0,255,209,0.15)',
                  transition: 'all 0.3s ease',
                }}
              >
                {copied ? '✓ COPIED' : 'COPY KEY'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-zinc-700 tracking-widest z-10 mb-2">
        Generated using <span className="text-zinc-500">window.crypto.getRandomValues()</span> — never transmitted
      </p>
      <p className="text-xs z-10 flex gap-4" style={{ color: '#27272a' }}>
        <span><kbd className="px-1 py-0.5 text-zinc-600" style={{ border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '2px' }}>Space</kbd> regenerate</span>
        <span><kbd className="px-1 py-0.5 text-zinc-600" style={{ border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '2px' }}>Click</kbd> edit key</span>
        <span><kbd className="px-1 py-0.5 text-zinc-600" style={{ border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '2px' }}>Esc</kbd> cancel edit</span>
      </p>
    </section>
  );
}