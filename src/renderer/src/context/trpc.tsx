import { ReactNode, useState } from "react";
import { createTRPCReact } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppRouter } from "@main/trpc-main";
import { ipcLink } from "electron-trpc/renderer";

export const trpcApi = createTRPCReact<AppRouter>();

export const TRPCProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcApi.createClient({ links: [ipcLink()] }),
  );

  return (
    <trpcApi.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpcApi.Provider>
  );
};
