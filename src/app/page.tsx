"use client";
// Refined high-fidelity landing page for Karobaar AI

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  ArrowRight, Play, CheckCircle2, LayoutDashboard, Calculator, 
  BarChart3, BrainCircuit, Target, Package, Zap, MessageSquare, 
  TrendingUp, Activity, PieChart, ShieldCheck, ShoppingBag, Truck, AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import StarField from '@/components/effects/StarField';

gsap.registerPlugin(ScrollTrigger, useGSAP);

import VideoPlayer from '@/components/ui/VideoPlayer';

export default function LandingPage() {
  const containerRef = useRef(null);
  
  const mockDashboardData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 6000 },
    { name: 'Thu', revenue: 8500 },
    { name: 'Fri', revenue: 5000 },
    { name: 'Sat', revenue: 9500 },
    { name: 'Sun', revenue: 12000 },
  ];

  useGSAP(() => {
    // Scroll Revelations
    gsap.utils.toArray('.reveal').forEach((el: any) => {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Staggered Feature Cards Reveal
    gsap.from('.feature-card', {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: '#features',
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });

    // Dashboard Mockup Animation
    gsap.from('.dashboard-mockup', {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.dashboard-section',
        start: 'top 70%',
      }
    });

    // Chat Message Animation
    gsap.from('.chat-msg', {
      x: (i) => i % 2 === 0 ? -30 : 30,
      opacity: 0,
      duration: 0.8,
      stagger: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.chat-container',
        start: 'top 60%',
      }
    });

    // Stats Counters
    gsap.utils.toArray('.stat-num').forEach((el: any) => {
      const text = el.innerText;
      const target = parseFloat(text.replace(/[^0-9.]/g, ''));
      const prefix = text.match(/^[^0-9.]+/)?.[0] || '';
      const suffix = text.match(/[^0-9.]+$/)?.[0] || '';
      
      let proxy = { val: 0 };
      gsap.to(proxy, {
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
        onUpdate: function() {
          let displayVal = Number(proxy.val.toFixed(1)).toLocaleString('en-IN');
          el.innerText = prefix + displayVal + suffix;
        }
      });
    });
  }, { scope: containerRef });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <main ref={containerRef} className="bg-[#050505] min-h-screen text-white font-sans selection:bg-white/20 selection:text-white">
      <Navbar />
      
      {/* SECTION 1: HERO (WEEB3 STYLE / FULLSCREEN VIDEO) */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4" type="video/mp4" />
        </video>

        {/* Content Container */}
        <motion.div 
          className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center pt-[200px] md:pt-[280px] pb-[102px] px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge Pill */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-3 px-8 py-3 bg-[#1A1A1A]/10 border border-black/20 rounded-full mb-10"
          >
            <div className="w-2 h-2 bg-[#1A1A1A] rounded-full shadow-[0_0_12px_white]" />
            <span className="text-[18px] font-medium tracking-wide">
              <span className="text-white">AI Intelligence Platform</span>
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-[48px] md:text-[88px] font-medium leading-[1.1] tracking-tight max-w-4xl mb-6"
            style={{
              background: 'linear-gradient(144.5deg, #FFFFFF 32%, rgba(255,255,255, 0.4) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Karobaar AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-[15px] font-normal text-white/70 max-w-[680px] leading-relaxed mb-10"
          >
            Powering seamless selling and real-time insights, Karobaar AI is the base for entrepreneurs who move with purpose, leveraging resilience, speed, and scale to shape the future of Indian commerce.
          </motion.p>

          {/* CTA Button (Layered Pill) */}
          <motion.div variants={itemVariants}>
            <div className="relative group cursor-pointer">
                 <div className="bg-[#1A1A1A] rounded-full px-[29px] py-[11px] relative overflow-hidden group-hover:bg-[#333333] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10">
                    {/* Glow Streak */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-50" />
                    <span className="text-white text-[14px] font-medium relative z-10">Join Waitlist</span>
                 </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      
      {/* --- DARK INVERSION GROUP --- */}
      <div className="relative bg-[#050505] text-white">
        <div className="absolute inset-0 z-0 opacity-40">
           <StarField />
        </div>
        <div className="relative z-10">
          {/* SECTION 2: PROBLEM STATEMENT */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
        <div className="lg:sticky lg:top-40">
          <h2 className="text-[40px] md:text-[64px] font-bold leading-[1.1] mb-6">
            <span className="text-red-500 block">Small sellers don&apos;t</span>
            <span className="block italic font-light opacity-80">fail from lack of effort.</span>
          </h2>
          <p className="text-xl text-white/50 leading-relaxed">
            They fail because they don&apos;t know their numbers.
          </p>
        </div>

        <div className="space-y-6">
          {[
            { icon: LayoutDashboard, title: "Scattered Data", desc: "Sales on Shopify, Amazon, Meesho, Excel — no single view of your business health." },
            { icon: Calculator, title: "Unknown Real Profit", desc: "Platform fees, GST, returns, ads — nobody adds it up. You don't know if you're actually making money." },
            { icon: TrendingUp, title: "No Predictions", desc: "Stock runs out, demand spikes — sellers are always reacting late instead of planning ahead." },
            { icon: Zap, title: "Expensive Tools", desc: "Existing tools cost ₹10,000+/mo, need a data team, and were built for global sellers, not India." },
          ].map((item, i) => (
            <div key={i} className="reveal glass-panel p-8 hover:border-accent/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PRODUCT OVERVIEW */}
      <section className="dashboard-section py-40 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05),transparent_50%)] relative">
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
          <h2 className="reveal text-[48px] md:text-[64px] font-bold mb-6 text-gradient">Not just analytics. Actual decisions.</h2>
          <p className="reveal text-white/50 text-xl font-light">Upload your CSV or connect your store. Karobaar AI does the rest.</p>
        </div>

        {/* Dashboard Mockup */}
        <div className="dashboard-mockup max-w-5xl mx-auto glass-panel p-4 md:p-8 relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-xl">
             {['Shopify', 'Amazon', 'Meesho', 'Flipkart'].map(p => (
               <div key={p} className="text-[10px] font-bold tracking-widest text-white/40">{p.toUpperCase()}</div>
             ))}
          </div>
          
          <div className="aspect-[16/9] w-full bg-[#120C08]/60 rounded-xl overflow-hidden border border-white/5 flex flex-col">
            <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/[0.02]">
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]/10" />)}
              </div>
              <div className="text-[11px] text-white/30 font-bold tracking-widest uppercase">Karobaar AI v2.4</div>
            </div>
            
            <div className="flex-1 flex">
              <div className="w-16 md:w-60 border-r border-white/5 p-4 flex flex-col gap-6 bg-white/[0.01]">
                <div className="w-full h-8 bg-accent/20 rounded-lg" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-full h-4 bg-white/5 rounded" />)}
                </div>
              </div>
              
              <div className="flex-1 p-4 md:p-8 space-y-8 overflow-hidden">
                <div className="grid grid-cols-3 gap-4">
                  {[ 
                    { l: 'REVENUE', v: '₹5.2L', c: 'text-white' }, 
                    { l: 'REAL PROFIT', v: '₹1.8L', c: 'text-green' }, 
                    { l: 'HSCORE', v: '82', c: 'text-accent' } 
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[9px] font-bold text-white/30 tracking-widest mb-1">{s.l}</div>
                      <div className={`text-xl md:text-2xl font-bold ${s.c}`}>{s.v}</div>
                    </div>
                  ))}
                </div>
                
                <div className="w-full aspect-[2/1] relative flex items-end">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={mockDashboardData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="name" stroke="#FFFFFF" tick={{fill: '#FFFFFF', fontSize: 10}} tickLine={false} axisLine={false} />
                       <Area type="monotone" dataKey="revenue" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorBrand)" />
                     </AreaChart>
                   </ResponsiveContainer>
                </div>

                <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl">
                   <div className="text-[10px] font-bold text-accent mb-2 tracking-widest uppercase">AI ADVICE</div>
                   <div className="space-y-2">
                     <div className="h-2 w-3/4 bg-accent/20 rounded" />
                     <div className="h-2 w-1/2 bg-accent/20 rounded" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES GRID */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="reveal text-[48px] md:text-[88px] font-medium leading-[1.1] mb-6 text-gradient">Built for scale. Made for India.</h2>
          <p className="reveal text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to grow your e-commerce operation without the headache of spreadsheets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: BrainCircuit, 
              title: "Hinglish AI Co-Pilot", 
              desc: "Ask your business anything via WhatsApp voice or text. Get instant insights in plain Hindi or English.",
              tag: "India First"
            },
            { 
              icon: AlertTriangle, 
              title: "ROI Protection", 
              desc: "Identify low-ROI campaigns and failing SKUs instantly. Stop profit leaks from poor ad-spend using advanced AI scoring.",
              tag: "Profit Saver"
            },
            { 
              icon: Calculator, 
              title: "Real Profit Engine", 
              desc: "True margin tracking after platform fees, GST (Input/Output), ad-spend, and shipping deductions.",
              tag: "Scale with Confidence"
            },
            { 
              icon: Target, 
              title: "Marketplace Intel", 
              desc: "Monitor competitor price drops and stock levels on Amazon, Flipkart, and Meesho in real-time.",
              tag: "Stay Competitive"
            },
            { 
              icon: Package, 
              title: "Smart Inventory Planner", 
              desc: "AI-powered restocking alerts based on your velocity. Know exactly when and what to reorder.",
              tag: "Zero Stockouts"
            },
            { 
              icon: Zap, 
              title: "Ad-Spend Optimizer", 
              desc: "Connect your Meta/Google ads. AI flags low-ROI SKUs so you stop burning money on faulty campaigns.",
              tag: "ROI Focused"
            },
            { 
              icon: PieChart, 
              title: "Automatic GST Sync", 
              desc: "Generate monthly platform-wise GST reports in one click. Save 10+ hours on bookkeeping.",
            },
            { 
              icon: ShoppingBag, 
              title: "Multi-Store Unified", 
              desc: "One dashboard for Shopify, Amazon, and Meesho. Sync orders and inventory across all channels.",
            },
            { 
              icon: ShieldCheck, 
              title: "Business Health Score", 
              desc: "A proprietary daily audit of your profit, retention, and cashflow. Your business vital signs.",
            },
          ].map((feat, i) => (
            <div key={i} className="feature-card bg-white/[0.05] backdrop-blur-md rounded-2xl p-8 hover:bg-white/[0.1] transition-all group border border-white/20 hover:border-white/40 duration-500">
               <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#050505] shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-110">
                   <feat.icon size={24} />
                 </div>
                 {feat.tag && <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-white/15 px-3 py-1 rounded-full border border-white/30">{feat.tag}</span>}
               </div>
               <h3 className="text-2xl text-white font-bold mb-4 tracking-tight">{feat.title}</h3>
               <p className="text-white/90 text-[16px] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: AI DEMO */}
      <section className="py-40 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="chat-container space-y-6 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-gradient-to-br from-accent to-blue rounded-xl flex items-center justify-center font-bold">K</div>
               <div>
                 <div className="text-sm font-bold">Karobaar AI <span className="w-1.5 h-1.5 rounded-full bg-green inline-block ml-1" /></div>
                 <div className="text-[11px] text-white/50">Predicting your business future...</div>
               </div>
            </div>

            {[
              { type: 'user', text: "Why did my profits drop this week?" },
              { type: 'ai', text: "Your profit dropped 12% because Product X has 34% return rate. Recommendation: Stop promoting X. Bundle with Product Y instead." },
              { type: 'user', text: "Which product should I restock first?" },
              { type: 'ai', text: "Restock 'Blue Kurta L' within 3 days — stockout predicted. Order 150 units at current sales velocity." },
            ].map((msg, i) => (
              <div key={i} className={`chat-msg p-5 rounded-2xl max-w-[85%] text-[15px] leading-relaxed ${
                msg.type === 'ai' ? 'bg-accent/10 text-white border border-accent/20 self-start' : 'bg-white/5 text-white/80 border border-white/10 self-end'
              }`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="space-y-8 relative">
             <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-accent/0 via-accent/40 to-accent/0" />
             
             {[ 
               { icon: LayoutDashboard, t: 'Data Unified', d: 'Connected CSVs, Amazon, and Meesho' },
               { icon: BrainCircuit, t: 'Pattern Detected', d: 'AI identified a drop in retention for Tier 2 cities' },
               { icon: Calculator, t: 'Profit Recalculated', d: 'Adjusted for recent shipping price hike' },
               { icon: Zap, t: 'Direct Action', d: 'Lowered price for Group A to maintain volume' }
             ].map((node, i) => (
               <div key={i} className="reveal relative flex gap-8 items-center">
                  <div className="w-20 h-20 bg-[#120C08] rounded-full border border-white/10 flex items-center justify-center z-10 hover:border-accent transition-colors shadow-[0_0_20px_rgba(0,0,0,1)]">
                    <node.icon size={28} className="text-white/60" />
                  </div>
                  <div className="glass-panel p-6 flex-1 hover:border-white/20 transition-all">
                    <h4 className="font-bold mb-1">{node.t}</h4>
                    <p className="text-[13px] text-white/50">{node.d}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: SOCIAL PROOF */}
      <section className="py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-32">
          <h2 className="reveal text-[48px] font-bold mb-12 italic">12,400+ Sellers. 1 Mission.</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { val: '₹500Cr+', label: 'Revenue tracked' },
              { val: '12.4k', label: 'Indian Businesses' },
              { val: '97.6%', label: 'AI Accuracy' },
            ].map((stat, i) => (
              <div key={i} className="reveal">
                <div className="stat-num text-[64px] font-bold text-gradient mb-2">{stat.val}</div>
                <div className="text-[13px] font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 animate-scroll whitespace-nowrap hover:[animation-play-state:paused] w-max">
           {[...Array(2)].map((_, i) => (
             <div key={i} className="flex gap-4 shrink-0">
                {[
                  { q: "Pehle profit ka pata hi nahi tha. Ab ek click mein sab clear.", s: "Ramesh K., Mumbai" },
                  { q: "Competitor price drop detection has been a game changer for us.", s: "Priya S., Jaipur" },
                  { q: "Restock alert ne mujhe ₹40,000 ka loss bachaya. Highly recommend.", s: "Arjun M., Surat" },
                  { q: "Finally, a tool built for the Indian e-commerce landscape.", s: "Sneha L., Delhi" },
                ].map((t, idx) => (
                  <div key={idx} className="glass-panel p-8 w-[350px] inline-flex flex-col justify-between whitespace-normal">
                     <p className="text-lg leading-snug mb-6 text-white/90">“{t.q}”</p>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20" />
                        <span className="text-[13px] font-medium text-white/40">{t.s}</span>
                     </div>
                  </div>
                ))}
             </div>
           ))}
        </div>
      </section>

      {/* SECTION 7: PRICING */}
      <section id="pricing" className="py-40 px-6 max-w-7xl mx-auto text-center">
        <h2 className="reveal text-[48px] font-bold mb-4">Simple, transparent pricing.</h2>
        <p className="reveal text-white/60 mb-20">Choose the brain that fits your business stage.</p>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {[
            { 
              n: 'FREE', p: '0', 
              f: ['CSV upload (1 platform)', 'Basic analytics dashboard', 'Revenue & order tracking', 'Email support'],
              b: 'Get Started Free'
            },
            { 
              n: 'STARTER', p: '499', 
              f: ['Everything in Free', 'AI Business Co-Pilot', 'Real Profit Engine', '3 platform integrations', 'Inventory alerts', 'Priority support'],
              b: 'Start 14-Day Free Trial',
              featured: true
            },
            { 
              n: 'PRO', p: '999', 
              f: ['Everything in Starter', 'Competitor Intelligence', 'AI Pricing Engine', 'AI Marketing Generator', 'Unlimited platforms', 'White-label reports'],
              b: 'Go Pro'
            }
          ].map((plan, i) => (
            <div key={i} className={`reveal glass-panel p-10 flex flex-col ${plan.featured ? 'border-accent shadow-[0_0_40px_rgba(124,90,247,0.15)] scale-105 z-10' : 'opacity-80 scale-95'}`}>
              <div className="flex justify-between items-start mb-8 text-left">
                <div>
                   <h3 className="text-xl font-bold mb-1">{plan.n}</h3>
                   {plan.featured && <span className="text-[10px] font-bold text-accent px-2 py-1 bg-accent/10 rounded uppercase">Most Popular</span>}
                </div>
                <div className="text-right">
                   <div className="text-3xl font-bold italic">₹{plan.p}</div>
                   <div className="text-[11px] text-white/40 font-bold">MONTHLY</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-12 flex-1 text-left">
                {plan.f.map(f => (
                  <div key={f} className="flex items-center gap-3 text-[14px] text-white/60">
                    <CheckCircle2 size={16} className="text-green flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-full font-bold transition-all active:scale-95 ${
                plan.featured ? 'bg-accent text-white shadow-lg' : 'bg-white/5 border border-white/20 text-white'
              }`}>
                {plan.b}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="relative py-60 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)] animate-slow-pulse" />
         
         <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="reveal text-[13px] font-bold text-accent uppercase tracking-widest mb-6">Join 12,400+ sellers winning today</span>
            <h2 className="reveal text-[56px] md:text-[80px] font-bold leading-[1] mb-10 text-gradient text-center">Your Karobaar Deserves Better Than Guesswork.</h2>
            <p className="reveal text-xl text-white/60 max-w-xl mb-12">
              Upload your first CSV free. No credit card required. Clear answers in under 2 minutes.
            </p>
            
            <div className="reveal flex flex-col sm:flex-row items-center gap-4 mb-20">
              <Link href="/signup" className="btn-primary">Get Started Now</Link>
              <button className="btn-secondary">Book a Call</button>
            </div>

            <div className="reveal flex flex-wrap justify-center gap-x-8 gap-y-4 opacity-40">
              {['No credit card', '2-min setup', 'Any CSV format', 'Built for India'].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest truncate">
                  <ShieldCheck size={14} /> {t}
                </div>
              ))}
            </div>
         </div>
      </section>
        </div>
      </div>
      {/* ---------------------------- */}


      <Footer />
    </main>
  );
}
