"use client";

import { AegisProvider } from "@cavos/aegis";
import { aegisConfig } from "../config/aegis";

interface AegisClientProviderProps {
  children: React.ReactNode;
}

export function AegisClientProvider({ children }: AegisClientProviderProps) {
  return <AegisProvider config={aegisConfig}>{children}</AegisProvider>;
}
