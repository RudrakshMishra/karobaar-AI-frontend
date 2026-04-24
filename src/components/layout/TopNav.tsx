"use client";

import { usePathname } from "next/navigation";
import { Bell, Upload, X } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function TopNav() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const pageTitle = pathname.split("/").pop()?.replace("-", " ") || "Dashboard";

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/csv/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      
      setUploadStatus("success");
      setMessage(data.summary || "Data imported successfully");
      
      setTimeout(() => {
        setIsModalOpen(false);
        setUploadStatus("idle");
      }, 2000);
    } catch (err: any) {
      setUploadStatus("error");
      setMessage(err.message);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  return (
    <>
      <div className="h-[60px] bg-[#F2F0EA] border-b border-[#D6D3CB] flex items-center justify-between px-8 sticky top-0 z-40 md:ml-[240px]">
        {/* Left */}
        <div>
          <h2 className="text-[#050505] text-lg font-semibold capitalize">{pageTitle}</h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(212,163,115,0.5)] text-[#050505] hover:bg-[rgba(212,163,115,0.1)] transition-colors text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
          
          <button className="text-[rgba(0,0,0,0.6)] hover:text-[#050505] transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF4D4D] rounded-full border border-[#201610]" />
          </button>
        </div>
      </div>

      {/* Upload CSV Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.85)] z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] border border-[rgba(212,163,115,0.15)] rounded-2xl w-full max-w-lg p-6 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[rgba(0,0,0,0.6)] hover:text-[#050505]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#050505] mb-2">Upload Sales Data</h3>
            <p className="text-[rgba(0,0,0,0.6)] text-sm mb-6">Drop your platform CSV exports here. We support Shopify, Amazon, and Meesho formats.</p>

            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? "border-[rgba(0,0,0,0.4)] bg-[rgba(212,163,115,0.05)]" : "border-[rgba(212,163,115,0.3)] bg-[#E8E6DF] hover:bg-[#1a1a1a]"}`}
            >
              <input {...getInputProps()} />
              <Upload className={`w-10 h-10 mb-4 ${isDragActive ? "text-[#050505]" : "text-[rgba(0,0,0,0.4)]"}`} />
              
              {uploadStatus === "uploading" ? (
                <div className="text-[#050505] font-medium flex items-center gap-2">Processing CSV... <span className="animate-pulse w-2 h-2 bg-[#1A1A1A] rounded-full" /></div>
              ) : uploadStatus === "success" ? (
                <div className="text-green-400 font-medium">{message}</div>
              ) : uploadStatus === "error" ? (
                <div className="text-[#FF4D4D] font-medium">{message}</div>
              ) : (
                <div className="text-center">
                  <p className="text-[#050505] font-medium mb-1">Drop your CSV here or click to browse</p>
                  <p className="text-[rgba(0,0,0,0.4)] text-sm">Required columns: Date, Product, Revenue</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
