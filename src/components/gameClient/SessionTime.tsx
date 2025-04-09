"use client"

// Types ----------------------------------------------------------------------------
import { type SaveFile } from "@/types";
// Packages -------------------------------------------------------------------------
import { useEffect } from "react";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Data -----------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
import useTimer from "@/_legoBlocks/nextjsCommon/hooks/useTimer";
// Components -----------------------------------------------------------------------
import Portal from "@/_legoBlocks/nextjsCommon/components/Portal";
import { ReadableTime } from "@/_legoBlocks/nextjsCommon/components/microComponents";
import { Button } from "../shadcn/ui/button";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function SessionTime(){

    //______________________________________________________________________________________
    // ===== Stores =====
    const isSessionTimerRunning = useGameStore((state) => state.isSessionTimerRunning);
    const setStoreKeyValuePair = useGameStore((state) => state.setStoreKeyValuePair);


    
    //______________________________________________________________________________________
    // ===== Hooks =====
    const [ seconds, stopTimer, startTimer ] = useTimer(1000);



    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        setStoreKeyValuePair({ sessionTime: seconds })
    }, [seconds, setStoreKeyValuePair])

    useEffect(() => {
        if(isSessionTimerRunning){ 
            startTimer();
        } else {
            stopTimer();
        }
    }, [isSessionTimerRunning, startTimer, stopTimer])



    //______________________________________________________________________________________
    // ===== Component Return =====
    return <>
        <Portal targetElementId="debuggerContent" childElementId="SessionTime.content">
            <ul id="SessionTime.content" className="list-disc ml-5">
                <li>
                    <strong>sessionTime: </strong>
                    <ReadableTime timeInSeconds={seconds} />
                </li>
            </ul>
        </Portal>
        <Portal targetElementId="debuggerCommands" childElementId="SessionTime.commands">
            <div id="SessionTime.commands" className="flex flex-col">
                <Button
                    variant="neonEffect"
                    className="neColorYellow"
                    onClick={()=>setStoreKeyValuePair({ isSessionTimerRunning:!isSessionTimerRunning })}
                >
                    Toggle Session Timer
                </Button>
            </div>
        </Portal>
    </>
}
