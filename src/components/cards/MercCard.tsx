

// Types ----------------------------------------------------------------------------
import { type Merc } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { CardContent } from "@/components/shadcn/ui/card";
import CardButton from "@/_legoBlocks/nextjsCommon/components/shadcn/CardButton";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";



//______________________________________________________________________________________
// ===== Component =====

export default function MercCard({ merc }: Readonly<{ merc: Merc }>) {
    const level = xpToLevel(merc?.xp ?? 0, SCALING_CORE_MAGIC_NUMBER);
    return (
        <CardButton
            className="border-2 mt-2 mb-5 neonEffect neBorder neBorderGlow glowIntensityLow neColorBlue"
            classNames={{ cardHeader:"pb-3", cardTitle:"flex justify-between" }}
            onClick={()=>console.log("test")}
            title={<>
                <span>{merc.display}</span>
                <span>Lvl: {level}</span>
            </>}
        >
            <CardContent className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    <p>Active Contract/Job:</p>
                    <p>None</p>
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
