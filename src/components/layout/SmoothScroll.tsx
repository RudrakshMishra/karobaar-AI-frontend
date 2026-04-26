"use client";

import { ReactNode } from "react";

// SmoothScroll: uses CSS scroll-behavior for native smooth scrolling
// Replaced @studio-freight/react-lenis due to React 19 type incompatibility
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
