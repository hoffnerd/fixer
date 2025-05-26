"use client"

// Types ----------------------------------------------------------------------------
import type { ContractStageSwappable, MercAssignType, MercSlot } from "@/types";
// Packages -------------------------------------------------------------------------
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// Server ---------------------------------------------------------------------------
import { hireMerc, readSaveFile, regenerateContracts, regenerateMercs, signContract, cancelContract, updateResources, assignMerc, updateContractStage, completeContract, regenerateBusinesses, purchaseBusiness, forecloseBusiness, sellBusiness, incomeBusiness } from "@/server/saveFile";
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
    // ===== Mutations =====

    const updateResourcesMutation = useMutation({
        mutationFn: updateResources,
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })



    //______________________________________________________________________________________
    // ===== Merc Mutations =====

    const hireMercMutation = useMutation({
        mutationFn: async (props: Readonly<{ mercKey: string; inGameTime: number; timeLeft?: number; }>) => {
            if(!data?.data?.id) return;
            return await hireMerc({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const assignMercMutation = useMutation({
        mutationFn: async (props: Readonly<{ 
            assignType: MercAssignType;
            mercKey: string;
            contractKey?: string;
            businessKey?: string;
            slot?: MercSlot; 
        }>) => {
            if(!data?.data?.id) return;
            return await assignMerc({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const regenerateMercsMutation = useMutation({
        mutationFn: async (props: Readonly<{ inGameTime: number; timeLeft?: number; }>) => {
            if(!data?.data?.id) return;
            return await regenerateMercs({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })



    //______________________________________________________________________________________
    // ===== Contract Mutations =====

    const signContractMutation = useMutation({
        mutationFn: async (props: Readonly<{ contractKey: string; inGameTime: number; timeLeft?: number; }>) => {
            if(!data?.data?.id) return;
            return await signContract({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const updateContractStageMutation = useMutation({
        mutationFn: async (props: Readonly<{ contractKey: string; stage: ContractStageSwappable; inGameTime: number; }>) => {
            if(!data?.data?.id) return;
            return await updateContractStage({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const completeContractMutation = useMutation({
        mutationFn: async (props: Readonly<{ contractKey: string; inGameTime: number; }>) => {
            if(!data?.data?.id) return;
            return await completeContract({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            if(data?.data?.message){
                if(data?.data?.hasSucceeded) toast.success(data.data.message);
                else toast.error(data.data.message);
            }
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const cancelContractMutation = useMutation({
        mutationFn: async (props: Readonly<{ contractKey: string; inGameTime: number; }>) => {
            if(!data?.data?.id) return;
            return await cancelContract({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const regenerateContractsMutation = useMutation({
        mutationFn: async (props: Readonly<{ inGameTime: number; timeLeft?: number; }>) => {
            if(!data?.data?.id) return;
            return await regenerateContracts({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })



    //______________________________________________________________________________________
    // ===== Business Mutations =====

    const purchaseBusinessMutation = useMutation({
        mutationFn: async (props: Readonly<{ businessKey: string; inGameTime: number; timeLeft?: number; }>) => {
            if(!data?.data?.id) return;
            return await purchaseBusiness({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const forecloseBusinessMutation = useMutation({
        mutationFn: async (props: Readonly<{ businessKey: string; inGameTime: number; }>) => {
            if(!data?.data?.id) return;
            return await forecloseBusiness({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const sellBusinessMutation = useMutation({
        mutationFn: async (props: Readonly<{ businessKey: string; inGameTime: number; }>) => {
            if(!data?.data?.id) return;
            return await sellBusiness({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            if(data?.data?.message){
                if(data?.data?.hasSucceeded) toast.success(data.data.message);
                else toast.error(data.data.message);
            }
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const incomeBusinessMutation = useMutation({
        mutationFn: async (props: Readonly<{ businessKey: string; inGameTime: number; }>) => {
            if(!data?.data?.id) return;
            return await incomeBusiness({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            if(data?.data?.message){
                if(data?.data?.hasSucceeded) toast.success(data.data.message);
                else toast.error(data.data.message);
            }
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })

    const regenerateBusinessesMutation = useMutation({
        mutationFn: async (props: Readonly<{ inGameTime: number; timeLeft?: number; }>) => {
            if(!data?.data?.id) return;
            return await regenerateBusinesses({ id: data.data.id, ...props });
        },
        onMutate: () => setStoreKeyValuePair({ isGameSaving: true }),
        onSuccess: async (data) => {
            if(data?.error) throw new Error(data?.message ?? "Unknown Error!");
            await queryClient.invalidateQueries({ queryKey: ['saveFile'] })
        },
        onError: (error) => {
            setStoreKeyValuePair({ isGameSaving: false });
            toast.error(error?.message || "Unknown Error!");
        },
    })



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

        mutations: {
            updateResourcesMutation,

            hireMercMutation,
            assignMercMutation,
            regenerateMercsMutation,

            signContractMutation,
            updateContractStageMutation,
            completeContractMutation,
            cancelContractMutation,
            regenerateContractsMutation,

            purchaseBusinessMutation,
            forecloseBusinessMutation,
            sellBusinessMutation,
            incomeBusinessMutation,
            regenerateBusinessesMutation,
        }
    }
}