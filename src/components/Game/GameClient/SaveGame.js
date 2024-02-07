"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from 'react';
// Actions---------------------------------------------------------------------------
import { updateSaveFile } from '@/actions/saveFile';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Stores----------------------------------------------------------------------------
import { useDebugModeStore, useGameSavingStore, useInGameTimeStore, useResourceStore, useSaveFileIdStore } from '@/stores/game';
// Hooks-----------------------------------------------------------------------------
import { useUpdateSaveFile } from '@/rQuery/hooks/saveFile';
// Components------------------------------------------------------------------------
import ReadableTime from '@/components/SaveFile/ReadableTime';
// Data------------------------------------------------------------------------------
import { saveInterval } from '@/data/_config';
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel, isObj } from '@/util';
import { useQueryClient } from '@tanstack/react-query';

//______________________________________________________________________________________
// ===== Component =====
export default function SaveGame({ propInGameTime }){

    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();
    
    const queryClient = useQueryClient()


    //______________________________________________________________________________________
    // ===== Stores =====
    const debugMode = useDebugModeStore((state) => state.debugMode);
    const saveFileId = useSaveFileIdStore((state) => state.saveFileId);
    const { gameSaving, toggleGameSaving } = useGameSavingStore((state) => state);
    const { inGameTime, lastSavedTime, setLastSavedTime } = useInGameTimeStore((state) => state);
    const { e, w, t, q, setResource } = useResourceStore((state) => state)



    //______________________________________________________________________________________
    // ===== State =====
    const { mutate } = useUpdateSaveFile();



    //______________________________________________________________________________________
    // ===== State =====
    const [initialized, setInitialized] = useState(false);



    //______________________________________________________________________________________
    // ===== Use Effect =====
    
    useEffect(() => {
        console.log({saveFileId})
        if(initialized && !saveFileId) return;
        setLastSavedTime(propInGameTime);
        setInitialized(true);
    }, [propInGameTime, saveFileId])
    
    /**
     * Checks if it's time to save the game and if so, set `gameSaving` to true to activate the next useEffect
     * @dependencies saveFileId, gameInGameTime, gameLastSavedTime
     */
    useEffect(() => {
        if((!initialized) && gameSaving) return;

        if(!saveFileId) return;

        // return early if the time since the last save is more than our `saveInterval`
        if((inGameTime - lastSavedTime) <= saveInterval) return;
        
        toggleGameSaving();
    }, [initialized, saveFileId, inGameTime, lastSavedTime]);

    /**
     * Checks if we should save and if so, it calls an async function to update a save file.
     * @dependencies gameSaving
     */
    useEffect(() => {
        if(!(initialized && gameSaving)) return;

        // declare that we are subscribed and want the async function below to happen
        let isSubscribed = true;

        // create an async function that fetches the data so that this `useEffect` may call it below
        const saveGame = async () => {

            // return early if an unexpected render happened so that the code below does not run twice
            if(!isSubscribed) return;

            const timeInSeconds = inGameTime;

            mutate({
                id:saveFileId, 
                inGameTime:timeInSeconds, 
                additionalSaveData:{ 
                    resources:{ e:e+1, w, t, q }
                },
                onSuccess: (data, variables) => {
                    queryClient.setQueryData([`readSaveFile`, { id:variables.id }], data)

                    data?.saveData?.resources?.e && setResource("e", data.saveData.resources.e);
                    data?.saveData?.resources?.w && setResource("w", data.saveData.resources.w);
                    data?.saveData?.resources?.t && setResource("t", data.saveData.resources.t);
                    data?.saveData?.resources?.q && setResource("q", data.saveData.resources.q);
                    
                    setLastSavedTime(timeInSeconds);
                    toggleGameSaving();
                },
                onError: () => {
                    // setErrorMessage(response.message || "Something went wrong creating your save file!");
                }
            });
        }

        // execute the async function defined above
        saveGame();

        // cancel any future `fetchData` functions
        return () => isSubscribed = false;
    }, [initialized, gameSaving]);


    //______________________________________________________________________________________
    // ===== Component Return =====

    if(!(checkRoleAccessLevel(session, "ADMIN") && debugMode)) return;
    
    return <>
        <p>saved: <ReadableTime timeInSeconds={lastSavedTime}/></p>
        <p>saving: {gameSaving ? "true" : "false"}</p>
    </>   
}