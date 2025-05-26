"use client"

// Types ----------------------------------------------------------------------------
import type { Business, BusinessMercSlots } from "@/types";
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
import BusinessTimer from "./BusinessTimer";
// Other ----------------------------------------------------------------------------
import { getHighestRoleLevel } from "@/utils/contracts";



//______________________________________________________________________________________
// ===== Micro-Components =====

function DetailsSheet({ children, business }: Readonly<{ children?: React.ReactNode; business: Business; }>) {
    // const highestRoleLevel = getHighestRoleLevel(business.roleLevels, SCALING_BUSINESS_LEVEL);
    return (
        <Sheet>
            {children}
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="flex justify-center">Business Details</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                    {/* <h3 className="text-xl font-bold pb-4">{business.display} - {business.roleDisplay}</h3>
                    <p className="pb-4">Level: {highestRoleLevel}</p>
                    <p className="pb-4">Description: {business.description}</p>
                    <p>Rewards:</p>
                    <ul className="whitespace-nowrap pb-4">
                        {Object.entries(business.rewards).map(([key, value]) => (
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
                    <p className="pb-4">None</p> */}
                </div>
            </SheetContent>
        </Sheet>
    )
}



//______________________________________________________________________________________
// ===== Component =====

export default function BusinessCardHeader({ business }: Readonly<{ business: Business; }>) {

    //______________________________________________________________________________________
    // ===== Stores =====
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);
    const sessionTime = useGameStore((state) => state.sessionTime);

    

    //______________________________________________________________________________________
    // ===== On Click Functions =====

    const cancelClick = () => pushToSaveQueue({ 
        mutationKey: "", 
        props: { businessKey: business.key } 
    });

    const unassignClick = (slot: keyof BusinessMercSlots) => {
        if(!business?.mercSlots?.[slot]?.key) return;
        pushToSaveQueue({ 
            mutationKey: "",
            props: { 
                assignType: "business", 
                mercKey: business.mercSlots[slot].key, 
                businessKey: business.key,
                slot,
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
                            <div className="p-[10px]">{business?.roleDisplay ? `${business.display} - ${business.roleDisplay}` : business.display}</div>
                        </div>
                        <div className="border-x border-x-white/10">
                            <div className="p-[10px]">
                                <BusinessTimer business={business} />
                            </div>
                        </div>
                    </div>
                    {business.stage !== "closed" && (
                        <DetailsSheet business={business}>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="rounded-none">
                                        <SettingsIcon/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel className="text-center neonEffect neText neTextGlow neColorBlue">
                                        Manage Business
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <SheetTrigger asChild>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                        </SheetTrigger>
                                        <DropdownMenuItem 
                                            onClick={() => unassignClick("manager")}
                                            disabled={isGameSaving || (!business?.mercSlots?.manager?.key)}
                                        >
                                            Unassign Manager
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => unassignClick("security")}
                                            disabled={isGameSaving || (!business?.mercSlots?.security?.key)}
                                        >
                                            Unassign Security
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => unassignClick("illicitActivity")}
                                            disabled={isGameSaving || (!business?.mercSlots?.illicitActivity?.key)}
                                        >
                                            Unassign Illicit Activity
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            className="text-primary-foreground neonEffect neBackground neBackgroundHover neColorRed"
                                            onClick={cancelClick} 
                                            disabled={isGameSaving}
                                        >
                                            Sell Business
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </DetailsSheet>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-[0.1rem] pb-[0.1rem] bg-white/10">
                    {Object.entries(business.staticIncome).map(([key, value]) => {
                        if(key === "xp") return null;
                        return (
                            <div key={key} className="bg-primary-foreground flex justify-center">
                                <ResourceBadge 
                                    className="py-2"
                                    classNames={{ iconComponent: "h-4 w-4" }}
                                    resourceKey={key as keyof typeof RESOURCES_INFO} 
                                    value={(value ?? 0) as number}
                                    options={{ hideTooltip: true, elementType: "div", separator: " ≈" }}
                                />
                            </div>
                        )
                    })}
                </div>
            </CardTitle>
        </CardHeader>
    )
}