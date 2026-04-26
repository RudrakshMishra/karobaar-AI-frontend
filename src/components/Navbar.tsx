"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Get Started", href: "/#get-started" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[20px] md:px-[120px] py-[20px] transition-all duration-300">
      {/* Brand / Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white]" />
          Karobaar AI
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-[30px]">
        {navLinks.map((link) => (
          <Link key={link.name} href={link.href} className="flex items-center gap-[14px] text-white text-[14px] font-medium group">
            {link.name}
            <ChevronDown size={14} className="text-white opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex items-center gap-4">
        {!isSignedIn ? (
          <>
            <SignInButton mode="modal">
              <button className="hidden sm:block text-white text-[14px] font-medium hover:text-white/70 transition-colors">Log in</button>
            </SignInButton>
            
            <div className="relative group cursor-pointer hidden sm:block">
              {/* Layered Construction */}
              <SignUpButton mode="modal">
                <button className="block bg-[#1A1A1A] rounded-full px-[29px] py-[11px] relative overflow-hidden group-hover:bg-[#333333] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10">
                   {/* Glow Streak */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-50" />
                   <span className="text-white text-[14px] font-medium relative z-10">Join Now</span>
                </button>
              </SignUpButton>
            </div>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="hidden sm:block text-white text-[14px] font-medium hover:text-white/70 transition-colors mr-2">Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </>
        )}

        <button 
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-[#050505]/98 backdrop-blur-2xl flex flex-col p-8 md:hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <span className="text-xl font-bold tracking-tight text-white">Karobaar AI</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-medium text-white/90 hover:text-white transition-colors">
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-4" />
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button onClick={() => setMobileMenuOpen(false)} className="w-full text-center block py-4 text-white font-bold hover:bg-white/5 transition-colors">Log in</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button onClick={() => setMobileMenuOpen(false)} className="w-full text-center block py-4 rounded-full border border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 transition-colors">Join Now</button>
                  </SignUpButton>
                </>
              ) : (
                 <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full text-center block py-4 rounded-full border border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 transition-colors">Dashboard</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
