import React, { useEffect, useRef } from 'react';

const CHARS = '0123456789ABCDEFabcdef!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function EntropyStream() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const streams = [];
    const count = 18;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.top = `${Math.random() * 100}%`;
      el.style.left = `${(i / count) * 100}%`;
      el.style.fontFamily = 'JetBrains Mono, monospace';
      el.style.fontSize = '10px';
      el.style.color = i % 4 === 0 ? 'rgba(0,255,209,0.12)' : 'rgba(255,255,255,0.04)';
      el.style.pointerEvents = 'none';
      el.style.userSelect = 'none';
      el.style.letterSpacing = '0.1em';
      el.style.writingMode = 'vertical-rl';
      el.style.whiteSpace = 'nowrap';
      el.style.lineHeight = '1.4';
      container.appendChild(el);
      streams.push(el);
    }

    const intervals = streams.map((el, i) => {
      const speed = 800 + Math.random() * 1400;
      return setInterval(() => {
        const length = 8 + Math.floor(Math.random() * 12);
        el.textContent = Array.from({ length }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('');
      }, speed);
    });

    return () => {
      intervals.forEach(clearInterval);
      streams.forEach(el => el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
}