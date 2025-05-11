"use client"

// Types ----------------------------------------------------------------------------
import type { Contract } from "@/types";
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
import { useGameStore } from "@/stores/useGameStore";
// Hooks ----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { ProgressCustom } from "@/components/shadcn/ui/progress";
// Other ----------------------------------------------------------------------------
import { cn } from "@/lib/shadcn";



//______________________________________________________________________________________
// ===== Component =====

export default function ContractProgressBarFooter({
    className,
    classNameIndicator,
    contract,
}: Readonly<{
    className?: string;
    classNameIndicator?: string;
    contract: Contract;
}>) {

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
            className={cn("h-4 rounded-none", className)}
            classNameIndicator={cn("neonEffect neBackground neColorGreen", classNameIndicator)}
        />
    )
}