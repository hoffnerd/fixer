"use client"

// Types ----------------------------------------------------------------------------
import type { Contract } from "@/types";
import type { RESOURCES_INFO } from "@/data/_config";
// Packages -------------------------------------------------------------------------
import { toast } from "sonner";
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Popover, PopoverTrigger, PopoverContentNoPortal } from "../shadcn/ui/popover";
import { Button } from "@/components/shadcn/ui/button";
import ToolTipCapsule from "@/_legoBlocks/nextjsCommon/components/shadcn/ToolTipCapsule";
import ResourceBadge from "../ResourceBadge";
import { ReadableTime } from "@/_legoBlocks/nextjsCommon/components/microComponents";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { useEffect, useState } from "react";
import ContractSignedContent from "./contract/ContractSignedContent";
import ContractSignedFooter from "./contract/ContractSignedFooter";



//______________________________________________________________________________________
// ===== True Constants =====

const DESCRIPTION = "This is a contract description. It can be as long as you want. It can even be multiple lines. This is a contract description. It can be as long as you want. It can even be multiple lines. This is a contract description. It can be as long as you want. It can even be multiple lines.";


//______________________________________________________________________________________
// ===== Micro-Components =====

function ContractStageFooter({ contract }: Readonly<{ contract: Contract; }>) {
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);

    const onClick = () => {
        console.log({ trace: "onClick", key: contract.key, stage: contract.stage });
        if(contract.stage === "unsigned") return pushToSaveQueue({ mutationKey: "signContractMutation", props: { contractKey: contract.key } });
    }

    if(contract.stage === "unsigned") return <>
        <Button variant="neonEffect" className="w-full neColorBlue rounded-none" onClick={onClick} disabled={isGameSaving}>
            Sign
        </Button>
    </>

    if(contract.stage === "signed") return <ContractSignedFooter contract={contract} />
    if(contract.stage === "researching") return <span>Researching</span>
    if(contract.stage === "inProgress") return <span>In Progress</span>
    
    return <span>Unknown</span>
}

function ContractStageContent({ contract }: Readonly<{ contract: Contract; }>) {


    if(contract.stage === "unsigned") return <>
        <div className="text-xs text-gray-500 max-h-20 overflow-hidden text-ellipsis">
            {DESCRIPTION}
        </div>
        <div>Completion in: <ReadableTime timeInSeconds={contract.time} /></div>
    </>

    if(contract.stage === "signed") return <ContractSignedContent contract={contract} />
    if(contract.stage === "researching") return <span>Researching</span>
    if(contract.stage === "inProgress") return <span>In Progress</span>
    
    return <span>Unknown</span>
}



//______________________________________________________________________________________
// ===== Component =====

export default function ContractCard({ contract }: Readonly<{ contract: Contract; }>) {

    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((contract.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();



    //______________________________________________________________________________________
    // ===== Stores =====
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);
    const sessionTime = useGameStore((state) => state.sessionTime);



    //______________________________________________________________________________________
    // ===== State =====
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);


    //______________________________________________________________________________________
    // ===== Use Effect =====

    useEffect(() => {
        if(sessionStartTime !== null) return;
        setSessionStartTime(sessionTime);
    }, [sessionTime])
    



    //______________________________________________________________________________________
    // ===== Functions =====

    const onClick = () => {
        console.log({ trace: "onClick", key: contract.key, stage: contract.stage });
        if(contract.stage === "unsigned") return pushToSaveQueue({ mutationKey: "signContractMutation", props: { contractKey: contract.key } });
    }


    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Card className="py-0 pt-6 mt-2 mb-5 gap-1 border-2 overflow-hidden neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <div className="flex flex-col">
                        <span>{contract.display}</span>
                        <span className="pt-1">- {contract.roleDisplay}</span>
                    </div>
                    <div className="flex flex-col">
                        <span>Lvl: {level}</span>
                        <span className="pt-1">Rewards:</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2">
                <div className="col-span-2 flex flex-col">
                    <ContractStageContent contract={contract} />
                </div>
                <div className="flex justify-end">
                    <ul className="whitespace-nowrap">
                        {Object.entries(contract.rewards).map(([key, value]) => (
                            <ResourceBadge 
                                key={key} 
                                resourceKey={key as keyof typeof RESOURCES_INFO} 
                                value={(value ?? 0) as number}
                                options={{ hideTooltip: true }}
                            />
                        ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="px-0">
                <ContractStageFooter contract={contract} />
            </CardFooter>
        </Card>
    )
}
