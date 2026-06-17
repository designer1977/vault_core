import React from 'react';

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-sm text-zinc-500">Last updated: June 17, 2026</p>
          <div className="mt-6 h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(0,255,209,0.2), transparent)' }}></div>
        </div>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">1. No Data Collection</h2>
            <p>VaultCore operates entirely in your browser. All cryptographic key generation happens client-side using the Web Crypto API (window.crypto.getRandomValues). We do not collect, store, or transmit any generated keys, passwords, or secrets. No data leaves your device.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">2. No Personal Information</h2>
            <p>VaultCore does not require account creation, login, or any form of personal identification to use its core functionality. We do not collect names, email addresses, or any personally identifiable information through the key generation tools.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">3. Analytics</h2>
            <p>We track anonymous page views and usage statistics (such as which generator tools are used) to improve the service. This data includes page URLs visited and basic interaction events. No generated keys or personal data are included in these analytics.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">4. Cookies & Local Storage</h2>
            <p>VaultCore does not use cookies, localStorage, sessionStorage, or any other browser storage mechanism to persist generated keys, user preferences, or tracking data. Each session is stateless by design.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">5. Third-Party Services</h2>
            <p>VaultCore does not integrate with third-party analytics, advertising, or tracking services. No external scripts are loaded beyond what is required for the application to function.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">6. Contact</h2>
            <p>If you have questions about this privacy policy, contact us at privacy@vaultcore.tools.</p>
          </section>
        </div>
      </main>
    </div>
  );
}