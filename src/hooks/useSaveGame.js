"use client"

// React/Next------------------------------------------------------------------------
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
// Actions---------------------------------------------------------------------------
// Context---------------------------------------------------------------------------
// Stores----------------------------------------------------------------------------
import { useGameSavingStore, useInGameTimeStore, useResourceStore } from '@/stores/game';
// Hooks-----------------------------------------------------------------------------
import { useUpdateSaveFile } from '@/rQuery/hooks/saveFile';
// Data------------------------------------------------------------------------------
// Other-----------------------------------------------------------------------------
import { isObj } from '@/util';



//______________________________________________________________________________________
// ===== Component =====
export default function useSaveGame(){

    //______________________________________________________________________________________
    // ===== URL Params  =====
    const params = useParams();
    const saveFileId = isObj(params, [ 'id' ]) ? params.id : null;



    //______________________________________________________________________________________
    // ===== Stores =====

    const { gameSaving, setGameSaving } = useGameSavingStore((state) => state);

    const inGameTime = useInGameTimeStore((state) => state.inGameTime);
    const setLastSavedTime = useInGameTimeStore((state) => state.setLastSavedTime);

    const { e, w, t, q, setResource } = useResourceStore((state) => state)



    //______________________________________________________________________________________
    // ===== React Query =====
    const queryClient = useQueryClient();
    const { mutate } = useUpdateSaveFile();
    


    //______________________________________________________________________________________
    // ===== Functions =====

    const saveGame = (additionalSaveData) => {
        if((!saveFileId) && gameSaving) return;

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