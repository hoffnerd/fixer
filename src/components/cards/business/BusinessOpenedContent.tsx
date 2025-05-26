"use client"

// Types ----------------------------------------------------------------------------
import type { Business, Merc } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { Button } from "@/components/shadcn/ui/button";
import ToolTipCapsule from "@/_legoBlocks/nextjsCommon/components/shadcn/ToolTipCapsule";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { getHighestRoleLevel } from "@/utils/contracts";
import BusinessAssignButton from "./BusinessAssignButton";
import { getBusinessAvgSuccessChanceDisplay, getBusinessDisplay, getBusinessMercs, getBusinessTotalJobShareDisplay } from "@/utils/businesses";



//______________________________________________________________________________________
// ===== Component =====

export default function BusinessOpenedContent({ business }: Readonly<{ business: Business; }>) {

    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((business.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);
    const highestRoleLevel = getHighestRoleLevel(business.roleLevels);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();
    const assignedMercs = getBusinessMercs({ saveFile, business });
    const totalMercShare = getBusinessTotalJobShareDisplay({ saveFile, business, assignedMercs });
    const avgSuccessChance = getBusinessAvgSuccessChanceDisplay({ saveFile, business, assignedMercs });


    //______________________________________________________________________________________
    // ===== Component Return =====
    return <>
        <div className="grid grid-cols-3 items-center">
            <span className="col-span-3 text-center">{getBusinessDisplay(business)}</span>
            {/* <span className="col-span-3">Type of Business:</span>
            <span className={`ml-4 mt-[-8px] col-span-3 neonEffect neText neTextGlow neColorGreen`}>
                {getBusinessDisplay(business)}
            </span> */}

            <span className="col-span-2">Level:</span>
            <span className="pl-3">{highestRoleLevel}</span>
            

            <span className="col-span-2">Manager:</span>
            <BusinessAssignButton business={business} slot="manager" merc={assignedMercs?.manager} />

            <span className="col-span-2">Security:</span>
            <BusinessAssignButton business={business} slot="security" merc={assignedMercs?.security} />

            <span className="col-span-2">Illicit Activity:</span>
            <BusinessAssignButton business={business} slot="illicitActivity" merc={assignedMercs?.illicitActivity} />

            {assignedMercs?.count > 0 && <>
                <span className="col-span-2">Total Merc Share:</span>
                <span className={`pl-3 neonEffect neText neTextGlow ${totalMercShare === "Unknown" ? "neColorRed" : "neColorYellow"}`}>
                    {totalMercShare}
                </span>
            </>}

            {assignedMercs?.count > 0 && <>
                <span className="col-span-2">Avg Highest Yield Chance:</span>
                <span className={`pl-3 neonEffect neText neTextGlow  ${avgSuccessChance === "Unknown" ? "neColorRed" : "neColorGreen"}`}>
                    {avgSuccessChance}
                </span>
            </>}

        </div>
    </>
}