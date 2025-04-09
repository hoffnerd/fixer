

// Types ----------------------------------------------------------------------------
import type { Merc } from "@/types";
import type { RESOURCES_INFO } from "@/data/_config";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { CardContent } from "@/components/shadcn/ui/card";
import CardButton from "@/_legoBlocks/nextjsCommon/components/shadcn/CardButton";
// Other ----------------------------------------------------------------------------
import { getRandomItemFromArray, getRange, xpToLevel } from "@/utils";
import { handleScaling } from "@/utils/scaling";
import { useSaveFile } from "@/hooks/useSaveFile";
import ResourceBadge from "../ResourceBadge";
import { canHireMerc } from "@/utils/mercs";
import { useGameStore } from "@/stores/useGameStore";
import { toast } from "sonner";



//______________________________________________________________________________________
// ===== Component =====

export default function MercCard({ merc, isHired=false }: Readonly<{ merc: Merc; isHired?: boolean; }>) {

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
        console.log({ trace: "onClick", "merc.key":merc.key, isHired });
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
        <CardButton
            className="border-2 mt-2 mb-5 neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue"
            classNames={{ cardHeader:"pb-3", cardTitle:"flex justify-between" }}
            onClick={onClick}
            title={<>
                <span>{merc.display}</span>
                <span>Lvl: {level}</span>
            </>}
            disabled={isGameSaving && (!isHired) && !canHireMerc({ resources: saveFile?.resources, merc })}
        >
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
            {/* <CardFooter></CardFooter> */}
        </CardButton>
    )
}
