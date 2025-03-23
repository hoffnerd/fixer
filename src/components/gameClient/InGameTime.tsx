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
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function InGameTime({ saveFile }: Readonly<{ saveFile: SaveFile }>){

    //______________________________________________________________________________________
    // ===== Stores =====
    const setStoreKeyValuePair = useGameStore((state) => state.setStoreKeyValuePair);

    //______________________________________________________________________________________
    // ===== Hooks =====
    const [ seconds ] = useTimer(1000, { initialCycles: (saveFile.inGameTime || 0) });

    //______________________________________________________________________________________
    // ===== Use Effect =====
    useEffect(() => {
        setStoreKeyValuePair({ inGameTime: seconds })
    }, [seconds])

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Portal targetElementId="debuggerContent" childElementId="InGameTime.content">
            <ul id="InGameTime.content" className="list-disc ml-5">
                <li>
                    <strong>inGameTime: </strong>
                    <ReadableTime timeInSeconds={seconds} />
                </li>
            </ul>
        </Portal>
    );
}
