"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F0EA] p-4 font-sans selection:bg-[#1A1A1A] selection:text-[#050505]">
      <SignIn 
        appearance={{
          elements: {
            card: "bg-[#FFFFFF] border border-[rgba(212,163,115,0.15)] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]",
            headerTitle: "text-[#050505] font-display",
            headerSubtitle: "text-[rgba(0,0,0,0.6)]",
            formButtonPrimary: "bg-[#1A1A1A] text-[#050505] hover:bg-[#2A2A2A] font-bold",
            formFieldInput: "bg-[#E8E6DF] border-[rgba(212,163,115,0.2)] text-[#050505] focus:ring-[#FFFFFF] focus:border-[rgba(0,0,0,0.4)]",
            formFieldLabel: "text-[rgba(0,0,0,0.8)]",
            footerActionLink: "text-[#050505] hover:underline",
            socialButtonsBlockButton: "bg-[#F2F0EA] border border-[rgba(0,0,0,0.12)] text-[#050505] hover:bg-[#E8E6DF]",
            socialButtonsBlockButtonText: "text-[#050505] font-medium"
          }
        }}
        routing="hash"
        fallbackRedirectUrl="/dashboard"
        signUpUrl="/signup"
      />
    </div>
  );
}
