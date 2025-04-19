"use client"

// Types ----------------------------------------------------------------------------
import type { Contract } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
import { SCALING_CORE_MAGIC_NUMBER } from "@/data/_config";
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
import { useSaveFile } from "@/hooks/useSaveFile";
// Components -----------------------------------------------------------------------
import { Progress, ProgressCustom } from "@/components/shadcn/ui/progress";
// Other ----------------------------------------------------------------------------
import { xpToLevel } from "@/utils";
import { getContractJobShareDisplay, getContractSuccessChanceDisplay, getHighestRoleLevel } from "@/utils/contracts";



//______________________________________________________________________________________
// ===== Component =====

export default function ContractProgressBarFooter({ contract }: Readonly<{ contract: Contract; }>) {

    //______________________________________________________________________________________
    // ===== Stores =====
    const contractTimes = useGameStore((state) => state.contractTimes);
    const contractTime = contractTimes[contract.key];

    //______________________________________________________________________________________
    // ===== Component Return =====
    if(!contractTime) return <></>;
    return (
        <ProgressCustom 
            value={( Math.abs(( contractTime.timeLeft / contractTime.time ) - 1) * 100)}
            className="h-4 rounded-none"
            classNameIndicator="neonEffect neBackground neColorGreen"
        />
    )
}