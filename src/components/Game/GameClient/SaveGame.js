"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from 'react';
// Actions---------------------------------------------------------------------------
import { updateSaveFile } from '@/actions/saveFile';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Stores----------------------------------------------------------------------------
import { useDebugModeStore, useGameSavingStore, useInGameTimeStore, useSaveFileIdStore } from '@/stores/game';
// Hooks-----------------------------------------------------------------------------
// Components------------------------------------------------------------------------
import ReadableTime from '@/components/SaveFile/ReadableTime';
// Data------------------------------------------------------------------------------
import { saveInterval } from '@/data/_config';
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel, isObj } from '@/util';

//______________________________________________________________________________________
// ===== Component =====
export default function SaveGame({ propInGameTime }){

    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();
    


    //______________________________________________________________________________________
    // ===== Stores =====
    const debugMode = useDebugModeStore((state) => state.debugMode);
    const saveFileId = useSaveFileIdStore((state) => state.saveFileId);
    const { gameSaving, toggleGameSaving } = useGameSavingStore((state) => state);
    const { inGameTime, lastSavedTime, setLastSavedTime } = useInGameTimeStore((state) => state);



    //______________________________________________________________________________________
    // ===== State - Core =====
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

            // create our save file and take us there or wait for a response
            const response = await updateSaveFile(saveFileId, timeInSeconds);

            if(isObj(response, ["error"])){
                // setErrorMessage(response.message || "Something went wrong creating your save file!");
                return;
            }

            // assume there is no error that we need to display to the user
            setLastSavedTime(timeInSeconds);
            toggleGameSaving();
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