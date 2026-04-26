import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import AuthProvider from "@/components/AuthProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="bg-[#F2F0EA] min-h-screen text-[#050505] font-sans selection:bg-[#1A1A1A] selection:text-[#050505]">
        <Sidebar />
        <div className="md:ml-[240px] flex flex-col min-h-screen">
          <TopNav />
          <main className="flex-1 flex flex-col relative">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
