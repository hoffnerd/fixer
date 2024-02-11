"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from 'react';
// Actions---------------------------------------------------------------------------
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
import useSaveGame from '@/hooks/useSaveGame';

//______________________________________________________________________________________
// ===== Component =====
export default function SaveGame({ propInGameTime }){

    //______________________________________________________________________________________
    // ===== React Query =====
    const queryClient = useQueryClient()
    const { mutate } = useUpdateSaveFile();



    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();
    


    //______________________________________________________________________________________
    // ===== Stores =====
    const debugMode = useDebugModeStore((state) => state.debugMode);
    const saveFileId = useSaveFileIdStore((state) => state.saveFileId);
    const { gameSaving, toggleGameSaving } = useGameSavingStore((state) => state);
    const { inGameTime, lastSavedTime, setLastSavedTime } = useInGameTimeStore((state) => state);
    // const { e, w, t, q, setResource } = useResourceStore((state) => state)



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveGame } = useSaveGame();



    //______________________________________________________________________________________
    // ===== State =====
    const [initialized, setInitialized] = useState(false);



    //______________________________________________________________________________________
    // ===== Use Effect =====
    
    useEffect(() => {
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

        saveGame();
    }, [initialized, gameSaving]);


    //______________________________________________________________________________________
    // ===== Component Return =====

    if(!(checkRoleAccessLevel(session, "ADMIN") && debugMode)) return;
    
    return <>
        <p>saved: <ReadableTime timeInSeconds={lastSavedTime}/></p>
        <p>saving: {gameSaving ? "true" : "false"}</p>
    </>   
}