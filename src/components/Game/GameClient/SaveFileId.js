"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from 'react';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Stores----------------------------------------------------------------------------
import { useDebugModeStore, useSaveFileIdStore } from '@/stores/game';
// Hooks-----------------------------------------------------------------------------
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel } from '@/util';

//______________________________________________________________________________________
// ===== Component =====
export default function SaveFileId({ propSaveFileId }){

    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();
    


    //______________________________________________________________________________________
    // ===== Stores =====
    const debugMode = useDebugModeStore((state) => state.debugMode);
    const { saveFileId, setSaveFileId } = useSaveFileIdStore((state) => state)



    //______________________________________________________________________________________
    // ===== State =====
    const [ initialized, setInitialized ] = useState(false);



    //______________________________________________________________________________________
    // ===== Use Effect =====
    useEffect(() => {
        if(initialized) return;
        setSaveFileId(propSaveFileId);
        setInitialized(true);
    }, [initialized, propSaveFileId])
    


    //______________________________________________________________________________________
    // ===== Component Return =====

    if(!(checkRoleAccessLevel(session, "ADMIN") && debugMode && initialized)) return;
    
    return <p>id: {saveFileId}</p>
}