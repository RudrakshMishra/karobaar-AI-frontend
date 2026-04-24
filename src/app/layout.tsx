import type { Metadata } from "next";
import { Inter, Archivo_Black, Space_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Karobaar AI | Cinematic",
  description: "Experience absolute performance.",
};

import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="hide-scrollbar">
      <head>
      </head>
      <body className={`min-h-screen flex flex-col relative bg-[#FAF9F6] text-[#050505] selection:bg-[#1A1A1A] selection:text-[#050505] antialiased ${inter.variable} ${archivo.variable} ${spaceMono.variable} ${jakarta.variable} font-sans`}>
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
