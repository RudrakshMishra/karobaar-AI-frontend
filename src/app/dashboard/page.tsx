'use client';

import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell
} from 'recharts';
import { Search, SlidersHorizontal, Settings2, DownloadCloud, Plus, AlertTriangle } from 'lucide-react';

const perfData = [
  { name: 'Jan', line1: 40000, line2: 24000 }, { name: 'Feb', line1: 30000, line2: 13000 },
  { name: 'Mar', line1: 20000, line2: 48000 }, { name: 'Apr', line1: 27000, line2: 39000 },
  { name: 'May', line1: 18000, line2: 48000 }, { name: 'Jun', line1: 23000, line2: 38000 },
  { name: 'Jul', line1: 34000, line2: 43000 }, { name: 'Aug', line1: 44000, line2: 23000 },
  { name: 'Sep', line1: 38000, line2: 18000 }, { name: 'Oct', line1: 52000, line2: 41000 },
  { name: 'Nov', line1: 60000, line2: 55000 }, { name: 'Dec', line1: 75000, line2: 62000 },
];

const dynData = [
  { name: 'Mon', val: 300 }, { name: 'Tue', val: 400 }, { name: 'Wed', val: 250 },
  { name: 'Thu', val: 500 }, { name: 'Fri', val: 350 }, { name: 'Sat', val: 800 },
  { name: 'Sun', val: 450 }
];

