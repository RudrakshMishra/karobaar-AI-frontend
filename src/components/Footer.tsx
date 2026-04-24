"use client";

import Link from "next/link";
import { Globe, Mail, Phone, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#FAF9F6] pt-20 pb-12 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src="/logo.jpg" alt="Karobaar AI Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
            </Link>
            <p className="text-[#1A1A1A]/80 max-w-sm leading-relaxed mb-6">
              The intelligent operating system for Indian e-commerce. Helping sellers turn data into decisions since 2024.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:border-black/30 transition-all">
                <Globe size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:border-black/30 transition-all">
                <Mail size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:border-black/30 transition-all">
                <Phone size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#features" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Dashboard</Link></li>
              <li><Link href="#" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">API Status</Link></li>
              <li><Link href="#" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 gap-4">
          <p className="text-[12px] text-[#1A1A1A]/80 uppercase tracking-widest font-bold">
            © 2026 Karobaar AI. Made with <Heart size={10} className="inline text-red-500 fill-red-500 mx-1" /> in India.
          </p>
          <div className="flex gap-8 text-[12px] text-[#1A1A1A]/80 uppercase tracking-widest font-bold">
            <Link href="#" className="hover:text-[#1A1A1A] transition-colors">Accessibility</Link>
            <Link href="#" className="hover:text-[#1A1A1A] transition-colors">Legal</Link>
            <Link href="#" className="hover:text-[#1A1A1A] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
