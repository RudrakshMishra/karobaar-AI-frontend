'use client';

import { motion } from 'framer-motion';

export default function AuroraMesh() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-bg-void">
      <motion.div
        animate={{
          transform: [
            'translate3d(0vw, 0vh, 0) scale(1)',
            'translate3d(-20vw, 20vh, 0) scale(1.2)',
            'translate3d(20vw, -10vh, 0) scale(0.9)',
            'translate3d(0vw, 0vh, 0) scale(1)'
          ]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 mix-blend-screen blur-[140px] bg-accent-glow"
      />
      <motion.div
        animate={{
          transform: [
            'translate3d(0vw, 0vh, 0) scale(1)',
            'translate3d(30vw, -20vh, 0) scale(1.1)',
            'translate3d(-10vw, 10vh, 0) scale(0.8)',
            'translate3d(0vw, 0vh, 0) scale(1)'
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 mix-blend-screen blur-[120px] bg-glow-purple"
      />
    </div>
  );
}
