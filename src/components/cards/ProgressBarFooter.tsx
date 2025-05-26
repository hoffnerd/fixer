"use client"

// Types ----------------------------------------------------------------------------
import type { Business, Contract } from "@/types";
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

export default function ProgressBarFooter({
    className,
    classNameIndicator,
    contract,
    business,
}: Readonly<{
    className?: string;
    classNameIndicator?: string;
    contract?: Contract;
    business?: Business;
}>) {

    //______________________________________________________________________________________
    // ===== Stores =====
    const contractTimes = useGameStore((state) => state.contractTimes);
    const contractTime = contract?.key ? contractTimes[contract.key] : null;

    const businessTimes = useGameStore((state) => state.businessTimes);
    const businessTime = business?.key ? businessTimes[business.key] : null;

    const timeLeft = contractTime?.timeLeft ?? businessTime?.timeLeft ?? 0;
    const time = contractTime?.time ?? businessTime?.time ?? 1;

    //______________________________________________________________________________________
    // ===== Component Return =====
    if(contract?.key && (!contractTime)) return <></>;
    if(business?.key && (!businessTime)) return <></>;
    return (
        <ProgressCustom 
            value={( Math.abs(( timeLeft / time ) - 1) * 100)}
            className={cn("h-4 rounded-none", className)}
            classNameIndicator={cn("neonEffect neBackground neColorGreen", classNameIndicator)}
        />
    )
}