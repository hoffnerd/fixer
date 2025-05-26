"use client"

// Types ----------------------------------------------------------------------------
import type { Contract } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { ReadableTime } from "@/_legoBlocks/nextjsCommon/components/microComponents";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { getContractJobShareDisplay, getContractSuccessChanceDisplay, getHighestRoleLevel } from "@/utils/contracts";



//______________________________________________________________________________________
// ===== Component =====

export default function ContractSignedContent({ contract }: Readonly<{ contract: Contract; }>) {

    //______________________________________________________________________________________
    // ===== Constants =====
    const level = xpToLevel((contract.xp ?? 0), SCALING_CORE_MAGIC_NUMBER);
    const mercKey = contract?.mercSlots?.main?.key;
    const highestRoleLevel = getHighestRoleLevel(contract.roleLevels);



    //______________________________________________________________________________________
    // ===== Hooks =====
    const { saveFile } = useSaveFile();
    const merc = mercKey && saveFile?.mercs?.[mercKey]?.key ? saveFile.mercs[mercKey] : null;



    //______________________________________________________________________________________
    // ===== Component Return =====
    return <>
        <div className="grid grid-cols-3 gap-1">

            <span className="col-span-2">Level:</span>
            <span>{highestRoleLevel}</span>

            {contract.stage !== "inProgress" && <>
                <span className="col-span-2">Completion Time:</span>
                <span><ReadableTime timeInSeconds={contract.time} /></span>
            </>}

            <span className="col-span-2">Assigned Merc:</span>
            <span className={`neonEffect neText neTextGlow ${merc?.display ? "neColorBlue" : "neColorRed"}`}>
                {merc?.display ?? "None"}
            </span>

            {contract.mercSlots?.main?.key && <>
                <span className="col-span-2">Merc Rewarded:</span>
                <span className={`neonEffect neText neTextGlow ${merc?.key ? "neColorYellow" : "neColorRed"}`}>
                    {merc?.key ? getContractJobShareDisplay((saveFile?.resources?.xp ?? 0), merc) : "Unknown"}
                </span>

                <span className="col-span-2">Completion Chance:</span>
                <span className={`neonEffect neText neTextGlow ${merc?.key ? "neColorGreen" : "neColorRed"}`}>
                    {merc?.key ? getContractSuccessChanceDisplay(contract, merc) : "Unknown"}
                </span>
            </>}

        </div>
        {/* <ul className="list-disc ml-1">
            <li>
                <span>Auto-Cancel in: </span>
                <span className="neonEffect neText neTextGlow neColorRed">
                    <ReadableTime timeInSeconds={timeUntilAutoCancel} />
                </span>
            </li>
            <li>Completion in: <ReadableTime timeInSeconds={contract.time} /></li>
            <li>
                <span>Assigned Merc: </span>
                <span className={`neonEffect neText neTextGlow ${merc?.display ? "neColorBlue" : "neColorRed"}`}>
                    {merc?.display ?? "None"}
                </span>
            </li>
        </ul> */}
    </>
}