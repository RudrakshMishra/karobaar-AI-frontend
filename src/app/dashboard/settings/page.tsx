"use client";

import { useState, useEffect } from "react";
import { Settings, User, Bell, Shield, KeyRound, MonitorSmartphone, CreditCard, Users, CheckCircle2, AlertTriangle, Upload } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const tabs = ["Profile", "Integrations", "Billing", "Notifications", "Security", "Team"];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-3">
          <Settings className="text-[#1A1A1A]" /> Settings & Configuration
        </h1>
        <p className="text-[#050505] text-sm mt-1">Manage your account, billing, and platform integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 flex flex-col gap-2">
          {tabs.map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveTab(item)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 border ${
                activeTab === item 
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                  : "bg-transparent text-[#050505] border-transparent hover:text-[#1A1A1A] hover:bg-[#E8E6DF]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-[#FFFFFF] border border-[#D6D3CB] rounded-2xl p-6 sm:p-8 shadow-sm min-h-[500px]">
          
          {activeTab === "Integrations" && <IntegrationsTab />}
          {activeTab === "Profile" && <ProfileTab />}
          {activeTab === "Billing" && <BillingTab />}
          {activeTab === "Notifications" && <NotificationsTab />}
          {activeTab === "Security" && <SecurityTab />}
          {activeTab === "Team" && <TeamTab />}

        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB COMPONENTS
// ----------------------------------------------------

function ProfileTab() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Sanjay Mehta",
    email: "sanjay@premiumstore.in",
    storeName: "Premium Store IN",
    timezone: "Asia/Kolkata (IST)"
  });

  useEffect(() => {
    const saved = localStorage.getItem("karobaar_profile");
    if (saved) {
      setProfileData(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate network request
    setTimeout(() => {
      localStorage.setItem("karobaar_profile", JSON.stringify(profileData));
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 800);
  };

  const handleChange = (key: string, value: string) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const initial = profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : "S";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Profile Settings</h2>
      
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#D6D3CB]">
        <div className="w-20 h-20 bg-[#D1D1D1] rounded-full flex items-center justify-center border-4 border-[#E8E6DF] shadow-inner text-[#1A1A1A] text-2xl font-bold cursor-pointer relative group overflow-hidden">
          {initial}
          <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white backdrop-blur-sm transition-all">
             <Upload size={20} />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[#1A1A1A]">Profile Photo</h3>
          <p className="text-xs text-[#050505] mt-1 mb-3">Upload a square image, max 2MB.</p>
          <div className="flex gap-2">
            <button className="text-xs font-bold bg-[#1A1A1A] text-white px-4 py-1.5 rounded hover:bg-[#333333] transition-colors">Upload New</button>
            <button className="text-xs font-bold text-[#050505] border border-[#D6D3CB] px-4 py-1.5 rounded hover:bg-[#E8E6DF] transition-colors">Remove</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputGroup label="Full Name" placeholder="e.g. Rahul Sharma" value={profileData.fullName} onChange={(v) => handleChange("fullName", v)} />
        <InputGroup label="Email Address" placeholder="you@company.com" value={profileData.email} onChange={(v) => handleChange("email", v)} />
        <InputGroup label="Store Name" placeholder="Your brand name" value={profileData.storeName} onChange={(v) => handleChange("storeName", v)} />
        <InputGroup label="Timezone" placeholder="IST" value={profileData.timezone} onChange={(v) => handleChange("timezone", v)} />
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#112953] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#1A365D] transition-colors shadow-sm flex items-center gap-2 min-w-[140px] justify-center"
        >
          {isSaving ? <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span> : isSaved ? <><CheckCircle2 size={16} /> Saved!</> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Connected Platforms</h2>
      
      <div className="space-y-4">
        {/* Shopify */}
        <div className="flex items-center justify-between p-4 bg-[#FAF9F6] border border-[#D6D3CB] rounded-xl hover:border-[#C4C1B8] transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#95BF47]/10 rounded flex items-center justify-center border border-[#95BF47]/20">
              <span className="text-[#95BF47] font-bold">S</span>
            </div>
            <div>
              <h3 className="text-[#1A1A1A] font-bold text-sm">Shopify API</h3>
              <p className="text-[#050505] text-xs mt-0.5">karobaar-store.myshopify.com</p>
            </div>
          </div>
          <div className="bg-[#E8E6DF] border border-[#D6D3CB] text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
              <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse" /> Connected
          </div>
        </div>

        {/* Amazon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#FAF9F6] border border-[#D6D3CB] rounded-xl opacity-80 hover:opacity-100 transition-all gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF9900]/10 rounded flex items-center justify-center border border-[#FF9900]/20">
              <span className="text-[#FF9900] font-bold">A</span>
            </div>
            <div>
              <h3 className="text-[#1A1A1A] font-bold text-sm">Amazon Seller Central</h3>
              <p className="text-[#050505] text-xs mt-0.5">India Region</p>
            </div>
          </div>
          <button className="bg-[#FFFFFF] border border-[#D6D3CB] text-[#1A1A1A] px-4 py-1.5 rounded text-xs font-bold hover:bg-[#E8E6DF] transition-colors shadow-sm">
              Connect
          </button>
        </div>

          {/* Meesho */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#FAF9F6] border border-[#D6D3CB] rounded-xl opacity-80 hover:opacity-100 transition-all gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F43397]/10 rounded flex items-center justify-center border border-[#F43397]/20">
              <span className="text-[#F43397] font-bold">M</span>
            </div>
            <div>
              <h3 className="text-[#1A1A1A] font-bold text-sm">Meesho Supplier</h3>
              <p className="text-[#050505] text-xs mt-0.5">API access pending</p>
            </div>
          </div>
          <button className="bg-[#FFFFFF] border border-[#D6D3CB] text-[#1A1A1A] px-4 py-1.5 rounded text-xs font-bold hover:bg-[#E8E6DF] transition-colors shadow-sm">
              Connect
          </button>
        </div>
      </div>

      <div className="mt-10 border-t border-[#D6D3CB] pt-8">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Webhooks</h2>
        <div className="bg-[#FAF9F6] p-5 rounded-xl border border-dashed border-[#D6D3CB] text-center">
          <p className="text-[#050505] text-sm mb-4">No active webhooks. Configure endpoints to receive real-time price alerts.</p>
          <button className="text-[#112953] text-sm font-bold hover:underline transition-colors">+ Add Endpoint</button>
        </div>
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Current Plan & Billing</h2>
      
      <div className="bg-[#FAF9F6] border border-[#112953]/20 rounded-xl p-6 shadow-sm relative overflow-hidden mb-8">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#112953]/5 rounded-bl-full" />
         <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-[#112953] bg-[#112953]/10 px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
                <h3 className="text-xl font-bold text-[#1A1A1A]">Karobaar Pro</h3>
              </div>
              <p className="text-sm text-[#050505]">Billed ₹999/month. Next cycle resets in 14 days.</p>
            </div>
            <button className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#333333] transition-colors whitespace-nowrap">
              Upgrade Subscription
            </button>
         </div>
      </div>

      <h3 className="text-[11px] font-bold text-[#050505] uppercase tracking-widest mb-4">Payment Method</h3>
      <div className="flex items-center justify-between p-4 border border-[#D6D3CB] rounded-xl mb-8">
         <div className="flex items-center gap-4">
           <div className="bg-[#E8E6DF] p-2.5 rounded-lg border border-[#D6D3CB]">
             <CreditCard size={20} className="text-[#1A1A1A]" />
           </div>
           <div>
             <div className="font-bold text-[#1A1A1A] text-sm">HDFC Bank Debit Card ending in •••• 4242</div>
             <div className="text-[12px] text-[#050505]">Expires 12/28</div>
           </div>
         </div>
         <button className="text-[13px] font-bold text-[#1A1A1A] hover:underline">Edit</button>
      </div>

      <h3 className="text-[11px] font-bold text-[#050505] uppercase tracking-widest mb-4">Billing History</h3>
      <div className="border border-[#D6D3CB] rounded-xl overflow-hidden text-sm">
         {[
           { date: "Oct 01, 2026", amt: "₹999", stat: "Paid", inv: "#INV-0042" },
           { date: "Sep 01, 2026", amt: "₹999", stat: "Paid", inv: "#INV-0041" },
           { date: "Aug 01, 2026", amt: "₹999", stat: "Paid", inv: "#INV-0040" },
         ].map((row, i) => (
           <div key={i} className="flex items-center justify-between p-4 border-b border-[#D6D3CB] last:border-0 bg-[#FFFFFF] hover:bg-[#FAF9F6] transition-colors">
              <div className="text-[#1A1A1A] font-medium w-1/3">{row.date}</div>
              <div className="text-[#050505] w-1/4">{row.amt}</div>
              <div className="w-1/4 flex items-center gap-1.5 text-[#10b981] font-medium text-[13px]">
                <CheckCircle2 size={14} /> {row.stat}
              </div>
              <button className="text-[#112953] font-bold text-[13px] hover:underline text-right w-[15%]">Details</button>
           </div>
         ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-8">Notification Preferences</h2>
      
      <div className="space-y-6">
        <ToggleRow title="Email Summaries" desc="Receive daily performance summaries detailing revenue and profit." state={true} />
        <ToggleRow title="SMS Alerts" desc="Get urgent text messages for critically low inventory." state={false} />
        <ToggleRow title="Competitor Price Drops" desc="Instant alerts when tracked competitors lower their prices." state={true} />
        <ToggleRow title="Unusual RTO Spikes" desc="AI alerts when return-to-origin rates hit abnormal thresholds." state={true} />
        <ToggleRow title="Marketing Updates" desc="Occasional emails about new features and strategies." state={false} />
      </div>

      <div className="mt-10 border-t border-[#D6D3CB] pt-6 flex justify-end">
        <button className="bg-[#112953] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#1A365D] transition-colors shadow-sm">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-8">Security & Access</h2>

      <h3 className="text-[11px] font-bold text-[#050505] uppercase tracking-widest mb-4">Change Password</h3>
      <div className="space-y-4 max-w-sm mb-10">
        <InputGroup label="Current Password" type="password" value="" onChange={()=>{}} />
        <InputGroup label="New Password" type="password" value="" onChange={()=>{}} />
        <InputGroup label="Confirm New Password" type="password" value="" onChange={()=>{}} />
        <button className="bg-[#E8E6DF] text-[#1A1A1A] border border-[#C4C1B8] px-5 py-2 rounded-lg font-bold hover:bg-[#D6D3CB] transition-colors text-sm w-full shadow-sm">
          Update Password
        </button>
      </div>

      <div className="border-t border-[#D6D3CB] pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FAF9F6] p-5 border border-[#D6D3CB] rounded-xl">
           <div>
             <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2"><KeyRound size={18} className="text-[#1A1A1A]" /> Two-Factor Authentication</h3>
             <p className="text-sm text-[#050505] mt-1">Protect your account with an extra layer of security using an authenticator app.</p>
           </div>
           <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap hover:bg-[#333333] transition-colors">
              Enable 2FA
           </button>
        </div>
      </div>
    </div>
  );
}

function TeamTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-[#1A1A1A]">Team Access</h2>
        <button className="bg-[#112953] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#1A365D] transition-colors flex items-center gap-2">
          <User size={16} /> Invite Member
        </button>
      </div>

      <div className="border border-[#D6D3CB] rounded-xl overflow-hidden divide-y divide-[#D6D3CB]">
         {[
           { name: "Sanjay Mehta", email: "sanjay@premiumstore.in", role: "Owner" },
           { name: "Priya Sharma", email: "priya.admin@premiumstore.in", role: "Manager" },
           { name: "Ramesh Ops", email: "ramesh.warehouse@premiumstore.in", role: "Viewer" },
         ].map((user, i) => (
           <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FFFFFF] hover:bg-[#FAF9F6] transition-colors gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8E6DF] rounded-full flex items-center justify-center font-bold text-[#1A1A1A] text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                   <div className="text-[14px] font-bold text-[#1A1A1A]">{user.name}</div>
                   <div className="text-[12px] text-[#050505]">{user.email}</div>
                </div>
              </div>
              
              <div className="flex justify-between sm:justify-end items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#050505] bg-[#E8E6DF] px-2 py-0.5 rounded border border-[#D6D3CB]">
                  {user.role}
                </span>
                {user.role !== "Owner" && (
                  <button className="text-[13px] font-bold text-[#FF4D4D] hover:underline">Revoke</button>
                )}
              </div>
           </div>
         ))}
      </div>

      <div className="mt-8 bg-[#FAF9F6] p-4 rounded-xl border border-dashed border-[#D6D3CB] flex items-start gap-4">
         <div className="bg-[#E8E6DF] p-2 rounded-full mt-1">
           <AlertTriangle size={16} className="text-[#1A1A1A]" />
         </div>
         <div>
           <h4 className="text-sm font-bold text-[#1A1A1A]">Pro Plan Limits</h4>
           <p className="text-[13px] text-[#050505] mt-1">You are using 3 of 5 seats available on your current plan. Need more? <span className="font-bold text-[#112953] cursor-pointer hover:underline">Contact Sales</span>.</p>
         </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SHARED UTILS
// ----------------------------------------------------

function InputGroup({ label, placeholder, value, type = "text", onChange }: { label: string, placeholder?: string, value?: string, type?: string, onChange?: (val: string) => void }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[11px] uppercase tracking-widest font-bold text-[#050505]">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#FAF9F6] border border-[#D6D3CB] outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] px-4 py-2.5 rounded-lg text-[14px] transition-all placeholder:[#C4C1B8]"
      />
    </div>
  );
}

function ToggleRow({ title, desc, state }: { title: string, desc: string, state: boolean }) {
  const [active, setActive] = useState(state);
  return (
    <div className="flex items-center justify-between gap-6 pb-6 border-b border-[#D6D3CB] last:border-0 last:pb-0">
      <div>
        <h4 className="font-bold text-[#1A1A1A] text-sm">{title}</h4>
        <p className="text-[13px] text-[#050505] mt-1">{desc}</p>
      </div>
      <button 
        onClick={() => setActive(!active)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 border border-transparent ${
          active ? "bg-[#112953]" : "bg-[#D6D3CB]"
        }`}
      >
        <span 
          className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-300 ${
            active ? "left-[calc(100%-20px)]" : "left-[2px]"
          }`} 
        />
      </button>
    </div>
  );
}
