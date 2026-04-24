'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Zap, Bell, Eye, Rocket } from 'lucide-react';

const CARDS = [
  {
    icon: Zap,
    title: 'Smart Decisions, Automatically',
    items: [
      { title: 'AI Profit Advisor', desc: 'Get clear actions like "Raise Product A by ₹50 — demand is strong."' },
      { title: 'Dynamic Pricing Engine', desc: 'Stay competitive with real-time price updates.' },
      { title: 'Demand Forecasting', desc: 'Predict demand using sales data, weather, festivals, and trends.' },
      { title: 'AI Marketing Generator', desc: 'Create Instagram posts, ad copy, and discount offers in seconds.' },
      { title: 'Inventory Auto-Planner', desc: 'Avoid stock-outs with automatic reorder and replenishment suggestions.' },
    ]
  },
  {
    icon: Bell,
    title: 'Stay Informed, Stay Ahead',
    items: [
      { title: 'Weekly Business Digest', desc: 'Get a plain-English summary of performance and next steps.' },
      { title: 'Mobile-First Dashboard', desc: 'Stay on top of your business with a fast app and instant alerts.' },
      { title: 'Goal Tracking', desc: 'Track progress toward your revenue targets.' },
      { title: 'Business Health Score', desc: "One simple score with a clear breakdown of what's strong and what needs work." },
      { title: 'Voice Analytics', desc: 'Ask, "Why did sales drop?" and get a direct answer.' },
    ]
  },
  {
    icon: Eye,
    title: 'See What Others Miss',
    items: [
      { title: 'Universal CSV Cleaner', desc: 'Automatically clean and map messy data from any platform.' },
      { title: 'Multi-platform Aggregation', desc: 'See Shopify, Amazon, Meesho, Flipkart, Instagram, and CSV data in one place.' },
      { title: 'WhatsApp Order Integration', desc: 'Capture orders from a major channel many tools ignore.' },
      { title: 'Auto Profit Calculator', desc: 'See true profit per product after fees, shipping, GST, and more.' },
      { title: 'Competitor Intelligence', desc: 'Track competitor prices, reviews, stock, and demand in real time.' },
      { title: 'Customer Behavior Prediction', desc: 'Spot churn risk, top customers, and upsell opportunities early.' },
      { title: 'Return & Fraud Detection', desc: 'Flag suspicious return patterns before they hurt margins.' },
    ]
  },
  {
    icon: Rocket,
    title: 'Scale Beyond Your Store',
    items: [
      { title: 'White-Label for Agencies', desc: 'Offer DataPulse as your own analytics product.' },
      { title: 'Marketplace Partnership API', desc: 'Add analytics directly into platforms like Flipkart and Meesho.' },
    ]
  }
];

