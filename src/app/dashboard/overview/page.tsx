"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { RefreshCw, TrendingUp, AlertTriangle, BrainCircuit } from "lucide-react";

export default function OverviewPage() {
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("30D");

  useEffect(() => {
    // Mock Core Data
    setTimeout(() => {
      setData({
        totalRevenue: 3450000,
        realProfit: 862500,
        totalOrders: 4120,
        healthScore: 88,
        revenueChart: [
          { date: "1st", revenue: 200000 },
          { date: "5th", revenue: 450000 },
          { date: "10th", revenue: 300000 },
          { date: "15th", revenue: 700000 },
          { date: "20th", revenue: 500000 },
          { date: "25th", revenue: 900000 },
          { date: "30th", revenue: 400000 },
        ],
        topProducts: [
          { rank: 1, name: "Noise Cancelling Earbuds PRO", realProfit: 210000, margin: 85 },
          { rank: 2, name: "Smart Fitness Watch", realProfit: 155000, margin: 60 },
          { rank: 3, name: "Ergonomic Office Chair X1", realProfit: 98000, margin: 45 },
          { rank: 4, name: "Mechanic Keyboard RGB", realProfit: 72000, margin: 30 },
        ]
      });
      setLoading(false);
    }, 800);
      
    fetchInsights();
  }, []);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    
    // Generate different graph datasets based on timeframe chosen
    let newChart = [];
    if (tf === "7D") {
      newChart = [
        { date: "Mon", revenue: 50000 }, { date: "Tue", revenue: 80000 }, { date: "Wed", revenue: 65000 },
        { date: "Thu", revenue: 120000 }, { date: "Fri", revenue: 90000 }, { date: "Sat", revenue: 150000 }, { date: "Sun", revenue: 200000 }
      ];
    } else if (tf === "90D") {
      newChart = [
        { date: "Week 1", revenue: 300000 }, { date: "Week 4", revenue: 250000 }, { date: "Week 8", revenue: 600000 },
        { date: "Week 12", revenue: 950000 }
      ];
    } else {
      newChart = [
        { date: "1st", revenue: 200000 }, { date: "5th", revenue: 450000 }, { date: "10th", revenue: 300000 },
        { date: "15th", revenue: 700000 }, { date: "20th", revenue: 500000 }, { date: "25th", revenue: 900000 }, { date: "30th", revenue: 400000 }
      ];
    }
    
    setData((prev: any) => ({ ...prev, revenueChart: newChart }));
  };

  const fetchInsights = async () => {
    setInsightsLoading(true);
    // Mock Insights Data
    setTimeout(() => {
      setInsights([
        { type: "COMPETITOR ALERT", message: "Boat lowered their X1 series by ₹200. Consider offering a 5% discount to retain buy box.", action: "Adjust Price", impact: "High Impact" },
        { type: "INVENTORY WARNING", message: "Smart Watches are selling 30% faster than usual. You will run out of stock in 4 days at current velocity.", action: "View Inventory", impact: "Urgent" },
        { type: "PROFIT LEAK", message: "Low ROI on Meta Ads for 'Office Chair X1' in Bihar region. Costing ₹12,000/week.", action: "Pause Ads", impact: "Medium Impact" }
      ]);
      setInsightsLoading(false);
    }, 1200);
  };

  if (loading) return <div className="text-[#050505] flex items-center justify-center p-20 animate-pulse font-bold text-xl">Loading Dashboard Core...</div>;

  return (
    <div className="space-y-6">
      
      {/* ROW 1: KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={data?.totalRevenue || 0} prefix="₹" />
        <KPICard title="Real Profit" value={data?.realProfit || 0} prefix="₹" color="#050505" />
        <KPICard title="Total Orders" value={data?.totalOrders || 0} />
        <div className="bg-[#FFFFFF] border border-[rgba(212,163,115,0.12)] rounded-2xl p-6 relative overflow-hidden">
          <h4 className="text-[11px] text-[rgba(0,0,0,0.6)] uppercase tracking-widest font-bold mb-2">Business Health Score</h4>
          <div className="text-4xl font-black text-[#050505]">
            <CountUp end={data?.healthScore || 0} duration={2.5} />
            <span className="text-xl text-[rgba(0,0,0,0.4)]">/100</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#1A1A1A] opacity-10 rounded-full blur-2xl" />
        </div>
      </div>

      {/* ROW 2: CHART & HEALTH */}
      <div className="flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        
        {/* REVENUE CHART */}
        <div className="w-full lg:w-[60%] bg-[#FFFFFF] p-8 border-r border-[#D6D3CB]">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm text-[rgba(0,0,0,0.6)] uppercase tracking-widest font-bold">Revenue Overview</h4>
            <div className="flex bg-[#E8E6DF] p-1 rounded-lg border border-[rgba(0,0,0,0.05)]">
              {['7D', '30D', '90D'].map(t => (
                <button 
                  key={t} 
                  onClick={() => handleTimeframeChange(t)}
                  className={`text-xs px-3 py-1 rounded transition-all ${t === timeframe ? 'bg-white text-[#050505] font-bold shadow-sm ring-1 ring-black/5' : 'text-[#050505]/40 hover:text-[#050505]'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueChart || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#050505" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#050505" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#D6D3CB" tick={{fill: '#1A1A1A', fontSize: 12}} />
                <YAxis stroke="#D6D3CB" tick={{fill: '#1A1A1A', fontSize: 12}} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #050505', borderRadius: '8px', color: '#1A1A1A' }}
                  itemStyle={{ color: '#1A1A1A', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#050505" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* HEALTH SCORE BREAKDOWN */}
        <div className="w-full lg:w-[40%] bg-[#FFFFFF] p-8">
          <h4 className="text-sm text-[rgba(0,0,0,0.6)] uppercase tracking-widest font-bold mb-6">Health Breakdown</h4>
          <div className="space-y-5">
            <HealthRow label="Profit Health" score={92} />
            <HealthRow label="Marketing ROI" score={78} />
            <HealthRow label="Pricing Engine" score={85} />
            <HealthRow label="Inventory Status" score={61} warn />
            <HealthRow label="Customer Retention" score={88} />
          </div>
          <div className="mt-8 flex items-center justify-between p-4 rounded-xl bg-[rgba(212,163,115,0.05)] border border-[rgba(212,163,115,0.2)]">
            <span className="text-[#050505] font-bold">Overall Status</span>
            <span className="text-[#050505] font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Strong
            </span>
          </div>
        </div>

      </div>

      {/* ROW 3: AI INSIGHTS & TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI INSIGHTS */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[rgba(212,163,115,0.18)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#050505] flex items-center gap-2">
              <BrainCircuit className="text-[#050505] w-5 h-5" /> Live AI Insights
            </h3>
            <button onClick={fetchInsights} disabled={insightsLoading} className="text-xs flex items-center gap-2 text-[rgba(0,0,0,0.6)] hover:text-[#050505] transition-colors">
              <RefreshCw className={`w-3 h-3 ${insightsLoading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          <div className="space-y-0 divide-y divide-[#422D22]">
            {insights.length === 0 && !insightsLoading ? (
              <div className="py-8 text-center text-[rgba(0,0,0,0.3)]">No insights available. Upload sales data.</div>
            ) : insightsLoading ? (
              <div className="py-12 flex justify-center"><div className="animate-spin w-8 h-8 border-2 border-[rgba(0,0,0,0.4)] border-t-transparent rounded-full"></div></div>
            ) : (
              insights.map((insight, idx) => (
                <div key={idx} className="py-4 flex items-start gap-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors px-2 -mx-2 rounded-lg">
                  <div className="w-8 h-8 rounded bg-[rgba(212,163,115,0.1)] text-[#050505] flex flex-shrink-0 items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-[rgba(0,0,0,0.3)] font-bold">{insight.type}</span>
                    <p className="text-[#050505] text-sm font-medium mt-1 mb-2">{insight.message}</p>
                    <div className="flex items-center gap-3">
                      <button className="text-xs bg-[#1A1A1A] text-white font-bold px-3 py-1 rounded hover:opacity-80">
                        {insight.action}
                      </button>
                      <span className="text-xs text-[#050505] font-medium">{insight.impact}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-[#FFFFFF] border border-[#D6D3CB] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[#050505] mb-6">Top Products by Profit</h3>
          <div className="space-y-6">
            {(data?.topProducts || []).map((p: any) => (
              <div key={p.rank}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#050505] font-medium truncate pr-2">#{p.rank} {p.name}</span>
                  <span className="text-[#050505] font-bold">₹{p.realProfit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-[#E8E6DF] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1A1A1A] h-full rounded-full" style={{ width: `${p.margin}%` }} />
                </div>
              </div>
            ))}
            {data?.topProducts && data.topProducts.length === 0 && (
               <div className="text-sm text-[rgba(0,0,0,0.4)] italic">No product data extracted yet. Please upload your CSV.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function KPICard({ title, value, prefix = "", color = "#1A1A1A" }: { title: string, value: number, prefix?: string, color?: string }) {
  return (
    <div className="bg-[#FFFFFF] border border-[rgba(0,0,0,0.08)] rounded-2xl p-6">
      <h4 className="text-[11px] text-[rgba(0,0,0,0.6)] uppercase tracking-widest font-bold mb-2">{title}</h4>
      <div className="flex items-baseline gap-1" style={{ color }}>
        <span className="text-2xl font-bold">{prefix}</span>
        <span className="text-4xl font-black">
          <CountUp end={value} duration={2.5} separator="," />
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-[#D6D3CB] flex items-center text-xs gap-1">
        <TrendingUp className="w-3 h-3 text-[#050505]" />
        <span className="text-[rgba(0,0,0,0.6)]">Updated just now</span>
      </div>
    </div>
  );
}

function HealthRow({ label, score, warn = false }: { label: string, score: number, warn?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-[rgba(0,0,0,0.8)] w-36 truncate">{label}</span>
      <div className="flex-1 bg-[#E8E6DF] h-2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${warn ? "bg-[#FF4D4D]" : "bg-[#1A1A1A]"}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-bold w-8 text-right ${warn ? "text-[#FF4D4D]" : "text-[#050505]"}`}>{score}</span>
    </div>
  );
}
