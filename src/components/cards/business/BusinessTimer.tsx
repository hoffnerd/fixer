"use client"

// Types ----------------------------------------------------------------------------
import type { Business } from "@/types";
// Packages -------------------------------------------------------------------------
import { useEffect, useState } from "react";
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER, SCALING_REGENERATED_TIME } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import ToolTipCapsule from "@/_legoBlocks/nextjsCommon/components/shadcn/ToolTipCapsule";
import { ReadableTime } from "@/_legoBlocks/nextjsCommon/components/microComponents";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";



//______________________________________________________________________________________
// ===== Micro-Components =====

function TimeLeft({
    children,
    className,
    business,
    timeUntilDefault = SCALING_REGENERATED_TIME,
}: Readonly<{
    children?: React.ReactNode;
    className?: string;
    business: Business;
    timeUntilDefault?: number;
}>) {

    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((business.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();



    //______________________________________________________________________________________
    // ===== Stores =====
    const setInitialTimes = useGameStore((state) => state.setInitialTimes);
    const updateTimes = useGameStore((state) => state.updateTimes);
    const removeTimes = useGameStore((state) => state.removeTimes);
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);
    const sessionTime = useGameStore((state) => state.sessionTime);
    const businessTimes = useGameStore((state) => state.businessTimes);
    const businessTime = businessTimes[business.key];



    //______________________________________________________________________________________
    // ===== State =====
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
    // const [timeUntil, setTimeUntil] = useState(timeUntilDefault);


    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        if(sessionStartTime !== null) return;
        setSessionStartTime(sessionTime);
        setInitialTimes({ businessKey: business.key, time: timeUntilDefault, timeLeft: timeUntilDefault });
    }, [sessionTime])

    useEffect(() => {
        if(sessionStartTime === null) return;
        if(!businessTime) return;
        if(businessTime.timeLeft <= 0) return;
        updateTimes({ businessKey: business.key });
    }, [sessionTime])

    useEffect(() => {
        // console.log({ trace: "TimeLeft useEffect", businessTime, business });
        if(!businessTime) return;
        if(businessTime.timeLeft > 0) return;
        
        if((!business?.mercSlots?.manager?.key) && (!business?.mercSlots?.security?.key) && (!business?.mercSlots?.illicitActivity?.key)){
            // Close/remove business
            removeTimes({ businessKey: business.key });
        } else {
            // Income hits account
        }
    }, [ businessTime?.timeLeft ])


    //______________________________________________________________________________________
    // ===== Component Return =====
     return (
        <ToolTipCapsule content={children} options={{ childrenAs: "trigger" }}>
            <span className={className}>
                <ReadableTime timeInSeconds={businessTime?.timeLeft ?? timeUntilDefault} options={{ showHours: false }} />
            </span>
        </ToolTipCapsule>
    );
}










//______________________________________________________________________________________
// ===== Component =====

export default function BusinessTimer({ business }: Readonly<{ business: Business; }>) {

    //______________________________________________________________________________________
    // ===== Constants =====
    const regeneratedTime = business?.time ?? SCALING_REGENERATED_TIME;
    const timeUntil = business?.mercSlots?.manager?.key ? regeneratedTime/2 : regeneratedTime;


    //______________________________________________________________________________________
    // ===== Component Return =====

    if(business?.stage === "closed"){
        return (
            <ToolTipCapsule content="How long until the business income hits your account." options={{ childrenAs: "trigger" }}>
                <span>
                    <ReadableTime timeInSeconds={timeUntil} options={{ showHours: false }} />
                </span>
            </ToolTipCapsule>
        )
    }
    
    if((!business?.mercSlots?.manager?.key) && (!business?.mercSlots?.security?.key) && (!business?.mercSlots?.illicitActivity?.key)) {
        return (
            <TimeLeft key="noMercs" className="neonEffect neText neTextGlow neColorRed" business={business}>
                Time until you lose this business due to no mercs being assigned and the business forced to be closed.
            </TimeLeft>
        )
    }

    if(!business?.mercSlots?.manager?.key) {
        return (
            <TimeLeft key="openNoManager" className="neonEffect neText neTextGlow neColorGreen" business={business} timeUntilDefault={timeUntil}>
            {/* <TimeLeft key="openNoManager" className="neonEffect neText neTextGlow neColorGreen" business={business} timeUntilDefault={10}> */}
                Time until income hits your account.
            </TimeLeft>
        )
    }

    return (
        <TimeLeft key="openWithManager" className="neonEffect neText neTextGlow neColorGreen" business={business} timeUntilDefault={timeUntil}>
        {/* <TimeLeft key="openWithManager" className="neonEffect neText neTextGlow neColorGreen" business={business} timeUntilDefault={10}> */}
            Time until income hits your account.
        </TimeLeft>
    )
}