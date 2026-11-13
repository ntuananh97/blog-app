// lib/query-client.ts
import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // tránh refetch ngay sau khi hydrate
        refetchOnWindowFocus: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // Server: mỗi request một client riêng, tránh rò rỉ dữ liệu giữa người dùng
  if (isServer) return makeQueryClient();
  // Browser: dùng lại một client duy nhất
  return (browserQueryClient ??= makeQueryClient());
}