export default function DashboardPage() {
  const [activeDyn, setActiveDyn] = useState(5);
  const [profitTimeframe, setProfitTimeframe] = useState('12 months');
  const [orderTimeframe, setOrderTimeframe] = useState('Weekly');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] p-8 md:p-12 overflow-y-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
         <div>
            <h1 className="text-[32px] font-bold tracking-tight mb-2">Business Overview</h1>
            <p className="text-[#050505]/40 text-[14px]">Performance across all connected channels</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex items-center border-b border-black/10 px-3 py-2 w-64 focus-within:border-accent transition-all">
              <Search size={14} className="text-[#050505]/30 mr-2" />
              <input type="text" placeholder="Search SKUs..." className="bg-transparent border-none text-[13px] outline-none w-full text-[#050505] placeholder:text-[#050505]/20"/>
            </div>
            <button className="px-4 py-2 rounded-lg border border-black/10 text-[12px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A]/5 transition-all">
              Filter
            </button>
            <button className="px-4 py-2 rounded-lg bg-accent text-[#050505] text-[12px] font-bold uppercase tracking-wider hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(124,90,247,0.2)]">
              Export
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-16 border-t border-l border-black/10">
         
         {/* Performance Insights */}
         <div className="lg:col-span-2 bg-[#1A1A1A]/[0.01] border-r border-black/10 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050505]/30">Revenue & Profit</span>
               <div className="flex items-center gap-2">
                 <select className="bg-transparent text-[11px] font-bold text-[#050505]/60 outline-none border-b border-black/10 cursor-pointer uppercase tracking-widest">
                   <option>All Platforms</option>
                   <option>Shopify</option>
                   <option>Amazon</option>
                 </select>
               </div>
            </div>
            <div className="flex items-end justify-between mb-8">
               <h3 className="text-2xl font-bold">Profit Margins</h3>
            </div>
            
            <div className="flex items-center justify-between mb-8">
               <div className="flex gap-4 text-[12px]">
                 {['12 months', '6 months', '30 days', '7 days', '24 hours'].map((item) => (
                   <button 
                     key={item} 
                     onClick={() => setProfitTimeframe(item)}
                     className={profitTimeframe === item ? "text-[#050505] font-medium" : "text-text-muted hover:text-[#050505] transition-colors cursor-pointer"}
                   >
                     {item}
                   </button>
                 ))}
               </div>
               <div className="flex gap-4 text-[12px]">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Real Profit</span>
                  <span className="flex items-center gap-1.5 text-text-muted"><span className="w-1.5 h-1.5 rounded-full bg-text-muted"></span> Total Revenue</span>
               </div>
            </div>

            <div className="w-full flex-1 min-h-[220px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={perfData}>
                    <defs>
                      <filter id="glowAccent"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-faint)" tick={{fill: 'rgba(0,0,0,0.3)', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} 
                      itemStyle={{ color: '#050505', fontWeight: 'bold' }}
                      formatter={(val) => `₹${val}`}
                    />
                    {/* Revenue Line */}
                    <Line type="monotone" dataKey="line1" stroke="rgba(0,0,0,0.2)" strokeWidth={2} dot={false} />
                    {/* Profit Line (Black) */}
                    <Line type="monotone" dataKey="line2" stroke="#050505" strokeWidth={3} dot={false} filter="url(#glowAccent)" />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Market Dynamics */}
         <div className="bg-[#1A1A1A]/[0.01] border-r border-black/10 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050505]/30">Orders</span>
               <button className="text-[10px] font-bold uppercase tracking-widest text-accent">Expand</button>
            </div>
            <h3 className="text-2xl font-bold mb-12">Daily Volume</h3>
            
            <div className="flex gap-4 text-[11px] font-bold uppercase tracking-widest mb-8 border-b border-black/5 pb-4">
                 {['Monthly', 'Weekly', 'Daily'].map((item) => (
                   <button 
                     key={item} 
                     onClick={() => setOrderTimeframe(item)}
                     className={orderTimeframe === item ? "text-accent border-b border-accent pb-4 -mb-[17px]" : "text-[#050505]/30 hover:text-[#050505] transition-colors cursor-pointer"}
                   >
                     {item}
                   </button>
                 ))}
            </div>

            <div className="w-full flex-1 min-h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="rgba(0,0,0,0.2)" tick={{fill: '#050505', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      itemStyle={{ color: '#050505', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="val" radius={[4,4,0,0]} barSize={24}>
                      {dynData.map((entry, index) => (
                        <Cell 
                           key={`cell-${index}`} 
                           fill={index === activeDyn ? '#050505' : 'rgba(0,0,0,0.1)'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* TABLE ROW */}
      <div className="bg-[#1A1A1A]/[0.01] border-t border-l border-black/10 p-0 flex flex-col flex-1">
         <div className="p-8 border-b border-black/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#050505]/30 mb-2 block">SKU Analytics</span>
              <h3 className="text-2xl font-bold">Top Performing Products</h3>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-black/10 text-[12px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A]/5 transition-all">Export</button>
              <button className="px-5 py-2 rounded-lg bg-accent text-[#050505] text-[12px] font-bold uppercase tracking-wider hover:bg-accent/90 transition-all">Add SKU</button>
            </div>
         </div>
         
         <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#050505]/30">
                  <th className="p-6 font-normal">Product Name</th>
                  <th className="p-6 font-normal">Revenue</th>
                  <th className="p-6 font-normal">Margin</th>
                  <th className="p-6 font-normal">Stock Level</th>
                  <th className="p-6 font-normal">Action Insight</th>
                </tr>
              </thead>
              <tbody className="text-[14px] text-[#050505]">
                {[
                  { asset: 'Men\'s Polo T-Shirt', img: 'M', rev: '₹45,200', margin: '+22.4%', stock: '45 Units', stockWarning: false, action: 'Increase Ads' },
                  { asset: 'Ethnic Cotton Kurti', img: 'K', rev: '₹82,400', margin: '+34.2%', stock: '3 Units', stockWarning: true, action: 'Urgent Restock' },
                  { asset: 'Wireless Earbuds Pro', img: 'E', rev: '₹12,100', margin: '+8.1%', stock: '420 Units', stockWarning: false, action: 'Lower Price' },
                  { asset: 'Gaming Keyboard RGB', img: 'G', rev: '₹34,800', margin: '+18.5%', stock: '12 Units', stockWarning: true, action: 'Bundle Offer' },
                  { asset: 'Smart Watch Black', img: 'S', rev: '₹1,15,000', margin: '+42.1%', stock: '85 Units', stockWarning: false, action: 'Scale Campaign' },
                  { asset: 'Yoga Mat Premium', img: 'Y', rev: '₹9,200', margin: '+28.5%', stock: '150 Units', stockWarning: false, action: 'Pause Ads' },
                  { asset: 'Running Shoes X1', img: 'R', rev: '₹56,400', margin: '+31.0%', stock: '8 Units', stockWarning: true, action: 'Price Increase' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-black/5 hover:bg-[#1A1A1A]/[0.02] transition-colors cursor-pointer group">
                    <td className="p-6">
                       <span className="font-bold text-[#050505]/90">{row.asset}</span>
                    </td>
                    <td className="p-6 text-[#050505]/50 font-medium">{row.rev}</td>
                    <td className={`p-6 font-bold text-green`}>{row.margin}</td>
                    <td className="p-6">
                       {row.stockWarning ? (
                          <span className="text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-[11px] font-bold">
                            {row.stock} LOW
                          </span>
                       ) : (
                          <span className="text-[#050505]/30 text-[13px]">{row.stock}</span>
                       )}
                    </td>
                    <td className="p-6">
                       <span className="text-[11px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 rounded inline-block">{row.action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
