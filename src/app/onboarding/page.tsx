'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, UploadCloud, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import confetti from 'canvas-confetti';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [goals, setGoals] = useState({ monthly_revenue_goal: 500000, target_margin_percent: 20 });
  const [costs, setCosts] = useState({ platform_fee_percent: 15, avg_shipping_cost: 70, packaging_cost: 20, monthly_ads_budget: 50000, cod_return_rate_percent: 18, gst_percent: 18 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const { data } = await api.post('/api/onboarding/complete', {
          platforms: [], // Add platforms state if needed
          monthly_revenue_goal: goals.monthly_revenue_goal,
          target_margin_percent: goals.target_margin_percent,
          cost_defaults: costs
        });
        if (data.success) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          setTimeout(() => router.push('/dashboard'), 400);
        }
      } catch (error) {
        console.error("Failed to complete onboarding", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const { data } = await api.post('/api/data/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          // You could add a progress bar state here
        }
      });
      if (data.success) {
        // Show mapping UI (simplified for now)
        setStep(2);
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0EA] text-[#050505] flex flex-col items-center py-20 px-6 font-sans">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E8E6DF] rounded-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1A1A1A] rounded-full z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= num ? 'bg-[#1A1A1A] text-[#F2F0EA] shadow-[0_0_15px_rgba(26,26,26,0.3)]' : 'bg-[#FFFFFF] text-[rgba(0,0,0,0.4)] border border-[#E8E6DF]'
                }`}
              >
                {step > num ? <CheckCircle size={20} /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-[rgba(0,0,0,0.6)] uppercase tracking-wide">
            <span>Connect Data</span>
            <span>Set Goals</span>
            <span>Cost Baseline</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-[#FFFFFF] border border-[rgba(212,163,115,0.15)] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Connect Your Store</h2>
                <p className="text-[rgba(0,0,0,0.6)]">Import your orders to get AI-powered insights instantly.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-6 bg-[#F2F0EA] border border-[rgba(212,163,115,0.2)] rounded-xl hover:border-[#050505] transition-all outline-none">
                  <ShoppingBag size={32} className="text-[#95BF47] mb-3" />
                  <span className="font-medium">Shopify</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-[#F2F0EA] border border-[rgba(212,163,115,0.2)] rounded-xl hover:border-[#050505] transition-all outline-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#050505] text-[#F2F0EA] text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg">Coming Soon</div>
                  <span className="text-3xl font-bold text-[#FF9900] mb-3">a</span>
                  <span className="font-medium text-[rgba(0,0,0,0.6)]">Amazon</span>
                </button>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D6D3CB]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#FFFFFF] px-4 text-sm text-[rgba(0,0,0,0.6)]">Or manual import</span>
                </div>
              </div>

              <label className="border-2 border-dashed border-[#D6D3CB] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#F2F0EA] transition-colors cursor-pointer group">
                <UploadCloud size={32} className="text-[rgba(0,0,0,0.4)] group-hover:text-[#050505] transition-colors mb-3" />
                <span className="font-medium mb-1">Upload CSV File</span>
                <span className="text-sm text-[rgba(0,0,0,0.6)]">Orders, Returns, Inventory</span>
                <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Set Your Growth Goal</h2>
                <p className="text-[rgba(0,0,0,0.6)]">Karobaar AI works best when we know what you're aiming for.</p>
              </div>
              
              <div className="space-y-8 py-8">
                <div>
                  <label className="flex justify-between text-sm font-medium mb-4">
                    <span>Monthly Revenue Target</span>
                    <span className="text-[#050505] text-xl font-bold">₹{goals.monthly_revenue_goal.toLocaleString()}</span>
                  </label>
                  <input type="range" min="10000" max="10000000" step="10000" value={goals.monthly_revenue_goal} onChange={(e) => setGoals({...goals, monthly_revenue_goal: parseInt(e.target.value)})} className="w-full h-2 bg-[#E8E6DF] rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]" />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium mb-4">
                    <span>Target Net Profit Margin</span>
                    <span className="text-[#050505] text-xl font-bold">{goals.target_margin_percent}%</span>
                  </label>
                  <input type="range" min="5" max="50" value={goals.target_margin_percent} onChange={(e) => setGoals({...goals, target_margin_percent: parseInt(e.target.value)})} className="w-full h-2 bg-[#E8E6DF] rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Baseline Your Costs</h2>
                <p className="text-[rgba(0,0,0,0.6)]">We'll use these defaults to calculate your real profit if specific product data is missing.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[rgba(0,0,0,0.8)] mb-2">Avg. Platform Fee (%)</label>
                  <input type="number" value={costs.platform_fee_percent} onChange={(e) => setCosts({...costs, platform_fee_percent: parseFloat(e.target.value)})} className="w-full bg-[#E8E6DF] border border-[rgba(212,163,115,0.2)] rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#050505] outline-none text-[#050505]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[rgba(0,0,0,0.8)] mb-2">Avg. Shipping Cost (₹)</label>
                  <input type="number" value={costs.avg_shipping_cost} onChange={(e) => setCosts({...costs, avg_shipping_cost: parseFloat(e.target.value)})} className="w-full bg-[#E8E6DF] border border-[rgba(212,163,115,0.2)] rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#050505] outline-none text-[#050505]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[rgba(0,0,0,0.8)] mb-2">Avg. Packaging Cost (₹)</label>
                  <input type="number" value={costs.packaging_cost} onChange={(e) => setCosts({...costs, packaging_cost: parseFloat(e.target.value)})} className="w-full bg-[#E8E6DF] border border-[rgba(212,163,115,0.2)] rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#050505] outline-none text-[#050505]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[rgba(0,0,0,0.8)] mb-2">Monthly Ads Budget (₹)</label>
                  <input type="number" value={costs.monthly_ads_budget} onChange={(e) => setCosts({...costs, monthly_ads_budget: parseFloat(e.target.value)})} className="w-full bg-[#E8E6DF] border border-[rgba(212,163,115,0.2)] rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#050505] outline-none text-[#050505]" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-between items-center">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : router.push('/')}
              className="px-6 py-2 rounded-lg font-medium text-[rgba(0,0,0,0.6)] hover:text-[#050505] transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#050505] text-[#F2F0EA] px-8 py-3 rounded-lg font-medium transition-all shadow-md disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{step === 3 ? 'Go to Dashboard' : 'Continue'} <ArrowRight size={18} /></>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
