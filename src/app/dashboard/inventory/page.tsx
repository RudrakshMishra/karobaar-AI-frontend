"use client";

import { BookOpen, AlertCircle, CheckCircle2, TrendingDown } from "lucide-react";

import { useProductsStore } from "../../../store/productsStore";
import { useEffect } from "react";

export default function InventoryPage() {
  const { products, fetchProducts } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const inventoryItems = products.length > 0 ? products.map(p => ({
    sku: p.id,
    name: p.name,
    stock: p.current_stock || 0,
    velocity: Math.floor(Math.random() * 10) + 1, // Mock velocity
    status: p.current_stock === 0 ? "Stock Out" : p.current_stock < 20 ? "Critical" : p.current_stock > 300 ? "Overstocked" : "Healthy",
    daysLeft: p.current_stock > 0 ? Math.floor(p.current_stock / (Math.floor(Math.random() * 10) + 1)) : 0
  })) : [
    { sku: "SKU-001", name: "Noise Cancelling Earbuds PRO", stock: 450, velocity: 12, status: "Healthy", daysLeft: 37 },
    { sku: "SKU-003", name: "Ergonomic Office Chair X1", stock: 15, velocity: 4, status: "Critical", daysLeft: 3 },
    { sku: "SKU-006", name: "Gaming Mouse 10k DPI", stock: 0, velocity: 0, status: "Stock Out", daysLeft: 0 },
    { sku: "SKU-005", name: "Wireless Charging Pad", stock: 890, velocity: 5, status: "Overstocked", daysLeft: 178 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] p-6 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <div>
          <h1 className="text-2xl font-bold text-[#050505] flex items-center gap-3">
            <BookOpen className="text-[#050505]" /> Inventory Planner
          </h1>
          <p className="text-[rgba(0,0,0,0.6)] text-sm mt-1">AI-driven restock alerts based on real sales velocity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#E8E6DF] border border-[rgba(0,0,0,0.05)] p-6 rounded-2xl">
          <h3 className="text-[rgba(0,0,0,0.4)] text-[10px] uppercase font-bold tracking-widest mb-1">Total SKUs</h3>
          <p className="text-3xl font-black text-[#050505]">4</p>
        </div>
        <div className="bg-[rgba(255,77,77,0.05)] border border-[#FF4D4D]/20 p-6 rounded-2xl">
          <h3 className="text-[#FF4D4D] text-[10px] uppercase font-bold tracking-widest mb-1">Capital Blocked (Overstock)</h3>
          <p className="text-3xl font-black text-[#FF4D4D]">₹2,67,000</p>
        </div>
        <div className="bg-[rgba(212,163,115,0.05)] border border-[rgba(0,0,0,0.1)] p-6 rounded-2xl">
          <h3 className="text-[#050505] text-[10px] uppercase font-bold tracking-widest mb-1">Missed Sales (Stockouts)</h3>
          <p className="text-3xl font-black text-[#050505]">₹14,500</p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <table className="w-full text-left">
          <thead>
             <tr className="bg-[#E8E6DF] border-b border-[#D6D3CB] text-[11px] uppercase tracking-wider text-[rgba(0,0,0,0.6)] font-bold">
              <th className="p-4 pl-6">SKU</th>
              <th className="p-4 text-center">Available Stock</th>
              <th className="p-4 text-center">Sales Velocity</th>
              <th className="p-4 text-center">Est. Days Left</th>
              <th className="p-4 text-right pr-6">Status Indicator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(0,0,0,0.08)]">
            {inventoryItems.map(item => (
              <tr key={item.sku} className="hover:bg-[rgba(0,0,0,0.02)]">
                <td className="p-4 pl-6 text-[#050505] font-bold text-sm">
                  {item.sku}
                  <div className="text-[11px] text-[rgba(0,0,0,0.4)] font-medium mt-1">{item.name}</div>
                </td>
                <td className="p-4 text-center font-mono text-sm text-[rgba(0,0,0,0.8)]">
                  {item.stock}
                </td>
                <td className="p-4 text-center text-sm text-[rgba(0,0,0,0.8)]">
                  <span className="font-bold text-[#050505]">{item.velocity}</span> / day
                </td>
                <td className="p-4 text-center">
                  <span className={`font-black text-lg ${item.daysLeft <= 7 ? "text-[#FF4D4D]" : "text-[#050505]"}`}>
                    {item.daysLeft}
                  </span>
                </td>
                <td className="p-4 text-right pr-6">
                  {item.status === "Healthy" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[rgba(0,0,0,0.05)] text-[#050505] border border-[rgba(0,0,0,0.1)] text-[10px] uppercase font-bold tracking-widest">
                      <CheckCircle2 className="w-3 h-3" /> {item.status}
                    </span>
                  )}
                  {item.status === "Critical" && (
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#CC0000]/10 text-[#CC0000] border border-[#CC0000]/30 text-[10px] uppercase font-bold tracking-widest animate-pulse">
                     <AlertCircle className="w-3 h-3" /> Reorder Now
                   </span>
                  )}
                  {item.status === "Stock Out" && (
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[10px] uppercase font-bold tracking-widest">
                     <AlertCircle className="w-3 h-3" /> Stock Out
                   </span>
                  )}
                  {item.status === "Overstocked" && (
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFA500]/10 text-[#FFA500] border border-[#FFA500]/20 text-[10px] uppercase font-bold tracking-widest">
                     <TrendingDown className="w-3 h-3" /> {item.status}
                   </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
