"use client"

// Types ----------------------------------------------------------------------------
import type { Business } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { getHighestRoleLevel } from "@/utils/contracts";



//______________________________________________________________________________________
// ===== Component =====

export default function BusinessOpenedContent({ business }: Readonly<{ business: Business; }>) {

    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((business.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);
    const mercKeyManager = business?.mercSlots?.manager?.key;
    const mercKeySecurity = business?.mercSlots?.security?.key;
    const mercKeyIllicitActivity = business?.mercSlots?.illicitActivity?.key;
    const highestRoleLevel = getHighestRoleLevel(business.roleLevels);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();
    const mercManager = mercKeyManager && saveFile?.mercs?.[mercKeyManager]?.key ? saveFile.mercs[mercKeyManager] : null;
    const mercSecurity = mercKeySecurity && saveFile?.mercs?.[mercKeySecurity]?.key ? saveFile.mercs[mercKeySecurity] : null;;
    const mercIllicitActivity = mercKeyIllicitActivity && saveFile?.mercs?.[mercKeyIllicitActivity]?.key ? saveFile.mercs[mercKeyIllicitActivity] : null;;



    //______________________________________________________________________________________
    // ===== Component Return =====
    return <>
        <div className="grid grid-cols-3 gap-1">

            <span className="col-span-2">Level:</span>
            <span>{highestRoleLevel}</span>
            
            <span className="col-span-3">Type of Business:</span>
            <span className={`ml-4 mt-[-8px] col-span-3 neonEffect neText neTextGlow neColorBlue`}>
                {business?.roleDisplay ? `${business.display} - ${business.roleDisplay}` : business.display}
            </span>

            <span className="col-span-2">Manager:</span>
            <span className={`neonEffect neText neTextGlow ${mercManager?.display ? "neColorBlue" : "neColorRed"}`}>
                {mercManager?.display ?? "None"}
            </span>

            <span className="col-span-2">Security:</span>
            <span className={`neonEffect neText neTextGlow ${mercSecurity?.display ? "neColorBlue" : "neColorRed"}`}>
                {mercSecurity?.display ?? "None"}
            </span>

            <span className="col-span-2">Illicit Activity:</span>
            <span className={`neonEffect neText neTextGlow ${mercIllicitActivity?.display ? "neColorBlue" : "neColorRed"}`}>
                {mercIllicitActivity?.display ?? "None"}
            </span>

        </div>
    </>
}