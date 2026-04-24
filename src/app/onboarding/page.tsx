'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, UploadCloud, CheckCircle, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center py-20 px-6">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 rounded-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent rounded-full z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= num ? 'bg-accent text-[#050505] shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-card text-gray-500 border border-gray-800'
                }`}
              >
                {step > num ? <CheckCircle size={20} /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <span>Connect Data</span>
            <span>Set Goals</span>
            <span>Cost Baseline</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-card border border-gray-800 rounded-2xl p-8 shadow-xl">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-heading mb-2">Connect Your Store</h2>
                <p className="text-gray-400">Import your orders to get AI-powered insights instantly.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-6 border border-gray-800 rounded-xl hover:border-accent hover:bg-accent/5 transition-all outline-none">
                  <ShoppingBag size={32} className="text-[#95BF47] mb-3" />
                  <span className="font-medium">Shopify</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 border border-gray-800 rounded-xl hover:border-accent hover:bg-accent/5 transition-all outline-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-accent text-[#050505] text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg">Coming Soon</div>
                  <span className="text-3xl font-bold text-[#FF9900] mb-3">a</span>
                  <span className="font-medium text-gray-400">Amazon</span>
                </button>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-4 text-sm text-gray-500">Or manual import</span>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#1A1A1A]/5 transition-colors cursor-pointer group">
                <UploadCloud size={32} className="text-gray-400 group-hover:text-accent transition-colors mb-3" />
                <span className="font-medium mb-1">Upload CSV File</span>
                <span className="text-sm text-gray-500">Orders, Returns, Inventory</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-heading mb-2">Set Your Growth Goal</h2>
                <p className="text-gray-400">DataPulse works best when we know what you're aiming for.</p>
              </div>
              
              <div className="space-y-8 py-8">
                <div>
                  <label className="flex justify-between text-sm font-medium mb-4">
                    <span>Monthly Revenue Target</span>
                    <span className="text-accent text-xl font-bold font-heading">₹5,00,000</span>
                  </label>
                  <input type="range" min="10000" max="10000000" defaultValue="500000" className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-accent" />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium mb-4">
                    <span>Target Net Profit Margin</span>
                    <span className="text-success text-xl font-bold font-heading">20%</span>
                  </label>
                  <input type="range" min="5" max="50" defaultValue="20" className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-success" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-heading mb-2">Baseline Your Costs</h2>
                <p className="text-gray-400">We'll use these defaults to calculate your real profit if specific product data is missing.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Avg. Platform Fee (%)</label>
                  <input type="number" defaultValue="15" className="w-full bg-background border border-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Avg. Shipping Cost (₹)</label>
                  <input type="number" defaultValue="70" className="w-full bg-background border border-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Avg. Packaging Cost (₹)</label>
                  <input type="number" defaultValue="20" className="w-full bg-background border border-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Monthly Ads Budget (₹)</label>
                  <input type="number" defaultValue="50000" className="w-full bg-background border border-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent outline-none" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-between items-center">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : router.push('/')}
              className="px-6 py-2 rounded-lg font-medium text-gray-400 hover:text-[#050505] transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-[#050505] px-8 py-3 rounded-lg font-medium transition-all shadow-md"
            >
              {step === 3 ? 'Go to Dashboard' : 'Continue'} <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
