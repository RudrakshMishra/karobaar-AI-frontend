"use client";

import { useState } from "react";
import { Target, Activity, Monitor, X, Check, Search, Plus } from "lucide-react";

const INITIAL_TRACKED = [
  { sku: "SKU-001", compName: "Boat Electronics", ourPrice: 2999, compPrice: 2799, status: "Losing Buy Box", delta: -200 },
  { sku: "SKU-002", compName: "Noise Connect", ourPrice: 1999, compPrice: 1999, status: "Parity", delta: 0 },
  { sku: "SKU-004", compName: "KeyChron India", ourPrice: 3499, compPrice: 3800, status: "Winning", delta: 301 },
];

export default function CompetitorsPage() {
  const [trackedItems, setTrackedItems] = useState(INITIAL_TRACKED);
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [newAsin, setNewAsin] = useState("");
  const [targetSku, setTargetSku] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsin || !targetSku) return;

    setIsScraping(true);
    
    // Simulate scraping delay
    setTimeout(() => {
      // Mock random prices for demonstration
      const mockCompPrice = Math.floor(Math.random() * 2000) + 999;
      const mockOurPrice = Math.floor(Math.random() * 2000) + 999;
      const delta = mockOurPrice - mockCompPrice;

      const trackStatus = delta < 0 ? "Losing Buy Box" : delta > 0 ? "Winning" : "Parity";

      const newItem = {
        sku: targetSku,
        compName: newAsin.includes("flipkart") ? "Flipkart Seller" : newAsin.includes("meesho") ? "Meesho Supplier" : "Amazon Retail",
        ourPrice: mockOurPrice,
        compPrice: mockCompPrice,
        status: trackStatus,
        delta: delta
      };

      setTrackedItems([newItem, ...trackedItems]);
      setIsAddModalOpen(false);
      setIsScraping(false);
      
      // Full reset
      setNewAsin("");
      setTargetSku("");
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] p-6 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <div>
          <h1 className="text-2xl font-bold text-[#050505] flex items-center gap-3">
            <Target className="text-[#050505]" /> Competitor Intelligence
          </h1>
          <p className="text-[rgba(0,0,0,0.6)] text-sm mt-1">Live tracking of competitor pricing across marketplaces.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#333333] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add ASIN/URL
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts Panel */}
        <div className="col-span-1 bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <h2 className="text-lg font-bold text-[#050505] mb-6 flex items-center gap-2">
            <Activity className="text-[#FF4D4D] w-5 h-5" /> Live Price Drops
          </h2>
          <div className="space-y-4">
            <div className="bg-[#E8E6DF] border border-[#FF4D4D]/20 p-4 rounded-xl border-l-4 border-l-[#FF4D4D]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[#050505] font-bold text-sm">Boat Electronics</span>
                <span className="text-xs text-[rgba(0,0,0,0.4)]">2 mins ago</span>
              </div>
              <p className="text-sm text-[rgba(0,0,0,0.8)]">Lowered price on "Earbuds PRO" by ₹200. You are no longer the lowest price seller.</p>
              <button className="mt-3 text-xs bg-[#FF4D4D]/10 text-[#FF4D4D] font-bold px-3 py-1 rounded hover:bg-[#FF4D4D]/20 transition-colors">
                Auto-Match Price
              </button>
            </div>
            
            <div className="bg-[#E8E6DF] border border-[rgba(0,0,0,0.05)] p-4 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[#050505] font-bold text-sm">Zebronics Store</span>
                <span className="text-xs text-[rgba(0,0,0,0.4)]">1 hour ago</span>
              </div>
              <p className="text-sm text-[rgba(0,0,0,0.8)]">Increased price on "Gaming Mouse" by ₹150. You now have room to incrase margins.</p>
              <button className="mt-3 text-xs bg-[rgba(0,0,0,0.05)] text-[#050505] font-bold px-3 py-1 rounded hover:bg-[#FFFFFF]/20 transition-colors">
                Increase Price
              </button>
            </div>
          </div>
        </div>

        {/* Tracking Table */}
        <div className="col-span-1 lg:col-span-2 bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)] min-h-[400px]">
          <h2 className="text-lg font-bold text-[#050505] mb-6">Tracked Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#D6D3CB] text-[11px] uppercase tracking-wider text-[rgba(0,0,0,0.6)] font-bold">
                  <th className="pb-4">SKU / Target</th>
                  <th className="pb-4">Competitor</th>
                  <th className="pb-4 text-right">Our Price</th>
                  <th className="pb-4 text-right">Their Price</th>
                  <th className="pb-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,0,0,0.08)]">
                {trackedItems.map((item, idx) => (
                  <tr key={idx} className="group">
                    <td className="py-4">
                      <span className="text-[#050505] font-bold text-sm bg-[rgba(0,0,0,0.05)] px-2 py-1 rounded border border-[rgba(0,0,0,0.05)]">{item.sku}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-3 h-3 text-[rgba(0,0,0,0.3)]" />
                        <span className="text-[rgba(0,0,0,0.8)] text-sm">{item.compName}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-bold text-[#050505] text-sm">₹{item.ourPrice.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-bold text-sm opacity-80">₹{item.compPrice.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-[10px] uppercase font-black tracking-widest ${
                        item.delta < 0 ? "bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20" :
                        item.delta > 0 ? "bg-[rgba(0,0,0,0.05)] text-[#050505] border border-[rgba(0,0,0,0.1)]" :
                        "bg-[#E8E6DF] text-[#050505] border border-[rgba(0,0,0,0.1)]"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CREATE MODAL OVERLAY */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-[#FAF9F6] w-full max-w-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#D6D3CB] overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between p-5 border-b border-[#D6D3CB] bg-[#FFFFFF]">
                 <h2 className="font-bold text-[#050505] text-lg">Track New Competitor</h2>
                 <button onClick={() => setIsAddModalOpen(false)} className="text-[rgba(0,0,0,0.4)] hover:text-[#050505] transition-colors">
                   <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleTrackSubmit} className="p-6 space-y-5">
                 
                 <div className="bg-[#E8E6DF] p-4 rounded-xl border border-[rgba(0,0,0,0.05)] mb-2">
                   <p className="text-xs text-[rgba(0,0,0,0.6)] leading-relaxed">
                     Paste an Amazon, Flipkart, or Meesho product URL. Karobaar AI will automatically detect the price and map it to your inventory SKU.
                   </p>
                 </div>

                 <div>
                   <label className="text-[11px] uppercase tracking-widest font-bold text-[rgba(0,0,0,0.6)] mb-1 block">Target URL or ASIN</label>
                   <input 
                     autoFocus
                     value={newAsin} onChange={e => setNewAsin(e.target.value)}
                     className="w-full bg-[#FFFFFF] border border-[#D6D3CB] px-4 py-2.5 rounded-lg text-sm text-[#050505] outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-all" 
                     placeholder="e.g. B08N5WRWNW or https://amazon.in/dp/..." 
                     required 
                   />
                 </div>

                 <div>
                   <label className="text-[11px] uppercase tracking-widest font-bold text-[rgba(0,0,0,0.6)] mb-1 block">Map to your SKU</label>
                   <input 
                     value={targetSku} onChange={e => setTargetSku(e.target.value)}
                     className="w-full bg-[#FFFFFF] border border-[#D6D3CB] px-4 py-2.5 rounded-lg text-sm text-[#050505] outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-all" 
                     placeholder="e.g. SKU-005" 
                     required 
                   />
                 </div>

                 <button 
                  type="submit" 
                  disabled={isScraping}
                  className={`w-full text-white py-3 rounded-xl font-bold mt-4 shadow-sm transition-colors flex items-center justify-center gap-2 ${
                    isScraping ? "bg-[#333333] cursor-not-allowed" : "bg-[#1A1A1A] hover:bg-[#333333]"
                  }`}
                 >
                   {isScraping ? (
                     <>
                       <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Fetching Price...
                     </>
                   ) : (
                     <>
                       <Search size={18} /> Scrape & Track
                     </>
                   )}
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
