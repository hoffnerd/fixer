"use client"

// React/Next------------------------------------------------------------------------
import { useParams } from 'next/navigation';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Stores----------------------------------------------------------------------------
import { useDebugModeStore } from '@/stores/game';
// Hooks-----------------------------------------------------------------------------
import useSaveGame from '@/hooks/useSaveGame';
// Components------------------------------------------------------------------------
import { Button } from '@/components/shadcn/ui/button';
// Data------------------------------------------------------------------------------
import { defaultSaveData } from '@/data/defaultSaveData';
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel, isObj } from '@/util';

//______________________________________________________________________________________
// ===== Component =====
export default function Gizmo({ saveFile }){

    //______________________________________________________________________________________
    // ===== URL Params  =====
    const params = useParams();
    const saveFileId = isObj(params, [ 'id' ]) ? params.id : null;



    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();
    


    //______________________________________________________________________________________
    // ===== Stores =====
    const debugMode = useDebugModeStore((state) => state.debugMode);
    


    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveGame } = useSaveGame();



    //______________________________________________________________________________________
    // ===== Component Return =====

    if(!(checkRoleAccessLevel(session, "ADMIN") && debugMode)) return;
    
    return <>
        <Button variant="link" onClick={()=>console.log(saveFile)}>
            Log SaveFile
        </Button>
        <br/>
        <Button variant="link" onClick={()=>saveGame({
            chapter: defaultSaveData.chapter,
            articles: defaultSaveData.articles,
            notifications: defaultSaveData.notifications,
        })}>
            Go Back to 0
        </Button>
        <p>id: {saveFileId}</p>
    </>
}