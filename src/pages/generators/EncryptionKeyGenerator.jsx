import React, { useState } from 'react';
import { generateHex } from '../../lib/cryptoEngine';
import { usePageView } from '../../hooks/usePageView';
import GeneratorPageLayout from '../../components/vault/GeneratorPageLayout';

export default function EncryptionKeyGenerator() {
  usePageView('/encryption-key-generator');
  const [bits, setBits] = useState(256);
  return (
    <GeneratorPageLayout
      slug="/encryption-key-generator"
      title="AES Encryption Key Generator"
      subtitle="Generate a 128-bit or 256-bit hex-encoded encryption key suitable for AES-128-GCM or AES-256-GCM."
      bits={bits}
      score={bits === 256 ? '99%' : '87%'}
      usage={`AES-${bits}-GCM encryption`}
      eventName="encryption_key"
      generate={() => generateHex(bits)}
      extraControls={
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-zinc-600 tracking-widest uppercase">Key Size</span>
          {[128, 256].map(b => (
            <button
              key={b}
              onClick={() => setBits(b)}
              className="px-3 py-1.5 text-xs tracking-wide transition-all"
              style={{
                border: `0.5px solid ${bits === b ? 'rgba(0,255,209,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color: bits === b ? '#00FFD1' : '#52525b',
                background: bits === b ? 'rgba(0,255,209,0.05)' : 'transparent',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {b}-BIT
            </button>
          ))}
        </div>
      }
      faq={[
        { q: 'AES-128 vs AES-256 — which should I use?', a: 'AES-256 is preferred for new systems. AES-128 is still considered secure but offers a smaller security margin. Both are far beyond what\'s currently brute-forceable.' },
        { q: 'How do I use this key in Node.js?', a: 'Use crypto.createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv). The key must be exactly 32 bytes (64 hex chars) for AES-256.' },
        { q: 'Do I need an IV (Initialization Vector) too?', a: 'Yes. Generate a random 12-byte (96-bit) IV for each encryption operation. Never reuse an IV with the same key.' },
        { q: 'Can I use this key for AES-CBC?', a: 'Yes, but prefer GCM mode — it provides authenticated encryption (AEAD), protecting against both confidentiality and integrity attacks.' },
      ]}
    />
  );
}