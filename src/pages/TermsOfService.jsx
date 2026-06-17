import React from 'react';

export default function TermsOfService() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#050505' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-5 h-5 relative">
              <div className="absolute inset-0 border rotate-45" style={{ borderColor: 'rgba(0,255,209,0.6)' }}></div>
              <div className="absolute inset-1 border rotate-45" style={{ borderColor: 'rgba(0,255,209,0.3)' }}></div>
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: '#00FFD1' }}>VAULT_CORE</span>
          </a>
          <a href="/" className="text-xs tracking-widest uppercase text-zinc-600 hover:text-zinc-300 transition-colors">← Back</a>
        </div>
      </nav>

      <main className="pt-14 max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 pt-8">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-600 mb-3">Legal</p>
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight mb-4">Terms of Service</h1>
          <p className="text-sm text-zinc-500">Last updated: June 17, 2026</p>
          <div className="mt-6 h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(0,255,209,0.2), transparent)' }}></div>
        </div>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using VaultCore ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">2. Service Description</h2>
            <p>VaultCore is a free, browser-based cryptographic key generator. It provides tools for generating JWT secrets, API keys, encryption keys, UUIDs, and passwords using cryptographically secure random number generation (CSPRNG).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">3. No Warranty</h2>
            <p>The Service is provided "as is" without warranty of any kind. While we use industry-standard cryptographic APIs (Web Crypto API), VaultCore makes no guarantees regarding the security or suitability of generated keys for any specific purpose. You are responsible for validating that generated keys meet your security requirements.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">4. Acceptable Use</h2>
            <p>You agree not to misuse the Service, including attempting to disrupt, overload, or compromise its operation. The Service is intended for legitimate security and development purposes only.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">5. Intellectual Property</h2>
            <p>VaultCore's code, design, and branding are protected by applicable intellectual property laws. The generated keys themselves are not subject to any ownership claims by VaultCore — they are yours.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">6. Limitation of Liability</h2>
            <p>VaultCore and its operators shall not be liable for any damages arising from the use or inability to use the Service, including but not limited to security breaches, data loss, or system compromise resulting from the use of generated keys.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">7. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">8. Contact</h2>
            <p>For questions about these terms, contact us at legal@vaultcore.tools.</p>
          </section>
        </div>
      </main>
    </div>
  );
}