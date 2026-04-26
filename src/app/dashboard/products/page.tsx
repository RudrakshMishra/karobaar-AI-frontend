"use client";

import { useState, useEffect } from "react";
import { Package, Trash2, TrendingUp, TrendingDown, Edit3, X, Check, Download, Loader2 } from "lucide-react";
import { useProductsStore } from "../../../store/productsStore";
import api from "../../../lib/api";

export default function ProductsPage() {
  const { products, isLoading, fetchProducts } = useProductsStore();
  const [localProducts, setLocalProducts] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length > 0) {
      setLocalProducts(products);
    } else if (!isLoading) {
      // Add dummy data when the store is empty
      setLocalProducts([
        { id: "SKU-1001", name: "Noise Cancelling Earbuds PRO", current_price: 2999, cost: 1200, current_stock: 145, margin_percent: 60, trend: "up" },
        { id: "SKU-1002", name: "Ergonomic Office Chair X1", current_price: 8499, cost: 4500, current_stock: 12, margin_percent: 47, trend: "down" },
        { id: "SKU-1003", name: "Mechanic Keyboard RGB", current_price: 3499, cost: 1800, current_stock: 0, margin_percent: 48, trend: "up" },
        { id: "SKU-1004", name: "Smart Fitness Watch", current_price: 1999, cost: 800, current_stock: 250, margin_percent: 60, trend: "up" },
        { id: "SKU-1005", name: "Wireless Charging Pad", current_price: 999, cost: 400, current_stock: 30, margin_percent: 60, trend: "down" },
        { id: "SKU-1006", name: "Premium Leather Wallet", current_price: 1499, cost: 500, current_stock: 85, margin_percent: 66, trend: "up" }
      ]);
    }
  }, [products, isLoading]);
  
  // Modal Form State
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCost, setNewCost] = useState("");
  const [newStock, setNewStock] = useState("");

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ["ID", "Name", "Selling Price (INR)", "Unit Cost (INR)", "Stock"];
      const csvRows = localProducts.map(p => `"${p.id}","${p.name}",${p.current_price || 0},${p.cost || 0},${p.current_stock || 0}`);
      const csvContent = [headers.join(","), ...csvRows].join("\\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `karobaar_products_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice || !newCost) return;
    
    const priceNum = parseInt(newPrice) || 0;
    const costNum = parseInt(newCost) || 0;
    const stockNum = parseInt(newStock) || 0;
    const margin = priceNum > 0 ? Math.round(((priceNum - costNum) / priceNum) * 100) : 0;

    if (editingProduct) {
      setLocalProducts(localProducts.map(p => p.id === editingProduct.id ? {
        ...p,
        name: newName,
        current_price: priceNum,
        cost: costNum,
        current_stock: stockNum,
        margin_percent: margin
      } : p));
    } else {
      const newProduct = {
        id: `mock-${Date.now()}`,
        name: newName,
        current_price: priceNum,
        cost: costNum,
        current_stock: stockNum,
        margin_percent: margin
      };
      setLocalProducts([newProduct, ...localProducts]);
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
    setNewName(""); setNewPrice(""); setNewCost(""); setNewStock("");
  };

  const handleEditClick = (prod: any) => {
    setEditingProduct(prod);
    setNewName(prod.name);
    setNewPrice(prod.current_price?.toString() || "");
    setNewCost(prod.cost?.toString() || "");
    setNewStock(prod.current_stock?.toString() || "");
    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    setLocalProducts(localProducts.filter(p => p.id !== id));
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setNewName(""); setNewPrice(""); setNewCost(""); setNewStock("");
    setIsAddModalOpen(true);
  };

  if (isLoading && localProducts.length === 0) {
    return <div className="flex-1 flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

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
            onClick={handleAddClick}
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
              {localProducts.map((prod: any, idx: number) => {
                const isOutOfStock = prod.current_stock === 0;
                const isLowStock = prod.current_stock > 0 && prod.current_stock < 50;

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
                      <span className="text-xs font-mono text-[rgba(0,0,0,0.4)] bg-[#E8E6DF] px-2 py-1 border border-[#D6D3CB] rounded">{prod.id || `SKU-${idx}`}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {prod.trend === "up" ? <TrendingUp className="text-[#050505] w-3 h-3" /> : <TrendingDown className="text-[#FF4D4D] w-3 h-3" />}
                        <span className="font-bold text-[#050505] text-sm">₹{(prod.current_price || 0).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-[rgba(0,0,0,0.6)] font-medium text-sm">
                      ₹{(prod.cost || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-bold text-[#050505] text-sm">{prod.margin_percent || 0}%</span>
                        <div className="w-16 h-1 mt-1.5 bg-[rgba(0,0,0,0.1)] rounded overflow-hidden">
                           <div className="h-full bg-[#1A1A1A] rounded transition-all duration-500" style={{ width: `${Math.min(prod.margin_percent || 0, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {isOutOfStock ? (
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#FF4D4D] bg-[#FF4D4D]/10 px-2 py-1 rounded">Stock Out</span>
                      ) : isLowStock ? (
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#FFA500] bg-[#FFA500]/10 px-2 py-1 rounded">{prod.current_stock} Left</span>
                      ) : (
                        <span className="text-[10px] text-[#050505]/60 font-bold">{prod.current_stock} units</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClick(prod)} className="p-1.5 bg-[rgba(0,0,0,0.04)] rounded hover:bg-[rgba(0,0,0,0.1)] hover:text-[#050505] transition-colors text-[rgba(0,0,0,0.6)]">
                           <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(prod.id)} className="p-1.5 bg-[#FF4D4D]/10 rounded hover:bg-[#FF4D4D]/20 text-[#FF4D4D] transition-colors">
                           <Trash2 className="w-4 h-4" />
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
                 <h2 className="font-bold text-[#050505] text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
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
