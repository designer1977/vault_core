import React from 'react';
import { generateAPIKey } from '../../lib/cryptoEngine';
import { usePageView } from '../../hooks/usePageView';
import GeneratorPageLayout from '../../components/vault/GeneratorPageLayout';

export default function ApiKeyGenerator() {
  usePageView('/api-key-generator');
  return (
    <GeneratorPageLayout
      slug="/api-key-generator"
      title="API Key Generator"
      subtitle="Generate a secure, Stripe-style sk_live_ prefixed API key with 192 bits of cryptographic entropy."
      bits={192}
      score="92%"
      usage="Service authentication tokens"
      eventName="api_key"
      generate={generateAPIKey}
      faq={[
        { q: 'Why the sk_live_ prefix?', a: 'Prefixes make API keys identifiable in logs, code reviews, and secret scanners (like GitHub\'s secret scanning). The sk_live_ convention is popularised by Stripe.' },
        { q: 'How should I store API keys server-side?', a: 'Store a hashed version (SHA-256) in your database, not the raw key. Return the raw key to the user only once at creation time.' },
        { q: 'Can I customise the prefix?', a: 'The generator uses the standard sk_live_ prefix. If you need a custom prefix, generate the key and manually replace the prefix portion.' },
        { q: 'How much entropy does this key have?', a: '192 bits from the Base64url-encoded random segment — well above the 128-bit security floor for API keys.' },
      ]}
    />
  );
}