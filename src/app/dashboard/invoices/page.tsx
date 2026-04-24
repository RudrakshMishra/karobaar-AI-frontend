"use client";

import { useState } from "react";
import { FileText, Download, Plus, Search, X, Check } from "lucide-react";

// Setup initial local mock data so the dashboard isn't completely empty
const INITIAL_INVOICES = [
  { id: "inv-1", invoiceNumber: "INV-2026-001", date: new Date().toISOString(), customerName: "Acme Corp Ltd", source: "Generated", totalAmount: 14500 },
  { id: "inv-2", invoiceNumber: "INV-2026-002", date: new Date(Date.now() - 86400000).toISOString(), customerName: "Rajesh Traders", source: "Scanned Bill", totalAmount: 3200 },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>(INITIAL_INVOICES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [newCustomer, setNewCustomer] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newAmount) return;

    setIsSaving(true);

    // Simulate network delay
    setTimeout(() => {
      const newInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-2026-00${invoices.length + 1}`,
        date: new Date().toISOString(),
        customerName: newCustomer,
        source: "Generated",
        totalAmount: parseFloat(newAmount) || 0
      };

      setInvoices([newInvoice, ...invoices]);
      setIsAddModalOpen(false);
      setIsSaving(false);

      // Reset
      setNewCustomer("");
      setNewAmount("");
    }, 600);
  };

  const downloadPdf = async (id: string, invoiceNumber: string) => {
    alert(`Mock Trigger: PDF Download sequence initiated for ${invoiceNumber}.`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 relative">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#050505] flex items-center gap-3">
            <FileText className="text-[#050505]" /> Billing & Invoices
          </h1>
          <p className="text-[rgba(0,0,0,0.6)] text-sm mt-1">Manage all your generated bills and scanned invoices.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#333333] transition-colors flex items-center gap-2"
           >
             <Plus className="w-4 h-4" /> New Bill
           </button>
        </div>
      </div>

      <div className="bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] min-h-[400px]">
        
        <div className="p-4 border-b border-[rgba(0,0,0,0.08)] flex items-center gap-4 bg-[#F2F0EA]">
           <div className="flex-1 relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.3)]" />
             <input type="text" placeholder="Search by customer, id, or amount..." className="w-full bg-[#FAF9F6] border border-[rgba(0,0,0,0.08)] rounded-lg pl-10 pr-4 py-2 text-sm text-[#050505] focus:outline-none focus:border-[rgba(0,0,0,0.4)]" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E8E6DF]">
                <th className="p-4 text-xs font-bold text-[rgba(0,0,0,0.6)] uppercase tracking-wider">Invoice ID</th>
                <th className="p-4 text-xs font-bold text-[rgba(0,0,0,0.6)] uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-[rgba(0,0,0,0.6)] uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-[rgba(0,0,0,0.6)] uppercase tracking-wider">Source</th>
                <th className="p-4 text-xs font-bold text-[rgba(0,0,0,0.6)] uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-bold text-[rgba(0,0,0,0.6)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.05)]">
               {invoices.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-[rgba(0,0,0,0.4)]">No invoices found. Try scanning a bill or generating one manually.</td>
                 </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[rgba(0,0,0,0.02)] transition-colors group">
                    <td className="p-4 text-sm font-bold text-[#050505] font-mono">{inv.invoiceNumber}</td>
                    <td className="p-4 text-sm text-[rgba(0,0,0,0.8)]">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-[rgba(0,0,0,0.8)]">{inv.customerName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-widest ${
                        inv.source === 'Scanned Bill' ? 'bg-[#FF9900]/10 text-[#FF9900] border border-[#FF9900]/20' : 
                        'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.7)] border border-[rgba(0,0,0,0.1)]'
                      }`}>
                         {inv.source}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-[#050505] text-right">₹{inv.totalAmount.toLocaleString()}</td>
                    <td className="p-4 text-right">
                       <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => downloadPdf(inv.id, inv.invoiceNumber)} className="p-2 bg-[rgba(0,0,0,0.05)] hover:bg-[#1A1A1A] hover:text-white text-[rgba(0,0,0,0.7)] rounded transition-colors" title="Download PDF">
                             <Download className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL OVERLAY */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-[#FAF9F6] w-full max-w-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#D6D3CB] overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between p-5 border-b border-[#D6D3CB] bg-[#FFFFFF]">
                 <h2 className="font-bold text-[#050505] text-lg">Generate New Bill</h2>
                 <button onClick={() => setIsAddModalOpen(false)} className="text-[rgba(0,0,0,0.4)] hover:text-[#050505] transition-colors">
                   <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleCreateBill} className="p-6 space-y-5">
                 
                 <div className="bg-[#E8E6DF] p-4 rounded-xl border border-[rgba(0,0,0,0.05)] mb-2">
                   <p className="text-xs text-[rgba(0,0,0,0.6)] leading-relaxed">
                     Fill out the basic details. Entering the customer name and subtotal will automatically calculate your GST mappings.
                   </p>
                 </div>

                 <div>
                   <label className="text-[11px] uppercase tracking-widest font-bold text-[rgba(0,0,0,0.6)] mb-1 block">Customer Name</label>
                   <input 
                     autoFocus
                     value={newCustomer} onChange={e => setNewCustomer(e.target.value)}
                     className="w-full bg-[#FFFFFF] border border-[#D6D3CB] px-4 py-2.5 rounded-lg text-sm text-[#050505] outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-all" 
                     placeholder="e.g. Ramesh Singh" 
                     required 
                   />
                 </div>

                 <div>
                   <label className="text-[11px] uppercase tracking-widest font-bold text-[rgba(0,0,0,0.6)] mb-1 block">Total Amount (₹)</label>
                   <input 
                     type="number"
                     value={newAmount} onChange={e => setNewAmount(e.target.value)}
                     className="w-full bg-[#FFFFFF] border border-[#D6D3CB] px-4 py-2.5 rounded-lg text-sm text-[#050505] outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-all" 
                     placeholder="4,500" 
                     required 
                   />
                 </div>

                 <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`w-full text-white py-3 rounded-xl font-bold mt-4 shadow-sm transition-colors flex items-center justify-center gap-2 ${
                    isSaving ? "bg-[#333333] cursor-not-allowed" : "bg-[#1A1A1A] hover:bg-[#333333]"
                  }`}
                 >
                   {isSaving ? (
                     <>
                       <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generating...
                     </>
                   ) : (
                     <>
                       <Check size={18} /> Generate Invoice
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
