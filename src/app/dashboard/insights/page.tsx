"use client";

import { BrainCircuit, Zap, TrendingDown, ArrowUpRight, MessageSquare } from "lucide-react";

export default function AIInsightsPage() {
  const insights = [
    { 
      id: 1, 
      category: "Pricing Strategy", 
      title: "Optimized Pricing for SKU-001",
      description: "Based on competitor analysis across Amazon and Flipkart, lowering the price of 'Noise Cancelling Earbuds PRO' by ₹50 will increase win rate by 42%.",
      impact: "+₹45,000 Expected MRR",
      actionText: "Apply Smart Pricing",
      icon: <Zap className="w-5 h-5 text-[#050505]" />
    },
    { 
      id: 2, 
      category: "Ad Spend Risk", 
      title: "Low ROI Campaigns",
      description: "Historical data suggests an 18% drop in ROI for ad campaigns running between 11 PM and 2 AM. Consider pausing ad-spend during these hours.",
      impact: "-₹12,000 Wasted Ad Spend",
      actionText: "Pause Campaigns",
      icon: <TrendingDown className="w-5 h-5 text-[#FF4D4D]" />
    },
    { 
      id: 3, 
      category: "Growth Opportunity", 
      title: "Bundle Recommendation",
      description: "78% of users buying 'Ergonomic Office Chair X1' later purchase 'Mechanic Keyboard RGB'. Creating a bundle package could increase AOV by 25%.",
      impact: "+₹8,500 Expected AOV",
      actionText: "Create Bundle",
      icon: <ArrowUpRight className="w-5 h-5 text-blue-400" />
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[rgba(212,163,115,0.1)] flex items-center justify-center border border-[rgba(212,163,115,0.2)]">
            <BrainCircuit className="w-7 h-7 text-[#050505]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#050505]">AI Intelligence Hub</h1>
            <p className="text-[rgba(0,0,0,0.6)] text-sm mt-1 max-w-lg">Karobaar AI continuously analyzes your sales data, inventory logs, and competitor pricing to surface actionable profit opportunities.</p>
          </div>
        </div>
        <button className="bg-[#E8E6DF] border border-[rgba(0,0,0,0.1)] text-[#050505] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#D6D3CB] transition-colors flex items-center gap-2">
           <MessageSquare className="w-4 h-4" /> Ask AI Assistant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-[#F2F0EA] border border-[rgba(212,163,115,0.15)] p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <span className="text-[#050505] text-[4rem] font-black leading-none mb-2">3</span>
            <span className="text-[11px] uppercase tracking-widest text-[#050505]/50 font-bold">New Recommendations</span>
         </div>
         <div className="bg-[#F2F0EA] border border-[rgba(0,0,0,0.05)] p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <span className="text-[#050505] text-[4rem] font-black leading-none mb-2">₹65k</span>
            <span className="text-[11px] uppercase tracking-widest text-[#050505] font-bold">Potential Profit Left on Table</span>
         </div>
         <div className="bg-[#F2F0EA] border border-[rgba(0,0,0,0.05)] p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <span className="text-[#050505] text-[4rem] font-black leading-none mb-2">12</span>
            <span className="text-[11px] uppercase tracking-widest text-[#050505]/50 font-bold">Automations Running</span>
         </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#050505] mb-2">Priority Action Items</h2>
        
        {insights.map((insight) => (
          <div key={insight.id} className="bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] rounded-2xl p-6 shadow-md flex flex-col lg:flex-row lg:items-center gap-6 group hover:border-[rgba(0,0,0,0.15)] transition-colors">
            
            <div className="w-12 h-12 flex-shrink-0 bg-[#E8E6DF] rounded-xl border border-[rgba(0,0,0,0.05)] flex items-center justify-center">
              {insight.icon}
            </div>

            <div className="flex-1">
               <span className="text-[10px] uppercase tracking-widest text-[rgba(0,0,0,0.4)] font-bold mb-1 block">
                 {insight.category}
               </span>
               <h3 className="text-lg font-bold text-[#050505] mb-2">{insight.title}</h3>
               <p className="text-[rgba(0,0,0,0.7)] text-sm max-w-3xl leading-relaxed">
                 {insight.description}
               </p>
            </div>

            <div className="flex flex-col lg:items-end gap-3 min-w-[200px]">
               <div className="text-sm font-bold text-[#050505] bg-[rgba(0,0,0,0.05)] px-3 py-1 rounded inline-block border border-[rgba(0,0,0,0.1)]">
                 {insight.impact}
               </div>
               <button className="bg-[#1A1A1A] border-transparent text-white px-5 py-2 rounded font-bold text-sm hover:bg-[#333333] shadow-sm transition-colors w-full lg:w-auto text-center">
                 {insight.actionText}
               </button>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}
