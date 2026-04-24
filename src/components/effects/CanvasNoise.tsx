'use client';

import React, { useEffect, useRef } from 'react';

export default function CanvasNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const noise = () => {
      const imgData = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(imgData.data.buffer);
      const len = buffer32.length;
      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.1) {
          buffer32[i] = 0xffe2e8f0; // slight white noise roughly #E2E8F0
        } else {
          buffer32[i] = 0x00000000; // transparent
        }
      }
      ctx.putImageData(imgData, 0, 0);
    };

    const loop = () => {
      noise();
      animationFrameId = window.setTimeout(() => {
         requestAnimationFrame(loop);
      }, 50); // running at ~20fps to save performance
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 object-cover w-full h-full opacity-[0.03]"
    />
  );
}
