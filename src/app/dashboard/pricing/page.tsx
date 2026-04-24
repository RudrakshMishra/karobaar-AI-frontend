'use client';
import React from 'react';
import { Target, TrendingUp, TrendingDown, CheckCircle, Sparkles, Activity } from 'lucide-react';

const products = [
  { 
    id: 1, 
    name: 'Premium Yoga Mat', 
    currentPrice: 599, 
    suggestedPrice: 649, 
    marginChange: '+8.3%', 
    reasoning: 'Competitor "FitLife" is out of stock. Demand increased by 15% this week.',
    color: 'text-success', bg: 'bg-success/10'
  },
  { 
    id: 2, 
    name: 'Wireless Earbuds Pro', 
    currentPrice: 1299, 
    suggestedPrice: 1199, 
    marginChange: '-4.1%', 
    reasoning: 'Conversion rate dropped 22%. Lowering price puts you back in the Buy Box.',
    color: 'text-danger', bg: 'bg-danger/10'
  },
  { 
    id: 3, 
    name: 'Stainless Water Bottle', 
    currentPrice: 399, 
    suggestedPrice: 429, 
    marginChange: '+7.5%', 
    reasoning: 'High sell-through rate. Elasticity model suggests volume will remain stable.',
    color: 'text-success', bg: 'bg-success/10'
  },
  { 
    id: 4, 
    name: 'Ergonomic Mouse', 
    currentPrice: 899, 
    suggestedPrice: 899, 
    marginChange: '0%', 
    reasoning: 'Price is perfectly optimized for current market conditions.',
    color: 'text-gray-400', bg: 'bg-[#1A1A1A]/5'
  },
];

export default function PricingEnginePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#050505] mb-2">AI Pricing Engine</h1>
          <p className="text-gray-400">Dynamic pricing recommendations based on demand, competitors, and elasticity.</p>
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-[#050505] px-4 py-2 rounded-lg font-medium transition-colors shadow-md">
          <CheckCircle size={18} /> Apply All Optimizations
        </button>
      </div>

      <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background">
            <tr className="text-gray-400 border-b border-gray-800 text-sm">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Current Price</th>
              <th className="p-4 font-medium">AI Suggestion</th>
              <th className="p-4 font-medium">Expected Margin</th>
              <th className="p-4 font-medium w-1/3">AI Reasoning</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-[#1A1A1A]/5 transition-colors group">
                <td className="p-4 font-medium text-[#050505]">{p.name}</td>
                <td className="p-4 text-gray-400">₹{p.currentPrice}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-[#050505] font-bold">
                    ₹{p.suggestedPrice}
                    {p.suggestedPrice > p.currentPrice && <TrendingUp size={14} className="text-success" />}
                    {p.suggestedPrice < p.currentPrice && <TrendingDown size={14} className="text-danger" />}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs gap-1 font-medium ${p.bg} ${p.color}`}>
                    {p.marginChange}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <Sparkles size={14} className="text-accent mt-1 flex-shrink-0" />
                    {p.reasoning}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-[#050505] bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 rounded-md transition-colors" title="View History">
                      <Activity size={16} />
                    </button>
                    {p.suggestedPrice !== p.currentPrice ? (
                      <button className="bg-[#1A1A1A]/10 hover:bg-[#1A1A1A]/20 text-[#050505] px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-gray-700">
                        Apply Suggestion
                      </button>
                    ) : (
                      <button disabled className="bg-transparent text-gray-500 px-3 py-1.5 rounded-md text-sm font-medium cursor-not-allowed">
                        Optimized
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
