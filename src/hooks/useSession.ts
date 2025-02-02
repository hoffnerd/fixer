"use client"

// Types ----------------------------------------------------------------------------
import { type Session } from "@prisma/client";
// Packages---------------------------------------------------------------------
import { readSession } from "@/server/session";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// Other------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Hook =====

export function useSession() {

    //______________________________________________________________________________________
    // ===== Hooks =====
    const queryClient = useQueryClient();
    const { data } = useQuery({ 
        queryKey: ['session'], 
        queryFn: async () => {
            const sessionId = localStorage.getItem("sessionId");
            const response = await readSession(sessionId);
            if(!response?.error) localStorage.setItem("sessionId", response?.data?.id);
            return { ...response };
        },
    }) 



    //______________________________________________________________________________________
    // ===== Functions =====

    const clearSession = async () => {
        localStorage.removeItem("sessionId");
        queryClient.invalidateQueries({ queryKey: ['sessionId'], refetchType: "all" });
    }



    //______________________________________________________________________________________
    // ===== Hook Return =====
    return { 
        error: data?.error,
        message: data?.message,
        session: data?.data as Session,
        clearSession,
    }
}