"use client"

// Types ----------------------------------------------------------------------------
import type { Contract } from "@/types";
import type { RESOURCES_INFO } from "@/data/_config";
// Packages -------------------------------------------------------------------------
import { toast } from "sonner";
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER, SCALING_REGENERATED_TIME } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Popover, PopoverTrigger, PopoverContentNoPortal } from "@/components/shadcn/ui/popover";
import { Button } from "@/components/shadcn/ui/button";
import ToolTipCapsule from "@/_legoBlocks/nextjsCommon/components/shadcn/ToolTipCapsule";
import ResourceBadge from "@/components/ResourceBadge";
import { ReadableTime } from "@/_legoBlocks/nextjsCommon/components/microComponents";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/ui/sheet";
import { getContractSuccessChanceDisplay } from "@/utils/contracts";



//______________________________________________________________________________________
// ===== Component =====

export default function ContractSignedContent({ contract }: Readonly<{ contract: Contract; }>) {

    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((contract.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);
    const mercKey = contract?.mercSlots?.main?.key;



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();
    const merc = mercKey && saveFile?.mercs?.[mercKey]?.key ? saveFile.mercs[mercKey] : null;



    //______________________________________________________________________________________
    // ===== Stores =====
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);
    const sessionTime = useGameStore((state) => state.sessionTime);



    //______________________________________________________________________________________
    // ===== State =====
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
    const [timeUntilAutoCancel, setTimeUntilAutoCancel] = useState(SCALING_REGENERATED_TIME);


    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        if(sessionStartTime !== null) return;
        setSessionStartTime(sessionTime);
    }, [sessionTime])

    // useEffect(() => {
    //     if(sessionStartTime === null) return;
    //     setTimeUntilAutoCancel(SCALING_REGENERATED_TIME - ((sessionTime - sessionStartTime) % SCALING_REGENERATED_TIME));
    // }, [sessionTime])

    useEffect(() => {
        if(sessionStartTime === null) return;
        if(timeUntilAutoCancel <= 0) return;
        setTimeUntilAutoCancel((prev) => prev - 1);
    }, [sessionTime])

    useEffect(() => {
        if(timeUntilAutoCancel > 0) return;
        pushToSaveQueue({ mutationKey: "cancelContractMutation", props: { contractKey: contract.key } });
    }, [timeUntilAutoCancel])


    //______________________________________________________________________________________
    // ===== Component Return =====
    return <>
        <Sheet>
            <SheetTrigger asChild>
                <Button size="sm" variant="ghost" className="w-full">Details</Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="flex justify-center">Contract Details</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                    <h3 className="text-xl font-bold pb-4">{contract.display} - {contract.roleDisplay}</h3>
                    <p className="pb-4">Level: {level}</p>
                    <p className="pb-4">Description: {contract.description}</p>
                    <p>Rewards:</p>
                    <ul className="whitespace-nowrap pb-4">
                        {Object.entries(contract.rewards).map(([key, value]) => (
                            <ResourceBadge 
                                key={key} 
                                resourceKey={key as keyof typeof RESOURCES_INFO} 
                                value={(value ?? 0) as number}
                                options={{ hideTooltip: true }}
                            />
                        ))}
                    </ul>
                    <p>Intel Bonuses:</p>
                    <p className="pb-4">None</p>
                    <p>Research Costs:</p>
                    <p className="pb-4">None</p>
                </div>
            </SheetContent>
        </Sheet>
        <div className="grid grid-cols-3 gap-1">
            <span className="col-span-2">Auto-Cancel in: </span>
            <span className="neonEffect neText neTextGlow neColorRed">
                <ReadableTime timeInSeconds={timeUntilAutoCancel} />
            </span>

            <span className="col-span-2">Completion Time:</span>
            <span><ReadableTime timeInSeconds={contract.time} /></span>
            
            <span className="col-span-2">Completion Chance:</span>
            <span className={`neonEffect neText neTextGlow ${merc?.key ? "neColorGreen" : "neColorRed"}`}>
                {merc?.key ? getContractSuccessChanceDisplay(contract, merc) : "Unknown"}
            </span>

            <span className="col-span-2">Assigned Merc:</span>
            <span className={`neonEffect neText neTextGlow ${merc?.display ? "neColorBlue" : "neColorRed"}`}>
                {merc?.display ?? "None"}
            </span>
        </div>
        {/* <ul className="list-disc ml-1">
            <li>
                <span>Auto-Cancel in: </span>
                <span className="neonEffect neText neTextGlow neColorRed">
                    <ReadableTime timeInSeconds={timeUntilAutoCancel} />
                </span>
            </li>
            <li>Completion in: <ReadableTime timeInSeconds={contract.time} /></li>
            <li>
                <span>Assigned Merc: </span>
                <span className={`neonEffect neText neTextGlow ${merc?.display ? "neColorBlue" : "neColorRed"}`}>
                    {merc?.display ?? "None"}
                </span>
            </li>
        </ul> */}
    </>
}