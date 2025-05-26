"use client"

// Types ----------------------------------------------------------------------------
import type { Business, BusinessMercSlot, BusinessMercSlots, Merc, SaveFile } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { Button } from "@/components/shadcn/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/ui/sheet";
import ToolTipCapsule from "@/_legoBlocks/nextjsCommon/components/shadcn/ToolTipCapsule";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { getContractJobShareDisplay, getContractSuccessChanceDisplay, getHighestRoleLevel } from "@/utils/contracts";
import MercCard from "../MercCard";
import { businessUnassignClick, getBusinessDisplay, getBusinessJobShareDisplay, getBusinessSuccessChanceDisplay } from "@/utils/businesses";
import { Popover, PopoverContent, PopoverContentNoPortal, PopoverTrigger } from "@/components/shadcn/ui/popover";



//______________________________________________________________________________________
// ===== True Constants =====

interface DefaultAssignButtonProps {
    variant: "ghost";
    size: "sm";
    className: string;
}


//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_ASSIGN_BUTTON_PROPS: DefaultAssignButtonProps =  {
    variant: "ghost",
    size: "sm",
    className: "w-full text-start justify-start whitespace-wrap",
}


//______________________________________________________________________________________
// ===== Micro-Components =====

function MercDetails({ saveFile, business, merc }: Readonly<{ saveFile?: SaveFile; business: Business; merc: Merc; }>) {
    return <>
        <span className="col-span-2">Merc's Share:</span>
        <span className={`neonEffect neText neTextGlow ${merc?.key ? "neColorYellow" : "neColorRed"}`}>
            {merc?.key ? getBusinessJobShareDisplay((saveFile?.resources?.xp ?? 0), merc) : "Unknown"}
        </span>
        <span className="col-span-2">Highest Yield Chance:</span>
        <span className={`neonEffect neText neTextGlow ${merc?.key ? "neColorGreen" : "neColorRed"}`}>
            {merc?.key ? getBusinessSuccessChanceDisplay(business, merc) : "Unknown"}
        </span>
    </>
}

function AssignButtonText({ merc }: Readonly<{ merc?: Merc | null; }>) {
    return (
        <span className={`neonEffect neText neTextGlow ${merc?.display ? "neColorBlue" : "neColorRed"}`}>
            {merc?.display ?? "Assign"} 
        </span>
    )
}

function AssignButton({ merc, onClick, disabled=false }: Readonly<{ merc?: Merc | null; onClick?: () => void; disabled?: boolean; }>) {
    let props = { ...DEFAULT_ASSIGN_BUTTON_PROPS, disabled };

    // @ts-ignore
    if(onClick) props.onClick = onClick;

    return (
        <Button {...props}>
            <AssignButtonText merc={merc} />
        </Button>
    )
}
 
function AssignSheet({ saveFile, business, slot }: Readonly<{ saveFile?: SaveFile; business: Business; slot: keyof BusinessMercSlots; }>) {
    const mercs = saveFile?.mercs ?? {};
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);
    return <>
        <Sheet>
            <SheetTrigger asChild>
                <AssignButton />
            </SheetTrigger>
            <SheetContent side="right" className="h-dvh overflow-auto">
                <SheetHeader>
                    <SheetTitle className="flex justify-center">Assign Merc to Business</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                    <h3 className="text-xl font-bold pb-4">{getBusinessDisplay(business)}</h3>
                    {Object.entries(mercs).map(([key, merc]) => {
                        if (merc.mercSlot?.type) return null;
                        return (
                            <MercCard
                                key={key} 
                                merc={merc} 
                                options={{ isHired: true }}
                                childrenContent={<MercDetails saveFile={saveFile} business={business} merc={merc} />}
                            >
                                <Button 
                                    variant="neonEffect" 
                                    className="w-full neColorBlue rounded-none" 
                                    onClick={() => pushToSaveQueue({ 
                                        mutationKey: "assignMercMutation",
                                        props: { 
                                            assignType:"business",
                                            mercKey: merc.key,
                                            businessKey: business.key,
                                            slot,
                                        }
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

function BusinessMercDetails({ saveFile, business, merc }: Readonly<{ saveFile?: SaveFile; business: Business; merc: Merc; }>) {
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button {...DEFAULT_ASSIGN_BUTTON_PROPS}>
                    <AssignButtonText merc={merc} />
                </Button>
            </PopoverTrigger>
            <PopoverContentNoPortal>
                <div className="pb-4 grid grid-cols-3 gap-1 items-center">
                    <span className="col-span-3 items-center text-center neonEffect neText neTextGlow neColorBlue">
                        {merc?.display ?? "Assign"}
                    </span>
                    <MercDetails saveFile={saveFile} business={business} merc={merc} />
                </div>
                <Button 
                    variant="neonEffect" 
                    className="w-full neColorRed"
                    onClick={()=>businessUnassignClick({ pushToSaveQueue, business, merc })}
                    disabled={isGameSaving}
                >
                    Unassign Merc
                </Button>
            </PopoverContentNoPortal>
        </Popover>
    )
}


//______________________________________________________________________________________
// ===== Component =====

export default function BusinessAssignButton({ business, slot, merc }: Readonly<{ business: Business; slot: keyof BusinessMercSlots; merc?: Merc | null; }>) {
    const { saveFile } = useSaveFile();

    return (
        // <ToolTipCapsule
        //     content={merc?.key ? "Click to unassign merc":  "Click to assign merc"}
        //     options={{ childrenAs: "trigger" }}
        // >
            <div className="">
                {!merc?.key
                    ? <AssignSheet saveFile={saveFile} business={business} slot={slot} />
                    : <BusinessMercDetails saveFile={saveFile} business={business} merc={merc} />
                }
            </div>
        // </ToolTipCapsule>
    )
}