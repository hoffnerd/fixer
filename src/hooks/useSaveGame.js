"use client"

// React/Next------------------------------------------------------------------------
import { useQueryClient } from '@tanstack/react-query';
// Actions---------------------------------------------------------------------------
// Context---------------------------------------------------------------------------
// Stores----------------------------------------------------------------------------
import { useGameSavingStore, useInGameTimeStore, useResourceStore, useSaveFileIdStore } from '@/stores/game';
// Hooks-----------------------------------------------------------------------------
import { useUpdateSaveFile } from '@/rQuery/hooks/saveFile';
// Data------------------------------------------------------------------------------
// Other-----------------------------------------------------------------------------
import { isObj } from '@/util';
import { useEffect } from 'react';



//______________________________________________________________________________________
// ===== Component =====
export default function useSaveGame(){

    //______________________________________________________________________________________
    // ===== Stores =====

    const saveFileId = useSaveFileIdStore((state) => state.saveFileId);

    const { gameSaving, setGameSaving } = useGameSavingStore((state) => state);

    const inGameTime = useInGameTimeStore((state) => state.inGameTime);
    const setLastSavedTime = useInGameTimeStore((state) => state.setLastSavedTime);

    const { e, w, t, q, setResource } = useResourceStore((state) => state)



    //______________________________________________________________________________________
    // ===== React Query =====
    const queryClient = useQueryClient();
    const { mutate } = useUpdateSaveFile();

    useEffect(() => {
        console.log({ trace:"useSaveGame", saveFileId })
    }, [saveFileId])
    


    //______________________________________________________________________________________
    // ===== Functions =====

    const saveGame = (additionalSaveData) => {
        console.log({ trace:"useSaveGame > saveGame", additionalSaveData, saveFileId, gameSaving });
        if((!saveFileId) && gameSaving) return;
        console.log({ trace:"useSaveGame > saveGame", passed:true });

        setGameSaving(true);

        let newSaveFile = {
            id:saveFileId, 
            inGameTime, 
            additionalSaveData:{ 
                resources:{ e, w, t, q }
            },
        }

        if(isObj(additionalSaveData)){
            newSaveFile.additionalSaveData = { ...newSaveFile.additionalSaveData, ...additionalSaveData }
        }

        mutate({
            ...newSaveFile,
            onSuccess: (data, variables) => {
                console.log({ trace:"useSaveGame > saveGame > mutate > onSuccess", data, variables });

                queryClient.setQueryData([`readSaveFile`, { id:variables.id }], data);
                
                setLastSavedTime(newSaveFile.inGameTime);
                setGameSaving(false);
            },
            onError: (error, variables) => {
                console.error({ trace:"useSaveGame > saveGame > mutate > onError", error, variables });
                // setErrorMessage(response.message || "Something went wrong creating your save file!");
                setGameSaving(false);
            }
        });
    }

    
    //______________________________________________________________________________________
    // ===== Component Return =====
    return { saveGame }
}