// components/providers.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query-client";

export function ReactQueryProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}