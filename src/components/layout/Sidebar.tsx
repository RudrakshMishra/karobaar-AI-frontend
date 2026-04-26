"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Package, Calculator, BrainCircuit, Target, BookOpen, Settings, LogOut, Camera, FileText } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { name: "Home", pathname: "/", icon: Home },
  { name: "Overview", pathname: "/dashboard", icon: BarChart3 },
  { name: "Products", pathname: "/dashboard/products", icon: Package },
  { name: "Profit Engine", pathname: "/dashboard/profit", icon: Calculator },
  { name: "AI Insights", pathname: "/dashboard/insights", icon: BrainCircuit },
  { name: "Competitor Intel", pathname: "/dashboard/competitors", icon: Target },
  { name: "Inventory", pathname: "/dashboard/inventory", icon: BookOpen },
  { name: "Scan Bill", pathname: "/dashboard/scan-bill", icon: Camera },
  { name: "Invoices", pathname: "/dashboard/invoices", icon: FileText },
  { name: "Settings", pathname: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="w-[240px] h-screen fixed left-0 top-0 bg-[#FAF9F6] border-r border-black/5 flex flex-col hidden md:flex z-50">
      
      {/* Brand */}
      <div className="h-[90px] flex items-center justify-center border-b border-black/5 max-w-[240px]">
        <img src="/logo.jpg" alt="Karobaar AI Logo" className="w-[180px] h-auto object-contain mix-blend-multiply" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.pathname;
          return (
            <Link 
              key={item.pathname} 
              href={item.pathname}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all group relative ${
                isActive 
                  ? "bg-[#E8E6DF] text-[#050505]" 
                  : "text-[#050505] hover:bg-[#1A1A1A]/5"
              }`}
            >
              {isActive && <div className="absolute left-0 w-1 h-5 bg-[#1A1A1A] rounded-r-full" />}
              <item.icon className={`w-4 h-4 ${isActive ? "text-[#1A1A1A]" : "text-[#050505]"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-black/5 bg-[#1A1A1A]/[0.01]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A]/5 border border-black/10 flex items-center justify-center overflow-hidden">
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
            ) : (
              <div className="text-[#050505] font-bold">{session?.user?.name?.charAt(0) || "S"}</div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-[13px] font-bold text-[#050505] truncate">{session?.user?.name || "Premium Seller"}</h4>
            <span className="inline-block mt-0.5 px-2 py-0.5 text-[9px] uppercase font-black tracking-widest text-green bg-green/10 rounded border border-green/20">
              {(session?.user as any)?.plan || 'STARTER'}
            </span>
          </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#050505]/30 hover:text-red-500 p-2 w-full transition-colors group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          Log out
        </button>
      </div>

    </div>
  );
}
