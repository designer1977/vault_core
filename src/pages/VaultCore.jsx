import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePageView } from '../hooks/usePageView';
import EntropyStream from '../components/vault/EntropyStream';
import HeroGenerator from '../components/vault/HeroGenerator';
import GeneratorGrid from '../components/vault/GeneratorGrid';
import BulkMatrix from '../components/vault/BulkMatrix';
import SecurityDashboard from '../components/vault/SecurityDashboard';
import VaultFooter from '../components/vault/VaultFooter';
import CopyRipple from '../components/vault/CopyRipple';

export default function VaultCore() {
  usePageView('/');
  const [ripples, setRipples] = useState([]);

  const triggerRipple = useCallback(() => {
    const id = Date.now();
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = Math.max(window.innerWidth, window.innerHeight) * 2.5;
    setRipples(prev => [...prev, { id, x, y, size }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1200);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#050505' }}>
      {/* Entropy streams — background decoration */}
      <EntropyStream />

      {/* Ripple overlay */}
      {ripples.map(r => (
        <CopyRipple key={r.id} x={r.x} y={r.y} size={r.size} />
      ))}

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 vault-glass vault-border" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 relative">
              <div className="absolute inset-0 border border-cyan/60 rotate-45" style={{ borderColor: 'rgba(0,255,209,0.6)' }}></div>
              <div className="absolute inset-1 border border-cyan/30 rotate-45" style={{ borderColor: 'rgba(0,255,209,0.3)' }}></div>
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-cyan" style={{ color: '#00FFD1', letterSpacing: '0.2em' }}>
              VAULT_CORE
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#generators" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-200 transition-colors">Tools</a>
            <a href="#bulk" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-200 transition-colors">Bulk</a>
            <a href="#security" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-200 transition-colors">Security</a>
            <a href="/security-logic" className="text-xs tracking-widest uppercase transition-colors" style={{ color: 'rgba(0,255,209,0.5)' }} onMouseEnter={e => e.target.style.color='#00FFD1'} onMouseLeave={e => e.target.style.color='rgba(0,255,209,0.5)'}>Docs</a>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-status" style={{ backgroundColor: '#00FFD1' }}></span>
              <span className="text-xs text-zinc-500 font-mono">LOCAL ONLY</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-14">
        <HeroGenerator onCopy={triggerRipple} />
        <GeneratorGrid onCopy={triggerRipple} />
        <BulkMatrix onCopy={triggerRipple} />
        <SecurityDashboard />
        <VaultFooter />
      </main>
    </div>
  );
}