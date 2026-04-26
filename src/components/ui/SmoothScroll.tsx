'use client';

import { ReactNode } from 'react';

// SmoothScroll: passthrough component to avoid dependency conflicts
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
