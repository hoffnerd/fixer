

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
import { Button } from "@/components/shadcn/ui/button";
import ResourceBadge from "../ResourceBadge";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";



//______________________________________________________________________________________
// ===== Component =====

export default function ContractCard({ contract }: Readonly<{ contract: Contract; }>) {

    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();



    //______________________________________________________________________________________
    // ===== Stores =====
    const pushToSaveQueue = useGameStore((state) => state.pushToSaveQueue);
    const isGameSaving = useGameStore((state) => state.isGameSaving);



    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((contract.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);



    //______________________________________________________________________________________
    // ===== Functions =====

    const onClick = () => {
        console.log({ trace: "onClick", "contract.key":contract.key, isHired: contract.stage });
        if(contract.stage) return;
        
        // pushToSaveQueue({ mutationKey: "hireMercMutation", props: { mercKey: contract.key } });
    }


    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <Card className="py-0 pt-6 mt-2 mb-5 gap-3 border-2 overflow-hidden neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue">
            <CardHeader className="">
                <CardTitle className="flex justify-between">
                    <span>{contract.display}</span>
                    <span>Lvl: {level}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    {contract.stage 
                        ? <>
                            <p>Active Contract/Job:</p>
                            <p>None</p>
                        </>
                        : <>
                            <p>Costs:</p>
                            <ul className="whitespace-nowrap">
                                {Object.entries(contract.initialCost).map(([key, value]) => (
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
                        <li>Corpo: {contract.roleLevels.corpo}</li>
                        <li>Solo: {contract.roleLevels.solo}</li>
                        <li>Tech: {contract.roleLevels.tech}</li>
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="px-0">
                {!contract.stage && (
                    <Button variant="neonEffectWithGlow" className="w-full neColorBlue rounded-none" onClick={onClick} disabled={isGameSaving}>
                        Hire
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
