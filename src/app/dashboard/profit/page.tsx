"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function ProfitEnginePage() {
  const [platform, setPlatform] = useState("Shopify");
  const [orders, setOrders] = useState(100);
  const [aov, setAov] = useState(1200);
  
  // Deductions
  const [calcCommission, setCalcCommission] = useState(true);
  const [calcShipping, setCalcShipping] = useState(true);
  const [calcGST, setCalcGST] = useState(true);
  const [calcPkg, setCalcPkg] = useState(true);
  const [calcReturn, setCalcReturn] = useState(true);
  const [calcAds, setCalcAds] = useState(true);

  // Computed
  const [results, setResults] = useState({ gross: 0, deductions: 0, profit: 0, margin: 0 });

  useEffect(() => {
    const grossRevenue = orders * aov;
    const platformFee = calcCommission ? grossRevenue * 0.02 : 0;
    const shipping = calcShipping ? orders * 60 : 0;
    const gst = calcGST ? grossRevenue * 0.18 : 0;
    const packaging = calcPkg ? orders * 20 : 0;
    const returnLoss = calcReturn ? grossRevenue * 0.05 : 0;
    const adCost = calcAds ? orders * 150 : 0; // Avg 150 per order assumed for ads

    const totalDeductions = platformFee + shipping + gst + packaging + returnLoss + adCost;
    const realProfit = grossRevenue - totalDeductions;
    const margin = grossRevenue > 0 ? (realProfit / grossRevenue) * 100 : 0;

    setResults({ gross: grossRevenue, deductions: totalDeductions, profit: realProfit, margin });
  }, [platform, orders, aov, calcCommission, calcShipping, calcGST, calcPkg, calcReturn, calcAds]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden flex flex-col xl:flex-row shadow-[0_0_50px_rgba(0,0,0,0.6)]">
      
      {/* LEFT COLUMN: Input Form */}
      <div className="bg-[#FFFFFF] w-full xl:w-[55%] p-8 lg:p-12">
        <h2 className="text-2xl font-bold text-[#050505] mb-8">Profit Settings</h2>

        {/* SECTION A: Platform */}
        <div className="pb-8 border-b border-[#D6D3CB]">
          <h3 className="text-[rgba(0,0,0,0.8)] text-sm uppercase tracking-wider font-bold mb-4">Which platform are you selling on?</h3>
          <div className="flex flex-wrap gap-4">
            {["Shopify", "Amazon", "Flipkart", "Meesho", "WooCommerce"].map(p => (
              <label key={p} className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${platform === p ? "border-[rgba(0,0,0,0.4)]" : "border-[#C4C1B8] group-hover:border-[#7D5C48]"}`}>
                  {platform === p && <div className="w-2 h-2 rounded-full bg-[#1A1A1A]" />}
                </div>
                <span className={`text-sm ${platform === p ? "text-[#050505]" : "text-[rgba(0,0,0,0.6)]"}`}>{p}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION B: Orders Slider */}
        <div className="py-8 border-b border-[#D6D3CB]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgba(0,0,0,0.8)] text-sm uppercase tracking-wider font-bold">How many orders per month?</h3>
            <span className="text-xl font-bold text-[#050505]">{orders.toLocaleString()}</span>
          </div>
          <input 
            type="range" min="1" max="5000" step="10" 
            value={orders} onChange={(e) => setOrders(parseInt(e.target.value))}
            className="w-full h-2 bg-[#422D22] rounded-full appearance-none cursor-pointer accent-[#FFFFFF]"
          />
          <div className="flex justify-between mt-2 text-xs text-[rgba(0,0,0,0.3)]">
            <span>1</span>
            <span>5000+</span>
          </div>
        </div>

        {/* SECTION C: Deductions */}
        <div className="py-8 border-b border-[#D6D3CB]">
          <h3 className="text-[rgba(0,0,0,0.8)] text-sm uppercase tracking-wider font-bold mb-4">Deductions to calculate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <label className="flex items-center justify-between cursor-pointer group bg-[#E8E6DF] p-3 rounded-xl border border-[rgba(0,0,0,0.05)] hover:border-black/10">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${calcCommission ? "bg-[#1A1A1A] border-[rgba(0,0,0,0.4)]" : "border-[#C4C1B8] bg-[#FFFFFF]"}`}>
                  {calcCommission && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-[#050505]">Platform Fee</span>
              </div>
              <span className="text-xs text-[rgba(0,0,0,0.5)]">2% of Rev</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer group bg-[#E8E6DF] p-3 rounded-xl border border-[rgba(0,0,0,0.05)] hover:border-black/10">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${calcShipping ? "bg-[#1A1A1A] border-[rgba(0,0,0,0.4)]" : "border-[#C4C1B8] bg-[#FFFFFF]"}`}>
                  {calcShipping && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-[#050505]">Shipping</span>
              </div>
              <span className="text-xs text-[rgba(0,0,0,0.5)]">₹60 / unit</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer group bg-[#E8E6DF] p-3 rounded-xl border border-[rgba(0,0,0,0.05)] hover:border-black/10">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${calcGST ? "bg-[#1A1A1A] border-[rgba(0,0,0,0.4)]" : "border-[#C4C1B8] bg-[#FFFFFF]"}`}>
                  {calcGST && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-[#050505]">GST</span>
              </div>
              <span className="text-xs text-[rgba(0,0,0,0.5)]">18%</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer group bg-[#E8E6DF] p-3 rounded-xl border border-[rgba(0,0,0,0.05)] hover:border-black/10">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${calcPkg ? "bg-[#1A1A1A] border-[rgba(0,0,0,0.4)]" : "border-[#C4C1B8] bg-[#FFFFFF]"}`}>
                  {calcPkg && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-[#050505]">Packaging</span>
              </div>
              <span className="text-xs text-[rgba(0,0,0,0.5)]">₹20 / unit</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer group bg-[#E8E6DF] p-3 rounded-xl border border-[rgba(0,0,0,0.05)] hover:border-black/10">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${calcReturn ? "bg-[#1A1A1A] border-[rgba(0,0,0,0.4)]" : "border-[#C4C1B8] bg-[#FFFFFF]"}`}>
                  {calcReturn && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-[#050505]">Returns</span>
              </div>
              <span className="text-xs text-[rgba(0,0,0,0.5)]">5% RTO</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer group bg-[#E8E6DF] p-3 rounded-xl border border-[rgba(0,0,0,0.05)] hover:border-black/10">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${calcAds ? "bg-[#1A1A1A] border-[rgba(0,0,0,0.4)]" : "border-[#C4C1B8] bg-[#FFFFFF]"}`}>
                  {calcAds && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-[#050505]">Ads (CAC)</span>
              </div>
              <span className="text-xs text-[rgba(0,0,0,0.5)]">₹150 / order</span>
            </label>
            
          </div>
        </div>

        {/* SECTION D: AOV */}
        <div className="pt-8 flex flex-col">
          <label className="text-[rgba(0,0,0,0.8)] text-sm uppercase tracking-wider font-bold mb-4">Average Order Value (₹)</label>
          <input 
            type="number" 
            value={aov}
            onChange={(e) => setAov(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#E8E6DF] border border-[rgba(212,163,115,0.2)] text-[#050505] text-xl font-bold py-4 px-5 rounded-xl outline-none focus:border-[rgba(0,0,0,0.4)] focus:ring-1 focus:ring-[#FFFFFF] transition-all"
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Results */}
      <div className="bg-[#F2F0EA] border-l border-[#D6D3CB] w-full xl:w-[45%] p-8 lg:p-12 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-[#050505] mb-8">Real Profit Breakdown</h3>

        <div className="flex flex-col gap-4">
          
          <div className="bg-[#E8E6DF] border border-[rgba(0,0,0,0.08)] rounded-2xl p-6">
            <h4 className="text-[rgba(0,0,0,0.6)] text-sm uppercase font-bold tracking-wider mb-2">What you THINK you're earning</h4>
            <div className="text-4xl font-black text-[#050505]">{formatCurrency(results.gross)}</div>
            <p className="text-[rgba(0,0,0,0.3)] text-xs mt-2">(Gross Revenue before deductions)</p>
          </div>

          <div className="bg-[#E8E6DF] border border-[rgba(0,0,0,0.08)] rounded-2xl p-6">
            <h4 className="text-[rgba(0,0,0,0.6)] text-sm uppercase font-bold tracking-wider mb-2">Total deductions</h4>
            <div className="text-4xl font-black text-[#FF4D4D]">- {formatCurrency(results.deductions)}</div>
            <p className="text-[rgba(0,0,0,0.3)] text-xs mt-2">Platform + shipping + GST + pkg + returns + ads</p>
          </div>

          <div className="bg-gradient-to-br from-[#FFFFFF] to-[#8eb800] rounded-2xl p-6 shadow-[0_10px_30px_rgba(212,163,115,0.15)] mt-4">
            <h4 className="text-[#050505] text-sm uppercase font-black tracking-wider mb-2 opacity-80">Your REAL Profit</h4>
            <div className="text-5xl font-black text-[#050505]">{formatCurrency(results.profit)}</div>
            <div className="flex items-center gap-3 mt-4">
              <span className="bg-[#FAF9F6] text-[#050505] px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                Margin: {results.margin.toFixed(1)}%
              </span>
              <span className="text-[#050505] text-xs font-medium opacity-80">
                Per month
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
