

// Types ----------------------------------------------------------------------------
import type { Business, Contract, Merc } from "@/types";
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
import { Button } from "@/components/shadcn/ui/button";
import ResourceBadge from "../ResourceBadge";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { canHireMerc } from "@/utils/mercs";


//______________________________________________________________________________________
// ===== Types =====

interface Options {
    childrenAs?: "footer" | "content";
}


//______________________________________________________________________________________
// ===== True Constants =====

const DEFAULT_OPTIONS: Options = {
    childrenAs: "footer",
}



//______________________________________________________________________________________
// ===== Micro-Components =====

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

function MercCardUnhiredContent({ merc }: Readonly<{ merc: Merc; }>) {
    return <>
        <p>Costs:</p>
        <ul className="whitespace-nowrap">
            {Object.entries(merc.initialCost).map(([key, value]) => (
                <ResourceBadge 
                    key={key} 
                    resourceKey={key as keyof typeof RESOURCES_INFO} 
                    value={(value ?? 0) as number}
                    options={{ hideTooltip: true }}
                />
            ))}
        </ul> 
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
        <div className="grid grid-cols-3 gap-1">
            <span className="col-span-3">Contract/Job:</span>
            <span className={`ml-4 mt-[-8px] col-span-3 neonEffect neText neTextGlow ${jobDisplay ? "neColorBlue" : "neColorRed"}`}>
                {jobDisplay ?? "None"}
            </span>

            {(childrenAs === "content" && children) || (childrenAs !== "content" && childrenContent)}
        </div>
    )
}


//______________________________________________________________________________________
// ===== Component =====

export default function MercCard({ 
    children,
    childrenFooter,
    childrenContent,
    merc, 
    isHired=false,
    options={}, 
}: Readonly<{ 
    children?: React.ReactNode; 
    childrenFooter?: React.ReactNode; 
    childrenContent?: React.ReactNode; 
    merc: Merc; 
    isHired?: boolean;
    options?: { childrenAs?: "footer" | "content"; };
}>) {

    //______________________________________________________________________________________
    // ===== Options =====
    const { childrenAs } = { ...DEFAULT_OPTIONS, ...options };
 


    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((merc.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);


    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();



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
        <Card className="py-0 pt-6 mt-2 mb-5 gap-3 border-2 overflow-hidden neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue">
            <CardHeader className="">
                <CardTitle className="flex justify-between">
                    <span>{merc.display}</span>
                    <span>Lvl: {level}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    {isHired 
                        ? <MercCardHiredContent children={children} childrenContent={childrenContent} merc={merc} options={options} />
                        : <MercCardUnhiredContent merc={merc} />
                    }
                </div>
                <div className="flex justify-end">
                    <ul className="whitespace-nowrap">
                        <li>Corpo: {merc.roleLevels.corpo}</li>
                        <li>Solo: {merc.roleLevels.solo}</li>
                        <li>Tech: {merc.roleLevels.tech}</li>
                    </ul>
                </div>
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
