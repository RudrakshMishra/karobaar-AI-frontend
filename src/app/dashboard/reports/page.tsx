'use client';

import React from 'react';
import { FileText, Download, Filter, Search, Calendar, ChevronDown } from 'lucide-react';

const reportsList = [
  { id: 1, name: 'Monthly Financial Summary - March', date: 'Apr 02, 2026', type: 'PDF', size: '2.4 MB' },
  { id: 2, name: 'Q1 Competitive Analysis', date: 'Mar 31, 2026', type: 'PDF', size: '4.1 MB' },
  { id: 3, name: 'Inventory Deficit Warning', date: 'Mar 28, 2026', type: 'CSV', size: '1.1 MB' },
  { id: 4, name: 'Platform Fee Breakdown (Amazon & Shopify)', date: 'Mar 25, 2026', type: 'Spreadsheet', size: '3.7 MB' },
  { id: 5, name: 'Ad Spend vs ROAS Correlation', date: 'Mar 15, 2026', type: 'PDF', size: '5.2 MB' },
];

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#050505] mb-1 flex items-center gap-2">
            <FileText className="text-accent" /> Reports
          </h1>
          <p className="text-gray-400">Download and manage your auto-generated business reports.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-gray-700 hover:border-accent text-[#050505] rounded-lg transition-colors text-sm font-medium">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-gray-700 hover:border-accent text-[#050505] rounded-lg transition-colors text-sm font-medium">
            <Calendar size={16} /> Last 30 Days <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent/90 text-[#050505] rounded-lg transition-colors text-sm font-medium">
            Generate New
          </button>
        </div>
      </div>

      <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="w-full bg-background border border-gray-700 rounded-lg py-2 pl-9 pr-4 outline-none focus:border-accent text-sm text-[#050505]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Report Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-center">Date Generated</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-center">Format</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-center">Size</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {reportsList.map((report) => (
                <tr key={report.id} className="hover:bg-[#1A1A1A]/5 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-200">{report.name}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-400 text-sm">{report.date}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-800 text-xs font-medium text-gray-300 border border-gray-700">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-500 text-sm">{report.size}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-[#050505] bg-background border border-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-800">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reportsList.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No reports found for the selected period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
