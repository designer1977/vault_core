import React from 'react';

const TECH_SPECS = [
  { key: 'ENGINE', value: 'window.crypto.getRandomValues()' },
  { key: 'PRNG CLASS', value: 'CSPRNG (Cryptographically Secure)' },
  { key: 'AES', value: 'AES-256-GCM via WebCrypto' },
  { key: 'HASHING', value: 'SHA-256 / SHA-512' },
  { key: 'KEY ENCODING', value: 'Hex · Base64url · ASCII95 · UUID RFC4122' },
  { key: 'TRANSMISSION', value: '0 bytes — fully client-side' },
  { key: 'STORAGE', value: 'No persistence · No cookies · No logs' },
  { key: 'PLATFORM', value: 'Browser WebCrypto API (W3C Standard)' },
];

export default function VaultFooter() {
  return (
    <footer
      className="relative z-10 mt-16"
      style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)' }}
    >
      {/* Technical manifest */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs tracking-[0.4em] uppercase text-zinc-600">TECHNICAL MANIFEST</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }}></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 mb-12">
          {TECH_SPECS.map(spec => (
            <div key={spec.key}>
              <p className="text-xs text-zinc-700 uppercase tracking-widest mb-1">{spec.key}</p>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">{spec.value}</p>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 relative">
              <div className="absolute inset-0 border rotate-45" style={{ borderColor: 'rgba(0,255,209,0.4)' }}></div>
            </div>
            <span className="text-xs tracking-[0.2em] uppercase font-semibold" style={{ color: '#00FFD1' }}>
              VAULT_CORE
            </span>
            <span className="text-xs text-zinc-700">·</span>
            <span className="text-xs text-zinc-700">Cryptographic Utility Engine</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-status" style={{ background: '#00FFD1' }}></span>
              <span className="text-xs text-zinc-600 font-mono">All systems local</span>
            </div>
            <span className="text-xs text-zinc-700 font-mono">
              Zero telemetry · Zero tracking · Zero trust required
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}