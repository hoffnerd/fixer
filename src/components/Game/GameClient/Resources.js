"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from 'react';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Stores----------------------------------------------------------------------------
import { useDebugModeStore, useResourceStore } from '@/stores/game';
// Hooks-----------------------------------------------------------------------------
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel, isObj } from '@/util';

//______________________________________________________________________________________
// ===== Component =====
export default function Resources({ resources }){

    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();
    


    //______________________________________________________________________________________
    // ===== Stores =====
    const debugMode = useDebugModeStore((state) => state.debugMode);
    const { e, w, t, q, setResource } = useResourceStore((state) => state)



    //______________________________________________________________________________________
    // ===== State =====
    const [ initialized, setInitialized ] = useState(false);



    //______________________________________________________________________________________
    // ===== Use Effect =====
    useEffect(() => {
        if(initialized) return;
        
        isObj(resources) && Object.keys(resources)?.forEach((key)=>{
            setResource(key, resources[key])
        })

        setInitialized(true);
    }, [initialized, resources])
    


    //______________________________________________________________________________________
    // ===== Component Return =====

    if(!(checkRoleAccessLevel(session, "ADMIN") && debugMode && initialized)) return;
    
    return <>
        <p>e: {e}</p>
        <p>w: {w}</p>
        <p>t: {t}</p>
        <p>q: {q}</p>
    </>
}