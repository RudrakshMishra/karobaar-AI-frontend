'use client';
import React from 'react';
import { Search, DownloadCloud, Filter } from 'lucide-react';

const mockOrders = [
  { id: '#ORD-9012', customer: 'Rahul Sharma', date: 'Oct 24, 2023', status: 'Delivered', amount: '₹4,500', channel: 'Shopify' },
  { id: '#ORD-9013', customer: 'Priya Patel', date: 'Oct 24, 2023', status: 'Processing', amount: '₹12,200', channel: 'Amazon' },
  { id: '#ORD-9014', customer: 'Amit Singh', date: 'Oct 23, 2023', status: 'Shipped', amount: '₹8,900', channel: 'Shopify' },
  { id: '#ORD-9015', customer: 'Neha Gupta', date: 'Oct 23, 2023', status: 'Delivered', amount: '₹3,400', channel: 'Flipkart' },
  { id: '#ORD-9016', customer: 'Vikram Verma', date: 'Oct 22, 2023', status: 'Cancelled', amount: '₹5,500', channel: 'Shopify' },
  { id: '#ORD-9017', customer: 'Sonia Desai', date: 'Oct 22, 2023', status: 'Delivered', amount: '₹1,200', channel: 'Amazon' },
];

export default function OrdersPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-bg p-8 overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
         <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-[#050505] mb-2">Orders Management</h1>
            <p className="text-text-muted text-[14px]">View and process your recent multi-channel orders.</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex items-center bg-card2 border border-black/5 rounded-lg px-3 py-2 w-64 focus-within:border-black/20 transition-all">
              <Search size={14} className="text-text-muted mr-2" />
              <input type="text" placeholder="Search Order ID, Customer..." className="bg-transparent border-none text-[13px] outline-none w-full text-[#050505] placeholder-text-muted"/>
            </div>
            <button className="flex items-center gap-2 bg-card2 border border-black/5 rounded-lg px-4 py-2 text-[13px] font-medium text-text-primary hover:bg-[#1A1A1A]/5 transition-colors">
              <Filter size={14} /> Filter
            </button>
         </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-card border border-black/5 rounded-2xl flex flex-col flex-1">
         <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-[#050505]">Recent Orders</h3>
            <button className="btn-ghost text-[13px] px-4 py-2 flex items-center gap-2"><DownloadCloud size={14} /> Export CSV</button>
         </div>
         
         <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 text-[12px] text-text-faint font-medium">
                  <th className="p-5 font-normal">Order ID</th>
                  <th className="p-5 font-normal">Customer</th>
                  <th className="p-5 font-normal">Date</th>
                  <th className="p-5 font-normal">Status</th>
                  <th className="p-5 font-normal">Amount</th>
                  <th className="p-5 font-normal">Channel</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[#050505]">
                {mockOrders.map((row, i) => (
                  <tr key={i} className="border-b border-black/5 hover:bg-[#1A1A1A]/5 transition-colors cursor-pointer group">
                    <td className="p-5 font-medium text-[#050505]">{row.id}</td>
                    <td className="p-5 text-text-muted">{row.customer}</td>
                    <td className="p-5 text-text-muted">{row.date}</td>
                    <td className="p-5">
                       <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                         row.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                         row.status === 'Processing' ? 'bg-amber-500/10 text-amber-500' :
                         row.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' :
                         'bg-red-500/10 text-red-500'
                       }`}>
                         {row.status}
                       </span>
                    </td>
                    <td className="p-5 font-mono text-accent">{row.amount}</td>
                    <td className="p-5 font-medium">
                       <span className="font-mono text-[11px] uppercase tracking-wider bg-[#1A1A1A]/5 px-2 py-1 rounded border border-black/10">{row.channel}</span>
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
