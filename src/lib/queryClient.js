import { QueryClient } from "@tanstack/react-query";

// Editor-tool defaults, not a public app's. Staff edit for long stretches, so
// refetchOnWindowFocus off avoids surprise reloads mid-edit; a modest staleTime
// keeps list navigation snappy without serving badly outdated data.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