export default function PremiumFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !progressBarRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const sectionTop = rect.top + scrollY;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      let progress = 0;
      if (scrollY > sectionTop - windowHeight) {
         progress = (scrollY - (sectionTop - windowHeight)) / (sectionHeight);
         progress = Math.min(Math.max(progress, 0), 1);
      }
      progressBarRef.current.style.transform = `scaleX(${progress})`;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="features" className="relative py-32 px-6 md:px-8 bg-[#F7FAF9] text-[#0F1F1A] overflow-hidden font-sans isolate">
       {/* Background Noise Texture */}
       <div className="absolute inset-0 z-[-1] opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

       {/* Progress line */}
       <div className="absolute top-0 left-0 w-full h-[3px] bg-[#FAF9F6]/5 z-10">
          <div ref={progressBarRef} className="h-full bg-[#1D9E75] origin-left" style={{ transform: 'scaleX(0)', transition: 'transform 0.1s ease-out' }}></div>
       </div>

       <div className="max-w-7xl mx-auto relative z-10">
           {/* Section Header */}
           <div className="text-center mb-24">
              <h2 className="text-[32px] md:text-[48px] font-jakarta font-semibold tracking-tight text-[#0F1F1A] mb-6 leading-[1.1] flex flex-wrap justify-center gap-[0.3em] overflow-hidden">
                 {["The", "Intelligence", "Layer"].map((word, i) => (
                    <AnimatedWord key={i} delay={i * 80}>{word}</AnimatedWord>
                 ))}
                 <div className="animate-gradient-text bg-clip-text text-transparent bg-[linear-gradient(to_right,#1D9E75,#10B981,#1D9E75)] bg-[length:200%_auto] inline-block font-jakarta pb-1">
                    {["Small", "Sellers", "Need"].map((word, i) => (
                       <AnimatedWord key={i+3} delay={(i+3) * 80}>{word}</AnimatedWord>
                    ))}
                 </div>
              </h2>
              <p className="text-[17px] text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
                 Our platform gives small e-commerce sellers the AI insights and actions they need to grow faster.
              </p>
           </div>

           {/* Cards Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {CARDS.map((card, i) => (
                 <FeatureCard key={i} card={card} index={i} />
              ))}
           </div>
       </div>

       <style>{`
         .animate-gradient-text {
            animation: shift 4s linear infinite;
         }
         @keyframes shift {
            to { background-position: 200% center; }
         }
       `}</style>
    </section>
  );
}

function AnimatedWord({ children, delay }: { children: React.ReactNode, delay: number }) {
   const ref = useRef<HTMLSpanElement>(null);
   const [isInView, setIsInView] = useState(false);

   useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
         if (entry.isIntersecting) {
            setTimeout(() => {
               setIsInView(true);
            }, delay);
            observer.disconnect();
         }
      }, { threshold: 0.1 });
      
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
   }, [delay]);

   return (
      <span ref={ref} className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'}`}>
         {children}
      </span>
   );
}

function FeatureCard({ card, index }: { card: any, index: number }) {
   const cardRef = useRef<HTMLDivElement>(null);
   const [isInView, setIsInView] = useState(false);

   useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
         if (entry.isIntersecting) {
            setTimeout(() => setIsInView(true), index * 100);
            observer.disconnect();
         }
      }, { threshold: 0.05 });

      if (cardRef.current) observer.observe(cardRef.current);
      return () => observer.disconnect();
   }, [index]);

   return (
      <div 
        ref={cardRef} 
        className={`group relative isolate transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                   ${isInView ? 'opacity-100 translate-y-0 hover:-translate-y-2' : 'opacity-0 translate-y-[40px]'}`}
      >
         {/* Border Glow wrapper layer */}
         <div className="absolute inset-0 rounded-2xl p-[1px] bg-[#E2EEE9] group-hover:bg-transparent overflow-hidden z-[-2] transition-colors duration-300">
            <div className="absolute inset-[-50%] w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#1D9E75_20%,transparent_50%)] animate-[spin_4s_linear_infinite] transition-opacity duration-500" />
         </div>
         {/* White background layer to obscure the center of the conic gradient */}
         <div className="absolute inset-[1px] rounded-[15px] bg-[#FFFFFF] group-hover:shadow-[0_20px_60px_rgba(29,158,117,0.12)] transition-shadow duration-[500ms] z-[-1]" />
         
         <div className="p-6 md:p-8 flex flex-col h-full relative">
            <div className="flex flex-col mb-8 relative">
               <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] mb-5 group-hover:scale-[1.12] group-hover:bg-[#C8EDE0] transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform origin-center">
                  <card.icon size={24} />
               </div>
               <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1D9E75] font-jakarta leading-tight">
                  {card.title}
               </h3>
            </div>

            <div className="relative flex-grow">
               {/* Animated vertical draw line */}
               <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-[#E2EEE9] rounded-full overflow-hidden origin-top">
                  <div className={`w-full h-full bg-[#1D9E75] origin-top transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isInView ? 'scale-y-100 delay-300' : 'scale-y-0'}`} />
               </div>

               <ul className="space-y-6">
                  {card.items.map((item: any, i: number) => (
                     <FeatureItem key={i} item={item} i={i} parentInView={isInView} />
                  ))}
               </ul>
            </div>
         </div>
      </div>
   );
}

function FeatureItem({ item, i, parentInView }: { item: any, i: number, parentInView: boolean }) {
   const [revealed, setRevealed] = useState(false);

   useEffect(() => {
      if (parentInView) {
         const t = setTimeout(() => setRevealed(true), 400 + i * 50); // wait for parent to finish entrance, then stagger
         return () => clearTimeout(t);
      }
      setRevealed(false);
   }, [parentInView, i]);

   return (
      <li className={`flex gap-4 items-start relative transition-all duration-500 ease-out ${revealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
         <div className="w-[8px] h-[8px] bg-[#FFFFFF] border-[2px] border-[#1D9E75] rounded-full mt-1.5 flex-shrink-0 relative z-10 transition-colors duration-300"></div>
         <div>
            <strong className="text-[14px] text-[#0F1F1A] font-semibold block mb-1 leading-snug font-jakarta">{item.title}</strong>
            <span className="text-[13px] text-[#6B7280] leading-[1.6] block">{item.desc}</span>
         </div>
      </li>
   );
}
