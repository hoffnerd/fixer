"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from 'react';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Stores----------------------------------------------------------------------------
import { useDebugModeStore, useSaveFileIdStore } from '@/stores/game';
// Components------------------------------------------------------------------------
import { Button } from '@/components/shadcn/ui/button';
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel, isObj } from '@/util';

//______________________________________________________________________________________
// ===== Component =====
export default function SaveFileId({ saveFile }){

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
        if(initialized && !isObj(saveFile, ["id"])) return;

        setSaveFileId(saveFile.id);
        setInitialized(true);
    }, [initialized, saveFile])
    


    //______________________________________________________________________________________
    // ===== Component Return =====

    if(!(checkRoleAccessLevel(session, "ADMIN") && debugMode && initialized)) return;
    
    return <>
        <Button onClick={()=>console.log(saveFile)}>
            Log SaveFile
        </Button>
        <p>id: {saveFileId}</p>
    </>
}