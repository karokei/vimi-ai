"use client";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#363A50",
                        color: "#FFFFFF",
                        border: "1px solid rgba(160, 164, 184, 0.1)",
                        borderRadius: "12px",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    },
                    success: {
                        iconTheme: {
                            primary: "#00E676",
                            secondary: "#12141D",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#FF3B3B",
                            secondary: "#12141D",
                        },
                    },
                }}
            />
        </QueryClientProvider>
    );
}
