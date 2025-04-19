"use client"

// Types ----------------------------------------------------------------------------
import type { Contract } from "@/types";
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
// ===== Component =====

function TimeLeft({
    children,
    className,
    contract,
    timeUntilDefault = SCALING_REGENERATED_TIME,
}: Readonly<{
    children?: React.ReactNode;
    className?: string;
    contract: Contract;
    timeUntilDefault?: number;
}>) {

    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((contract.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);



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
    const contractTimes = useGameStore((state) => state.contractTimes);
    const contractTime = contractTimes[contract.key];



    //______________________________________________________________________________________
    // ===== State =====
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
    // const [timeUntil, setTimeUntil] = useState(timeUntilDefault);


    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        if(sessionStartTime !== null) return;
        setSessionStartTime(sessionTime);
        setInitialTimes({ contractKey: contract.key, time: timeUntilDefault, timeLeft: timeUntilDefault });
    }, [sessionTime])

    // useEffect(() => {
    //     if(sessionStartTime === null) return;
    //     setTimeUntil(SCALING_REGENERATED_TIME - ((sessionTime - sessionStartTime) % SCALING_REGENERATED_TIME));
    // }, [sessionTime])

    useEffect(() => {
        if(sessionStartTime === null) return;
        if(!contractTime) return;
        if(contractTime.timeLeft <= 0) return;
        updateTimes({ contractKey: contract.key });
    }, [sessionTime])

    useEffect(() => {
        if(!contractTime) return;
        if(contractTime.timeLeft > 0) return;
        removeTimes({ contractKey: contract.key });
        if(contract.stage === "signed"){
            pushToSaveQueue({ mutationKey: "cancelContractMutation", props: { contractKey: contract.key } });
        }
        if(contract.stage === "researching"){
            pushToSaveQueue({ mutationKey: "updateContractStageMutation", props: { contractKey: contract.key, stage: "signed" } });
        }
        if(contract.stage === "inProgress"){
            // Complete contract
        }
    }, [contractTime])


    //______________________________________________________________________________________
    // ===== Component Return =====
     return (
        <ToolTipCapsule content={children} options={{ childrenAs: "trigger" }}>
            <span className={className}>
                <ReadableTime timeInSeconds={contractTime?.timeLeft ?? timeUntilDefault} options={{ showHours: false }} />
            </span>
        </ToolTipCapsule>
    );
}










//______________________________________________________________________________________
// ===== Component =====

export default function ContractTimer({ contract }: Readonly<{ contract: Contract; }>) {

    //______________________________________________________________________________________
    // ===== Component Return =====
    switch (contract.stage) {
        case "unsigned": return (
            <ToolTipCapsule content="Time until contract completion once started." options={{ childrenAs: "trigger" }}>
                <span>
                    <ReadableTime timeInSeconds={contract.time} options={{ showHours: false }} />
                </span>
            </ToolTipCapsule>
        );
        case "signed": return (
            <TimeLeft key="signed" className="neonEffect neText neTextGlow neColorRed" contract={contract}>
                Time until contract will auto-cancel due to lack of progress.
            </TimeLeft>
        );
        case "researching": return (
            <TimeLeft key="researching" className="neonEffect neText neTextGlow neColorBlue" contract={contract}>
                Time until more intel has been gathered about this contract.
            </TimeLeft>
        );
        case "inProgress": return (
            <TimeLeft key="inProgress" className="neonEffect neText neTextGlow neColorGreen" contract={contract} timeUntilDefault={contract.time}>
                Time until this contract is completed.
            </TimeLeft>
        );
        case "completed": return <span className="neonEffect neText neTextGlow neColorGreen">00:00:00</span>;
        default: return <span>Unknown</span>;
    }
}