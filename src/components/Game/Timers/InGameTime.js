"use client"

// React/Next------------------------------------------------------------------------
import { useEffect } from 'react';
// Context---------------------------------------------------------------------------
import { useSession } from "next-auth/react";
import { useAppContext } from '@/context/AppContext';
// Hooks-----------------------------------------------------------------------------
import useTimer from "@/hooks/useTimer"
// Other-----------------------------------------------------------------------------
import { checkRoleAccessLevel } from '@/util';
import ReadableTime from '@/components/SaveFile/ReadableTime';

//______________________________________________________________________________________
// ===== Component =====
export default function InGameTime({ inGameTime }){
    console.log({ trace:"InGameTime", inGameTime });

    //______________________________________________________________________________________
    // ===== Context =====
    const { data: session, status} = useSession();
    const { debugMode, gameInGameTime, setGameInGameTime, gameLastSavedTime } = useAppContext();



    //______________________________________________________________________________________
    // ===== Hooks =====
    const [ seconds ] = useTimer(1000, { initialCycles:inGameTime });



    //______________________________________________________________________________________
    // ===== Hooks =====
    useEffect(() => {
        setGameInGameTime(seconds)
    }, [seconds])
    



    //______________________________________________________________________________________
    // ===== Component Return =====

    if(checkRoleAccessLevel(session, "ADMIN") && debugMode) return <>
        <p>secs: {seconds}</p>
        <p>igt: <ReadableTime timeInSeconds={gameInGameTime}/></p>
        <p>saved: <ReadableTime timeInSeconds={gameLastSavedTime}/></p>
    </>

    return;
}