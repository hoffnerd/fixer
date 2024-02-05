"use client"

// React/Next------------------------------------------------------------------------
import { useEffect } from 'react';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
// Stores----------------------------------------------------------------------------
import { useDebugModeStore, useInGameTimeStore } from '@/stores/game';
// Hooks-----------------------------------------------------------------------------
import useTimer from "@/hooks/useTimer"
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel } from '@/util';
import ReadableTime from '@/components/SaveFile/ReadableTime';

//______________________________________________________________________________________
// ===== Component =====
export default function InGameTime({ propInGameTime }){

    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();
    


    //______________________________________________________________________________________
    // ===== Stores =====
    const debugMode = useDebugModeStore((state) => state.debugMode);
    const { inGameTime, setInGameTime } = useInGameTimeStore((state) => state);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const [ seconds ] = useTimer(1000, { initialCycles:propInGameTime });



    //______________________________________________________________________________________
    // ===== Hooks =====
    useEffect(() => {
        setInGameTime(seconds)
    }, [seconds])
    



    //______________________________________________________________________________________
    // ===== Component Return =====

    if(!(checkRoleAccessLevel(session, "ADMIN") && debugMode)) return;
    
    return <>
        <p>secs: {seconds}</p>
        <p>igt: <ReadableTime timeInSeconds={inGameTime}/></p>
        <p>saved: <ReadableTime timeInSeconds={inGameTime}/></p>
    </>   
}