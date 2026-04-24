"use client";

import { useState } from "react";
import { Package, MoreHorizontal, TrendingUp, TrendingDown, Edit3, X, Check, Download } from "lucide-react";

const INITIAL_PRODUCTS = [
  { id: "SKU-001", name: "Noise Cancelling Earbuds PRO", price: 2999, cost: 850, stock: 450, trend: "up", margin: 71 },
  { id: "SKU-002", name: "Smart Fitness Watch Ultra", price: 1999, cost: 700, stock: 120, trend: "up", margin: 65 },
  { id: "SKU-003", name: "Ergonomic Office Chair X1", price: 8500, cost: 4200, stock: 15, trend: "down", margin: 50 },
  { id: "SKU-004", name: "Mechanic Keyboard RGB", price: 3499, cost: 1200, stock: 85, trend: "up", margin: 65 },
  { id: "SKU-005", name: "Wireless Charging Pad", price: 999, cost: 300, stock: 890, trend: "down", margin: 70 },
  { id: "SKU-006", name: "Gaming Mouse 10k DPI", price: 1499, cost: 600, stock: 0, trend: "down", margin: 60 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Modal Form State
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCost, setNewCost] = useState("");
  const [newStock, setNewStock] = useState("");

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      // 1. Generate CSV Headers
      const headers = ["ID", "Name", "Selling Price (INR)", "Unit Cost (INR)", "Stock", "Est Margin (%)"];
      
      // 2. Map data
      const csvRows = products.map(p => 
        `"${p.id}","${p.name}",${p.price},${p.cost},${p.stock},${p.margin}`
      );
      
      // 3. Construct blob
      const csvContent = [headers.join(","), ...csvRows].join("\\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // 4. Trigger Native Browser Download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `karobaar_products_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 600);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice || !newCost) return;
    
    const priceNum = parseInt(newPrice) || 0;
    const costNum = parseInt(newCost) || 0;
    // Calculate margin safely
    const marginCalc = priceNum > 0 ? Math.round(((priceNum - costNum) / priceNum) * 100) : 0;

    const newProduct = {
      id: `SKU-00${products.length + 1}`,
      name: newName,
      price: priceNum,
      cost: costNum,
      stock: parseInt(newStock) || 0,
      trend: "up",
      margin: marginCalc > 0 ? marginCalc : 0
    };

    setProducts([newProduct, ...products]);
    setIsAddModalOpen(false);
    
    // Reset
    setNewName(""); setNewPrice(""); setNewCost(""); setNewStock("");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] p-6 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <div>
          <h1 className="text-2xl font-bold text-[#050505] flex items-center gap-3">
            <Package className="text-[#050505]" /> Product Intelligence
          </h1>
          <p className="text-[rgba(0,0,0,0.6)] text-sm mt-1">Manage your catalog, pricing, and view item-level profitability.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="bg-[#E8E6DF] border border-[rgba(0,0,0,0.1)] text-[#050505] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#D6D3CB] transition-colors flex items-center gap-2"
          >
            {isExporting ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> : <Download size={16} />}
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#333333] transition-colors shadow-sm"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#D6D3CB] bg-[#E8E6DF] text-[11px] uppercase tracking-wider text-[rgba(0,0,0,0.6)] font-bold">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">SKU Info</th>
                <th className="p-4 text-right">Selling Price</th>
                <th className="p-4 text-right">Unit Cost</th>
                <th className="p-4 text-center">Est. Margin</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.08)]">
              {products.map((prod, idx) => {
                const isOutOfStock = prod.stock === 0;
                const isLowStock = prod.stock > 0 && prod.stock < 50;

                return (
                  <tr key={prod.id} className="hover:bg-[rgba(0,0,0,0.02)] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.08)] flex items-center justify-center font-bold text-[10px] text-[rgba(0,0,0,0.3)]">
                          IMG
                        </div>
                        <span className="font-bold text-sm text-[#050505] truncate max-w-[200px]">{prod.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono text-[rgba(0,0,0,0.4)] bg-[#E8E6DF] px-2 py-1 border border-[#D6D3CB] rounded">{prod.id}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {prod.trend === "up" ? <TrendingUp className="text-[#050505] w-3 h-3" /> : <TrendingDown className="text-[#FF4D4D] w-3 h-3" />}
                        <span className="font-bold text-[#050505] text-sm">₹{prod.price.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-[rgba(0,0,0,0.6)] font-medium text-sm">
                      ₹{prod.cost.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-bold text-[#050505] text-sm">{prod.margin}%</span>
                        <div className="w-16 h-1 mt-1.5 bg-[rgba(0,0,0,0.1)] rounded overflow-hidden">
                           <div className="h-full bg-[#1A1A1A] rounded transition-all duration-500" style={{ width: `${prod.margin}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {isOutOfStock ? (
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#FF4D4D] bg-[#FF4D4D]/10 px-2 py-1 rounded">Stock Out</span>
                      ) : isLowStock ? (
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#FFA500] bg-[#FFA500]/10 px-2 py-1 rounded">{prod.stock} Left</span>
                      ) : (
                        <span className="text-[10px] text-[#050505]/60 font-bold">{prod.stock} units</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-[rgba(0,0,0,0.04)] rounded hover:bg-[rgba(0,0,0,0.1)] hover:text-[#050505] transition-colors text-[rgba(0,0,0,0.6)]">
                           <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 bg-[rgba(0,0,0,0.04)] rounded hover:bg-[rgba(0,0,0,0.1)] hover:text-[#050505] transition-colors text-[rgba(0,0,0,0.6)]">
                           <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL OVERLAY */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-[#FAF9F6] w-full max-w-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#D6D3CB] overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between p-5 border-b border-[#D6D3CB] bg-[#FFFFFF]">
                 <h2 className="font-bold text-[#050505] text-lg">Add New Product</h2>
                 <button onClick={() => setIsAddModalOpen(false)} className="text-[rgba(0,0,0,0.4)] hover:text-[#050505] transition-colors">
                   <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleCreateProduct} className="p-6 space-y-5">
                 <div>
                   <label className="text-[11px] uppercase tracking-widest font-bold text-[rgba(0,0,0,0.6)] mb-1 block">Product Name</label>
                   <input 
                     autoFocus
                     value={newName} onChange={e => setNewName(e.target.value)}
                     className="w-full bg-[#FFFFFF] border border-[#D6D3CB] px-4 py-2.5 rounded-lg text-sm text-[#050505] outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-all" 
                     placeholder="e.g. Wireless Charger V2" 
                     required 
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[11px] uppercase tracking-widest font-bold text-[rgba(0,0,0,0.6)] mb-1 block">Selling Price (₹)</label>
                     <input 
                       type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)}
                       className="w-full bg-[#FFFFFF] border border-[#D6D3CB] px-4 py-2.5 rounded-lg text-sm text-[#050505] outline-none focus:border-[#1A1A1A] transition-all" 
                       placeholder="2,999" 
                       required 
                     />
                   </div>
                   <div>
                     <label className="text-[11px] uppercase tracking-widest font-bold text-[rgba(0,0,0,0.6)] mb-1 block">Unit Cost (₹)</label>
                     <input 
                       type="number" value={newCost} onChange={e => setNewCost(e.target.value)}
                       className="w-full bg-[#FFFFFF] border border-[#D6D3CB] px-4 py-2.5 rounded-lg text-sm text-[#050505] outline-none focus:border-[#1A1A1A] transition-all" 
                       placeholder="1,200" 
                       required 
                     />
                   </div>
                 </div>

                 <div>
                   <label className="text-[11px] uppercase tracking-widest font-bold text-[rgba(0,0,0,0.6)] mb-1 block">Initial Stock Level</label>
                   <input 
                     type="number" value={newStock} onChange={e => setNewStock(e.target.value)}
                     className="w-full bg-[#FFFFFF] border border-[#D6D3CB] px-4 py-2.5 rounded-lg text-sm text-[#050505] outline-none focus:border-[#1A1A1A] transition-all" 
                     placeholder="100" 
                     required 
                   />
                 </div>

                 <button type="submit" className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl font-bold mt-4 shadow-sm hover:bg-[#333333] transition-colors flex items-center justify-center gap-2">
                   <Check size={18} /> Save & Track Matrix
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
