import React, { useState } from 'react';

const SECTIONS = [
  {
    id: 'csprng',
    label: 'CSPRNG',
    title: 'Cryptographically Secure Randomness',
    color: '#00FFD1',
    content: [
      {
        heading: 'Source: window.crypto.getRandomValues()',
        body: `All randomness in VaultCore originates from a single source: the browser's built-in Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). This is the same entropy source used by your operating system for TLS keys, disk encryption, and password managers.`,
      },
      {
        heading: 'Why not Math.random()?',
        body: `Math.random() is a deterministic PRNG — given its internal state, every future value is predictable. It is explicitly unsuitable for cryptographic use. window.crypto.getRandomValues() sources entropy from hardware events (mouse movement, keyboard timing, thermal noise, CPU jitter) and is non-deterministic by design.`,
      },
      {
        heading: 'How it works',
        body: `We request raw Uint8Array bytes from the CSPRNG. Each byte is a uniformly random integer from 0–255. These bytes are then mapped to characters, hex values, or UUIDs using rejection sampling to eliminate modulo bias.`,
        code: `const arr = new Uint8Array(32);\nwindow.crypto.getRandomValues(arr);\n// arr is now 32 cryptographically random bytes`,
      },
    ],
  },
  {
    id: 'bias',
    label: 'MODULO BIAS',
    title: 'Rejection Sampling & Modulo Bias',
    color: '#f59e0b',
    content: [
      {
        heading: 'The problem with naive modulo',
        body: `A common mistake is to map a random byte to a character set using byte % charset.length. If 256 is not evenly divisible by the charset size, some characters will appear more frequently than others — this is modulo bias, and it reduces effective entropy.`,
        code: `// BIASED — some chars appear more often\nconst idx = randomByte % 94; // 256 % 94 = 68, so chars 0–67 appear once more`,
      },
      {
        heading: 'VaultCore solution: Rejection Sampling',
        body: `We compute the largest multiple of the charset size that fits in 256. Any byte at or above that threshold is discarded and a new byte is drawn. This ensures every character has exactly equal probability of selection.`,
        code: `const max = 256 - (256 % charset.length);\n// Only accept bytes below max\nif (byte < max) result += charset[byte % charset.length];\n// Otherwise, discard and try again`,
      },
      {
        heading: 'Performance impact',
        body: `On average, fewer than 1% of bytes are rejected. The overhead is negligible — a 64-character password requires ~65 bytes on average, far below any perceptible latency threshold.`,
      },
    ],
  },
  {
    id: 'entropy',
    label: 'ENTROPY SCORE',
    title: 'How the Entropy Score is Calculated',
    color: '#a78bfa',
    content: [
      {
        heading: 'Information-theoretic entropy (Shannon)',
        body: `Entropy is measured in bits. For a random string drawn from a charset of size N with length L, the entropy is simply: H = L × log₂(N). This represents the number of bits required to represent all possible outputs — i.e., how hard it is to brute-force.`,
        code: `// Password: 94-char charset (upper + lower + digits + symbols)\nH = length × log₂(94)\n// 32 chars → 32 × 6.555 = ~209.8 bits of entropy`,
      },
      {
        heading: 'Scoring scale',
        body: `Raw bit values are mapped to a 0–99 display score. For passwords, the scale is anchored so that 32 characters ≈ 85% and 64 characters ≈ 99%. Fixed-length formats like 256-bit Hex and JWT are scored directly from their cryptographic bit-strength.`,
        code: `// Password score\nconst bits = length × Math.log2(94);\nconst score = Math.min(99, Math.round(40 + (bits / 210) × 45));\n\n// Fixed-length formats\nhex256 → 99%  // 256 bits, AES-256 grade\nhex128 → 87%  // 128 bits, AES-128 grade\njwt    → 99%  // 256-bit Base64 encoded\napikey → 92%  // 192-bit Base64 encoded\nuuid   → 78%  // 122 random bits per RFC 4122`,
      },
      {
        heading: 'Why not measure character diversity?',
        body: `An earlier version scored entropy by counting unique characters in the output. This incorrectly penalised formats like 256-bit Hex (which uses only 16 symbols but has perfect 256-bit strength). Bit-strength from the generation process — not the output's character set — is the correct measure.`,
      },
    ],
  },
  {
    id: 'local',
    label: 'LOCAL ONLY',
    title: 'Zero-Transmission Architecture',
    color: '#60a5fa',
    content: [
      {
        heading: 'Client-side execution guarantee',
        body: `Every cryptographic operation in VaultCore runs entirely within your browser's JavaScript runtime. No key material, entropy data, or metadata is sent to any server. The application has no backend, no database, and no telemetry.`,
      },
      {
        heading: 'No persistence by default',
        body: `Generated keys are held in React component state only. They are never written to localStorage, sessionStorage, IndexedDB, or cookies. When you close the tab, all generated material is gone.`,
      },
      {
        heading: 'Verification',
        body: `You can independently verify this by opening your browser's Network tab (DevTools → Network) while generating keys. You will see zero outbound requests. The Security Dashboard section of VaultCore also displays a live network monitor confirming zero transmissions.`,
      },
    ],
  },
];

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative mt-3 mb-1">
      <pre
        className="text-xs leading-relaxed overflow-x-auto p-4"
        style={{
          background: 'rgba(0,0,0,0.4)',
          border: '0.5px solid rgba(255,255,255,0.06)',
          fontFamily: 'JetBrains Mono, monospace',
          color: '#a1a1aa',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {code}
      </pre>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="absolute top-2 right-2 text-xs px-2 py-1 transition-all"
        style={{
          border: '0.5px solid rgba(255,255,255,0.08)',
          color: copied ? '#00FFD1' : '#52525b',
          background: 'rgba(17,17,19,0.8)',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {copied ? '✓' : 'COPY'}
      </button>
    </div>
  );
}

function Section({ section, isActive, onClick }) {
  return (
    <div
      className="mb-2 cursor-pointer transition-all duration-200"
      style={{
        border: `0.5px solid ${isActive ? `${section.color}40` : 'rgba(255,255,255,0.06)'}`,
        background: isActive ? `${section.color}05` : 'rgba(17,17,19,0.6)',
      }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <span
            className="text-xs tracking-widest px-2 py-0.5"
            style={{
              color: section.color,
              border: `0.5px solid ${section.color}30`,
              background: `${section.color}08`,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {section.label}
          </span>
          <h3 className="text-sm font-semibold text-zinc-200 tracking-wide">{section.title}</h3>
        </div>
        <span className="text-zinc-600 text-lg select-none" style={{ color: section.color }}>
          {isActive ? '−' : '+'}
        </span>
      </div>

      {/* Body */}
      {isActive && (
        <div className="px-5 pb-6 space-y-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {section.content.map((block, i) => (
            <div key={i} className="pt-5">
              <h4 className="text-xs text-zinc-400 tracking-widest uppercase mb-2">{block.heading}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">{block.body}</p>
              {block.code && <CodeBlock code={block.code} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SecurityLogic() {
  const [activeSection, setActiveSection] = useState('csprng');

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#050505' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-5 h-5 relative">
              <div className="absolute inset-0 border border-cyan-400/60 rotate-45" style={{ borderColor: 'rgba(0,255,209,0.6)' }}></div>
              <div className="absolute inset-1 border border-cyan-400/30 rotate-45" style={{ borderColor: 'rgba(0,255,209,0.3)' }}></div>
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#00FFD1' }}>VAULT_CORE</span>
          </a>
          <span className="text-xs tracking-widest uppercase text-zinc-600">SECURITY LOGIC</span>
        </div>
      </nav>

      <main className="pt-14 max-w-5xl mx-auto px-6 py-16">
        {/* Page header */}
        <div className="mb-16 pt-8">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-600 mb-4">Technical Documentation</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 tracking-tight mb-4">
            Security<span style={{ color: '#00FFD1' }}>_</span>Logic
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
            A transparent breakdown of how VaultCore generates cryptographic material, eliminates statistical bias, scores entropy, and ensures your keys never leave your browser.
          </p>
          <div className="mt-6 h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(0,255,209,0.2), transparent)' }}></div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { label: 'Entropy Source', value: 'CSPRNG', sub: 'window.crypto' },
            { label: 'Bias Mitigation', value: 'REJECT', sub: 'sampling' },
            { label: 'Transmission', value: '0 BYTES', sub: 'never sent' },
            { label: 'Max Entropy', value: '256 BIT', sub: 'hex / jwt' },
          ].map(stat => (
            <div key={stat.label} className="p-4" style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(17,17,19,0.6)' }}>
              <p className="text-xs text-zinc-600 tracking-widest uppercase mb-1">{stat.label}</p>
              <p className="text-lg font-bold" style={{ color: '#00FFD1', fontFamily: 'JetBrains Mono, monospace' }}>{stat.value}</p>
              <p className="text-xs text-zinc-600">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Accordion sections */}
        <div>
          {SECTIONS.map(section => (
            <Section
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 p-5" style={{ border: '0.5px solid rgba(0,255,209,0.1)', background: 'rgba(0,255,209,0.02)' }}>
          <p className="text-xs text-zinc-500 leading-relaxed">
            <span style={{ color: '#00FFD1' }}>NOTE —</span> This documentation reflects the exact logic implemented in <code className="text-zinc-400" style={{ fontFamily: 'JetBrains Mono' }}>lib/cryptoEngine.js</code> and <code className="text-zinc-400" style={{ fontFamily: 'JetBrains Mono' }}>components/vault/HeroGenerator.jsx</code>. All code snippets are simplified excerpts for clarity.
          </p>
        </div>
      </main>
    </div>
  );
}