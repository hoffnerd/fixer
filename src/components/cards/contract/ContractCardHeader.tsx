"use client"

// Types ----------------------------------------------------------------------------
import type { Contract } from "@/types";
import type { RESOURCES_INFO } from "@/data/_config";
// Packages -------------------------------------------------------------------------
import { SettingsIcon } from "lucide-react";
// Data -----------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/ui/sheet";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuGroup, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/shadcn/ui/dropdown-menu";
import { Button } from "@/components/shadcn/ui/button";
import ResourceBadge from "../../ResourceBadge";
import ContractTimer from "./ContractTimer";
// Other ----------------------------------------------------------------------------
import { getHighestRoleLevel } from "@/utils/contracts";



//______________________________________________________________________________________
// ===== Micro-Components =====

function DetailsSheet({ children, contract }: Readonly<{ children?: React.ReactNode; contract: Contract; }>) {
    const highestRoleLevel = getHighestRoleLevel(contract);
    return (
        <Sheet>
            {children}
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="flex justify-center">Contract Details</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                    <h3 className="text-xl font-bold pb-4">{contract.display} - {contract.roleDisplay}</h3>
                    <p className="pb-4">Level: {highestRoleLevel}</p>
                    <p className="pb-4">Description: {contract.description}</p>
                    <p>Rewards:</p>
                    <ul className="whitespace-nowrap pb-4">
                        {Object.entries(contract.rewards).map(([key, value]) => (
                            <ResourceBadge 
                                key={key} 
                                resourceKey={key as keyof typeof RESOURCES_INFO} 
                                value={(value ?? 0) as number}
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
    )
}



//______________________________________________________________________________________
// ===== Component =====

export default function ContractCardHeader({ contract }: Readonly<{ contract: Contract; }>) {

    //______________________________________________________________________________________
    // ===== Stores =====
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);
    const sessionTime = useGameStore((state) => state.sessionTime);

    

    //______________________________________________________________________________________
    // ===== On Click Functions =====

    const cancelClick = () => pushToSaveQueue({ mutationKey: "cancelContractMutation", props: { contractKey: contract.key } });

    const unassignClick = () => {
        if(!contract?.mercSlots?.main?.key) return;
        pushToSaveQueue({ 
            mutationKey: "assignMercMutation",
            props: { 
                assignType:"contract", 
                mercKey: contract.mercSlots.main.key, 
                contractKey: contract.key,
                slot: "unassign",
            }
        })
    }



    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <CardHeader className="px-0">
            <CardTitle>
                <div className="flex justify-between border-b border-b-white/10">
                    <div className="w-full flex justify-between">
                        <div className="mx-auto">
                            <div className="p-[10px]">{contract.display} - {contract.roleDisplay}</div>
                        </div>
                        <div className="border-x border-x-white/10">
                            <div className="p-[10px]">
                                <ContractTimer contract={contract} />
                            </div>
                        </div>
                    </div>
                    {contract.stage !== "unsigned" && (
                        <DetailsSheet contract={contract}>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="rounded-none">
                                        <SettingsIcon/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel className="text-center neonEffect neText neTextGlow neColorBlue">
                                        Manage Contract
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <SheetTrigger asChild>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                        </SheetTrigger>
                                        <DropdownMenuItem 
                                            onClick={unassignClick} 
                                            disabled={isGameSaving || (!contract?.mercSlots?.main?.key) || contract.stage !== "signed"}
                                        >
                                            Unassign Merc
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            className="text-primary-foreground neonEffect neBackground neBackgroundHover neColorRed"
                                            onClick={cancelClick} 
                                            disabled={isGameSaving}
                                        >
                                            Cancel Contract
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </DetailsSheet>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-[0.1rem] pb-[0.1rem] bg-white/10">
                    {Object.entries(contract.rewards).map(([key, value]) => {
                        if(key === "xp") return null;
                        return (
                            <div key={key} className="bg-primary-foreground flex justify-center">
                                <ResourceBadge 
                                    className="py-2"
                                    classNames={{ iconComponent: "h-4 w-4" }}
                                    resourceKey={key as keyof typeof RESOURCES_INFO} 
                                    value={(value ?? 0) as number}
                                    options={{ hideTooltip: true, elementType: "div" }}
                                />
                            </div>
                        )
                    })}
                </div>
            </CardTitle>
        </CardHeader>
    )
}