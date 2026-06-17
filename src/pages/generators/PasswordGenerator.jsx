import React, { useState } from 'react';
import { generatePassword } from '../../lib/cryptoEngine';
import { usePageView } from '../../hooks/usePageView';
import GeneratorPageLayout from '../../components/vault/GeneratorPageLayout';

export default function PasswordGenerator() {
  usePageView('/password-generator');
  const [length, setLength] = useState(32);
  return (
    <GeneratorPageLayout
      slug="/password-generator"
      title="Strong Password Generator"
      subtitle="Generate a cryptographically random password from a 94-character charset including symbols, with guaranteed character diversity."
      bits={Math.round(length * Math.log2(94))}
      score={`${Math.min(99, Math.round(40 + (length * Math.log2(94)) / 210 * 45))}%`}
      usage="User passwords, service credentials, master keys"
      eventName="password"
      generate={() => generatePassword(length, true)}
      extraControls={
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-600 tracking-widest uppercase">Length</span>
            <span className="text-xs text-zinc-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{length} chars</span>
          </div>
          <input
            type="range" min={8} max={128} value={length}
            onChange={e => setLength(parseInt(e.target.value))}
            className="range-slider w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-zinc-700">8</span>
            <span className="text-xs text-zinc-700">128</span>
          </div>
        </div>
      }
      faq={[
        { q: 'How many characters should my password be?', a: 'At least 16 for general accounts, 32 for service credentials, 64+ for master passwords or encryption passphrases. Every additional character multiplies the search space by ~94.' },
        { q: 'Why include symbols?', a: 'Symbols expand the charset from 62 to 94 characters, increasing per-character entropy from 5.95 to 6.55 bits — a ~10% improvement per character that compounds significantly at longer lengths.' },
        { q: 'Is this safe to use as a master password?', a: 'A 32+ character password from this generator has ~210 bits of entropy — effectively unbreakable. Store it in a password manager; do not memorise generated passwords.' },
        { q: 'How is diversity guaranteed?', a: 'The generator ensures at least one uppercase, one lowercase, one digit, and one symbol are included before filling the remainder randomly. The result is then shuffled using Fisher-Yates.' },
      ]}
    />
  );
}