"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { SignUpButton, useAuth } from "@clerk/nextjs";

// Floating Particles Component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
            opacity: Math.random() * 0.5 + 0.1,
            scale: Math.random() * 2 + 0.5,
          }}
          animate={{
            y: -100,
            x: `+=${Math.random() * 100 - 50}`,
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
          style={{
            boxShadow: "0 0 10px rgba(255,255,255,0.8)",
          }}
        />
      ))}
    </div>
  );
};

export default function ShutterHero() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useAuth();

  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    // Auto-open after 1 second
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const SLAT_COUNT = 40;

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#050505]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4" type="video/mp4" />
        </video>
        {isOpen && <FloatingParticles />}
      </div>

      {/* Main Content Layer (Behind Shutter, but interactive) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
        <motion.div 
          className="text-center max-w-5xl mx-auto flex flex-col items-center px-6 pointer-events-auto"
          style={{ perspective: 1000 }}
        >
          {/* Badge Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-3 px-8 py-3 bg-[#1A1A1A]/30 backdrop-blur-sm border border-white/10 rounded-full mb-10"
          >
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_12px_white]" />
            <span className="text-[18px] font-medium tracking-wide text-white">
              AI Intelligence Platform
            </span>
          </motion.div>

          {/* 3D Tilted Text */}
          <motion.div
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: "preserve-3d",
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-[64px] md:text-[100px] font-medium leading-[1.1] tracking-tight max-w-4xl mb-6"
              style={{
                background: 'linear-gradient(144.5deg, #FFFFFF 32%, rgba(255,255,255, 0.3) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            >
              Karobaar AI
            </motion.h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[16px] md:text-[18px] font-normal text-white/70 max-w-[680px] leading-relaxed mb-12 drop-shadow-lg"
          >
            Powering seamless selling and real-time insights, Karobaar AI is the base for entrepreneurs who move with purpose, leveraging resilience, speed, and scale to shape the future of Indian commerce.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="relative group cursor-pointer">
              {!isSignedIn ? (
                 <SignUpButton mode="modal">
                   <button className="block bg-[#1A1A1A] rounded-full px-[36px] py-[14px] relative overflow-hidden group-hover:bg-[#333333] transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-70" />
                      <span className="text-white text-[16px] font-medium relative z-10 tracking-wide">Join Now</span>
                   </button>
                 </SignUpButton>
              ) : (
                 <Link href="/dashboard" className="block bg-[#1A1A1A] rounded-full px-[36px] py-[14px] relative overflow-hidden group-hover:bg-[#333333] transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-70" />
                    <span className="text-white text-[16px] font-medium relative z-10 tracking-wide">Go to Dashboard</span>
                 </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Industrial Shutter Layer */}
      <motion.div 
        className="absolute inset-0 z-40 pointer-events-none flex flex-col"
        initial={false}
        animate={{ y: isOpen ? '-100%' : '0%' }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Slats */}
        <div className="flex-1 w-full flex flex-col">
          {[...Array(SLAT_COUNT)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 w-full border-b border-black/80"
              style={{
                background: 'linear-gradient(to bottom, #2A2A2A 0%, #1A1A1A 50%, #111111 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            />
          ))}
        </div>
        
        {/* Heavy Bottom Rail */}
        <div 
          className="h-[80px] w-full border-t-2 border-white/10 relative flex justify-center items-center"
          style={{
            background: 'linear-gradient(to bottom, #333 0%, #1A1A1A 100%)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.05)'
          }}
        >
          {/* Rail Handle */}
          <div className="w-[150px] h-[20px] rounded-full bg-gradient-to-b from-[#444] to-[#222] border border-black/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]" />
        </div>
      </motion.div>

      {/* Shutter Toggle Button (Shopping Bag) */}
      <div className="absolute bottom-8 right-8 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        >
          <ShoppingBag size={24} />
        </button>
      </div>

    </section>
  );
}
