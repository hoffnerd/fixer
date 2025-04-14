

// Types ----------------------------------------------------------------------------
import type { Merc } from "@/types";
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
// ===== True Constants =====

const DEFAULT_OPTIONS = {
    childrenAs: "footer",
}



//______________________________________________________________________________________
// ===== Component =====

export default function MercCard({ 
    children, 
    merc, 
    isHired=false,
    options={}, 
}: Readonly<{ 
    children?: React.ReactNode; 
    merc: Merc; 
    isHired?: boolean;
    options?: { childrenAs?: "footer"; };
}>) {

    //______________________________________________________________________________________
    // ===== Options =====
    const { childrenAs } = { ...DEFAULT_OPTIONS, ...options };
 


    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();



    //______________________________________________________________________________________
    // ===== Stores =====
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);



    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((merc.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);



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
                        ? <>
                            <p>Active Contract/Job:</p>
                            <p>None</p>
                        </>
                        : <>
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
                {childrenAs === "footer" && children}
            </CardFooter>
        </Card>
    )
}
