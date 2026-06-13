import React from 'react';

export default function CopyRipple({ x, y, size }) {
  return (
    <div
      className="copy-ripple"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        zIndex: 9999,
      }}
    />
  );
}