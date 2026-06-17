import React, { useState, useEffect, useRef } from 'react';
import { generateJWTSecret } from '../../lib/cryptoEngine';
import { usePageView } from '../../hooks/usePageView';
import GeneratorPageLayout from '../../components/vault/GeneratorPageLayout';

export default function JwtSecretGenerator() {
  usePageView('/jwt-secret-generator');
  return (
    <GeneratorPageLayout
      slug="/jwt-secret-generator"
      title="JWT Secret Generator"
      subtitle="Generate a cryptographically secure 256-bit Base64url-encoded secret for signing JSON Web Tokens (HS256 / HS512)."
      bits={256}
      score="99%"
      usage="HS256 / HS512 JWT signing"
      eventName="jwt_secret"
      generate={generateJWTSecret}
      faq={[
        { q: 'What algorithm should I use with this secret?', a: 'HS256 (HMAC-SHA256) or HS512 (HMAC-SHA512). Both use a symmetric shared secret — this generator produces a 256-bit key, which is appropriate for both.' },
        { q: 'How long should a JWT secret be?', a: 'At least 256 bits (32 bytes). Shorter secrets are vulnerable to brute-force. This generator always produces 256 bits encoded as Base64url.' },
        { q: 'Where do I use this in Node.js?', a: 'Pass it as the secret to jwt.sign(payload, secret) and jwt.verify(token, secret) using the jsonwebtoken or jose libraries.' },
        { q: 'Should I store this in a .env file?', a: 'Yes. Set JWT_SECRET=<your-key> in your .env and load it via process.env.JWT_SECRET. Never hardcode it in source code.' },
      ]}
    />
  );
}