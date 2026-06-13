import React, { useState, useCallback } from 'react';
import {
  generatePassword, generateHex, generateBase64, generateUUID,
  generateAPIKey, generateJWTSecret, generateAlphanumeric, generateMnemonic
} from '../../lib/cryptoEngine';

const GENERATORS = [
  {
    id: 'hex128', label: '128-BIT HEX', category: 'ENCRYPTION',
    description: 'AES-128 compatible encryption key',
    fn: () => generateHex(128),
    bits: 128,
    color: '#00FFD1',
  },
  {
    id: 'hex256', label: '256-BIT HEX', category: 'ENCRYPTION',
    description: 'AES-256 / SHA-256 compatible key',
    fn: () => generateHex(256),
    bits: 256,
    color: '#00FFD1',
  },
  {
    id: 'uuid', label: 'UUID v4', category: 'IDENTIFIER',
    description: 'RFC 4122 compliant unique identifier',
    fn: () => generateUUID(),
    bits: 122,
    color: '#a78bfa',
  },
  {
    id: 'apikey', label: 'API KEY', category: 'AUTH TOKEN',
    description: 'Stripe-style prefixed API token',
    fn: () => generateAPIKey(),
    bits: 192,
    color: '#60a5fa',
  },
  {
    id: 'jwt', label: 'JWT SECRET', category: 'SIGNING KEY',
    description: 'HS256/HS512 JWT signing secret',
    fn: () => generateJWTSecret(),
    bits: 256,
    color: '#f59e0b',
  },
  {
    id: 'alphanumeric', label: 'ALPHANUMERIC', category: 'SAFE STRING',
    description: 'URL-safe alphanumeric string',
    fn: () => generateAlphanumeric(24),
    bits: 143,
    color: '#34d399',
  },
  {
    id: 'password16', label: '16-CHAR PASSWORD', category: 'PASSWORD',
    description: 'High-entropy 16 character password',
    fn: () => generatePassword(16, true),
    bits: 103,
    color: '#f97316',
  },
  {
    id: 'mnemonic', label: 'MNEMONIC PHRASE', category: 'PASSPHRASE',
    description: 'Human-readable 4-word passphrase',
    fn: () => generateMnemonic(4),
    bits: 39,
    color: '#e879f9',
  },
];

function GeneratorCard({ gen, onCopy }) {
  const [value, setValue] = useState(() => gen.fn());
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const regenerate = useCallback((e) => {
    e.stopPropagation();
    setValue(gen.fn());
  }, [gen]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    onCopy && onCopy();
    setTimeout(() => setCopied(false), 1500);
  }, [value, onCopy]);

  return (
    <div
      className="grid-module relative p-5 cursor-pointer transition-all duration-200"
      style={{
        border: `0.5px solid ${hovered ? `${gen.color}30` : 'rgba(255,255,255,0.07)'}`,
        background: hovered ? 'rgba(17,17,19,0.9)' : 'rgba(17,17,19,0.6)',
        backdropFilter: 'blur(8px)',
        boxShadow: hovered ? `0 0 24px ${gen.color}08` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCopy}
    >
      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs tracking-widest uppercase px-2 py-0.5"
          style={{
            color: gen.color,
            border: `0.5px solid ${gen.color}30`,
            background: `${gen.color}08`,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {gen.category}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-700">{gen.bits}b</span>
          <button
            onClick={regenerate}
            className="text-zinc-700 hover:text-zinc-400 transition-colors"
            title="Regenerate"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Label */}
      <h3 className="text-sm font-semibold text-zinc-300 mb-1 tracking-wide">{gen.label}</h3>
      <p className="text-xs text-zinc-600 mb-4">{gen.description}</p>

      {/* Value */}
      <div
        className="text-xs font-mono break-all leading-relaxed mb-4"
        style={{
          color: hovered ? '#d4d4d8' : '#52525b',
          fontFamily: 'JetBrains Mono, monospace',
          maxHeight: '4em',
          overflow: 'hidden',
          transition: 'color 0.2s',
        }}
      >
        {value}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div
          className="h-px flex-1 mr-4 transition-all duration-300"
          style={{ background: hovered ? `${gen.color}30` : 'rgba(255,255,255,0.04)' }}
        />
        <span
          className="text-xs tracking-widest uppercase font-semibold transition-all"
          style={{
            color: copied ? '#00FFD1' : (hovered ? gen.color : '#3f3f46'),
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {copied ? '✓ COPIED' : 'CLICK TO COPY'}
        </span>
      </div>
    </div>
  );
}

export default function GeneratorGrid({ onCopy }) {
  return (
    <section id="generators" className="relative z-10 px-6 py-16 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="flex flex-col gap-1">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-600">GENERATOR MATRIX</p>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Cryptographic Toolkit</h2>
        </div>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)' }}></div>
        <span className="text-xs text-zinc-700 tracking-widest uppercase">{GENERATORS.length} tools</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {GENERATORS.map(gen => (
          <GeneratorCard key={gen.id} gen={gen} onCopy={onCopy} />
        ))}
      </div>
    </section>
  );
}