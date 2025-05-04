

// Types ----------------------------------------------------------------------------
import type { Business, Contract, Merc } from "@/types";
import type { RESOURCES_INFO } from "@/data/_config";
// Packages -------------------------------------------------------------------------
import { toast } from "sonner";
import { SettingsIcon } from "lucide-react";
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
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
import ResourceBadge from "../ResourceBadge";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { canHireMerc } from "@/utils/mercs";



//______________________________________________________________________________________
// ===== Types =====

interface Options {
    childrenAs?: "footer" | "content";
    isHired?: boolean;
    allowManageMerc?: boolean;
}



//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_OPTIONS: Options = {
    childrenAs: "footer",
    isHired: false,
    allowManageMerc: false,
}



//______________________________________________________________________________________
// ===== Micro-Components - Footer =====

function MercCardHiredFooter({ 
    children,
    childrenFooter,
    merc, 
    options={}, 
}: Readonly<{ 
    children?: React.ReactNode; 
    childrenFooter?: React.ReactNode; 
    merc: Merc; 
    options?: Options;
}>){
    const { childrenAs } = { ...DEFAULT_OPTIONS, ...options };
 
    if(childrenAs === "footer" && children) return children;
    if(childrenAs !== "footer" && childrenFooter) return childrenFooter;
    return (
        <div className="w-full grid grid-cols-2">

        </div>
    )
}



//______________________________________________________________________________________
// ===== Micro-Component - Content =====

function MercCardUnhiredContent({ merc }: Readonly<{ merc: Merc; }>) {
    return <>
        <p className="pl-6">Initial Hiring Cost:</p>
        <div className="grid grid-cols-3 gap-[0.1rem] py-[0.1rem] bg-white/10">
            {Object.entries(merc.initialCost).map(([key, value]) => (
                <div key={key} className="bg-primary-foreground flex justify-center">
                    <ResourceBadge 
                        className="py-2 align-middle"
                        resourceKey={key as keyof typeof RESOURCES_INFO} 
                        value={(value ?? 0) as number}
                        options={{ hideTooltip: true, elementType: "div" }}
                    />
                </div>
            ))}
        </div>
    </>
}

function MercCardHiredContent({ 
    children,
    childrenContent,
    merc, 
    options={}, 
}: Readonly<{ 
    children?: React.ReactNode; 
    childrenContent?: React.ReactNode; 
    merc: Merc; 
    options?: Options;
}>) {
    const { childrenAs } = { ...DEFAULT_OPTIONS, ...options };
    const { saveFile } = useSaveFile();
    const contract = (merc?.mercSlot && merc.mercSlot.type === "contract" && merc.mercSlot.contractKey && saveFile?.contracts?.[merc.mercSlot.contractKey]) as Contract | null;
    const business = (merc?.mercSlot && merc.mercSlot.type === "business" && merc.mercSlot.businessKey && saveFile?.businesses?.[merc.mercSlot.businessKey]) as Business | null;
    const jobDisplay = contract?.display 
        ? `${contract.display} - ${contract.roleDisplay}`
        : business?.display ?? null;

    return (
        <div className="px-6">
            <div className="grid grid-cols-3 gap-1">
                <span className="col-span-3">Contract/Job:</span>
                <span className={`ml-4 mt-[-8px] col-span-3 neonEffect neText neTextGlow ${jobDisplay ? "neColorBlue" : "neColorRed"}`}>
                    {jobDisplay ?? "None"}
                </span>

                {(childrenAs === "content" && children) || (childrenAs !== "content" && childrenContent)}
            </div>
        </div>
    )
}



//______________________________________________________________________________________
// ===== Micro-Component - Header =====

