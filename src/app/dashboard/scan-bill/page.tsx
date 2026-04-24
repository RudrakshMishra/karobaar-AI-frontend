"use client";

import { useState } from "react";
import { Camera, UploadCloud, FileText, CheckCircle2, Loader2 } from "lucide-react";

export default function ScanBillPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (uploadedFile: File) => {
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
  };

  const startScan = async () => {
    if (!file) return;
    setIsScanning(true);

    try {
      const formData = new FormData();
      formData.append("bill", file);

      // Hit our newly created backend Tesseract route
      const res = await fetch("http://localhost:5000/api/v1/invoices/scan", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setExtractedData(json.data);
      } else {
        alert("OCR Failed: " + json.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend OCR service. Make sure server is running.");
    } finally {
      setIsScanning(false);
    }
  };

  const saveInvoice = async () => {
    if (!extractedData) return;
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: extractedData.invoiceNumber,
          customerName: "Auto-Scanned Customer",
          totalAmount: extractedData.totalAmount,
          date: extractedData.date,
          source: "Scanned Bill",
          items: extractedData.items
        })
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
      alert("Error saving invoice.");
    } finally {
      setIsSaving(false);
    }
  };

  if (success) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#FFFFFF]/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#050505]" />
        </div>
        <h2 className="text-3xl font-bold text-[#050505] mb-2">Invoice Saved Successfully</h2>
        <p className="text-[rgba(0,0,0,0.6)] mb-8">The scanned bill has been added to your dashboard databases.</p>
        <button onClick={() => window.location.href='/dashboard/invoices'} className="bg-[#1A1A1A] text-[#050505] px-6 py-3 rounded-lg font-bold">
          View All Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#050505] flex items-center gap-3">
            <Camera className="text-[#050505]" /> Intelligent Bill Scanner
          </h1>
          <p className="text-[rgba(0,0,0,0.6)] text-sm mt-1">Upload a photo of a physical bill to extract data instantly using OCR.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload Column */}
        <div className="bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px]">
          {!previewUrl ? (
             <label 
               className="w-full h-full border-2 border-dashed border-[#C4C1B8] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[rgba(0,0,0,0.4)] hover:bg-[#E8E6DF] transition-colors"
               onDragOver={(e) => e.preventDefault()}
               onDrop={handleFileDrop}
             >
               <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])} />
               <UploadCloud className="w-12 h-12 text-[rgba(0,0,0,0.2)] mb-4" />
               <span className="text-[#050505] font-bold mb-2">Drag & Drop Bill Image</span>
               <span className="text-[rgba(0,0,0,0.4)] text-sm">or click to browse from device</span>
             </label>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] relative flex items-center justify-center bg-black">
                <img src={previewUrl} className="max-h-full max-w-full object-contain" />
              </div>
              <button onClick={() => setPreviewUrl(null)} className="mt-4 text-xs text-[rgba(0,0,0,0.4)] hover:text-[#050505] uppercase font-bold tracking-widest text-center">
                Replace Image
              </button>
            </div>
          )}
        </div>

        {/* Data Extraction Column */}
        <div className="bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-[#050505] mb-6 uppercase tracking-wider text-sm flex items-center justify-between">
            <span>OCR Extraction Result</span>
             {isScanning && <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />}
          </h2>

          {!file ? (
            <div className="flex-1 flex items-center justify-center text-[rgba(0,0,0,0.2)]">
               Upload an image to start extracting.
            </div>
          ) : !extractedData && !isScanning ? (
             <div className="flex-1 flex flex-col items-center justify-center">
                <FileText className="w-12 h-12 text-[#050505] mb-4 opacity-50" />
                <p className="text-[rgba(0,0,0,0.7)] mb-6 text-center max-w-xs">Ready to scan the image using the Karobaar Tesseract Engine?</p>
                <button onClick={startScan} className="bg-[#1A1A1A] text-[#050505] px-6 py-2.5 rounded hover:bg-[#1A1A1A] transition-colors font-black flex items-center gap-2">
                   Start AI Scan
                </button>
             </div>
          ) : isScanning ? (
             <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-xs h-2 bg-[#E8E6DF] rounded overflow-hidden">
                   <div className="h-full bg-[#1A1A1A] animate-pulse w-full"></div>
                </div>
                <p className="text-[rgba(0,0,0,0.6)] mt-4 animate-pulse">Running Optical Character Recognition...</p>
             </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-4">
               <div>
                  <label className="text-xs font-bold text-[rgba(0,0,0,0.4)] uppercase tracking-wider mb-1 block">Detected Invoice / Order ID</label>
                  <input 
                    value={extractedData.invoiceNumber} 
                    onChange={e => setExtractedData({...extractedData, invoiceNumber: e.target.value})}
                    className="w-full bg-[#FAF9F6] border border-[#E0DDD5] rounded-lg p-3 text-[#050505] font-mono" 
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[rgba(0,0,0,0.4)] uppercase tracking-wider mb-1 block">Date</label>
                    <input 
                      type="date"
                      value={extractedData.date} 
                      onChange={e => setExtractedData({...extractedData, date: e.target.value})}
                      className="w-full bg-[#FAF9F6] border border-[#E0DDD5] rounded-lg p-3 text-[#050505]" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#050505] uppercase tracking-wider mb-1 block">Total Amount (₹)</label>
                    <input 
                      type="number"
                      value={extractedData.totalAmount} 
                      onChange={e => setExtractedData({...extractedData, totalAmount: parseFloat(e.target.value) || 0})}
                      className="w-full bg-[#FAF9F6] border border-[rgba(0,0,0,0.3)] rounded-lg p-3 text-[#050505] font-bold text-lg" 
                    />
                  </div>
               </div>

               <div className="flex-1 mt-4">
                  <label className="text-xs font-bold text-[rgba(0,0,0,0.4)] uppercase tracking-wider mb-2 block">Line Items</label>
                  {extractedData.items.map((it:any, idx:number) => (
                    <div key={idx} className="flex gap-2">
                       <input value={it.product} onChange={e => {
                          const n = [...extractedData.items]; n[idx].product = e.target.value; setExtractedData({...extractedData, items: n});
                       }} className="flex-1 bg-[#FAF9F6] border border-[#E0DDD5] rounded-lg p-2 text-[#050505] text-sm" />
                       <input value={it.price} onChange={e => {
                          const n = [...extractedData.items]; n[idx].price = parseFloat(e.target.value) || 0; setExtractedData({...extractedData, items: n});
                       }} type="number" className="w-24 bg-[#FAF9F6] border border-[#E0DDD5] rounded-lg p-2 text-[#050505] text-sm" />
                    </div>
                  ))}
               </div>

               <div className="pt-6 border-t border-[rgba(0,0,0,0.08)] mt-auto flex justify-between">
                  <button className="text-[rgba(0,0,0,0.4)] hover:text-[#050505] font-bold text-sm">Discard</button>
                  <button onClick={saveInvoice} disabled={isSaving} className="bg-[#1A1A1A] text-[#050505] px-6 py-2 rounded font-black flex items-center gap-2">
                     {isSaving ? "Saving..." : "Save to Invoices"}
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
