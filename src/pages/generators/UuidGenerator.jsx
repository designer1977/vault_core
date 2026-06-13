import React from 'react';
import { generateUUID } from '../../lib/cryptoEngine';
import { usePageView } from '../../hooks/usePageView';
import GeneratorPageLayout from '../../components/vault/GeneratorPageLayout';

export default function UuidGenerator() {
  usePageView('/uuid-generator');
  return (
    <GeneratorPageLayout
      slug="/uuid-generator"
      title="UUID v4 Generator"
      subtitle="Generate RFC 4122-compliant version 4 UUIDs with 122 bits of cryptographic randomness."
      bits={122}
      score="78%"
      usage="Database IDs, session tokens, idempotency keys"
      generate={generateUUID}
      faq={[
        { q: 'What is UUID v4?', a: 'A Universally Unique Identifier using 122 random bits (6 bits are reserved for version/variant flags per RFC 4122). The probability of collision across 1 billion UUIDs is astronomically small.' },
        { q: 'Is UUID v4 safe for database primary keys?', a: 'Yes, but be aware that random UUIDs can cause index fragmentation in B-tree indexes. Consider UUID v7 (time-ordered) for high-insert-rate tables.' },
        { q: 'What\'s the difference between v1, v4, and v7?', a: 'v1 uses MAC address + timestamp (privacy concern). v4 is fully random. v7 uses a Unix timestamp prefix for sortability — best for modern databases.' },
        { q: 'Can I use this as a session token?', a: 'UUID v4 has 122 bits of entropy which is sufficient for session IDs, but consider opaque tokens (Base64url, 256-bit) for more critical auth tokens.' },
      ]}
    />
  );
}