export function MercCardHeader({ merc, mercContract, mercBusiness, options={} }: Readonly<{ merc: Merc; mercContract?: Contract; mercBusiness?: Business; options?: Options; }>) {
    const { isHired, allowManageMerc } = { ...DEFAULT_OPTIONS, ...options };
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);
    const unassignClick = () => {
        if(!merc.mercSlot?.type) return;
        pushToSaveQueue({ 
            mutationKey: "assignMercMutation", 
            props: {
                assignType: merc.mercSlot.type, 
                mercKey: merc.key, 
                slot: "unassign",
                contractKey: merc.mercSlot.contractKey,
                businessKey: merc.mercSlot.businessKey,
            } 
        })
    }
    return (
        <CardHeader className="px-0">
            <CardTitle>
                <div className="flex justify-between border-b border-b-white/10">
                    <div className="mx-auto my-[10px]">{merc.display}</div>
                    {isHired && allowManageMerc && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="rounded-none border-l border-l-white/10">
                                    <SettingsIcon/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel className="text-center neonEffect neText neTextGlow neColorBlue">
                                    Manage Merc
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem disabled>
                                        Level Up Merc Roles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        Train
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={unassignClick} disabled={isGameSaving || (!merc.mercSlot?.type) || mercContract?.stage === "inProgress"}>
                                        Unassign from Job
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        Develop Contract
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem disabled>
                                        Fire
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-[0.1rem] pb-[0.1rem] bg-white/10">
                    <div className="bg-primary-foreground">
                        <div className="py-2 text-center">
                            Corpo: {merc.roleLevels.corpo}
                        </div>
                    </div>
                    <div className="bg-primary-foreground">
                        <div className="py-2 text-center">
                            Solo: {merc.roleLevels.solo}
                        </div>
                    </div>
                    <div className="bg-primary-foreground">
                        <div className="py-2 text-center">
                            Tech: {merc.roleLevels.tech}
                        </div>
                    </div>
                </div>
            </CardTitle>
        </CardHeader>
    )
}



//______________________________________________________________________________________
// ===== Component =====

export default function MercCard({ 
    children,
    childrenFooter,
    childrenContent,
    merc, 
    options={}, 
}: Readonly<{ 
    children?: React.ReactNode; 
    childrenFooter?: React.ReactNode; 
    childrenContent?: React.ReactNode; 
    merc: Merc; 
    options?: Options;
}>) {

    //______________________________________________________________________________________
    // ===== Options =====
    const { isHired } = { ...DEFAULT_OPTIONS, ...options };
 


    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((merc.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();



    //______________________________________________________________________________________
    // ===== Constants from SaveFile =====
    const mercContract = (merc?.mercSlot?.type === "contract" && merc.mercSlot.contractKey && saveFile?.contracts?.[merc.mercSlot.contractKey]) as Contract | undefined;
    const mercBusiness = (merc?.mercSlot?.type === "business" && merc.mercSlot.businessKey && saveFile?.businesses?.[merc.mercSlot.businessKey]) as Business | undefined;



    //______________________________________________________________________________________
    // ===== Stores =====
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);



    //______________________________________________________________________________________
    // ===== Functions =====

    const onClick = () => {
        if(isHired) return;
        if(!canHireMerc({ resources: saveFile?.resources, merc })) {
            toast.error("You do not have enough resources to hire this merc!");
            return;
        }
        pushToSaveQueue({ mutationKey: "hireMercMutation", props: { mercKey: merc.key } });
    }



    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Card className="py-0 mt-2 mb-5 gap-3 border-2 overflow-hidden neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue">
            <MercCardHeader merc={merc} mercContract={mercContract} mercBusiness={mercBusiness} options={options} />
            <CardContent className="px-0">
                {isHired 
                    ? <MercCardHiredContent children={children} childrenContent={childrenContent} merc={merc} options={options} />
                    : <MercCardUnhiredContent merc={merc} />
                }
            </CardContent>
            <CardFooter className="px-0">
                {!isHired && (
                    <Button variant="neonEffectWithGlow" className="w-full neColorBlue rounded-none" onClick={onClick} disabled={isGameSaving}>
                        Hire
                    </Button>
                )}
                {isHired && <MercCardHiredFooter children={children} childrenFooter={childrenFooter} merc={merc} options={options} />}
            </CardFooter>
        </Card>
    )
}
