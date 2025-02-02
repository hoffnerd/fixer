"use client"

// Types ----------------------------------------------------------------------------
import { type SaveFile } from "@/types";
// Packages -------------------------------------------------------------------------
import { useQuery, useQueryClient } from "@tanstack/react-query";
// Server ---------------------------------------------------------------------------
import { readSaveFile } from "@/server/saveFile";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Hook =====

export function useSaveFile() {

    //______________________________________________________________________________________
    // ===== Stores =====
    const setStoreKeyValuePair = useGameStore((state) => state.setStoreKeyValuePair);

    //______________________________________________________________________________________
    // ===== Queries =====
    const queryClient = useQueryClient();
    const { isLoading, isError, error, data } = useQuery({ 
        queryKey: ['saveFile'],
        queryFn: async () => {
            setStoreKeyValuePair({ isGameSaving: true });
            const saveFileId = localStorage.getItem("saveFileId");
            const response = await readSaveFile(saveFileId);
            if(!response?.error) localStorage.setItem("saveFileId", response?.data?.id);
            setStoreKeyValuePair({ isGameSaving: false });
            return { ...response };
        },
    }) 



    //______________________________________________________________________________________
    // ===== Functions =====

    const clearSaveFile = async () => {
        localStorage.removeItem("saveFileId");
        queryClient.invalidateQueries({ queryKey: ['saveFileId'], refetchType: "all" });
    }



    //______________________________________________________________________________________
    // ===== Hook Return =====
    return { 
        isLoading,
        error: isError || data?.error,
        message: error?.message || data?.message || "Unknown `useSaveFile` Error!",
        saveFile: data?.data as SaveFile | null | undefined,
        clearSaveFile,
    }
}