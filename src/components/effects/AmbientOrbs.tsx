'use client';

import React from 'react';

export default function AmbientOrbs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Orb 1 */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full animate-float-orb blur-[120px] mix-blend-screen opacity-10"
        style={{ 
          background: 'radial-gradient(circle, var(--lime) 0%, transparent 70%)',
          top: '-10%', 
          left: '-5%' 
        }}
      />
      {/* Orb 2 */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full animate-float-orb blur-[150px] mix-blend-screen opacity-10"
        style={{ 
          background: 'radial-gradient(circle, var(--lime) 0%, transparent 70%)',
          bottom: '-20%', 
          right: '-10%',
          animationDelay: '2s'
        }}
      />
      {/* Orb 3 */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full animate-float-orb blur-[100px] mix-blend-screen opacity-[0.05]"
        style={{ 
          background: 'radial-gradient(circle, var(--lime) 0%, transparent 70%)',
          top: '40%', 
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animationDelay: '4s'
        }}
      />
    </div>
  );
}
