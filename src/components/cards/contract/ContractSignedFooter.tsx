"use client"

// Types ----------------------------------------------------------------------------
import type { Contract } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { Popover, PopoverTrigger, PopoverContentNoPortal } from "@/components/shadcn/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/ui/sheet";
import { Button } from "@/components/shadcn/ui/button";
import MercCard from "../MercCard";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { getContractJobShareDisplay, getContractSuccessChanceDisplay } from "@/utils/contracts";



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
        <Button 
            variant="neonEffect" 
            className="w-full neColorGreen rounded-none col-span-3" 
            onClick={()=>pushToSaveQueue({ mutationKey: "updateContractStageMutation", props: { contractKey: contract.key, stage: "inProgress" } })}
            disabled={isGameSaving}
        >
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
            <SheetContent side="right" className="h-dvh overflow-auto">
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
                                options={{ isHired: true }}
                                childrenContent={<>
                                    <span className="col-span-2">Merc Rewarded:</span>
                                    <span className={`neonEffect neText neTextGlow ${merc?.key ? "neColorYellow" : "neColorRed"}`}>
                                        {merc?.key ? getContractJobShareDisplay((saveFile?.resources?.xp ?? 0), merc) : "Unknown"}
                                    </span>
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
    </>
}



//______________________________________________________________________________________
// ===== Component =====

export default function ContractSignedFooter({ contract }: Readonly<{ contract: Contract; }>) {

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <div className="w-full grid grid-cols-6">
            {contract.mercSlots?.main 
                ? <ContractMercAssignedFooter contract={contract} />
                : <ContractNoMercFooter contract={contract} />
            }
        </div>
    )
}