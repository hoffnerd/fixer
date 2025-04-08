"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Server ---------------------------------------------------------------------------
import { hireMerc, readSaveFile, updateResources } from "@/server/saveFile";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
import { toast } from "sonner";
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
    // ===== Mutations =====

    const updateResourcesMutation = useMutation({
        mutationFn: updateResources,
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
            // setStoreKeyValuePair({ isGameSaving: false });
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const hireMercMutation = useMutation({
        mutationFn: async (props: Readonly<{ id?: string; mercKey: string; inGameTime?: number; timeLeft?: number; }>) => {
            if(!data?.data?.id) return;
            return await hireMerc({ id: data.data.id, inGameTime: data.data.inGameTime, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
            // setStoreKeyValuePair({ isGameSaving: false });
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    // const addRandomMercMutation = useMutation({
    //     mutationFn: addRandomMerc,
    //     onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
    //     onSuccess: (data) => {
    //         if(data?.error) throw new Error(data?.message || "Unknown Error!");
    //         queryClient.invalidateQueries({ queryKey: ['saveFile'] })
    //         // setStoreKeyValuePair({ isGameSaving: false });
    //     },
    //     onError: (error) => {
    //         setStoreKeyValuePair({ isGameSaving: false });
    //         toast.error(error?.message || "Unknown Error!");
    //     },
    // })



    //______________________________________________________________________________________
    // ===== Functions =====

    const clearSaveFile = async () => {
        localStorage.removeItem("saveFileId");
        await queryClient.invalidateQueries({ queryKey: ['saveFileId'], refetchType: "all" });
    }



    //______________________________________________________________________________________
    // ===== Hook Return =====
    return { 
        isLoading,
        error: isError || data?.error,
        message: error?.message ?? data?.message ?? "Unknown `useSaveFile` Error!",
        saveFile: data?.data,
        saveFileId: data?.data?.id,
        clearSaveFile,
        updateResourcesMutation,
        hireMercMutation,
        // addRandomMercMutation,
    }
}