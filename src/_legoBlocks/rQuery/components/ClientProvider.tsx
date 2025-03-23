"use client"

// Packages -------------------------------------------------------------------------
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "../getQueryClient";
// Other -------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function ClientProvider({ children, shouldRenderDevTools }: Readonly<{ children?: React.ReactNode, shouldRenderDevTools?: boolean }>) {

    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {shouldRenderDevTools && <ReactQueryDevtools/>}
        </QueryClientProvider>
    )
}