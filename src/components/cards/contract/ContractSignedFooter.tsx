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
import { BanIcon, UserXIcon } from "lucide-react";
import MercCard from "../MercCard";
import { getContractSuccessChanceDisplay } from "@/utils/contracts";



//______________________________________________________________________________________
// ===== Micro-Components =====

function ContractMercAssignedFooter({ contract }: Readonly<{ contract: Contract; }>) {
    const { saveFile } = useSaveFile();
    const mercKey = contract?.mercSlots?.main?.key;
    const merc = mercKey && saveFile?.mercs?.[mercKey]?.key ? saveFile.mercs[mercKey] : null;
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);


    const onClick = () => {
        console.log({ trace: "onClick", contract });
        // pushToSaveQueue({ mutationKey: "signContractMutation", props: { contractKey: contract.key } });
    }

    return <>
        <Button variant="neonEffect" className="w-full neColorGreen rounded-none col-span-3" onClick={onClick} disabled={isGameSaving}>
            Start
        </Button>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="neonEffect" className="w-full neColorBlue rounded-none col-span-3">
                    Research
                </Button>
            </PopoverTrigger>
            <PopoverContentNoPortal>
                <div className="flex flex-col">
                    <span>Research Requirements:</span>
                </div>
                <div className="flex flex-col">
                    <span>Research Rewards:</span>
                    <span>Intel Bonus: 2.5%</span>
                </div>
                <Button variant="neonEffect" className="w-full neColorBlue" onClick={onClick} disabled={isGameSaving}>
                    Confirm Research
                </Button>
            </PopoverContentNoPortal>
        </Popover>
        <ToolTipCapsule 
            content={<div>Unassign <span className="neonEffect neText neTextGlow neColorBlue">{merc?.display ?? "Merc"}</span> from this Contract</div>} 
            options={{ childrenAs: "trigger" }}
        >
            <div>
                <Button 
                    variant="neonEffect" 
                    className="w-full neColorYellow rounded-none" 
                    onClick={() => pushToSaveQueue({ 
                        mutationKey: "assignMercMutation",
                        props: { 
                            assignType:"contract", 
                            mercKey: contract?.mercSlots?.main?.key, 
                            contractKey: contract.key,
                            slot: "unassign",
                        }
                    })}
                    disabled={isGameSaving}
                >
                    <UserXIcon/>
                </Button>
            </div>
        </ToolTipCapsule>
    </>
}
 
function ContractNoMercFooter({ contract }: Readonly<{ contract: Contract; }>) {
    const { saveFile } = useSaveFile();
    const mercs = saveFile?.mercs ?? {};
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);
    return <>
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="neonEffect" className="w-full neColorBlue rounded-none col-span-6">
                    Assign Merc
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="flex justify-center">Assign Merc to Contract</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                    <h3 className="text-xl font-bold pb-4">{contract.display} - {contract.roleDisplay}</h3>
                    {Object.entries(mercs).map(([key, merc]) => {
                        if (merc.mercSlot?.type) return null;
                        return (
                            <MercCard 
                                key={key} 
                                merc={merc} 
                                isHired={true}
                                childrenContent={<>
                                    <span className="col-span-2">Completion Chance:</span>
                                    <span className={`neonEffect neText neTextGlow ${merc?.key ? "neColorGreen" : "neColorRed"}`}>
                                        {merc?.key ? getContractSuccessChanceDisplay(contract, merc) : "Unknown"}
                                    </span>
                                </>}
                            >
                                <Button 
                                    variant="neonEffect" 
                                    className="w-full neColorBlue rounded-none" 
                                    onClick={() => pushToSaveQueue({ 
                                        mutationKey: "assignMercMutation",
                                        props: { assignType:"contract", mercKey: merc.key, contractKey: contract.key }
                                    })}
                                    disabled={isGameSaving}
                                >
                                    Assign
                                </Button>
                            </MercCard>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
        <ToolTipCapsule 
            content="Warning! This will cancel the contract. You will not be able to sign it again and lose reputation."
            className="max-w-56"
            options={{ childrenAs: "trigger" }}
        >
            <div>
                <Button 
                    variant="neonEffect" 
                    className="w-full neColorRed rounded-none" 
                    onClick={()=>pushToSaveQueue({ mutationKey: "cancelContractMutation", props: { contractKey: contract.key } })} 
                    disabled={isGameSaving}
                >
                    <BanIcon/>
                </Button>
            </div>
        </ToolTipCapsule>
    </>
}



//______________________________________________________________________________________
// ===== Component =====

export default function ContractSignedFooter({ contract }: Readonly<{ contract: Contract; }>) {

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


    //______________________________________________________________________________________
    // ===== Use Effect =====


    //______________________________________________________________________________________
    // ===== Functions =====

    const onClick = () => {
        console.log({ trace: "onClick", contract });
        // pushToSaveQueue({ mutationKey: "signContractMutation", props: { contractKey: contract.key } });
    }


    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <div className="w-full grid grid-cols-7">
            {contract.mercSlots?.main 
                ? <ContractMercAssignedFooter contract={contract} />
                : <ContractNoMercFooter contract={contract} />
            }
        </div>
    )
}