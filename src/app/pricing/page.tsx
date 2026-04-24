'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import AmbientOrbs from '@/components/effects/AmbientOrbs';

const tiers = [
  {
    name: 'Free',
    price: '₹0',
    desc: 'For new sellers just starting out on a single platform.',
    features: ['1 Platform Connected', 'Basic Dashboard', 'Real Profit Calculator (Manual)', 'Delay in Stock Alerts'],
    recommended: false,
    btnText: 'Start Free',
  },
  {
    name: 'Growth',
    price: '₹499',
    period: '/mo',
    desc: 'Automated AI tracking for scaling businesses.',
    features: ['Up to 3 Platforms', 'AI Pricing Actions', 'Competitor Tracker', 'Real-time Stock Alerts', 'Smart Cost Analysis'],
    recommended: true,
    btnText: 'Start Growth',
  },
  {
    name: 'Pro',
    price: '₹999',
    period: '/mo',
    desc: 'The complete e-commerce intelligence suite.',
    features: ['Unlimited Platforms', 'Full Auto-Pilot AI Pricing', 'Team Access', 'Custom CSV Exports', 'Priority Phone Support'],
    recommended: false,
    btnText: 'Start Pro',
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative selection:bg-lime selection:text-[#050505]">
      <AmbientOrbs />
      
      {/* Return to home */}
      <Link href="/" className="absolute top-8 left-8 text-text-muted hover:text-lime transition-colors text-[14px]">
        &larr; Back to Home
      </Link>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
         <h1 className="text-[40px] md:text-[56px] font-extrabold tracking-tighter text-center mb-6">
           Simple pricing. <span className="text-lime glow-lime text-glow-lime">No surprises.</span>
         </h1>
         <p className="text-[18px] text-text-muted text-center max-w-xl mb-16">
           Stop bleeding platform fees. Invest in AI intelligence that pays for itself in the first week.
         </p>

         <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
            {tiers.map((t, i) => (
              <div key={i} className={`card-premium p-8 flex flex-col items-start ${t.recommended ? 'border-lime shadow-[0_0_30px_rgba(212,163,115,0.1)] relative transform md:-translate-y-4' : ''}`}>
                 {t.recommended && (
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-lime text-[#050505] font-bold text-[11px] uppercase tracking-widest px-3 py-1 rounded-full">
                     Recommended
                   </div>
                 )}
                 <h2 className="text-[20px] font-bold text-text-primary mb-2">{t.name}</h2>
                 <p className="text-[14px] text-text-muted mb-6 h-10">{t.desc}</p>
                 
                 <div className="flex items-baseline gap-1 mb-8">
                   <span className="text-[40px] font-extrabold text-text-primary tracking-tighter">{t.price}</span>
                   {t.period && <span className="text-[14px] text-text-muted">{t.period}</span>}
                 </div>

                 <Link href="/signup" className={`w-full py-3 text-center text-[14px] font-bold rounded-md transition-all mb-8 ${t.recommended ? 'btn-primary' : 'bg-card2 border border-border-base text-text-primary hover:border-lime hover:text-lime'}`}>
                   {t.btnText}
                 </Link>

                 <div className="w-full flex-1 flex flex-col gap-4">
                   {t.features.map((f, idx) => (
                     <div key={idx} className="flex gap-3 text-[14px] text-text-muted">
                        <Check size={16} className="text-lime shrink-0" />
                        <span>{f}</span>
                     </div>
                   ))}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
